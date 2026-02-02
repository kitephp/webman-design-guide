# Laravel Pint - 代码格式化工具 | Code Formatting Tool

> 自动格式化 PHP 代码，确保团队代码风格统一
> Automatically format PHP code to ensure consistent team code style

---

## 📋 目录 | Table of Contents

- [简介](#简介)
- [安装与配置](#安装与配置)
- [配置文件](#配置文件)
- [使用方法](#使用方法)
- [CI 集成](#ci-集成)
- [常见问题](#常见问题)
- [最佳实践](#最佳实践)

---

## 简介

### 什么是 Laravel Pint？

Laravel Pint 是一个基于 PHP-CS-Fixer 的零配置代码格式化工具，专为 PHP 项目设计。它支持 PSR-12 和 PER Coding Style 规范。

**核心特性**：
- 零配置开箱即用
- 支持 PSR-12 和 PER-CS
- 快速格式化
- 友好的输出界面
- 支持 Git 集成

### Why Laravel Pint?

Laravel Pint is a zero-configuration code formatter based on PHP-CS-Fixer, designed specifically for PHP projects. It supports PSR-12 and PER Coding Style standards.

**Key Features**:
- Zero configuration out of the box
- Supports PSR-12 and PER-CS
- Fast formatting
- Friendly output interface
- Git integration support

---

## 安装与配置

### 安装 | Installation

```bash
# 安装为开发依赖
composer require --dev laravel/pint

# 验证安装
./vendor/bin/pint --version
```

### 配置 Composer Scripts

在 `composer.json` 中添加快捷命令：

```json
{
    "scripts": {
        "fmt": "pint",
        "fmt:test": "pint --test",
        "fmt:dirty": "pint --dirty"
    },
    "scripts-descriptions": {
        "fmt": "Format all PHP files",
        "fmt:test": "Check code style without modifying files",
        "fmt:dirty": "Format only Git uncommitted files"
    }
}
```

使用方法：

```bash
composer fmt          # 格式化所有文件
composer fmt:test     # 仅检查，不修改
composer fmt:dirty    # 仅格式化未提交的文件
```

---

## 配置文件

### pint.json

在项目根目录创建 `pint.json`：

#### PSR-12 配置 | PSR-12 Configuration

```json
{
    "preset": "psr12",
    "exclude": [
        "vendor",
        "storage",
        "runtime",
        "node_modules"
    ],
    "rules": {
        "blank_line_after_opening_tag": true,
        "blank_line_between_import_groups": true,
        "class_attributes_separation": {
            "elements": {
                "method": "one",
                "property": "one",
                "trait_import": "none"
            }
        },
        "method_argument_space": {
            "on_multiline": "ensure_fully_multiline"
        },
        "no_unused_imports": true,
        "ordered_imports": {
            "sort_algorithm": "alpha"
        },
        "single_import_per_statement": true,
        "trailing_comma_in_multiline": {
            "elements": ["arrays", "arguments", "parameters"]
        }
    }
}
```

#### PER Coding Style 配置 | PER-CS Configuration

```json
{
    "preset": "per",
    "exclude": [
        "vendor",
        "storage",
        "runtime",
        "node_modules"
    ],
    "rules": {
        "blank_line_after_opening_tag": true,
        "blank_line_between_import_groups": true,
        "class_attributes_separation": {
            "elements": {
                "method": "one",
                "property": "one",
                "trait_import": "none",
                "const": "one",
                "case": "none"
            }
        },
        "concat_space": {
            "spacing": "one"
        },
        "declare_strict_types": true,
        "final_class": false,
        "final_internal_class": false,
        "global_namespace_import": {
            "import_classes": true,
            "import_constants": true,
            "import_functions": true
        },
        "method_argument_space": {
            "on_multiline": "ensure_fully_multiline",
            "keep_multiple_spaces_after_comma": false
        },
        "no_unused_imports": true,
        "nullable_type_declaration": {
            "syntax": "question_mark"
        },
        "ordered_imports": {
            "sort_algorithm": "alpha",
            "imports_order": ["class", "function", "const"]
        },
        "phpdoc_align": {
            "align": "left"
        },
        "phpdoc_separation": true,
        "phpdoc_summary": false,
        "single_import_per_statement": true,
        "trailing_comma_in_multiline": {
            "elements": ["arrays", "arguments", "parameters", "match"]
        },
        "type_declaration_spaces": {
            "elements": ["function", "property"]
        },
        "types_spaces": {
            "space": "none"
        }
    }
}
```

### 配置说明 | Configuration Explanation

| 规则 | 说明 | Rule | Description |
|------|------|------|-------------|
| `preset` | 预设规则集 (psr12/per/laravel) | `preset` | Preset rule set |
| `exclude` | 排除的目录 | `exclude` | Excluded directories |
| `declare_strict_types` | 强制 strict_types 声明 | `declare_strict_types` | Enforce strict_types declaration |
| `no_unused_imports` | 移除未使用的 use 语句 | `no_unused_imports` | Remove unused imports |
| `ordered_imports` | 按字母顺序排序 import | `ordered_imports` | Sort imports alphabetically |
| `trailing_comma_in_multiline` | 多行数组/参数尾部逗号 | `trailing_comma_in_multiline` | Trailing comma in multiline |

---

## 使用方法

### 基本命令 | Basic Commands

```bash
# 格式化所有文件
./vendor/bin/pint

# 格式化指定目录
./vendor/bin/pint app/domain
./vendor/bin/pint app/service app/controller

# 格式化指定文件
./vendor/bin/pint app/domain/order/entity/Order.php

# 仅检查，不修改文件（CI 中使用）
./vendor/bin/pint --test

# 仅格式化 Git 未提交的文件
./vendor/bin/pint --dirty

# 显示详细输出
./vendor/bin/pint -v

# 显示所有修改的文件
./vendor/bin/pint -vv

# 显示所有修改的详细信息
./vendor/bin/pint -vvv
```

### 使用场景 | Use Cases

#### 场景 1：开发时自动格式化

```bash
# 保存文件后运行
composer fmt

# 或使用 Git hooks（见下文）
```

#### 场景 2：提交前检查

```bash
# 仅格式化修改的文件
composer fmt:dirty

# 检查是否符合规范
composer fmt:test
```

#### 场景 3：CI 中验证

```bash
# 在 CI 中运行，如果不符合规范则失败
./vendor/bin/pint --test
```

---

## CI 集成

### GitHub Actions

在 `.github/workflows/code-quality.yml` 中添加：

```yaml
name: Code Quality

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  pint:
    name: Laravel Pint
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: 8.3
          coverage: none

      - name: Install dependencies
        run: composer install --prefer-dist --no-progress --no-interaction

      - name: Run Pint
        run: ./vendor/bin/pint --test -v
```

### GitLab CI

在 `.gitlab-ci.yml` 中添加：

```yaml
pint:
  stage: test
  image: php:8.3-cli
  before_script:
    - curl -sS https://getcomposer.org/installer | php
    - php composer.phar install --prefer-dist --no-progress
  script:
    - ./vendor/bin/pint --test -v
  only:
    - merge_requests
    - main
    - develop
```

### Git Hooks (Pre-commit)

创建 `.git/hooks/pre-commit`：

```bash
#!/bin/bash

# 获取所有待提交的 PHP 文件
FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.php$')

if [ -z "$FILES" ]; then
    exit 0
fi

# 运行 Pint
./vendor/bin/pint $FILES

# 重新添加格式化后的文件
git add $FILES

exit 0
```

赋予执行权限：

```bash
chmod +x .git/hooks/pre-commit
```

**推荐使用 Husky 或 GrumPHP 管理 Git Hooks**。

---

## 常见问题

### Q1: Pint 修改了我不想改的文件

**问题**：Pint 格式化了 vendor 或第三方代码。

**解决方案**：在 `pint.json` 中添加 `exclude`：

```json
{
    "exclude": [
        "vendor",
        "storage",
        "runtime",
        "node_modules",
        "public/static"
    ]
}
```

### Q2: 如何忽略特定文件？

**方法 1**：使用 `.gitignore` 风格的 `exclude`：

```json
{
    "exclude": [
        "app/legacy/*",
        "tests/fixtures/*"
    ]
}
```

**方法 2**：在文件中添加注释（不推荐）：

```php
<?php

// @formatter:off
class LegacyCode
{
    // 保持原有格式
}
// @formatter:on
```

### Q3: Pint 和 PHP-CS-Fixer 冲突

**问题**：项目中同时使用了 Pint 和 PHP-CS-Fixer。

**解决方案**：
- **推荐**：只使用 Pint（更简单）
- 如果必须使用 PHP-CS-Fixer，移除 Pint
- 不要同时使用两者

### Q4: 如何在 IDE 中集成？

#### PHPStorm

1. 安装 "Laravel Pint" 插件
2. Settings → Tools → Laravel Pint
3. 配置 Pint 路径：`vendor/bin/pint`
4. 启用 "Run on save"

#### VS Code

1. 安装 "Laravel Pint" 扩展
2. 在 `settings.json` 中配置：

```json
{
    "laravel-pint.enable": true,
    "laravel-pint.runOnSave": true,
    "laravel-pint.configPath": "pint.json"
}
```

### Q5: Pint 运行很慢

**优化方案**：

```bash
# 仅格式化修改的文件
./vendor/bin/pint --dirty

# 使用并行处理（需要 PHP 8.1+）
./vendor/bin/pint --parallel

# 指定具体目录
./vendor/bin/pint app/domain app/service
```

---

## 最佳实践

### ✅ DO

1. **在项目初期配置 Pint**
   ```bash
   composer require --dev laravel/pint
   # 立即创建 pint.json
   ```

2. **使用 PER Coding Style 预设**
   ```json
   {
       "preset": "per"
   }
   ```

3. **配置 Git Hooks**
   - 提交前自动格式化
   - 避免提交不规范的代码

4. **在 CI 中验证**
   ```bash
   ./vendor/bin/pint --test
   ```

5. **团队统一配置**
   - 将 `pint.json` 提交到版本控制
   - 所有成员使用相同配置

6. **使用 Composer Scripts**
   ```bash
   composer fmt        # 简单易记
   composer fmt:test   # CI 中使用
   ```

### ❌ DON'T

1. **不要手动格式化代码**
   - ❌ 手动调整缩进和空格
   - ✅ 让 Pint 自动处理

2. **不要忽略 Pint 的修改**
   - ❌ 格式化后不提交
   - ✅ 格式化后立即提交

3. **不要在生产环境安装 Pint**
   ```bash
   # ❌ 错误
   composer require laravel/pint

   # ✅ 正确
   composer require --dev laravel/pint
   ```

4. **不要过度自定义规则**
   - ❌ 修改大量默认规则
   - ✅ 使用预设，仅调整必要规则

5. **不要格式化第三方代码**
   ```json
   {
       "exclude": ["vendor", "storage"]
   }
   ```

---

## 工作流示例

### 日常开发流程

```bash
# 1. 编写代码
vim app/service/order/CreateOrderService.php

# 2. 保存后格式化
composer fmt

# 3. 查看修改
git diff

# 4. 提交代码
git add .
git commit -m "feat: add CreateOrderService"
```

### Code Review 流程

```bash
# 1. 创建分支
git checkout -b feature/new-service

# 2. 开发功能
# ... 编写代码 ...

# 3. 提交前格式化
composer fmt:dirty

# 4. 检查是否符合规范
composer fmt:test

# 5. 提交并推送
git add .
git commit -m "feat: implement new service"
git push origin feature/new-service

# 6. CI 自动验证代码风格
```

---

## 与其他工具配合

### Pint + PHPStan

```bash
# 先格式化，再静态分析
composer fmt && composer stan
```

在 `composer.json` 中：

```json
{
    "scripts": {
        "check": [
            "@fmt:test",
            "@stan"
        ]
    }
}
```

### Pint + Pest

```bash
# 格式化后运行测试
composer fmt && composer test
```

### 完整质量检查

```json
{
    "scripts": {
        "quality": [
            "@fmt:test",
            "@stan",
            "@test"
        ]
    }
}
```

运行：

```bash
composer quality
```

---

## 相关文档

- [PHPStan 静态分析](./phpstan.md)
- [Rector 自动重构](./rector.md)
- [Pest 测试框架](./pest.md)
- [CI/CD 流水线](./ci-pipeline.md)
- [PER Coding Style](../coding-standards/per-coding-style.md)

---

## 参考资源

- [Laravel Pint 官方文档](https://laravel.com/docs/pint)
- [PHP-CS-Fixer 规则](https://mlocati.github.io/php-cs-fixer-configurator/)
- [PER Coding Style](https://www.php-fig.org/per/coding-style/)
- [PSR-12](https://www.php-fig.org/psr/psr-12/)

---

**最后更新 | Last Updated**: 2026-02-02
