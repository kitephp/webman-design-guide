# Webman Design Guide

> 完整的 Webman 框架设计规范、架构指南和最佳实践

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PHP Version](https://img.shields.io/badge/PHP-%3E%3D8.1-blue.svg)](https://www.php.net/)
[![Webman](https://img.shields.io/badge/Webman-%3E%3D2.1-green.svg)](https://www.workerman.net/webman)

**[English](./README_en.md)** | 中文

---

## 目录

### 架构设计

- [目录结构规范](./docs/zh-CN/architecture/directory-structure.md)
- [依赖方向规则](./docs/zh-CN/architecture/dependency-rules.md)
- [命名规范](./docs/zh-CN/architecture/naming-conventions.md)
- [分层职责](./docs/zh-CN/architecture/layer-responsibilities.md)
- [小型项目架构](./docs/zh-CN/architecture/lightweight-structure.md)

### 系统示例

完整的目录结构 + 代码示例，展示如何在不同场景下应用架构规范：

1. [电商系统](./docs/zh-CN/examples/e-commerce.md)
2. [内容管理系统 (CMS)](./docs/zh-CN/examples/cms.md)
3. [后台管理系统](./docs/zh-CN/examples/admin-dashboard.md)
4. [多租户 SaaS](./docs/zh-CN/examples/multi-tenant-saas.md)
5. [RESTful API 服务](./docs/zh-CN/examples/restful-api.md)
6. [即时通讯系统](./docs/zh-CN/examples/im-chat.md)
7. [工单客服系统](./docs/zh-CN/examples/ticketing-system.md)
8. [支付网关集成](./docs/zh-CN/examples/payment-gateway.md)
9. [数据报表系统](./docs/zh-CN/examples/analytics-reporting.md)
10. [微服务示例](./docs/zh-CN/examples/microservices.md)

### 工具集成

- [Pint - 代码格式化](./docs/zh-CN/tools/pint.md)
- [PHPStan - 静态分析](./docs/zh-CN/tools/phpstan.md)
- [Rector - 自动重构](./docs/zh-CN/tools/rector.md)
- [Pest - 测试框架](./docs/zh-CN/tools/pest.md)
- [Saloon - HTTP 客户端](./docs/zh-CN/tools/saloon.md)
- [CI/CD 流水线](./docs/zh-CN/tools/ci-pipeline.md)

### 编码规范

- [PER Coding Style 概述](./docs/zh-CN/coding-standards/per-coding-style.md)
- [PHP The Right Way 概述](./docs/zh-CN/coding-standards/php-the-right-way.md)
- [PER Coding Style 中文完整版](./docs/zh-CN/coding-standards/per-coding-style-chinese.md)

---

## 快速开始

### 核心原则

1. **保持 Webman 默认目录** - 不改变框架原有结构
2. **目录全小写** - 跨平台兼容性
3. **依赖方向清晰** - Domain 层不依赖框架
4. **接口与实现分离** - 使用 Contract 定义接口
5. **遵循 PER Coding Style** - 统一代码风格

### 推荐目录结构

```
app/
├─ controller/            # Webman 默认 - HTTP 入口
├─ model/                 # Webman 默认 - ORM 模型
├─ middleware/            # Webman 默认 - 中间件
├─ process/               # Webman 默认 - 自定义进程
├─ service/               # 应用层 - 用例编排
├─ domain/                # 领域层 - 业务逻辑
│  └─ <bounded-context>/  # 限界上下文 (order/user/billing)
│     ├─ entity/          # 实体
│     ├─ enum/            # 枚举
│     └─ vo/              # 值对象
│     ├─ event/           # 领域事件
│     └─ rule/            # 业务规则
├─ contract/              # 接口定义
├─ infrastructure/        # 基础设施 - 仓储实现
└─ support/               # 通用工具
```

### 依赖方向

```
controller → service → domain + contract
                    ↓
            infrastructure → contract + domain
```

**禁止反向依赖**：
- ❌ domain 不能依赖 framework/model/infrastructure
- ❌ controller 不能直接依赖 model/infrastructure

---

## 设计目标

### 为什么需要这套规范？

1. **Controller 变薄** - 业务逻辑从控制器中解耦
2. **可测试性** - Domain 层纯 PHP，无需启动框架即可测试
3. **可维护性** - 清晰的分层和依赖方向
4. **可扩展性** - 平滑迁移到插件系统或微服务
5. **团队协作** - 统一的代码风格和架构模式

### 适用场景

**适合使用本规范**：
- 中大型项目（预期代码量 > 10k 行）
- 复杂业务逻辑（状态机、权限、计算规则）
- 多人协作开发
- 需要长期维护的项目

**可选使用**：
- 小型 CRUD 项目
- 快速原型验证
- 个人学习项目

---

## Agent Skills

为 AI 代码助手提供的 Webman 最佳实践规范：

```bash
npx skills add kitephp/webman-design-skills
```

**仓库地址**：[https://github.com/kitephp/webman-design-skills](https://github.com/kitephp/webman-design-skills)

---

## 贡献指南

欢迎提交 Issue 和 Pull Request！

### 文档改进

- 发现错误或不清晰的地方
- 补充更多系统示例
- 改进代码示例
- 翻译改进

### 代码示例要求

- 必须遵循 PER Coding Style
- 包含必要的注释
- 展示关键流程，不需要完整实现
- 代码简洁，突出重点

---

## 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

---

## 相关资源

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

## 联系方式

- 提交 Issue: [GitHub Issues](https://github.com/kitephp/webman-design-guide/issues)
- 讨论交流: [GitHub Discussions](https://github.com/kitephp/webman-design-guide/discussions)
