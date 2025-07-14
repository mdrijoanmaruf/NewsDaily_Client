# NewsDaily - Premium News Portal

## Live Site
[NewsDaily](https://news.rijoan.com)

## Admin Access
- **Username:** admin@newsdaily.com
- **Password:** Admin123!

## About NewsDaily
NewsDaily is a modern news portal that offers both free and premium content to readers. With a clean, responsive design and a powerful admin dashboard, NewsDaily provides an immersive reading experience while giving publishers and content creators the tools they need to share their stories.

## Key Features

- **User Authentication** - Secure login and registration system with email and Google OAuth integration
  
- **Role-based Access Control** - Three distinct user roles (Admin, Publisher, Regular User) with different permissions and capabilities

- **Premium Subscription System** - Tiered subscription plans with Stripe payment integration for monetizing premium content

- **Real-time Subscription Timer** - Dynamic countdown showing users their remaining subscription time

- **Article Management** - Complete CRUD functionality for creating, reading, updating, and deleting articles

- **Publisher Management** - Admin tools to add and manage publishers across the platform

- **Responsive Design** - Mobile-first approach ensuring great user experience across all devices

- **Analytics Dashboard** - Statistical overview of users, articles, views, and premium subscriptions

- **Category and Tagging System** - Organized content with powerful filtering capabilities

- **Premium Content Gating** - Special highlighting and restricted access to premium articles

- **Dynamic Article Views** - Real-time view counting and analytics for article performance

- **Admin Dashboard** - Comprehensive tools for user management, content moderation, and site analytics

## Technology Stack

### Frontend
- React 19 with Hooks
- React Router 7
- TanStack Query for data fetching
- Tailwind CSS for styling
- Stripe payment integration
- Firebase authentication

### Backend
- Node.js with Express
- MongoDB for database
- JWT authentication
- Stripe payment processing
- Firebase admin SDK

## Project Structure

### Client-side Architecture
- **src/components/** - Reusable UI components like SubscriptionTimer
- **src/Pages/** - Main page components organized by feature
- **src/Contexts/** - Context providers including AuthContext
- **src/Hook/** - Custom React hooks for authentication and API calls
- **src/Layout/** - Layout components including Dashboard and Root layouts
- **src/Firebase/** - Firebase configuration and initialization
- **src/Route/** - Routing configuration with protected routes
- **src/Shared/** - Shared components like Navbar and Footer
- **src/lib/** - Utility libraries such as Stripe configuration


## User Experience

NewsDaily offers an intuitive user experience designed to engage readers and provide value to subscribers:

- **Seamless Onboarding** - Quick registration and login process
- **Personalized Dashboard** - User-specific content recommendations
- **Clear Premium Indicators** - Visual cues for premium vs free content
- **Subscription Management** - Easy-to-use interface for managing subscriptions
- **Mobile Optimization** - Responsive design for all device sizes
- **Performance** - Fast loading times and optimized content delivery


