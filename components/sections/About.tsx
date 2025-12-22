'use client';

import { motion } from 'framer-motion';
import { Code2, Cpu, Cog, Lightbulb } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';

const skills = [
  {
    icon: Code2,
    title: 'Software Development',
    description: 'Building robust applications with modern frameworks and clean architecture.',
  },
  {
    icon: Cpu,
    title: 'Embedded Systems',
    description: 'Programming microcontrollers and designing hardware-software interfaces.',
  },
  {
    icon: Cog,
    title: 'Robotics',
    description: 'Developing autonomous systems with computer vision and motion control.',
  },
  {
    icon: Lightbulb,
    title: 'Problem Solving',
    description: 'Tackling complex challenges with systematic thinking and creative solutions.',
  },
];

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 relative">
      <div className="section-container">
        <SectionHeading
          title="About Me"
          subtitle="Engineer at heart, builder by nature."
        />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <p className="text-lg text-foreground-secondary leading-relaxed">
              I&apos;m a computer engineering student with a passion for building systems 
              that bridge the gap between software and hardware. My interests lie at the 
              intersection of <span className="text-accent font-medium">robotics</span>, 
              <span className="text-accent font-medium"> embedded systems</span>, and 
              <span className="text-accent font-medium"> intelligent automation</span>.
            </p>
            <p className="text-lg text-foreground-secondary leading-relaxed">
              I approach every project with curiosity and a systems-thinking mindset. 
              Whether it&apos;s designing PCBs, writing control algorithms, or building 
              full-stack applications, I enjoy understanding how all the pieces fit together.
            </p>
            <p className="text-lg text-foreground-secondary leading-relaxed">
              When I&apos;m not coding or tinkering with hardware, you&apos;ll find me 
              exploring new technologies, contributing to open-source projects, or 
              capturing moments through my camera lens.
            </p>
          </motion.div>

          {/* Skills grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-xl p-5 group hover:shadow-glass transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <skill.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {skill.title}
                </h3>
                <p className="text-sm text-foreground-secondary leading-relaxed">
                  {skill.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

