import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Publiish IPFS Network',
  tagline: 'Powering decentralized apps with IPFS pinning, dedicated gateways, and IPNS.',
  favicon: 'img/favicon.ico',
  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  
   // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'publiish',
  projectName: 'publiish',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: 'https://github.com/publiish/docs/edit/main/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        // blog: {
        //   showReadingTime: true,
        //   editUrl: 'https://github.com/publiish/docs/edit/main/',
        //   feedOptions: {
        //     type: ['rss', 'atom'],
        //     copyright: `Copyright © ${new Date().getFullYear()} Publiish`,
        //   },
        //   onInlineTags: 'warn',
        //   onInlineAuthors: 'warn',
        //   onUntruncatedBlogPosts: 'warn',
        // },
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
          ],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    metadata: [
      {name: 'keywords', content: 'ipfs, web3, decentralized storage, pinning, ipns'},
      {name: 'twitter:card', content: 'summary_large_image'},
      {name: 'theme-color', content: '#8b5cf6'},
    ],
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Publiish',
      logo: {
        alt: 'Publiish Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo.svg',
        width: 32,
        height: 32,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        // {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/publiish',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
      hideOnScroll: true,
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [{label: 'Tutorial', to: '/docs/intro'}],
        },
        {
          title: 'Community',
          items: [
            {label: 'Discord', href: 'https://discord.gg/ueqsM5q9aG'},
            {label: 'X (Twitter)', href: 'https://x.com/PubliishIPFS'},
          ],
        },
        {
          title: 'More',
          items: [
            // {label: 'Blog', to: '/blog'},
            {label: 'GitHub', href: 'https://github.com/publiish'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Publiish. All rights reserved.`,
      logo: {
        alt: 'Publiish Logo',
        src: 'img/logo.svg',
      },
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml', 'markdown', 'typescript'],
      defaultLanguage: 'javascript',
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: {start: 'highlight-start', end: 'highlight-end'},
        },
        {
          className: 'code-block-error-line',
          line: 'error-next-line',
          block: {start: 'error-start', end: 'error-end'},
        },
      ],
    },
    // Add animations for page transitions
    docs: {
      sidebar: {
        autoCollapseCategories: true,
        hideable: true,
      },
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
    announcementBar: {
      id: 'support_us',
      content:
        '⭐️ If you like Publiish, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/publiish">GitHub</a>',
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      textColor: '#fff',
      isCloseable: true,
    },
  } satisfies Preset.ThemeConfig,
  
  // Add plugins to enhance the documentation
  plugins: [],
  
  // Tailwind CSS will process these files
  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap',
      type: 'text/css',
    },
  ],
};

export default config;
