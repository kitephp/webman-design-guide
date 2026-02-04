---
title: "PHPStan - 静态分析工具"
description: "在不运行代码的情况下发现 Bug，提升代码质量和类型安全"
---

# PHPStan - 静态分析工具

> 在不运行代码的情况下发现 Bug，提升代码质量和类型安全

---

## 目录

- [简介](#简介)
- [安装与配置](#安装与配置)
- [配置文件](#配置文件)
- [级别进阶策略](#级别进阶策略)
- [使用方法](#使用方法)
- [常见问题与解决方案](#常见问题与解决方案)
- [CI 集成](#ci-集成)
- [最佳实践](#最佳实践)

---

## 简介

### 什么是 PHPStan？

PHPStan 是 PHP 的静态分析工具，可以在不运行代码的情况下发现潜在的 Bug、类型错误和逻辑问题。

**核心特性**：
- 10 个严格级别（0-9）
- 类型推断和检查
- 死代码检测
- 未使用变量检测
- 可扩展的规则系统
- 支持泛型和高级类型

### PHPStan 能发现什么问题？

```php
<?php

declare(strict_types=1);

// PHPStan 会发现这些问题：

// 1. 类型错误
function calculateTotal(int $price): int
{
    return $price * 1.1; // 返回 float，但声明为 int
}

// 2. 未定义的变量
function processOrder(): void
{
    echo $orderId; // $orderId 未定义
}

// 3. 调用不存在的方法
$user = new User();
$user->getName(); // User 类没有 getName 方法

// 4. 空指针异常
function getUser(?User $user): string
{
    return $user->name; // $user 可能为 null
}

// 5. 数组键不存在
$data = ['name' => 'John'];
echo $data['email']; // 键 'email' 不存在

// 6. 死代码
function example(): void
{
    return;
    echo 'Never executed'; // 永远不会执行
}
```

---

## 安装与配置

### 安装

```bash
# 安装 PHPStan
composer require --dev phpstan/phpstan

# 安装扩展包（可选）
composer require --dev phpstan/extension-installer
composer require --dev phpstan/phpstan-strict-rules
composer require --dev phpstan/phpstan-deprecation-rules

# 验证安装
./vendor/bin/phpstan --version
```

### 推荐扩展包

| 扩展包 | 说明 |
|--------|------|
| `phpstan/phpstan-strict-rules` | 更严格的规则 |
| `phpstan/phpstan-deprecation-rules` | 检测废弃代码 |
| `larastan/larastan` | Laravel 支持 |
| `phpstan/phpstan-phpunit` | PHPUnit 支持 |

### 配置 Composer Scripts

在 `composer.json` 中添加：

```json
{
    "scripts": {
        "stan": "phpstan analyse --memory-limit=2G",
        "stan:baseline": "phpstan analyse --generate-baseline",
        "stan:clear": "phpstan clear-result-cache"
    },
    "scripts-descriptions": {
        "stan": "Run PHPStan static analysis",
        "stan:baseline": "Generate baseline for existing errors",
        "stan:clear": "Clear PHPStan result cache"
    }
}
```

---

## 配置文件

### phpstan.neon

在项目根目录创建 `phpstan.neon`：

#### 基础配置

```neon
parameters:
    level: 5
    paths:
        - app
    excludePaths:
        - app/view
        - app/support/helper
    tmpDir: runtime/cache/phpstan
    checkMissingIterableValueType: false
    checkGenericClassInNonGenericObjectType: false
```

#### 完整配置示例

```neon
includes:
    - vendor/phpstan/phpstan-strict-rules/rules.neon
    - vendor/phpstan/phpstan-deprecation-rules/rules.neon

parameters:
    # 分析级别 (0-9)
    level: 5

    # 要分析的路径
    paths:
        - app/controller
        - app/service
        - app/domain
        - app/infrastructure
        - app/contract

    # 排除的路径
    excludePaths:
        - app/view
        - app/support/helper
        - */tests/*

    # 缓存目录
    tmpDir: runtime/cache/phpstan

    # 忽略的错误模式
    ignoreErrors:
        # 忽略特定错误消息
        - '#Call to an undefined method Webman\\Config::get\(\)#'

        # 忽略特定文件的错误
        -
            message: '#Access to an undefined property#'
            path: app/model/eloquent/*

        # 忽略第三方库的问题
        -
            message: '#.*#'
            path: vendor/*

    # 类型检查配置
    checkMissingIterableValueType: false
    checkGenericClassInNonGenericObjectType: false
    checkAlwaysTrueCheckTypeFunctionCall: true
    checkAlwaysTrueInstanceof: true
    checkAlwaysTrueStrictComparison: true
    checkExplicitMixedMissingReturn: true
    checkFunctionNameCase: true
    checkInternalClassCaseSensitivity: true

    # 报告未使用的变量和参数
    reportUnmatchedIgnoredErrors: true
    checkMissingCallableSignature: true
    checkUninitializedProperties: true

    # 自动加载
    bootstrapFiles:
        - vendor/autoload.php

    # 扫描文件
    scanFiles:
        - support/helpers.php

    # 扫描目录
    scanDirectories:
        - app
```

### 配置说明

#### Level 级别说明

| Level | 检查内容 |
|-------|---------|
| 0 | 基本检查：未知类、函数 |
| 1 | 未知方法、属性 |
| 2 | 未知魔术方法、属性 |
| 3 | 返回类型检查 |
| 4 | 死代码检测 |
| 5 | 参数类型检查 |
| 6 | 缺失类型提示检查 |
| 7 | 部分联合类型检查 |
| 8 | 可空类型检查 |
| 9 | 混合类型检查（最严格） |

---

## 级别进阶策略

### 推荐策略：从 Level 5 开始

**为什么从 Level 5 开始？**

- Level 0-4：太宽松，无法发现大部分问题
- Level 5：平衡点，能发现大部分实际问题
- Level 6-9：需要完善的类型注解，适合成熟项目

### 进阶路线图

#### 阶段 1：Level 5（推荐起点）

```neon
parameters:
    level: 5
    paths:
        - app/domain
        - app/service
```

**目标**：
- 修复所有 Level 5 错误
- 建立 Baseline（见下文）
- 团队适应静态分析

**预期时间**：1-2 周

#### 阶段 2：Level 6

```neon
parameters:
    level: 6
```

**新增检查**：
- 缺失的类型提示
- 未声明的属性

**行动**：
- 为所有方法添加返回类型
- 为所有参数添加类型提示
- 为类属性添加类型声明

**预期时间**：2-4 周

#### 阶段 3：Level 7

```neon
parameters:
    level: 7
```

**新增检查**：
- 联合类型的部分检查
- 更严格的类型推断

**行动**：
- 使用联合类型（`int|string`）
- 完善 PHPDoc 注解

**预期时间**：2-3 周

#### 阶段 4：Level 8（目标级别）

```neon
parameters:
    level: 8
```

**新增检查**：
- 可空类型检查
- 严格的类型安全

**行动**：
- 处理所有可能的 null 值
- 使用 `?Type` 或 `Type|null`

**预期时间**：3-4 周

#### 阶段 5：Level 9（可选）

```neon
parameters:
    level: 9
```

**新增检查**：
- 禁止 `mixed` 类型
- 最严格的类型检查

**适用场景**：
- 核心库
- 关键业务逻辑
- 新项目

---

## 使用方法

### 基本命令

```bash
# 分析所有配置的路径
./vendor/bin/phpstan analyse

# 分析指定目录
./vendor/bin/phpstan analyse app/domain

# 分析指定文件
./vendor/bin/phpstan analyse app/domain/order/entity/Order.php

# 指定级别
./vendor/bin/phpstan analyse --level=6

# 生成 Baseline
./vendor/bin/phpstan analyse --generate-baseline

# 清除缓存
./vendor/bin/phpstan clear-result-cache

# 显示详细输出
./vendor/bin/phpstan analyse -v

# 不使用缓存
./vendor/bin/phpstan analyse --no-progress

# 输出为 JSON
./vendor/bin/phpstan analyse --error-format=json
```

### 使用 Composer Scripts

```bash
# 运行分析
composer stan

# 生成 Baseline
composer stan:baseline

# 清除缓存
composer stan:clear
```

---

## 常见问题与解决方案

### 问题 1：未定义的方法或属性

#### 错误示例

```php
<?php

declare(strict_types=1);

namespace app\domain\order\entity;

final class Order
{
    private int $id;
    private string $status;

    public function getId(): int
    {
        return $this->id;
    }
}

// PHPStan 错误：
// Access to an undefined property app\domain\order\entity\Order::$id
```

#### 解决方案 1：初始化属性

```php
<?php

declare(strict_types=1);

namespace app\domain\order\entity;

final class Order
{
    private int $id = 0;
    private string $status = 'pending';

    public function getId(): int
    {
        return $this->id;
    }
}
```

#### 解决方案 2：构造函数初始化

```php
<?php

declare(strict_types=1);

namespace app\domain\order\entity;

final class Order
{
    public function __construct(
        private int $id,
        private string $status
    ) {
    }

    public function getId(): int
    {
        return $this->id;
    }
}
```

### 问题 2：可能为 null 的值

#### 错误示例

```php
<?php

declare(strict_types=1);

namespace app\service\order;

use app\contract\repository\OrderRepositoryInterface;
use app\domain\order\entity\Order;

final class GetOrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository
    ) {
    }

    public function handle(int $orderId): string
    {
        $order = $this->orderRepository->findById($orderId);

        // PHPStan 错误：
        // Cannot call method getStatus() on app\domain\order\entity\Order|null
        return $order->getStatus();
    }
}
```

#### 解决方案 1：抛出异常

```php
<?php

declare(strict_types=1);

namespace app\service\order;

use app\contract\repository\OrderRepositoryInterface;
use app\domain\order\entity\Order;
use app\support\exception\OrderNotFoundException;

final class GetOrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository
    ) {
    }

    public function handle(int $orderId): string
    {
        $order = $this->orderRepository->findById($orderId);

        if ($order === null) {
            throw new OrderNotFoundException("Order {$orderId} not found");
        }

        return $order->getStatus();
    }
}
```

#### 解决方案 2：使用可空返回类型

```php
<?php

declare(strict_types=1);

namespace app\service\order;

use app\contract\repository\OrderRepositoryInterface;

final class GetOrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository
    ) {
    }

    public function handle(int $orderId): ?string
    {
        $order = $this->orderRepository->findById($orderId);

        return $order?->getStatus();
    }
}
```

### 问题 3：数组类型不明确

#### 错误示例

```php
<?php

declare(strict_types=1);

namespace app\service\order;

final class OrderCalculator
{
    public function calculateTotal(array $items): float
    {
        $total = 0.0;

        foreach ($items as $item) {
            // PHPStan 错误：
            // Cannot access offset 'price' on mixed
            $total += $item['price'] * $item['quantity'];
        }

        return $total;
    }
}
```

#### 解决方案：使用 PHPDoc 注解

```php
<?php

declare(strict_types=1);

namespace app\service\order;

final class OrderCalculator
{
    /**
     * @param array<int, array{price: float, quantity: int}> $items
     */
    public function calculateTotal(array $items): float
    {
        $total = 0.0;

        foreach ($items as $item) {
            $total += $item['price'] * $item['quantity'];
        }

        return $total;
    }
}
```

### 问题 4：第三方库类型问题

#### 错误示例

```php
<?php

declare(strict_types=1);

use support\Request;

function getUser(Request $request): array
{
    // PHPStan 错误：
    // Call to an undefined method support\Request::user()
    return $request->user();
}
```

#### 解决方案 1：创建 Stub 文件

创建 `stubs/Request.stub`：

```php
<?php

namespace support;

class Request
{
    public function user(): ?array
    {
    }
}
```

在 `phpstan.neon` 中引用：

```neon
parameters:
    stubFiles:
        - stubs/Request.stub
```

#### 解决方案 2：忽略特定错误

```neon
parameters:
    ignoreErrors:
        - '#Call to an undefined method support\\Request::user\(\)#'
```

### 问题 5：使用 Baseline 管理现有错误

当项目已有大量代码时，一次性修复所有错误不现实。使用 Baseline 可以：
- 记录现有错误
- 确保不引入新错误
- 逐步修复旧错误

#### 生成 Baseline

```bash
./vendor/bin/phpstan analyse --generate-baseline
```

这会创建 `phpstan-baseline.neon` 文件。

#### 在配置中引用

```neon
includes:
    - phpstan-baseline.neon

parameters:
    level: 5
    paths:
        - app
```

#### 更新 Baseline

```bash
# 修复部分错误后，重新生成 Baseline
./vendor/bin/phpstan analyse --generate-baseline
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
  phpstan:
    name: PHPStan
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: 8.3
          coverage: none
          extensions: mbstring, pdo, pdo_mysql

      - name: Cache Composer dependencies
        uses: actions/cache@v3
        with:
          path: vendor
          key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
          restore-keys: ${{ runner.os }}-composer-

      - name: Install dependencies
        run: composer install --prefer-dist --no-progress --no-interaction

      - name: Run PHPStan
        run: ./vendor/bin/phpstan analyse --memory-limit=2G --error-format=github
```

### GitLab CI

在 `.gitlab-ci.yml` 中添加：

```yaml
phpstan:
  stage: test
  image: php:8.3-cli
  before_script:
    - curl -sS https://getcomposer.org/installer | php
    - php composer.phar install --prefer-dist --no-progress
  script:
    - ./vendor/bin/phpstan analyse --memory-limit=2G
  cache:
    paths:
      - vendor/
      - runtime/cache/phpstan/
  only:
    - merge_requests
    - main
    - develop
```

---

## 最佳实践

### 推荐做法

1. **从 Level 5 开始**
   ```neon
   parameters:
       level: 5
   ```

2. **使用 Baseline 管理现有错误**
   ```bash
   composer stan:baseline
   ```

3. **在 CI 中运行**
   - 确保每次提交都通过检查
   - 防止引入新错误

4. **逐步提升级别**
   - Level 5 -> Level 6 -> Level 7 -> Level 8
   - 每次提升后修复所有错误

5. **为复杂类型添加 PHPDoc**
   ```php
   /**
    * @param array<string, mixed> $data
    * @return array<int, Order>
    */
   public function process(array $data): array
   {
       // ...
   }
   ```

6. **使用严格类型声明**
   ```php
   <?php

   declare(strict_types=1);
   ```

7. **处理可空类型**
   ```php
   public function getUser(?int $id): ?User
   {
       if ($id === null) {
           return null;
       }

       return $this->userRepository->find($id);
   }
   ```

### 避免做法

1. **不要忽略所有错误**
   ```neon
   # 错误
   parameters:
       ignoreErrors:
           - '#.*#'
   ```

2. **不要使用 @phpstan-ignore-line 到处忽略**
   ```php
   // 错误
   $user->getName(); // @phpstan-ignore-line
   ```

3. **不要在生产代码中使用 mixed 类型**
   ```php
   // 错误
   public function process(mixed $data): mixed
   {
       // ...
   }
   ```

4. **不要跳级提升**
   - Level 5 -> Level 9（错误）
   - Level 5 -> Level 6 -> Level 7 -> Level 8（正确）

5. **不要分析 vendor 目录**
   ```neon
   parameters:
       excludePaths:
           - vendor/*
   ```

---

## 工作流示例

### 新项目工作流

```bash
# 1. 安装 PHPStan
composer require --dev phpstan/phpstan

# 2. 创建配置文件
cat > phpstan.neon << 'EOF'
parameters:
    level: 5
    paths:
        - app
EOF

# 3. 首次运行
composer stan

# 4. 修复错误
# ... 修改代码 ...

# 5. 再次运行直到通过
composer stan

# 6. 提交配置
git add phpstan.neon composer.json composer.lock
git commit -m "chore: add PHPStan configuration"
```

### 现有项目工作流

```bash
# 1. 安装 PHPStan
composer require --dev phpstan/phpstan

# 2. 创建配置文件（Level 5）
cat > phpstan.neon << 'EOF'
parameters:
    level: 5
    paths:
        - app
EOF

# 3. 生成 Baseline
composer stan:baseline

# 4. 提交 Baseline
git add phpstan.neon phpstan-baseline.neon
git commit -m "chore: add PHPStan with baseline"

# 5. 逐步修复错误
# ... 修改代码 ...

# 6. 更新 Baseline
composer stan:baseline

# 7. 提升级别（当 Baseline 为空时）
# 修改 phpstan.neon: level: 6
composer stan:baseline
```

---

## 与其他工具配合

### PHPStan + Pint

```bash
# 先格式化，再分析
composer fmt && composer stan
```

### PHPStan + Rector

```bash
# Rector 可以自动修复部分 PHPStan 错误
composer rector && composer stan
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

---

## 相关文档

- [Laravel Pint 代码格式化](./pint)
- [Rector 自动重构](./rector)
- [Pest 测试框架](./pest)
- [CI/CD 流水线](./ci-pipeline)

---

## 参考资源

- [PHPStan 官方文档](https://phpstan.org/)
- [PHPStan 规则参考](https://phpstan.org/user-guide/rules)
- [PHPStan 配置参考](https://phpstan.org/config-reference)
- [PHPDoc 类型语法](https://phpstan.org/writing-php-code/phpdoc-types)
