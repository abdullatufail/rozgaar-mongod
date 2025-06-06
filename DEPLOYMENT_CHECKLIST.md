# Deployment Checklist

## ✅ Pre-Deployment Verification

### 1. Environment Setup
- [ ] MongoDB URI configured in `.env.local`
- [ ] JWT_SECRET is secure and set
- [ ] All required environment variables present
- [ ] File upload directory exists (`public/uploads`)

### 2. Code Quality
- [ ] No TypeScript errors
- [ ] All API routes tested
- [ ] Authentication flows working
- [ ] File upload functionality tested
- [ ] Database connections working

### 3. Security
- [ ] JWT secret is strong and unique
- [ ] File upload restrictions in place
- [ ] Authorization checks on all protected routes
- [ ] Input validation implemented

## 🚀 Vercel Deployment Steps

### 1. Repository Setup
- [ ] Code pushed to main branch
- [ ] Repository connected to Vercel
- [ ] Build settings configured

### 2. Environment Variables
Set the following in Vercel dashboard:
- [ ] `MONGODB_URI`
- [ ] `JWT_SECRET`
- [ ] `NEXT_PUBLIC_API_URL=/api`
- [ ] `MAX_FILE_SIZE=5242880`
- [ ] `UPLOAD_DIR=./public/uploads`

### 3. Deployment Configuration
- [ ] Root directory set to `frontend`
- [ ] Build command: `npm run build`
- [ ] Install command: `npm install`
- [ ] Output directory: `.next`

### 4. Post-Deployment Testing
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Gig creation works (freelancer account)
- [ ] Order creation works (client account)
- [ ] File upload works
- [ ] All API endpoints responding

## 🔧 Local Testing Commands

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📝 Environment Variables Template

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rozgaar

# JWT Secret (generate with: openssl rand -hex 32)
JWT_SECRET=your-32-character-hex-string

# API Configuration
NEXT_PUBLIC_API_URL=/api

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./public/uploads
```

## 🐛 Common Issues & Solutions

### MongoDB Connection Issues
- Verify connection string format
- Check network access in MongoDB Atlas
- Ensure IP whitelist includes Vercel's IPs

### File Upload Issues
- Verify upload directory exists
- Check file size limits
- Ensure proper MIME type validation

### Authentication Issues
- Verify JWT secret consistency
- Check token expiration settings
- Ensure secure cookie settings

### Build Errors
- Clear `.next` folder and rebuild
- Check for TypeScript errors
- Verify all imports are correct

## ✅ Final Checklist

- [ ] All backend functionality migrated
- [ ] Frontend services updated
- [ ] API routes tested
- [ ] Environment variables configured
- [ ] Security measures implemented
- [ ] Documentation updated
- [ ] Deployment successful
- [ ] Post-deployment testing complete

---

**Ready for Production!** 🎉
