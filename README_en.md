# Webman Design Guide

> Complete Webman Framework Design Specification, Architecture Guide and Best Practices

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PHP Version](https://img.shields.io/badge/PHP-%3E%3D8.1-blue.svg)](https://www.php.net/)
[![Webman](https://img.shields.io/badge/Webman-%3E%3D2.1-green.svg)](https://www.workerman.net/webman)

English | **[中文](./README.md)**

---

## Table of Contents

### Architecture

- [Directory Structure Specification](./docs/en/architecture/directory-structure.md)
- [Dependency Direction Rules](./docs/en/architecture/dependency-rules.md)
- [Naming Conventions](./docs/en/architecture/naming-conventions.md)
- [Layer Responsibilities](./docs/en/architecture/layer-responsibilities.md)
- [Lightweight Structure for Small Projects](./docs/en/architecture/lightweight-structure.md)

### System Examples

Complete directory structure + code examples showing how to apply architecture specifications in different scenarios:

1. [E-commerce System](./docs/en/examples/e-commerce.md)
2. [Content Management System (CMS)](./docs/en/examples/cms.md)
3. [Admin Dashboard](./docs/en/examples/admin-dashboard.md)
4. [Multi-tenant SaaS](./docs/en/examples/multi-tenant-saas.md)
5. [RESTful API Service](./docs/en/examples/restful-api.md)
6. [IM/Chat System](./docs/en/examples/im-chat.md)
7. [Ticketing/Customer Service System](./docs/en/examples/ticketing-system.md)
8. [Payment Gateway Integration](./docs/en/examples/payment-gateway.md)
9. [Analytics/Reporting System](./docs/en/examples/analytics-reporting.md)
10. [Microservices Example](./docs/en/examples/microservices.md)

### Tool Integration

- [Pint - Code Formatting](./docs/en/tools/pint.md)
- [PHPStan - Static Analysis](./docs/en/tools/phpstan.md)
- [Rector - Auto Refactoring](./docs/en/tools/rector.md)
- [Pest - Testing Framework](./docs/en/tools/pest.md)
- [Saloon - HTTP Client](./docs/en/tools/saloon.md)
- [CI/CD Pipeline](./docs/en/tools/ci-pipeline.md)

### Coding Standards

- [PER Coding Style Overview](./docs/en/coding-standards/per-coding-style.md)
- [PHP The Right Way Overview](./docs/en/coding-standards/php-the-right-way.md)

---

## Quick Start

### Core Principles

1. **Keep Webman Default Directories** - Don't change the framework's original structure
2. **Lowercase Directories** - Cross-platform compatibility
3. **Clear Dependency Direction** - Domain layer doesn't depend on framework
4. **Separate Interface and Implementation** - Use Contract to define interfaces
5. **Follow PER Coding Style** - Unified code style

### Recommended Directory Structure

```
app/
├─ controller/            # Webman default - HTTP entry
├─ model/                 # Webman default - ORM models
├─ middleware/            # Webman default - Middleware
├─ process/               # Webman default - Custom processes
├─ service/               # Application layer - Use case orchestration
├─ domain/                # Domain layer - Business logic
│  └─ <bounded-context>/  # Bounded context (order/user/billing)
│     ├─ entity/          # Entities
│     ├─ enum/            # Enums
│     └─ vo/              # Value objects
│     ├─ event/           # Domain events
│     └─ rule/            # Business rules
├─ contract/              # Interface definitions
├─ infrastructure/        # Infrastructure - Repository implementations
└─ support/               # Common utilities
```

### Dependency Direction

```
controller → service → domain + contract
                    ↓
            infrastructure → contract + domain
```

**Forbidden Reverse Dependencies**:
- ❌ domain cannot depend on framework/model/infrastructure
- ❌ controller cannot directly depend on model/infrastructure

---

## Design Goals

### Why Do We Need This Specification?

1. **Thin Controllers** - Decouple business logic from controllers
2. **Testability** - Domain layer is pure PHP, testable without starting the framework
3. **Maintainability** - Clear layering and dependency direction
4. **Scalability** - Smooth migration to plugin system or microservices
5. **Team Collaboration** - Unified code style and architecture patterns

### Use Cases

**Suitable for this specification**:
- Medium to large projects (expected code > 10k lines)
- Complex business logic (state machines, permissions, calculation rules)
- Multi-person collaborative development
- Projects requiring long-term maintenance

**Optional use**:
- Small CRUD projects
- Rapid prototype validation
- Personal learning projects

---

## Agent Skills

Webman best practice specifications for AI code assistants:

```bash
npx skills add kitephp/webman-design-skills
```

**Repository**: [https://github.com/kitephp/webman-design-skills](https://github.com/kitephp/webman-design-skills)

---

## Contributing

Issues and Pull Requests are welcome!

### Documentation Improvements

- Found errors or unclear content
- Add more system examples
- Improve code examples
- Translation improvements

### Code Example Requirements

- Must follow PER Coding Style
- Include necessary comments
- Show key processes, no need for complete implementation
- Keep code concise and focused

---

## License

MIT License - See [LICENSE](./LICENSE) file

---

## Related Resources

### Official Documentation
- [Webman Official Documentation](https://www.workerman.net/doc/webman/)
- [Workerman Official Documentation](https://www.workerman.net/doc/workerman/)

### PHP Standards
- [PER Coding Style](https://www.php-fig.org/per/coding-style/)
- [PHP The Right Way](https://phptherightway.com/)
- [PHP-FIG PSRs](https://www.php-fig.org/psr/)

### Development Tools
- [Laravel Pint](https://laravel.com/docs/pint)
- [PHPStan](https://phpstan.org/)
- [Rector](https://getrector.com/)
- [Pest PHP](https://pestphp.com/)
- [Saloon](https://docs.saloon.dev/)

---

## Contact

- Submit Issue: [GitHub Issues](https://github.com/kitephp/webman-design-guide/issues)
- Discussions: [GitHub Discussions](https://github.com/kitephp/webman-design-guide/discussions)
