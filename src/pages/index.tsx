import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import { motion } from 'framer-motion';
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
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { 
      duration: 0.3
    }
  },
  tap: { 
    scale: 0.98,
    transition: { 
      duration: 0.1
    }
  }
};

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <motion.div variants={itemVariants}>
            <Heading as="h1" className="hero__title">
              {siteConfig.title}
            </Heading>
          </motion.div>
          
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
              className="button button--secondary button--lg"
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
      description="Powering decentralized apps with IPFS pinning, dedicated gateways, and IPNS.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
