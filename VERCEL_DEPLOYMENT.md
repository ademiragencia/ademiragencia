# Vercel Deployment & Speed Insights Setup

This project is now configured for deployment on Vercel with Speed Insights enabled.

## Project Configuration

The following files have been added/configured for Vercel deployment:

- **vercel.json** - Vercel project configuration for static site hosting
- **.vercelignore** - Files to exclude from deployment
- **Speed Insights scripts** - Added to all 32 HTML pages

## How to Deploy to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. Login to your Vercel account:
   ```bash
   vercel login
   ```

3. Deploy the project:
   ```bash
   vercel
   ```

4. Follow the prompts to link your project

5. For production deployment:
   ```bash
   vercel --prod
   ```

### Option 2: Using Git Integration

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will automatically detect the static site configuration
6. Click "Deploy"

## Enabling Speed Insights

After your first deployment, enable Speed Insights:

1. Go to your Vercel dashboard
2. Select your project
3. Navigate to **Analytics** → **Speed Insights** in the sidebar
4. Click the **Enable** button
5. Deploy your site again (the Speed Insights script will now be active)

The Speed Insights script is already integrated into all HTML pages at:
```html
<script defer src="/_vercel/speed-insights/script.js"></script>
```

Vercel will automatically serve this script once Speed Insights is enabled in your dashboard.

## What Speed Insights Measures

Speed Insights tracks Core Web Vitals for every visitor:

- **TTFB** (Time to First Byte) - Server response time
- **FCP** (First Contentful Paint) - When first content appears
- **LCP** (Largest Contentful Paint) - Main content loading time
- **CLS** (Cumulative Layout Shift) - Visual stability
- **INP** (Interaction to Next Paint) - Responsiveness

## Viewing Speed Insights Data

After enabling and deploying:

1. Visit your site and generate some traffic
2. Go to your Vercel dashboard
3. Navigate to **Analytics** → **Speed Insights**
4. View real-time performance metrics from actual users

## Domain Configuration

The project is configured for the domain: **www.ademiragencia.com.br**

To use this domain with Vercel:
1. In your Vercel project settings, go to **Domains**
2. Add your custom domain
3. Update your DNS records as instructed by Vercel
4. Vercel will automatically provision SSL certificates

## Notes

- Speed Insights is available on all Vercel plans (including free tier)
- Data collection respects user privacy and GDPR compliance
- The existing Google Analytics implementation remains unchanged
- Speed Insights runs independently and doesn't interfere with other analytics
