---
title: "CI/CD Pipeline Integration"
description: "Complete CI/CD configuration for automated code quality checks"
---

# CI/CD Pipeline Integration

> Complete CI/CD configuration for automated code quality checks

---

## Table of Contents

- [Introduction](#introduction)
- [Composer Scripts Configuration](#composer-scripts-configuration)
- [GitHub Actions Complete Examples](#github-actions-complete-examples)
- [GitLab CI Complete Examples](#gitlab-ci-complete-examples)
- [Caching Strategies](#caching-strategies)
- [Badge Configuration](#badge-configuration)
- [Best Practices](#best-practices)

---

## Introduction

### What is CI/CD?

CI/CD (Continuous Integration/Continuous Deployment) is a software development practice that ensures code quality and fast delivery through automated build, test, and deployment processes.

**Core Values**:
- Automated code quality checks
- Early problem detection
- Reduced manual review burden
- Consistent code standards
- Improved team collaboration

### Tool Chain Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CI/CD Pipeline                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Code Formatting (Pint)                              │
│     └─ Check code style compliance                      │
│                                                          │
│  2. Static Analysis (PHPStan)                           │
│     └─ Find type errors and bugs                        │
│                                                          │
│  3. Refactoring Check (Rector)                          │
│     └─ Ensure code modernization                        │
│                                                          │
│  4. Unit Tests (Pest)                                   │
│     └─ Verify functionality                             │
│                                                          │
│  5. Code Coverage                                       │
│     └─ Ensure adequate test coverage                    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Composer Scripts Configuration

### Complete Configuration

Add complete script configuration to `composer.json`:

```json
{
    "scripts": {
        "fmt": "pint",
        "fmt:test": "pint --test",
        "fmt:dirty": "pint --dirty",

        "stan": "phpstan analyse --memory-limit=2G",
        "stan:baseline": "phpstan analyse --generate-baseline",
        "stan:clear": "phpstan clear-result-cache",

        "rector": "rector process --dry-run",
        "rector:fix": "rector process",
        "rector:clear": "rm -rf runtime/cache/rector",

        "test": "pest",
        "test:unit": "pest --testsuite=Unit",
        "test:feature": "pest --testsuite=Feature",
        "test:coverage": "pest --coverage --min=80",
        "test:parallel": "pest --parallel",

        "quality": [
            "@fmt:test",
            "@stan",
            "@rector",
            "@test"
        ],

        "quality:fix": [
            "@fmt",
            "@rector:fix",
            "@test"
        ],

        "ci": [
            "@fmt:test",
            "@stan",
            "@rector",
            "@test:coverage"
        ]
    },
    "scripts-descriptions": {
        "fmt": "Format all PHP files",
        "fmt:test": "Check code style without modifying files",
        "fmt:dirty": "Format only Git uncommitted files",

        "stan": "Run PHPStan static analysis",
        "stan:baseline": "Generate baseline for existing errors",
        "stan:clear": "Clear PHPStan result cache",

        "rector": "Preview refactoring changes (dry-run)",
        "rector:fix": "Apply refactoring changes",
        "rector:clear": "Clear Rector cache",

        "test": "Run all tests",
        "test:unit": "Run unit tests only",
        "test:feature": "Run feature tests only",
        "test:coverage": "Run tests with coverage report",
        "test:parallel": "Run tests in parallel",

        "quality": "Run all quality checks",
        "quality:fix": "Fix all quality issues",
        "ci": "Run CI pipeline locally"
    }
}
```

### Usage

```bash
# Local development
composer fmt              # Format code
composer stan             # Static analysis
composer test             # Run tests

# Fix issues
composer quality:fix      # Auto-fix all issues

# Complete check (before CI)
composer quality          # Run all checks

# Simulate CI environment
composer ci               # Run CI pipeline
```

---

## GitHub Actions Complete Examples

### Basic Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  code-quality:
    name: Code Quality
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: 8.3
          extensions: mbstring, pdo, pdo_mysql, redis
          coverage: xdebug
          tools: composer:v2

      - name: Get Composer cache directory
        id: composer-cache
        run: echo "dir=$(composer config cache-files-dir)" >> $GITHUB_OUTPUT

      - name: Cache Composer dependencies
        uses: actions/cache@v3
        with:
          path: ${{ steps.composer-cache.outputs.dir }}
          key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
          restore-keys: ${{ runner.os }}-composer-

      - name: Install dependencies
        run: composer install --prefer-dist --no-progress --no-interaction

      - name: Run Pint
        run: composer fmt:test

      - name: Run PHPStan
        run: composer stan

      - name: Run Rector
        run: composer rector

      - name: Run Tests
        run: composer test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml
          fail_ci_if_error: true
```

### Multi-version Testing

Create `.github/workflows/tests.yml`:

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  tests:
    name: PHP ${{ matrix.php }} - ${{ matrix.os }}
    runs-on: ${{ matrix.os }}

    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest]
        php: [8.1, 8.2, 8.3]
        include:
          - os: windows-latest
            php: 8.3
          - os: macos-latest
            php: 8.3

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: ${{ matrix.php }}
          extensions: mbstring, pdo, pdo_mysql, redis
          coverage: xdebug

      - name: Install dependencies
        run: composer install --prefer-dist --no-progress --no-interaction

      - name: Run tests
        run: composer test

      - name: Upload coverage
        if: matrix.php == '8.3' && matrix.os == 'ubuntu-latest'
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml
```

### Complete Parallel Workflow

Create `.github/workflows/quality.yml`:

```yaml
name: Quality

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  pint:
    name: Code Style (Pint)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with:
          php-version: 8.3
          coverage: none
      - run: composer install --prefer-dist --no-progress
      - run: composer fmt:test

  phpstan:
    name: Static Analysis (PHPStan)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with:
          php-version: 8.3
          coverage: none
      - uses: actions/cache@v3
        with:
          path: runtime/cache/phpstan
          key: phpstan-${{ github.sha }}
          restore-keys: phpstan-
      - run: composer install --prefer-dist --no-progress
      - run: composer stan

  rector:
    name: Refactoring (Rector)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with:
          php-version: 8.3
          coverage: none
      - run: composer install --prefer-dist --no-progress
      - run: composer rector

  tests:
    name: Tests (Pest)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with:
          php-version: 8.3
          extensions: mbstring, pdo, pdo_mysql, redis
          coverage: xdebug
      - run: composer install --prefer-dist --no-progress
      - run: composer test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml
```

---

## GitLab CI Complete Examples

### Basic Configuration

Create `.gitlab-ci.yml`:

```yaml
stages:
  - prepare
  - quality
  - test

variables:
  COMPOSER_CACHE_DIR: "$CI_PROJECT_DIR/.composer-cache"

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - vendor/
    - .composer-cache/
    - runtime/cache/

before_script:
  - curl -sS https://getcomposer.org/installer | php
  - php composer.phar install --prefer-dist --no-progress --no-interaction

# Code formatting check
pint:
  stage: quality
  image: php:8.3-cli
  script:
    - php composer.phar fmt:test
  only:
    - merge_requests
    - main
    - develop

# Static analysis
phpstan:
  stage: quality
  image: php:8.3-cli
  script:
    - php composer.phar stan
  cache:
    key: phpstan-${CI_COMMIT_REF_SLUG}
    paths:
      - runtime/cache/phpstan/
  only:
    - merge_requests
    - main
    - develop

# Refactoring check
rector:
  stage: quality
  image: php:8.3-cli
  script:
    - php composer.phar rector
  only:
    - merge_requests
    - main
    - develop

# Tests
test:
  stage: test
  image: php:8.3-cli
  script:
    - php composer.phar test:coverage
  coverage: '/^\s*Lines:\s*\d+.\d+\%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml
  only:
    - merge_requests
    - main
    - develop
```

### Multi-version Testing

```yaml
.test-template: &test-template
  stage: test
  script:
    - php composer.phar test
  only:
    - merge_requests
    - main
    - develop

test:php8.1:
  <<: *test-template
  image: php:8.1-cli

test:php8.2:
  <<: *test-template
  image: php:8.2-cli

test:php8.3:
  <<: *test-template
  image: php:8.3-cli
  script:
    - php composer.phar test:coverage
  coverage: '/^\s*Lines:\s*\d+.\d+\%/'
```

---

## Caching Strategies

### GitHub Actions Caching

#### 1. Composer Dependencies Cache

```yaml
- name: Get Composer cache directory
  id: composer-cache
  run: echo "dir=$(composer config cache-files-dir)" >> $GITHUB_OUTPUT

- name: Cache Composer dependencies
  uses: actions/cache@v3
  with:
    path: ${{ steps.composer-cache.outputs.dir }}
    key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
    restore-keys: |
      ${{ runner.os }}-composer-
```

#### 2. PHPStan Cache

```yaml
- name: Cache PHPStan results
  uses: actions/cache@v3
  with:
    path: runtime/cache/phpstan
    key: phpstan-${{ github.sha }}
    restore-keys: |
      phpstan-
```

#### 3. Rector Cache

```yaml
- name: Cache Rector results
  uses: actions/cache@v3
  with:
    path: runtime/cache/rector
    key: rector-${{ github.sha }}
    restore-keys: |
      rector-
```

#### 4. Pest Cache

```yaml
- name: Cache Pest results
  uses: actions/cache@v3
  with:
    path: .pest
    key: pest-${{ github.sha }}
    restore-keys: |
      pest-
```

### GitLab CI Caching

```yaml
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - vendor/
    - .composer-cache/
    - runtime/cache/phpstan/
    - runtime/cache/rector/
    - .pest/
```

---

## Badge Configuration

### GitHub Actions Badges

Add to `README.md`:

```markdown
# Project Name

[![CI](https://github.com/username/repo/workflows/CI/badge.svg)](https://github.com/username/repo/actions)
[![Tests](https://github.com/username/repo/workflows/Tests/badge.svg)](https://github.com/username/repo/actions)
[![Code Coverage](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/username/repo)
[![PHPStan](https://img.shields.io/badge/PHPStan-level%208-brightgreen.svg)](https://phpstan.org/)
[![PHP Version](https://img.shields.io/badge/PHP-%3E%3D8.3-blue.svg)](https://www.php.net/)
```

### GitLab CI Badges

```markdown
# Project Name

[![pipeline status](https://gitlab.com/username/repo/badges/main/pipeline.svg)](https://gitlab.com/username/repo/-/commits/main)
[![coverage report](https://gitlab.com/username/repo/badges/main/coverage.svg)](https://gitlab.com/username/repo/-/commits/main)
```

### Shields.io Custom Badges

```markdown
[![Pint](https://img.shields.io/badge/code%20style-pint-orange.svg)](https://laravel.com/docs/pint)
[![PHPStan](https://img.shields.io/badge/PHPStan-level%208-brightgreen.svg)](https://phpstan.org/)
[![Rector](https://img.shields.io/badge/Rector-enabled-blue.svg)](https://getrector.com/)
[![Pest](https://img.shields.io/badge/tested%20with-Pest-green.svg)](https://pestphp.com/)
```

---

## Best Practices

### Recommended

1. **Use parallel execution**
   ```yaml
   # GitHub Actions - Run multiple jobs in parallel
   jobs:
     pint:
       # ...
     phpstan:
       # ...
     rector:
       # ...
     tests:
       # ...
   ```

2. **Configure proper caching**
   ```yaml
   # Cache Composer dependencies
   - uses: actions/cache@v3
     with:
       path: vendor/
       key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
   ```

3. **Fail fast for quick feedback**
   ```yaml
   strategy:
     fail-fast: true  # Stop on first failure
   ```

4. **Use Composer Scripts**
   ```yaml
   # Use unified commands
   - run: composer fmt:test
   - run: composer stan
   - run: composer test
   ```

5. **Separate different types of checks**
   ```yaml
   # Code quality checks
   jobs:
     quality:
       # ...

   # Tests
   jobs:
     tests:
       # ...
   ```

6. **Configure coverage requirements**
   ```yaml
   - run: composer test:coverage --min=80
   ```

7. **Use matrix for multi-version testing**
   ```yaml
   strategy:
     matrix:
       php: [8.1, 8.2, 8.3]
   ```

### Avoid

1. **Don't modify code in CI**
   ```yaml
   # Wrong
   - run: composer fmt

   # Correct
   - run: composer fmt:test
   ```

2. **Don't ignore caching**
   ```yaml
   # Wrong - reinstall every time
   - run: composer install

   # Correct - use cache
   - uses: actions/cache@v3
   - run: composer install
   ```

3. **Don't run unnecessary steps**
   ```yaml
   # Wrong - deploy in PR
   - name: Deploy
     if: github.event_name == 'pull_request'  # Wrong

   # Correct - deploy only on main branch
   - name: Deploy
     if: github.ref == 'refs/heads/main'
   ```

4. **Don't hardcode sensitive information**
   ```yaml
   # Wrong
   env:
     API_KEY: "sk_live_xxx"

   # Correct
   env:
     API_KEY: ${{ secrets.API_KEY }}
   ```

5. **Don't ignore errors**
   ```yaml
   # Wrong
   - run: composer test || true

   # Correct
   - run: composer test
   ```

---

## Complete Workflow Example

### Local Development Flow

```bash
# 1. Develop feature
vim app/service/order/CreateOrderService.php

# 2. Format code
composer fmt

# 3. Run static analysis
composer stan

# 4. Run tests
composer test

# 5. Complete check (before commit)
composer quality

# 6. Commit code
git add .
git commit -m "feat: add CreateOrderService"

# 7. Push (trigger CI)
git push origin feature/create-order
```

### CI Execution Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Push to GitHub                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Trigger GitHub Actions                      │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬────────────┐
        │            │            │            │
        ▼            ▼            ▼            ▼
    ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐
    │ Pint │    │PHPStan│   │Rector│    │ Pest │
    └───┬──┘    └───┬──┘    └───┬──┘    └───┬──┘
        │           │           │           │
        └───────────┴───────────┴───────────┘
                     │
                     ▼
            ┌────────────────┐
            │  All Passed?   │
            └────────┬───────┘
                     │
            ┌────────┴────────┐
            │                 │
            ▼                 ▼
        ┌──────┐          ┌──────┐
        │ Pass │          │ Fail │
        └──────┘          └──────┘
            │                 │
            ▼                 ▼
    ┌──────────────┐  ┌──────────────┐
    │ Merge Ready  │  │ Fix Required │
    └──────────────┘  └──────────────┘
```

---

## Troubleshooting

### Common Issues

#### 1. Composer Installation Failure

```yaml
# Problem: Out of memory
# Solution: Increase memory limit
- run: COMPOSER_MEMORY_LIMIT=-1 composer install
```

#### 2. PHPStan Cache Issues

```yaml
# Problem: Cache causing incorrect results
# Solution: Clear cache
- run: composer stan:clear
- run: composer stan
```

#### 3. Test Timeout

```yaml
# Problem: Tests running too long
# Solution: Increase timeout or use parallel tests
- run: composer test:parallel
  timeout-minutes: 10
```

#### 4. Permission Issues

```yaml
# Problem: Cannot write to cache directory
# Solution: Create directory and set permissions
- run: mkdir -p runtime/cache
- run: chmod -R 777 runtime/cache
```

---

## Advanced Configuration

### Conditional Execution

```yaml
# Run only when specific files change
jobs:
  tests:
    steps:
      - uses: dorny/paths-filter@v2
        id: changes
        with:
          filters: |
            src:
              - 'app/**'
              - 'tests/**'

      - name: Run tests
        if: steps.changes.outputs.src == 'true'
        run: composer test
```

### Scheduled Jobs

```yaml
# Run complete check once daily
on:
  schedule:
    - cron: '0 0 * * *'  # Every day at midnight

jobs:
  nightly:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: composer install
      - run: composer quality
```

### Notification Setup

```yaml
# Send notification on failure
- name: Notify on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'CI failed!'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Related Documentation

- [Laravel Pint Code Formatting](./pint)
- [PHPStan Static Analysis](./phpstan)
- [Rector Auto Refactoring](./rector)
- [Pest Testing Framework](./pest)
- [Saloon HTTP Client](./saloon)

---

## Reference Resources

### GitHub Actions
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Actions Marketplace](https://github.com/marketplace?type=actions)

### GitLab CI
- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [.gitlab-ci.yml Reference](https://docs.gitlab.com/ee/ci/yaml/)

### Other
- [Codecov](https://codecov.io/)
- [Shields.io](https://shields.io/)
