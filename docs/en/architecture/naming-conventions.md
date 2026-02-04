---
title: "Naming Conventions"
description: "Unified naming conventions improve code readability and maintainability"
---

# Naming Conventions

> Unified naming conventions improve code readability and maintainability

---

## Table of Contents

- [Directory Naming](#directory-naming)
- [Namespace Naming](#namespace-naming)
- [Class Naming](#class-naming)
- [Interface Naming](#interface-naming)
- [Service Naming](#service-naming)
- [Repository Naming](#repository-naming)
- [Variable and Method Naming](#variable-and-method-naming)
- [Constant Naming](#constant-naming)

---

## Directory Naming

### Rules

- **All lowercase**
- **Underscore-separated**
- **No camelCase**
- **Clear semantics**

### Examples

```
Correct Examples
app/
├─ controller/
├─ service/
├─ domain/
│  ├─ order/
│  │  ├─ entity/
│  │  ├─ enum/                 enum directory
│  │  ├─ vo/                   value object directory
│  │  ├─ domain_event/         underscore-separated
│  │  └─ exception/
│  └─ user/
├─ contract/
│  ├─ repository/
│  └─ gateway/
├─ infrastructure/
│  ├─ repository/
│  │  ├─ eloquent/
│  │  └─ redis/
│  └─ gateway/
│     ├─ payment/
│     └─ sms/
└─ support/
   ├─ helper/
   └─ trait/

Wrong Examples
app/
├─ Controller/                   capitalized
├─ valueObject/                  camelCase
├─ domainEvent/                  camelCase
├─ PaymentGateway/               capitalized
└─ helperFunctions/              camelCase
```

### Common Directory Names

| Purpose | Correct | Wrong |
|---------|---------|-------|
| Enums | `enum/` | `Enum/`, `enums/` |
| Value Objects | `vo/` | `valueObject/`, `ValueObject/` |
| Domain Events | `domain_event/` | `domainEvent/`, `DomainEvent/` |
| External Gateway | `gateway/` | `Gateway/`, `gateways/` |
| Repository Implementation | `repository/` | `Repository/`, `repositories/` |
| Helper Functions | `helper/` | `Helper/`, `helpers/` |
| Custom Exceptions | `exception/` | `Exception/`, `exceptions/` |

---

## Namespace Naming

### Rules

- **Follow directory structure**
- **All lowercase**
- **Backslash separator**
- **Match directory names exactly**

### Examples

```php
<?php

// Correct Examples
namespace app\controller\api\v1;
namespace app\service\order;
namespace app\domain\order\entity;
namespace app\domain\order\enum;
namespace app\domain\order\vo;
namespace app\contract\repository;
namespace app\infrastructure\repository\eloquent;
namespace app\infrastructure\gateway\payment;
namespace app\support\helper;

// Wrong Examples
namespace App\Controller\Api\V1;              // capitalized
namespace app\service\Order;                  // Order capitalized
namespace app\domain\order\valueObject;       // camelCase
namespace app\infrastructure\PaymentGateway;  // camelCase
```

### Namespace to Directory Mapping

```
Directory Path                              Namespace
app/controller/api/v1/          →          app\controller\api\v1
app/service/order/              →          app\service\order
app/domain/order/entity/        →          app\domain\order\entity
app/domain/order/enum/          →          app\domain\order\enum
app/domain/order/vo/            →          app\domain\order\vo
app/contract/repository/        →          app\contract\repository
app/infrastructure/repository/  →          app\infrastructure\repository
```

---

## Class Naming

### Rules

- **StudlyCase** (PascalCase)
- **Singular form**
- **Clear semantics**
- **One class per file**

### Entity Classes

```php
<?php

declare(strict_types=1);

namespace app\domain\order\entity;

// Correct Examples
final class Order { }
final class OrderItem { }
final class User { }
final class Product { }

// Wrong Examples
final class order { }           // lowercase
final class ORDER { }           // all caps
final class Orders { }          // plural
final class order_entity { }    // underscore-separated
```

### Enums and Value Objects

> **enum/** - Fixed option sets like status, type, method
> **vo/** - Value objects needing validation, math, or multiple properties

```php
<?php

declare(strict_types=1);

namespace app\domain\order\enum;

// Enum Example - Fixed status options
enum OrderStatus: string
{
    case Pending = 'pending';
    case Paid = 'paid';
    case Shipped = 'shipped';
    case Cancelled = 'cancelled';

    public function isPending(): bool
    {
        return $this === self::Pending;
    }

    public function canBeCancelled(): bool
    {
        return in_array($this, [self::Pending, self::Paid]);
    }
}
```

```php
<?php

declare(strict_types=1);

namespace app\domain\order\vo;

// Value Object Example - Needs math operations
final class Money { }

// Value Object Example - Multiple properties
final class Address { }

// Value Object Example - Needs validation logic
final class Email { }
final class PhoneNumber { }

// Wrong Examples
final class money { }           // lowercase
final class order_status { }    // underscore-separated
```

### Domain Events

```php
<?php

declare(strict_types=1);

namespace app\domain\order\event;

// Correct Examples - past tense
final class OrderCreated { }
final class OrderCancelled { }
final class OrderShipped { }
final class PaymentReceived { }

// Wrong Examples
final class CreateOrder { }     // verb infinitive
final class OrderCreate { }     // verb infinitive
final class OrderCreatedEvent { }  // acceptable, but Event suffix is redundant
```

### Exception Classes

```php
<?php

declare(strict_types=1);

namespace app\domain\order\exception;

// Correct Examples - Exception suffix
final class InvalidOrderException extends \Exception { }
final class OrderNotFoundException extends \Exception { }
final class InsufficientInventoryException extends \Exception { }

// Wrong Examples
final class InvalidOrder { }    // missing Exception suffix
final class OrderError { }      // using Error instead of Exception
```

---

## Interface Naming

### Rules

- **Interface suffix**
- **Describe capability or responsibility**
- **StudlyCase**

### Repository Interfaces

```php
<?php

declare(strict_types=1);

namespace app\contract\repository;

// Correct Examples
interface OrderRepositoryInterface { }
interface UserRepositoryInterface { }
interface ProductRepositoryInterface { }

// Wrong Examples
interface OrderRepository { }           // missing Interface suffix
interface IOrderRepository { }          // I prefix (C# style)
interface OrderRepositoryContract { }   // Contract suffix
```

### Gateway Interfaces

```php
<?php

declare(strict_types=1);

namespace app\contract\gateway;

// Correct Examples
interface PaymentGatewayInterface { }
interface SmsGatewayInterface { }
interface EmailGatewayInterface { }
interface StorageGatewayInterface { }

// Wrong Examples
interface PaymentGateway { }            // missing Interface suffix
interface IPaymentGateway { }           // I prefix
```

### Service Interfaces

```php
<?php

declare(strict_types=1);

namespace app\contract\service;

// Correct Examples
interface NotificationServiceInterface { }
interface CacheServiceInterface { }
interface LoggerServiceInterface { }

// Wrong Examples
interface NotificationService { }       // missing Interface suffix
interface INotificationService { }      // I prefix
```

---

## Service Naming

### Rules

- **`{Verb}{Noun}Service`** pattern
- **Describe use case**
- **Single responsibility**

### Naming Pattern

```php
<?php

declare(strict_types=1);

namespace app\service\order;

// Correct Examples - Verb+Noun+Service
final class CreateOrderService { }
final class CancelOrderService { }
final class UpdateOrderService { }
final class RefundOrderService { }
final class GetOrderService { }
final class ListOrdersService { }

// Wrong Examples
final class OrderService { }            // too broad, unclear responsibility
final class OrderCreator { }            // missing Service suffix
final class OrderCreateService { }      // noun before verb
final class CreateOrder { }             // missing Service suffix
```

### Common Verbs

| Action | Verb | Example |
|--------|------|---------|
| Create | Create | `CreateOrderService` |
| Update | Update | `UpdateOrderService` |
| Delete | Delete | `DeleteOrderService` |
| Cancel | Cancel | `CancelOrderService` |
| Get Single | Get | `GetOrderService` |
| Get List | List | `ListOrdersService` |
| Search | Search | `SearchOrdersService` |
| Export | Export | `ExportOrdersService` |
| Import | Import | `ImportOrdersService` |
| Send | Send | `SendNotificationService` |
| Process | Process | `ProcessPaymentService` |
| Validate | Validate | `ValidateOrderService` |
| Calculate | Calculate | `CalculateTotalService` |

### Complete Example

```php
<?php

declare(strict_types=1);

namespace app\service\order;

use app\contract\repository\OrderRepositoryInterface;
use app\domain\order\entity\Order;

// Correct Example - clear use case name
final class CreateOrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository
    ) {
    }

    public function handle(int $userId, array $items, array $shippingAddress): Order
    {
        $order = Order::create($userId, $items, $shippingAddress);
        $this->orderRepository->save($order);
        return $order;
    }
}
```

---

## Repository Naming

### Interface Naming

```php
<?php

declare(strict_types=1);

namespace app\contract\repository;

// Correct Examples
interface OrderRepositoryInterface { }
interface UserRepositoryInterface { }
interface ProductRepositoryInterface { }
```

### Implementation Class Naming

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\repository\eloquent;

// Correct Examples - `{Implementation}{Entity}Repository`
final class EloquentOrderRepository implements OrderRepositoryInterface { }
final class EloquentUserRepository implements UserRepositoryInterface { }
final class EloquentProductRepository implements ProductRepositoryInterface { }

// Redis Implementation
namespace app\infrastructure\repository\redis;

final class RedisSessionRepository implements SessionRepositoryInterface { }
final class RedisCacheRepository implements CacheRepositoryInterface { }

// Wrong Examples
final class OrderRepository { }         // missing implementation prefix
final class OrderEloquentRepository { } // wrong order
final class EloquentOrder { }           // missing Repository suffix
```

### Repository Method Naming

```php
<?php

declare(strict_types=1);

namespace app\contract\repository;

use app\domain\order\entity\Order;

interface OrderRepositoryInterface
{
    // Correct Examples - clear method names
    public function findById(int $id): ?Order;
    public function findByUserId(int $userId): array;
    public function findByStatus(string $status): array;
    public function save(Order $order): void;
    public function delete(Order $order): void;
    public function exists(int $id): bool;
    public function count(): int;
    public function nextIdentity(): int;

    // Wrong Examples
    public function get(int $id): ?Order;           // not clear enough
    public function getById(int $id): ?Order;       // acceptable, but find is more common
    public function getByUser(int $userId): array;  // acceptable, but find is more common
    public function persist(Order $order): void;    // save is more intuitive
    public function remove(Order $order): void;     // acceptable, but delete is more intuitive
}
```

---

## Variable and Method Naming

### Variable Naming

```php
<?php

declare(strict_types=1);

// Correct Examples - camelCase
$userId = 1;
$orderItems = [];
$shippingAddress = [];
$totalAmount = 0;
$isActive = true;
$hasPermission = false;

// Wrong Examples
$user_id = 1;               // underscore-separated (PHP traditional, but not PER compliant)
$UserID = 1;                // capitalized
$USERID = 1;                // all caps
$order_items = [];          // underscore-separated
```

### Method Naming

```php
<?php

declare(strict_types=1);

namespace app\domain\order\entity;

final class Order
{
    // Correct Examples - camelCase
    public function calculateTotal(): void { }
    public function validateInventory(): void { }
    public function canBeCancelled(): bool { }
    public function isExpired(): bool { }
    public function hasItems(): bool { }

    // Getter methods - no get prefix
    public function id(): int { }
    public function userId(): int { }
    public function totalAmount(): Money { }
    public function status(): OrderStatus { }

    // Wrong Examples
    public function CalculateTotal(): void { }      // capitalized
    public function calculate_total(): void { }     // underscore-separated
    public function getId(): int { }                // acceptable, but not recommended (redundant)
    public function getUserId(): int { }            // acceptable, but not recommended (redundant)
}
```

### Boolean Method Naming

```php
<?php

declare(strict_types=1);

// Correct Examples - use is/has/can/should prefix
public function isActive(): bool { }
public function isExpired(): bool { }
public function hasPermission(): bool { }
public function hasItems(): bool { }
public function canBeCancelled(): bool { }
public function canBeRefunded(): bool { }
public function shouldNotify(): bool { }
public function shouldRetry(): bool { }

// Wrong Examples
public function active(): bool { }              // unclear
public function expired(): bool { }             // unclear
public function checkPermission(): bool { }     // check is less clear than has
```

---

## Constant Naming

### Class Constants

```php
<?php

declare(strict_types=1);

namespace app\domain\order\enum;

// Correct Example - UPPER_SNAKE_CASE (for traditional constant classes)
final class PaymentMethod
{
    public const CREDIT_CARD = 'credit_card';
    public const BANK_TRANSFER = 'bank_transfer';
    public const ALIPAY = 'alipay';
    public const WECHAT_PAY = 'wechat_pay';
}

// Recommended Example - Use PHP 8.1+ Enum instead of constant classes
enum PaymentMethod: string
{
    case CreditCard = 'credit_card';
    case BankTransfer = 'bank_transfer';
    case Alipay = 'alipay';
    case WechatPay = 'wechat_pay';
}

// Wrong Examples
final class PaymentMethod
{
    public const creditCard = 'credit_card';    // lowercase
    public const CreditCard = 'credit_card';    // camelCase
}
```

### Configuration Constants

```php
<?php

declare(strict_types=1);

// config/app.php

return [
    // Correct Examples - snake_case (config files use underscores)
    'app_name' => 'Webman App',
    'app_debug' => true,
    'default_timezone' => 'Asia/Shanghai',
    'max_upload_size' => 10 * 1024 * 1024,

    // Wrong Examples
    'appName' => 'Webman App',              // camelCase
    'AppDebug' => true,                     // capitalized
    'DEFAULT_TIMEZONE' => 'Asia/Shanghai',  // all caps
];
```

---

## Complete Example

### Order Module Naming Example

```
app/domain/order/
├─ entity/
│  ├─ Order.php                          # Entity class - StudlyCase
│  └─ OrderItem.php
├─ enum/                                 # Enum directory
│  ├─ OrderStatus.php                    # Enum - Fixed status options
│  └─ PaymentMethod.php                  # Enum - Payment methods
├─ vo/                                   # Value Object directory
│  ├─ Money.php                          # Value Object - Needs math operations
│  └─ Address.php                        # Value Object - Multiple properties
├─ event/
│  ├─ OrderCreated.php                   # Event - past tense
│  ├─ OrderCancelled.php
│  └─ OrderShipped.php
├─ exception/
│  ├─ InvalidOrderException.php          # Exception - Exception suffix
│  └─ OrderNotFoundException.php
└─ rule/
   └─ OrderCancellationRule.php          # Rule - Rule suffix
```

### Complete Class Example

```php
<?php

declare(strict_types=1);

namespace app\domain\order\entity;

use app\domain\order\vo\Money;
use app\domain\order\enum\OrderStatus;
use app\domain\order\event\OrderCreated;
use app\domain\order\exception\InvalidOrderException;

final class Order
{
    // Constants - UPPER_SNAKE_CASE
    private const MIN_ITEMS = 1;
    private const MAX_ITEMS = 100;

    private array $domainEvents = [];

    // Constructor parameters - camelCase
    private function __construct(
        private readonly int $id,
        private readonly int $userId,
        private array $items,
        private Money $totalAmount,
        private OrderStatus $status,
        private readonly \DateTimeImmutable $createdAt
    ) {
    }

    // Static factory method - camelCase
    public static function create(
        int $userId,
        array $items,
        array $shippingAddress
    ): self {
        if (empty($items)) {
            throw new InvalidOrderException('Order must have at least one item');
        }

        $order = new self(
            id: 0,
            userId: $userId,
            items: $items,
            totalAmount: Money::zero(),
            status: OrderStatus::Pending,
            createdAt: new \DateTimeImmutable()
        );

        $order->recordEvent(new OrderCreated($order));

        return $order;
    }

    // Business method - camelCase
    public function calculateTotal(): void
    {
        $total = array_reduce(
            $this->items,
            fn (Money $carry, array $item) => $carry->add(
                Money::fromCents($item['price'] * $item['quantity'])
            ),
            Money::zero()
        );

        $this->totalAmount = $total;
    }

    // Boolean method - can prefix
    public function canBeCancelled(): bool
    {
        return $this->status->canBeCancelled();
    }

    // Getter methods - no get prefix
    public function id(): int
    {
        return $this->id;
    }

    public function userId(): int
    {
        return $this->userId;
    }

    public function totalAmount(): Money
    {
        return $this->totalAmount;
    }

    public function status(): OrderStatus
    {
        return $this->status;
    }

    // Private method - camelCase
    private function recordEvent(object $event): void
    {
        $this->domainEvents[] = $event;
    }

    public function releaseEvents(): array
    {
        $events = $this->domainEvents;
        $this->domainEvents = [];
        return $events;
    }
}
```

---

## Naming Checklist

### Directories and Files

- [ ] Directory names all lowercase
- [ ] Use underscores to separate multiple words
- [ ] Class filenames use StudlyCase
- [ ] One class per file

### Namespaces and Classes

- [ ] Namespaces follow directory structure
- [ ] Namespaces all lowercase
- [ ] Class names use StudlyCase
- [ ] Interfaces use Interface suffix

### Service and Repository

- [ ] Service uses `{Verb}{Noun}Service` pattern
- [ ] Repository interface uses Interface suffix
- [ ] Repository implementation uses `{Implementation}{Entity}Repository` pattern

### Variables and Methods

- [ ] Variable names use camelCase
- [ ] Method names use camelCase
- [ ] Boolean methods use is/has/can/should prefix
- [ ] Getter methods don't use get prefix

### Constants

- [ ] Class constants use UPPER_SNAKE_CASE
- [ ] Config files use snake_case
- [ ] Prefer Enum over constant classes

---

## Related Documentation

- [Directory Structure Specification](./directory-structure)
- [Dependency Direction Rules](./dependency-rules)
- [Layer Responsibilities](./layer-responsibilities)
- [PER Coding Style](../coding-standards/per-coding-style)
