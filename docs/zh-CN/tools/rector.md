---
title: "Rector - 自动重构工具"
description: "自动升级 PHP 版本、重构代码、应用最佳实践"
---

# Rector - 自动重构工具

> 自动升级 PHP 版本、重构代码、应用最佳实践

---

## 目录

- [简介](#简介)
- [安装与配置](#安装与配置)
- [配置文件](#配置文件)
- [升级规则](#升级规则)
- [自定义规则](#自定义规则)
- [Dry-run vs Apply](#dry-run-vs-apply)
- [使用方法](#使用方法)
- [CI 集成](#ci-集成)
- [常见问题](#常见问题)
- [最佳实践](#最佳实践)

---

## 简介

### 什么是 Rector？

Rector 是一个自动化重构工具，可以：
- 自动升级 PHP 版本（7.4 → 8.1 → 8.2 → 8.3）
- 应用代码现代化规则
- 重构遗留代码
- 自动修复 PHPStan 错误
- 应用编码标准

**核心特性**：
- 300+ 内置规则
- 支持自定义规则
- 安全的 Dry-run 模式
- 增量重构
- 类型安全重构

### Rector 能做什么？

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

## 安装与配置

### 安装

```bash
# 安装 Rector
composer require --dev rector/rector

# 验证安装
./vendor/bin/rector --version
```

### 配置 Composer Scripts

在 `composer.json` 中添加：

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

## 配置文件

### rector.php

在项目根目录创建 `rector.php`：

#### 基础配置

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

#### 完整配置示例

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
    // 要处理的路径
    ->withPaths([
        __DIR__ . '/app/controller',
        __DIR__ . '/app/service',
        __DIR__ . '/app/domain',
        __DIR__ . '/app/infrastructure',
        __DIR__ . '/app/contract',
    ])

    // 跳过的路径
    ->withSkip([
        __DIR__ . '/app/view',
        __DIR__ . '/app/support/helper',
        __DIR__ . '/vendor',

        // 跳过特定规则
        ReadOnlyClassRector::class => [
            __DIR__ . '/app/domain/*/entity/*',
        ],
    ])

    // PHP 版本升级规则集
    ->withPhpSets(
        php81: true,  // PHP 8.1 特性
        php82: true,  // PHP 8.2 特性
        php83: true,  // PHP 8.3 特性
    )

    // 代码质量规则集
    ->withSets([
        LevelSetList::UP_TO_PHP_83,
        SetList::CODE_QUALITY,
        SetList::DEAD_CODE,
        SetList::EARLY_RETURN,
        SetList::TYPE_DECLARATION,
        SetList::PRIVATIZATION,
    ])

    // 自定义规则
    ->withRules([
        // 构造函数属性提升
        InlineConstructorDefaultToPropertyRector::class,

        // 只读属性
        ReadOnlyPropertyRector::class,

        // 类型声明
        TypedPropertyFromStrictConstructorRector::class,
        ReturnTypeFromStrictScalarReturnExprRector::class,
        AddVoidReturnTypeWhereNoReturnRector::class,

        // 代码简化
        SimplifyIfReturnBoolRector::class,
        ChangeIfElseValueAssignToEarlyReturnRector::class,

        // 死代码移除
        RemoveUnusedPrivateMethodRector::class,
        RemoveUnusedPrivatePropertyRector::class,

        // PHP 8.3 特性
        AddOverrideAttributeToOverriddenMethodsRector::class,
    ])

    // 并行处理
    ->withParallel()

    // 缓存目录
    ->withCache(__DIR__ . '/runtime/cache/rector')

    // 导入短类名
    ->withImportNames();
```

### 配置说明

#### PHP 版本升级规则集

| 规则集 | 说明 |
|--------|------|
| `php81: true` | PHP 8.1 特性 |
| `php82: true` | PHP 8.2 特性 |
| `php83: true` | PHP 8.3 特性 |

#### 通用规则集

| 规则集 | 说明 |
|--------|------|
| `CODE_QUALITY` | 代码质量改进 |
| `DEAD_CODE` | 移除死代码 |
| `EARLY_RETURN` | 提前返回模式 |
| `TYPE_DECLARATION` | 类型声明 |
| `PRIVATIZATION` | 私有化 |

---

## 升级规则

### PHP 8.1 特性

#### 1. 只读属性

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

#### 2. 枚举

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

#### 3. 新的初始化器

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

### PHP 8.2 特性

#### 1. 只读类

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

#### 2. DNF 类型

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

### PHP 8.3 特性

#### 1. Override 属性

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

#### 2. 类型化类常量

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

## 自定义规则

### 创建自定义规则

创建 `app/support/rector/RemoveDumpRector.php`：

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

        // 移除该节点
        $this->removeNode($node);

        return $node;
    }
}
```

### 在配置中使用自定义规则

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

### Dry-run 模式（预览）

**用途**：预览将要进行的更改，不修改文件。

```bash
# 预览所有更改
./vendor/bin/rector process --dry-run

# 预览指定目录
./vendor/bin/rector process app/domain --dry-run

# 使用 Composer Script
composer rector
```

**输出示例**：

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

### Apply 模式（应用更改）

**用途**：实际修改文件。

```bash
# 应用所有更改
./vendor/bin/rector process

# 应用到指定目录
./vendor/bin/rector process app/domain

# 使用 Composer Script
composer rector:fix
```

**建议工作流**：

```bash
# 1. 先预览
composer rector

# 2. 检查 diff
git diff

# 3. 确认无误后应用
composer rector:fix

# 4. 再次检查
git diff

# 5. 运行测试
composer test

# 6. 提交
git add .
git commit -m "refactor: apply Rector rules"
```

---

## 使用方法

### 基本命令

```bash
# 预览更改（推荐先运行）
./vendor/bin/rector process --dry-run

# 应用更改
./vendor/bin/rector process

# 处理指定目录
./vendor/bin/rector process app/domain

# 处理指定文件
./vendor/bin/rector process app/domain/order/entity/Order.php

# 显示详细输出
./vendor/bin/rector process --dry-run --debug

# 清除缓存
./vendor/bin/rector process --clear-cache

# 仅应用特定规则
./vendor/bin/rector process --only=InlineConstructorDefaultToPropertyRector
```

### 使用场景

#### 场景 1：升级 PHP 版本

```bash
# 1. 更新 composer.json
# "require": { "php": "^8.3" }

# 2. 配置 rector.php
# ->withPhpSets(php83: true)

# 3. 预览更改
composer rector

# 4. 应用更改
composer rector:fix

# 5. 运行测试
composer test
```

#### 场景 2：重构遗留代码

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
# 重构遗留代码
./vendor/bin/rector process app/legacy --dry-run
./vendor/bin/rector process app/legacy
```

#### 场景 3：修复 PHPStan 错误

```bash
# 1. 运行 PHPStan
composer stan

# 2. 配置 Rector 修复类型问题
# ->withSets([SetList::TYPE_DECLARATION])

# 3. 应用 Rector
composer rector:fix

# 4. 再次运行 PHPStan
composer stan
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

在 `.gitlab-ci.yml` 中添加：

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

## 常见问题

### Q1: Rector 修改了不该修改的代码

**问题**：Rector 修改了第三方库或生成的代码。

**解决方案**：在 `rector.php` 中添加 `withSkip()`：

```php
<?php

return RectorConfig::configure()
    ->withSkip([
        __DIR__ . '/vendor',
        __DIR__ . '/app/view',
        __DIR__ . '/storage',

        // 跳过特定规则
        ReadOnlyClassRector::class => [
            __DIR__ . '/app/domain/*/entity/*',
        ],
    ]);
```

### Q2: 如何只应用特定规则？

**方法 1**：使用 `--only` 参数

```bash
./vendor/bin/rector process --only=InlineConstructorDefaultToPropertyRector
```

**方法 2**：在配置中只启用特定规则

```php
<?php

return RectorConfig::configure()
    ->withRules([
        InlineConstructorDefaultToPropertyRector::class,
        ReadOnlyPropertyRector::class,
    ]);
```

### Q3: Rector 运行很慢

**优化方案**：

```php
<?php

return RectorConfig::configure()
    // 启用并行处理
    ->withParallel()

    // 限制处理的路径
    ->withPaths([
        __DIR__ . '/app/domain',
        __DIR__ . '/app/service',
    ])

    // 配置缓存
    ->withCache(__DIR__ . '/runtime/cache/rector');
```

### Q4: 如何回滚 Rector 的更改？

```bash
# 如果还未提交
git checkout .

# 如果已提交
git revert HEAD

# 如果想保留部分更改
git checkout HEAD -- app/specific/file.php
```

### Q5: Rector 和 Pint 冲突

**问题**：Rector 和 Pint 的格式化规则不一致。

**解决方案**：

```bash
# 先运行 Rector
composer rector:fix

# 再运行 Pint 格式化
composer fmt

# 或者在 Composer Script 中组合
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

## 最佳实践

### 推荐做法

1. **始终先运行 Dry-run**
   ```bash
   composer rector  # 预览
   composer rector:fix  # 应用
   ```

2. **增量升级 PHP 版本**
   ```php
   // 不要一次性跳到 PHP 8.3
   // 错误: php74: true, php83: true

   // 逐步升级
   // 正确: php74: true, php80: true
   // 正确: php80: true, php81: true
   // 正确: php81: true, php82: true
   ```

3. **在 CI 中验证**
   ```bash
   ./vendor/bin/rector process --dry-run
   ```

4. **应用后运行测试**
   ```bash
   composer rector:fix && composer test
   ```

5. **提交前检查 diff**
   ```bash
   git diff
   ```

6. **使用版本控制**
   - 每次 Rector 运行后单独提交
   - 便于回滚

7. **配合 PHPStan 使用**
   ```bash
   composer rector:fix && composer stan
   ```

### 避免做法

1. **不要直接在生产代码上运行**
   - 直接在主分支运行（错误）
   - 创建专门的重构分支（正确）

2. **不要跳过 Dry-run**
   ```bash
   # 错误
   ./vendor/bin/rector process

   # 正确
   ./vendor/bin/rector process --dry-run
   ./vendor/bin/rector process
   ```

3. **不要一次性应用所有规则**
   - 启用所有规则集（错误）
   - 逐步启用规则（正确）

4. **不要忽略测试失败**
   ```bash
   # 应用 Rector 后必须运行测试
   composer rector:fix
   composer test  # 必须通过
   ```

5. **不要处理 vendor 目录**
   ```php
   ->withSkip([
       __DIR__ . '/vendor',
   ])
   ```

---

## 工作流示例

### 升级 PHP 版本工作流

```bash
# 1. 创建分支
git checkout -b upgrade/php-8.3

# 2. 更新 composer.json
# "require": { "php": "^8.3" }

# 3. 配置 rector.php
cat > rector.php << 'EOF'
<?php
use Rector\Config\RectorConfig;

return RectorConfig::configure()
    ->withPaths([__DIR__ . '/app'])
    ->withPhpSets(php83: true);
EOF

# 4. 预览更改
composer rector

# 5. 检查 diff
# 确认更改合理

# 6. 应用更改
composer rector:fix

# 7. 格式化代码
composer fmt

# 8. 运行静态分析
composer stan

# 9. 运行测试
composer test

# 10. 提交
git add .
git commit -m "refactor: upgrade to PHP 8.3"

# 11. 推送并创建 PR
git push origin upgrade/php-8.3
```

### 重构遗留代码工作流

```bash
# 1. 创建分支
git checkout -b refactor/legacy-code

# 2. 配置 Rector 针对遗留代码
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

# 3. 预览更改
composer rector

# 4. 应用更改
composer rector:fix

# 5. 运行测试
composer test

# 6. 提交
git add .
git commit -m "refactor: modernize legacy code"
```

---

## 与其他工具配合

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

### 完整质量检查

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

## 相关文档

- [Laravel Pint 代码格式化](./pint)
- [PHPStan 静态分析](./phpstan)
- [Pest 测试框架](./pest)
- [CI/CD 流水线](./ci-pipeline)

---

## 参考资源

- [Rector 官方文档](https://getrector.com/)
- [Rector 规则列表](https://github.com/rectorphp/rector/blob/main/docs/rector_rules_overview.md)
- [Rector 配置参考](https://getrector.com/documentation)
- [自定义规则开发](https://getrector.com/documentation/custom-rule)
