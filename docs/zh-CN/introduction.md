---
title: "Webman 设计指南"
description: "完整的 Webman 框架设计规范、架构指南和最佳实践"
---

# Webman 设计指南

> 完整的 Webman 框架设计规范、架构指南和最佳实践

## 关于本指南

本指南提供了一套完整的 Webman 框架设计规范，帮助开发者构建可维护、可测试、可扩展的应用程序。

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
- domain 不能依赖 framework/model/infrastructure
- controller 不能直接依赖 model/infrastructure

## 快速开始

### 1. 选择系统示例

根据你的项目类型，选择对应的系统示例：

- **电商/订单系统** → [电商系统](examples/e-commerce)
- **内容发布** → [CMS](examples/cms)
- **管理后台** → [后台管理系统](examples/admin-dashboard)
- **SaaS 产品** → [多租户 SaaS](examples/multi-tenant-saas)
- **纯 API** → [RESTful API](examples/restful-api)
- **实时通讯** → [即时通讯系统](examples/im-chat)
- **工单流程** → [工单客服系统](examples/ticketing-system)
- **支付集成** → [支付网关集成](examples/payment-gateway)
- **数据分析** → [数据报表系统](examples/analytics-reporting)
- **服务拆分** → [微服务示例](examples/microservices)

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

详细配置见 [CI/CD Pipeline](tools/ci-pipeline)

### 3. 遵循编码规范

所有代码必须遵循：
- [PER Coding Style](coding-standards/per-coding-style) - 代码风格
- [PHP The Right Way](coding-standards/php-the-right-way) - 最佳实践

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

## Agent Skills

为 AI 代码助手提供的 Webman 最佳实践规范：

```bash
npx skills add kitephp/webman-design-skills
```

该 Skills 包含 25+ 条规范检查规则，涵盖架构设计、命名规范、代码风格和领域模式，帮助 AI 助手在开发 Webman 项目时自动遵循最佳实践。

**仓库地址**：[webman-design-skills](https://github.com/kitephp/webman-design-skills)

## 许可证

MIT License - 详见 [LICENSE](https://github.com/kitephp/webman-design-guide/blob/main/LICENSE) 文件

---

> 本文档由 AI 生成
