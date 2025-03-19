import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  // Changed from Svg component to image path string
  imgSrc: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Decentralized Resilience',
    imgSrc: require('@site/static/img/dec_resilience.png').default,
    description: (
      <>
        Store data across a trustless network, free from centralized control or censorship.
        Retain control over your files, unlike editable S3 buckets.
      </>
    ),
  },
  {
    title: 'Content Addressing with UCAN Authorization',
    imgSrc: require('@site/static/img/content_addressing_tree.png').default,
    description: (
      <>
         Verify files with CIDs while keeping access restricted. Share data only with 
         authorized nodes in a closed cluster.
      </>
    ),
  },
  {
    title: 'Beyond Centralization/ Immutable Privacy',
    imgSrc: require('@site/static/img/data_sovereignt_10.png').default,
    description: (
      <>
        Define access policies for a truly sovereign experience. Avoid single points 
        of failure unlike traditional cloud providers.
      </>
    ),
  },
];

function Feature({title, imgSrc, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={imgSrc} className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}