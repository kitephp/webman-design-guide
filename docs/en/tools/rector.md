---
title: "Rector - Auto Refactoring Tool"
description: "Automatically upgrade PHP versions, refactor code, and apply best practices"
---

# Rector - Auto Refactoring Tool

> Automatically upgrade PHP versions, refactor code, and apply best practices

---

## Table of Contents

- [Introduction](#introduction)
- [Installation and Configuration](#installation-and-configuration)
- [Configuration File](#configuration-file)
- [Upgrade Rules](#upgrade-rules)
- [Custom Rules](#custom-rules)
- [Dry-run vs Apply](#dry-run-vs-apply)
- [Usage](#usage)
- [CI Integration](#ci-integration)
- [Common Issues](#common-issues)
- [Best Practices](#best-practices)

---

## Introduction

### What is Rector?

Rector is an automated refactoring tool that can:
- Automatically upgrade PHP versions (7.4 → 8.1 → 8.2 → 8.3)
- Apply code modernization rules
- Refactor legacy code
- Auto-fix PHPStan errors
- Apply coding standards

**Key Features**:
- 300+ built-in rules
- Custom rule support
- Safe dry-run mode
- Incremental refactoring
- Type-safe refactoring

### What Can Rector Do?

```php
<?php

// Before Rector (PHP 7.4)
class Order
{
    private $id;
    private $status;

    public function __construct($id, $status)
    {
        $this->id = $id;
        $this->status = $status;
    }

    public function getId()
    {
        return $this->id;
    }
}

// After Rector (PHP 8.3)
class Order
{
    public function __construct(
        private readonly int $id,
        private string $status
    ) {
    }

    public function getId(): int
    {
        return $this->id;
    }
}
```

---

## Installation and Configuration

### Installation

```bash
# Install Rector
composer require --dev rector/rector

# Verify installation
./vendor/bin/rector --version
```

### Configure Composer Scripts

Add to `composer.json`:

```json
{
    "scripts": {
        "rector": "rector process --dry-run",
        "rector:fix": "rector process",
        "rector:clear": "rm -rf runtime/cache/rector"
    },
    "scripts-descriptions": {
        "rector": "Preview refactoring changes (dry-run)",
        "rector:fix": "Apply refactoring changes",
        "rector:clear": "Clear Rector cache"
    }
}
```

---

## Configuration File

### rector.php

Create `rector.php` in the project root:

#### Basic Configuration

```php
<?php

declare(strict_types=1);

use Rector\Config\RectorConfig;

return RectorConfig::configure()
    ->withPaths([
        __DIR__ . '/app',
    ])
    ->withSkip([
        __DIR__ . '/app/view',
        __DIR__ . '/vendor',
    ])
    ->withPhpSets(
        php81: true,
    );
```

#### Complete Configuration Example

```php
<?php

declare(strict_types=1);

use Rector\CodeQuality\Rector\Class_\InlineConstructorDefaultToPropertyRector;
use Rector\CodeQuality\Rector\ClassMethod\ReturnTypeFromStrictScalarReturnExprRector;
use Rector\CodeQuality\Rector\If_\SimplifyIfReturnBoolRector;
use Rector\CodingStyle\Rector\ClassMethod\NewlineBeforeNewAssignSetRector;
use Rector\CodingStyle\Rector\Encapsed\EncapsedStringsToSprintfRector;
use Rector\Config\RectorConfig;
use Rector\DeadCode\Rector\ClassMethod\RemoveUnusedPrivateMethodRector;
use Rector\DeadCode\Rector\Property\RemoveUnusedPrivatePropertyRector;
use Rector\EarlyReturn\Rector\If_\ChangeIfElseValueAssignToEarlyReturnRector;
use Rector\Php81\Rector\Property\ReadOnlyPropertyRector;
use Rector\Php82\Rector\Class_\ReadOnlyClassRector;
use Rector\Php83\Rector\ClassMethod\AddOverrideAttributeToOverriddenMethodsRector;
use Rector\PHPUnit\Set\PHPUnitSetList;
use Rector\Set\ValueObject\LevelSetList;
use Rector\Set\ValueObject\SetList;
use Rector\TypeDeclaration\Rector\ClassMethod\AddVoidReturnTypeWhereNoReturnRector;
use Rector\TypeDeclaration\Rector\Property\TypedPropertyFromStrictConstructorRector;

return RectorConfig::configure()
    // Paths to process
    ->withPaths([
        __DIR__ . '/app/controller',
        __DIR__ . '/app/service',
        __DIR__ . '/app/domain',
        __DIR__ . '/app/infrastructure',
        __DIR__ . '/app/contract',
    ])

    // Paths to skip
    ->withSkip([
        __DIR__ . '/app/view',
        __DIR__ . '/app/support/helper',
        __DIR__ . '/vendor',

        // Skip specific rules
        ReadOnlyClassRector::class => [
            __DIR__ . '/app/domain/*/entity/*',
        ],
    ])

    // PHP version upgrade rule sets
    ->withPhpSets(
        php81: true,  // PHP 8.1 features
        php82: true,  // PHP 8.2 features
        php83: true,  // PHP 8.3 features
    )

    // Code quality rule sets
    ->withSets([
        LevelSetList::UP_TO_PHP_83,
        SetList::CODE_QUALITY,
        SetList::DEAD_CODE,
        SetList::EARLY_RETURN,
        SetList::TYPE_DECLARATION,
        SetList::PRIVATIZATION,
    ])

    // Custom rules
    ->withRules([
        // Constructor property promotion
        InlineConstructorDefaultToPropertyRector::class,

        // Readonly properties
        ReadOnlyPropertyRector::class,

        // Type declarations
        TypedPropertyFromStrictConstructorRector::class,
        ReturnTypeFromStrictScalarReturnExprRector::class,
        AddVoidReturnTypeWhereNoReturnRector::class,

        // Code simplification
        SimplifyIfReturnBoolRector::class,
        ChangeIfElseValueAssignToEarlyReturnRector::class,

        // Dead code removal
        RemoveUnusedPrivateMethodRector::class,
        RemoveUnusedPrivatePropertyRector::class,

        // PHP 8.3 features
        AddOverrideAttributeToOverriddenMethodsRector::class,
    ])

    // Parallel processing
    ->withParallel()

    // Cache directory
    ->withCache(__DIR__ . '/runtime/cache/rector')

    // Import short class names
    ->withImportNames();
```

### Configuration Explanation

#### PHP Version Upgrade Rule Sets

| Rule Set | Description |
|----------|-------------|
| `php81: true` | PHP 8.1 features |
| `php82: true` | PHP 8.2 features |
| `php83: true` | PHP 8.3 features |

#### General Rule Sets

| Rule Set | Description |
|----------|-------------|
| `CODE_QUALITY` | Code quality improvements |
| `DEAD_CODE` | Remove dead code |
| `EARLY_RETURN` | Early return pattern |
| `TYPE_DECLARATION` | Type declarations |
| `PRIVATIZATION` | Privatization |

---

## Upgrade Rules

### PHP 8.1 Features

#### 1. Readonly Properties

```php
<?php

// Before
class Order
{
    private int $id;

    public function __construct(int $id)
    {
        $this->id = $id;
    }

    public function getId(): int
    {
        return $this->id;
    }
}

// After
class Order
{
    public function __construct(
        private readonly int $id
    ) {
    }

    public function getId(): int
    {
        return $this->id;
    }
}
```

#### 2. Enums

```php
<?php

// Before
class OrderStatus
{
    public const PENDING = 'pending';
    public const PAID = 'paid';
    public const SHIPPED = 'shipped';
}

// After
enum OrderStatus: string
{
    case PENDING = 'pending';
    case PAID = 'paid';
    case SHIPPED = 'shipped';
}
```

#### 3. New Initializers

```php
<?php

// Before
class Service
{
    private Logger $logger;

    public function __construct()
    {
        $this->logger = new Logger();
    }
}

// After
class Service
{
    private Logger $logger = new Logger();
}
```

### PHP 8.2 Features

#### 1. Readonly Classes

```php
<?php

// Before
class Money
{
    public function __construct(
        private readonly int $cents,
        private readonly string $currency
    ) {
    }
}

// After
readonly class Money
{
    public function __construct(
        private int $cents,
        private string $currency
    ) {
    }
}
```

#### 2. DNF Types

```php
<?php

// Before
/**
 * @param User|Admin $user
 */
function process(object $user): void
{
}

// After
function process((User&HasPermission)|(Admin&Active) $user): void
{
}
```

### PHP 8.3 Features

#### 1. Override Attribute

```php
<?php

// Before
class ChildService extends ParentService
{
    public function process(): void
    {
        // ...
    }
}

// After
class ChildService extends ParentService
{
    #[\Override]
    public function process(): void
    {
        // ...
    }
}
```

#### 2. Typed Class Constants

```php
<?php

// Before
class Config
{
    public const MAX_ITEMS = 100;
}

// After
class Config
{
    public const int MAX_ITEMS = 100;
}
```

---

## Custom Rules

### Create Custom Rules

Create `app/support/rector/RemoveDumpRector.php`:

```php
<?php

declare(strict_types=1);

namespace app\support\rector;

use PhpParser\Node;
use PhpParser\Node\Expr\FuncCall;
use PhpParser\Node\Name;
use Rector\Rector\AbstractRector;
use Symplify\RuleDocGenerator\ValueObject\CodeSample\CodeSample;
use Symplify\RuleDocGenerator\ValueObject\RuleDefinition;

final class RemoveDumpRector extends AbstractRector
{
    public function getRuleDefinition(): RuleDefinition
    {
        return new RuleDefinition(
            'Remove dump() and dd() calls',
            [
                new CodeSample(
                    <<<'CODE_SAMPLE'
dump($variable);
dd($variable);
CODE_SAMPLE
                    ,
                    <<<'CODE_SAMPLE'
// removed
CODE_SAMPLE
                ),
            ]
        );
    }

    public function getNodeTypes(): array
    {
        return [FuncCall::class];
    }

    public function refactor(Node $node): ?Node
    {
        if (!$node instanceof FuncCall) {
            return null;
        }

        if (!$node->name instanceof Name) {
            return null;
        }

        $functionName = $node->name->toString();

        if (!in_array($functionName, ['dump', 'dd', 'var_dump'], true)) {
            return null;
        }

        // Remove the node
        $this->removeNode($node);

        return $node;
    }
}
```

### Use Custom Rules in Configuration

```php
<?php

declare(strict_types=1);

use app\support\rector\RemoveDumpRector;
use Rector\Config\RectorConfig;

return RectorConfig::configure()
    ->withPaths([
        __DIR__ . '/app',
    ])
    ->withRules([
        RemoveDumpRector::class,
    ]);
```

---

## Dry-run vs Apply

### Dry-run Mode (Preview)

**Purpose**: Preview changes without modifying files.

```bash
# Preview all changes
./vendor/bin/rector process --dry-run

# Preview specific directory
./vendor/bin/rector process app/domain --dry-run

# Use Composer Script
composer rector
```

**Output Example**:

```
[OK] Rector is done!

1) app/domain/order/entity/Order.php

    ---------- begin diff ----------
@@ @@
-    private int $id;
+    private readonly int $id;

-    public function __construct(int $id)
-    {
-        $this->id = $id;
-    }
+    public function __construct(
+        private readonly int $id
+    ) {
+    }
    ----------- end diff -----------

Applied rules:
 * InlineConstructorDefaultToPropertyRector
 * ReadOnlyPropertyRector
```

### Apply Mode (Apply Changes)

**Purpose**: Actually modify files.

```bash
# Apply all changes
./vendor/bin/rector process

# Apply to specific directory
./vendor/bin/rector process app/domain

# Use Composer Script
composer rector:fix
```

**Recommended Workflow**:

```bash
# 1. Preview first
composer rector

# 2. Check diff
git diff

# 3. Apply after confirmation
composer rector:fix

# 4. Check again
git diff

# 5. Run tests
composer test

# 6. Commit
git add .
git commit -m "refactor: apply Rector rules"
```

---

## Usage

### Basic Commands

```bash
# Preview changes (recommended to run first)
./vendor/bin/rector process --dry-run

# Apply changes
./vendor/bin/rector process

# Process specific directory
./vendor/bin/rector process app/domain

# Process specific file
./vendor/bin/rector process app/domain/order/entity/Order.php

# Show verbose output
./vendor/bin/rector process --dry-run --debug

# Clear cache
./vendor/bin/rector process --clear-cache

# Apply only specific rule
./vendor/bin/rector process --only=InlineConstructorDefaultToPropertyRector
```

### Use Cases

#### Case 1: Upgrade PHP Version

```bash
# 1. Update composer.json
# "require": { "php": "^8.3" }

# 2. Configure rector.php
# ->withPhpSets(php83: true)

# 3. Preview changes
composer rector

# 4. Apply changes
composer rector:fix

# 5. Run tests
composer test
```

#### Case 2: Refactor Legacy Code

```php
<?php

// rector.php
use Rector\Config\RectorConfig;
use Rector\Set\ValueObject\SetList;

return RectorConfig::configure()
    ->withPaths([
        __DIR__ . '/app/legacy',
    ])
    ->withSets([
        SetList::CODE_QUALITY,
        SetList::DEAD_CODE,
        SetList::TYPE_DECLARATION,
    ]);
```

```bash
# Refactor legacy code
./vendor/bin/rector process app/legacy --dry-run
./vendor/bin/rector process app/legacy
```

#### Case 3: Fix PHPStan Errors

```bash
# 1. Run PHPStan
composer stan

# 2. Configure Rector to fix type issues
# ->withSets([SetList::TYPE_DECLARATION])

# 3. Apply Rector
composer rector:fix

# 4. Run PHPStan again
composer stan
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
  rector:
    name: Rector
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

      - name: Run Rector (dry-run)
        run: ./vendor/bin/rector process --dry-run

      - name: Check for changes
        run: |
          if [ -n "$(git status --porcelain)" ]; then
            echo "Rector would make changes. Please run 'composer rector:fix' locally."
            exit 1
          fi
```

### GitLab CI

Add to `.gitlab-ci.yml`:

```yaml
rector:
  stage: test
  image: php:8.3-cli
  before_script:
    - curl -sS https://getcomposer.org/installer | php
    - php composer.phar install --prefer-dist --no-progress
  script:
    - ./vendor/bin/rector process --dry-run
  only:
    - merge_requests
    - main
    - develop
```

---

## Common Issues

### Q1: Rector modified code it shouldn't have

**Problem**: Rector modified third-party libraries or generated code.

**Solution**: Add `withSkip()` in `rector.php`:

```php
<?php

return RectorConfig::configure()
    ->withSkip([
        __DIR__ . '/vendor',
        __DIR__ . '/app/view',
        __DIR__ . '/storage',

        // Skip specific rules
        ReadOnlyClassRector::class => [
            __DIR__ . '/app/domain/*/entity/*',
        ],
    ]);
```

### Q2: How to apply only specific rules?

**Method 1**: Use `--only` parameter

```bash
./vendor/bin/rector process --only=InlineConstructorDefaultToPropertyRector
```

**Method 2**: Enable only specific rules in configuration

```php
<?php

return RectorConfig::configure()
    ->withRules([
        InlineConstructorDefaultToPropertyRector::class,
        ReadOnlyPropertyRector::class,
    ]);
```

### Q3: Rector runs slowly

**Optimization**:

```php
<?php

return RectorConfig::configure()
    // Enable parallel processing
    ->withParallel()

    // Limit paths to process
    ->withPaths([
        __DIR__ . '/app/domain',
        __DIR__ . '/app/service',
    ])

    // Configure cache
    ->withCache(__DIR__ . '/runtime/cache/rector');
```

### Q4: How to rollback Rector changes?

```bash
# If not committed yet
git checkout .

# If already committed
git revert HEAD

# If you want to keep some changes
git checkout HEAD -- app/specific/file.php
```

### Q5: Rector and Pint conflict

**Problem**: Rector and Pint formatting rules are inconsistent.

**Solution**:

```bash
# Run Rector first
composer rector:fix

# Then run Pint for formatting
composer fmt

# Or combine in Composer Script
```

```json
{
    "scripts": {
        "refactor": [
            "@rector:fix",
            "@fmt"
        ]
    }
}
```

---

## Best Practices

### Recommended

1. **Always run Dry-run first**
   ```bash
   composer rector  # Preview
   composer rector:fix  # Apply
   ```

2. **Incrementally upgrade PHP versions**
   ```php
   // Don't jump to PHP 8.3 at once
   // Wrong: php74: true, php83: true

   // Upgrade gradually
   // Correct: php74: true, php80: true
   // Correct: php80: true, php81: true
   // Correct: php81: true, php82: true
   ```

3. **Validate in CI**
   ```bash
   ./vendor/bin/rector process --dry-run
   ```

4. **Run tests after applying**
   ```bash
   composer rector:fix && composer test
   ```

5. **Check diff before committing**
   ```bash
   git diff
   ```

6. **Use version control**
   - Commit separately after each Rector run
   - Easy to rollback

7. **Use with PHPStan**
   ```bash
   composer rector:fix && composer stan
   ```

### Avoid

1. **Don't run directly on production code**
   - Running on main branch directly (Wrong)
   - Create a dedicated refactoring branch (Correct)

2. **Don't skip Dry-run**
   ```bash
   # Wrong
   ./vendor/bin/rector process

   # Correct
   ./vendor/bin/rector process --dry-run
   ./vendor/bin/rector process
   ```

3. **Don't apply all rules at once**
   - Enabling all rule sets (Wrong)
   - Enable rules gradually (Correct)

4. **Don't ignore test failures**
   ```bash
   # Must run tests after applying Rector
   composer rector:fix
   composer test  # Must pass
   ```

5. **Don't process vendor directory**
   ```php
   ->withSkip([
       __DIR__ . '/vendor',
   ])
   ```

---

## Workflow Examples

### PHP Version Upgrade Workflow

```bash
# 1. Create branch
git checkout -b upgrade/php-8.3

# 2. Update composer.json
# "require": { "php": "^8.3" }

# 3. Configure rector.php
cat > rector.php << 'EOF'
<?php
use Rector\Config\RectorConfig;

return RectorConfig::configure()
    ->withPaths([__DIR__ . '/app'])
    ->withPhpSets(php83: true);
EOF

# 4. Preview changes
composer rector

# 5. Check diff
# Confirm changes are reasonable

# 6. Apply changes
composer rector:fix

# 7. Format code
composer fmt

# 8. Run static analysis
composer stan

# 9. Run tests
composer test

# 10. Commit
git add .
git commit -m "refactor: upgrade to PHP 8.3"

# 11. Push and create PR
git push origin upgrade/php-8.3
```

### Legacy Code Refactoring Workflow

```bash
# 1. Create branch
git checkout -b refactor/legacy-code

# 2. Configure Rector for legacy code
cat > rector.php << 'EOF'
<?php
use Rector\Config\RectorConfig;
use Rector\Set\ValueObject\SetList;

return RectorConfig::configure()
    ->withPaths([__DIR__ . '/app/legacy'])
    ->withSets([
        SetList::CODE_QUALITY,
        SetList::DEAD_CODE,
        SetList::TYPE_DECLARATION,
    ]);
EOF

# 3. Preview changes
composer rector

# 4. Apply changes
composer rector:fix

# 5. Run tests
composer test

# 6. Commit
git add .
git commit -m "refactor: modernize legacy code"
```

---

## Integration with Other Tools

### Rector + Pint + PHPStan

```json
{
    "scripts": {
        "refactor": [
            "@rector:fix",
            "@fmt",
            "@stan"
        ]
    }
}
```

```bash
composer refactor
```

### Complete Quality Check

```json
{
    "scripts": {
        "quality": [
            "@fmt:test",
            "@rector",
            "@stan",
            "@test"
        ]
    }
}
```

---

## Related Documentation

- [Laravel Pint Code Formatting](./pint)
- [PHPStan Static Analysis](./phpstan)
- [Pest Testing Framework](./pest)
- [CI/CD Pipeline](./ci-pipeline)

---

## Reference Resources

- [Rector Official Documentation](https://getrector.com/)
- [Rector Rules List](https://github.com/rectorphp/rector/blob/main/docs/rector_rules_overview.md)
- [Rector Configuration Reference](https://getrector.com/documentation)
- [Custom Rule Development](https://getrector.com/documentation/custom-rule)
