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
  
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container relative">
        {/* Decorative floating elements */}
        <FloatingElement initialX={-150} initialY={-50} delay={0.5} scale={1.2}>
          <div className={styles.floatingCircle} style={{ 
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, rgba(139, 92, 246, 0) 70%)',
            width: '200px', 
            height: '200px',
            borderRadius: '50%'
          }} />
        </FloatingElement>
        
        <FloatingElement initialX={150} initialY={100} delay={1.2} duration={10}>
          <div className={styles.floatingCircle} style={{ 
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, rgba(6, 182, 212, 0) 70%)',
            width: '150px', 
            height: '150px',
            borderRadius: '50%'
          }} />
        </FloatingElement>
        
        <FloatingElement initialX={-100} initialY={150} delay={0.8} duration={9} scale={0.9}>
          <div className={styles.floatingShape} style={{ 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)',
            width: '100px', 
            height: '100px',
            borderRadius: '24% 76% 35% 65% / 27% 36% 64% 73%'
          }} />
        </FloatingElement>
        
        {/* Add extra decorative elements */}
        <FloatingElement initialX={200} initialY={-70} delay={1.5} duration={11} scale={0.7}>
          <div className={styles.floatingShape} style={{ 
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
            width: '70px', 
            height: '70px',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
          }} />
        </FloatingElement>
        
        <FloatingElement initialX={-180} initialY={200} delay={2} duration={7} scale={0.8}>
          <div className={styles.floatingCircle} style={{ 
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 70%)',
            width: '120px', 
            height: '120px',
            borderRadius: '50%'
          }} />
        </FloatingElement>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            position: 'relative',
            zIndex: 2
          }}
        >
          <motion.div variants={titleVariants}>
            <Heading as="h1" className="hero__title">
              {siteConfig.title}
            </Heading>
          </motion.div>
          
          <motion.div 
            className={styles.heroTextGlow}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.3,
              duration: 1.5
            }}
          />
          
          <motion.p className="hero__subtitle" variants={itemVariants}>
            {siteConfig.tagline}
          </motion.p>
          
          <motion.div 
            className={styles.buttons}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              className={clsx("button button--secondary button--lg", styles.button)}
              to="/docs/intro">
              Publiish Tutorial - 5min ⏱️
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Powering decentralized apps with IPFS pinning, dedicated gateways, and IPNS."
      wrapperClassName="homepage">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
