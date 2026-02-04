---
title: "Directory Structure Specification"
description: "Recommended directory organization for Webman projects"
---

# Directory Structure Specification

> Recommended directory organization for Webman projects

---

## Table of Contents

- [Complete Directory Tree](#complete-directory-tree)
- [Directory Description](#directory-description)
- [Naming Rules](#naming-rules)
- [Scalability Considerations](#scalability-considerations)

---

## Complete Directory Tree

```
project-root/
├─ app/
│  ├─ controller/              # [Webman Default] HTTP Controllers
│  │  ├─ api/                  # API Controllers
│  │  │  └─ v1/                # API Version
│  │  └─ web/                  # Web Page Controllers
│  │
│  ├─ model/                   # [Webman Default] ORM Models (data mapping only)
│  │  └─ eloquent/             # Eloquent Models
│  │
│  ├─ middleware/              # [Webman Default] Middleware
│  │  ├─ auth/                 # Authentication
│  │  ├─ cors/                 # CORS Handling
│  │  └─ rate_limit/           # Rate Limiting
│  │
│  ├─ process/                 # [Webman Default] Custom Processes
│  │  ├─ task/                 # Async Tasks
│  │  └─ monitor/              # Monitor Processes
│  │
│  ├─ service/                 # [New] Application Layer Services
│  │  ├─ order/                # Order Use Cases
│  │  │  ├─ CreateOrderService.php
│  │  │  ├─ CancelOrderService.php
│  │  │  └─ RefundOrderService.php
│  │  ├─ user/                 # User Use Cases
│  │  └─ payment/              # Payment Use Cases
│  │
│  ├─ domain/                  # [New] Domain Layer
│  │  ├─ order/                # Order Bounded Context
│  │  │  ├─ entity/            # Entities
│  │  │  │  ├─ Order.php
│  │  │  │  └─ OrderItem.php
│  │  │  ├─ enum/              # Enums (fixed options)
│  │  │  │  ├─ OrderStatus.php
│  │  │  │  └─ PaymentMethod.php
│  │  │  ├─ vo/                # Value Objects (with validation/math)
│  │  │  │  ├─ Money.php
│  │  │  │  └─ Address.php
│  │  │  ├─ event/             # Domain Events
│  │  │  │  ├─ OrderCreated.php
│  │  │  │  └─ OrderCancelled.php
│  │  │  └─ rule/              # Business Rules
│  │  │     └─ OrderCancellationRule.php
│  │  │
│  │  ├─ user/                 # User Bounded Context
│  │  │  ├─ entity/
│  │  │  ├─ enum/
│  │  │  ├─ vo/
│  │  │  └─ event/
│  │  │
│  │  └─ shared/               # Shared Domain Concepts
│  │     └─ vo/
│  │        ├─ Email.php
│  │        └─ PhoneNumber.php
│  │
│  ├─ contract/                # [New] Interface Definitions
│  │  ├─ repository/           # Repository Interfaces
│  │  │  ├─ OrderRepositoryInterface.php
│  │  │  └─ UserRepositoryInterface.php
│  │  ├─ gateway/              # External Service Gateway Interfaces
│  │  │  ├─ PaymentGatewayInterface.php
│  │  │  └─ SmsGatewayInterface.php
│  │  └─ service/              # Service Interfaces
│  │     └─ NotificationServiceInterface.php
│  │
│  ├─ infrastructure/          # [New] Infrastructure Layer
│  │  ├─ repository/           # Repository Implementations
│  │  │  ├─ eloquent/          # Eloquent Implementation
│  │  │  │  ├─ EloquentOrderRepository.php
│  │  │  │  └─ EloquentUserRepository.php
│  │  │  └─ redis/             # Redis Implementation
│  │  │     └─ RedisSessionRepository.php
│  │  │
│  │  ├─ gateway/              # External Service Adapters
│  │  │  ├─ payment/
│  │  │  │  ├─ StripePaymentGateway.php
│  │  │  │  └─ AlipayPaymentGateway.php
│  │  │  └─ sms/
│  │  │     └─ TwilioSmsGateway.php
│  │  │
│  │  ├─ persistence/          # Persistence Related
│  │  │  ├─ doctrine/          # Doctrine Configuration
│  │  │  └─ migration/         # Database Migrations
│  │  │
│  │  └─ cache/                # Cache Implementation
│  │     └─ RedisCacheAdapter.php
│  │
│  ├─ support/                 # [New] Common Support Classes
│  │  ├─ helper/               # Helper Functions
│  │  │  └─ array_helper.php
│  │  ├─ trait/                # Reusable Traits
│  │  │  └─ HasTimestamps.php
│  │  └─ exception/            # Custom Exceptions
│  │     ├─ BusinessException.php
│  │     └─ ValidationException.php
│  │
│  └─ view/                    # [Webman Default] View Files
│     └─ index/
│
├─ config/                     # [Webman Default] Configuration Files
│  ├─ app.php
│  ├─ database.php
│  ├─ redis.php
│  ├─ container.php            # Dependency Injection Container Config
│  └─ plugin/                  # Plugin Configuration
│
├─ database/                   # Database Related
│  ├─ migrations/              # Migration Files
│  ├─ seeders/                 # Data Seeders
│  └─ factories/               # Model Factories
│
├─ public/                     # [Webman Default] Public Resources
│  ├─ index.php                # Entry Point
│  └─ static/                  # Static Resources
│
├─ runtime/                    # [Webman Default] Runtime Files
│  ├─ logs/                    # Logs
│  └─ cache/                   # Cache
│
├─ storage/                    # Storage Directory
│  ├─ uploads/                 # Uploaded Files
│  └─ temp/                    # Temporary Files
│
├─ tests/                      # Test Directory
│  ├─ Unit/                    # Unit Tests
│  │  ├─ Domain/               # Domain Layer Tests
│  │  └─ Service/              # Service Layer Tests
│  ├─ Feature/                 # Feature Tests
│  │  └─ Api/                  # API Tests
│  └─ Pest.php                 # Pest Configuration
│
├─ vendor/                     # Composer Dependencies
├─ .env                        # Environment Variables
├─ .env.example                # Environment Variables Example
├─ composer.json               # Composer Configuration
├─ phpstan.neon                # PHPStan Configuration
├─ pint.json                   # Pint Configuration
├─ rector.php                  # Rector Configuration
└─ README.md                   # Project Documentation
```

---

## Directory Description

### Webman Default Directories

These directories maintain Webman framework's default structure, **do not modify**:

#### `app/controller/`
- **Responsibility**: HTTP request entry, handles input validation and output formatting
- **Principle**: Thin controller, no business logic
- **Dependencies**: Only depends on `app/service/`

```php
<?php

declare(strict_types=1);

namespace app\controller\api\v1;

use app\service\order\CreateOrderService;
use support\Request;
use support\Response;

final class OrderController
{
    public function __construct(
        private readonly CreateOrderService $createOrderService
    ) {
    }

    public function create(Request $request): Response
    {
        // 1. Validate input
        $validated = $this->validate($request, [
            'items' => 'required|array',
            'shipping_address' => 'required|array',
        ]);

        // 2. Call service layer
        $order = $this->createOrderService->handle(
            userId: $request->user()->id,
            items: $validated['items'],
            shippingAddress: $validated['shipping_address']
        );

        // 3. Return response
        return json([
            'success' => true,
            'data' => $order->toArray(),
        ]);
    }
}
```

#### `app/model/`
- **Responsibility**: ORM models, used only for data mapping
- **Principle**: No business logic, only data access
- **Usage**: Used by `infrastructure/repository/`

```php
<?php

declare(strict_types=1);

namespace app\model\eloquent;

use Illuminate\Database\Eloquent\Model;

final class Order extends Model
{
    protected $table = 'orders';

    protected $fillable = [
        'user_id',
        'total_amount',
        'status',
        'shipping_address',
    ];

    protected $casts = [
        'shipping_address' => 'array',
        'total_amount' => 'decimal:2',
    ];
}
```

#### `app/middleware/`
- **Responsibility**: Request/response processing pipeline
- **Categories**: Authentication, authorization, CORS, rate limiting, logging, etc.

#### `app/process/`
- **Responsibility**: Custom processes (queues, scheduled tasks, monitoring, etc.)
- **Feature**: Webman's unique process management capability

---

### New Directories

#### `app/service/` - Application Layer

**Responsibilities**:
- Use Case Orchestration
- Transaction management
- Call domain layer and infrastructure layer
- No business rules (rules belong in domain layer)

**Naming Convention**:
- Filename: `{Verb}{Noun}Service.php`
- Examples: `CreateOrderService.php`, `CancelOrderService.php`

**Code Example**:

```php
<?php

declare(strict_types=1);

namespace app\service\order;

use app\contract\repository\OrderRepositoryInterface;
use app\contract\repository\UserRepositoryInterface;
use app\contract\gateway\PaymentGatewayInterface;
use app\domain\order\entity\Order;
use app\domain\order\vo\Money;
use app\domain\order\enum\OrderStatus;
use support\Db;

final class CreateOrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository,
        private readonly UserRepositoryInterface $userRepository,
        private readonly PaymentGatewayInterface $paymentGateway
    ) {
    }

    public function handle(int $userId, array $items, array $shippingAddress): Order
    {
        // Start transaction
        return Db::transaction(function () use ($userId, $items, $shippingAddress) {
            // 1. Get user (call repository)
            $user = $this->userRepository->findById($userId);

            // 2. Create order entity (call domain layer)
            $order = Order::create(
                userId: $user->id(),
                items: $items,
                shippingAddress: $shippingAddress
            );

            // 3. Apply business rules (domain layer responsibility)
            $order->calculateTotal();
            $order->validateInventory();

            // 4. Persist (call repository)
            $this->orderRepository->save($order);

            // 5. Call external service (payment gateway)
            $this->paymentGateway->createPaymentIntent($order);

            return $order;
        });
    }
}
```

#### `app/domain/` - Domain Layer

**Responsibilities**:
- Core business logic
- Business rule validation
- Domain events
- **No framework dependencies, no direct database access**

**Subdirectory Structure**:
- `entity/` - Entities (with unique identity)
- `enum/` - Enums (fixed option sets)
- `vo/` - Value Objects (with validation/math)
- `event/` - Domain Events
- `rule/` - Business Rules
- `exception/` - Domain Exceptions

> **enum/** - Fixed option sets like status, type, method
> **vo/** - Value objects needing validation, math, or multiple properties

**Code Example**:

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
    private array $domainEvents = [];

    private function __construct(
        private readonly int $id,
        private readonly int $userId,
        private array $items,
        private Money $totalAmount,
        private OrderStatus $status,
        private readonly \DateTimeImmutable $createdAt
    ) {
    }

    public static function create(int $userId, array $items, array $shippingAddress): self
    {
        // Business rule validation
        if (empty($items)) {
            throw new InvalidOrderException('Order must have at least one item');
        }

        $order = new self(
            id: 0, // Assigned by repository layer
            userId: $userId,
            items: $items,
            totalAmount: Money::zero(),
            status: OrderStatus::Pending,
            createdAt: new \DateTimeImmutable()
        );

        // Trigger domain event
        $order->recordEvent(new OrderCreated($order));

        return $order;
    }

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

    public function cancel(): void
    {
        // Business rule: Only pending and paid orders can be cancelled
        if (!$this->status->canBeCancelled()) {
            throw new InvalidOrderException('Order cannot be cancelled in current status');
        }

        $this->status = OrderStatus::Cancelled;
        $this->recordEvent(new OrderCancelled($this));
    }

    // Getters
    public function id(): int
    {
        return $this->id;
    }

    public function totalAmount(): Money
    {
        return $this->totalAmount;
    }

    public function status(): OrderStatus
    {
        return $this->status;
    }

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

**Enum Example (OrderStatus)**:

```php
<?php

declare(strict_types=1);

namespace app\domain\order\enum;

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

    public function canBeShipped(): bool
    {
        return $this === self::Paid;
    }
}
```

**Value Object Example (Money)**:

```php
<?php

declare(strict_types=1);

namespace app\domain\order\vo;

final class Money
{
    private function __construct(
        private readonly int $cents
    ) {
        if ($cents < 0) {
            throw new \InvalidArgumentException('Money cannot be negative');
        }
    }

    public static function fromCents(int $cents): self
    {
        return new self($cents);
    }

    public static function fromDollars(float $dollars): self
    {
        return new self((int) round($dollars * 100));
    }

    public static function zero(): self
    {
        return new self(0);
    }

    public function add(self $other): self
    {
        return new self($this->cents + $other->cents);
    }

    public function subtract(self $other): self
    {
        return new self($this->cents - $other->cents);
    }

    public function multiply(int $factor): self
    {
        return new self($this->cents * $factor);
    }

    public function toCents(): int
    {
        return $this->cents;
    }

    public function toDollars(): float
    {
        return $this->cents / 100;
    }

    public function equals(self $other): bool
    {
        return $this->cents === $other->cents;
    }
}
```

#### `app/contract/` - Interface Definitions

**Responsibilities**:
- Define repository interfaces
- Define external service gateway interfaces
- Define service contracts

**Naming Convention**:
- Interface name: `{Noun}Interface`
- Examples: `OrderRepositoryInterface`, `PaymentGatewayInterface`

**Code Example**:

```php
<?php

declare(strict_types=1);

namespace app\contract\repository;

use app\domain\order\entity\Order;

interface OrderRepositoryInterface
{
    public function findById(int $id): ?Order;

    public function findByUserId(int $userId): array;

    public function save(Order $order): void;

    public function delete(Order $order): void;

    public function nextIdentity(): int;
}
```

#### `app/infrastructure/` - Infrastructure Layer

**Responsibilities**:
- Implement repository interfaces
- Implement external service adapters
- Database access
- Cache, message queues, etc.

**Code Example**:

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\repository\eloquent;

use app\contract\repository\OrderRepositoryInterface;
use app\domain\order\entity\Order;
use app\domain\order\vo\Money;
use app\domain\order\enum\OrderStatus;
use app\model\eloquent\Order as OrderModel;

final class EloquentOrderRepository implements OrderRepositoryInterface
{
    public function findById(int $id): ?Order
    {
        $model = OrderModel::find($id);

        if ($model === null) {
            return null;
        }

        return $this->toDomain($model);
    }

    public function save(Order $order): void
    {
        $model = OrderModel::findOrNew($order->id());
        $model->user_id = $order->userId();
        $model->total_amount = $order->totalAmount()->toDollars();
        $model->status = $order->status()->value;
        $model->save();

        // Trigger domain events
        foreach ($order->releaseEvents() as $event) {
            event($event);
        }
    }

    private function toDomain(OrderModel $model): Order
    {
        // Reconstruct domain entity from database model
        return Order::reconstitute(
            id: $model->id,
            userId: $model->user_id,
            totalAmount: Money::fromDollars($model->total_amount),
            status: OrderStatus::from($model->status),
            createdAt: new \DateTimeImmutable($model->created_at)
        );
    }

    public function nextIdentity(): int
    {
        return OrderModel::max('id') + 1;
    }
}
```

#### `app/support/` - Common Support

**Responsibilities**:
- Helper functions
- Reusable Traits
- Custom exceptions
- **Don't use as a dumping ground**: Only put truly common code here

---

## Naming Rules

### Directory Naming

- **All lowercase**: `app/domain/order/entity/`
- **Use underscores for separation**: `domain_event/`
- **No camelCase**: `domainEvent/` vs `domain_event/`

### Namespaces

- **Follow directory structure**: `app\domain\order\entity`
- **All lowercase**: Keep consistent with directories
- **Class names in StudlyCase**: `Order.php`, `OrderStatus.php`

### File Naming

- **Class files**: `Order.php` (StudlyCase)
- **Interface files**: `OrderRepositoryInterface.php`
- **Config files**: `database.php` (snake_case)
- **Helper functions**: `array_helper.php` (snake_case)

---

## Scalability Considerations

### Plugin System

Webman supports a plugin system, modules can be migrated to `plugin/` directory in the future:

```
plugin/
└─ vendor/package/
   ├─ app/
   │  ├─ controller/
   │  ├─ service/
   │  └─ domain/
   └─ config/
```

### Microservices Split

When splitting into microservices, split by bounded context:

```
order-service/
├─ app/
│  ├─ domain/order/
│  ├─ service/order/
│  └─ infrastructure/

user-service/
├─ app/
│  ├─ domain/user/
│  ├─ service/user/
│  └─ infrastructure/
```

---

## Best Practices

### DO

1. **Keep Webman default directories unchanged**
2. **Directories in lowercase, class names in StudlyCase**
3. **Organize domain directory by bounded context**
4. **Interfaces in contract, implementations in infrastructure**
5. **Service layer only orchestrates, no business rules**

### DON'T

1. **Don't write business logic in controller**
2. **Don't depend on framework classes in domain**
3. **Don't write business rules in model**
4. **Don't use support as a dumping ground**
5. **Don't mix uppercase and lowercase directory names**

---

## Related Documentation

- [Dependency Direction Rules](./dependency-rules)
- [Naming Conventions](./naming-conventions)
- [Layer Responsibilities](./layer-responsibilities)
