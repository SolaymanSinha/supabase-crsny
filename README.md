# CRSNY E-Commerce Platform

A modern, full-stack e-commerce application built with Next.js 15, PayloadCMS 3.0, and React 19. This platform features a comprehensive admin panel, custom product variants, Stripe payment integration, and file uploads. 

## 🚀 Features

### Frontend
- **Modern Stack**: Next.js 15 with App Router and React 19
- **Responsive Design**: Tailwind CSS with Shadcn/ui components
- **State Management**: Jotai for efficient state management
- **Forms**: React Hook Form with Zod validation
- **File Uploads**: React Dropzone with UploadThing integration
- **UI Components**: ShadCN UI
- **Animations**: Embla Carousel and React Fast Marquee

### Backend & CMS
- **Headless CMS**: PayloadCMS 3.0 with PostgreSQL
- **Database**: PostgreSQL with migrations support
- **File Storage**: UploadThing for secure file uploads
- **Rich Text**: Lexical editor for content management
- **GraphQL**: Built-in GraphQL API with playground

### E-Commerce Features
- **Product Management**: Complex product variants and categories
- **Order System**: Complete order management with Stripe integration
- **Payment Processing**: Stripe integration with payment intents
- **File Uploads**: Customer file uploads for custom orders
- **SEO Optimization**: Built-in SEO fields for all products

### Architecture
- **Domain-Driven Design**: Clean architecture with separation of concerns
- **Dependency Injection**: TSyringe for better testability
- **Type Safety**: Full TypeScript implementation
- **Deployment**: Optimized for Vercel

## 📁 Project Structure

```
src/
├── app/
│   ├── (frontend)/          # Public-facing pages
│   │   ├── products/        # Product catalog
│   │   ├── checkout/        # Checkout flow
│   │   ├── cart/           # Shopping cart
│   │   └── api/            # Frontend API routes
│   └── (payload)/          # Admin panel routes
├── collections/            # PayloadCMS collections
│   ├── Product.ts          # Product schema
│   ├── Order.ts           # Order management
│   ├── Categories.ts      # Product categories
│   └── Users.ts           # User management
├── components/
│   ├── ui/                # Shadcn/ui components
│   ├── custom/            # Custom components
│   └── forms/             # Form components
├── lib/
│   ├── utils/             # Utility functions
│   ├── constants/         # App constants
│   └── atoms/             # Jotai state atoms
├── globals/               # PayloadCMS global configurations
├── migrations/            # Database migrations
└── services/              # Business logic services
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18.20.2+ or 20.9.0+
- pnpm 9+
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crsny-new
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your credentials:
   ```env
   DATABASE_URI=your_postgresql_connection_string
   PAYLOAD_SECRET=your_payload_secret
   UPLOADTHING_TOKEN=your_uploadthing_token
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Database Setup**
   ```bash
   pnpm payload migrate
   ```

5. **Start Development Server**
   ```bash
   pnpm dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin
   - GraphQL Playground: http://localhost:3000/api/graphql-playground

### Default Admin Credentials (Development)
- Only works if you are starting with a fresh database
- Email: `admin@admin.com`
- Password: `admin`

## 🏗 Build & Deployment

### Production Build
```bash
pnpm build
```

### Start Production Server
```bash
pnpm start
```

## 📊 Key Collections

### Products
- Complex variant system (size, color, material)
- SEO optimization fields
- Custom upload fields for customer files
- Image galleries with cover images
- Category relationships

### Orders
- Stripe payment integration
- Order status tracking
- Customer file attachments
- Billing and shipping information

### Categories
- Hierarchical category structure
- SEO-friendly URLs
- Product filtering capabilities

## 🔧 Development Scripts

```bash
# Development
pnpm dev                    # Start dev server
pnpm devsafe               # Clean start (removes .next)

# Building
pnpm build                 # Production build
pnpm start                 # Start production server

# PayloadCMS
pnpm payload migrate       # Run database migrations
pnpm generate:types        # Generate TypeScript types
pnpm generate:importmap    # Generate import map

# Code Quality
pnpm lint                  # Run ESLint
```

## 🌟 Features Overview

### Admin Panel
- Intuitive content management interface
- Product variant configuration
- Order management dashboard
- Media library with UploadThing
- User role management

### Customer Experience
- Product browsing with filtering
- Shopping cart functionality
- Secure checkout with Stripe
- File upload for custom orders
- Order confirmation and tracking

### Developer Experience
- Hot reload in development
- TypeScript for type safety
- Modern tooling and build process
- Clean architecture patterns

## 🆘 Support

For questions or issues:
- Check the [PayloadCMS Documentation](https://payloadcms.com/docs)
- Review [Next.js Documentation](https://nextjs.org/docs)
- Join the [PayloadCMS Discord](https://discord.com/invite/payload)
