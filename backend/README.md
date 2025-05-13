# Rozgaar Backend API

This is the backend API for the Rozgaar freelance platform.

## Technologies Used

- Node.js
- Express
- MongoDB
- JWT Authentication
- Multer for file uploads

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and add the following environment variables:
   ```
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/rozgaardb
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

3. Make sure MongoDB is running on your system.

4. Start the server:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/add-balance` - Add balance to user account

### Gigs

- `GET /api/gigs` - Get all gigs (with filters)
- `GET /api/gigs/:id` - Get a specific gig
- `POST /api/gigs` - Create a new gig (freelancers only)
- `PUT /api/gigs/:id` - Update a gig
- `DELETE /api/gigs/:id` - Delete a gig
- `GET /api/gigs/freelancer/:freelancerId` - Get all gigs by a freelancer
- `GET /api/gigs/my/gigs` - Get all gigs of the logged-in freelancer

### Orders

- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all orders for the current user
- `GET /api/orders/:id` - Get a specific order
- `PATCH /api/orders/:id/status` - Update order status
- `POST /api/orders/:id/deliver` - Deliver an order
- `POST /api/orders/:id/approve` - Approve delivery
- `POST /api/orders/:id/reject` - Reject delivery
- `POST /api/orders/:id/cancel` - Request cancellation
- `POST /api/orders/:id/approve-cancellation` - Approve cancellation
- `POST /api/orders/:id/reject-cancellation` - Reject cancellation
- `POST /api/orders/:id/review` - Add review to an order
- `GET /api/orders/freelancer/:freelancerId/reviews` - Get all reviews for a freelancer
- `POST /api/orders/:id/messages` - Add a message to an order
- `GET /api/orders/:id/messages` - Get all messages for an order