import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Webman Design Guide',
  description: 'Webman 框架设计规范、架构指南和最佳实践',
  base: '/webman-design-guide/',

  locales: {
    'zh-CN': {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh-CN/',
      themeConfig: {
        nav: [
          { text: '架构设计', link: '/zh-CN/architecture/directory-structure' },
          { text: '系统示例', link: '/zh-CN/examples/e-commerce' },
          { text: '工具集成', link: '/zh-CN/tools/pint' },
          { text: '编码规范', link: '/zh-CN/coding-standards/per-coding-style' }
        ],
        sidebar: {
          '/zh-CN/': [
            {
              text: '开始',
              items: [
                { text: '介绍', link: '/zh-CN/introduction' }
              ]
            },
            {
              text: '架构设计',
              items: [
                { text: '目录结构规范', link: '/zh-CN/architecture/directory-structure' },
                { text: '依赖方向规则', link: '/zh-CN/architecture/dependency-rules' },
                { text: '命名规范', link: '/zh-CN/architecture/naming-conventions' },
                { text: '分层职责', link: '/zh-CN/architecture/layer-responsibilities' },
                { text: '小型项目架构', link: '/zh-CN/architecture/lightweight-structure' }
              ]
            },
            {
              text: '系统示例',
              items: [
                { text: '电商系统', link: '/zh-CN/examples/e-commerce' },
                { text: '内容管理系统', link: '/zh-CN/examples/cms' },
                { text: '后台管理系统', link: '/zh-CN/examples/admin-dashboard' },
                { text: '多租户 SaaS', link: '/zh-CN/examples/multi-tenant-saas' },
                { text: 'RESTful API', link: '/zh-CN/examples/restful-api' },
                { text: '即时通讯系统', link: '/zh-CN/examples/im-chat' },
                { text: '工单客服系统', link: '/zh-CN/examples/ticketing-system' },
                { text: '支付网关集成', link: '/zh-CN/examples/payment-gateway' },
                { text: '数据报表系统', link: '/zh-CN/examples/analytics-reporting' },
                { text: '微服务示例', link: '/zh-CN/examples/microservices' }
              ]
            },
            {
              text: '工具集成',
              items: [
                { text: 'Pint - 代码格式化', link: '/zh-CN/tools/pint' },
                { text: 'PHPStan - 静态分析', link: '/zh-CN/tools/phpstan' },
                { text: 'Rector - 自动重构', link: '/zh-CN/tools/rector' },
                { text: 'Pest - 测试框架', link: '/zh-CN/tools/pest' },
                { text: 'Saloon - HTTP 客户端', link: '/zh-CN/tools/saloon' },
                { text: 'CI/CD 流水线', link: '/zh-CN/tools/ci-pipeline' }
              ]
            },
            {
              text: '编码规范',
              items: [
                { text: 'PER Coding Style', link: '/zh-CN/coding-standards/per-coding-style' },
                { text: 'PHP The Right Way', link: '/zh-CN/coding-standards/php-the-right-way' },
                { text: 'PER 中文完整版', link: '/zh-CN/coding-standards/per-coding-style-chinese' }
              ]
            }
          ]
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Architecture', link: '/en/architecture/directory-structure' },
          { text: 'Examples', link: '/en/examples/e-commerce' },
          { text: 'Tools', link: '/en/tools/pint' },
          { text: 'Coding Standards', link: '/en/coding-standards/per-coding-style' }
        ],
        sidebar: {
          '/en/': [
            {
              text: 'Getting Started',
              items: [
                { text: 'Introduction', link: '/en/introduction' }
              ]
            },
            {
              text: 'Architecture',
              items: [
                { text: 'Directory Structure', link: '/en/architecture/directory-structure' },
                { text: 'Dependency Rules', link: '/en/architecture/dependency-rules' },
                { text: 'Naming Conventions', link: '/en/architecture/naming-conventions' },
                { text: 'Layer Responsibilities', link: '/en/architecture/layer-responsibilities' },
                { text: 'Lightweight Structure', link: '/en/architecture/lightweight-structure' }
              ]
            },
            {
              text: 'System Examples',
              items: [
                { text: 'E-commerce', link: '/en/examples/e-commerce' },
                { text: 'CMS', link: '/en/examples/cms' },
                { text: 'Admin Dashboard', link: '/en/examples/admin-dashboard' },
                { text: 'Multi-tenant SaaS', link: '/en/examples/multi-tenant-saas' },
                { text: 'RESTful API', link: '/en/examples/restful-api' },
                { text: 'IM/Chat System', link: '/en/examples/im-chat' },
                { text: 'Ticketing System', link: '/en/examples/ticketing-system' },
                { text: 'Payment Gateway', link: '/en/examples/payment-gateway' },
                { text: 'Analytics/Reporting', link: '/en/examples/analytics-reporting' },
                { text: 'Microservices', link: '/en/examples/microservices' }
              ]
            },
            {
              text: 'Tool Integration',
              items: [
                { text: 'Pint - Code Formatting', link: '/en/tools/pint' },
                { text: 'PHPStan - Static Analysis', link: '/en/tools/phpstan' },
                { text: 'Rector - Auto Refactoring', link: '/en/tools/rector' },
                { text: 'Pest - Testing Framework', link: '/en/tools/pest' },
                { text: 'Saloon - HTTP Client', link: '/en/tools/saloon' },
                { text: 'CI/CD Pipeline', link: '/en/tools/ci-pipeline' }
              ]
            },
            {
              text: 'Coding Standards',
              items: [
                { text: 'PER Coding Style', link: '/en/coding-standards/per-coding-style' },
                { text: 'PHP The Right Way', link: '/en/coding-standards/php-the-right-way' }
              ]
            }
          ]
        }
      }
    }
  },

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/kitephp/webman-design-guide' }
    ],
    search: {
      provider: 'local'
    }
  }
})
