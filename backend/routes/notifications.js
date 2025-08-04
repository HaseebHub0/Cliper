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

// Get user notifications
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const offset = (page - 1) * limit;
    const supabase = getSupabase(req);

    let query = supabase
      .from('notifications')
      .select(`
        *,
        sender:users!notifications_sender_id_fkey(
          id,
          username,
          full_name,
          profile_picture
        )
      `)
      .eq('recipient_id', req.userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    const { data: notifications, error } = await query;

    if (error) {
      console.error('Get notifications error:', error);
      return res.status(500).json({ error: 'Failed to fetch notifications' });
    }

    res.json({
      notifications: notifications.map(notification => ({
        id: notification.id,
        type: notification.type,
        content: notification.content,
        isRead: notification.is_read,
        createdAt: notification.created_at,
        sender: notification.sender,
        postId: notification.post_id,
        commentId: notification.comment_id
      })),
      hasMore: notifications.length === limit
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark notification as read
router.patch('/:id/read', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase(req);

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('recipient_id', req.userId);

    if (error) {
      console.error('Mark notification read error:', error);
      return res.status(500).json({ error: 'Failed to mark notification as read' });
    }

    res.json({ message: 'Notification marked as read' });

  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark all notifications as read
router.patch('/read-all', authenticateUser, async (req, res) => {
  try {
    const supabase = getSupabase(req);

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_id', req.userId)
      .eq('is_read', false);

    if (error) {
      console.error('Mark all notifications read error:', error);
      return res.status(500).json({ error: 'Failed to mark notifications as read' });
    }

    res.json({ message: 'All notifications marked as read' });

  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get unread notification count
router.get('/unread-count', authenticateUser, async (req, res) => {
  try {
    const supabase = getSupabase(req);

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', req.userId)
      .eq('is_read', false);

    if (error) {
      console.error('Get unread count error:', error);
      return res.status(500).json({ error: 'Failed to get unread count' });
    }

    res.json({ unreadCount: count });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete notification
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase(req);

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)
      .eq('recipient_id', req.userId);

    if (error) {
      console.error('Delete notification error:', error);
      return res.status(500).json({ error: 'Failed to delete notification' });
    }

    res.json({ message: 'Notification deleted' });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to create notification (used by other routes)
const createNotification = async (supabase, io, {
  type,
  senderId,
  recipientId,
  content,
  postId = null,
  commentId = null
}) => {
  try {
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert([{
        type,
        sender_id: senderId,
        recipient_id: recipientId,
        content,
        post_id: postId,
        comment_id: commentId,
        is_read: false
      }])
      .select(`
        *,
        sender:users!notifications_sender_id_fkey(
          id,
          username,
          full_name,
          profile_picture
        )
      `)
      .single();

    if (error) {
      console.error('Create notification error:', error);
      return null;
    }

    // Send real-time notification
    const connectedUsers = io.sockets.adapter.rooms.get(`notifications_${recipientId}`);
    if (connectedUsers) {
      io.to(`notifications_${recipientId}`).emit('newNotification', {
        id: notification.id,
        type: notification.type,
        content: notification.content,
        isRead: notification.is_read,
        createdAt: notification.created_at,
        sender: notification.sender,
        postId: notification.post_id,
        commentId: notification.comment_id
      });
    }

    return notification;

  } catch (error) {
    console.error('Create notification error:', error);
    return null;
  }
};

// Export the helper function for use in other routes
module.exports = { router, createNotification }; 