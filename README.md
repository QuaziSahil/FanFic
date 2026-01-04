# FanFic Website 🌟

A beautiful, animated fan fiction and audiobook website built with Next.js, Tailwind CSS, and Framer Motion.

## Features ✨

- 🎨 **Stunning Animations** - Smooth animations powered by Framer Motion
- 🌙 **Dark Theme** - Beautiful dark gradient design
- 📱 **Fully Responsive** - Works on all devices
- ⚡ **Fast Performance** - Built with Next.js 14
- 🎧 **Audiobooks Support** - Showcase both written stories and audiobooks
- 🔍 **Search & Filter** - Easy content discovery
- 🎭 **Multiple Series** - Organize content by universes/series

## Getting Started 🚀

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/fanfic-website.git
cd fanfic-website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploying to Vercel 🚀

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

That's it! Vercel will automatically deploy your site.

## Project Structure 📁

```
fanfic-website/
├── app/
│   ├── globals.css      # Global styles & animations
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── series/
│       └── [id]/
│           └── page.tsx # Series detail page
├── components/
│   ├── Navbar.tsx       # Navigation bar
│   ├── Footer.tsx       # Footer component
│   ├── SeriesCard.tsx   # Series card component
│   ├── FloatingWords.tsx # Animated floating words
│   └── ParticleBackground.tsx # Particle animation
├── package.json
├── tailwind.config.ts
└── README.md
```

## Customization 🎨

### Adding New Series

Edit the `seriesData` array in `app/page.tsx`:

```typescript
const seriesData = [
  {
    id: 'your-series',
    title: 'Your Series Name',
    description: 'Series description',
    image: '🎭', // Use emoji or replace with image URL
    color: 'from-blue-500 to-purple-600', // Tailwind gradient
    storiesCount: 10,
    audiobooksCount: 5,
  },
  // ... more series
]
```

### Adding Stories/Audiobooks

Edit the data in `app/series/[id]/page.tsx` to add your own stories and audiobooks.

### Changing Colors

The main colors can be customized in `tailwind.config.ts` under the `theme.extend.colors` section.

## Tech Stack 🛠️

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Deployment**: [Vercel](https://vercel.com/)
- **Language**: TypeScript

## License 📄

MIT License - feel free to use this for your own projects!

---

Made with ❤️ for FanFic lovers
