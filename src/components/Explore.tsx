import React, { useState } from 'react';
import { Search, Heart, MessageCircle } from 'lucide-react';

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock explore data
  const explorePosts = [
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
      likes: 1234,
      comments: 89
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300&h=300&fit=crop',
      likes: 856,
      comments: 45
    },
    {
      id: '3',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop',
      likes: 2341,
      comments: 156
    },
    {
      id: '4',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
      likes: 567,
      comments: 23
    },
    {
      id: '5',
      imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300&h=300&fit=crop',
      likes: 1892,
      comments: 134
    },
    {
      id: '6',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop',
      likes: 743,
      comments: 67
    }
  ];

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Explore Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {explorePosts.map((post) => (
          <div key={post.id} className="relative group cursor-pointer">
            <img
              src={post.imageUrl}
              alt="Explore post"
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

      {/* Suggested Users */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested for you</h3>
        <div className="space-y-4">
          {[
            {
              id: '1',
              username: 'janesmith',
              fullName: 'Jane Smith',
              profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
              isFollowing: false
            },
            {
              id: '2',
              username: 'mikebrown',
              fullName: 'Mike Brown',
              profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
              isFollowing: true
            },
            {
              id: '3',
              username: 'sarahwilson',
              fullName: 'Sarah Wilson',
              profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
              isFollowing: false
            }
          ].map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500">{user.fullName}</p>
                </div>
              </div>
                             <button className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors">
                 {user.isFollowing ? 'Following' : 'Follow'}
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore; 