import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { Grid, Bookmark, Heart, Settings, MessageCircle } from 'lucide-react';

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');

  // Mock user data
  const profileUser = {
    id: '1',
    username: 'johndoe',
    fullName: 'John Doe',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Living life one photo at a time 📸\nPhotography enthusiast | Travel lover | Coffee addict',
    followers: ['2', '3', '4'],
    following: ['2', '3'],
    posts: [
      {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
        likes: 42,
        comments: 5
      },
      {
        id: '2',
        imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300&h=300&fit=crop',
        likes: 28,
        comments: 3
      },
      {
        id: '3',
        imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop',
        likes: 65,
        comments: 8
      }
    ]
  };

  const isOwnProfile = currentUser?.username === username;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="glass-card p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <img
              src={profileUser.profilePicture}
              alt={profileUser.username}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-4 mb-4">
              <h1 className="text-2xl font-light text-gray-900">{profileUser.username}</h1>
              {isOwnProfile ? (
                <button className="btn-secondary px-6 py-2">
                  Edit Profile
                </button>
              ) : (
                <button className="btn-primary px-6 py-2">
                  Follow
                </button>
              )}
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Stats */}
            <div className="flex space-x-8 mb-4">
              <div>
                <span className="font-semibold">{profileUser.posts.length}</span> posts
              </div>
              <div>
                <span className="font-semibold">{profileUser.followers.length}</span> followers
              </div>
              <div>
                <span className="font-semibold">{profileUser.following.length}</span> following
              </div>
            </div>

            {/* Bio */}
            <div className="text-sm">
              <p className="font-semibold">{profileUser.fullName}</p>
              <p className="whitespace-pre-line">{profileUser.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-instagram-border">
        <div className="flex">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center space-x-1 px-8 py-4 border-t-2 font-semibold text-sm ${
              activeTab === 'posts'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500'
            }`}
          >
            <Grid className="h-4 w-4" />
            <span>POSTS</span>
          </button>
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center space-x-1 px-8 py-4 border-t-2 font-semibold text-sm ${
                activeTab === 'saved'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500'
              }`}
            >
              <Bookmark className="h-4 w-4" />
              <span>SAVED</span>
            </button>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {profileUser.posts.map((post) => (
          <div key={post.id} className="relative group cursor-pointer">
            <img
              src={post.imageUrl}
              alt="Post"
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <div className="hidden group-hover:flex items-center space-x-6 text-white">
                <div className="flex items-center space-x-1">
                  <Heart className="h-5 w-5 fill-current" />
                  <span className="font-semibold">{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-semibold">{post.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile; 