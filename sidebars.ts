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
    'bio-did-sequencer',
    'system-architecture',
    'bioagents-architecture',
    'knowledge-graph-integration',
    'gateways',
    'ipns',
    'pinning',
    'privacy',
    {
      type: 'category',
      label: 'API Testing',
      items: [
        {
          type: 'link',
          label: 'API Tester',
          href: '/api-tester',
        },
        {
          type: 'link',
          label: 'DID Management API',
          href: '/did-management',
        },
        {
          type: 'link',
          label: 'BioAgents API',
          href: '/bioagents',
        },
        {
          type: 'link',
          label: 'Dataverse API',
          href: '/dataverse',
        },
      ],
    },
    {
      type: 'category',
      label: 'Tutorial',
      items: [
        'tutorial-basics/auth',
        'tutorial-basics/apikey',
        'tutorial-basics/dids',
        'tutorial-basics/file',
        'tutorial-basics/ipns',
        'tutorial-basics/utilities',
        'tutorial-basics/create-a-page',
        'tutorial-basics/deploy-your-site',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
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
