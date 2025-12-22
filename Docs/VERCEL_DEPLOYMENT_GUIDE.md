# Vercel Deployment Guide

Complete setup for deploying your portfolio to Vercel with custom domain `achalpatel.xyz`.

---

## Prerequisites

- [ ] **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
- [ ] **GitHub Repository** - Your code pushed to GitHub
- [ ] **Custom Domain** - `achalpatel.xyz` registered at a domain registrar (GoDaddy, Namecheap, etc.)
- [ ] **Domain Registrar Access** - Ability to modify DNS records

---

## Step 1: Connect GitHub to Vercel

### 1.1 Sign In to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in (or create account)
2. Click **"Sign in with GitHub"** for seamless integration

### 1.2 Authorize Vercel with GitHub
1. Vercel will redirect you to GitHub authorization
2. Click **"Authorize Vercel"**
3. Choose which repositories to allow access (can be all or specific repos)

### 1.3 Import Your Portfolio Project
1. In Vercel dashboard, click **"+ New Project"** (or "Add New" → "Project")
2. Under "Import Git Repository", find your portfolio repo
3. Click **"Import"**

---

## Step 2: Configure Build Settings

The `vercel.json` file in your project root defines these settings. **No additional configuration needed** if using defaults below.

### Default Configuration (Already in `vercel.json`)

| Setting | Value | Notes |
|---------|-------|-------|
| **Framework** | Next.js | Auto-detected |
| **Build Command** | `npm run build` | From package.json scripts |
| **Install Command** | `npm install` | Standard npm |
| **Output Directory** | `.next` | Next.js default |
| **Node Version** | 18.x | Compatible with your code |
| **Region** | San Francisco (sfo1) | Optional - choose closest to users |

### Custom Region (Optional)
If you want to deploy to a different region, modify `vercel.json`:

```json
{
  "regions": ["iad1"],  // US East (Virginia)
  "regions": ["lhr1"],  // UK (London)
  "regions": ["syd1"]   // Australia (Sydney)
}
```

---

## Step 3: Environment Variables

### 3.1 Check Current Environment Variables
Currently, the project has **no required environment variables**. However, if you need to add any in the future:

#### Optional Variables
- `NEXT_PUBLIC_SITE_URL` - Your site URL (useful for meta tags, sitemaps)
  - Value: `achalpatel.xyz` (or `https://achalpatel.xyz`)

### 3.2 Add Environment Variables in Vercel Dashboard

If you need to add environment variables:

1. Go to **Project Settings** → **Environment Variables**
2. Click **"Add New"**
3. Enter:
   - **Name:** `NEXT_PUBLIC_SITE_URL`
   - **Value:** `achalpatel.xyz`
   - **Environments:** Select all (Production, Preview, Development)
4. Click **"Save"**

**Note:** Variables starting with `NEXT_PUBLIC_` are exposed to the browser (public). Other variables are server-only.

---

## Step 4: Deploy

### 4.1 Automatic Deployment (Recommended)
Once GitHub is connected, **every push to your default branch (main/master) triggers automatic deployment**:

1. Make changes locally
2. Commit: `git commit -m "Update portfolio"`
3. Push: `git push origin main`
4. Vercel automatically:
   - Detects the push
   - Runs build command (`npm run build`)
   - Deploys to live URL
   - You receive email confirmation

### 4.2 Manual Deployment (Alternative)
1. In Vercel dashboard, click **"Deploy"** button manually
2. Or use Vercel CLI:
   ```bash
   npm install -g vercel
   vercel
   ```

### 4.3 View Deployment Status
1. In Vercel dashboard, go to your project
2. Click **"Deployments"** tab
3. View all past deployments, logs, and rollback options

---

## Step 5: Add Custom Domain `achalpatel.xyz`

### 5.1 Add Domain in Vercel Dashboard
1. Go to your project → **Settings** → **Domains**
2. Click **"Add"** (or **"+ Add Domain"**)
3. Enter: `achalpatel.xyz`
4. Click **"Add"**

Vercel will show:
- **Domain Status:** Pending (DNS not yet configured)
- **Nameserver option** OR **DNS Records option** (see below)

### 5.2 Choose DNS Configuration Method

#### Option A: Update Nameservers (Easier, Recommended)
**Use Vercel's nameservers** instead of your domain registrar's.

**Steps:**
1. In Vercel dashboard, note the **nameservers** (e.g., `ns1.vercel-dns.com`)
2. Go to your domain registrar (GoDaddy, Namecheap, etc.)
3. Find **DNS Settings** or **Nameservers**
4. Replace existing nameservers with Vercel's:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
   - `ns3.vercel-dns.com`
   - `ns4.vercel-dns.com`
5. Save changes
6. Wait **24-48 hours** for DNS propagation
7. Vercel dashboard will auto-update to **Active** when ready

**Pros:** Simple, one-time setup  
**Cons:** All DNS management goes through Vercel

#### Option B: Add DNS Records at Registrar (More Control)
**Keep your domain registrar's nameservers, add specific records manually.**

**Steps:**
1. In Vercel dashboard under Domains, click on your domain
2. Click **"Edit"** → select **"Nameserver"** or **"DNS Records"** option
3. Vercel shows required DNS records:
   ```
   Type: A        | Name: @         | Value: 76.76.19.165
   Type: CNAME    | Name: www       | Value: cname.vercel-dns.com.
   Type: CNAME    | Name: *         | Value: cname.vercel-dns.com.
   ```
4. Go to your domain registrar's DNS settings
5. Add/update these records in the DNS management panel
6. Save changes
7. Wait **24-48 hours** for propagation
8. Once active, Vercel will show **Active** status

**Pros:** Keep full DNS control, faster than nameserver propagation  
**Cons:** More manual steps, must update each record

### 5.3 Verify Domain is Active
1. In Vercel dashboard, refresh the Domains page
2. Status should show **"Active"** (blue checkmark)
3. Test: Visit `https://achalpatel.xyz` in browser
4. Should load your portfolio

### 5.4 Optional: Add www Subdomain
To support both `achalpatel.xyz` and `www.achalpatel.xyz`:

1. In Vercel Domains, add: `www.achalpatel.xyz`
2. Set as **Redirect** to primary domain (recommended)
   - Prevents duplicate content issues

---

## Step 6: SSL/HTTPS Certificate

**Automatic** - Vercel provides free SSL certificates via Let's Encrypt.

- [x] Certificate auto-issued when domain is active
- [x] Auto-renewed before expiration
- [x] Enforced HTTPS (HTTP redirects to HTTPS)
- [x] No action needed

To verify:
1. Visit `https://achalpatel.xyz` (should load with lock icon 🔒)
2. In browser DevTools → Security tab → Certificate shows Vercel SSL

---

## Step 7: Verify Everything Works

### Checklist
- [ ] **Git Integration:** Push to `main` branch triggers deployment
- [ ] **Build Success:** Vercel logs show "✓ Build succeeded"
- [ ] **Live Deployment:** `https://vercel-auto-generated-name.vercel.app` works
- [ ] **Custom Domain:** `https://achalpatel.xyz` resolves
- [ ] **HTTPS:** Certificate active, no security warnings
- [ ] **Auto-Redeploy:** Push a small change (e.g., comment in code), verify new deployment triggers

### Test Deployment
```bash
# Make a small test change
echo "/* Updated: $(date) */" >> app/globals.css

# Commit and push
git add app/globals.css
git commit -m "Test deployment"
git push origin main

# Watch Vercel dashboard for new deployment
```

---

## Troubleshooting

### Domain Not Resolving
**Problem:** `achalpatel.xyz` shows "Server not found"  
**Solution:**
1. DNS may still be propagating (up to 48 hours)
2. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Clear DNS cache:
   - Windows: `ipconfig /flushdns` in PowerShell
   - Mac: `sudo dscacheutil -flushcache` in Terminal
4. Check status at [whatsmydns.net](https://www.whatsmydns.net/#A/achalpatel.xyz) - should show Vercel IP

### Build Fails
**Problem:** Vercel deployment fails with build error  
**Solution:**
1. Check **Deployment Logs** in Vercel dashboard
2. Common causes:
   - Missing dependencies: `npm install && npm run build` locally
   - Environment variables: Check Variables section
   - TypeScript errors: `npm run type-check`
3. Fix locally, commit, and push

### Old Site Still Shows
**Problem:** Visiting `achalpatel.xyz` shows old content  
**Solution:**
1. Check domain DNS records are pointing to Vercel
2. Wait longer for DNS propagation
3. Check in incognito window (bypasses browser cache)
4. Verify deployment in Vercel dashboard is "Active"

### 404 on Custom Domain
**Problem:** Custom domain loads Vercel 404 page  
**Solution:**
1. Verify domain is in Vercel project Domains list with "Active" status
2. Check domain isn't in multiple Vercel projects (conflicts)
3. Redeploy: In Vercel dashboard, click **"Deployments"** → **"..."** → **"Redeploy"**

---

## Performance & Analytics

### View Deployment Analytics
1. **Project Dashboard** → **Analytics** tab
2. View:
   - Page views, unique visitors
   - Core Web Vitals (LCP, FID, CLS)
   - Edge function performance
   - Geography distribution

### Monitor Deployments
1. **Deployments** tab shows:
   - Deployment status (Building, Ready, Error)
   - Build duration
   - Deployment time
   - Environment (Production, Preview)

### Get Deployment URL
- Production: `https://achalpatel.xyz` (custom domain)
- Preview: `https://[branch-name].[project-name].vercel.app` (auto-generated for PRs)

---

## Maintenance

### Update Project Settings (Optional)
Go to **Project Settings** to configure:
- **Environment Variables** - Add/update secret keys
- **Build & Deployment** - Override build command, change framework
- **Domains** - Manage multiple domains
- **Team Members** - Invite collaborators

### Rollback a Deployment
If latest deployment has issues:

1. Go to **Deployments** tab
2. Click **"..."** on a previous working deployment
3. Select **"Promote to Production"**

### Set Up Preview Deployments
For pull requests (PRs):

1. Vercel auto-creates preview URLs for PRs
2. Preview URL shown in PR comments
3. Test changes before merging to main
4. Auto-cleanup when PR closes

---

## GitHub Integration Best Practices

### Branch Deployment Strategy

| Branch | Auto Deploy | Use Case |
|--------|-------------|----------|
| `main` / `master` | ✅ Yes | Production |
| `develop` | ✅ Yes (optional) | Staging |
| Feature branches (e.g., `feature/new-timeline`) | Preview | Testing PRs |

**Configure in Vercel Settings:**
1. **Project Settings** → **Git**
2. **Production Branch:** `main`
3. **Framework Preset:** `Next.js`
4. Auto-enable Preview for all PRs

---

## Next Steps

1. ✅ Connect GitHub to Vercel (this guide)
2. ✅ Add custom domain `achalpatel.xyz`
3. 📊 Set up monitoring/analytics
4. 🔐 Configure password protection (optional, for work-in-progress)
5. 📧 Set up deployment notifications (Slack, Discord, etc.)

---

## Quick Reference

| Task | Command/Location |
|------|------------------|
| Deploy Now | Push to `main` branch |
| View Logs | Vercel Dashboard → Deployments → Click deployment |
| Add Domain | Settings → Domains → Add |
| Update Env Vars | Settings → Environment Variables |
| Rollback | Deployments → "..." on old deployment → Promote |
| Check Domain Status | [whatsmydns.net](https://www.whatsmydns.net) |

---

## Additional Resources

- **Vercel Official Docs:** https://vercel.com/docs
- **Next.js on Vercel:** https://vercel.com/docs/frameworks/nextjs
- **Custom Domains:** https://vercel.com/docs/concepts/projects/domains
- **CLI Tool:** https://vercel.com/docs/cli
- **GitHub Integration:** https://vercel.com/docs/git

---

**Last Updated:** December 2025  
**Status:** ✅ Production Ready
