import React from 'react';
import { Story } from '../types';

interface StoryItemProps {
  story: Story;
}

const StoryItem: React.FC<StoryItemProps> = ({ story }) => {
  return (
    <div className="flex flex-col items-center space-y-1 cursor-pointer">
      <div className="relative">
        <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 to-pink-600">
          <img
            src={story.profilePicture}
            alt={story.username}
            className="w-full h-full rounded-full object-cover border-2 border-white"
          />
        </div>
      </div>
      <span className="text-xs text-gray-600 truncate max-w-16">{story.username}</span>
    </div>
  );
};

export default StoryItem; 