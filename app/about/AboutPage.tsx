'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Mail, 
  Github, 
  Linkedin, 
  MapPin,
  GraduationCap,
  Code,
  Cpu,
  Cog,
  Wrench,
  ArrowRight,
  LucideIcon
} from 'lucide-react';
import GlowWrapper from '@/components/ui/GlowWrapper';
import { siteConfig } from '@/lib/config';
import { formatDateRange } from '@/lib/utils';
import type { ContentItem, EducationFrontmatter, AboutPageContent } from '@/lib/mdx';

// Map string icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  Cpu,
  Cog,
  Code,
  Wrench,
  GraduationCap,
  Mail,
  Github,
  Linkedin,
  MapPin,
};

interface AboutPageProps {
  education: ContentItem<EducationFrontmatter>[];
  content: AboutPageContent;
}

export function AboutPage({ education, content }: AboutPageProps) {
  return (
    <div className="pt-24 pb-16">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mb-12"
        >
          <h1 className="text-display-md md:text-display-lg font-display font-bold text-foreground">
            About Me<span className="text-accent">.</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-16">
            {/* Main Story */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-8 text-lg text-foreground-secondary leading-relaxed bg-background-secondary/30 p-8 rounded-2xl border border-white/5"
            >
              <h3 className="text-2xl font-display font-bold text-foreground mb-4">The Deep Dive</h3>
              
              {content.deepDive.map((paragraph, index) => (
                <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
            </motion.div>

            {/* Strengths & Weaknesses Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-display font-bold text-foreground">Strengths & Weaknesses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Strengths */}
                <div className="glass rounded-xl p-6 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <span className="text-emerald-500 font-bold">+</span>
                    </div>
                    <h4 className="text-lg font-display font-bold text-foreground">Strengths</h4>
                  </div>
                  <ul className="space-y-4">
                    {content.strengths.map((strength, i) => (
                      <li key={i} className="flex gap-3 text-sm text-foreground-secondary leading-relaxed">
                        <div className="mt-1.5 w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="glass rounded-xl p-6 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-accent font-bold">−</span>
                    </div>
                    <h4 className="text-lg font-display font-bold text-foreground">Weaknesses</h4>
                  </div>
                  <ul className="space-y-4">
                    {content.weaknesses.map((weakness, i) => (
                      <li key={i} className="flex gap-3 text-sm text-foreground-secondary leading-relaxed">
                        <div className="mt-1.5 w-1 h-1 rounded-full bg-accent/40 flex-shrink-0" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Education Preview */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-foreground">Education</h2>
                <Link href="/education" className="text-sm text-accent hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              {education.length === 0 ? (
                <p className="text-foreground-secondary">Education details coming soon.</p>
              ) : (
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <motion.div
                      key={edu.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link href={`/education/${edu.slug}`} className="block group">
                        <div className="glass rounded-xl p-5 transition-all duration-300 hover:shadow-glow-sm hover:border-accent/30">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                              <GraduationCap className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-display font-semibold text-foreground group-hover:text-accent transition-colors">
                                {edu.frontmatter.degree}
                              </h3>
                              <p className="text-accent text-sm">{edu.frontmatter.institution}</p>
                              {edu.frontmatter.startDate && (
                                <p className="text-xs text-muted mt-1">
                                  {formatDateRange(edu.frontmatter.startDate, edu.frontmatter.endDate)}
                                  {edu.frontmatter.gpa && ` • GPA: ${edu.frontmatter.gpa}`}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-xl p-6"
            >
              <h3 className="font-display font-semibold text-foreground mb-4">
                Connect
              </h3>
              <div className="space-y-3">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-3 text-foreground-secondary hover:text-accent transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Email</span>
                </a>
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-foreground-secondary hover:text-accent transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span className="text-sm">GitHub</span>
                </a>
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-foreground-secondary hover:text-accent transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="text-sm">LinkedIn</span>
                </a>
                <div className="flex items-center gap-3 text-foreground-secondary">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Montreal, QC</span>
                </div>
              </div>
            </motion.div>

            {/* Technical skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6"
            >
              <h3 className="font-display font-semibold text-foreground mb-4">
                Technical Skills
              </h3>
              <div className="space-y-4">
                {content.technicalSkills.map((category) => (
                  <div key={category.category}>
                    <p className="text-sm text-muted mb-2">{category.category}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {category.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 text-xs rounded bg-background-secondary text-foreground-secondary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Interests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6"
            >
              <h3 className="font-display font-semibold text-foreground mb-4">
                Interests
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {content.interests.map((interest) => {
                  const IconComponent = iconMap[interest.icon] || Cpu;
                  return (
                    <div
                      key={interest.label}
                      className="flex items-center gap-2 text-foreground-secondary"
                    >
                      <IconComponent className="w-4 h-4 text-accent" />
                      <span className="text-sm">{interest.label}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
