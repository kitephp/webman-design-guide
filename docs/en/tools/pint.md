---
title: "Laravel Pint - Code Formatting Tool"
description: "Automatically format PHP code to ensure consistent team code style"
---

# Laravel Pint - Code Formatting Tool

> Automatically format PHP code to ensure consistent team code style

---

## Table of Contents

- [Introduction](#introduction)
- [Installation and Configuration](#installation-and-configuration)
- [Configuration File](#configuration-file)
- [Usage](#usage)
- [CI Integration](#ci-integration)
- [Common Issues](#common-issues)
- [Best Practices](#best-practices)

---

## Introduction

### What is Laravel Pint?

Laravel Pint is a zero-configuration code formatter based on PHP-CS-Fixer, designed specifically for PHP projects. It supports PSR-12 and PER Coding Style standards.

**Key Features**:
- Zero configuration out of the box
- Supports PSR-12 and PER-CS
- Fast formatting
- Friendly output interface
- Git integration support

---

## Installation and Configuration

### Installation

```bash
# Install as dev dependency
composer require --dev laravel/pint

# Verify installation
./vendor/bin/pint --version
```

### Configure Composer Scripts

Add shortcut commands in `composer.json`:

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

Usage:

```bash
composer fmt          # Format all files
composer fmt:test     # Check only, no modifications
composer fmt:dirty    # Format only uncommitted files
```

---

## Configuration File

### pint.json

Create `pint.json` in the project root:

#### PSR-12 Configuration

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

#### PER Coding Style Configuration

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

### Configuration Explanation

| Rule | Description |
|------|-------------|
| `preset` | Preset rule set (psr12/per/laravel) |
| `exclude` | Excluded directories |
| `declare_strict_types` | Enforce strict_types declaration |
| `no_unused_imports` | Remove unused imports |
| `ordered_imports` | Sort imports alphabetically |
| `trailing_comma_in_multiline` | Trailing comma in multiline |

---

## Usage

### Basic Commands

```bash
# Format all files
./vendor/bin/pint

# Format specific directory
./vendor/bin/pint app/domain
./vendor/bin/pint app/service app/controller

# Format specific file
./vendor/bin/pint app/domain/order/entity/Order.php

# Check only, don't modify files (for CI)
./vendor/bin/pint --test

# Format only Git uncommitted files
./vendor/bin/pint --dirty

# Show verbose output
./vendor/bin/pint -v

# Show all modified files
./vendor/bin/pint -vv

# Show all modification details
./vendor/bin/pint -vvv
```

### Use Cases

#### Case 1: Auto-format during development

```bash
# Run after saving file
composer fmt

# Or use Git hooks (see below)
```

#### Case 2: Pre-commit check

```bash
# Format only modified files
composer fmt:dirty

# Check compliance
composer fmt:test
```

#### Case 3: CI validation

```bash
# Run in CI, fail if non-compliant
./vendor/bin/pint --test
```

---

## CI Integration

### GitHub Actions

Add to `.github/workflows/code-quality.yml`:

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

Add to `.gitlab-ci.yml`:

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

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash

# Get all PHP files to be committed
FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.php$')

if [ -z "$FILES" ]; then
    exit 0
fi

# Run Pint
./vendor/bin/pint $FILES

# Re-add formatted files
git add $FILES

exit 0
```

Grant execute permission:

```bash
chmod +x .git/hooks/pre-commit
```

**Recommend using Husky or GrumPHP to manage Git Hooks**.

---

## Common Issues

### Q1: Pint modified files I didn't want changed

**Problem**: Pint formatted vendor or third-party code.

**Solution**: Add `exclude` in `pint.json`:

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

### Q2: How to ignore specific files?

**Method 1**: Use `.gitignore` style `exclude`:

```json
{
    "exclude": [
        "app/legacy/*",
        "tests/fixtures/*"
    ]
}
```

**Method 2**: Add comments in file (not recommended):

```php
<?php

// @formatter:off
class LegacyCode
{
    // Keep original format
}
// @formatter:on
```

### Q3: Pint and PHP-CS-Fixer conflict

**Problem**: Project uses both Pint and PHP-CS-Fixer.

**Solution**:
- **Recommended**: Use only Pint (simpler)
- If PHP-CS-Fixer is required, remove Pint
- Don't use both simultaneously

### Q4: How to integrate with IDE?

#### PHPStorm

1. Install "Laravel Pint" plugin
2. Settings -> Tools -> Laravel Pint
3. Configure Pint path: `vendor/bin/pint`
4. Enable "Run on save"

#### VS Code

1. Install "Laravel Pint" extension
2. Configure in `settings.json`:

```json
{
    "laravel-pint.enable": true,
    "laravel-pint.runOnSave": true,
    "laravel-pint.configPath": "pint.json"
}
```

### Q5: Pint runs slowly

**Optimization**:

```bash
# Format only modified files
./vendor/bin/pint --dirty

# Use parallel processing (requires PHP 8.1+)
./vendor/bin/pint --parallel

# Specify specific directories
./vendor/bin/pint app/domain app/service
```

---

## Best Practices

### Recommended

1. **Configure Pint early in the project**
   ```bash
   composer require --dev laravel/pint
   # Create pint.json immediately
   ```

2. **Use PER Coding Style preset**
   ```json
   {
       "preset": "per"
   }
   ```

3. **Configure Git Hooks**
   - Auto-format before commit
   - Avoid committing non-compliant code

4. **Validate in CI**
   ```bash
   ./vendor/bin/pint --test
   ```

5. **Unified team configuration**
   - Commit `pint.json` to version control
   - All members use the same configuration

6. **Use Composer Scripts**
   ```bash
   composer fmt        # Easy to remember
   composer fmt:test   # For CI
   ```

### Avoid

1. **Don't manually format code**
   - Manually adjusting indentation and spaces
   - Let Pint handle it automatically

2. **Don't ignore Pint's modifications**
   - Not committing after formatting
   - Commit immediately after formatting

3. **Don't install Pint in production**
   ```bash
   # Wrong
   composer require laravel/pint

   # Correct
   composer require --dev laravel/pint
   ```

4. **Don't over-customize rules**
   - Modifying many default rules
   - Use presets, only adjust necessary rules

5. **Don't format third-party code**
   ```json
   {
       "exclude": ["vendor", "storage"]
   }
   ```

---

## Workflow Examples

### Daily Development Flow

```bash
# 1. Write code
vim app/service/order/CreateOrderService.php

# 2. Format after saving
composer fmt

# 3. View changes
git diff

# 4. Commit code
git add .
git commit -m "feat: add CreateOrderService"
```

### Code Review Flow

```bash
# 1. Create branch
git checkout -b feature/new-service

# 2. Develop feature
# ... write code ...

# 3. Format before commit
composer fmt:dirty

# 4. Check compliance
composer fmt:test

# 5. Commit and push
git add .
git commit -m "feat: implement new service"
git push origin feature/new-service

# 6. CI auto-validates code style
```

---

## Integration with Other Tools

### Pint + PHPStan

```bash
# Format first, then static analysis
composer fmt && composer stan
```

In `composer.json`:

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
# Run tests after formatting
composer fmt && composer test
```

### Complete Quality Check

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

Run:

```bash
composer quality
```

---

## Related Documentation

- [PHPStan Static Analysis](./phpstan)
- [Rector Auto Refactoring](./rector)
- [Pest Testing Framework](./pest)
- [CI/CD Pipeline](./ci-pipeline)
- [PER Coding Style](../coding-standards/per-coding-style)

---

## Reference Resources

- [Laravel Pint Official Documentation](https://laravel.com/docs/pint)
- [PHP-CS-Fixer Rules](https://mlocati.github.io/php-cs-fixer-configurator/)
- [PER Coding Style](https://www.php-fig.org/per/coding-style/)
- [PSR-12](https://www.php-fig.org/psr/psr-12/)
