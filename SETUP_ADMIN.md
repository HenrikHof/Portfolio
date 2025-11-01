# Admin Panel Setup

## Database Setup

First, create the contact_submissions table in your PostgreSQL database:

```sql
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_read ON contact_submissions(read);
```

## Environment Variables

Add these to your `.env.local` file:

```env
# Database (already set)
DATABASE_URL="your-database-url"

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_SECRET_KEY=your-secret-key-here

# For client-side secret key check (optional)
NEXT_PUBLIC_ADMIN_SECRET_KEY=your-secret-key-here
```

## Access the Admin Panel

1. Navigate to: `/management-panel?secretkey=your-secret-key-here`
2. Login with:
   - Username: `admin` (or value from ADMIN_USERNAME)
   - Password: `admin123` (or value from ADMIN_PASSWORD)
   - Secret Code: `9877` (hardcoded)

## Security Features

- ✅ Secret key required in URL parameter
- ✅ No-index meta tags to prevent search engine indexing
- ✅ Robots.txt protection
- ✅ Client-side secret code validation (doesn't query server if wrong)
- ✅ Session-based authentication
- ✅ Protected API routes

## Default Credentials

- **Username**: `jphenrikhof@gmail.com` (hardcoded)
- **Password**: `f8a3b7c2d9e1` (12-character hash, hardcoded)
- **Secret Code**: `9877` (hardcoded)

**Note**: All credentials are hardcoded. Only the secret key for URL access is configurable via environment variable.

