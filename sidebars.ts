import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'pinning',
        'gateways',
        'ipns',
        'privacy',
      ],
    },
    {
      type: 'category',
      label: 'Core API Reference',
      items: [
        'tutorial-basics/auth',
        'tutorial-basics/apikey',
        'tutorial-basics/file',
        'tutorial-basics/ipns',
        'tutorial-basics/utilities',
      ],
    },
    {
      type: 'category',
      label: 'UCAN Guide',
      items: [      
        'tutorial-basics/create-a-page',
        'tutorial-basics/dids',
        'tutorial-basics/deploy-your-site',
      ],
    },
    {
      type: 'category',
      label: 'Tutorials Extras',
      items: [      
        'tutorial-extras/manage-docs-versions',
      ],
    },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
