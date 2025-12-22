'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg mx-auto"
        >
          {/* 404 */}
          <div className="mb-8">
            <span className="text-[8rem] md:text-[12rem] font-display font-bold leading-none">
              <span className="text-foreground">4</span>
              <span className="text-accent">0</span>
              <span className="text-foreground">4</span>
            </span>
          </div>

          {/* Message */}
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">
            Page not found
          </h1>
          <p className="text-foreground-secondary mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="btn-primary">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

