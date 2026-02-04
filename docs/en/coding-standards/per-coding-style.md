---
title: "PER Coding Style Overview"
description: "PHP Evolving Recommendation - Modern PHP Code Style Standard"
---

## Table of Contents

- [What is PER Coding Style](#what-is-per-coding-style)
- [Quick Reference](#quick-reference)
- [Key Differences from PSR-12](#key-differences-from-psr-12)
- [Core Rules Summary](#core-rules-summary)
- [Common Mistakes](#common-mistakes)
- [Code Examples](#code-examples)
- [Tool Support](#tool-support)
- [Related Resources](#related-resources)
- [FAQ](#faq)

---

## What is PER Coding Style

**PER (PHP Evolving Recommendation)** is the next-generation coding standard from PHP-FIG, serving as the successor to PSR-12.

### Key Features

- **Continuously Evolving** - Updates with PHP language features
- **Backward Compatible** - Fully compatible with PSR-12
- **Modern Features** - Supports PHP 8.0+ syntax
- **Community Driven** - Maintained by PHP-FIG community

### Why Choose PER

1. **PSR-12 is Frozen** - No longer updated for new PHP features
2. **PHP 8+ Syntax** - Needs standardized code style
3. **Tool Support** - Laravel Pint, PHP-CS-Fixer already support it
4. **Industry Standard** - Becoming the new industry standard

---

## Quick Reference

| Category | Rule | Example |
|----------|------|---------|
| **File Format** | UTF-8 without BOM | - |
| **Line Ending** | Unix LF (`\n`) | - |
| **Indentation** | 4 spaces | `    $code;` |
| **Line Length** | Soft limit 120 chars | - |
| **PHP Tags** | Long tag `<?php` | `<?php` |
| **Class Names** | PascalCase | `UserController` |
| **Method Names** | camelCase | `getUserById()` |
| **Constants** | UPPER_CASE | `MAX_SIZE` |
| **Properties** | camelCase | `$userName` |
| **Keywords** | lowercase | `public`, `function`, `void` |
| **Types** | lowercase | `int`, `string`, `bool` |
| **Union Types** | No spaces | `int\|float` |
| **Intersection Types** | No spaces | `Countable&Traversable` |
| **Nullable Types** | No spaces | `?string` |
| **Control Structures** | Space after keyword | `if ($expr) {` |
| **Method Parameters** | Space after comma | `foo($a, $b)` |
| **Binary Operators** | Space on both sides | `$a + $b` |

---

## Key Differences from PSR-12

### Comparison Table

| Feature | PSR-12 | PER | PHP Version |
|---------|--------|-----|-------------|
| **Status** | Frozen | Evolving | - |
| **Constructor Property Promotion** | Not supported | Supported | PHP 8.0+ |
| **Union Types** | Not supported | Supported | PHP 8.0+ |
| **Intersection Types** | Not supported | Supported | PHP 8.1+ |
| **Enums** | Not supported | Supported | PHP 8.1+ |
| **Readonly Properties** | Not supported | Supported | PHP 8.1+ |
| **Readonly Classes** | Not supported | Supported | PHP 8.2+ |
| **DNF Types** | Not supported | Supported | PHP 8.2+ |
| **Match Expression** | Not supported | Supported | PHP 8.0+ |
| **Named Arguments** | Not supported | Supported | PHP 8.0+ |
| **Nullsafe Operator** | Not supported | Supported | PHP 8.0+ |

### 1. Type Declarations

**PSR-12 (Old)**:
```php
function process($data)
{
    return $data;
}
```

**PER (New)**:
```php
function process(mixed $data): mixed
{
    return $data;
}
```

### 2. Constructor Property Promotion (PHP 8.0+)

**PSR-12 (Old)**:
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

**PER (New)**:
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

### 3. Union Types (PHP 8.0+)

```php
function process(int|float $number): int|float
{
    return $number * 2;
}
```

### 4. Intersection Types (PHP 8.1+)

```php
function process(Countable&Traversable $data): void
{
    // Implementation
}
```

### 5. Enums (PHP 8.1+)

```php
enum Status: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
}
```

### 6. Readonly Properties (PHP 8.1+)

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

### 7. DNF Types (PHP 8.2+)

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

## Core Rules Summary

### File Format

- **Encoding**: UTF-8 without BOM
- **Line Ending**: Unix LF (`\n`)
- **File Ending**: Must end with a blank line
- **PHP Tags**: Long tag `<?php`, short echo tag only for templates `<?=`

### Indentation and Spacing

- **Indentation**: 4 spaces (no tabs)
- **Line Length**: Soft limit 120 characters, no hard limit
- **Blank Lines**:
  - One blank line after namespace declaration
  - One blank line after use declaration block
  - One blank line before and after class braces

### Naming Conventions

- **Class Names**: `PascalCase` (StudlyCase)
- **Method Names**: `camelCase`
- **Constants**: `UPPER_CASE`
- **Properties**: `camelCase` (recommended) or `snake_case`

### Classes, Properties and Methods

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

    // Constants
    public const VERSION = '1.0.0';
    private const SECRET = 'secret';

    // Properties
    public string $publicProperty;
    protected int $protectedProperty;
    private array $privateProperty;

    // Constructor with property promotion
    public function __construct(
        private string $name,
        private int $age,
        private readonly string $email,
    ) {
    }

    // Methods
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
        // Method body
    }
}
```

### Control Structures

```php
<?php

// if-elseif-else
if ($expr1) {
    // if body
} elseif ($expr2) {
    // elseif body
} else {
    // else body
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
    // structure body
}

// do-while
do {
    // structure body
} while ($expr);

// for
for ($i = 0; $i < 10; $i++) {
    // for body
}

// foreach
foreach ($iterable as $key => $value) {
    // foreach body
}

// try-catch-finally
try {
    // try body
} catch (FirstThrowableType $e) {
    // catch body
} catch (OtherThrowableType | AnotherThrowableType $e) {
    // catch body
} finally {
    // finally body
}
```

### Operators

```php
<?php

// Unary operators
$i++;
++$j;
!$value;

// Binary operators (space on both sides)
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

// Ternary operator
$result = $condition ? $ifTrue : $ifFalse;
$result = $condition
    ? $ifTrue
    : $ifFalse;
```

### Closures and Arrow Functions

```php
<?php

// Closure
$closureWithArgs = function ($arg1, $arg2) {
    // body
};

$closureWithArgsAndVars = function ($arg1, $arg2) use ($var1, $var2) {
    // body
};

$closureWithArgsVarsAndReturn = function ($arg1, $arg2) use ($var1, $var2): bool {
    // body
};

// Arrow function (PHP 7.4+)
$arrow = fn($arg1, $arg2): int => $arg1 + $arg2;

// Multi-line arrow function
$arrow = fn($arg1, $arg2): int =>
    $arg1 + $arg2 + $arg3;
```

### Anonymous Classes

```php
<?php

$instance = new class extends \Foo implements \HandleableInterface {
    // Class content
};

// Multi-line
$instance = new class(
    $arg1,
    $arg2
) extends \Foo implements
    \ArrayAccess,
    \Countable
{
    // Class content
};
```

---

## Common Mistakes

### Mistake 1: Spaces in Type Declarations

**Wrong**:
```php
<?php

function process(int | float $number): int | float
{
    return $number * 2;
}
```

**Correct**:
```php
<?php

function process(int|float $number): int|float
{
    return $number * 2;
}
```

### Mistake 2: Spaces in Nullable Type Declarations

**Wrong**:
```php
<?php

function getName(? string $default = null): ? string
{
    return $default;
}
```

**Correct**:
```php
<?php

function getName(?string $default = null): ?string
{
    return $default;
}
```

### Mistake 3: Using Tab Indentation

**Wrong**:
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

**Correct**:
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

### Mistake 4: Missing Space After Control Structure Keywords

**Wrong**:
```php
<?php

if($condition) {
    // body
}

foreach($items as $item) {
    // body
}
```

**Correct**:
```php
<?php

if ($condition) {
    // body
}

foreach ($items as $item) {
    // body
}
```

### Mistake 5: Space Before Comma in Method Parameters

**Wrong**:
```php
<?php

public function process(int $a , string $b , array $c): void
{
    // body
}
```

**Correct**:
```php
<?php

public function process(int $a, string $b, array $c): void
{
    // body
}
```

### Mistake 6: Missing Spaces Around Binary Operators

**Wrong**:
```php
<?php

$result=$a+$b;
$name=$firstName.$lastName;
if ($a===$b) {
    // body
}
```

**Correct**:
```php
<?php

$result = $a + $b;
$name = $firstName . $lastName;
if ($a === $b) {
    // body
}
```

### Mistake 7: Using else if Instead of elseif

**Wrong**:
```php
<?php

if ($condition1) {
    // body
} else if ($condition2) {
    // body
}
```

**Correct**:
```php
<?php

if ($condition1) {
    // body
} elseif ($condition2) {
    // body
}
```

### Mistake 8: Missing Space After Return Type Colon

**Wrong**:
```php
<?php

public function getName():string
{
    return $this->name;
}
```

**Correct**:
```php
<?php

public function getName(): string
{
    return $this->name;
}
```

### Mistake 9: Properties Without Visibility

**Wrong**:
```php
<?php

class User
{
    $name;
    $age;
}
```

**Correct**:
```php
<?php

class User
{
    public string $name;
    public int $age;
}
```

### Mistake 10: Class Constants Without Visibility

**Wrong**:
```php
<?php

class Config
{
    const VERSION = '1.0.0';
    const API_KEY = 'secret';
}
```

**Correct**:
```php
<?php

class Config
{
    public const VERSION = '1.0.0';
    private const API_KEY = 'secret';
}
```

### Mistake 11: Missing Blank Line After Namespace

**Wrong**:
```php
<?php

namespace App\Domain\User;
use App\Contract\Repository;

class UserService
{
    // body
}
```

**Correct**:
```php
<?php

namespace App\Domain\User;

use App\Contract\Repository;

class UserService
{
    // body
}
```

### Mistake 12: Missing Blank Line After Use Block

**Wrong**:
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

**Correct**:
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

### Mistake 13: Wrong Constructor Property Promotion Format

**Wrong**:
```php
<?php

class User
{
    public function __construct(private string $name, private int $age) {
    }
}
```

**Correct**:
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

### Mistake 14: Wrong Closure Format

**Wrong**:
```php
<?php

$closure = function($arg1, $arg2)use($var1, $var2):bool{
    return true;
};
```

**Correct**:
```php
<?php

$closure = function ($arg1, $arg2) use ($var1, $var2): bool {
    return true;
};
```

### Mistake 15: Wrong Arrow Function Format

**Wrong**:
```php
<?php

$arrow = fn ($arg1, $arg2):int=>$arg1 + $arg2;
```

**Correct**:
```php
<?php

$arrow = fn($arg1, $arg2): int => $arg1 + $arg2;
```

---

## Code Examples

### Complete Example: Order Service Class

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
 * Order domain service
 *
 * Handles order business logic and state transitions
 */
final class OrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository,
        private readonly PaymentServiceInterface $paymentService,
    ) {
    }

    /**
     * Create a new order
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
     * Process order payment
     *
     * @throws OrderNotFoundException
     * @throws PaymentFailedException
     */
    public function processPayment(OrderId $orderId, string $paymentMethod): bool
    {
        $order = $this->orderRepository->findById($orderId);

        if ($order === null) {
            throw new OrderNotFoundException("Order {$orderId->value()} not found");
        }

        // Validate order status
        if (!$order->canProcessPayment()) {
            return false;
        }

        // Process payment
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
     * Get order status
     */
    public function getOrderStatus(OrderId $orderId): OrderStatus|null
    {
        $order = $this->orderRepository->findById($orderId);

        return $order?->status();
    }

    /**
     * Cancel order
     */
    public function cancelOrder(OrderId $orderId, string $reason): void
    {
        $order = $this->orderRepository->findById($orderId);

        if ($order === null) {
            throw new OrderNotFoundException("Order {$orderId->value()} not found");
        }

        match ($order->status()) {
            OrderStatus::PENDING => $order->cancel($reason),
            OrderStatus::PAID => $order->refundAndCancel($reason),
            OrderStatus::CANCELLED => throw new \LogicException('Order already cancelled'),
            default => throw new \LogicException('Cannot cancel order in current status'),
        };

        $this->orderRepository->save($order);
    }
}
```

### Example: Enum Usage

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
     * Check if order can be cancelled
     */
    public function canBeCancelled(): bool
    {
        return match ($this) {
            self::PENDING, self::PAID => true,
            default => false,
        };
    }

    /**
     * Get status label
     */
    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pending Payment',
            self::PAID => 'Paid',
            self::PROCESSING => 'Processing',
            self::SHIPPED => 'Shipped',
            self::DELIVERED => 'Delivered',
            self::CANCELLED => 'Cancelled',
            self::REFUNDED => 'Refunded',
        };
    }

    /**
     * Get next possible statuses
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

### Example: Readonly Class (PHP 8.2+)

```php
<?php

declare(strict_types=1);

namespace App\Domain\Order\ValueObject;

/**
 * Order value object (immutable)
 */
readonly class OrderId
{
    public function __construct(
        private string $value,
    ) {
        if (empty($value)) {
            throw new \InvalidArgumentException('Order ID cannot be empty');
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

## Tool Support

### Laravel Pint

Recommended for automatic code formatting:

```bash
composer require --dev laravel/pint
```

Configuration file `pint.json`:

```json
{
    "preset": "per"
}
```

Run formatting:

```bash
./vendor/bin/pint
```

### PHP-CS-Fixer

```bash
composer require --dev friendsofphp/php-cs-fixer
```

Configuration file `.php-cs-fixer.php`:

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

## Related Resources

### Official Documentation

- [PER Coding Style Official Specification](https://www.php-fig.org/per/coding-style/)
- [PHP-FIG Official Website](https://www.php-fig.org/)
- [PSR-12 Specification](https://www.php-fig.org/psr/psr-12/)

### Tools

- [Laravel Pint](https://laravel.com/docs/pint)
- [PHP-CS-Fixer](https://github.com/PHP-CS-Fixer/PHP-CS-Fixer)
- [PHP_CodeSniffer](https://github.com/squizlabs/PHP_CodeSniffer)

---

## FAQ

### Q: Why migrate from PSR-12 to PER?

A: PSR-12 is frozen and no longer updated for PHP 8+ features. PER is a continuously evolving specification that updates with PHP language development.

### Q: Is PER compatible with PSR-12?

A: Yes, PER is fully backward compatible with PSR-12. All PSR-12 compliant code is also PER compliant.

### Q: How to apply PER in existing projects?

A: Use tools like Laravel Pint or PHP-CS-Fixer, configure the PER preset, and automatically format your code.

### Q: What if team members are unfamiliar with PER?

A:
1. Configure CI/CD to automatically check code style
2. Use Git hooks to auto-format before commits
3. Configure auto-formatting in IDE
4. Conduct regular code reviews
