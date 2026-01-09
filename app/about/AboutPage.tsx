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
import GlowWrapper from '@/components/ui/GlowWrapper';
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
    category: 'Programming',
    skills: ['Python', 'C/C++', 'VHDL', 'SystemVerilog', 'MATLAB', 'Bash'],
  },
  {
    category: 'Robotics & AI',
    skills: ['ROS2', 'Gazebo', 'Isaac Sim', 'VLA Models', 'Imitation Learning', 'SLAM'],
  },
  {
    category: 'Computer Vision',
    skills: ['ZED Camera', 'Stereo Vision', 'Point Clouds', 'Visual Odometry', 'OpenCV'],
  },
  {
    category: 'Control Systems',
    skills: ['Model Predictive Control', 'Optimal Control', 'PID Tuning', 'Kalman Filtering'],
  },
  {
    category: 'Embedded Hardware',
    skills: ['ESP32', 'STM32', 'Arduino', 'Jetson (Nano/AGX)', 'Raspberry Pi', 'FPGA'],
  },
  {
    category: 'Protocols & IoT',
    skills: ['CAN', 'SPI', 'I2C', 'WiFi', 'Bluetooth', 'Zigbee', 'Thread', 'MQTT'],
  },
  {
    category: 'Tools & Platforms',
    skills: ['Git', 'Linux', 'Docker', 'PyTorch', 'TensorFlow', 'CAD (Fusion 360)'],
  },
];

const interests = [
  { icon: Cpu, label: 'Embedded Systems' },
  { icon: Cog, label: 'Robotics & Autonomy' },
  { icon: Code, label: 'Machine Learning' },
  { icon: Wrench, label: 'Hardware Tinkering' },
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
              
              <p>
                As a <span className="text-accent font-semibold">4th year Computer Engineering student</span> at Concordia, 
                I live at the intersection of bits and bolts. My obsession with robotics began as a fascination with 
                chip manufacturing at <span className="text-accent font-semibold">Microchip Technology</span>, but I soon realized 
                that I didn&apos;t just want to build the silicon—I wanted to make it move.
              </p>

              <p>
                Through <span className="text-accent font-semibold">IEEE Concordia</span> and later <span className="text-accent font-semibold">CUARL</span>, 
                I&apos;ve dedicated thousands of hours to mastering autonomous systems. I&apos;ve built everything from 32-bit multicore 
                CPUs to <span className="text-foreground font-medium">position tracking systems for lunar rovers</span>. Each project 
                was a lesson in low-latency control and hardware-software synergy.
              </p>

              <p>
                Today, my focus is <span className="text-accent font-semibold">MIMIC</span>: a dual-arm humanoid robot that 
                doesn&apos;t just follow code, but learns through imitation. By leveraging <span className="text-foreground font-medium">Vision-Language-Action models</span>, 
                we&apos;re teaching machines to understand the world as we do. It&apos;s not just about building robots; it&apos;s 
                about building the next generation of intelligent agency.
              </p>
            </motion.div>
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
                              {job.frontmatter.startDate && (
                                <p className="text-xs text-muted mt-1">
                                  {formatDateRange(job.frontmatter.startDate, job.frontmatter.endDate)}
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
