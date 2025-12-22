import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Photography',
  description: 'A gallery of my photography work.',
};

export default function PhotographyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="text-center section-container">
        <h1 className="text-display-md font-display font-bold text-foreground mb-4">
          Photography
        </h1>
        <div className="w-24 h-1 bg-accent mx-auto mb-6 shadow-glow-sm" />
        <p className="text-foreground-secondary mb-4">
          Gallery coming soon.
        </p>
        <p className="text-muted text-sm max-w-md mx-auto">
          This section will feature a curated collection of my photography work.
        </p>
      </div>
    </div>
  );
}
