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
          className="max-w-4xl mb-16"
        >
          <h1 className="text-display-md md:text-display-lg font-display font-bold text-foreground mb-8">
            About Me<span className="text-accent">.</span>
          </h1>
          
          {/* Main Story */}
          <div className="space-y-6 text-lg text-foreground-secondary leading-relaxed">
            <p>
              I&apos;m a <span className="text-accent font-semibold">4th year Computer Engineering student</span> at Concordia University 
              in Montreal, and I live and breathe robotics. Every single day, I&apos;m thinking about the next breakthrough 
              in autonomous systems—whether it&apos;s Vision-Language-Action models enabling robots to understand commands, 
              optimal control algorithms for precise manipulation, or stereo vision systems for real-time localization.
            </p>

            <p>
              My journey started as an <span className="text-foreground font-medium">international student from India</span>. Initially, 
              I was fascinated by chip manufacturing—the idea of designing processors at the silicon level. That passion led me to an 
              internship at <span className="text-accent font-semibold">Microchip Technology</span>, where I worked on Ethernet chips 
              and High-Performance Space Computers. But I had a realization: <span className="text-foreground font-medium">I wanted to 
              USE the technology, not just manufacture it</span>. I wanted to build machines that move, sense, and think.
            </p>

            <p>
              That&apos;s when I dove headfirst into robotics. I joined <span className="text-accent font-semibold">IEEE Concordia</span> as 
              VP Marketing in my second year, then became <span className="text-accent font-semibold">VP of Projects</span> in my third year—the 
              best position in the club. I led teams building autonomous drones with optical flow, IoT automation systems with Zigbee and 
              Alexa integration, 6-axis robotic arms with ROS2 Control, FPGA-based 32-bit multicore CPUs, and autonomous sumobots. Each project 
              pushed me deeper into the world of embedded systems, real-time control, and hardware-software integration.
            </p>

            <p>
              In Summer 2025, I joined <span className="text-accent font-semibold">CUARL (Concordia University Aerospace Robotics Lab)</span> working 
              on an articulated wheel-legged rover for extraterrestrial exploration. I designed the CAN bus system, built the Gazebo simulation, 
              and developed a complete <span className="text-foreground font-medium">position tracking system using ZED2 stereo cameras</span>—enabling 
              closed-loop control where previously only open-loop existed. That single contribution unlocked motion algorithm development for the entire team.
            </p>

            <p>
              Now, for my capstone project, I&apos;m building <span className="text-accent font-semibold">MIMIC</span>—a dual-arm humanoid robot powered 
              by Vision-Language-Action models and imitation learning. Our goal? Create a robot that can do <em>anything</em> you tell it, even tasks 
              it&apos;s never seen before. We&apos;re partnering with McGill&apos;s Mobile Robotics Lab, revamping their industrial bi-manual robot from 
              ROS1 to ROS2, building custom teleoperation systems, and training generalized policies. It&apos;s the culmination of everything I&apos;ve learned.
            </p>

            <p className="text-foreground font-medium">
              Beyond projects, I&apos;m taking graduate-level courses in control systems, machine learning (earned an <span className="text-accent font-semibold">A+</span>), 
              and Kalman filtering. I&apos;m a Teaching Assistant for VHDL and electronics courses. And in my spare time? I&apos;m training VLA models, 
              building ESP32 IoT devices, experimenting with Jetson platforms, and keeping up with the latest robotics research.
            </p>

            <p className="text-accent font-semibold text-xl">
              I don&apos;t just want to build robots. I want to build robots that think, adapt, and change the world.
            </p>
          </div>
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
