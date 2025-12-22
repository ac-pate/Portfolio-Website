# Decap CMS - Quick Start Guide

## What is Decap CMS?

Decap CMS is a visual editor for your portfolio content. Instead of editing MDX files manually, you can use a web interface to add/edit projects, jobs, and other content.

**Access:** Go to `/admin` on your deployed website.

---

## Setup (One-Time)

### Step 1: Deploy Your Site
- Push your code to GitHub
- Deploy to Vercel or Netlify (connect your GitHub repo)

### Step 2: Enable Git Gateway
**For Vercel:**
- Not needed - works automatically with GitHub

**For Netlify:**
- Go to Site Settings → Identity
- Enable Identity
- Enable Git Gateway
- Save

### Step 3: Access Admin
- Visit `yourdomain.com/admin`
- Click "Login with GitHub"
- Authorize the app

---

## Using Decap CMS

### Adding a New Project

1. Go to `/admin`
2. Click **"Projects"** in the left sidebar
3. Click **"New Project"**
4. Fill in the form:
   - **Title:** Project name
   - **Description:** Short description
   - **Date:** Start date
   - **Tags:** Add tags (press Enter after each)
   - **Image:** Click to upload (or drag & drop)
   - **GitHub:** Link to repository
   - **Body:** Full project description (markdown)
5. Click **"Save"** (top right)
6. Click **"Publish"** (creates commit to GitHub)

### Editing Existing Content

1. Go to `/admin`
2. Click the content type (Projects, Jobs, etc.)
3. Click on the item you want to edit
4. Make changes
5. Click **"Save"** then **"Publish"**

### Uploading Images

- Click the image field
- Drag & drop files OR click to browse
- Images are automatically saved to `public/` folder
- Reference them in content: `/projects/image.jpg`

---

## Content Types

- **Projects:** Your portfolio projects
- **Jobs:** Work experience
- **Education:** Degrees and courses
- **Volunteer:** Volunteer work
- **Extracurricular:** Competitions, workshops, etc.

---

## Tips

- **Save vs Publish:** Save = draft, Publish = commits to GitHub
- **Markdown:** Use markdown in the "Body" field for formatting
- **Images:** Upload to the correct folder (projects/, jobs/, etc.)
- **Tags:** Press Enter after each tag

---

## Troubleshooting

**Can't login?**
- Make sure site is deployed (not just local)
- Check Git Gateway is enabled (Netlify only)

**Changes not showing?**
- Click "Publish" (not just "Save")
- Wait for site to rebuild (1-2 minutes)

**Images not loading?**
- Check image path starts with `/` (e.g., `/projects/image.jpg`)
- Verify image is in correct `public/` folder

---

**That's it!** You can now manage all your content visually without touching code.

