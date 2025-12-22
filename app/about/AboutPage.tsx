'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Mail, 
  Github, 
  Linkedin, 
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Cpu,
  Cog,
  Wrench,
  ArrowRight,
  Users
} from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { siteConfig } from '@/lib/config';
import { formatDateRange } from '@/lib/utils';
import type { ContentItem, JobFrontmatter, EducationFrontmatter, VolunteerFrontmatter } from '@/lib/mdx';

interface AboutPageProps {
  jobs: ContentItem<JobFrontmatter>[];
  education: ContentItem<EducationFrontmatter>[];
  volunteer: ContentItem<VolunteerFrontmatter>[];
}

const technicalSkills = [
  {
    category: 'Languages',
    skills: ['Python', 'C/C++', 'VHDL', 'SystemVerilog', 'MATLAB'],
  },
  {
    category: 'Robotics',
    skills: ['ROS2', 'Gazebo', 'Control Systems', 'Sensor Fusion', 'Computer Vision'],
  },
  {
    category: 'Hardware',
    skills: ['Arduino', 'Raspberry Pi', 'STM32', 'FPGA', 'PCB Design'],
  },
  {
    category: 'Tools',
    skills: ['Git', 'Linux', 'Docker', 'CAD (Fusion 360)', 'Simulink'],
  },
];

const interests = [
  { icon: Cpu, label: 'Embedded Systems' },
  { icon: Cog, label: 'Robotics' },
  { icon: Code, label: 'Autonomous Systems' },
  { icon: Wrench, label: 'Hardware Prototyping' },
];

export function AboutPage({ jobs, education, volunteer }: AboutPageProps) {
  return (
    <div className="pt-24 pb-16">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-16"
        >
          <h1 className="text-display-md md:text-display-lg font-display font-bold text-foreground mb-6">
            About Me<span className="text-accent">.</span>
          </h1>
          <p className="text-xl text-foreground-secondary leading-relaxed mb-6">
            I&apos;m a Computer Engineering student at Concordia University passionate about 
            building intelligent systems that interact with the physical world. My work spans 
            robotics research, embedded systems, and autonomous systems.
          </p>
          <p className="text-lg text-foreground-secondary leading-relaxed">
            Currently working on experimental space-rover platforms at CUARL and leading 
            multiple robotics projects through IEEE Concordia. I believe in learning by doing 
            — whether it&apos;s designing a custom PCB, implementing control algorithms, or 
            building full ROS2 stacks.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-16">
            {/* Experience Preview */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-foreground">Experience</h2>
                <Link href="/experience" className="text-sm text-accent hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              {jobs.length === 0 ? (
                <p className="text-foreground-secondary">Experience details coming soon.</p>
              ) : (
                <div className="space-y-4">
                  {jobs.slice(0, 2).map((job, index) => (
                    <motion.div
                      key={job.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link href={`/experience/${job.slug}`} className="block group">
                        <div className="glass rounded-xl p-5 transition-all duration-300 hover:shadow-glow-sm hover:border-accent/30">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                              <Briefcase className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-display font-semibold text-foreground group-hover:text-accent transition-colors">
                                {job.frontmatter.title}
                              </h3>
                              <p className="text-accent text-sm">{job.frontmatter.company}</p>
                              <p className="text-xs text-muted mt-1">
                                {formatDateRange(job.frontmatter.startDate, job.frontmatter.endDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

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
                              <p className="text-xs text-muted mt-1">
                                {formatDateRange(edu.frontmatter.startDate, edu.frontmatter.endDate)}
                                {edu.frontmatter.gpa && ` • GPA: ${edu.frontmatter.gpa}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            {/* Volunteer/Leadership */}
            {volunteer.length > 0 && (
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-6">Leadership</h2>
                <div className="space-y-4">
                  {volunteer.map((vol, index) => (
                    <motion.div
                      key={vol.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="glass rounded-xl p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display font-semibold text-foreground">
                            {vol.frontmatter.title}
                          </h3>
                          <p className="text-accent text-sm">{vol.frontmatter.organization}</p>
                          <p className="text-foreground-secondary text-sm mt-2">
                            {vol.frontmatter.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
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
                {technicalSkills.map((category) => (
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
                {interests.map((interest) => (
                  <div
                    key={interest.label}
                    className="flex items-center gap-2 text-foreground-secondary"
                  >
                    <interest.icon className="w-4 h-4 text-accent" />
                    <span className="text-sm">{interest.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
