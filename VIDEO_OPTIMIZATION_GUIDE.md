# Video Performance Optimization Guide

## Current Issues
- Video causes lag on home page (local and Vercel)
- Video already compressed with ffmpeg but still slow

## Implemented Optimizations

### 1. **Lazy Loading** ✅
- Video only loads after component mounts (100ms delay)
- Prevents blocking initial page render
- Shows placeholder gradient while loading

### 2. **Preload Strategy** ✅
- Changed from `preload="auto"` to `preload="metadata"`
- Only loads video metadata, not full video upfront
- Reduces initial load time significantly

### 3. **Hardware Acceleration** ✅
- `transform: translateZ(0)` for GPU acceleration
- `willChange: 'transform'` for browser optimization
- `backfaceVisibility: hidden` for better rendering

### 4. **Smooth Loading** ✅
- Fade-in transition when video loads
- Poster image support (create `/public/images/hero/video-poster.jpg`)

## Additional Optimization Options

### Option 1: Convert to WebM Format (Recommended)
WebM typically has 30-50% better compression than MP4.

```bash
# Convert to WebM (VP9 codec - best compression)
ffmpeg -i hero_bg_1.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus hero_bg_1.webm

# Or use VP8 (faster encoding, slightly larger)
ffmpeg -i hero_bg_1.mp4 -c:v libvpx -crf 30 -b:v 0 -c:a libopus hero_bg_1.webm
```

Then uncomment the WebM source in Hero.tsx:
```tsx
<source src="/videos/hero_bg_1.webm" type="video/webm" />
<source src="/videos/hero_bg_1.mp4" type="video/mp4" />
```

### Option 2: Create Multiple Quality Versions
Serve different qualities based on connection speed.

```bash
# Low quality (mobile/slow connections)
ffmpeg -i hero_bg_1.mp4 -vf scale=1280:720 -crf 28 -preset slow hero_bg_1_low.mp4

# Medium quality (default)
ffmpeg -i hero_bg_1.mp4 -vf scale=1920:1080 -crf 23 -preset slow hero_bg_1_medium.mp4

# High quality (fast connections)
ffmpeg -i hero_bg_1.mp4 -crf 20 -preset slow hero_bg_1_high.mp4
```

Then use in Hero.tsx:
```tsx
<source src="/videos/hero_bg_1_high.mp4" type="video/mp4" media="(min-width: 1920px)" />
<source src="/videos/hero_bg_1_medium.mp4" type="video/mp4" media="(min-width: 1280px)" />
<source src="/videos/hero_bg_1_low.mp4" type="video/mp4" />
```

### Option 3: Use Intersection Observer (Advanced)
Only load video when it's about to enter viewport.

```tsx
useEffect(() => {
    if (!videoRef.current) return;
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setShouldLoadVideo(true);
                    observer.disconnect();
                }
            });
        },
        { rootMargin: '50%' } // Start loading 50% before visible
    );
    
    observer.observe(videoRef.current);
    return () => observer.disconnect();
}, []);
```

### Option 4: Use Vercel's Video Optimization
If using Vercel, use their optimized video delivery:

1. Upload video to Vercel Blob Storage
2. Use `<VercelVideo>` component (if available)
3. Or use Vercel's CDN with automatic optimization

### Option 5: Replace with Canvas Animation
If video is still too heavy, consider:
- CSS animations
- Canvas-based particle effects
- WebGL shaders
- Animated SVG

### Option 6: Use Video CDN
Use a service like:
- **Cloudinary** - Automatic optimization, multiple formats
- **Mux** - Video streaming platform
- **Bunny CDN** - Fast video delivery

### Option 7: Further FFmpeg Optimization
Try these compression settings:

```bash
# Ultra-compressed MP4 (H.264)
ffmpeg -i hero_bg_1.mp4 \
  -c:v libx264 \
  -preset slow \
  -crf 28 \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease" \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  -pix_fmt yuv420p \
  hero_bg_1_optimized.mp4

# For even smaller size (lower quality)
ffmpeg -i hero_bg_1.mp4 \
  -c:v libx264 \
  -preset slow \
  -crf 32 \
  -vf "scale=1280:720:force_original_aspect_ratio=decrease" \
  -c:a aac \
  -b:a 96k \
  -movflags +faststart \
  -pix_fmt yuv420p \
  hero_bg_1_small.mp4
```

**Key flags:**
- `-crf 28`: Quality (18-28 recommended, higher = smaller file)
- `-preset slow`: Better compression (slower encoding)
- `-movflags +faststart`: Enables progressive download
- `-pix_fmt yuv420p`: Ensures compatibility

### Option 8: Create Poster Image
Generate a poster frame from video:

```bash
# Extract first frame as poster
ffmpeg -i hero_bg_1.mp4 -ss 00:00:01 -vframes 1 -vf scale=1920:1080 public/images/hero/video-poster.jpg
```

## Recommended Next Steps

1. **Immediate (Easy):**
   - ✅ Already done: Lazy loading, metadata preload
   - Create poster image (Option 8)
   - Convert to WebM (Option 1)

2. **Short-term (Medium effort):**
   - Create multiple quality versions (Option 2)
   - Further optimize with FFmpeg (Option 7)

3. **Long-term (If still issues):**
   - Consider video CDN (Option 6)
   - Or replace with canvas/animation (Option 5)

## Testing Performance

Use Chrome DevTools:
1. Network tab - Check video load time
2. Performance tab - Check frame rate during scroll
3. Lighthouse - Check video impact on page score

Target metrics:
- Video should load in < 2 seconds
- Page should maintain 60fps during scroll
- Lighthouse performance score > 90

## Current File Size Recommendations

- **Target size:** < 5MB for hero video
- **Resolution:** 1920x1080 max (consider 1280x720 for mobile)
- **Duration:** Keep under 10 seconds if looping
- **Frame rate:** 24-30fps (no need for 60fps)

