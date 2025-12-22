# Cloudinary Integration Setup Guide (Secure)

This guide will help you complete the Cloudinary integration for bulk image uploads in Decap CMS **using environment variables** to keep your credentials secure.

## Step 1: Get Your Cloudinary Credentials

1. **Sign up/Login to Cloudinary:**
   - Go to [https://cloudinary.com/users/register](https://cloudinary.com/users/register)
   - Create a free account (or login if you already have one)

2. **Get Your Credentials:**
   - Once logged in, go to your **Dashboard**
   - You'll see three important values:
     - **Cloud Name** (e.g., `my-portfolio-site`)
     - **API Key** (a long string like `123456789012345`)
     - **API Secret** (you'll need this for backend operations, but NOT for Decap CMS)

3. **Copy these values** - you'll need them in Step 2

---

## Step 2: Set Up Environment Variables in Vercel

**Important:** We use environment variables instead of hardcoding credentials. This keeps your API keys secure and out of version control.

### For Production (Vercel):

1. **Go to your Vercel project dashboard:**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your portfolio project

2. **Navigate to Settings:**
   - Click on your project
   - Go to **Settings** → **Environment Variables**

3. **Add the following environment variables:**
   - **Name:** `CLOUDINARY_CLOUD_NAME`
     - **Value:** Your Cloud Name (e.g., `my-awesome-portfolio`)
     - **Environment:** Production, Preview, and Development
   
   - **Name:** `CLOUDINARY_API_KEY`
     - **Value:** Your API Key (e.g., `987654321098765`)
     - **Environment:** Production, Preview, and Development

4. **Save the variables:**
   - Click **Save** after adding each variable
   - All existing deployments will need to be redeployed

5. **Redeploy your site:**
   - Go to **Deployments** tab
   - Click the **⋯** menu on the latest deployment
   - Click **Redeploy** (or push a new commit)

### How It Works:

- The config file (`public/admin/config.yml`) contains placeholders (`YOUR_CLOUD_NAME_HERE`, `YOUR_API_KEY_HERE`)
- An API route (`/api/admin-config`) reads the config file and injects environment variables at runtime
- Your credentials **never appear** in the committed code
- Each environment (production/preview) can have different credentials if needed

---

## Step 3: Test the Integration

1. **Start your development server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Navigate to Decap CMS Admin:**
   - Go to `http://localhost:3000/admin` (or your dev URL)
   - Login with GitHub

3. **Test Image Upload:**
   - Click on **Projects** → **New Project** (or edit existing)
   - Click on the **Image** or **Cover Image** field
   - You should see a Cloudinary media library interface
   - Click **"Upload files"** or drag & drop multiple images
   - Select an image to use it

4. **Verify:**
   - The image should appear in the field
   - The image URL should point to Cloudinary (format: `https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/...`)

---

## Step 4: Upload Images in Bulk

Now you can upload multiple images at once:

1. **In Decap CMS:**
   - Click any image field (Image or Cover Image)
   - Click **"Upload files"** button in the media library
   - **Select multiple images** (hold Ctrl/Cmd and click multiple files)
   - Or **drag & drop** multiple files at once
   - All images will upload to Cloudinary

2. **Select Images for Use:**
   - Once uploaded, browse your Cloudinary library
   - Click on any image to select it for that field
   - No need to re-upload - just select from previously uploaded images!

---

## Benefits of Cloudinary Integration

✅ **No 10MB file size limit** (much higher limits)  
✅ **Bulk upload support** - drag & drop multiple images  
✅ **Automatic image optimization**  
✅ **CDN delivery** - fast loading worldwide  
✅ **Image transformations** - resize, crop, etc. on-the-fly  
✅ **25GB free storage** (more than enough for portfolios)  
✅ **Reuse images** - select from previously uploaded images  

---

## Troubleshooting

**Problem: Media library doesn't show Cloudinary interface**
- Verify environment variables are set correctly in Vercel
- Make sure variables are named exactly: `CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_API_KEY`
- Redeploy your site after adding environment variables
- Check browser console for errors

**Problem: "Invalid credentials" error**
- Double-check your Cloud Name and API Key in Vercel environment variables
- Make sure there are no extra spaces or quotes in the values
- Ensure you're using API Key (not API Secret)
- Verify credentials in Cloudinary dashboard are correct

**Problem: Environment variables not loading**
- Variable names must be exactly: `CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_API_KEY` (case-sensitive)
- Make sure variables are set for the correct environment (Production, Preview, Development)
- **Redeploy your site** - environment variables only take effect on new deployments
- Check Vercel deployment logs for any errors

**Problem: Images upload but don't display**
- Check browser console for errors
- Verify the image URL format is correct
- Ensure your Cloudinary account is active

**Problem: Still seeing old file upload instead of Cloudinary**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Make sure config.yml changes are saved

---

## Next Steps

Once everything is working:
1. **Upload all your images** to Cloudinary through Decap CMS
2. **Update existing content** to use Cloudinary images
3. **Enjoy faster uploads** and better image management!

---

**Need Help?**
- Cloudinary Docs: https://cloudinary.com/documentation
- Decap CMS Docs: https://decapcms.org/docs/cloudinary/

