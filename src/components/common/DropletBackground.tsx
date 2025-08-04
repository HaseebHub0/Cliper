import React from 'react';

const DropletBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="droplet" />
      ))}
    </div>
  );
};

export default DropletBackground; 