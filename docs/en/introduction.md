---
title: "Webman Design Guide"
description: "Complete Webman Framework Design Specification, Architecture Guide and Best Practices"
---

# Webman Design Guide

> Complete Webman Framework Design Specification, Architecture Guide and Best Practices

## About This Guide

This guide provides a complete set of Webman framework design specifications to help developers build maintainable, testable, and scalable applications.

### Core Principles

1. **Keep Webman Default Directories** - Don't change the framework's original structure
2. **Lowercase Directories** - Cross-platform compatibility
3. **Clear Dependency Direction** - Domain layer doesn't depend on framework
4. **Separate Interface and Implementation** - Use Contract to define interfaces
5. **Follow PER Coding Style** - Unified code style

### Recommended Directory Structure

```
app/
├─ controller/            # Webman Default - HTTP Entry
├─ model/                 # Webman Default - ORM Models
├─ middleware/            # Webman Default - Middleware
├─ process/               # Webman Default - Custom Processes
├─ service/               # Application Layer - Use Case Orchestration
├─ domain/                # Domain Layer - Business Logic
│  └─ <bounded-context>/  # Bounded Context (order/user/billing)
├─ contract/              # Interface Definitions
├─ infrastructure/        # Infrastructure - Repository Implementation
└─ support/               # Common Utilities
```

### Dependency Direction

```
controller → service → domain + contract
                    ↓
            infrastructure → contract + domain
```

**Forbidden Reverse Dependencies**:
- domain cannot depend on framework/model/infrastructure
- controller cannot directly depend on model/infrastructure

## Quick Start

### 1. Choose System Example

Choose the corresponding system example based on your project type:

- **E-commerce/Order System** → [E-commerce System](examples/e-commerce)
- **Content Publishing** → [CMS](examples/cms)
- **Admin Panel** → [Admin Dashboard](examples/admin-dashboard)
- **SaaS Product** → [Multi-tenant SaaS](examples/multi-tenant-saas)
- **Pure API** → [RESTful API](examples/restful-api)
- **Real-time Communication** → [Instant Messaging System](examples/im-chat)
- **Ticket Workflow** → [Ticketing System](examples/ticketing-system)
- **Payment Integration** → [Payment Gateway Integration](examples/payment-gateway)
- **Data Analytics** → [Analytics Reporting System](examples/analytics-reporting)
- **Service Splitting** → [Microservices Example](examples/microservices)

### 2. Configure Development Tools

Configure your development environment following the tool integration guide:

```bash
# Install development tools
composer require --dev laravel/pint
composer require --dev phpstan/phpstan
composer require --dev rector/rector
composer require --dev pestphp/pest

# Configure composer scripts
composer fmt      # Format code
composer lint     # Check code style
composer stan     # Static analysis
composer test     # Run tests
```

See [CI/CD Pipeline](tools/ci-pipeline) for detailed configuration

### 3. Follow Coding Standards

All code must follow:
- [PER Coding Style](coding-standards/per-coding-style) - Code Style
- [PHP The Right Way](coding-standards/php-the-right-way) - Best Practices

## Design Goals

### Why Do We Need This Specification?

1. **Thin Controllers** - Decouple business logic from controllers
2. **Testability** - Domain layer is pure PHP, can be tested without starting the framework
3. **Maintainability** - Clear layering and dependency direction
4. **Scalability** - Smooth migration to plugin system or microservices
5. **Team Collaboration** - Unified code style and architecture patterns

### Applicable Scenarios

**Suitable for this specification**:
- Medium to large projects (expected code > 10k lines)
- Complex business logic (state machines, permissions, calculation rules)
- Multi-person collaborative development
- Projects requiring long-term maintenance

**Optional use**:
- Small CRUD projects
- Rapid prototype validation
- Personal learning projects

## Agent Skills

Webman best practice specifications for AI code assistants:

```bash
npx skills add kitephp/webman-design-skills
```

This Skills package contains 25+ specification check rules, covering architecture design, naming conventions, code style, and domain patterns, helping AI assistants automatically follow best practices when developing Webman projects.

**Repository**: [webman-design-skills](https://github.com/kitephp/webman-design-skills)

## License

MIT License - See [LICENSE](https://github.com/kitephp/webman-design-guide/blob/main/LICENSE) file for details

---

> This documentation is AI-generated
