import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

type CalloutType = 'info' | 'warning' | 'success' | 'danger' | 'note';

interface CalloutProps {
  children: ReactNode;
  type?: CalloutType;
  title?: string;
  icon?: boolean;
}

const icons = {
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  ),
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ),
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  danger: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  ),
  note: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  ),
};

const bgColors = {
  info: 'bg-blue-50 dark:bg-blue-900/30',
  warning: 'bg-amber-50 dark:bg-amber-900/30',
  success: 'bg-green-50 dark:bg-green-900/30',
  danger: 'bg-red-50 dark:bg-red-900/30',
  note: 'bg-gray-50 dark:bg-gray-800/50',
};

const borderColors = {
  info: 'border-blue-300 dark:border-blue-700',
  warning: 'border-amber-300 dark:border-amber-700',
  success: 'border-green-300 dark:border-green-700',
  danger: 'border-red-300 dark:border-red-700',
  note: 'border-gray-300 dark:border-gray-700',
};

const textColors = {
  info: 'text-blue-800 dark:text-blue-300',
  warning: 'text-amber-800 dark:text-amber-300',
  success: 'text-green-800 dark:text-green-300', 
  danger: 'text-red-800 dark:text-red-300',
  note: 'text-gray-800 dark:text-gray-300',
};

const iconColors = {
  info: 'text-blue-500 dark:text-blue-400',
  warning: 'text-amber-500 dark:text-amber-400',
  success: 'text-green-500 dark:text-green-400',
  danger: 'text-red-500 dark:text-red-400',
  note: 'text-gray-500 dark:text-gray-400',
};

const titles = {
  info: 'Information',
  warning: 'Warning',
  success: 'Success',
  danger: 'Important',
  note: 'Note',
};

const Callout: React.FC<CalloutProps> = ({ 
  children, 
  type = 'info', 
  title, 
  icon = true 
}) => {
  const variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      className={clsx(
        'callout rounded-lg border-l-4 p-4 my-6 shadow-sm',
        bgColors[type],
        borderColors[type]
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
    >
      {(title || icon) && (
        <div className="flex items-center mb-2">
          {icon && (
            <span className={clsx('mr-2', iconColors[type])}>
              {icons[type]}
            </span>
          )}
          {title && (
            <h4 className={clsx('font-semibold text-base m-0', textColors[type])}>
              {title}
            </h4>
          )}
          {!title && icon && (
            <h4 className={clsx('font-semibold text-base m-0', textColors[type])}>
              {titles[type]}
            </h4>
          )}
        </div>
      )}
      <div className={clsx('callout-content text-sm', textColors[type])}>
        {children}
      </div>
    </motion.div>
  );
};

export default Callout; 