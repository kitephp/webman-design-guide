---
title: "PER Coding Style 概述"
description: "PHP Evolving Recommendation - 现代 PHP 代码风格规范"
---

## 目录

- [什么是 PER Coding Style](#什么是-per-coding-style)
- [规则速查表](#规则速查表)
- [与 PSR-12 的主要区别](#与-psr-12-的主要区别)
- [核心规则总结](#核心规则总结)
- [常见错误示例](#常见错误示例)
- [代码示例](#代码示例)
- [工具支持](#工具支持)
- [完整中文翻译](#完整中文翻译)
- [相关资源](#相关资源)
- [常见问题](#常见问题)

---

## 什么是 PER Coding Style

**PER (PHP Evolving Recommendation)** 是 PHP-FIG 推出的新一代编码规范，作为 PSR-12 的继任者。

### 核心特点

- **持续演进** - 随 PHP 语言特性更新而更新
- **向后兼容** - 完全兼容 PSR-12
- **现代特性** - 支持 PHP 8.0+ 新语法
- **社区驱动** - 由 PHP-FIG 社区维护

### 为什么选择 PER

1. **PSR-12 已冻结** - 不再更新以支持新 PHP 特性
2. **PHP 8+ 新语法** - 需要规范化的代码风格
3. **工具支持** - Laravel Pint、PHP-CS-Fixer 等工具已支持
4. **行业标准** - 正在成为新的行业标准

---

## 规则速查表

| 规则类别 | 规则 | 示例 |
|---------|------|------|
| **文件格式** | UTF-8 without BOM | - |
| **行尾** | Unix LF (`\n`) | - |
| **缩进** | 4 个空格 | `    $code;` |
| **行长度** | 软限制 120 字符 | - |
| **PHP 标签** | 长标签 `<?php` | `<?php` |
| **类名** | PascalCase | `UserController` |
| **方法名** | camelCase | `getUserById()` |
| **常量** | UPPER_CASE | `MAX_SIZE` |
| **属性** | camelCase | `$userName` |
| **关键字** | 小写 | `public`, `function`, `void` |
| **类型** | 小写 | `int`, `string`, `bool` |
| **联合类型** | 无空格 | `int\|float` |
| **交叉类型** | 无空格 | `Countable&Traversable` |
| **可空类型** | 无空格 | `?string` |
| **控制结构** | 关键字后一个空格 | `if ($expr) {` |
| **方法参数** | 逗号后一个空格 | `foo($a, $b)` |
| **二元运算符** | 前后各一个空格 | `$a + $b` |

---

## 与 PSR-12 的主要区别

### 对比表格

| 特性 | PSR-12 | PER | PHP 版本 |
|------|--------|-----|----------|
| **规范状态** | 已冻结 | 持续演进 | - |
| **构造器属性提升** | 不支持 | 支持 | PHP 8.0+ |
| **联合类型** | 不支持 | 支持 | PHP 8.0+ |
| **交叉类型** | 不支持 | 支持 | PHP 8.1+ |
| **枚举** | 不支持 | 支持 | PHP 8.1+ |
| **只读属性** | 不支持 | 支持 | PHP 8.1+ |
| **只读类** | 不支持 | 支持 | PHP 8.2+ |
| **独立类型 (DNF)** | 不支持 | 支持 | PHP 8.2+ |
| **match 表达式** | 不支持 | 支持 | PHP 8.0+ |
| **命名参数** | 不支持 | 支持 | PHP 8.0+ |
| **Null 安全运算符** | 不支持 | 支持 | PHP 8.0+ |

### 1. 类型声明

**PSR-12 (旧)**:
```php
function process($data)
{
    return $data;
}
```

**PER (新)**:
```php
function process(mixed $data): mixed
{
    return $data;
}
```

### 2. 构造器属性提升 (PHP 8.0+)

**PSR-12 (旧)**:
```php
class User
{
    private string $name;
    private int $age;

    public function __construct(string $name, int $age)
    {
        $this->name = $name;
        $this->age = $age;
    }
}
```

**PER (新)**:
```php
class User
{
    public function __construct(
        private string $name,
        private int $age,
    ) {
    }
}
```

### 3. 联合类型 (PHP 8.0+)

```php
function process(int|float $number): int|float
{
    return $number * 2;
}
```

### 4. 交叉类型 (PHP 8.1+)

```php
function process(Countable&Traversable $data): void
{
    // 实现
}
```

### 5. 枚举 (PHP 8.1+)

```php
enum Status: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
}
```

### 6. 只读属性 (PHP 8.1+)

```php
class User
{
    public function __construct(
        public readonly string $name,
        public readonly int $age,
    ) {
    }
}
```

### 7. 独立类型 (PHP 8.2+)

```php
class User
{
    public function __construct(
        private (A&B)|null $value = null,
    ) {
    }
}
```

---

## 核心规则总结

### 文件格式

- **编码**: UTF-8 without BOM
- **行尾**: Unix LF (`\n`)
- **文件结尾**: 必须有一个空行
- **PHP 标签**: 长标签 `<?php`，短标签仅用于模板 `<?=`

### 缩进与空格

- **缩进**: 4 个空格（不使用 Tab）
- **行长度**: 软限制 120 字符，硬限制无
- **空行**:
  - namespace 声明后必须有一个空行
  - use 声明块后必须有一个空行
  - 类的开始和结束大括号前后各一个空行

### 命名规范

- **类名**: `PascalCase` (StudlyCase)
- **方法名**: `camelCase`
- **常量**: `UPPER_CASE`
- **属性**: `camelCase` (推荐) 或 `snake_case`

### 类、属性和方法

```php
<?php

declare(strict_types=1);

namespace Vendor\Package;

use Vendor\Package\{ClassA as A, ClassB, ClassC as C};
use Vendor\Package\SomeNamespace\ClassD as D;

use function Vendor\Package\{functionA, functionB, functionC};

use const Vendor\Package\{CONSTANT_A, CONSTANT_B, CONSTANT_C};

class ClassName extends ParentClass implements
    \ArrayAccess,
    \Countable,
    \Serializable
{
    use FirstTrait;
    use SecondTrait;
    use ThirdTrait {
        ThirdTrait::bigTalk insteadof SecondTrait;
        SecondTrait::bigTalk as talk;
    }

    // 常量
    public const VERSION = '1.0.0';
    private const SECRET = 'secret';

    // 属性
    public string $publicProperty;
    protected int $protectedProperty;
    private array $privateProperty;

    // 构造器属性提升
    public function __construct(
        private string $name,
        private int $age,
        private readonly string $email,
    ) {
    }

    // 方法
    public function sampleMethod(int $a, int $b = null): array
    {
        if ($a === $b) {
            bar();
        } elseif ($a > $b) {
            $foo->bar($arg1);
        } else {
            BazClass::bar($arg2, $arg3);
        }

        return [
            'result' => $a + $b,
        ];
    }

    final public static function bar(): void
    {
        // 方法体
    }
}
```

### 控制结构

```php
<?php

// if-elseif-else
if ($expr1) {
    // if 体
} elseif ($expr2) {
    // elseif 体
} else {
    // else 体
}

// switch-case
switch ($expr) {
    case 0:
        echo 'First case';
        break;
    case 1:
        echo 'Second case';
        break;
    default:
        echo 'Default case';
        break;
}

// match (PHP 8.0+)
$result = match ($expr) {
    0 => 'First case',
    1 => 'Second case',
    default => 'Default case',
};

// while
while ($expr) {
    // 结构体
}

// do-while
do {
    // 结构体
} while ($expr);

// for
for ($i = 0; $i < 10; $i++) {
    // for 体
}

// foreach
foreach ($iterable as $key => $value) {
    // foreach 体
}

// try-catch-finally
try {
    // try 体
} catch (FirstThrowableType $e) {
    // catch 体
} catch (OtherThrowableType | AnotherThrowableType $e) {
    // catch 体
} finally {
    // finally 体
}
```

### 运算符

```php
<?php

// 一元运算符
$i++;
++$j;
!$value;

// 二元运算符（两侧有空格）
$result = $a + $b;
$result = $a - $b;
$result = $a * $b;
$result = $a / $b;
$result = $a % $b;
$result = $a ** $b;
$result = $a . $b;
$result = $a == $b;
$result = $a === $b;
$result = $a != $b;
$result = $a !== $b;
$result = $a < $b;
$result = $a > $b;
$result = $a <= $b;
$result = $a >= $b;
$result = $a <=> $b;
$result = $a && $b;
$result = $a || $b;
$result = $a ?? $b;

// 三元运算符
$result = $condition ? $ifTrue : $ifFalse;
$result = $condition
    ? $ifTrue
    : $ifFalse;
```

### 闭包和箭头函数

```php
<?php

// 闭包
$closureWithArgs = function ($arg1, $arg2) {
    // 体
};

$closureWithArgsAndVars = function ($arg1, $arg2) use ($var1, $var2) {
    // 体
};

$closureWithArgsVarsAndReturn = function ($arg1, $arg2) use ($var1, $var2): bool {
    // 体
};

// 箭头函数 (PHP 7.4+)
$arrow = fn($arg1, $arg2): int => $arg1 + $arg2;

// 多行箭头函数
$arrow = fn($arg1, $arg2): int =>
    $arg1 + $arg2 + $arg3;
```

### 匿名类

```php
<?php

$instance = new class extends \Foo implements \HandleableInterface {
    // 类内容
};

// 多行
$instance = new class(
    $arg1,
    $arg2
) extends \Foo implements
    \ArrayAccess,
    \Countable
{
    // 类内容
};
```

---

## 常见错误示例

### 错误 1: 类型声明中有空格

**错误**:
```php
<?php

function process(int | float $number): int | float
{
    return $number * 2;
}
```

**正确**:
```php
<?php

function process(int|float $number): int|float
{
    return $number * 2;
}
```

### 错误 2: 可空类型声明有空格

**错误**:
```php
<?php

function getName(? string $default = null): ? string
{
    return $default;
}
```

**正确**:
```php
<?php

function getName(?string $default = null): ?string
{
    return $default;
}
```

### 错误 3: 使用 Tab 缩进

**错误**:
```php
<?php

class User
{
	public function getName(): string
	{
		return $this->name;
	}
}
```

**正确**:
```php
<?php

class User
{
    public function getName(): string
    {
        return $this->name;
    }
}
```

### 错误 4: 控制结构关键字后缺少空格

**错误**:
```php
<?php

if($condition) {
    // body
}

foreach($items as $item) {
    // body
}
```

**正确**:
```php
<?php

if ($condition) {
    // body
}

foreach ($items as $item) {
    // body
}
```

### 错误 5: 方法参数逗号前有空格

**错误**:
```php
<?php

public function process(int $a , string $b , array $c): void
{
    // body
}
```

**正确**:
```php
<?php

public function process(int $a, string $b, array $c): void
{
    // body
}
```

### 错误 6: 二元运算符缺少空格

**错误**:
```php
<?php

$result=$a+$b;
$name=$firstName.$lastName;
if ($a===$b) {
    // body
}
```

**正确**:
```php
<?php

$result = $a + $b;
$name = $firstName . $lastName;
if ($a === $b) {
    // body
}
```

### 错误 7: 使用 else if 而不是 elseif

**错误**:
```php
<?php

if ($condition1) {
    // body
} else if ($condition2) {
    // body
}
```

**正确**:
```php
<?php

if ($condition1) {
    // body
} elseif ($condition2) {
    // body
}
```

### 错误 8: 返回类型声明缺少空格

**错误**:
```php
<?php

public function getName():string
{
    return $this->name;
}
```

**正确**:
```php
<?php

public function getName(): string
{
    return $this->name;
}
```

### 错误 9: 属性未声明可见性

**错误**:
```php
<?php

class User
{
    $name;
    $age;
}
```

**正确**:
```php
<?php

class User
{
    public string $name;
    public int $age;
}
```

### 错误 10: 类常量未声明可见性

**错误**:
```php
<?php

class Config
{
    const VERSION = '1.0.0';
    const API_KEY = 'secret';
}
```

**正确**:
```php
<?php

class Config
{
    public const VERSION = '1.0.0';
    private const API_KEY = 'secret';
}
```

### 错误 11: namespace 声明后缺少空行

**错误**:
```php
<?php

namespace App\Domain\User;
use App\Contract\Repository;

class UserService
{
    // body
}
```

**正确**:
```php
<?php

namespace App\Domain\User;

use App\Contract\Repository;

class UserService
{
    // body
}
```

### 错误 12: use 声明块后缺少空行

**错误**:
```php
<?php

namespace App\Domain\User;

use App\Contract\Repository;
use App\Domain\User\Entity\User;
class UserService
{
    // body
}
```

**正确**:
```php
<?php

namespace App\Domain\User;

use App\Contract\Repository;
use App\Domain\User\Entity\User;

class UserService
{
    // body
}
```

### 错误 13: 构造器属性提升格式错误

**错误**:
```php
<?php

class User
{
    public function __construct(private string $name, private int $age) {
    }
}
```

**正确**:
```php
<?php

class User
{
    public function __construct(
        private string $name,
        private int $age,
    ) {
    }
}
```

### 错误 14: 闭包格式错误

**错误**:
```php
<?php

$closure = function($arg1, $arg2)use($var1, $var2):bool{
    return true;
};
```

**正确**:
```php
<?php

$closure = function ($arg1, $arg2) use ($var1, $var2): bool {
    return true;
};
```

### 错误 15: 箭头函数格式错误

**错误**:
```php
<?php

$arrow = fn ($arg1, $arg2):int=>$arg1 + $arg2;
```

**正确**:
```php
<?php

$arrow = fn($arg1, $arg2): int => $arg1 + $arg2;
```

---

## 代码示例

### 完整示例：订单服务类

```php
<?php

declare(strict_types=1);

namespace App\Domain\Order;

use App\Contract\Repository\OrderRepositoryInterface;
use App\Contract\Service\PaymentServiceInterface;
use App\Domain\Order\Exception\OrderNotFoundException;
use App\Domain\Order\ValueObject\OrderId;
use App\Domain\Order\ValueObject\OrderStatus;

/**
 * 订单领域服务
 *
 * 处理订单业务逻辑和状态转换
 */
final class OrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository,
        private readonly PaymentServiceInterface $paymentService,
    ) {
    }

    /**
     * 创建新订单
     */
    public function createOrder(
        string $userId,
        array $items,
        float $totalAmount,
    ): Order {
        $order = new Order(
            id: OrderId::generate(),
            userId: $userId,
            items: $items,
            totalAmount: $totalAmount,
            status: OrderStatus::PENDING,
        );

        $this->orderRepository->save($order);

        return $order;
    }

    /**
     * 处理订单支付
     *
     * @throws OrderNotFoundException
     * @throws PaymentFailedException
     */
    public function processPayment(OrderId $orderId, string $paymentMethod): bool
    {
        $order = $this->orderRepository->findById($orderId);

        if ($order === null) {
            throw new OrderNotFoundException("订单 {$orderId->value()} 未找到");
        }

        // 验证订单状态
        if (!$order->canProcessPayment()) {
            return false;
        }

        // 处理支付
        $paymentResult = $this->paymentService->charge(
            amount: $order->totalAmount(),
            method: $paymentMethod,
            orderId: $orderId->value(),
        );

        if ($paymentResult->isSuccessful()) {
            $order->markAsPaid();
            $this->orderRepository->save($order);
            return true;
        }

        return false;
    }

    /**
     * 获取订单状态
     */
    public function getOrderStatus(OrderId $orderId): OrderStatus|null
    {
        $order = $this->orderRepository->findById($orderId);

        return $order?->status();
    }

    /**
     * 取消订单
     */
    public function cancelOrder(OrderId $orderId, string $reason): void
    {
        $order = $this->orderRepository->findById($orderId);

        if ($order === null) {
            throw new OrderNotFoundException("订单 {$orderId->value()} 未找到");
        }

        match ($order->status()) {
            OrderStatus::PENDING => $order->cancel($reason),
            OrderStatus::PAID => $order->refundAndCancel($reason),
            OrderStatus::CANCELLED => throw new \LogicException('订单已取消'),
            default => throw new \LogicException('当前状态无法取消订单'),
        };

        $this->orderRepository->save($order);
    }
}
```

### 示例：枚举使用

```php
<?php

declare(strict_types=1);

namespace App\Domain\Order\ValueObject;

enum OrderStatus: string
{
    case PENDING = 'pending';
    case PAID = 'paid';
    case PROCESSING = 'processing';
    case SHIPPED = 'shipped';
    case DELIVERED = 'delivered';
    case CANCELLED = 'cancelled';
    case REFUNDED = 'refunded';

    /**
     * 检查订单是否可以取消
     */
    public function canBeCancelled(): bool
    {
        return match ($this) {
            self::PENDING, self::PAID => true,
            default => false,
        };
    }

    /**
     * 获取状态标签
     */
    public function label(): string
    {
        return match ($this) {
            self::PENDING => '待支付',
            self::PAID => '已支付',
            self::PROCESSING => '处理中',
            self::SHIPPED => '已发货',
            self::DELIVERED => '已送达',
            self::CANCELLED => '已取消',
            self::REFUNDED => '已退款',
        };
    }

    /**
     * 获取下一个可能的状态
     *
     * @return array<self>
     */
    public function nextStatuses(): array
    {
        return match ($this) {
            self::PENDING => [self::PAID, self::CANCELLED],
            self::PAID => [self::PROCESSING, self::REFUNDED],
            self::PROCESSING => [self::SHIPPED, self::CANCELLED],
            self::SHIPPED => [self::DELIVERED],
            default => [],
        };
    }
}
```

### 示例：只读类 (PHP 8.2+)

```php
<?php

declare(strict_types=1);

namespace App\Domain\Order\ValueObject;

/**
 * 订单值对象（不可变）
 */
readonly class OrderId
{
    public function __construct(
        private string $value,
    ) {
        if (empty($value)) {
            throw new \InvalidArgumentException('订单 ID 不能为空');
        }
    }

    public static function generate(): self
    {
        return new self(uniqid('order_', true));
    }

    public static function fromString(string $value): self
    {
        return new self($value);
    }

    public function value(): string
    {
        return $this->value;
    }

    public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
```

---

## 完整中文翻译

查看完整的 PER Coding Style 中文翻译：

[PER Coding Style 中文完整版](./per-coding-style-chinese)

---

## 工具支持

### Laravel Pint

推荐使用 Laravel Pint 自动格式化代码：

```bash
composer require --dev laravel/pint
```

配置文件 `pint.json`:

```json
{
    "preset": "per"
}
```

运行格式化：

```bash
./vendor/bin/pint
```

### PHP-CS-Fixer

```bash
composer require --dev friendsofphp/php-cs-fixer
```

配置文件 `.php-cs-fixer.php`:

```php
<?php

$finder = PhpCsFixer\Finder::create()
    ->in(__DIR__)
    ->exclude('vendor');

return (new PhpCsFixer\Config())
    ->setRules([
        '@PER-CS' => true,
    ])
    ->setFinder($finder);
```

---

## 相关资源

### 官方文档

- [PER Coding Style 官方规范](https://www.php-fig.org/per/coding-style/)
- [PHP-FIG 官网](https://www.php-fig.org/)
- [PSR-12 规范](https://www.php-fig.org/psr/psr-12/)

### 工具

- [Laravel Pint](https://laravel.com/docs/pint)
- [PHP-CS-Fixer](https://github.com/PHP-CS-Fixer/PHP-CS-Fixer)
- [PHP_CodeSniffer](https://github.com/squizlabs/PHP_CodeSniffer)

---

## 常见问题

### Q: 为什么要从 PSR-12 迁移到 PER？

A: PSR-12 已冻结，不再更新以支持 PHP 8+ 的新特性。PER 是持续演进的规范，会随着 PHP 语言的发展而更新。

### Q: PER 与 PSR-12 兼容吗？

A: 是的，PER 完全向后兼容 PSR-12。所有符合 PSR-12 的代码也符合 PER。

### Q: 如何在现有项目中应用 PER？

A: 使用 Laravel Pint 或 PHP-CS-Fixer 等工具，配置 PER 预设，自动格式化代码。

### Q: 团队成员不熟悉 PER 怎么办？

A:
1. 配置 CI/CD 自动检查代码风格
2. 使用 Git hooks 在提交前自动格式化
3. 在 IDE 中配置自动格式化
4. 定期进行代码审查
