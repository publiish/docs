import React, { useEffect } from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import { motion, useAnimation } from 'framer-motion';
import ThemeToggle from '@site/src/components/ThemeToggle';

import styles from './index.module.css';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const titleVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.7,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

const buttonVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      duration: 0.5,
      ease: "easeOut",
      delay: 0.6
    }
  },
  hover: { 
    scale: 1.05,
    boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  },
  tap: { 
    scale: 0.98,
    transition: { 
      duration: 0.1
    }
  }
};

// Decorative floating elements
const FloatingElement = ({ children, initialX = 0, initialY = 0, delay = 0, duration = 8, scale = 1 }) => {
  return (
    <motion.div
      initial={{ x: initialX, y: initialY, opacity: 0, scale }}
      animate={{ 
        opacity: [0, 0.8, 0.6],
        y: [initialY, initialY - 30, initialY - 10],
        x: [initialX, initialX + 15, initialX + 5],
        scale: [scale, scale * 1.05, scale],
      }}
      transition={{ 
        duration,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
      style={{
        position: 'absolute',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    >
      {children}
    </motion.div>
  );
};

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.6 }}
        >
          <Heading as="h1" className="hero__title">
            {siteConfig.title}
          </Heading>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
        </motion.div>
        
        <motion.div 
          className={styles.buttons}
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            className={clsx('button button--primary button--lg', styles.heroButton)}
            to="/docs/intro">
            Get Started
          </Link>
          <Link
            className={clsx('button button--outline button--lg', styles.heroButton)}
            to="https://github.com/publiish">
            GitHub
          </Link>
        </motion.div>

        <motion.div 
          className={styles.statsContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className={styles.statItem}>
            <span className={styles.statNumber}>99.9%</span>
            <span className={styles.statLabel}>Uptime</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>50+</span>
            <span className={styles.statLabel}>Peer Nodes </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>10PB+</span>
            <span className={styles.statLabel}>Storage</span>
          </div>
        </motion.div>
      </div>
      
      <div className={styles.heroBackground}>
        <div className={styles.heroGlow}></div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Powering decentralized apps with BioAI DIDs, IPFS pinning, dedicated gateways, and IPNS."
      wrapperClassName="homepage">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
