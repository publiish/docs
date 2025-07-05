import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import { motion } from 'framer-motion';

type FeatureItem = {
  title: string;
  // Changed from Svg component to image path string
  imgSrc: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'BioAI DIDs Sequencer (BioAgents with Dataverse)',
    imgSrc: require('@site/static/img/data_sovereignt_10.png').default,
    description: (
      <>Bio-DID-Seq is a GDPR compliant Decentralized Identifier (DID) system designed for research data, 
        integrating with Dataverse and powered by AI agents. Define access policies for a truly sovereign experience. 
        Avoid single points of failure unlike traditional cloud providers.
      </>
    ),
  },
  {
    title: 'Content Addressing / Kademlia Backed Storage',
    imgSrc: require('@site/static/img/dec_resilience.png').default,
    description: (
      <>
        Store data across a trustless network, free from centralized control.Retain control over your files, 
        unlike editable S3 buckets. Publiish offers reliable pinning services, dedicated IPFS gateways with flexible 
        options for different content types and storage durations.
      </>
    ),
  },
  {
    title: 'User Controlled Authorization Network (UCAN) tokens',
    imgSrc: require('@site/static/img/content_addressing_tree.png').default,
    description: (
      <>
         Verify files with CIDs while keeping access restricted. Share data only with 
         authorized nodes in a closed cluster. Unlike traditional auth systems, 
         UCAN uses cryptographic keys and tokens to verify who you are and what you can access, no central 
         server needed.
      </>
    ),
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    y: -10,
    transition: { 
      duration: 0.3
    }
  }
};

const imageVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.05,
    transition: { 
      duration: 0.3
    }
  }
};

function Feature({title, imgSrc, description}: FeatureItem) {
  return (
    <motion.div 
      className={clsx("col col--4", styles.featureCol)}
      variants={featureVariants}
      whileHover="hover"
    >
      <motion.div className="text--center" variants={imageVariants}>
        <motion.img 
          src={imgSrc} 
          className={styles.featureSvg} 
          alt={title}
        />
      </motion.div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </motion.div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <motion.div 
          className={clsx("row", styles.featuresSection)}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}