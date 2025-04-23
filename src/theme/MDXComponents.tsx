import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import Callout from '@site/src/components/Callout';
import CodeBlock from '@site/src/components/CodeBlock';
import AnimatedSection from '@site/src/components/AnimatedSection';
import FeatureCard from '@site/src/components/FeatureCard';
import { Heading, Text } from '@site/src/components/Typography';

// Add our custom components
export default {
  // Re-use the default mapping
  ...MDXComponents,
  // Map new custom components
  Callout,
  CodeBlock,
  AnimatedSection,
  FeatureCard,
  // Override h2, h3, etc. with animated versions
  h1: (props) => <Heading level={1} {...props} />,
  h2: (props) => <Heading level={2} {...props} />,
  h3: (props) => <Heading level={3} {...props} />,
  h4: (props) => <Heading level={4} {...props} />,
  h5: (props) => <Heading level={5} {...props} />,
  h6: (props) => <Heading level={6} {...props} />,
  p: (props) => <Text {...props} />,
}; 