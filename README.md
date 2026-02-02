# Webman Design Guide

> 完整的 Webman 框架设计规范、架构指南和最佳实践
> Complete Webman Framework Design Specification, Architecture Guide and Best Practices

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PHP Version](https://img.shields.io/badge/PHP-%3E%3D8.1-blue.svg)](https://www.php.net/)
[![Webman](https://img.shields.io/badge/Webman-%3E%3D1.5-green.svg)](https://www.workerman.net/webman)

---

## 📚 目录 | Table of Contents

### 🏗️ 架构设计 | Architecture

- [目录结构规范](./docs/architecture/directory-structure.md) - Directory Structure Specification
- [依赖方向规则](./docs/architecture/dependency-rules.md) - Dependency Direction Rules
- [命名规范](./docs/architecture/naming-conventions.md) - Naming Conventions
- [分层职责](./docs/architecture/layer-responsibilities.md) - Layer Responsibilities
- [小型项目架构](./docs/architecture/lightweight-structure.md) - Lightweight Structure for Small Projects

### 💡 系统示例 | System Examples

完整的目录结构 + 代码示例，展示如何在不同场景下应用架构规范：

1. [电商系统](./docs/examples/e-commerce.md) - E-commerce System
2. [内容管理系统 (CMS)](./docs/examples/cms.md) - Content Management System
3. [后台管理系统](./docs/examples/admin-dashboard.md) - Admin Dashboard
4. [多租户 SaaS](./docs/examples/multi-tenant-saas.md) - Multi-tenant SaaS
5. [RESTful API 服务](./docs/examples/restful-api.md) - RESTful API Service
6. [即时通讯系统](./docs/examples/im-chat.md) - IM/Chat System (WebSocket)
7. [工单客服系统](./docs/examples/ticketing-system.md) - Ticketing/Customer Service System
8. [支付网关集成](./docs/examples/payment-gateway.md) - Payment Gateway Integration
9. [数据报表系统](./docs/examples/analytics-reporting.md) - Analytics/Reporting System
10. [微服务示例](./docs/examples/microservices.md) - Microservices Example

### 🛠️ 工具集成 | Tool Integration

- [Pint - 代码格式化](./docs/tools/pint.md) - Code Formatting
- [PHPStan - 静态分析](./docs/tools/phpstan.md) - Static Analysis
- [Rector - 自动重构](./docs/tools/rector.md) - Auto Refactoring
- [Pest - 测试框架](./docs/tools/pest.md) - Testing Framework
- [Saloon - HTTP 客户端](./docs/tools/saloon.md) - HTTP Client (vs Guzzle)
- [CI/CD 流水线](./docs/tools/ci-pipeline.md) - CI/CD Pipeline Integration

### 📖 编码规范 | Coding Standards

- [PER Coding Style 概述](./docs/coding-standards/per-coding-style.md) - PER Coding Style Overview
- [PHP The Right Way 概述](./docs/coding-standards/php-the-right-way.md) - PHP The Right Way Overview

### 🌏 中文翻译 | Chinese Translations

- [PER Coding Style 中文版](./docs/translates/per-coding-style-chinese.md)

### 🤖 Agent Skills

为 AI 代码助手提供的 Webman 最佳实践规范：

**安装方式**：
```bash
npx skills add kitephp/webman-design-skills
```

**仓库地址**：[https://github.com/kitephp/webman-design-skills](https://github.com/kitephp/webman-design-skills)

该 Skills 包含 25+ 条规范检查规则，涵盖架构设计、命名规范、代码风格和领域模式，帮助 AI 助手在开发 Webman 项目时自动遵循最佳实践。

---

## 🚀 快速开始 | Quick Start

### 核心原则 | Core Principles

1. **保持 Webman 默认目录** - 不改变框架原有结构
2. **目录全小写** - 跨平台兼容性
3. **依赖方向清晰** - Domain 层不依赖框架
4. **接口与实现分离** - 使用 Contract 定义接口
5. **遵循 PER Coding Style** - 统一代码风格

### 推荐目录结构 | Recommended Directory Structure

```
app/
├─ controller/            # Webman 默认 - HTTP 入口
├─ model/                 # Webman 默认 - ORM 模型
├─ middleware/            # Webman 默认 - 中间件
├─ process/               # Webman 默认 - 自定义进程
├─ service/               # 应用层 - 用例编排
├─ domain/                # 领域层 - 业务逻辑
│  └─ <bounded-context>/  # 限界上下文 (order/user/billing)
├─ contract/              # 接口定义
├─ infrastructure/        # 基础设施 - 仓储实现
└─ support/               # 通用工具
```

### 依赖方向 | Dependency Direction

```
controller → service → domain + contract
                    ↓
            infrastructure → contract + domain
```

**禁止反向依赖**：
- ❌ domain 不能依赖 framework/model/infrastructure
- ❌ controller 不能直接依赖 model/infrastructure

---

## 📋 使用指南 | Usage Guide

### 1. 选择系统示例

根据你的项目类型，选择对应的系统示例：

- **电商/订单系统** → [E-commerce Example](./docs/examples/e-commerce.md)
- **内容发布** → [CMS Example](./docs/examples/cms.md)
- **管理后台** → [Admin Dashboard Example](./docs/examples/admin-dashboard.md)
- **SaaS 产品** → [Multi-tenant SaaS Example](./docs/examples/multi-tenant-saas.md)
- **纯 API** → [RESTful API Example](./docs/examples/restful-api.md)
- **实时通讯** → [IM/Chat Example](./docs/examples/im-chat.md)
- **工单流程** → [Ticketing System Example](./docs/examples/ticketing-system.md)
- **支付集成** → [Payment Gateway Example](./docs/examples/payment-gateway.md)
- **数据分析** → [Analytics/Reporting Example](./docs/examples/analytics-reporting.md)
- **服务拆分** → [Microservices Example](./docs/examples/microservices.md)

### 2. 配置开发工具

按照工具集成指南配置你的开发环境：

```bash
# 安装开发工具
composer require --dev laravel/pint
composer require --dev phpstan/phpstan
composer require --dev rector/rector
composer require --dev pestphp/pest

# 配置 composer scripts
composer fmt      # 格式化代码
composer lint     # 检查代码风格
composer stan     # 静态分析
composer test     # 运行测试
```

详细配置见 [CI/CD Pipeline](./docs/tools/ci-pipeline.md)

### 3. 遵循编码规范

所有代码必须遵循：
- [PER Coding Style](./docs/coding-standards/per-coding-style.md) - 代码风格
- [PHP The Right Way](./docs/coding-standards/php-the-right-way.md) - 最佳实践

---

## 🎯 设计目标 | Design Goals

### 为什么需要这套规范？

1. **Controller 变薄** - 业务逻辑从控制器中解耦
2. **可测试性** - Domain 层纯 PHP，无需启动框架即可测试
3. **可维护性** - 清晰的分层和依赖方向
4. **可扩展性** - 平滑迁移到插件系统或微服务
5. **团队协作** - 统一的代码风格和架构模式

### 适用场景

✅ **适合使用本规范**：
- 中大型项目（预期代码量 > 10k 行）
- 复杂业务逻辑（状态机、权限、计算规则）
- 多人协作开发
- 需要长期维护的项目

⚠️ **可选使用**：
- 小型 CRUD 项目
- 快速原型验证
- 个人学习项目

---

## 🤝 贡献指南 | Contributing

欢迎提交 Issue 和 Pull Request！

### 文档改进

- 发现错误或不清晰的地方
- 补充更多系统示例
- 改进代码示例
- 翻译改进

### 代码示例要求

- 必须遵循 PER Coding Style
- 包含必要的注释（中英文）
- 展示关键流程，不需要完整实现
- 代码简洁，突出重点

---

## 📄 许可证 | License

MIT License - 详见 [LICENSE](./LICENSE) 文件

---

## 🔗 相关资源 | Related Resources

### 官方文档
- [Webman 官方文档](https://www.workerman.net/doc/webman/)
- [Workerman 官方文档](https://www.workerman.net/doc/workerman/)

### PHP 规范
- [PER Coding Style](https://www.php-fig.org/per/coding-style/)
- [PHP The Right Way](https://phptherightway.com/)
- [PHP-FIG PSRs](https://www.php-fig.org/psr/)

### 开发工具
- [Laravel Pint](https://laravel.com/docs/pint)
- [PHPStan](https://phpstan.org/)
- [Rector](https://getrector.com/)
- [Pest PHP](https://pestphp.com/)
- [Saloon](https://docs.saloon.dev/)

---

## 📮 联系方式 | Contact

- 提交 Issue: [GitHub Issues](https://github.com/kitephp/webman-design-guide/issues)
- 讨论交流: [GitHub Discussions](https://github.com/kitephp/webman-design-guide/discussions)

---

**最后更新 | Last Updated**: 2026-02-02

---

> 📝 **本文档由 AI 生成** | This documentation is AI-generated
