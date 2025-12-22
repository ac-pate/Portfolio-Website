'use client';

import { motion } from 'framer-motion';
import { Download, ExternalLink, FileText, Github, Eye } from 'lucide-react';

export function ResumePage() {
  // GitHub repo for LaTeX resume - compiled via GitHub Actions
  const resumeRepo = 'https://github.com/ac-pate/LaTeX-Resume';
  // This URL will work once you set up GitHub Actions (see LATEX_RESUME_SETUP.md)
  const githubPdfUrl = 'https://github.com/ac-pate/LaTeX-Resume/releases/latest/download/resume.pdf';

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

          {/* Action buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <a
              href={githubPdfUrl}
              download="Achal_Patel_Resume.pdf"
              className="btn-primary"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
            <a
              href={resumeRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <Github className="w-4 h-4" />
              View LaTeX Source
            </a>
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
              className="w-full h-[800px] md:h-[1000px] bg-white"
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
