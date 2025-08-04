# Cliper Backend API

A comprehensive backend API for the Cliper social media platform built with Express.js, Supabase, and Cloudinary.

## 🚀 Features

- **User Authentication** - Registration, login, and profile management
- **Real-time Notifications** - Socket.io for instant notifications
- **Image Upload** - Cloudinary integration for post images
- **Social Features** - Follow/unfollow, like/unlike, comments
- **Database** - Supabase PostgreSQL with Row Level Security
- **API Security** - JWT authentication, rate limiting, CORS

## 📋 Prerequisites

- Node.js (v16 or higher)
- Supabase account and project
- Cloudinary account
- npm or yarn

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Go to SQL Editor and run the schema from `supabase-schema.sql`
3. Copy your project URL and anon key to `.env`

### 4. Cloudinary Setup

1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret
3. Add them to your `.env` file

### 5. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Users
- `GET /api/users/profile/:username` - Get user profile
- `GET /api/users/search` - Search users
- `GET /api/users/suggested` - Get suggested users
- `PUT /api/users/profile-picture` - Update profile picture

### Posts
- `POST /api/posts` - Create new post (with image upload)
- `GET /api/posts/feed` - Get user feed
- `POST /api/posts/:postId/like` - Like/unlike post
- `POST /api/posts/:postId/comments` - Comment on post
- `GET /api/posts/:postId/comments` - Get post comments
- `GET /api/posts/user/:userId` - Get user's posts

### Follows
- `POST /api/follows/:userId` - Follow user
- `DELETE /api/follows/:userId` - Unfollow user
- `GET /api/follows/:userId/status` - Check follow status
- `GET /api/follows/:userId/followers` - Get user's followers
- `GET /api/follows/:userId/following` - Get user's following

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/read-all` - Mark all notifications as read
- `GET /api/notifications/unread-count` - Get unread count
- `DELETE /api/notifications/:id` - Delete notification

## 🔌 Real-time Features

The API includes Socket.io for real-time features:

- **Real-time Notifications** - Instant notifications for likes, comments, follows
- **Typing Indicators** - For direct messaging
- **Online Status** - Track user online/offline status

### Socket Events

**Client to Server:**
- `authenticate` - Authenticate user with Socket.io
- `joinNotifications` - Join notification room
- `leaveNotifications` - Leave notification room
- `typing` - Send typing indicator

**Server to Client:**
- `newNotification` - New notification received
- `userTyping` - User typing indicator

## 🗄️ Database Schema

### Tables
- `users` - User profiles and authentication
- `posts` - User posts with images and captions
- `follows` - Follow relationships
- `likes` - Post likes
- `comments` - Post comments
- `notifications` - User notifications
- `messages` - Direct messages
- `stories` - 24-hour stories

### Key Features
- **Row Level Security (RLS)** - Database-level security
- **Automatic Counters** - Triggers for follower/like counts
- **Indexes** - Optimized queries
- **Cascade Deletes** - Clean data relationships

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - Prevent abuse
- **CORS Protection** - Cross-origin security
- **Input Validation** - Express-validator
- **Helmet** - Security headers
- **Password Hashing** - bcryptjs

## 📦 Dependencies

### Core
- `express` - Web framework
- `@supabase/supabase-js` - Supabase client
- `cloudinary` - Image upload service
- `socket.io` - Real-time communication

### Authentication & Security
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens
- `express-validator` - Input validation
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting

### File Upload
- `multer` - File upload middleware

### Utilities
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `moment` - Date handling

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
```

### Recommended Hosting
- **Vercel** - Easy deployment with environment variables
- **Railway** - Simple Node.js hosting
- **Heroku** - Traditional hosting option
- **DigitalOcean** - VPS hosting

## 🔧 Development

### Running Tests
```bash
npm test
```

### API Documentation
The API follows RESTful conventions and returns JSON responses.

### Error Handling
All endpoints include proper error handling with appropriate HTTP status codes.

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support, please open an issue in the repository or contact the development team. 