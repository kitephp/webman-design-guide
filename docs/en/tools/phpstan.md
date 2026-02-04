---
title: "PHPStan - Static Analysis Tool"
description: "Find bugs without running code, improve code quality and type safety"
---

# PHPStan - Static Analysis Tool

> Find bugs without running code, improve code quality and type safety

---

## Table of Contents

- [Introduction](#introduction)
- [Installation and Configuration](#installation-and-configuration)
- [Configuration File](#configuration-file)
- [Level Progression Strategy](#level-progression-strategy)
- [Usage](#usage)
- [Common Issues and Solutions](#common-issues-and-solutions)
- [CI Integration](#ci-integration)
- [Best Practices](#best-practices)

---

## Introduction

### What is PHPStan?

PHPStan is a static analysis tool for PHP that finds potential bugs, type errors, and logic issues without running the code.

**Key Features**:
- 10 strictness levels (0-9)
- Type inference and checking
- Dead code detection
- Unused variable detection
- Extensible rule system
- Generics and advanced type support

### What Can PHPStan Find?

```php
<?php

declare(strict_types=1);

// PHPStan will find these issues:

// 1. Type errors
function calculateTotal(int $price): int
{
    return $price * 1.1; // Returns float, but declared as int
}

// 2. Undefined variables
function processOrder(): void
{
    echo $orderId; // $orderId is undefined
}

// 3. Calling non-existent methods
$user = new User();
$user->getName(); // User class has no getName method

// 4. Null pointer exceptions
function getUser(?User $user): string
{
    return $user->name; // $user might be null
}

// 5. Non-existent array keys
$data = ['name' => 'John'];
echo $data['email']; // Key 'email' doesn't exist

// 6. Dead code
function example(): void
{
    return;
    echo 'Never executed'; // Will never execute
}
```

---

## Installation and Configuration

### Installation

```bash
# Install PHPStan
composer require --dev phpstan/phpstan

# Install extensions (optional)
composer require --dev phpstan/extension-installer
composer require --dev phpstan/phpstan-strict-rules
composer require --dev phpstan/phpstan-deprecation-rules

# Verify installation
./vendor/bin/phpstan --version
```

### Recommended Extensions

| Extension | Description |
|-----------|-------------|
| `phpstan/phpstan-strict-rules` | Stricter rules |
| `phpstan/phpstan-deprecation-rules` | Detect deprecated code |
| `larastan/larastan` | Laravel support |
| `phpstan/phpstan-phpunit` | PHPUnit support |

### Configure Composer Scripts

Add to `composer.json`:

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

## Configuration File

### phpstan.neon

Create `phpstan.neon` in the project root:

#### Basic Configuration

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

#### Complete Configuration Example

```neon
includes:
    - vendor/phpstan/phpstan-strict-rules/rules.neon
    - vendor/phpstan/phpstan-deprecation-rules/rules.neon

parameters:
    # Analysis level (0-9)
    level: 5

    # Paths to analyze
    paths:
        - app/controller
        - app/service
        - app/domain
        - app/infrastructure
        - app/contract

    # Excluded paths
    excludePaths:
        - app/view
        - app/support/helper
        - */tests/*

    # Cache directory
    tmpDir: runtime/cache/phpstan

    # Ignored error patterns
    ignoreErrors:
        # Ignore specific error messages
        - '#Call to an undefined method Webman\\Config::get\(\)#'

        # Ignore errors in specific files
        -
            message: '#Access to an undefined property#'
            path: app/model/eloquent/*

        # Ignore third-party library issues
        -
            message: '#.*#'
            path: vendor/*

    # Type checking configuration
    checkMissingIterableValueType: false
    checkGenericClassInNonGenericObjectType: false
    checkAlwaysTrueCheckTypeFunctionCall: true
    checkAlwaysTrueInstanceof: true
    checkAlwaysTrueStrictComparison: true
    checkExplicitMixedMissingReturn: true
    checkFunctionNameCase: true
    checkInternalClassCaseSensitivity: true

    # Report unused variables and parameters
    reportUnmatchedIgnoredErrors: true
    checkMissingCallableSignature: true
    checkUninitializedProperties: true

    # Autoloading
    bootstrapFiles:
        - vendor/autoload.php

    # Scan files
    scanFiles:
        - support/helpers.php

    # Scan directories
    scanDirectories:
        - app
```

### Configuration Explanation

#### Level Description

| Level | Checks |
|-------|--------|
| 0 | Basic: unknown classes, functions |
| 1 | Unknown methods, properties |
| 2 | Unknown magic methods, properties |
| 3 | Return type checks |
| 4 | Dead code detection |
| 5 | Parameter type checks |
| 6 | Missing type hints |
| 7 | Partial union type checks |
| 8 | Nullable type checks |
| 9 | Mixed type checks (strictest) |

---

## Level Progression Strategy

### Recommended Strategy: Start from Level 5

**Why start from Level 5?**

- Level 0-4: Too lenient, can't find most issues
- Level 5: Balance point, finds most real issues
- Level 6-9: Requires complete type annotations, suitable for mature projects

### Progression Roadmap

#### Phase 1: Level 5 (Recommended Starting Point)

```neon
parameters:
    level: 5
    paths:
        - app/domain
        - app/service
```

**Goals**:
- Fix all Level 5 errors
- Establish Baseline (see below)
- Team adapts to static analysis

**Expected Time**: 1-2 weeks

#### Phase 2: Level 6

```neon
parameters:
    level: 6
```

**New Checks**:
- Missing type hints
- Undeclared properties

**Actions**:
- Add return types to all methods
- Add type hints to all parameters
- Add type declarations to class properties

**Expected Time**: 2-4 weeks

#### Phase 3: Level 7

```neon
parameters:
    level: 7
```

**New Checks**:
- Partial union type checks
- Stricter type inference

**Actions**:
- Use union types (`int|string`)
- Complete PHPDoc annotations

**Expected Time**: 2-3 weeks

#### Phase 4: Level 8 (Target Level)

```neon
parameters:
    level: 8
```

**New Checks**:
- Nullable type checks
- Strict type safety

**Actions**:
- Handle all possible null values
- Use `?Type` or `Type|null`

**Expected Time**: 3-4 weeks

#### Phase 5: Level 9 (Optional)

```neon
parameters:
    level: 9
```

**New Checks**:
- Forbid `mixed` type
- Strictest type checking

**Applicable Scenarios**:
- Core libraries
- Critical business logic
- New projects

---

## Usage

### Basic Commands

```bash
# Analyze all configured paths
./vendor/bin/phpstan analyse

# Analyze specific directory
./vendor/bin/phpstan analyse app/domain

# Analyze specific file
./vendor/bin/phpstan analyse app/domain/order/entity/Order.php

# Specify level
./vendor/bin/phpstan analyse --level=6

# Generate Baseline
./vendor/bin/phpstan analyse --generate-baseline

# Clear cache
./vendor/bin/phpstan clear-result-cache

# Show verbose output
./vendor/bin/phpstan analyse -v

# Without cache
./vendor/bin/phpstan analyse --no-progress

# Output as JSON
./vendor/bin/phpstan analyse --error-format=json
```

### Using Composer Scripts

```bash
# Run analysis
composer stan

# Generate Baseline
composer stan:baseline

# Clear cache
composer stan:clear
```

---

## Common Issues and Solutions

### Issue 1: Undefined Methods or Properties

#### Error Example

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

// PHPStan error:
// Access to an undefined property app\domain\order\entity\Order::$id
```

#### Solution 1: Initialize Properties

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

#### Solution 2: Constructor Initialization

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

### Issue 2: Possibly Null Values

#### Error Example

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

        // PHPStan error:
        // Cannot call method getStatus() on app\domain\order\entity\Order|null
        return $order->getStatus();
    }
}
```

#### Solution 1: Throw Exception

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

#### Solution 2: Use Nullable Return Type

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

### Issue 3: Unclear Array Types

#### Error Example

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
            // PHPStan error:
            // Cannot access offset 'price' on mixed
            $total += $item['price'] * $item['quantity'];
        }

        return $total;
    }
}
```

#### Solution: Use PHPDoc Annotations

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

### Issue 4: Third-Party Library Type Issues

#### Error Example

```php
<?php

declare(strict_types=1);

use support\Request;

function getUser(Request $request): array
{
    // PHPStan error:
    // Call to an undefined method support\Request::user()
    return $request->user();
}
```

#### Solution 1: Create Stub File

Create `stubs/Request.stub`:

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

Reference in `phpstan.neon`:

```neon
parameters:
    stubFiles:
        - stubs/Request.stub
```

#### Solution 2: Ignore Specific Errors

```neon
parameters:
    ignoreErrors:
        - '#Call to an undefined method support\\Request::user\(\)#'
```

### Issue 5: Using Baseline to Manage Existing Errors

When a project already has a lot of code, fixing all errors at once is unrealistic. Using Baseline allows you to:
- Record existing errors
- Ensure no new errors are introduced
- Gradually fix old errors

#### Generate Baseline

```bash
./vendor/bin/phpstan analyse --generate-baseline
```

This creates a `phpstan-baseline.neon` file.

#### Reference in Configuration

```neon
includes:
    - phpstan-baseline.neon

parameters:
    level: 5
    paths:
        - app
```

#### Update Baseline

```bash
# After fixing some errors, regenerate Baseline
./vendor/bin/phpstan analyse --generate-baseline
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

Add to `.gitlab-ci.yml`:

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

## Best Practices

### Recommended

1. **Start from Level 5**
   ```neon
   parameters:
       level: 5
   ```

2. **Use Baseline to manage existing errors**
   ```bash
   composer stan:baseline
   ```

3. **Run in CI**
   - Ensure every commit passes checks
   - Prevent introducing new errors

4. **Gradually increase level**
   - Level 5 -> Level 6 -> Level 7 -> Level 8
   - Fix all errors after each increase

5. **Add PHPDoc for complex types**
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

6. **Use strict type declarations**
   ```php
   <?php

   declare(strict_types=1);
   ```

7. **Handle nullable types**
   ```php
   public function getUser(?int $id): ?User
   {
       if ($id === null) {
           return null;
       }

       return $this->userRepository->find($id);
   }
   ```

### Avoid

1. **Don't ignore all errors**
   ```neon
   # Wrong
   parameters:
       ignoreErrors:
           - '#.*#'
   ```

2. **Don't use @phpstan-ignore-line everywhere**
   ```php
   // Wrong
   $user->getName(); // @phpstan-ignore-line
   ```

3. **Don't use mixed type in production code**
   ```php
   // Wrong
   public function process(mixed $data): mixed
   {
       // ...
   }
   ```

4. **Don't skip levels**
   - Level 5 -> Level 9 (Wrong)
   - Level 5 -> Level 6 -> Level 7 -> Level 8 (Correct)

5. **Don't analyze vendor directory**
   ```neon
   parameters:
       excludePaths:
           - vendor/*
   ```

---

## Workflow Examples

### New Project Workflow

```bash
# 1. Install PHPStan
composer require --dev phpstan/phpstan

# 2. Create configuration file
cat > phpstan.neon << 'EOF'
parameters:
    level: 5
    paths:
        - app
EOF

# 3. First run
composer stan

# 4. Fix errors
# ... modify code ...

# 5. Run again until passing
composer stan

# 6. Commit configuration
git add phpstan.neon composer.json composer.lock
git commit -m "chore: add PHPStan configuration"
```

### Existing Project Workflow

```bash
# 1. Install PHPStan
composer require --dev phpstan/phpstan

# 2. Create configuration file (Level 5)
cat > phpstan.neon << 'EOF'
parameters:
    level: 5
    paths:
        - app
EOF

# 3. Generate Baseline
composer stan:baseline

# 4. Commit Baseline
git add phpstan.neon phpstan-baseline.neon
git commit -m "chore: add PHPStan with baseline"

# 5. Gradually fix errors
# ... modify code ...

# 6. Update Baseline
composer stan:baseline

# 7. Increase level (when Baseline is empty)
# Modify phpstan.neon: level: 6
composer stan:baseline
```

---

## Integration with Other Tools

### PHPStan + Pint

```bash
# Format first, then analyze
composer fmt && composer stan
```

### PHPStan + Rector

```bash
# Rector can auto-fix some PHPStan errors
composer rector && composer stan
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

---

## Related Documentation

- [Laravel Pint Code Formatting](./pint)
- [Rector Auto Refactoring](./rector)
- [Pest Testing Framework](./pest)
- [CI/CD Pipeline](./ci-pipeline)

---

## Reference Resources

- [PHPStan Official Documentation](https://phpstan.org/)
- [PHPStan Rules Reference](https://phpstan.org/user-guide/rules)
- [PHPStan Configuration Reference](https://phpstan.org/config-reference)
- [PHPDoc Type Syntax](https://phpstan.org/writing-php-code/phpdoc-types)
