# Rozgaar Platform - Express to Next.js Integration

This document outlines the successful integration of the Express.js backend into the Next.js frontend for direct Vercel deployment.

## 🚀 Integration Summary

The backend Express.js API has been fully migrated to Next.js API Routes, allowing for a single deployment on Vercel with the following benefits:
- Single codebase deployment
- Better performance with server-side rendering
- Simplified CI/CD pipeline
- Reduced hosting costs

## ✅ Completed Migration

### 1. Database Models (TypeScript)
All Mongoose models have been converted to TypeScript:
- `frontend/lib/models/user.model.ts` - User authentication and roles
- `frontend/lib/models/gig.model.ts` - Freelancer gigs with reviews
- `frontend/lib/models/order.model.ts` - Order management system
- `frontend/lib/models/review.model.ts` - Review system with gig rating updates

### 2. Authentication System
- `frontend/lib/auth-utils.ts` - JWT verification and role-based authorization
- `frontend/lib/db.ts` - MongoDB connection with caching for Next.js
- `frontend/lib/upload-utils.ts` - File upload handling for Next.js

### 3. API Routes Migration
Complete migration of all Express controllers to Next.js API routes:

#### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/balance` - Add balance to user account

#### Gigs Routes
- `GET /api/gigs` - Get all gigs with filters/search
- `POST /api/gigs` - Create new gig (freelancers only)
- `GET /api/gigs/[id]` - Get individual gig
- `PUT /api/gigs/[id]` - Update gig (owner only)
- `DELETE /api/gigs/[id]` - Delete gig (owner only)
- `GET /api/gigs/freelancer/[freelancerId]` - Get gigs by freelancer
- `GET /api/gigs/my` - Get current freelancer's gigs

#### Orders Routes
- `GET /api/orders` - Get all orders (filtered by user role)
- `POST /api/orders` - Create new order (clients only)
- `GET /api/orders/[id]` - Get individual order
- `PATCH /api/orders/[id]/status` - Update order status
- `POST /api/orders/[id]/deliver` - Deliver order with file upload
- `POST /api/orders/[id]/approve` - Approve delivery
- `POST /api/orders/[id]/reject` - Reject delivery
- `POST /api/orders/[id]/cancel` - Request cancellation
- `POST /api/orders/[id]/approve-cancellation` - Approve cancellation
- `POST /api/orders/[id]/reject-cancellation` - Reject cancellation
- `POST /api/orders/[id]/review` - Add review to completed order

#### Reviews Routes
- `GET /api/reviews/freelancer/[freelancerId]` - Get freelancer reviews
- `GET /api/reviews/gig/[gigId]` - Get gig reviews

#### File Upload Route
- `GET /api/uploads/[filename]` - Serve uploaded files

### 4. Frontend Services Updated
All service files updated to use new API endpoints:
- `frontend/services/auth.ts` - Authentication services
- `frontend/services/gigs.ts` - Gig management services
- `frontend/services/orders.ts` - Order management services
- `frontend/services/reviews.ts` - Review services

### 5. Configuration Updates
- `frontend/.env.local` - Environment variables for MongoDB and JWT
- `frontend/lib/api.ts` - API client updated to use Next.js routes
- `frontend/next.config.js` - Image domains and webpack optimization

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone and Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Configuration**
   Update `frontend/.env.local`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/rozgaar
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXT_PUBLIC_API_URL=/api
   MAX_FILE_SIZE=5242880
   UPLOAD_DIR=./public/uploads
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**
   - Connect your GitHub repository to Vercel
   - Select the `frontend` folder as the root directory

2. **Environment Variables**
   Add the following environment variables in Vercel dashboard:
   ```
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-secure-jwt-secret
   NEXT_PUBLIC_API_URL=/api
   MAX_FILE_SIZE=5242880
   UPLOAD_DIR=./public/uploads
   ```

3. **Deploy**
   - Push to main branch for automatic deployment
   - Vercel will automatically build and deploy the application

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
frontend/
├── app/
│   ├── api/                    # Next.js API Routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── gigs/              # Gig management endpoints
│   │   ├── orders/            # Order management endpoints
│   │   ├── reviews/           # Review endpoints
│   │   └── uploads/           # File serving endpoint
│   ├── (auth)/                # Authentication pages
│   ├── (freelancer)/          # Freelancer dashboard
│   ├── gigs/                  # Gig browsing pages
│   ├── orders/                # Order management pages
│   └── ...
├── lib/
│   ├── models/                # MongoDB models (TypeScript)
│   ├── auth-utils.ts          # Authentication utilities
│   ├── db.ts                  # Database connection
│   ├── upload-utils.ts        # File upload utilities
│   └── api.ts                 # API client
├── services/                  # Frontend service layer
├── components/                # React components
├── public/
│   └── uploads/               # File upload storage
└── ...
```

## 🔧 Key Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Client/Freelancer)
- Secure password hashing with bcrypt

### File Upload System
- Secure file upload with validation
- Support for images and documents
- File serving through Next.js API routes

### Order Management
- Complete order lifecycle management
- Status tracking and updates
- Delivery and approval system
- Cancellation request workflow

### Review System
- Client reviews for completed orders
- Automatic gig rating calculation
- Review aggregation for freelancers

### Search & Filtering
- Advanced gig search functionality
- Category-based filtering
- Price range filtering

## 🧪 Testing

Test the API endpoints using the development server:

1. **Authentication Test**
   ```bash
   # Register a new user
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"client"}'
   ```

2. **Gigs Test**
   ```bash
   # Get all gigs
   curl http://localhost:3000/api/gigs
   ```

## 🔒 Security Considerations

- JWT tokens for secure authentication
- Role-based authorization on all protected routes
- Input validation and sanitization
- File upload security with type and size restrictions
- MongoDB injection protection through Mongoose

## 📝 Migration Notes

### Removed Express Dependencies
The following Express-specific code has been removed:
- Express server setup (`backend/src/index.js`)
- Express middleware (`backend/src/middleware/`)
- Express route handlers (`backend/src/routes/`)

### Converted to Next.js
- All Express controllers converted to Next.js API route handlers
- Middleware converted to utility functions
- File upload system adapted for Next.js FormData handling

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📞 Support

For questions or issues regarding the integration:
1. Check the console logs for detailed error messages
2. Verify environment variables are set correctly
3. Ensure MongoDB connection is working
4. Check file permissions for upload directory

---

**Status**: ✅ Integration Complete - Ready for Production Deployment
