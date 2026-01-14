'use client';

import { motion } from 'framer-motion';
import { Download, ExternalLink, FileText, Github, Eye, Award } from 'lucide-react';
import GlowWrapper from '@/components/ui/GlowWrapper';

export function ResumePage() {
  // GitHub repo for LaTeX resume - compiled via GitHub Actions
  const resumeRepo = 'https://github.com/ac-pate/LaTeX-Resume';
  // This URL will work once you set up GitHub Actions (see LATEX_RESUME_SETUP.md)
  const githubPdfUrl = 'https://github.com/ac-pate/LaTeX-Resume/releases/latest/download/resume.pdf';
  
  // Reference letters (stored in public/docs folder)
  const researchReferenceUrl = '/docs/reference-letter-cuarl.pdf';
  const taReferenceUrl = '/docs/reference-letter-ta.pdf';

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-display-md md:text-display-lg font-display font-bold text-foreground mb-4">
            Resume<span className="text-accent">.</span>
          </h1>
          <p className="text-lg text-foreground-secondary max-w-2xl mb-6">
            My professional experience, education, and skills. The resume is maintained in LaTeX and automatically compiled via GitHub Actions.
          </p>

          {/* Action buttons - stacks vertically on mobile */}
          <div className="flex flex-col xl:flex-row xl:flex-wrap xl:items-center xl:justify-between gap-4 mb-8">
            {/* Resume buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <GlowWrapper preset="button" className="rounded-xl">
                  <a
                    href={githubPdfUrl}
                    download="Achal_Patel_Resume.pdf"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-all shadow-glow-sm w-full sm:w-auto"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                </GlowWrapper>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <GlowWrapper preset="button" className="rounded-xl">
                  <a
                    href={resumeRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 text-white rounded-xl font-semibold border border-white/10 hover:bg-white/10 transition-all backdrop-blur-sm w-full sm:w-auto"
                  >
                    <Github className="w-4 h-4" />
                    View LaTeX Source
                  </a>
                </GlowWrapper>
              </motion.div>
            </div>

            {/* Separator - only visible on xl screens */}
            <div className="hidden xl:block h-10 w-px bg-white/20" />
            
            {/* Mobile/tablet separator */}
            <div className="xl:hidden h-px w-full bg-white/10 my-2" />

            {/* Reference Letter Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
              <p className="text-xs text-muted uppercase tracking-wider xl:hidden">Reference Letters</p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <GlowWrapper preset="button" className="rounded-xl" showHighlight={false}>
                  <a
                    href={researchReferenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-white/5 text-white rounded-xl font-medium border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm w-full sm:w-auto text-sm sm:text-base"
                  >
                    <Award className="w-4 h-4" />
                    <span className="hidden sm:inline">LOR — Research Supervisor</span>
                    <span className="sm:hidden">Research Supervisor LOR</span>
                  </a>
                </GlowWrapper>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <GlowWrapper preset="button" className="rounded-xl" showHighlight={false}>
                  <a
                    href={taReferenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-white/5 text-white rounded-xl font-medium border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm w-full sm:w-auto text-sm sm:text-base"
                  >
                    <Award className="w-4 h-4" />
                    <span className="hidden sm:inline">LOR — TA Coordinator</span>
                    <span className="sm:hidden">TA Coordinator LOR</span>
                  </a>
                </GlowWrapper>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* PDF Viewer Options */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Google Docs Viewer as fallback - works with public GitHub URLs */}
          <div className="rounded-xl border border-border overflow-hidden bg-background-secondary">
            <div className="bg-background-secondary/50 border-b border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground-secondary">
                <FileText className="w-5 h-5" />
                <span className="font-medium">Resume Preview</span>
              </div>
              <a
                href={githubPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-accent hover:underline"
              >
                <Eye className="w-4 h-4" />
                Open Full View
              </a>
            </div>
            
            {/* Using Google Docs Viewer for GitHub-hosted PDFs */}
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(githubPdfUrl)}&embedded=true`}
              className="w-full h-[500px] sm:h-[650px] md:h-[800px] lg:h-[1000px] bg-white"
              title="Resume PDF"
            />
          </div>

          {/* Alternative: Direct link card if iframe fails */}
          <div className="mt-6 p-6 rounded-xl glass glow-card text-center">
            <p className="text-foreground-secondary mb-4">
              Can&apos;t see the preview? Access the resume directly:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={githubPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                View on GitHub
              </a>
              <a
                href={`${resumeRepo}/blob/main/resume_2025.tex`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-foreground-secondary hover:text-accent transition-colors"
              >
                <FileText className="w-4 h-4" />
                View LaTeX Source
              </a>
            </div>
          </div>
        </motion.div>

        {/* Info about the resume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 p-4 rounded-lg glass text-center"
        >
          <div className="flex items-center justify-center gap-2 text-foreground-secondary text-sm">
            <FileText className="w-4 h-4" />
            <span>
              This resume is maintained as a LaTeX document and automatically compiled on each push via GitHub Actions.
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
