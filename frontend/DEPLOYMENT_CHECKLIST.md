# Deployment Checklist

## Pre-deployment
- [ ] Test all API endpoints locally
- [ ] Verify MongoDB Atlas connection works
- [ ] Check that all environment variables are properly configured
- [ ] Run `npm run build` to ensure no build errors
- [ ] Test authentication flows
- [ ] Verify file upload functionality

## Vercel Setup
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Run initial deployment: `vercel`
- [ ] Configure environment variables in Vercel dashboard
- [ ] Run production deployment: `vercel --prod`

## Post-deployment
- [ ] Test all functionality on production URL
- [ ] Verify database connections work in production
- [ ] Test authentication flows
- [ ] Check file upload functionality
- [ ] Monitor logs for any errors

## Environment Variables to Add in Vercel Dashboard
```
MONGODB_URI = mongodb+srv://abdullatufail:E86r1DJwgPDQZmCF@cluster0.tfdizox.mongodb.net/rozgaardb
JWT_SECRET = rozgaar_jwt_secret_key_123456789
NEXT_PUBLIC_API_URL = /api
MAX_FILE_SIZE = 5242880
UPLOAD_DIR = ./public/uploads
```

## Domain Configuration
- [ ] Configure custom domain (if needed)
- [ ] Set up SSL certificate (automatic with Vercel)
- [ ] Update CORS settings if needed
