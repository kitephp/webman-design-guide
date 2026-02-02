# 依赖方向规则 | Dependency Direction Rules

> 清晰的依赖方向是架构稳定性的基础
> Clear dependency direction is the foundation of architectural stability

---

## 📋 目录 | Table of Contents

- [依赖方向图](#依赖方向图)
- [允许的依赖](#允许的依赖)
- [禁止的依赖](#禁止的依赖)
- [执行策略](#执行策略)
- [代码示例](#代码示例)

---

## 依赖方向图

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

## 允许的依赖

### Controller → Service

**允许**：Controller 可以依赖 Service 层

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

**允许**：Service 可以依赖 Domain 实体和 Contract 接口

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

**允许**：Infrastructure 实现 Contract 接口，可以依赖 Domain 实体

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\repository\eloquent;

use app\contract\repository\OrderRepositoryInterface;
use app\domain\order\entity\Order;
use app\domain\order\value_object\Money;
use app\domain\order\value_object\OrderStatus;
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
        $model->status = $order->status()->value();
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

**允许**：同一限界上下文内的 Domain 对象可以相互依赖

```php
<?php

declare(strict_types=1);

namespace app\domain\order\entity;

use app\domain\order\value_object\Money;
use app\domain\order\value_object\OrderStatus;

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

## 禁止的依赖

### ❌ Domain → Framework

**禁止**：Domain 层不能依赖框架类

```php
<?php

// ❌ 错误示例 - Domain 依赖框架
namespace app\domain\order\entity;

use support\Db;  // ❌ 不能依赖 Webman 框架
use support\Redis;  // ❌ 不能依赖框架

final class Order
{
    public function save(): void
    {
        // ❌ Domain 不应该直接访问数据库
        Db::table('orders')->insert([...]);
    }
}
```

```php
<?php

// ✅ 正确示例 - 通过 Repository 接口
namespace app\domain\order\entity;

final class Order
{
    // Domain 只包含业务逻辑，不负责持久化
    public function calculateTotal(): void
    {
        // 纯业务逻辑
    }
}

// 持久化由 Service 层调用 Repository 完成
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
        $this->orderRepository->save($order);  // ✅ 通过接口持久化
    }
}
```

### ❌ Domain → Model

**禁止**：Domain 层不能依赖 ORM Model

```php
<?php

// ❌ 错误示例
namespace app\domain\order\entity;

use app\model\eloquent\Order as OrderModel;  // ❌ 不能依赖 Model

final class Order
{
    public function toModel(): OrderModel
    {
        // ❌ Domain 不应该知道 ORM 的存在
        return new OrderModel([...]);
    }
}
```

```php
<?php

// ✅ 正确示例 - 由 Repository 负责转换
namespace app\infrastructure\repository\eloquent;

use app\domain\order\entity\Order;
use app\model\eloquent\Order as OrderModel;

final class EloquentOrderRepository
{
    public function save(Order $order): void
    {
        // ✅ Repository 负责 Domain 到 Model 的转换
        $model = OrderModel::findOrNew($order->id());
        $model->user_id = $order->userId();
        $model->save();
    }
}
```

### ❌ Domain → Infrastructure

**禁止**：Domain 层不能依赖 Infrastructure 实现

```php
<?php

// ❌ 错误示例
namespace app\domain\order\entity;

use app\infrastructure\gateway\payment\StripePaymentGateway;  // ❌

final class Order
{
    public function pay(): void
    {
        // ❌ Domain 不应该依赖具体实现
        $gateway = new StripePaymentGateway();
        $gateway->charge($this->totalAmount);
    }
}
```

```php
<?php

// ✅ 正确示例 - 通过 Service 层调用
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
        // ✅ Service 层调用外部服务
        $this->paymentGateway->charge($order->totalAmount());
    }
}
```

### ❌ Controller → Model

**禁止**：Controller 不能直接访问 Model

```php
<?php

// ❌ 错误示例
namespace app\controller\api\v1;

use app\model\eloquent\Order;  // ❌
use support\Request;

final class OrderController
{
    public function index(Request $request): array
    {
        // ❌ Controller 不应该直接查询数据库
        return Order::where('user_id', $request->user()->id)->get();
    }
}
```

```php
<?php

// ✅ 正确示例 - 通过 Service 层
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
        // ✅ 通过 Service 层获取数据
        return $this->getUserOrdersService->handle($request->user()->id);
    }
}
```

### ❌ Controller → Infrastructure

**禁止**：Controller 不能直接依赖 Infrastructure

```php
<?php

// ❌ 错误示例
namespace app\controller\api\v1;

use app\infrastructure\repository\eloquent\EloquentOrderRepository;  // ❌

final class OrderController
{
    public function __construct(
        private readonly EloquentOrderRepository $orderRepository  // ❌
    ) {
    }
}
```

```php
<?php

// ✅ 正确示例 - 依赖 Service
namespace app\controller\api\v1;

use app\service\order\CreateOrderService;  // ✅

final class OrderController
{
    public function __construct(
        private readonly CreateOrderService $createOrderService  // ✅
    ) {
    }
}
```

---

## 执行策略

### 1. PHPStan 规则

创建 `phpstan.neon` 配置文件：

```neon
parameters:
    level: 8
    paths:
        - app

    # 禁止 Domain 层依赖框架
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

    # 禁止 Controller 直接依赖 Model
    ignoreErrors:
        -
            message: '#app\\controller\\.*# cannot depend on #app\\model\\.*#'
            path: app/controller
        -
            message: '#app\\controller\\.*# cannot depend on #app\\infrastructure\\.*#'
            path: app/controller
```

运行检查：

```bash
composer require --dev phpstan/phpstan
vendor/bin/phpstan analyse
```

### 2. Rector 自动重构

创建 `rector.php` 配置：

```php
<?php

declare(strict_types=1);

use Rector\Config\RectorConfig;

return RectorConfig::configure()
    ->withPaths([
        __DIR__ . '/app',
    ])
    ->withRules([
        // 自动检测并报告违反依赖规则的代码
    ]);
```

### 3. Code Review Checklist

在 Pull Request 时检查：

- [ ] Domain 层是否依赖了框架类？
- [ ] Domain 层是否依赖了 Model？
- [ ] Controller 是否直接访问 Model？
- [ ] Controller 是否包含业务逻辑？
- [ ] Service 层是否正确使用了接口？
- [ ] Infrastructure 是否实现了 Contract 接口？

### 4. 单元测试验证

Domain 层应该可以独立测试，不需要启动框架：

```php
<?php

declare(strict_types=1);

namespace tests\Unit\Domain\Order;

use app\domain\order\entity\Order;
use app\domain\order\value_object\Money;

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

## 代码示例

### 完整示例：订单创建流程

#### 1. Controller 层

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

#### 2. Service 层

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

#### 3. Domain 层

```php
<?php

declare(strict_types=1);

namespace app\domain\order\entity;

use app\domain\order\value_object\Money;
use app\domain\order\value_object\OrderStatus;
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
            status: OrderStatus::pending()
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
        // 业务规则验证
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

#### 4. Contract 层

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

#### 5. Infrastructure 层

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\repository\eloquent;

use app\contract\repository\OrderRepositoryInterface;
use app\domain\order\entity\Order;
use app\domain\order\value_object\Money;
use app\domain\order\value_object\OrderStatus;
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
        $model->status = $order->status()->value();
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

## 依赖注入配置

在 `config/container.php` 中配置依赖注入：

```php
<?php

declare(strict_types=1);

use app\contract\repository\OrderRepositoryInterface;
use app\infrastructure\repository\eloquent\EloquentOrderRepository;

return [
    // 绑定接口到实现
    OrderRepositoryInterface::class => DI\autowire(EloquentOrderRepository::class),
];
```

---

## 最佳实践

### ✅ DO

1. **Controller 只依赖 Service**
2. **Service 依赖 Contract 接口，不依赖具体实现**
3. **Domain 保持纯净，不依赖框架**
4. **Infrastructure 实现 Contract 接口**
5. **使用依赖注入容器管理依赖**

### ❌ DON'T

1. **不要在 Domain 层使用框架类**
2. **不要在 Controller 直接访问 Model**
3. **不要在 Service 层依赖具体的 Infrastructure 实现**
4. **不要跨层级调用（如 Controller → Infrastructure）**
5. **不要循环依赖**

---

## 相关文档

- [目录结构规范](./directory-structure.md)
- [命名规范](./naming-conventions.md)
- [分层职责](./layer-responsibilities.md)

---

**最后更新**: 2026-02-02
