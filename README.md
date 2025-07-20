# NewsDaily - Premium News Portal

## Live Site
[NewsDaily](https://news.rijoan.com)

## About NewsDaily
NewsDaily is a modern news portal that offers both free and premium content to readers. With a clean, responsive design and a powerful admin dashboard, NewsDaily provides an immersive reading experience while giving publishers and content creators the tools they need to share their stories.

## Installation and Setup

### Client-side Setup
```bash
# Clone the repository
git clone https://github.com/mdrijoanmaruf/NewsDaily_Client.git

# Navigate to project directory
cd NewsDaily_Client

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Server Repository
The server code is available at: https://github.com/mdrijoanmaruf/NewsDaily_Server.git

### Server-side Setup
```bash
# Clone the repository
git clone https://github.com/mdrijoanmaruf/NewsDaily_Server.git

# Navigate to project directory
cd NewsDaily_Server

# Install dependencies
npm install

# Create .env file (see Environment Variables section below)
# Create firebaseAdmin.json file with your Firebase Admin SDK credentials

# Run development server with hot reload
npm run dev

# Start production server
npm start
```

### MongoDB Setup
The application uses MongoDB Atlas as its database. You'll need to:
1. Create a MongoDB Atlas account
2. Set up a new cluster
3. Create a database named 'newsDaily'
4. Configure network access to allow connections from your development environment
5. Create a database user with read/write permissions
6. Use the connection credentials in your .env file

### Environment Variables

#### Client-side (.env)
```
VITE_apiKey=your-firebase-api-key
VITE_authDomain=your-firebase-auth-domain
VITE_projectId=your-firebase-project-id
VITE_storageBucket=your-firebase-storage-bucket
VITE_messagingSenderId=your-firebase-messaging-sender-id
VITE_appId=your-firebase-app-id
VITE_STRIPE_PK=your-stripe-publishable-key
VITE_API_URL=your-backend-api-url
```

#### Server-side (.env)
```
PORT=5000
DB_USER=your-mongodb-username
DB_PASS=your-mongodb-password
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

Additionally, you'll need to create a `firebaseAdmin.json` file in the server root directory with your Firebase Admin SDK credentials.

## Backend API Endpoints

### Authentication
- Firebase Authentication with JWT verification

### User Management
- `POST /api/users` - Register new user
- `GET /api/users/:email` - Get user details
- `PUT /api/users/:email` - Update user profile
- `PUT /api/users/:email/role` - Update user role
- `DELETE /api/users/:email` - Delete user

### Subscription
- `GET /api/subscription-status/:email` - Check subscription status
- `POST /api/create-payment-intent` - Create payment intent
- `POST /api/confirm-payment` - Confirm subscription payment

### Articles
- `GET /api/published-articles` - Get all published articles with filters
- `GET /api/premium-articles` - Get premium articles
- `GET /api/my-articles/:email` - Get user's articles
- `POST /api/articles` - Add new article
- `GET /api/articles/:id` - Get article details
- `PUT /api/articles/:id` - Update article
- `PUT /api/articles/:id/view` - Increment article view count
- `PUT /api/articles/:id/approve` - Approve article
- `PUT /api/articles/:id/decline` - Decline article
- `PUT /api/articles/:id/premium` - Mark article as premium
- `DELETE /api/articles/:id` - Delete article

### Publishers
- `GET /api/publishers` - Get all publishers
- `POST /api/publishers` - Add new publisher
- `PUT /api/publishers/:id` - Update publisher
- `DELETE /api/publishers/:id` - Delete publisher

### Statistics
- `GET /api/statistics` - Get platform statistics

## Key Features

- **User Authentication** - Secure login and registration system with email and Google OAuth integration
  
- **Role-based Access Control** - Three distinct user roles (Admin, Publisher, Regular User) with different permissions and capabilities

- **Premium Subscription System** - Tiered subscription plans (1-minute demo, 5-day, and 10-day options) with Stripe payment integration

- **Real-time Subscription Management** - Dynamic subscription status checking and expiration handling

- **Article Management** - Complete CRUD functionality for creating, reading, updating, and deleting articles

- **Publisher Management** - Admin tools to add and manage publishers across the platform

- **Responsive Design** - Mobile-first approach using Tailwind CSS ensuring great user experience across all devices

- **Analytics Dashboard** - Statistical overview of users, articles, views, and premium subscriptions

- **Premium Content Gating** - Special highlighting and restricted access to premium articles

- **Dynamic Article Views** - Real-time view counting and analytics for article performance

- **Animated User Interface** - Smooth animations and transitions using AOS (Animate On Scroll)

- **Subscription Promotion** - Smart modal prompts for non-premium users to upgrade

- **Admin Dashboard** - Comprehensive tools for user management, content moderation, and site analytics

## Technology Stack

### Frontend
- React 19 with Hooks
- React Router 7
- TanStack Query for data fetching and caching
- Tailwind CSS 4 for styling
- Stripe payment integration
- Firebase authentication
- AOS for scroll animations
- SweetAlert2 for notifications
- Swiper for carousels
- React Icons
- Vite 7 as build tool

### Backend
- Node.js with Express 5
- MongoDB for database
- Firebase Admin SDK for authentication verification
- JWT for API security
- Stripe for payment processing
- Serverless deployment support

## Project Structure

### Client-side Architecture
- **src/components/** - Reusable UI components
- **src/Pages/** - Main page components organized by feature
- **src/Contexts/** - Context providers including AuthContext
- **src/Hook/** - Custom React hooks for authentication, API calls, and user roles
- **src/Layout/** - Layout components including Dashboard and Root layouts
- **src/Firebase/** - Firebase configuration and initialization
- **src/Route/** - Routing configuration with protected routes
- **src/Shared/** - Shared components like Navbar, Footer, and Loading indicators
- **src/lib/** - Utility libraries such as Stripe configuration

## User Experience

NewsDaily offers an intuitive user experience designed to engage readers and provide value to subscribers:

- **Seamless Onboarding** - Quick registration and login process
- **Premium Content Indicators** - Visual cues for premium vs free content
- **Subscription Management** - Easy-to-use interface for managing subscriptions
- **Mobile Optimization** - Responsive design for all device sizes
- **Performance** - Fast loading times with optimized data fetching

## Subscription Features

- **Multiple Tiers** - Various subscription options to fit different needs
- **Smart Promotion** - Timed modal that promotes premium subscriptions
- **Secure Payments** - Stripe integration for handling payments
- **Subscription Status** - Real-time checking of subscription validity
- **Auto-Expiration** - Automatic downgrade when subscription expires


