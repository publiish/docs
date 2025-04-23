import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Link from '@docusaurus/Link';

interface FeatureCardProps {
  title: string;
  description: ReactNode;
  icon?: ReactNode;
  link?: string;
  linkText?: string;
  className?: string;
  index?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  link,
  linkText = 'Learn more',
  className,
  index = 0,
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut",
        delay: index * 0.1
      }
    },
    hover: {
      y: -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut",
        delay: index * 0.1 + 0.2
      }
    },
    hover: {
      scale: 1.1,
      transition: { 
        duration: 0.2
      }
    }
  };

  return (
    <motion.div 
      className={clsx(
        'feature-card bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all p-6 border border-gray-100 dark:border-gray-700',
        className
      )}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-100px" }}
    >
      {icon && (
        <motion.div 
          className="text-primary-light dark:text-primary mb-4"
          variants={iconVariants}
        >
          {icon}
        </motion.div>
      )}
      <h3 className="text-xl font-display font-bold mb-2 text-gray-800 dark:text-gray-100">
        {title}
      </h3>
      <div className="text-gray-600 dark:text-gray-300 mb-4">
        {description}
      </div>
      {link && (
        <div className="mt-auto pt-2">
          <Link 
            to={link}
            className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
          >
            {linkText}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default FeatureCard; 