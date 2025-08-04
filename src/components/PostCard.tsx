import React, { useState } from 'react';
import { Post, User } from '../types';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  currentUser: User;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser }) => {
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser.id));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // In a real app, this would be sent to the backend
      setNewComment('');
    }
  };

  const getPostAuthor = () => {
    // Mock user data - in a real app, this would come from a users map or API
    const users = {
      '2': { username: 'janesmith', fullName: 'Jane Smith', profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
      '3': { username: 'mikebrown', fullName: 'Mike Brown', profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
      '4': { username: 'sarahwilson', fullName: 'Sarah Wilson', profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' }
    };
    return users[post.userId as keyof typeof users] || { username: 'unknown', fullName: 'Unknown User', profilePicture: '' };
  };

  const author = getPostAuthor();

  return (
    <div className="glass-card">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <img
            src={author.profilePicture}
            alt={author.username}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">{author.username}</p>
            {post.location && (
              <p className="text-xs text-gray-500">{post.location}</p>
            )}
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-full">
          <MoreHorizontal className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Post Image */}
      <div className="relative">
        <img
          src={post.imageUrl}
          alt="Post"
          className="w-full h-auto"
        />
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`p-2 hover:scale-110 transition-all duration-300 micro-btn ${
                isLiked ? 'text-red-500' : 'text-gray-600'
              }`}
            >
              <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="p-2 hover:scale-110 transition-all duration-300 micro-btn text-gray-600"
            >
              <MessageCircle className="h-6 w-6" />
            </button>
            <button className="p-2 hover:scale-110 transition-all duration-300 micro-btn text-gray-600">
              <Send className="h-6 w-6" />
            </button>
          </div>
          <button className="p-2 hover:scale-110 transition-all duration-300 micro-btn text-gray-600">
            <Bookmark className="h-6 w-6" />
          </button>
        </div>

        {/* Likes Count */}
        {likesCount > 0 && (
          <p className="text-sm font-semibold text-gray-900 mb-2">
            {likesCount} like{likesCount !== 1 ? 's' : ''}
          </p>
        )}

        {/* Caption */}
        <div className="mb-2">
          <span className="text-sm font-semibold text-gray-900 mr-2">
            {author.username}
          </span>
          <span className="text-sm text-gray-900">{post.caption}</span>
        </div>

        {/* Comments */}
        {post.comments.length > 0 && (
          <div className="mb-2">
            {post.comments.slice(0, 2).map((comment) => (
              <div key={comment.id} className="mb-1">
                <span className="text-sm font-semibold text-gray-900 mr-2">
                  {comment.username}
                </span>
                <span className="text-sm text-gray-900">{comment.text}</span>
              </div>
            ))}
            {post.comments.length > 2 && (
              <button
                onClick={() => setShowComments(!showComments)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                View all {post.comments.length} comments
              </button>
            )}
          </div>
        )}

        {/* Timestamp */}
        <p className="text-xs text-gray-500 mb-3">
          {formatDistanceToNow(post.createdAt, { addSuffix: true })}
        </p>

        {/* Add Comment */}
        <form onSubmit={handleComment} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 text-sm border-none outline-none bg-transparent"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="text-sm font-semibold text-purple-600 hover:text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostCard; 