# ATS Platform - Docker Deployment

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# Run database migrations
docker-compose exec app npx prisma migrate deploy

# Seed the database (optional)
docker-compose exec app npm run seed

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

The application will be available at `http://localhost:3000`

### Using Docker Only

```bash
# Build the image
docker build -t ats-platform .

# Run with external MySQL
docker run -p 3000:3000 \
  -e DATABASE_URL="mysql://root:root@host.docker.internal:3306/one_app" \
  ats-platform
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="mysql://root:root@db:3306/one_app"
NODE_ENV=production
```

## Database Setup

The docker-compose setup includes:
- MySQL 8.0 database
- Persistent volume for data
- Automatic database creation

## Production Deployment

For production, update the following:

1. **Change database credentials** in `docker-compose.yml`
2. **Set secure passwords** for MySQL
3. **Configure environment variables** properly
4. **Set up SSL/TLS** for secure connections
5. **Configure reverse proxy** (nginx/traefik)

## Troubleshooting

### Prisma Client Issues
```bash
docker-compose exec app npx prisma generate
docker-compose restart app
```

### Database Connection
```bash
# Check database is running
docker-compose ps

# View database logs
docker-compose logs db
```

### Reset Everything
```bash
docker-compose down -v
docker-compose up -d
```
