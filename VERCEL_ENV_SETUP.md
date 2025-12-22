# Quick Setup: Cloudinary Environment Variables in Vercel

## Your Cloudinary Credentials

Based on your Cloudinary dashboard:
- **Cloud Name:** `dh1ok6n0q`
- **API Key:** `699633748744493`
- **API Secret:** `I1PN_xbgzzptuMYK0ZkdOT0603U` ⚠️ (Don't use this for Decap CMS)

---

## Steps to Add in Vercel:

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Click on your portfolio project

### 2. Navigate to Environment Variables
- Click **Settings** (top navigation)
- Click **Environment Variables** (left sidebar)

### 3. Add First Variable
Click **Add New** button:

**Variable Name:** 
```
CLOUDINARY_CLOUD_NAME
```

**Value:**
```
dh1ok6n0q
```

**Environment:** 
- ✅ Production
- ✅ Preview  
- ✅ Development

Click **Save**

### 4. Add Second Variable
Click **Add New** button again:

**Variable Name:**
```
CLOUDINARY_API_KEY
```

**Value:**
```
699633748744493
```

**Environment:**
- ✅ Production
- ✅ Preview
- ✅ Development

Click **Save**

---

## 4. Redeploy Your Site

**Important:** Environment variables only take effect on new deployments!

### Option A: Redeploy Existing Deployment
1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the **⋯** (three dots) menu
4. Click **Redeploy**
5. Wait for deployment to complete

### Option B: Push New Commit (Recommended)
```bash
git add .
git commit -m "Configure Cloudinary environment variables"
git push
```

Vercel will automatically deploy with the new environment variables.

---

## Verify It Works

After redeploying:

1. Go to your site: `https://yourdomain.com/admin`
2. Login to Decap CMS
3. Create/edit a project
4. Click on **Image** or **Cover Image** field
5. You should see Cloudinary uploader (not the error!)

---

## Troubleshooting

**Still seeing "cloud name does not exist" error?**
- ✅ Double-check variable names are EXACTLY: `CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_API_KEY` (case-sensitive)
- ✅ Verify values match: `dh1ok6n0q` and `699633748744493`
- ✅ Make sure you selected all 3 environments (Production, Preview, Development)
- ✅ **Redeploy your site** - this is required!
- ✅ Check Vercel deployment logs for any errors

**Need to test locally?**
The environment variables will work in production/preview. For local dev, you can temporarily check the `/api/admin-config` route to see if it's working.

