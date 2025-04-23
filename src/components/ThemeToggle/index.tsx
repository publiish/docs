import React, { useEffect, useState, CSSProperties } from 'react';
import { motion } from 'framer-motion';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useColorMode } from '@docusaurus/theme-common';

// Define a style object to replace Tailwind classes
const styles: Record<string, CSSProperties> = {
  button: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '9999px',
    backgroundColor: 'var(--ifm-color-emphasis-200)',
    color: 'var(--ifm-color-emphasis-700)',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
    border: 'none',
    outline: 'none'
  },
  buttonDark: {
    backgroundColor: 'var(--ifm-color-emphasis-800)',
    color: 'var(--ifm-color-emphasis-300)',
  },
  svg: {
    width: '1.25rem',
    height: '1.25rem',
  }
};

const ThemeToggle: React.FC = () => {
  const { colorMode, setColorMode } = useColorMode();
  const isDarkTheme = colorMode === 'dark';
  const [isMounted, setIsMounted] = useState(false);

  // Handle hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleTheme = () => {
    setColorMode(isDarkTheme ? 'light' : 'dark');
  };

  // Animation variants
  const moonVariants = {
    initial: { scale: 0.6, rotate: 90 },
    animate: { scale: 1, rotate: 0, transition: { duration: 0.5 } },
    whileTap: { scale: 0.9, rotate: 15 }
  };

  const sunVariants = {
    initial: { scale: 0.6, rotate: -90 },
    animate: { scale: 1, rotate: 0, transition: { duration: 0.5 } },
    whileTap: { scale: 0.9, rotate: -15 }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } }
  };

  if (!isMounted) return null;

  return (
    <motion.button
      aria-label={`Switch to ${isDarkTheme ? 'light' : 'dark'} mode`}
      style={
        isDarkTheme 
          ? {...styles.button, ...styles.buttonDark} as CSSProperties
          : styles.button
      }
      onClick={toggleTheme}
      initial="initial"
      animate="animate"
      variants={containerVariants}
    >
      {isDarkTheme ? (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={styles.svg}
          initial="initial"
          animate="animate"
          whileTap="whileTap"
          variants={sunVariants}
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.844a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </motion.svg>
      ) : (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={styles.svg}
          initial="initial"
          animate="animate"
          whileTap="whileTap"
          variants={moonVariants}
        >
          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
        </motion.svg>
      )}
    </motion.button>
  );
};

export default ThemeToggle; 