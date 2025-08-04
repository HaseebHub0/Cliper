const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to get Supabase client
const getSupabase = (req) => req.app.get('supabase');

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Follow a user
router.post('/:userId', authenticateUser, async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const followerId = req.userId;
    const supabase = getSupabase(req);
    const io = req.app.get('io');

    // Check if trying to follow self
    if (followerId === targetUserId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    // Check if target user exists
    const { data: targetUser, error: userError } = await supabase
      .from('users')
      .select('id, username, full_name')
      .eq('id', targetUserId)
      .single();

    if (userError || !targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already following
    const { data: existingFollow, error: followError } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', targetUserId)
      .single();

    if (existingFollow) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    // Create follow relationship
    const { data: follow, error: createError } = await supabase
      .from('follows')
      .insert([{
        follower_id: followerId,
        following_id: targetUserId,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (createError) {
      console.error('Create follow error:', createError);
      return res.status(500).json({ error: 'Failed to follow user' });
    }

    // Update follower counts
    await supabase
      .from('users')
      .update({ 
        followers_count: supabase.rpc('increment', { row_id: targetUserId, column_name: 'followers_count' })
      })
      .eq('id', targetUserId);

    await supabase
      .from('users')
      .update({ 
        following_count: supabase.rpc('increment', { row_id: followerId, column_name: 'following_count' })
      })
      .eq('id', followerId);

    // Create notification
    const { createNotification } = require('./notifications');
    await createNotification(supabase, io, {
      type: 'follow',
      senderId: followerId,
      recipientId: targetUserId,
      content: 'started following you'
    });

    res.json({
      message: 'Successfully followed user',
      follow: {
        id: follow.id,
        followerId: follow.follower_id,
        followingId: follow.following_id,
        createdAt: follow.created_at
      }
    });

  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unfollow a user
router.delete('/:userId', authenticateUser, async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const followerId = req.userId;
    const supabase = getSupabase(req);

    // Check if trying to unfollow self
    if (followerId === targetUserId) {
      return res.status(400).json({ error: 'Cannot unfollow yourself' });
    }

    // Check if following relationship exists
    const { data: existingFollow, error: followError } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', targetUserId)
      .single();

    if (!existingFollow) {
      return res.status(400).json({ error: 'Not following this user' });
    }

    // Delete follow relationship
    const { error: deleteError } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', targetUserId);

    if (deleteError) {
      console.error('Delete follow error:', deleteError);
      return res.status(500).json({ error: 'Failed to unfollow user' });
    }

    // Update follower counts
    await supabase
      .from('users')
      .update({ 
        followers_count: supabase.rpc('decrement', { row_id: targetUserId, column_name: 'followers_count' })
      })
      .eq('id', targetUserId);

    await supabase
      .from('users')
      .update({ 
        following_count: supabase.rpc('decrement', { row_id: followerId, column_name: 'following_count' })
      })
      .eq('id', followerId);

    res.json({ message: 'Successfully unfollowed user' });

  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check if following a user
router.get('/:userId/status', authenticateUser, async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const followerId = req.userId;
    const supabase = getSupabase(req);

    const { data: follow, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', targetUserId)
      .single();

    res.json({ isFollowing: !!follow });

  } catch (error) {
    console.error('Check follow status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's followers
router.get('/:userId/followers', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const supabase = getSupabase(req);

    const { data: followers, error } = await supabase
      .from('follows')
      .select(`
        follower:users!follows_follower_id_fkey(
          id,
          username,
          full_name,
          profile_picture,
          bio
        )
      `)
      .eq('following_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Get followers error:', error);
      return res.status(500).json({ error: 'Failed to fetch followers' });
    }

    res.json({
      followers: followers.map(follow => follow.follower),
      hasMore: followers.length === limit
    });

  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's following
router.get('/:userId/following', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const supabase = getSupabase(req);

    const { data: following, error } = await supabase
      .from('follows')
      .select(`
        following:users!follows_following_id_fkey(
          id,
          username,
          full_name,
          profile_picture,
          bio
        )
      `)
      .eq('follower_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Get following error:', error);
      return res.status(500).json({ error: 'Failed to fetch following' });
    }

    res.json({
      following: following.map(follow => follow.following),
      hasMore: following.length === limit
    });

  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 