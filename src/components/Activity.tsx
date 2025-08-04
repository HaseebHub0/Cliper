import React, { useState } from 'react';
import { Heart, MessageCircle, UserPlus, Bell } from 'lucide-react';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: {
    username: string;
    profilePicture: string;
  };
  content: string;
  time: string;
  isRead: boolean;
  postImage?: string;
}

const Activity: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'likes' | 'comments' | 'follows'>('all');

  const notifications: Notification[] = [
    {
      id: '1',
      type: 'like',
      user: {
        username: 'janesmith',
        profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      content: 'liked your post',
      time: '2 minutes ago',
      isRead: false,
      postImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop'
    },
    {
      id: '2',
      type: 'comment',
      user: {
        username: 'mikebrown',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      content: 'commented: "Amazing shot! 😍"',
      time: '5 minutes ago',
      isRead: false,
      postImage: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=100&h=100&fit=crop'
    },
    {
      id: '3',
      type: 'follow',
      user: {
        username: 'sarahwilson',
        profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      content: 'started following you',
      time: '1 hour ago',
      isRead: true
    },
    {
      id: '4',
      type: 'like',
      user: {
        username: 'alexjones',
        profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      content: 'liked your post',
      time: '2 hours ago',
      isRead: true,
      postImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop'
    },
    {
      id: '5',
      type: 'mention',
      user: {
        username: 'emilydavis',
        profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      content: 'mentioned you in a comment',
      time: '3 hours ago',
      isRead: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case 'mention':
        return <Bell className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'likes') return notification.type === 'like';
    if (activeTab === 'comments') return notification.type === 'comment';
    if (activeTab === 'follows') return notification.type === 'follow';
    return false;
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Activity</h1>
        
        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'likes', label: 'Likes' },
            { key: 'comments', label: 'Comments' },
            { key: 'follows', label: 'Follows' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start space-x-3 p-4 rounded-lg transition-colors ${
                notification.isRead ? 'bg-gray-50' : 'bg-purple-50'
              }`}
            >
              {/* User Avatar */}
              <img
                src={notification.user.profilePicture}
                alt={notification.user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              
              {/* Notification Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold text-gray-900">
                        {notification.user.username}
                      </span>{' '}
                      <span className="text-gray-600">{notification.content}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                  
                  {/* Action Icon */}
                  <div className="ml-2">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>
              </div>

              {/* Post Image (if available) */}
              {notification.postImage && (
                <img
                  src={notification.postImage}
                  alt="Post"
                  className="w-12 h-12 rounded object-cover"
                />
              )}
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-8">
            <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No {activeTab === 'all' ? '' : activeTab} notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity; 