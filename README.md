# Portfolio Site

A modern, professional portfolio website built with Next.js 14, Tailwind CSS, and MDX for content management.

## Features

- **Static-first**: Fast, SEO-friendly static site generation
- **MDX Content**: Projects, jobs, and education managed via MDX files
- **Auto-generated Timeline**: Timeline automatically updates from content
- **Dark/Light Mode**: System-aware theme switching
- **Responsive Design**: Mobile-first, works on all devices
- **Smooth Animations**: Subtle, professional Framer Motion animations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Content**: MDX with gray-matter
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to see the site.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── photography/       # Photography page (placeholder)
│   ├── projects/          # Projects listing & detail pages
│   ├── resume/            # Resume page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── layout/           # Navbar, Footer
│   ├── sections/         # Homepage sections
│   ├── providers/        # Theme provider
│   └── ui/               # Reusable UI components
├── content/              # MDX content files
│   ├── projects/         # Project MDX files
│   ├── jobs/             # Job/experience MDX files
│   └── education/        # Education MDX files
├── lib/                  # Utility functions
│   ├── config.ts         # Site configuration
│   ├── mdx.ts           # MDX parsing utilities
│   └── utils.ts         # Helper functions
└── public/              # Static assets
```

## Adding Content

### Projects

Create a new `.mdx` file in `content/projects/`:

```mdx
---
title: "Project Name"
description: "Brief description of the project"
date: "2024-01-01"
endDate: "2024-06-01"
tags: ["React", "TypeScript", "Node.js"]
image: "/projects/my-project.jpg"
github: "https://github.com/username/repo"
demo: "https://demo.example.com"
featured: true
status: "completed"
---

Write your project content here using Markdown...
```

### Jobs

Create a new `.mdx` file in `content/jobs/`:

```mdx
---
title: "Job Title"
company: "Company Name"
location: "City, State"
startDate: "2024-01-01"
endDate: "2024-06-01"
description: "Brief description of role and responsibilities"
technologies: ["Python", "AWS", "Docker"]
type: "internship"
---
```

### Education

Create a new `.mdx` file in `content/education/`:

```mdx
---
institution: "University Name"
degree: "Bachelor of Science"
field: "Computer Engineering"
startDate: "2021-09-01"
endDate: "2025-05-01"
gpa: "3.85"
honors: ["Dean's List", "Honors Society"]
coursework: ["Data Structures", "Algorithms"]
---
```

## Configuration

Edit `lib/config.ts` to update:

- Your name
- Title and tagline
- Email address
- Social media links
- Navigation items

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy automatically on every push

### Manual Build

```bash
npm run build
npm start
```

## Customization

### Colors

Edit the accent color in `tailwind.config.ts`:

```ts
colors: {
  accent: {
    DEFAULT: '#E91E8C',  // Change this
    light: '#FF4DB8',
    dark: '#B8156E',
  },
}
```

### Fonts

The site uses:
- **Inter**: Body text
- **Space Grotesk**: Display headings
- **JetBrains Mono**: Code blocks

## License

MIT License - feel free to use this template for your own portfolio!

