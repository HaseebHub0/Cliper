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

// Get user profile by username
router.get('/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const supabase = getSupabase(req);

    const { data: user, error } = await supabase
      .from('users')
      .select(`
        id,
        username,
        full_name,
        profile_picture,
        bio,
        is_private,
        followers_count,
        following_count,
        posts_count,
        created_at
      `)
      .eq('username', username)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        profilePicture: user.profile_picture,
        bio: user.bio,
        isPrivate: user.is_private,
        followersCount: user.followers_count,
        followingCount: user.following_count,
        postsCount: user.posts_count,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search users
router.get('/search', authenticateUser, async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const supabase = getSupabase(req);

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const { data: users, error } = await supabase
      .from('users')
      .select(`
        id,
        username,
        full_name,
        profile_picture,
        bio,
        followers_count,
        following_count,
        posts_count
      `)
      .or(`username.ilike.%${q}%,full_name.ilike.%${q}%`)
      .neq('id', req.userId) // Exclude current user
      .order('followers_count', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Search users error:', error);
      return res.status(500).json({ error: 'Failed to search users' });
    }

    res.json({
      users: users.map(user => ({
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        profilePicture: user.profile_picture,
        bio: user.bio,
        followersCount: user.followers_count,
        followingCount: user.following_count,
        postsCount: user.posts_count
      })),
      hasMore: users.length === limit
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get suggested users
router.get('/suggested', authenticateUser, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const supabase = getSupabase(req);

    // Get users that the current user doesn't follow
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        id,
        username,
        full_name,
        profile_picture,
        bio,
        followers_count,
        following_count,
        posts_count
      `)
      .not('id', 'in', 
        supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', req.userId)
      )
      .neq('id', req.userId) // Exclude current user
      .order('followers_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Get suggested users error:', error);
      return res.status(500).json({ error: 'Failed to fetch suggested users' });
    }

    res.json({
      users: users.map(user => ({
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        profilePicture: user.profile_picture,
        bio: user.bio,
        followersCount: user.followers_count,
        followingCount: user.following_count,
        postsCount: user.posts_count
      }))
    });

  } catch (error) {
    console.error('Get suggested users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile picture
router.put('/profile-picture', authenticateUser, async (req, res) => {
  try {
    const { profilePicture } = req.body;
    const userId = req.userId;
    const supabase = getSupabase(req);

    if (!profilePicture) {
      return res.status(400).json({ error: 'Profile picture URL is required' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update({ profile_picture: profilePicture })
      .eq('id', userId)
      .select('profile_picture')
      .single();

    if (error) {
      console.error('Update profile picture error:', error);
      return res.status(500).json({ error: 'Failed to update profile picture' });
    }

    res.json({
      message: 'Profile picture updated successfully',
      profilePicture: user.profile_picture
    });

  } catch (error) {
    console.error('Update profile picture error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user stats
router.get('/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;
    const supabase = getSupabase(req);

    const { data: user, error } = await supabase
      .from('users')
      .select('followers_count, following_count, posts_count')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      stats: {
        followersCount: user.followers_count,
        followingCount: user.following_count,
        postsCount: user.posts_count
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check if username is available
router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const supabase = getSupabase(req);

    const { data: user, error } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    res.json({ available: !user });

  } catch (error) {
    console.error('Check username error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 