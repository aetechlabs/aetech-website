# AETech Website - Setup Instructions

## Environment Configuration

### Required Environment Variables

Add these to your `.env.local` file:

```bash
# Database
DATABASE_URL="your_mongodb_connection_string"

# NextAuth
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="https://www.aetechlabs.com"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# ZeptoMail (for email notifications)
ZEPTOMAIL_TOKEN="your_zeptomail_token"
ZEPTOMAIL_FROM_EMAIL="noreply@yourdomain.com"
ADMIN_EMAIL="admin@yourdomain.com"
```

## Setup Instructions

### 1. Cloudinary Setup
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Add them to your `.env.local` file

### 2. ZeptoMail Setup
1. Sign up at [ZeptoMail](https://www.zoho.com/zeptomail/)
2. Create a new mail agent
3. Generate an API token
4. Add the token to your `.env.local` file
5. Configure your sending domain

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Database Migration
```bash
npx prisma generate
npx prisma db push
```

### 5. Start Development Server
```bash
npm run dev
```

## Features Added

### Contact Form Enhancements
- ✅ Phone number field (optional)
- ✅ Country selection field (optional)
- ✅ Email notifications via ZeptoMail
- ✅ Admin notification on new contact
- ✅ User confirmation email

### Image Upload System
- ✅ Cloudinary integration for image storage
- ✅ Drag & drop interface
- ✅ File type and size validation
- ✅ Automatic optimization
- ✅ Secure upload (auth required)

### Email Integration
- ✅ ZeptoMail for transactional emails
- ✅ HTML email templates
- ✅ Error handling and fallbacks
- ✅ Admin notifications

## Usage

### Contact Form
The contact form now includes optional phone and country fields. When submitted:
1. Contact is saved to database
2. Admin receives email notification
3. User receives confirmation email

### Image Uploads
Use the `ImageUpload` component in your admin panels:
```tsx
import ImageUpload from '@/components/ImageUpload';

<ImageUpload
  onImageUploaded={(url) => setImageUrl(url)}
  maxSize={10} // MB
/>
```

### Email Sending
Use the ZeptoMail utilities:
```tsx
import { sendEmail } from '@/lib/zeptomail';

await sendEmail({
  to: 'info@aetechlabs.com',
  subject: 'Welcome!',
  htmlBody: '<h1>Welcome to AETech!</h1>'
});
```

## API Endpoints

### Upload
- `POST /api/upload` - Upload image to Cloudinary
- `DELETE /api/upload?publicId=xxx` - Delete image from Cloudinary

### Contacts
- `GET /api/contacts` - Get all contacts (admin only)
- `POST /api/contacts` - Create new contact (public)
- `PATCH /api/contacts/[id]` - Update contact status (admin only)

## Security Notes

- Image uploads require authentication (ADMIN or AUTHOR role)
- File type and size validation
- Secure environment variable handling
- Email rate limiting recommended for production
