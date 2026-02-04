---
title: "Layer Responsibilities"
description: "Clear layer responsibilities are key to architectural maintainability"
---

# Layer Responsibilities

> Clear layer responsibilities are key to architectural maintainability

---

## Table of Contents

- [Architecture Layer Overview](#architecture-layer-overview)
- [Controller Layer](#controller-layer)
- [Service Layer](#service-layer)
- [Domain Layer](#domain-layer)
- [Infrastructure Layer](#infrastructure-layer)
- [Contract Layer](#contract-layer)
- [Support Layer](#support-layer)

---

## Architecture Layer Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Controller Layer                      │
│              Thin Controller - Input/Output Only         │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                     Service Layer                        │
│          Use Case Orchestration - Transactions           │
└────────┬────────────────────────────────────────────────┘
         │
┌────────▼───────────────┐        ┌─────────────────────┐
│    Domain Layer        │        │  Contract Layer     │
│   Business Logic       │◄───────│  Interface Defs     │
│   Pure PHP             │        │                     │
└────────────────────────┘        └──────────┬──────────┘
         ▲                                    ▲
         │                                    │
┌────────┴────────────────────────────────────┴──────────┐
│              Infrastructure Layer                       │
│    External Dependencies - DB - Services - Cache        │
└─────────────────────────────────────────────────────────┘
```

---

## Controller Layer

### Responsibilities

**Single Responsibility**: HTTP request entry and response exit

- Receive HTTP requests
- Validate input parameters
- Call Service layer
- Format response output
- **No business logic**

### Characteristics

- **Thin Controller**
- **Input/Output Only**
- **No direct database access**
- **No business rules**

### Code Example

```php
<?php

declare(strict_types=1);

namespace app\controller\api\v1;

use app\service\order\CreateOrderService;
use app\service\order\CancelOrderService;
use app\service\order\GetOrderService;
use support\Request;
use support\Response;

final class OrderController
{
    public function __construct(
        private readonly CreateOrderService $createOrderService,
        private readonly CancelOrderService $cancelOrderService,
        private readonly GetOrderService $getOrderService
    ) {
    }

    public function create(Request $request): Response
    {
        // 1. Validate input
        $validated = $this->validate($request, [
            'items' => 'required|array|min:1',
            'shipping_address' => 'required|array',
        ]);

        // 2. Call service layer
        $order = $this->createOrderService->handle(
            userId: $request->user()->id,
            items: $validated['items'],
            shippingAddress: $validated['shipping_address']
        );

        // 3. Format response
        return json([
            'success' => true,
            'data' => [
                'id' => $order->id(),
                'total' => $order->totalAmount()->toDollars(),
                'status' => $order->status()->value,
            ],
        ], 201);
    }

    public function show(Request $request, int $id): Response
    {
        $order = $this->getOrderService->handle($id);

        return json([
            'success' => true,
            'data' => $order->toArray(),
        ]);
    }

    public function cancel(Request $request, int $id): Response
    {
        $this->cancelOrderService->handle($id, $request->user()->id);

        return json([
            'success' => true,
            'message' => 'Order cancelled successfully',
        ]);
    }
}
```

### DO

- Validate input parameters
- Call Service layer methods
- Format JSON/HTML responses
- Handle HTTP status codes
- Convert exceptions to HTTP responses

### DON'T

- Don't include business logic
- Don't directly access Model
- Don't directly access database
- Don't call external APIs
- Don't include complex calculations

---

## Service Layer

### Responsibilities

**Core Responsibility**: Use case orchestration and transaction management

- Orchestrate business flows
- Manage transaction boundaries
- Call Domain layer
- Call Infrastructure layer
- **No business rules** (rules belong in Domain layer)

### Characteristics

- **Use Case Driven**
- **Transaction Management**
- **Orchestration**
- **Depend on Interfaces**

### Code Example

```php
<?php

declare(strict_types=1);

namespace app\service\order;

use app\contract\repository\OrderRepositoryInterface;
use app\contract\repository\UserRepositoryInterface;
use app\contract\repository\ProductRepositoryInterface;
use app\contract\gateway\PaymentGatewayInterface;
use app\contract\gateway\NotificationGatewayInterface;
use app\domain\order\entity\Order;
use app\domain\order\exception\InvalidOrderException;
use support\Db;

final class CreateOrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository,
        private readonly UserRepositoryInterface $userRepository,
        private readonly ProductRepositoryInterface $productRepository,
        private readonly PaymentGatewayInterface $paymentGateway,
        private readonly NotificationGatewayInterface $notificationGateway
    ) {
    }

    public function handle(int $userId, array $items, array $shippingAddress): Order
    {
        // Transaction management
        return Db::transaction(function () use ($userId, $items, $shippingAddress) {
            // 1. Get user (call repository)
            $user = $this->userRepository->findById($userId);
            if ($user === null) {
                throw new InvalidOrderException('User not found');
            }

            // 2. Validate inventory (call repository)
            foreach ($items as $item) {
                $product = $this->productRepository->findById($item['product_id']);
                if ($product === null || $product->stock() < $item['quantity']) {
                    throw new InvalidOrderException('Insufficient inventory');
                }
            }

            // 3. Create order entity (call domain layer)
            $order = Order::create($userId, $items, $shippingAddress);
            $order->calculateTotal();

            // 4. Decrease inventory (call repository)
            foreach ($items as $item) {
                $product = $this->productRepository->findById($item['product_id']);
                $product->decreaseStock($item['quantity']);
                $this->productRepository->save($product);
            }

            // 5. Persist order (call repository)
            $this->orderRepository->save($order);

            // 6. Create payment (call external service)
            $this->paymentGateway->createPaymentIntent($order);

            // 7. Send notification (call external service)
            $this->notificationGateway->sendOrderConfirmation($user, $order);

            return $order;
        });
    }
}
```

### Transaction Management Example

```php
<?php

declare(strict_types=1);

namespace app\service\order;

use app\contract\repository\OrderRepositoryInterface;
use app\domain\order\entity\Order;
use support\Db;

final class CancelOrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository
    ) {
    }

    public function handle(int $orderId, int $userId): void
    {
        Db::transaction(function () use ($orderId, $userId) {
            $order = $this->orderRepository->findById($orderId);

            // Business rule validation (Domain layer responsibility)
            $order->cancel();

            // Persist
            $this->orderRepository->save($order);

            // Trigger domain events
            foreach ($order->releaseEvents() as $event) {
                event($event);
            }
        });
    }
}
```

### DO

- Manage transaction boundaries
- Orchestrate multiple Domain objects
- Call multiple Repositories
- Call external services
- Trigger domain events

### DON'T

- Don't include business rules (put in Domain layer)
- Don't directly access database (through Repository)
- Don't depend on concrete implementations (depend on interfaces)
- Don't include complex calculations (put in Domain layer)

---

## Domain Layer

### Responsibilities

**Core Responsibility**: Business logic and business rules

- Implement business rules
- Domain models
- Business calculations
- State transitions
- **Pure PHP, no framework dependencies**

### Characteristics

- **Pure Business Logic**
- **Framework Agnostic**
- **Independently Testable**
- **No Database Access**

### Entity Example

```php
<?php

declare(strict_types=1);

namespace app\domain\order\entity;

use app\domain\order\vo\Money;
use app\domain\order\enum\OrderStatus;
use app\domain\order\event\OrderCreated;
use app\domain\order\event\OrderCancelled;
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
        // Business rule: Order must have at least one item
        if (empty($items)) {
            throw new InvalidOrderException('Order must have at least one item');
        }

        // Business rule: Each item quantity must be greater than 0
        foreach ($items as $item) {
            if ($item['quantity'] <= 0) {
                throw new InvalidOrderException('Item quantity must be greater than 0');
            }
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

    public function calculateTotal(): void
    {
        // Business calculation: Calculate order total amount
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
            throw new InvalidOrderException(
                "Order cannot be cancelled in status: {$this->status->value}"
            );
        }

        // State transition
        $this->status = OrderStatus::Cancelled;

        $this->recordEvent(new OrderCancelled($this));
    }

    public function ship(): void
    {
        // Business rule: Only paid orders can be shipped
        if ($this->status !== OrderStatus::Paid) {
            throw new InvalidOrderException('Only paid orders can be shipped');
        }

        $this->status = OrderStatus::Shipped;
    }

    // Getters
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

### Enum Example (OrderStatus)

> **enum/** - Fixed option sets like status, type, method
> **vo/** - Value objects needing validation, math, or multiple properties

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

### Value Object Example (Money)

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

    public function greaterThan(self $other): bool
    {
        return $this->cents > $other->cents;
    }
}
```

### DO

- Implement business rules
- Business calculations and validation
- State transition logic
- Trigger domain events
- Use enums and value objects

### DON'T

- Don't depend on framework classes
- Don't access database
- Don't call external APIs
- Don't depend on Infrastructure
- Don't use static methods to access global state

---

## Infrastructure Layer

### Responsibilities

**Core Responsibility**: Concrete implementations of external dependencies

- Implement Repository interfaces
- Implement Gateway interfaces
- Database access
- Cache operations
- Third-party service integration

### Characteristics

- **Implement Interfaces**
- **Depend on External Systems**
- **Data Transformation**
- **Technical Details**

### Repository Implementation Example

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

    public function findByUserId(int $userId): array
    {
        $models = OrderModel::where('user_id', $userId)->get();

        return $models->map(fn ($model) => $this->toDomain($model))->all();
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

    public function delete(Order $order): void
    {
        OrderModel::destroy($order->id());
    }

    private function toDomain(OrderModel $model): Order
    {
        // Reconstruct domain entity from database model
        return Order::reconstitute(
            id: $model->id,
            userId: $model->user_id,
            items: json_decode($model->items, true),
            totalAmount: Money::fromDollars($model->total_amount),
            status: OrderStatus::from($model->status),
            createdAt: new \DateTimeImmutable($model->created_at)
        );
    }
}
```

### Gateway Implementation Example

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\payment;

use app\contract\gateway\PaymentGatewayInterface;
use app\domain\order\entity\Order;

final class StripePaymentGateway implements PaymentGatewayInterface
{
    public function __construct(
        private readonly string $apiKey
    ) {
    }

    public function createPaymentIntent(Order $order): string
    {
        // Call Stripe API
        $stripe = new \Stripe\StripeClient($this->apiKey);

        $paymentIntent = $stripe->paymentIntents->create([
            'amount' => $order->totalAmount()->toCents(),
            'currency' => 'usd',
            'metadata' => [
                'order_id' => $order->id(),
            ],
        ]);

        return $paymentIntent->id;
    }

    public function charge(Order $order, string $paymentMethodId): bool
    {
        $stripe = new \Stripe\StripeClient($this->apiKey);

        try {
            $stripe->paymentIntents->confirm($paymentMethodId);
            return true;
        } catch (\Stripe\Exception\CardException $e) {
            return false;
        }
    }
}
```

### DO

- Implement Contract interfaces
- Access database
- Call third-party APIs
- Data format conversion
- Cache operations

### DON'T

- Don't include business logic
- Don't be called directly by Controller
- Don't expose technical details to Domain

---

## Contract Layer

### Responsibilities

**Core Responsibility**: Define interface contracts

- Define Repository interfaces
- Define Gateway interfaces
- Define Service interfaces
- **Only interfaces, no implementations**

### Characteristics

- **Pure Interfaces**
- **Define Contracts**
- **Dependency Inversion**

### Repository Interface Example

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

### Gateway Interface Example

```php
<?php

declare(strict_types=1);

namespace app\contract\gateway;

use app\domain\order\entity\Order;

interface PaymentGatewayInterface
{
    public function createPaymentIntent(Order $order): string;

    public function charge(Order $order, string $paymentMethodId): bool;

    public function refund(Order $order): bool;
}
```

### DO

- Define clear interface methods
- Use type hints
- Return Domain objects
- Documentation comments

### DON'T

- Don't include implementation code
- Don't depend on concrete classes
- Don't expose technical details

---

## Support Layer

### Responsibilities

**Core Responsibility**: Common utilities and helper functions

- Helper functions
- Reusable Traits
- Custom exceptions
- Common utility classes

### Characteristics

- **Truly Generic**
- **No Business Logic**
- **Reusable**

### Helper Function Example

```php
<?php

declare(strict_types=1);

namespace app\support\helper;

function array_get(array $array, string $key, mixed $default = null): mixed
{
    return $array[$key] ?? $default;
}

function money_format(int $cents): string
{
    return '$' . number_format($cents / 100, 2);
}
```

### Trait Example

```php
<?php

declare(strict_types=1);

namespace app\support\trait;

trait HasTimestamps
{
    private \DateTimeImmutable $createdAt;
    private \DateTimeImmutable $updatedAt;

    public function createdAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function updatedAt(): \DateTimeImmutable
    {
        return $this->updatedAt;
    }

    protected function initializeTimestamps(): void
    {
        $now = new \DateTimeImmutable();
        $this->createdAt = $now;
        $this->updatedAt = $now;
    }

    protected function touch(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }
}
```

### Custom Exception Example

```php
<?php

declare(strict_types=1);

namespace app\support\exception;

class BusinessException extends \Exception
{
    public function __construct(
        string $message,
        private readonly array $context = []
    ) {
        parent::__construct($message);
    }

    public function context(): array
    {
        return $this->context;
    }
}
```

### DO

- Truly generic utilities
- Helper functions without business logic
- Reusable Traits
- Base exception classes

### DON'T

- Don't use as a dumping ground
- Don't include business logic
- Don't depend on specific modules

---

## Layer Interaction Example

### Complete Flow: Create Order

```php
// 1. Controller Layer - Receive request
namespace app\controller\api\v1;

final class OrderController
{
    public function create(Request $request): Response
    {
        $order = $this->createOrderService->handle(...);
        return json(['data' => $order]);
    }
}

// 2. Service Layer - Orchestrate flow
namespace app\service\order;

final class CreateOrderService
{
    public function handle(int $userId, array $items, array $shippingAddress): Order
    {
        return Db::transaction(function () use ($userId, $items, $shippingAddress) {
            $order = Order::create($userId, $items, $shippingAddress);
            $order->calculateTotal();
            $this->orderRepository->save($order);
            return $order;
        });
    }
}

// 3. Domain Layer - Business logic
namespace app\domain\order\entity;

final class Order
{
    public static function create(int $userId, array $items, array $shippingAddress): self
    {
        if (empty($items)) {
            throw new InvalidOrderException('Order must have at least one item');
        }
        return new self(...);
    }

    public function calculateTotal(): void
    {
        $this->totalAmount = array_reduce(...);
    }
}

// 4. Contract Layer - Interface definition
namespace app\contract\repository;

interface OrderRepositoryInterface
{
    public function save(Order $order): void;
}

// 5. Infrastructure Layer - Persistence
namespace app\infrastructure\repository\eloquent;

final class EloquentOrderRepository implements OrderRepositoryInterface
{
    public function save(Order $order): void
    {
        $model = OrderModel::findOrNew($order->id());
        $model->user_id = $order->userId();
        $model->save();
    }
}
```

---

## Best Practices Summary

### Controller Layer
- Keep thin controllers
- Input/output only
- No business logic

### Service Layer
- Manage transaction boundaries
- Orchestrate business flows
- Depend on interfaces, not implementations

### Domain Layer
- Pure business logic
- Framework agnostic
- Independently testable
- Use Enum for fixed states, Value Object for complex values

### Infrastructure Layer
- Implement interfaces
- Handle technical details
- Data transformation

### Contract Layer
- Define clear interfaces
- Dependency inversion principle

### Support Layer
- Truly generic utilities
- No business logic

---

## Related Documentation

- [Directory Structure Specification](./directory-structure)
- [Dependency Direction Rules](./dependency-rules)
- [Naming Conventions](./naming-conventions)
