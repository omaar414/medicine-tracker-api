# Medicine Tracker API

A production-ready NestJS backend for a medication reminder web app that deploys on Render with managed PostgreSQL and Upstash Redis.

## Features

-  **Authentication**: JWT-based auth with bcrypt password hashing
-  **Medicine Management**: CRUD operations for medications
-  **Schedule Management**: Flexible dosing schedules with time and day constraints
-  **Inventory Tracking**: Pill counting and refill management
-  **Dose Tracking**: Confirm/skip doses with automatic inventory updates
-  **Smart Notifications**: Email reminders via Zapier webhook
-  **Background Jobs**: BullMQ-powered reminder engine
-  **Health Monitoring**: Database and Redis health checks
-  **API Documentation**: Swagger/OpenAPI integration
-  **Security**: Input validation, error handling, and logging

## Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Jobs**: Redis with BullMQ
- **Authentication**: JWT + bcrypt
- **Documentation**: Swagger/OpenAPI
- **Logging**: Pino
- **Deployment**: Render (Web Service + Managed PostgreSQL)
- **Redis**: Upstash (managed)

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Redis instance
- Zapier webhook URL (optional)

### Local Development

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd medicine-tracker-api
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Set up database**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. **Start development server**
   ```bash
   npm run start:dev
   ```

5. **Access API documentation**
   ```
   http://localhost:3000/docs
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

### User Profile
- `GET /api/me` - Get current user profile
- `PUT /api/me` - Update user profile

### Medicines
- `GET /api/medicines` - Get all medicines
- `POST /api/medicines` - Create new medicine
- `GET /api/medicines/:id` - Get specific medicine
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine

### Schedules
- `GET /api/medicines/:id/schedules` - Get medicine schedules
- `POST /api/medicines/:id/schedules` - Create schedule
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule

### Inventory
- `GET /api/medicines/:id/inventory` - Get medicine inventory
- `PUT /api/medicines/:id/inventory` - Update inventory

### Doses
- `GET /api/doses/medicines/:id/next-doses` - Get upcoming doses
- `POST /api/doses/confirm` - Confirm dose taken
- `POST /api/doses/skip` - Skip dose

### Health
- `GET /api/health` - Health check

## Deployment on Render

### 1. Create Render Account
Sign up at [render.com](https://render.com)

### 2. Create PostgreSQL Database
1. Go to Dashboard → New → PostgreSQL
2. Choose your plan (Free tier available)
3. Note the connection details

### 3. Set up Upstash Redis
1. Go to [upstash.com](https://upstash.com)
2. Create a new Redis database
3. Note the connection URL

### 4. Deploy Web Service
1. Connect your GitHub repository
2. Create new Web Service
3. Configure build settings:
   - **Build Command**: `npm install && npm run build && npx prisma migrate deploy`
   - **Start Command**: `npm run start:prod`

### 5. Environment Variables
Set these environment variables in Render:

```bash
# App
PORT=3000
DEFAULT_TIMEZONE=America/Puerto_Rico

# Database (from Render PostgreSQL)
DATABASE_URL=postgres://USER:PASS@HOST:5432/DB

# Redis (from Upstash)
REDIS_URL=rediss://:PASSWORD@HOST:PORT

# Security (generate secure secrets)
JWT_ACCESS_SECRET=your-secure-access-secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_SECRET=your-secure-refresh-secret
JWT_REFRESH_EXPIRES=7d
BCRYPT_SALT_ROUNDS=10

# Zapier (optional)
ZAPIER_HOOK_URL=https://hooks.zapier.com/hooks/catch/xxx/yyy

# Logging
LOG_LEVEL=info
```

### 6. Health Checks
Render will automatically use the `/api/health` endpoint for health checks.

## Background Jobs

The application uses BullMQ with Redis for background processing:

### Reminder Jobs
- **Queue**: `reminders`
- **Trigger**: When doses are scheduled
- **Action**: Send email reminders via Zapier

### Low Stock Alerts
- **Queue**: `low-stock`
- **Trigger**: When inventory falls below threshold
- **Action**: Send low stock notification

### Last Refill Alerts
- **Queue**: `last-refill`
- **Trigger**: When on last refill
- **Action**: Send doctor appointment reminder

## Zapier Integration

### Setup
1. Create a Zapier account
2. Create a new Zap with webhook trigger
3. Configure email action (Gmail, Outlook, etc.)
4. Copy the webhook URL to `ZAPIER_HOOK_URL`

### Email Templates
The API sends structured JSON to Zapier:
```json
{
  "to": "user@example.com",
  "subject": "Medication Reminder: Aspirin",
  "html": "<html>...</html>"
}
```

## Database Schema

### Core Tables
- **users**: User profiles and preferences
- **medicines**: Medication information
- **schedules**: Dosing schedules
- **dose_logs**: Dose tracking history
- **inventory**: Pill counting and refills

### Key Relationships
- Users have many medicines
- Medicines have many schedules
- Medicines have one inventory
- Medicines have many dose logs

## Security Features

- **Password Hashing**: bcrypt with configurable salt rounds
- **JWT Tokens**: Access and refresh token rotation
- **Input Validation**: Class-validator with whitelist
- **Error Handling**: Global exception filter
- **Logging**: Structured logging with Pino
- **CORS**: Configurable cross-origin requests

## Monitoring

### Health Checks
- Database connectivity
- Redis connectivity
- Overall service status

### Logging
- Request/response logging
- Error tracking
- Performance metrics

## Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start:prod   # Start production server
npm run test         # Run tests
npm run lint         # Lint code
npm run format       # Format code
```

### Database
```bash
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
