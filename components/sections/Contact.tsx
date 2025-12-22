'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, MapPin } from 'lucide-react';
import { siteConfig } from '@/lib/config';

export function Contact() {
  return (
    <section id="contact" className="py-16 bg-background-secondary/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto"
        >
          <h2 className="text-2xl font-display font-bold mb-6">Get in Touch</h2>
          
          <div className="flex justify-center gap-6 mb-6">
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-2 text-foreground-secondary hover:text-accent transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </a>
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground-secondary hover:text-accent transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground-secondary hover:text-accent transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
          </div>

          <p className="text-sm text-muted flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4" />
            Montreal, QC • Open to opportunities
          </p>
        </motion.div>
      </div>
    </section>
  );
}
