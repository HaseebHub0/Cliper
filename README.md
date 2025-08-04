# Cliper - Modern Social Media Platform

A cutting-edge social media platform built with React, TypeScript, and Tailwind CSS. Cliper features stunning glassmorphism design, micro-interactions, custom animations, and droplet effects for an immersive user experience.

## Features

### 🔐 Authentication
- User registration and login
- Form validation
- Password visibility toggle
- Persistent sessions with localStorage

### 📱 Home Feed
- Stories section with gradient borders
- Post feed with like, comment, and share functionality
- Real-time like counts
- Comment system
- Post timestamps
- Location tags

### 👤 User Profiles
- Profile pictures and bio
- Follower/following counts
- Posts grid with hover effects
- Edit profile functionality
- Saved posts tab (for own profile)

### 🔍 Explore Page
- Search functionality
- Discover new content
- Suggested users to follow
- Explore grid with hover effects

### 🎨 Advanced UI/UX
- Glassmorphism design with backdrop blur effects
- Micro-interactions and smooth animations
- Custom droplet animations and morphing elements
- Gradient text effects and neon glow
- Responsive layout (mobile-first)
- Beautiful typography with custom animations

### 📱 Responsive Design
- Mobile navigation bar
- Desktop sidebar navigation
- Responsive grid layouts
- Touch-friendly interactions

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **date-fns** - Date formatting utilities

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd instagram-clone
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (not recommended)

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components
│   └── ...            # Feature-specific components
├── context/            # React context providers
├── types/              # TypeScript type definitions
├── App.tsx            # Main app component
└── index.tsx          # App entry point
```

## Features in Detail

### Authentication System
- Secure login/register forms
- Input validation and error handling
- Loading states during authentication
- Automatic redirect after successful login

### Post System
- Like/unlike posts with real-time updates
- Add comments to posts
- View post details with timestamps
- Share posts (UI ready for backend integration)

### User Profiles
- View user profiles with stats
- Follow/unfollow functionality
- Posts grid with hover effects
- Profile editing (for own profile)

### Stories
- Story circles with gradient borders
- Story viewing interface
- Story creation (UI ready for backend integration)

### Explore & Discovery
- Search for users and content
- Discover trending posts
- Suggested users to follow
- Explore grid with infinite scroll ready

## Customization

### Colors
The app uses Instagram's color palette defined in `tailwind.config.js`:
- Instagram Blue: `#0095f6`
- Instagram Red: `#ed4956`
- Instagram Gray: `#8e8e93`

### Styling
Custom CSS classes are available in `src/index.css`:
- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.input-field` - Form input styling
- `.instagram-card` - Card container styling

## Future Enhancements

- [ ] Backend API integration
- [ ] Real-time messaging
- [ ] Story creation and viewing
- [ ] Post creation with image upload
- [ ] Direct messaging
- [ ] Push notifications
- [ ] Advanced search filters
- [ ] Dark mode support
- [ ] PWA capabilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational purposes. Instagram is a trademark of Meta Platforms, Inc.

## Acknowledgments

- Unsplash for beautiful stock photos
- Lucide for the icon set
- Tailwind CSS for the styling framework 