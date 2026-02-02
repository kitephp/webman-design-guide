/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: '首页',
    },
    {
      type: 'category',
      label: '🏗️ 架构设计',
      items: [
        'architecture/directory-structure',
        'architecture/dependency-rules',
        'architecture/naming-conventions',
        'architecture/layer-responsibilities',
        'architecture/lightweight-structure',
      ],
    },
    {
      type: 'category',
      label: '💡 系统示例',
      items: [
        'examples/e-commerce',
        'examples/cms',
        'examples/admin-dashboard',
        'examples/multi-tenant-saas',
        'examples/restful-api',
        'examples/im-chat',
        'examples/ticketing-system',
        'examples/payment-gateway',
        'examples/analytics-reporting',
        'examples/microservices',
      ],
    },
    {
      type: 'category',
      label: '🛠️ 工具集成',
      items: [
        'tools/pint',
        'tools/phpstan',
        'tools/rector',
        'tools/pest',
        'tools/saloon',
        'tools/ci-pipeline',
      ],
    },
    {
      type: 'category',
      label: '📖 编码规范',
      items: [
        'coding-standards/per-coding-style',
        'coding-standards/php-the-right-way',
      ],
    },
    {
      type: 'category',
      label: '🌏 中文翻译',
      items: [
        'translates/per-coding-style-chinese',
      ],
    },
  ],
};

export default sidebars;
