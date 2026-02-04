---
title: "CI/CD 流水线集成"
description: "完整的持续集成和持续部署配置，自动化代码质量检查"
---

# CI/CD 流水线集成

> 完整的持续集成和持续部署配置，自动化代码质量检查

---

## 目录

- [简介](#简介)
- [Composer Scripts 配置](#composer-scripts-配置)
- [GitHub Actions 完整示例](#github-actions-完整示例)
- [GitLab CI 完整示例](#gitlab-ci-完整示例)
- [缓存策略](#缓存策略)
- [徽章配置](#徽章配置)
- [最佳实践](#最佳实践)

---

## 简介

### 什么是 CI/CD？

CI/CD（持续集成/持续部署）是一种软件开发实践，通过自动化构建、测试和部署流程，确保代码质量和快速交付。

**核心价值**：
- 自动化代码质量检查
- 及早发现问题
- 减少人工审查负担
- 确保代码规范统一
- 提高团队协作效率

### 工具链概览

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

## Composer Scripts 配置

### 完整配置

在 `composer.json` 中添加完整的脚本配置：

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

### 使用方法

```bash
# 本地开发
composer fmt              # 格式化代码
composer stan             # 静态分析
composer test             # 运行测试

# 修复问题
composer quality:fix      # 自动修复所有问题

# 完整检查（CI 前）
composer quality          # 运行所有检查

# 模拟 CI 环境
composer ci               # 运行 CI 流水线
```

---

## GitHub Actions 完整示例

### 基础工作流

创建 `.github/workflows/ci.yml`：

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

### 多版本测试

创建 `.github/workflows/tests.yml`：

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

### 完整的并行工作流

创建 `.github/workflows/quality.yml`：

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

## GitLab CI 完整示例

### 基础配置

创建 `.gitlab-ci.yml`：

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

# 代码格式化检查
pint:
  stage: quality
  image: php:8.3-cli
  script:
    - php composer.phar fmt:test
  only:
    - merge_requests
    - main
    - develop

# 静态分析
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

# 重构检查
rector:
  stage: quality
  image: php:8.3-cli
  script:
    - php composer.phar rector
  only:
    - merge_requests
    - main
    - develop

# 测试
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

### 多版本测试

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

## 缓存策略

### GitHub Actions 缓存

#### 1. Composer 依赖缓存

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

#### 2. PHPStan 缓存

```yaml
- name: Cache PHPStan results
  uses: actions/cache@v3
  with:
    path: runtime/cache/phpstan
    key: phpstan-${{ github.sha }}
    restore-keys: |
      phpstan-
```

#### 3. Rector 缓存

```yaml
- name: Cache Rector results
  uses: actions/cache@v3
  with:
    path: runtime/cache/rector
    key: rector-${{ github.sha }}
    restore-keys: |
      rector-
```

#### 4. Pest 缓存

```yaml
- name: Cache Pest results
  uses: actions/cache@v3
  with:
    path: .pest
    key: pest-${{ github.sha }}
    restore-keys: |
      pest-
```

### GitLab CI 缓存

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

## 徽章配置

### GitHub Actions 徽章

在 `README.md` 中添加：

```markdown
# Project Name

[![CI](https://github.com/username/repo/workflows/CI/badge.svg)](https://github.com/username/repo/actions)
[![Tests](https://github.com/username/repo/workflows/Tests/badge.svg)](https://github.com/username/repo/actions)
[![Code Coverage](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/username/repo)
[![PHPStan](https://img.shields.io/badge/PHPStan-level%208-brightgreen.svg)](https://phpstan.org/)
[![PHP Version](https://img.shields.io/badge/PHP-%3E%3D8.3-blue.svg)](https://www.php.net/)
```

### GitLab CI 徽章

```markdown
# Project Name

[![pipeline status](https://gitlab.com/username/repo/badges/main/pipeline.svg)](https://gitlab.com/username/repo/-/commits/main)
[![coverage report](https://gitlab.com/username/repo/badges/main/coverage.svg)](https://gitlab.com/username/repo/-/commits/main)
```

### Shields.io 自定义徽章

```markdown
[![Pint](https://img.shields.io/badge/code%20style-pint-orange.svg)](https://laravel.com/docs/pint)
[![PHPStan](https://img.shields.io/badge/PHPStan-level%208-brightgreen.svg)](https://phpstan.org/)
[![Rector](https://img.shields.io/badge/Rector-enabled-blue.svg)](https://getrector.com/)
[![Pest](https://img.shields.io/badge/tested%20with-Pest-green.svg)](https://pestphp.com/)
```

---

## 最佳实践

### 推荐做法

1. **使用并行执行**
   ```yaml
   # GitHub Actions - 并行运行多个 job
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

2. **配置合理的缓存**
   ```yaml
   # 缓存 Composer 依赖
   - uses: actions/cache@v3
     with:
       path: vendor/
       key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
   ```

3. **失败时快速反馈**
   ```yaml
   strategy:
     fail-fast: true  # 一个失败就停止
   ```

4. **使用 Composer Scripts**
   ```yaml
   # 使用统一的命令
   - run: composer fmt:test
   - run: composer stan
   - run: composer test
   ```

5. **分离不同类型的检查**
   ```yaml
   # 代码质量检查
   jobs:
     quality:
       # ...

   # 测试
   jobs:
     tests:
       # ...
   ```

6. **配置覆盖率要求**
   ```yaml
   - run: composer test:coverage --min=80
   ```

7. **使用矩阵测试多版本**
   ```yaml
   strategy:
     matrix:
       php: [8.1, 8.2, 8.3]
   ```

### 避免做法

1. **不要在 CI 中修改代码**
   ```yaml
   # 错误
   - run: composer fmt

   # 正确
   - run: composer fmt:test
   ```

2. **不要忽略缓存**
   ```yaml
   # 错误 - 每次都重新安装
   - run: composer install

   # 正确 - 使用缓存
   - uses: actions/cache@v3
   - run: composer install
   ```

3. **不要运行不必要的步骤**
   ```yaml
   # 错误 - 在 PR 中运行部署
   - name: Deploy
     if: github.event_name == 'pull_request'  # 错误

   # 正确 - 只在主分支部署
   - name: Deploy
     if: github.ref == 'refs/heads/main'
   ```

4. **不要硬编码敏感信息**
   ```yaml
   # 错误
   env:
     API_KEY: "sk_live_xxx"

   # 正确
   env:
     API_KEY: ${{ secrets.API_KEY }}
   ```

5. **不要忽略错误**
   ```yaml
   # 错误
   - run: composer test || true

   # 正确
   - run: composer test
   ```

---

## 完整工作流示例

### 本地开发流程

```bash
# 1. 开发功能
vim app/service/order/CreateOrderService.php

# 2. 格式化代码
composer fmt

# 3. 运行静态分析
composer stan

# 4. 运行测试
composer test

# 5. 完整检查（提交前）
composer quality

# 6. 提交代码
git add .
git commit -m "feat: add CreateOrderService"

# 7. 推送（触发 CI）
git push origin feature/create-order
```

### CI 执行流程

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

## 故障排查

### 常见问题

#### 1. Composer 安装失败

```yaml
# 问题：内存不足
# 解决：增加内存限制
- run: COMPOSER_MEMORY_LIMIT=-1 composer install
```

#### 2. PHPStan 缓存问题

```yaml
# 问题：缓存导致错误结果
# 解决：清除缓存
- run: composer stan:clear
- run: composer stan
```

#### 3. 测试超时

```yaml
# 问题：测试运行时间过长
# 解决：增加超时时间或使用并行测试
- run: composer test:parallel
  timeout-minutes: 10
```

#### 4. 权限问题

```yaml
# 问题：无法写入缓存目录
# 解决：创建目录并设置权限
- run: mkdir -p runtime/cache
- run: chmod -R 777 runtime/cache
```

---

## 高级配置

### 条件执行

```yaml
# 仅在特定文件变更时运行
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

### 定时任务

```yaml
# 每天运行一次完整检查
on:
  schedule:
    - cron: '0 0 * * *'  # 每天午夜

jobs:
  nightly:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: composer install
      - run: composer quality
```

### 通知配置

```yaml
# 失败时发送通知
- name: Notify on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'CI failed!'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 相关文档

- [Laravel Pint 代码格式化](./pint)
- [PHPStan 静态分析](./phpstan)
- [Rector 自动重构](./rector)
- [Pest 测试框架](./pest)
- [Saloon HTTP 客户端](./saloon)

---

## 参考资源

### GitHub Actions
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Workflow 语法](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Actions Marketplace](https://github.com/marketplace?type=actions)

### GitLab CI
- [GitLab CI/CD 文档](https://docs.gitlab.com/ee/ci/)
- [.gitlab-ci.yml 参考](https://docs.gitlab.com/ee/ci/yaml/)

### 其他
- [Codecov](https://codecov.io/)
- [Shields.io](https://shields.io/)
