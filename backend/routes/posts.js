const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const router = express.Router();

// Middleware to get Supabase and Cloudinary clients
const getSupabase = (req) => req.app.get('supabase');
const getCloudinary = (req) => req.app.get('cloudinary');

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

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Create a new post
router.post('/', authenticateUser, upload.single('image'), async (req, res) => {
  try {
    const { caption, location, hashtags } = req.body;
    const userId = req.userId;
    const supabase = getSupabase(req);
    const cloudinary = getCloudinary(req);

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Upload image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'cliper/posts',
          transformation: [
            { width: 1080, height: 1080, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    // Create post in database
    const { data: post, error } = await supabase
      .from('posts')
      .insert([{
        user_id: userId,
        image_url: uploadResult.secure_url,
        caption: caption || '',
        location: location || '',
        hashtags: hashtags ? hashtags.split(',').map(tag => tag.trim()) : [],
        likes_count: 0,
        comments_count: 0,
        created_at: new Date().toISOString()
      }])
      .select(`
        *,
        user:users!posts_user_id_fkey(
          id,
          username,
          full_name,
          profile_picture
        )
      `)
      .single();

    if (error) {
      console.error('Create post error:', error);
      return res.status(500).json({ error: 'Failed to create post' });
    }

    // Update user's post count
    await supabase
      .from('users')
      .update({ 
        posts_count: supabase.rpc('increment', { row_id: userId, column_name: 'posts_count' })
      })
      .eq('id', userId);

    res.status(201).json({
      message: 'Post created successfully',
      post: {
        id: post.id,
        imageUrl: post.image_url,
        caption: post.caption,
        location: post.location,
        hashtags: post.hashtags,
        likesCount: post.likes_count,
        commentsCount: post.comments_count,
        createdAt: post.created_at,
        user: post.user
      }
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get posts feed
router.get('/feed', authenticateUser, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.userId;
    const supabase = getSupabase(req);

    // Get posts from users that the current user follows
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        user:users!posts_user_id_fkey(
          id,
          username,
          full_name,
          profile_picture
        ),
        likes!inner(user_id)
      `)
      .in('user_id', 
        supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', userId)
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Get feed error:', error);
      return res.status(500).json({ error: 'Failed to fetch feed' });
    }

    res.json({
      posts: posts.map(post => ({
        id: post.id,
        imageUrl: post.image_url,
        caption: post.caption,
        location: post.location,
        hashtags: post.hashtags,
        likesCount: post.likes_count,
        commentsCount: post.comments_count,
        createdAt: post.created_at,
        user: post.user,
        isLiked: post.likes.some(like => like.user_id === userId)
      })),
      hasMore: posts.length === limit
    });

  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Like/unlike a post
router.post('/:postId/like', authenticateUser, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;
    const supabase = getSupabase(req);
    const io = req.app.get('io');

    // Check if post exists
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('user_id, likes_count')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if already liked
    const { data: existingLike, error: likeError } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Unlike
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      await supabase
        .from('posts')
        .update({ likes_count: post.likes_count - 1 })
        .eq('id', postId);

      res.json({ message: 'Post unliked', isLiked: false });
    } else {
      // Like
      await supabase
        .from('likes')
        .insert([{
          post_id: postId,
          user_id: userId,
          created_at: new Date().toISOString()
        }]);

      await supabase
        .from('posts')
        .update({ likes_count: post.likes_count + 1 })
        .eq('id', postId);

      // Create notification if not liking own post
      if (post.user_id !== userId) {
        const { createNotification } = require('./notifications');
        await createNotification(supabase, io, {
          type: 'like',
          senderId: userId,
          recipientId: post.user_id,
          content: 'liked your post',
          postId: postId
        });
      }

      res.json({ message: 'Post liked', isLiked: true });
    }

  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Comment on a post
router.post('/:postId/comments', authenticateUser, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.userId;
    const supabase = getSupabase(req);
    const io = req.app.get('io');

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    // Check if post exists
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('user_id, comments_count')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Create comment
    const { data: comment, error: commentError } = await supabase
      .from('comments')
      .insert([{
        post_id: postId,
        user_id: userId,
        content: content.trim(),
        created_at: new Date().toISOString()
      }])
      .select(`
        *,
        user:users!comments_user_id_fkey(
          id,
          username,
          full_name,
          profile_picture
        )
      `)
      .single();

    if (commentError) {
      console.error('Create comment error:', commentError);
      return res.status(500).json({ error: 'Failed to create comment' });
    }

    // Update post comment count
    await supabase
      .from('posts')
      .update({ comments_count: post.comments_count + 1 })
      .eq('id', postId);

    // Create notification if not commenting on own post
    if (post.user_id !== userId) {
      const { createNotification } = require('./notifications');
      await createNotification(supabase, io, {
        type: 'comment',
        senderId: userId,
        recipientId: post.user_id,
        content: `commented: "${content.trim()}"`,
        postId: postId,
        commentId: comment.id
      });
    }

    res.status(201).json({
      message: 'Comment created successfully',
      comment: {
        id: comment.id,
        content: comment.content,
        createdAt: comment.created_at,
        user: comment.user
      }
    });

  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get post comments
router.get('/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const supabase = getSupabase(req);

    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:users!comments_user_id_fkey(
          id,
          username,
          full_name,
          profile_picture
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Get comments error:', error);
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }

    res.json({
      comments: comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.created_at,
        user: comment.user
      })),
      hasMore: comments.length === limit
    });

  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's posts
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;
    const supabase = getSupabase(req);

    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Get user posts error:', error);
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }

    res.json({
      posts: posts.map(post => ({
        id: post.id,
        imageUrl: post.image_url,
        caption: post.caption,
        likesCount: post.likes_count,
        commentsCount: post.comments_count,
        createdAt: post.created_at
      })),
      hasMore: posts.length === limit
    });

  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 