import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  id?: string;
  className?: string;
  fadeIn?: boolean;
  delay?: number;
}

const defaultClasses = {
  h1: 'text-4xl md:text-5xl font-display font-bold mt-6 mb-4 text-gray-900 dark:text-white',
  h2: 'text-3xl md:text-4xl font-display font-bold mt-6 mb-3 text-gray-800 dark:text-gray-100',
  h3: 'text-2xl md:text-3xl font-display font-bold mt-5 mb-2 text-gray-800 dark:text-gray-100',
  h4: 'text-xl md:text-2xl font-display font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200',
  h5: 'text-lg md:text-xl font-display font-semibold mt-4 mb-1 text-gray-700 dark:text-gray-200',
  h6: 'text-base md:text-lg font-display font-semibold mt-3 mb-1 text-gray-700 dark:text-gray-300',
};

// Animation variants
const fadeVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay: number) => ({
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: "easeOut",
      delay
    }
  })
};

export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 2,
  id,
  className,
  fadeIn = true,
  delay = 0,
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const classes = clsx(defaultClasses[`h${level}`], className);

  return fadeIn ? (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeVariants}
      custom={delay}
    >
      <Tag id={id} className={classes}>
        {children}
      </Tag>
    </motion.div>
  ) : (
    <Tag id={id} className={classes}>
      {children}
    </Tag>
  );
};

interface TextProps {
  children: ReactNode;
  className?: string;
  fadeIn?: boolean;
  delay?: number;
}

export const Text: React.FC<TextProps> = ({
  children,
  className,
  fadeIn = true,
  delay = 0
}) => {
  const classes = clsx(
    'text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4',
    className
  );

  return fadeIn ? (
    <motion.p
      className={classes}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeVariants}
      custom={delay}
    >
      {children}
    </motion.p>
  ) : (
    <p className={classes}>{children}</p>
  );
};

export default {
  Heading,
  Text,
}; 