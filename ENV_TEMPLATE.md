# Environment Variables Template

Copy this file to `.env` and `.env.local` in your Next.js project root and fill in the actual values.

## Database Configuration

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/merchant_app?schema=public"
```

## Firebase Authentication

### Client-side (Public variables - prefix with NEXT_PUBLIC_)

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Server-side (Firebase Admin SDK)

```bash
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

## Redis Configuration

```bash
REDIS_HOST=redis-16655.c330.asia-south1-1.gce.cloud.redislabs.com
REDIS_PORT=16655
REDIS_USERNAME=default
REDIS_PASSWORD=YAm29WtSzGeeFa9z4McFMGYlCuETrxjW

# Alternative: Redis URL format
REDIS_URL=redis://default:YAm29WtSzGeeFa9z4McFMGYlCuETrxjW@redis-16655.c330.asia-south1-1.gce.cloud.redislabs.com:16655
```

## Bluboy Server Callback Configuration

```bash
BLUBOY_SERVER_CALLBACK_URL=https://api.bluboy.com/api/callbacks/reward-claimed
BLUBOY_SERVER_API_KEY=your_bluboy_api_key
```

## Application Configuration

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Session Configuration

```bash
SESSION_SECRET=your_session_secret_key_here_minimum_32_characters
```

## Cache TTL (Time To Live in seconds)

```bash
CACHE_TTL_EVENTS=900          # 15 minutes
CACHE_TTL_REWARDS=300         # 5 minutes
CACHE_TTL_DASHBOARD=600       # 10 minutes
```

## API Rate Limiting

```bash
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000    # 1 minute (in milliseconds)
```

## Logging

```bash
LOG_LEVEL=info                 # Options: debug, info, warn, error
```

## Development vs Production

### Development (.env.local)

```bash
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
LOG_LEVEL=debug
```

### Production (.env.production)

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
LOG_LEVEL=info
```

## Docker Environment Variables

For Docker deployments, create a `.env.docker` file:

```bash
# All the above variables plus:
POSTGRES_USER=merchant_app_user
POSTGRES_PASSWORD=secure_password_here
POSTGRES_DB=merchant_app
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

REDIS_HOST=redis
REDIS_PORT=6379
```

## Notes

1. Never commit `.env` files to version control
2. Add `.env*` to `.gitignore` (except `.env.example` or this template)
3. Use different credentials for each environment
4. Rotate credentials regularly, especially for production
5. Firebase private key should be kept secure and never exposed in client-side code
6. For production, use environment variable management services (e.g., Vercel Environment Variables, AWS Secrets Manager)

