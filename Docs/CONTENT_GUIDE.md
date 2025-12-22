# Content Management Guide

This guide explains how to efficiently add images, videos, and other media to your portfolio.

## 📁 Folder Structure

```
public/
├── images/
│   ├── projects/      # Project thumbnails and gallery images
│   ├── jobs/          # Company logos and work photos
│   ├── education/     # University logos, certificates
│   └── hero/          # Hero section backgrounds
├── videos/            # Video files for hero or projects
├── gifs/              # Animated GIFs for projects
└── resume.pdf         # Your compiled resume PDF
```

## 🏷️ Naming Convention

### General Rules
- Use **lowercase** only
- Use **hyphens** (-) instead of spaces or underscores
- Keep names **short but descriptive**
- Include **project/job slug** prefix for easy matching

### Projects Images
```
Format: {project-slug}-{description}.{ext}
Examples:
  - 6-axis-robotic-arm-hero.jpg
  - 6-axis-robotic-arm-cad-render.png
  - 6-axis-robotic-arm-demo.gif
  - forest-fire-drone-flight-test.jpg
  - iot-automation-dashboard.png
```

### Jobs Images
```
Format: {company-slug}.{ext} or {job-slug}-{description}.{ext}
Examples:
  - cuarl.jpg                    # Company logo
  - microchip.png                # Company logo
  - concordia.jpg                # University logo
  - cuarl-rover-testing.jpg      # Work photo
```

### Videos
```
Format: {purpose}-{description}.mp4
Examples:
  - hero-background.mp4          # Hero section video
  - 6-axis-arm-demo.mp4          # Project demo
  - drone-flight-test.mp4        # Project footage
```

## 🚀 How to Add Content

### Step 1: Add Images to Correct Folders
1. Prepare your images (recommended: WebP or JPG, max 1920px wide)
2. Name them following the convention above
3. Drop them in the appropriate folder

### Step 2: Reference in MDX Files
Update the `image` field in your MDX frontmatter:

```yaml
---
title: "6-Axis Robotic Arm"
image: "/images/projects/6-axis-robotic-arm-hero.jpg"
# ... rest of frontmatter
---
```

### Step 3: Add More Images in MDX Content
Inside your MDX content, use markdown or custom components:

```markdown
## Gallery

![CAD Render](/images/projects/6-axis-robotic-arm-cad-render.png)

![Demo GIF](/gifs/6-axis-robotic-arm-demo.gif)
```

## 📐 Recommended Image Sizes

| Type | Dimensions | Format | Max Size |
|------|------------|--------|----------|
| Project Thumbnail | 800x600 | WebP/JPG | 200KB |
| Project Gallery | 1920x1080 | WebP/JPG | 500KB |
| Job Logo | 200x200 | PNG/SVG | 50KB |
| Hero Background | 1920x1080 | JPG | 500KB |
| GIFs | 800x600 | GIF | 5MB |
| Videos | 1920x1080 | MP4 (H.264) | 20MB |

## 🔄 Bulk Adding Projects

The most efficient way to add multiple projects:

### 1. Prepare a Template
Create a text file with your project data:
```
Project: 6-Axis Robotic Arm
Slug: 6-axis-robotic-arm
Date: 2024-09-01
Tags: ROS2, Python, Computer Vision
Featured: true
Status: in-progress
GitHub: https://github.com/ac-pate/...
Image: /images/projects/6-axis-robotic-arm-hero.jpg
Description: Leading a team developing a 6-DOF robotic arm...
```

### 2. Create MDX Files
For each project, create: `content/projects/{slug}.mdx`

### 3. Batch Image Processing
Use a tool like ImageMagick or Squoosh.app to:
- Resize images to recommended dimensions
- Convert to WebP format
- Compress for web

```bash
# Example ImageMagick batch conversion
magick mogrify -resize 800x600 -quality 85 -format webp *.jpg
```

### 4. Rename Images
Use a batch renamer (e.g., Bulk Rename Utility on Windows):
- Select all images for a project
- Add prefix: `{project-slug}-`
- Add suffix number or description

## 📝 MDX Frontmatter Reference

### Projects (`content/projects/`)
```yaml
---
title: "Project Name"              # Required
description: "Short description"   # Required
date: "2024-09-01"                # Required (start date)
endDate: "2024-12-01"             # Optional
tags: ["Tag1", "Tag2"]            # Required
image: "/images/projects/..."      # Optional (thumbnail)
github: "https://github.com/..."   # Optional
demo: "https://..."                # Optional (live demo)
featured: true                     # Optional (show on homepage)
status: "in-progress"              # Optional: completed, in-progress, archived
---

Your markdown content here...
```

### Jobs (`content/jobs/`)
```yaml
---
title: "Job Title"                 # Required
company: "Company Name"            # Required
location: "City, Province"         # Required
startDate: "2024-09-01"           # Required
endDate: "2024-12-01"             # Optional (omit if current)
description: "Short description"   # Required
technologies: ["Tech1", "Tech2"]   # Optional
type: "internship"                 # Optional: full-time, part-time, internship, contract
image: "/images/jobs/company.jpg"  # Optional (company logo)
---

Your markdown content here...
```

### Education (`content/education/`)
```yaml
---
institution: "University Name"     # Required
degree: "Bachelor of Engineering"  # Required
field: "Computer Engineering"      # Required
startDate: "2022-09-01"           # Required
endDate: "2026-05-01"             # Optional
location: "City, Province"         # Optional
gpa: "3.8"                        # Optional
honors: ["Award 1", "Award 2"]     # Optional
coursework: ["Course 1", "Course 2"] # Optional
image: "/images/education/..."     # Optional
---

Your markdown content here...
```

## 🎯 Quick Tips

1. **Optimize images** before uploading - use [Squoosh](https://squoosh.app/) or [TinyPNG](https://tinypng.com/)
2. **Use WebP** format for best quality/size ratio
3. **Keep filenames consistent** with your MDX slugs
4. **Test locally** with `npm run dev` before deploying
5. **Commit images** separately from code changes for cleaner git history

## 🔗 Connecting Images to Content

When you add an image file, make sure:
1. The path in MDX matches exactly (case-sensitive!)
2. The file extension matches (.jpg vs .jpeg)
3. The image exists in the public folder

The site will show a placeholder with the first letter of the title if no image is found.

