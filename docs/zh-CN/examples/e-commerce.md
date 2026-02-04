---
title: "电商系统示例"
description: "完整的电商系统架构示例，展示订单、商品、支付、库存管理"
---

## 目录

- [系统概述](#系统概述)
- [完整目录树](#完整目录树)
- [模块划分](#模块划分)
- [目录职责](#目录职责)
- [关键代码示例](#关键代码示例)

---

## 系统概述

### 核心功能

- 商品管理
- 购物车
- 订单处理
- 支付集成
- 库存管理
- 用户管理

### 技术特点

- DDD 分层架构
- 领域事件驱动
- 外部支付网关集成
- 库存扣减事务处理
- 订单状态机

---

## 完整目录树

```
app/
├── controller/
│   ├── api/
│   │   └── v1/
│   │       ├── ProductController.php          # 商品接口
│   │       ├── CartController.php             # 购物车接口
│   │       ├── OrderController.php            # 订单接口
│   │       └── PaymentController.php          # 支付接口
│   └── web/
│       ├── ProductController.php              # 商品页面
│       └── CheckoutController.php             # 结账页面
│
├── model/
│   └── eloquent/
│       ├── Product.php                        # 商品模型
│       ├── Order.php                          # 订单模型
│       ├── OrderItem.php                      # 订单项模型
│       ├── Cart.php                           # 购物车模型
│       ├── Inventory.php                      # 库存模型
│       └── Payment.php                        # 支付记录模型
│
├── service/
│   ├── product/
│   │   ├── CreateProductService.php           # 创建商品
│   │   ├── UpdateProductService.php           # 更新商品
│   │   └── SearchProductService.php           # 搜索商品
│   ├── cart/
│   │   ├── AddToCartService.php               # 添加到购物车
│   │   └── CheckoutCartService.php            # 购物车结账
│   ├── order/
│   │   ├── CreateOrderService.php             # 创建订单
│   │   ├── CancelOrderService.php             # 取消订单
│   │   ├── RefundOrderService.php             # 退款订单
│   │   └── CompleteOrderService.php           # 完成订单
│   └── payment/
│       ├── ProcessPaymentService.php          # 处理支付
│       └── HandlePaymentCallbackService.php   # 支付回调
│
├── domain/
│   ├── product/
│   │   ├── entity/
│   │   │   ├── Product.php                    # 商品实体
│   │   │   └── ProductCategory.php            # 商品分类
│   │   ├── vo/                                # 值对象
│   │   │   ├── ProductSku.php                 # SKU
│   │   │   ├── Price.php                      # 价格
│   │   │   └── Stock.php                      # 库存数量
│   │   └── event/
│   │       ├── ProductCreated.php
│   │       └── ProductOutOfStock.php
│   │
│   ├── order/
│   │   ├── entity/
│   │   │   ├── Order.php                      # 订单实体
│   │   │   └── OrderItem.php                  # 订单项
│   │   ├── enum/                              # 枚举
│   │   │   └── OrderStatus.php                # 订单状态
│   │   ├── vo/                                # 值对象
│   │   │   ├── ShippingAddress.php            # 收货地址
│   │   │   └── OrderNumber.php                # 订单号
│   │   ├── event/
│   │   │   ├── OrderCreated.php
│   │   │   ├── OrderPaid.php
│   │   │   ├── OrderShipped.php
│   │   │   ├── OrderCancelled.php
│   │   │   └── OrderCompleted.php
│   │   └── rule/
│   │       ├── OrderCancellationRule.php      # 取消规则
│   │       └── RefundRule.php                 # 退款规则
│   │
│   ├── payment/
│   │   ├── entity/
│   │   │   └── Payment.php                    # 支付实体
│   │   ├── enum/                              # 枚举
│   │   │   ├── PaymentMethod.php              # 支付方式
│   │   │   └── PaymentStatus.php              # 支付状态
│   │   ├── vo/                                # 值对象
│   │   │   └── TransactionId.php              # 交易ID
│   │   └── event/
│   │       ├── PaymentInitiated.php
│   │       ├── PaymentSucceeded.php
│   │       └── PaymentFailed.php
│   │
│   ├── inventory/
│   │   ├── entity/
│   │   │   └── Inventory.php                  # 库存实体
│   │   ├── vo/                                # 值对象
│   │   │   └── StockLevel.php                 # 库存水平
│   │   ├── event/
│   │   │   ├── StockReserved.php              # 库存预留
│   │   │   ├── StockReleased.php              # 库存释放
│   │   │   └── StockDeducted.php              # 库存扣减
│   │   └── rule/
│   │       └── StockReservationRule.php       # 库存预留规则
│   │
│   └── shared/
│       └── vo/                                # 值对象
│           ├── Money.php                      # 金额
│           ├── Email.php                      # 邮箱
│           └── PhoneNumber.php                # 手机号
│
├── contract/
│   ├── repository/
│   │   ├── ProductRepositoryInterface.php
│   │   ├── OrderRepositoryInterface.php
│   │   ├── CartRepositoryInterface.php
│   │   ├── InventoryRepositoryInterface.php
│   │   └── PaymentRepositoryInterface.php
│   ├── gateway/
│   │   ├── PaymentGatewayInterface.php        # 支付网关接口
│   │   ├── SmsGatewayInterface.php            # 短信网关接口
│   │   └── EmailGatewayInterface.php          # 邮件网关接口
│   └── service/
│       └── NotificationServiceInterface.php   # 通知服务接口
│
├── infrastructure/
│   ├── repository/
│   │   └── eloquent/
│   │       ├── EloquentProductRepository.php
│   │       ├── EloquentOrderRepository.php
│   │       ├── EloquentCartRepository.php
│   │       ├── EloquentInventoryRepository.php
│   │       └── EloquentPaymentRepository.php
│   ├── gateway/
│   │   ├── payment/
│   │   │   ├── StripePaymentGateway.php       # Stripe 支付
│   │   │   ├── AlipayPaymentGateway.php       # 支付宝
│   │   │   └── WechatPaymentGateway.php       # 微信支付
│   │   ├── sms/
│   │   │   └── TwilioSmsGateway.php
│   │   └── email/
│   │       └── SendGridEmailGateway.php
│   └── cache/
│       └── RedisProductCache.php              # 商品缓存
│
├── middleware/
│   ├── auth/
│   │   └── AuthenticateMiddleware.php
│   └── rate_limit/
│       └── ApiRateLimitMiddleware.php
│
├── process/
│   ├── task/
│   │   ├── OrderTimeoutTask.php               # 订单超时处理
│   │   └── InventorySyncTask.php              # 库存同步
│   └── queue/
│       ├── OrderNotificationConsumer.php      # 订单通知消费者
│       └── PaymentCallbackConsumer.php        # 支付回调消费者
│
└── support/
    ├── exception/
    │   ├── ProductNotFoundException.php
    │   ├── InsufficientStockException.php
    │   ├── OrderNotFoundException.php
    │   └── PaymentFailedException.php
    └── helper/
        └── order_helper.php
```

---

## 模块划分

### 1. 商品模块

**功能**:
- 商品 CRUD
- 商品搜索
- 分类管理
- SKU 管理

**核心类**:
- `domain/product/entity/Product.php`
- `service/product/CreateProductService.php`
- `controller/api/v1/ProductController.php`

### 2. 订单模块

**功能**:
- 订单创建
- 订单状态流转
- 订单取消/退款
- 订单查询

**核心类**:
- `domain/order/entity/Order.php`
- `service/order/CreateOrderService.php`
- `domain/order/rule/OrderCancellationRule.php`

### 3. 支付模块

**功能**:
- 支付发起
- 支付回调处理
- 多支付方式支持
- 支付状态同步

**核心类**:
- `domain/payment/entity/Payment.php`
- `service/payment/ProcessPaymentService.php`
- `infrastructure/gateway/payment/StripePaymentGateway.php`

### 4. 库存模块

**功能**:
- 库存预留
- 库存扣减
- 库存释放
- 库存同步

**核心类**:
- `domain/inventory/entity/Inventory.php`
- `domain/inventory/rule/StockReservationRule.php`

### 5. 购物车模块

**功能**:
- 添加商品
- 修改数量
- 删除商品
- 结账

**核心类**:
- `service/cart/AddToCartService.php`
- `service/cart/CheckoutCartService.php`

---

## 目录职责

### `controller/` - HTTP 入口层

**职责**: 处理 HTTP 请求，验证输入，调用服务层，返回响应

**示例**: `controller/api/v1/OrderController.php`

### `service/` - 应用服务层

**职责**: 用例编排，事务管理，调用领域层和基础设施层

**示例**: `service/order/CreateOrderService.php`

### `domain/` - 领域层

**职责**: 核心业务逻辑，业务规则，领域事件

**示例**: `domain/order/entity/Order.php`

### `contract/` - 接口定义层

**职责**: 定义仓储、网关、服务接口

**示例**: `contract/gateway/PaymentGatewayInterface.php`

### `infrastructure/` - 基础设施层

**职责**: 实现接口，数据持久化，外部服务集成

**示例**: `infrastructure/gateway/payment/StripePaymentGateway.php`

---

## 关键代码示例

### 1. 订单实体

```php
<?php

declare(strict_types=1);

namespace app\domain\order\entity;

use app\domain\order\enum\OrderStatus;
use app\domain\order\vo\OrderNumber;
use app\domain\order\vo\ShippingAddress;
use app\domain\shared\vo\Money;
use app\domain\order\event\OrderCreated;
use app\domain\order\event\OrderPaid;
use app\domain\order\event\OrderCancelled;
use app\domain\order\exception\InvalidOrderOperationException;

final class Order
{
    private array $domainEvents = [];

    private function __construct(
        private readonly int $id,
        private readonly OrderNumber $orderNumber,
        private readonly int $userId,
        private array $items,
        private Money $totalAmount,
        private OrderStatus $status,
        private readonly ShippingAddress $shippingAddress,
        private readonly \DateTimeImmutable $createdAt
    ) {
    }

    public static function create(
        int $userId,
        array $items,
        ShippingAddress $shippingAddress
    ): self {
        if (empty($items)) {
            throw new InvalidOrderOperationException('Order must have at least one item');
        }

        $order = new self(
            id: 0,
            orderNumber: OrderNumber::generate(),
            userId: $userId,
            items: $items,
            totalAmount: Money::zero(),
            status: OrderStatus::Pending,
            shippingAddress: $shippingAddress,
            createdAt: new \DateTimeImmutable()
        );

        $order->calculateTotal();
        $order->recordEvent(new OrderCreated($order));

        return $order;
    }

    public function calculateTotal(): void
    {
        $total = array_reduce(
            $this->items,
            fn (Money $carry, OrderItem $item) => $carry->add($item->subtotal()),
            Money::zero()
        );

        $this->totalAmount = $total;
    }

    public function markAsPaid(): void
    {
        if (!$this->status->canBePaid()) {
            throw new InvalidOrderOperationException('Only pending orders can be marked as paid');
        }

        $this->status = OrderStatus::Paid;
        $this->recordEvent(new OrderPaid($this));
    }

    public function cancel(): void
    {
        if (!$this->status->canBeCancelled()) {
            throw new InvalidOrderOperationException('Order cannot be cancelled in current status');
        }

        $this->status = OrderStatus::Cancelled;
        $this->recordEvent(new OrderCancelled($this));
    }

    // Getters
    public function id(): int
    {
        return $this->id;
    }

    public function orderNumber(): OrderNumber
    {
        return $this->orderNumber;
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

    public function items(): array
    {
        return $this->items;
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

### 2. 创建订单服务

```php
<?php

declare(strict_types=1);

namespace app\service\order;

use app\contract\repository\OrderRepositoryInterface;
use app\contract\repository\ProductRepositoryInterface;
use app\contract\repository\InventoryRepositoryInterface;
use app\domain\order\entity\Order;
use app\domain\order\entity\OrderItem;
use app\domain\order\vo\ShippingAddress;
use app\domain\shared\vo\Money;
use support\Db;

final class CreateOrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository,
        private readonly ProductRepositoryInterface $productRepository,
        private readonly InventoryRepositoryInterface $inventoryRepository
    ) {
    }

    public function handle(int $userId, array $items, array $shippingAddressData): Order
    {
        return Db::transaction(function () use ($userId, $items, $shippingAddressData) {
            // 1. 验证商品和库存
            $orderItems = [];
            foreach ($items as $item) {
                $product = $this->productRepository->findById($item['product_id']);
                if ($product === null) {
                    throw new \RuntimeException("Product {$item['product_id']} not found");
                }

                // 预留库存
                $inventory = $this->inventoryRepository->findByProductId($product->id());
                $inventory->reserve($item['quantity']);
                $this->inventoryRepository->save($inventory);

                $orderItems[] = OrderItem::create(
                    productId: $product->id(),
                    productName: $product->name(),
                    price: $product->price(),
                    quantity: $item['quantity']
                );
            }

            // 2. 创建订单
            $shippingAddress = ShippingAddress::fromArray($shippingAddressData);
            $order = Order::create($userId, $orderItems, $shippingAddress);

            // 3. 保存订单
            $this->orderRepository->save($order);

            return $order;
        });
    }
}
```

### 3. 支付网关接口

```php
<?php

declare(strict_types=1);

namespace app\contract\gateway;

use app\domain\payment\entity\Payment;
use app\domain\payment\enum\PaymentMethod;

interface PaymentGatewayInterface
{
    /**
     * 创建支付
     */
    public function createPayment(
        string $orderNumber,
        int $amount,
        PaymentMethod $method
    ): Payment;

    /**
     * 查询支付状态
     */
    public function queryPayment(string $transactionId): Payment;

    /**
     * 退款
     */
    public function refund(string $transactionId, int $amount): bool;

    /**
     * 验证回调签名
     */
    public function verifyCallback(array $data): bool;
}
```

### 4. Stripe 支付网关实现

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\payment;

use app\contract\gateway\PaymentGatewayInterface;
use app\domain\payment\entity\Payment;
use app\domain\payment\enum\PaymentMethod;
use app\domain\payment\enum\PaymentStatus;
use app\domain\payment\vo\TransactionId;
use app\domain\shared\vo\Money;
use Stripe\StripeClient;

final class StripePaymentGateway implements PaymentGatewayInterface
{
    private StripeClient $stripe;

    public function __construct(string $apiKey)
    {
        $this->stripe = new StripeClient($apiKey);
    }

    public function createPayment(
        string $orderNumber,
        int $amount,
        PaymentMethod $method
    ): Payment {
        $paymentIntent = $this->stripe->paymentIntents->create([
            'amount' => $amount,
            'currency' => 'usd',
            'metadata' => [
                'order_number' => $orderNumber,
            ],
        ]);

        return Payment::create(
            transactionId: TransactionId::fromString($paymentIntent->id),
            orderNumber: $orderNumber,
            amount: Money::fromCents($amount),
            method: $method,
            status: PaymentStatus::Pending
        );
    }

    public function queryPayment(string $transactionId): Payment
    {
        $paymentIntent = $this->stripe->paymentIntents->retrieve($transactionId);

        return Payment::reconstitute(
            transactionId: TransactionId::fromString($paymentIntent->id),
            orderNumber: $paymentIntent->metadata['order_number'],
            amount: Money::fromCents($paymentIntent->amount),
            method: PaymentMethod::CreditCard,
            status: $this->mapStatus($paymentIntent->status)
        );
    }

    public function refund(string $transactionId, int $amount): bool
    {
        $refund = $this->stripe->refunds->create([
            'payment_intent' => $transactionId,
            'amount' => $amount,
        ]);

        return $refund->status === 'succeeded';
    }

    public function verifyCallback(array $data): bool
    {
        // Stripe webhook 签名验证
        $signature = $data['signature'] ?? '';
        $payload = $data['payload'] ?? '';

        try {
            \Stripe\Webhook::constructEvent(
                $payload,
                $signature,
                config('stripe.webhook_secret')
            );
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    private function mapStatus(string $stripeStatus): PaymentStatus
    {
        return match ($stripeStatus) {
            'succeeded' => PaymentStatus::Succeeded,
            'processing' => PaymentStatus::Processing,
            'canceled' => PaymentStatus::Cancelled,
            'requires_payment_method' => PaymentStatus::Failed,
            default => PaymentStatus::Pending,
        };
    }
}
```

### 5. 订单控制器

```php
<?php

declare(strict_types=1);

namespace app\controller\api\v1;

use app\service\order\CreateOrderService;
use app\service\order\CancelOrderService;
use app\contract\repository\OrderRepositoryInterface;
use support\Request;
use support\Response;

final class OrderController
{
    public function __construct(
        private readonly CreateOrderService $createOrderService,
        private readonly CancelOrderService $cancelOrderService,
        private readonly OrderRepositoryInterface $orderRepository
    ) {
    }

    /**
     * 创建订单
     */
    public function create(Request $request): Response
    {
        $validated = $this->validate($request, [
            'items' => 'required|array',
            'items.*.product_id' => 'required|integer',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|array',
            'shipping_address.name' => 'required|string',
            'shipping_address.phone' => 'required|string',
            'shipping_address.address' => 'required|string',
        ]);

        $order = $this->createOrderService->handle(
            userId: $request->user()->id,
            items: $validated['items'],
            shippingAddressData: $validated['shipping_address']
        );

        return json([
            'success' => true,
            'data' => [
                'order_id' => $order->id(),
                'order_number' => $order->orderNumber()->value(),
                'total_amount' => $order->totalAmount()->toCents(),
                'status' => $order->status()->value(),
            ],
        ]);
    }

    /**
     * 取消订单
     */
    public function cancel(Request $request, int $orderId): Response
    {
        $this->cancelOrderService->handle(
            orderId: $orderId,
            userId: $request->user()->id
        );

        return json([
            'success' => true,
            'message' => 'Order cancelled successfully',
        ]);
    }

    /**
     * 获取订单详情
     */
    public function show(Request $request, int $orderId): Response
    {
        $order = $this->orderRepository->findById($orderId);

        if ($order === null || $order->userId() !== $request->user()->id) {
            return json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        }

        return json([
            'success' => true,
            'data' => [
                'id' => $order->id(),
                'order_number' => $order->orderNumber()->value(),
                'total_amount' => $order->totalAmount()->toCents(),
                'status' => $order->status()->value(),
                'items' => array_map(
                    fn ($item) => [
                        'product_id' => $item->productId(),
                        'product_name' => $item->productName(),
                        'price' => $item->price()->toCents(),
                        'quantity' => $item->quantity(),
                        'subtotal' => $item->subtotal()->toCents(),
                    ],
                    $order->items()
                ),
            ],
        ]);
    }
}
```

### 6. 库存预留规则

```php
<?php

declare(strict_types=1);

namespace app\domain\inventory\rule;

use app\domain\inventory\entity\Inventory;
use app\domain\inventory\exception\InsufficientStockException;

final class StockReservationRule
{
    /**
     * 验证库存是否足够
     */
    public function validate(Inventory $inventory, int $quantity): void
    {
        if ($inventory->availableStock() < $quantity) {
            throw new InsufficientStockException(
                "Insufficient stock for product {$inventory->productId()}. " .
                "Available: {$inventory->availableStock()}, Requested: {$quantity}"
            );
        }
    }

    /**
     * 检查是否允许超卖
     */
    public function allowOverselling(Inventory $inventory): bool
    {
        // 某些商品允许超卖（如虚拟商品）
        return $inventory->isVirtual();
    }
}
```

---

## 依赖注入配置

```php
<?php
// config/container.php

use app\contract\repository\OrderRepositoryInterface;
use app\contract\repository\ProductRepositoryInterface;
use app\contract\repository\InventoryRepositoryInterface;
use app\contract\gateway\PaymentGatewayInterface;
use app\infrastructure\repository\eloquent\EloquentOrderRepository;
use app\infrastructure\repository\eloquent\EloquentProductRepository;
use app\infrastructure\repository\eloquent\EloquentInventoryRepository;
use app\infrastructure\gateway\payment\StripePaymentGateway;

return [
    // Repository bindings
    OrderRepositoryInterface::class => EloquentOrderRepository::class,
    ProductRepositoryInterface::class => EloquentProductRepository::class,
    InventoryRepositoryInterface::class => EloquentInventoryRepository::class,

    // Gateway bindings
    PaymentGatewayInterface::class => function () {
        return new StripePaymentGateway(config('stripe.api_key'));
    },
];
```

---

## 最佳实践

### 1. 订单状态流转

使用状态机模式管理订单状态:
- pending -> paid -> shipped -> completed
- pending -> cancelled
- paid -> refunded

### 2. 库存管理

- 下单时预留库存 (reserve)
- 支付成功后扣减库存 (deduct)
- 取消订单时释放库存 (release)

### 3. 支付集成

- 使用策略模式支持多支付方式
- 异步处理支付回调
- 幂等性处理防止重复支付

### 4. 事务处理

- 订单创建和库存预留在同一事务
- 使用领域事件解耦模块间通信

### 5. 性能优化

- 商品信息缓存
- 库存查询优化
- 订单列表分页

---

## 相关文档

- [目录结构规范](../architecture/directory-structure.mdx)
- [依赖方向规则](../architecture/dependency-rules.mdx)
- [PER Coding Style](../coding-standards/per-coding-style.mdx)
