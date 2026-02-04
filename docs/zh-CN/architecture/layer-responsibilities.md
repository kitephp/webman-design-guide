---
title: "分层职责"
description: "清晰的分层职责是架构可维护性的关键"
---

# 分层职责

> 清晰的分层职责是架构可维护性的关键

---

## 目录

- [架构分层概览](#架构分层概览)
- [Controller 层](#controller-层)
- [Service 层](#service-层)
- [Domain 层](#domain-层)
- [Infrastructure 层](#infrastructure-层)
- [Contract 层](#contract-层)
- [Support 层](#support-层)

---

## 架构分层概览

```
┌─────────────────────────────────────────────────────────┐
│                    Controller Layer                      │
│              薄控制器 - 输入验证和输出格式化                │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                     Service Layer                        │
│              用例编排 - 事务管理 - 流程控制                │
└────────┬────────────────────────────────────────────────┘
         │
┌────────▼───────────────┐        ┌─────────────────────┐
│    Domain Layer        │        │  Contract Layer     │
│   业务逻辑 - 纯 PHP      │◄───────│  接口定义            │
└────────────────────────┘        └──────────┬──────────┘
         ▲                                    ▲
         │                                    │
┌────────┴────────────────────────────────────┴──────────┐
│              Infrastructure Layer                       │
│         外部依赖 - 数据库 - 第三方服务 - 缓存             │
└─────────────────────────────────────────────────────────┘
```

---

## Controller 层

### 职责

**唯一职责**：HTTP 请求入口和响应出口

- 接收 HTTP 请求
- 验证输入参数
- 调用 Service 层
- 格式化响应输出
- **不包含业务逻辑**

### 特点

- **薄控制器** (Thin Controller)
- **只做输入输出** (Input/Output Only)
- **不直接访问数据库**
- **不包含业务规则**

### 代码示例

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
        // 1. 验证输入
        $validated = $this->validate($request, [
            'items' => 'required|array|min:1',
            'shipping_address' => 'required|array',
        ]);

        // 2. 调用服务层
        $order = $this->createOrderService->handle(
            userId: $request->user()->id,
            items: $validated['items'],
            shippingAddress: $validated['shipping_address']
        );

        // 3. 格式化响应
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

- 验证输入参数
- 调用 Service 层方法
- 格式化 JSON/HTML 响应
- 处理 HTTP 状态码
- 异常转换为 HTTP 响应

### DON'T

- 不要包含业务逻辑
- 不要直接访问 Model
- 不要直接访问数据库
- 不要调用外部 API
- 不要包含复杂计算

---

## Service 层

### 职责

**核心职责**：用例编排和事务管理

- 编排业务流程
- 管理事务边界
- 调用 Domain 层
- 调用 Infrastructure 层
- **不包含业务规则**（规则在 Domain 层）

### 特点

- **用例驱动** (Use Case Driven)
- **事务管理** (Transaction Management)
- **流程编排** (Orchestration)
- **依赖接口** (Depend on Interfaces)

### 代码示例

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
        // 事务管理
        return Db::transaction(function () use ($userId, $items, $shippingAddress) {
            // 1. 获取用户（调用仓储）
            $user = $this->userRepository->findById($userId);
            if ($user === null) {
                throw new InvalidOrderException('User not found');
            }

            // 2. 验证库存（调用仓储）
            foreach ($items as $item) {
                $product = $this->productRepository->findById($item['product_id']);
                if ($product === null || $product->stock() < $item['quantity']) {
                    throw new InvalidOrderException('Insufficient inventory');
                }
            }

            // 3. 创建订单实体（调用领域层）
            $order = Order::create($userId, $items, $shippingAddress);
            $order->calculateTotal();

            // 4. 扣减库存（调用仓储）
            foreach ($items as $item) {
                $product = $this->productRepository->findById($item['product_id']);
                $product->decreaseStock($item['quantity']);
                $this->productRepository->save($product);
            }

            // 5. 持久化订单（调用仓储）
            $this->orderRepository->save($order);

            // 6. 创建支付（调用外部服务）
            $this->paymentGateway->createPaymentIntent($order);

            // 7. 发送通知（调用外部服务）
            $this->notificationGateway->sendOrderConfirmation($user, $order);

            return $order;
        });
    }
}
```

### 事务管理示例

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

            // 业务规则验证（Domain 层负责）
            $order->cancel();

            // 持久化
            $this->orderRepository->save($order);

            // 触发领域事件
            foreach ($order->releaseEvents() as $event) {
                event($event);
            }
        });
    }
}
```

### DO

- 管理事务边界
- 编排多个 Domain 对象
- 调用多个 Repository
- 调用外部服务
- 触发领域事件

### DON'T

- 不要包含业务规则（放 Domain 层）
- 不要直接访问数据库（通过 Repository）
- 不要依赖具体实现（依赖接口）
- 不要包含复杂计算（放 Domain 层）

---

## Domain 层

### 职责

**核心职责**：业务逻辑和业务规则

- 实现业务规则
- 领域模型
- 业务计算
- 状态转换
- **纯 PHP，不依赖框架**

### 特点

- **纯业务逻辑** (Pure Business Logic)
- **框架无关** (Framework Agnostic)
- **可独立测试** (Independently Testable)
- **不访问数据库** (No Database Access)

### Entity 示例

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
        // 业务规则：订单必须至少有一个商品
        if (empty($items)) {
            throw new InvalidOrderException('Order must have at least one item');
        }

        // 业务规则：每个商品数量必须大于 0
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
        // 业务计算：计算订单总金额
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
        // 业务规则：只有待支付和已支付的订单可以取消
        if (!$this->status->canBeCancelled()) {
            throw new InvalidOrderException(
                "Order cannot be cancelled in status: {$this->status->value}"
            );
        }

        // 状态转换
        $this->status = OrderStatus::Cancelled;

        $this->recordEvent(new OrderCancelled($this));
    }

    public function ship(): void
    {
        // 业务规则：只有已支付的订单可以发货
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

### Enum 示例（OrderStatus）

> **enum/** - 固定选项集合，如状态、类型、方法
> **vo/** - 需要验证、运算或多属性的值对象

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

### Value Object 示例（Money）

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

- 实现业务规则
- 业务计算和验证
- 状态转换逻辑
- 触发领域事件
- 使用枚举和值对象

### DON'T

- 不要依赖框架类
- 不要访问数据库
- 不要调用外部 API
- 不要依赖 Infrastructure
- 不要使用静态方法访问全局状态

---

## Infrastructure 层

### 职责

**核心职责**：外部依赖的具体实现

- 实现 Repository 接口
- 实现 Gateway 接口
- 数据库访问
- 缓存操作
- 第三方服务集成

### 特点

- **实现接口** (Implement Interfaces)
- **依赖外部系统** (Depend on External Systems)
- **数据转换** (Data Transformation)
- **技术细节** (Technical Details)

### Repository 实现示例

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

        // 触发领域事件
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
        // 从数据库模型重建领域实体
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

### Gateway 实现示例

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
        // 调用 Stripe API
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

- 实现 Contract 接口
- 访问数据库
- 调用第三方 API
- 数据格式转换
- 缓存操作

### DON'T

- 不要包含业务逻辑
- 不要直接被 Controller 调用
- 不要暴露技术细节给 Domain

---

## Contract 层

### 职责

**核心职责**：定义接口契约

- 定义 Repository 接口
- 定义 Gateway 接口
- 定义 Service 接口
- **只有接口，没有实现**

### 特点

- **纯接口** (Pure Interfaces)
- **定义契约** (Define Contracts)
- **依赖倒置** (Dependency Inversion)

### Repository 接口示例

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

### Gateway 接口示例

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

- 定义清晰的接口方法
- 使用类型提示
- 返回 Domain 对象
- 文档注释

### DON'T

- 不要包含实现代码
- 不要依赖具体类
- 不要暴露技术细节

---

## Support 层

### 职责

**核心职责**：通用工具和辅助功能

- 辅助函数
- 可复用 Trait
- 自定义异常
- 通用工具类

### 特点

- **真正通用** (Truly Generic)
- **无业务逻辑** (No Business Logic)
- **可复用** (Reusable)

### 辅助函数示例

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

### Trait 示例

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

### 自定义异常示例

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

- 真正通用的工具
- 无业务逻辑的辅助函数
- 可复用的 Trait
- 基础异常类

### DON'T

- 不要当垃圾桶
- 不要包含业务逻辑
- 不要依赖特定模块

---

## 分层交互示例

### 完整流程：创建订单

```php
// 1. Controller 层 - 接收请求
namespace app\controller\api\v1;

final class OrderController
{
    public function create(Request $request): Response
    {
        $order = $this->createOrderService->handle(...);
        return json(['data' => $order]);
    }
}

// 2. Service 层 - 编排流程
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

// 3. Domain 层 - 业务逻辑
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

// 4. Contract 层 - 接口定义
namespace app\contract\repository;

interface OrderRepositoryInterface
{
    public function save(Order $order): void;
}

// 5. Infrastructure 层 - 持久化
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

## 最佳实践总结

### Controller 层
- 保持薄控制器
- 只做输入输出
- 不包含业务逻辑

### Service 层
- 管理事务边界
- 编排业务流程
- 依赖接口而非实现

### Domain 层
- 纯业务逻辑
- 框架无关
- 可独立测试
- 使用 Enum 表示固定状态，Value Object 表示复杂值

### Infrastructure 层
- 实现接口
- 处理技术细节
- 数据转换

### Contract 层
- 定义清晰接口
- 依赖倒置原则

### Support 层
- 真正通用的工具
- 不包含业务逻辑

---

## 相关文档

- [目录结构规范](./directory-structure)
- [依赖方向规则](./dependency-rules)
- [命名规范](./naming-conventions)
