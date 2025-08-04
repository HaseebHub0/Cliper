import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Post, Story } from '../types';
import StoryItem from './StoryItem';
import PostCard from './PostCard';

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const [posts] = useState<Post[]>([
    {
      id: '1',
      userId: '2',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
      caption: 'Beautiful sunset at the beach today! 🌅 #sunset #beach #nature',
      likes: ['1', '3', '4'],
      comments: [
        {
          id: '1',
          userId: '3',
          username: 'janesmith',
          text: 'Amazing shot! 😍',
          createdAt: new Date('2024-01-15T10:30:00Z')
        },
        {
          id: '2',
          userId: '4',
          username: 'mikebrown',
          text: 'Where is this?',
          createdAt: new Date('2024-01-15T11:00:00Z')
        }
      ],
      createdAt: new Date('2024-01-15T09:00:00Z'),
      location: 'Maldives'
    },
    {
      id: '2',
      userId: '3',
      imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&h=600&fit=crop',
      caption: 'Coffee and coding ☕️ #coffee #coding #developer',
      likes: ['1', '2', '4'],
      comments: [
        {
          id: '3',
          userId: '1',
          username: 'johndoe',
          text: 'Looks productive!',
          createdAt: new Date('2024-01-15T08:30:00Z')
        }
      ],
      createdAt: new Date('2024-01-15T07:00:00Z')
    },
    {
      id: '3',
      userId: '4',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=600&fit=crop',
      caption: 'Morning hike in the mountains 🏔️ #hiking #nature #adventure',
      likes: ['1', '2', '3'],
      comments: [],
      createdAt: new Date('2024-01-14T06:00:00Z'),
      location: 'Rocky Mountains'
    }
  ]);

  const [stories] = useState<Story[]>([
    {
      id: '1',
      userId: '2',
      username: 'janesmith',
      profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
      createdAt: new Date('2024-01-15T10:00:00Z')
    },
    {
      id: '2',
      userId: '3',
      username: 'mikebrown',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=600&fit=crop',
      createdAt: new Date('2024-01-15T09:30:00Z')
    },
    {
      id: '3',
      userId: '4',
      username: 'sarahwilson',
      profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
      createdAt: new Date('2024-01-15T08:00:00Z')
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Stories */}
      <div className="glass-card p-6 mb-6">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {stories.map((story) => (
            <StoryItem key={story.id} story={story} />
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} currentUser={currentUser!} />
        ))}
      </div>
    </div>
  );
};

export default Home; 