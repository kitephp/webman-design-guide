---
title: "Dependency Direction Rules"
description: "Clear dependency direction is the foundation of architectural stability"
---

# Dependency Direction Rules

> Clear dependency direction is the foundation of architectural stability

---

## Table of Contents

- [Dependency Direction Diagram](#dependency-direction-diagram)
- [Allowed Dependencies](#allowed-dependencies)
- [Forbidden Dependencies](#forbidden-dependencies)
- [Enforcement Strategies](#enforcement-strategies)
- [Code Examples](#code-examples)

---

## Dependency Direction Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      Controller Layer                    │
│                   (HTTP Input/Output)                    │
└────────────────────────┬────────────────────────────────┘
                         │ depends on
                         ↓
┌─────────────────────────────────────────────────────────┐
│                      Service Layer                       │
│                  (Use Case Orchestration)                │
└────────┬────────────────────────────────────────────────┘
         │ depends on
         ↓
┌────────────────────────┐        ┌─────────────────────┐
│    Domain Layer        │←───────│  Contract Layer     │
│  (Business Logic)      │ impl   │  (Interfaces)       │
└────────────────────────┘        └──────────┬──────────┘
         ↑                                    ↑
         │ depends on                         │ implements
         │                                    │
┌────────────────────────────────────────────┴────────────┐
│                 Infrastructure Layer                     │
│          (Repository, Gateway, External Services)        │
└──────────────────────────────────────────────────────────┘
```

---

## Allowed Dependencies

### Controller → Service

**Allowed**: Controller can depend on Service layer

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
        $order = $this->createOrderService->handle(
            userId: $request->user()->id,
            items: $request->post('items'),
            shippingAddress: $request->post('shipping_address')
        );

        return json(['data' => $order]);
    }
}
```

### Service → Domain + Contract

**Allowed**: Service can depend on Domain entities and Contract interfaces

```php
<?php

declare(strict_types=1);

namespace app\service\order;

use app\contract\repository\OrderRepositoryInterface;
use app\contract\gateway\PaymentGatewayInterface;
use app\domain\order\entity\Order;
use support\Db;

final class CreateOrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository,
        private readonly PaymentGatewayInterface $paymentGateway
    ) {
    }

    public function handle(int $userId, array $items, array $shippingAddress): Order
    {
        return Db::transaction(function () use ($userId, $items, $shippingAddress) {
            $order = Order::create($userId, $items, $shippingAddress);
            $this->orderRepository->save($order);
            $this->paymentGateway->createPaymentIntent($order);
            return $order;
        });
    }
}
```

### Infrastructure → Contract + Domain

**Allowed**: Infrastructure implements Contract interfaces, can depend on Domain entities

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
        return $model ? $this->toDomain($model) : null;
    }

    public function save(Order $order): void
    {
        $model = OrderModel::findOrNew($order->id());
        $model->user_id = $order->userId();
        $model->total_amount = $order->totalAmount()->toDollars();
        $model->status = $order->status()->value;
        $model->save();
    }

    private function toDomain(OrderModel $model): Order
    {
        return Order::reconstitute(
            id: $model->id,
            userId: $model->user_id,
            totalAmount: Money::fromDollars($model->total_amount),
            status: OrderStatus::from($model->status),
            createdAt: new \DateTimeImmutable($model->created_at)
        );
    }
}
```

### Domain → Domain (Same Context)

**Allowed**: Domain objects within the same bounded context can depend on each other

```php
<?php

declare(strict_types=1);

namespace app\domain\order\entity;

use app\domain\order\vo\Money;
use app\domain\order\enum\OrderStatus;

final class Order
{
    private function __construct(
        private readonly int $id,
        private Money $totalAmount,
        private OrderStatus $status
    ) {
    }

    public function calculateTotal(array $items): void
    {
        $total = array_reduce(
            $items,
            fn (Money $carry, array $item) => $carry->add(
                Money::fromCents($item['price'] * $item['quantity'])
            ),
            Money::zero()
        );

        $this->totalAmount = $total;
    }
}
```

---

## Forbidden Dependencies

### Domain → Framework

**Forbidden**: Domain layer cannot depend on framework classes

```php
<?php

// Bad Example - Domain depends on framework
namespace app\domain\order\entity;

use support\Db;  // Cannot depend on Webman framework
use support\Redis;  // Cannot depend on framework

final class Order
{
    public function save(): void
    {
        // Domain should not directly access database
        Db::table('orders')->insert([...]);
    }
}
```

```php
<?php

// Good Example - Through Repository interface
namespace app\domain\order\entity;

final class Order
{
    // Domain only contains business logic, not responsible for persistence
    public function calculateTotal(): void
    {
        // Pure business logic
    }
}

// Persistence is done by Service layer calling Repository
namespace app\service\order;

use app\contract\repository\OrderRepositoryInterface;

final class CreateOrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository
    ) {
    }

    public function handle(): void
    {
        $order = Order::create(...);
        $this->orderRepository->save($order);  // Persist through interface
    }
}
```

### Domain → Model

**Forbidden**: Domain layer cannot depend on ORM Model

```php
<?php

// Bad Example
namespace app\domain\order\entity;

use app\model\eloquent\Order as OrderModel;  // Cannot depend on Model

final class Order
{
    public function toModel(): OrderModel
    {
        // Domain should not know about ORM existence
        return new OrderModel([...]);
    }
}
```

```php
<?php

// Good Example - Repository handles conversion
namespace app\infrastructure\repository\eloquent;

use app\domain\order\entity\Order;
use app\model\eloquent\Order as OrderModel;

final class EloquentOrderRepository
{
    public function save(Order $order): void
    {
        // Repository handles Domain to Model conversion
        $model = OrderModel::findOrNew($order->id());
        $model->user_id = $order->userId();
        $model->save();
    }
}
```

### Domain → Infrastructure

**Forbidden**: Domain layer cannot depend on Infrastructure implementations

```php
<?php

// Bad Example
namespace app\domain\order\entity;

use app\infrastructure\gateway\payment\StripePaymentGateway;

final class Order
{
    public function pay(): void
    {
        // Domain should not depend on concrete implementations
        $gateway = new StripePaymentGateway();
        $gateway->charge($this->totalAmount);
    }
}
```

```php
<?php

// Good Example - Through Service layer
namespace app\service\order;

use app\contract\gateway\PaymentGatewayInterface;
use app\domain\order\entity\Order;

final class PayOrderService
{
    public function __construct(
        private readonly PaymentGatewayInterface $paymentGateway
    ) {
    }

    public function handle(Order $order): void
    {
        // Service layer calls external services
        $this->paymentGateway->charge($order->totalAmount());
    }
}
```

### Controller → Model

**Forbidden**: Controller cannot directly access Model

```php
<?php

// Bad Example
namespace app\controller\api\v1;

use app\model\eloquent\Order;
use support\Request;

final class OrderController
{
    public function index(Request $request): array
    {
        // Controller should not directly query database
        return Order::where('user_id', $request->user()->id)->get();
    }
}
```

```php
<?php

// Good Example - Through Service layer
namespace app\controller\api\v1;

use app\service\order\GetUserOrdersService;
use support\Request;

final class OrderController
{
    public function __construct(
        private readonly GetUserOrdersService $getUserOrdersService
    ) {
    }

    public function index(Request $request): array
    {
        // Get data through Service layer
        return $this->getUserOrdersService->handle($request->user()->id);
    }
}
```

### Controller → Infrastructure

**Forbidden**: Controller cannot directly depend on Infrastructure

```php
<?php

// Bad Example
namespace app\controller\api\v1;

use app\infrastructure\repository\eloquent\EloquentOrderRepository;

final class OrderController
{
    public function __construct(
        private readonly EloquentOrderRepository $orderRepository
    ) {
    }
}
```

```php
<?php

// Good Example - Depend on Service
namespace app\controller\api\v1;

use app\service\order\CreateOrderService;

final class OrderController
{
    public function __construct(
        private readonly CreateOrderService $createOrderService
    ) {
    }
}
```

---

## Enforcement Strategies

### 1. PHPStan Rules

Create `phpstan.neon` configuration file:

```neon
parameters:
    level: 8
    paths:
        - app

    # Forbid Domain layer from depending on framework
    ignoreErrors:
        -
            message: '#app\\domain\\.*# cannot depend on #support\\.*#'
            path: app/domain
        -
            message: '#app\\domain\\.*# cannot depend on #app\\model\\.*#'
            path: app/domain
        -
            message: '#app\\domain\\.*# cannot depend on #app\\infrastructure\\.*#'
            path: app/domain

    # Forbid Controller from directly depending on Model
    ignoreErrors:
        -
            message: '#app\\controller\\.*# cannot depend on #app\\model\\.*#'
            path: app/controller
        -
            message: '#app\\controller\\.*# cannot depend on #app\\infrastructure\\.*#'
            path: app/controller
```

Run check:

```bash
composer require --dev phpstan/phpstan
vendor/bin/phpstan analyse
```

### 2. Rector Auto-refactoring

Create `rector.php` configuration:

```php
<?php

declare(strict_types=1);

use Rector\Config\RectorConfig;

return RectorConfig::configure()
    ->withPaths([
        __DIR__ . '/app',
    ])
    ->withRules([
        // Auto-detect and report code violating dependency rules
    ]);
```

### 3. Code Review Checklist

Check during Pull Request:

- [ ] Does Domain layer depend on framework classes?
- [ ] Does Domain layer depend on Model?
- [ ] Does Controller directly access Model?
- [ ] Does Controller contain business logic?
- [ ] Does Service layer correctly use interfaces?
- [ ] Does Infrastructure implement Contract interfaces?

### 4. Unit Test Verification

Domain layer should be testable independently without starting the framework:

```php
<?php

declare(strict_types=1);

namespace tests\Unit\Domain\Order;

use app\domain\order\entity\Order;
use app\domain\order\values\Money;

test('order calculates total correctly', function () {
    $order = Order::create(
        userId: 1,
        items: [
            ['price' => 1000, 'quantity' => 2],
            ['price' => 500, 'quantity' => 1],
        ],
        shippingAddress: []
    );

    $order->calculateTotal();

    expect($order->totalAmount())->toEqual(Money::fromCents(2500));
});
```

---

## Code Examples

### Complete Example: Order Creation Flow

#### 1. Controller Layer

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
        $validated = $this->validate($request, [
            'items' => 'required|array',
            'shipping_address' => 'required|array',
        ]);

        $order = $this->createOrderService->handle(
            userId: $request->user()->id,
            items: $validated['items'],
            shippingAddress: $validated['shipping_address']
        );

        return json(['data' => $order->toArray()]);
    }
}
```

#### 2. Service Layer

```php
<?php

declare(strict_types=1);

namespace app\service\order;

use app\contract\repository\OrderRepositoryInterface;
use app\contract\repository\UserRepositoryInterface;
use app\domain\order\entity\Order;
use support\Db;

final class CreateOrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository,
        private readonly UserRepositoryInterface $userRepository
    ) {
    }

    public function handle(int $userId, array $items, array $shippingAddress): Order
    {
        return Db::transaction(function () use ($userId, $items, $shippingAddress) {
            $user = $this->userRepository->findById($userId);

            $order = Order::create($userId, $items, $shippingAddress);
            $order->calculateTotal();
            $order->validateInventory();

            $this->orderRepository->save($order);

            return $order;
        });
    }
}
```

#### 3. Domain Layer

```php
<?php

declare(strict_types=1);

namespace app\domain\order\entity;

use app\domain\order\vo\Money;
use app\domain\order\enum\OrderStatus;
use app\domain\order\exception\InvalidOrderException;

final class Order
{
    private function __construct(
        private readonly int $id,
        private readonly int $userId,
        private array $items,
        private Money $totalAmount,
        private OrderStatus $status
    ) {
    }

    public static function create(int $userId, array $items, array $shippingAddress): self
    {
        if (empty($items)) {
            throw new InvalidOrderException('Order must have at least one item');
        }

        return new self(
            id: 0,
            userId: $userId,
            items: $items,
            totalAmount: Money::zero(),
            status: OrderStatus::Pending
        );
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

    public function validateInventory(): void
    {
        // Business rule validation
    }

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
}
```

#### 4. Contract Layer

```php
<?php

declare(strict_types=1);

namespace app\contract\repository;

use app\domain\order\entity\Order;

interface OrderRepositoryInterface
{
    public function findById(int $id): ?Order;

    public function save(Order $order): void;

    public function delete(Order $order): void;
}
```

#### 5. Infrastructure Layer

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
        return $model ? $this->toDomain($model) : null;
    }

    public function save(Order $order): void
    {
        $model = OrderModel::findOrNew($order->id());
        $model->user_id = $order->userId();
        $model->total_amount = $order->totalAmount()->toDollars();
        $model->status = $order->status()->value;
        $model->save();
    }

    public function delete(Order $order): void
    {
        OrderModel::destroy($order->id());
    }

    private function toDomain(OrderModel $model): Order
    {
        return Order::reconstitute(
            id: $model->id,
            userId: $model->user_id,
            totalAmount: Money::fromDollars($model->total_amount),
            status: OrderStatus::from($model->status),
            createdAt: new \DateTimeImmutable($model->created_at)
        );
    }
}
```

---

## Dependency Injection Configuration

Configure dependency injection in `config/container.php`:

```php
<?php

declare(strict_types=1);

use app\contract\repository\OrderRepositoryInterface;
use app\infrastructure\repository\eloquent\EloquentOrderRepository;

return [
    // Bind interface to implementation
    OrderRepositoryInterface::class => DI\autowire(EloquentOrderRepository::class),
];
```

---

## Best Practices

### DO

1. **Controller only depends on Service**
2. **Service depends on Contract interfaces, not concrete implementations**
3. **Domain stays pure, no framework dependencies**
4. **Infrastructure implements Contract interfaces**
5. **Use dependency injection container to manage dependencies**

### DON'T

1. **Don't use framework classes in Domain layer**
2. **Don't directly access Model in Controller**
3. **Don't depend on concrete Infrastructure implementations in Service layer**
4. **Don't make cross-layer calls (e.g., Controller to Infrastructure)**
5. **Don't create circular dependencies**

---

## Related Documentation

- [Directory Structure Specification](./directory-structure)
- [Naming Conventions](./naming-conventions)
- [Layer Responsibilities](./layer-responsibilities)
