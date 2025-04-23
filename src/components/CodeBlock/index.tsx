import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Highlight, themes } from 'prism-react-renderer';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useColorMode } from '@docusaurus/theme-common';

interface CodeBlockProps {
  children: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
  highlight?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  language,
  title,
  showLineNumbers = false,
  highlight = '',
}) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);
  const { colorMode } = useColorMode();
  const isDarkTheme = colorMode === 'dark';

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(children).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  // Parse highlight lines
  const highlightLines = highlight
    ? highlight.split(',').reduce((acc, range) => {
        if (range.includes('-')) {
          const [start, end] = range.split('-').map(Number);
          for (let i = start; i <= end; i++) {
            acc.add(i);
          }
        } else {
          acc.add(Number(range));
        }
        return acc;
      }, new Set<number>())
    : new Set<number>();

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const copyButtonVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.div
      className="code-block relative rounded-lg overflow-hidden shadow-md my-6 font-mono text-sm"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      {title && (
        <div className="code-title bg-gray-800 text-gray-200 px-4 py-2 font-medium border-b border-gray-700">
          {title}
        </div>
      )}
      <div className="relative">
        <motion.button
          className={clsx(
            "absolute right-2 top-2 rounded-md p-2 text-xs font-medium z-10 transition-colors",
            copied
              ? "bg-green-600 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-gray-200"
          )}
          onClick={copyToClipboard}
          whileHover="hover"
          whileTap="tap"
          variants={copyButtonVariants}
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Copied!
            </span>
          ) : (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm12 6h2a1 1 0 110 2h-2v-2z" />
              </svg>
              Copy
            </span>
          )}
        </motion.button>
        <Highlight
          code={children.trim()}
          language={language}
          theme={isDarkTheme ? themes.dracula : themes.github}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              ref={codeRef}
              className={clsx(className, 'overflow-auto p-4 rounded-b-lg')}
              style={{
                ...style,
                backgroundColor: isDarkTheme ? '#282A36' : '#f6f8fa',
              }}
            >
              {tokens.map((line, i) => {
                const lineNumber = i + 1;
                const isHighlighted = highlightLines.has(lineNumber);
                
                return (
                  <div
                    {...getLineProps({ line, key: i })}
                    className={clsx(
                      'table-row',
                      isHighlighted && 'bg-yellow-50 dark:bg-yellow-900/20'
                    )}
                  >
                    {showLineNumbers && (
                      <span className="table-cell text-right pr-4 select-none text-gray-500 w-10">
                        {lineNumber}
                      </span>
                    )}
                    <span className="table-cell">
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token, key })} />
                      ))}
                    </span>
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
      </div>
    </motion.div>
  );
};

export default CodeBlock; 