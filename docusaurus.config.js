// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Webman Design Guide',
  tagline: '完整的 Webman 框架设计规范、架构指南和最佳实践',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://kitephp.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/webman-design-guide/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'kitephp', // Usually your GitHub org/user name.
  projectName: 'webman-design-guide', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/', // Serve docs at the site's root
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/kitephp/webman-design-guide/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Webman Design Guide',
        logo: {
          alt: 'Webman Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: '文档',
          },
          {
            href: 'https://github.com/kitephp/webman-design-guide',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://github.com/kitephp/webman-design-skills',
            label: 'Agent Skills',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '文档',
            items: [
              {
                label: '架构设计',
                to: '/architecture/directory-structure',
              },
              {
                label: '系统示例',
                to: '/examples/e-commerce',
              },
              {
                label: '工具集成',
                to: '/tools/pint',
              },
            ],
          },
          {
            title: '相关资源',
            items: [
              {
                label: 'Webman 官方文档',
                href: 'https://www.workerman.net/doc/webman/',
              },
              {
                label: 'PER Coding Style',
                href: 'https://www.php-fig.org/per/coding-style/',
              },
              {
                label: 'PHP The Right Way',
                href: 'https://phptherightway.com/',
              },
            ],
          },
          {
            title: '更多',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/kitephp/webman-design-guide',
              },
              {
                label: 'Agent Skills',
                href: 'https://github.com/kitephp/webman-design-skills',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} kitephp. Built with Docusaurus. | 本文档由 AI 生成`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['php', 'bash', 'json', 'yaml'],
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
};

export default config;
