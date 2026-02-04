---
title: "E-commerce System Example"
description: "Complete e-commerce system architecture example with order, product, payment, and inventory management"
---

## Table of Contents

- [System Overview](#system-overview)
- [Complete Directory Tree](#complete-directory-tree)
- [Module Breakdown](#module-breakdown)
- [Directory Responsibilities](#directory-responsibilities)
- [Key Code Examples](#key-code-examples)

---

## System Overview

### Core Features

- Product Management
- Shopping Cart
- Order Processing
- Payment Integration
- Inventory Management
- User Management

### Technical Features

- DDD Layered Architecture
- Domain Event Driven
- External Payment Gateway Integration
- Inventory Deduction Transaction Processing
- Order State Machine

---

## Complete Directory Tree

```
app/
├── controller/
│   ├── api/
│   │   └── v1/
│   │       ├── ProductController.php          # Product API
│   │       ├── CartController.php             # Shopping Cart API
│   │       ├── OrderController.php            # Order API
│   │       └── PaymentController.php          # Payment API
│   └── web/
│       ├── ProductController.php              # Product Pages
│       └── CheckoutController.php             # Checkout Pages
│
├── model/
│   └── eloquent/
│       ├── Product.php                        # Product Model
│       ├── Order.php                          # Order Model
│       ├── OrderItem.php                      # Order Item Model
│       ├── Cart.php                           # Cart Model
│       ├── Inventory.php                      # Inventory Model
│       └── Payment.php                        # Payment Record Model
│
├── service/
│   ├── product/
│   │   ├── CreateProductService.php           # Create Product
│   │   ├── UpdateProductService.php           # Update Product
│   │   └── SearchProductService.php           # Search Products
│   ├── cart/
│   │   ├── AddToCartService.php               # Add to Cart
│   │   └── CheckoutCartService.php            # Cart Checkout
│   ├── order/
│   │   ├── CreateOrderService.php             # Create Order
│   │   ├── CancelOrderService.php             # Cancel Order
│   │   ├── RefundOrderService.php             # Refund Order
│   │   └── CompleteOrderService.php           # Complete Order
│   └── payment/
│       ├── ProcessPaymentService.php          # Process Payment
│       └── HandlePaymentCallbackService.php   # Payment Callback
│
├── domain/
│   ├── product/
│   │   ├── entity/
│   │   │   ├── Product.php                    # Product Entity
│   │   │   └── ProductCategory.php            # Product Category
│   │   ├── vo/                                # Value Objects
│   │   │   ├── ProductSku.php                 # SKU
│   │   │   ├── Price.php                      # Price
│   │   │   └── Stock.php                      # Stock Quantity
│   │   └── event/
│   │       ├── ProductCreated.php
│   │       └── ProductOutOfStock.php
│   │
│   ├── order/
│   │   ├── entity/
│   │   │   ├── Order.php                      # Order Entity
│   │   │   └── OrderItem.php                  # Order Item
│   │   ├── enum/                              # Enums
│   │   │   └── OrderStatus.php                # Order Status
│   │   ├── vo/                                # Value Objects
│   │   │   ├── ShippingAddress.php            # Shipping Address
│   │   │   └── OrderNumber.php                # Order Number
│   │   ├── event/
│   │   │   ├── OrderCreated.php
│   │   │   ├── OrderPaid.php
│   │   │   ├── OrderShipped.php
│   │   │   ├── OrderCancelled.php
│   │   │   └── OrderCompleted.php
│   │   └── rule/
│   │       ├── OrderCancellationRule.php      # Cancellation Rule
│   │       └── RefundRule.php                 # Refund Rule
│   │
│   ├── payment/
│   │   ├── entity/
│   │   │   └── Payment.php                    # Payment Entity
│   │   ├── enum/                              # Enums
│   │   │   ├── PaymentMethod.php              # Payment Method
│   │   │   └── PaymentStatus.php              # Payment Status
│   │   ├── vo/                                # Value Objects
│   │   │   └── TransactionId.php              # Transaction ID
│   │   └── event/
│   │       ├── PaymentInitiated.php
│   │       ├── PaymentSucceeded.php
│   │       └── PaymentFailed.php
│   │
│   ├── inventory/
│   │   ├── entity/
│   │   │   └── Inventory.php                  # Inventory Entity
│   │   ├── vo/                                # Value Objects
│   │   │   └── StockLevel.php                 # Stock Level
│   │   ├── event/
│   │   │   ├── StockReserved.php              # Stock Reserved
│   │   │   ├── StockReleased.php              # Stock Released
│   │   │   └── StockDeducted.php              # Stock Deducted
│   │   └── rule/
│   │       └── StockReservationRule.php       # Stock Reservation Rule
│   │
│   └── shared/
│       └── vo/                                # Value Objects
│           ├── Money.php                      # Money
│           ├── Email.php                      # Email
│           └── PhoneNumber.php                # Phone Number
│
├── contract/
│   ├── repository/
│   │   ├── ProductRepositoryInterface.php
│   │   ├── OrderRepositoryInterface.php
│   │   ├── CartRepositoryInterface.php
│   │   ├── InventoryRepositoryInterface.php
│   │   └── PaymentRepositoryInterface.php
│   ├── gateway/
│   │   ├── PaymentGatewayInterface.php        # Payment Gateway Interface
│   │   ├── SmsGatewayInterface.php            # SMS Gateway Interface
│   │   └── EmailGatewayInterface.php          # Email Gateway Interface
│   └── service/
│       └── NotificationServiceInterface.php   # Notification Service Interface
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
│   │   │   ├── StripePaymentGateway.php       # Stripe Payment
│   │   │   ├── AlipayPaymentGateway.php       # Alipay
│   │   │   └── WechatPaymentGateway.php       # WeChat Pay
│   │   ├── sms/
│   │   │   └── TwilioSmsGateway.php
│   │   └── email/
│   │       └── SendGridEmailGateway.php
│   └── cache/
│       └── RedisProductCache.php              # Product Cache
│
├── middleware/
│   ├── auth/
│   │   └── AuthenticateMiddleware.php
│   └── rate_limit/
│       └── ApiRateLimitMiddleware.php
│
├── process/
│   ├── task/
│   │   ├── OrderTimeoutTask.php               # Order Timeout Handler
│   │   └── InventorySyncTask.php              # Inventory Sync
│   └── queue/
│       ├── OrderNotificationConsumer.php      # Order Notification Consumer
│       └── PaymentCallbackConsumer.php        # Payment Callback Consumer
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

## Module Breakdown

### 1. Product Module

**Features**:
- Product CRUD
- Product Search
- Category Management
- SKU Management

**Core Classes**:
- `domain/product/entity/Product.php`
- `service/product/CreateProductService.php`
- `controller/api/v1/ProductController.php`

### 2. Order Module

**Features**:
- Order Creation
- Order Status Transitions
- Order Cancellation/Refund
- Order Query

**Core Classes**:
- `domain/order/entity/Order.php`
- `service/order/CreateOrderService.php`
- `domain/order/rule/OrderCancellationRule.php`

### 3. Payment Module

**Features**:
- Payment Initiation
- Payment Callback Handling
- Multiple Payment Methods Support
- Payment Status Synchronization

**Core Classes**:
- `domain/payment/entity/Payment.php`
- `service/payment/ProcessPaymentService.php`
- `infrastructure/gateway/payment/StripePaymentGateway.php`

### 4. Inventory Module

**Features**:
- Stock Reservation
- Stock Deduction
- Stock Release
- Inventory Sync

**Core Classes**:
- `domain/inventory/entity/Inventory.php`
- `domain/inventory/rule/StockReservationRule.php`

### 5. Shopping Cart Module

**Features**:
- Add Products
- Modify Quantity
- Remove Products
- Checkout

**Core Classes**:
- `service/cart/AddToCartService.php`
- `service/cart/CheckoutCartService.php`

---

## Directory Responsibilities

### `controller/` - HTTP Entry Layer

**Responsibility**: Handle HTTP requests, validate input, call service layer, return responses

**Example**: `controller/api/v1/OrderController.php`

### `service/` - Application Service Layer

**Responsibility**: Use case orchestration, transaction management, call domain and infrastructure layers

**Example**: `service/order/CreateOrderService.php`

### `domain/` - Domain Layer

**Responsibility**: Core business logic, business rules, domain events

**Example**: `domain/order/entity/Order.php`

### `contract/` - Interface Definition Layer

**Responsibility**: Define repository, gateway, and service interfaces

**Example**: `contract/gateway/PaymentGatewayInterface.php`

### `infrastructure/` - Infrastructure Layer

**Responsibility**: Implement interfaces, data persistence, external service integration

**Example**: `infrastructure/gateway/payment/StripePaymentGateway.php`

---

## Key Code Examples

### 1. Order Entity

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

### 2. Create Order Service

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
            // 1. Validate products and inventory
            $orderItems = [];
            foreach ($items as $item) {
                $product = $this->productRepository->findById($item['product_id']);
                if ($product === null) {
                    throw new \RuntimeException("Product {$item['product_id']} not found");
                }

                // Reserve inventory
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

            // 2. Create order
            $shippingAddress = ShippingAddress::fromArray($shippingAddressData);
            $order = Order::create($userId, $orderItems, $shippingAddress);

            // 3. Save order
            $this->orderRepository->save($order);

            return $order;
        });
    }
}
```

### 3. Payment Gateway Interface

```php
<?php

declare(strict_types=1);

namespace app\contract\gateway;

use app\domain\payment\entity\Payment;
use app\domain\payment\enum\PaymentMethod;

interface PaymentGatewayInterface
{
    /**
     * Create payment
     */
    public function createPayment(
        string $orderNumber,
        int $amount,
        PaymentMethod $method
    ): Payment;

    /**
     * Query payment status
     */
    public function queryPayment(string $transactionId): Payment;

    /**
     * Refund payment
     */
    public function refund(string $transactionId, int $amount): bool;

    /**
     * Verify callback signature
     */
    public function verifyCallback(array $data): bool;
}
```

### 4. Stripe Payment Gateway Implementation

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
        // Stripe webhook signature verification
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

### 5. Order Controller

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
     * Create order
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
     * Cancel order
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
     * Get order details
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

### 6. Stock Reservation Rule

```php
<?php

declare(strict_types=1);

namespace app\domain\inventory\rule;

use app\domain\inventory\entity\Inventory;
use app\domain\inventory\exception\InsufficientStockException;

final class StockReservationRule
{
    /**
     * Validate if stock is sufficient
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
     * Check if overselling is allowed
     */
    public function allowOverselling(Inventory $inventory): bool
    {
        // Some products allow overselling (e.g., virtual products)
        return $inventory->isVirtual();
    }
}
```

---

## Dependency Injection Configuration

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

## Best Practices

### 1. Order Status Transitions

Use state machine pattern to manage order status:
- pending -> paid -> shipped -> completed
- pending -> cancelled
- paid -> refunded

### 2. Inventory Management

- Reserve stock when placing order (reserve)
- Deduct stock after payment success (deduct)
- Release stock when order cancelled (release)

### 3. Payment Integration

- Use strategy pattern to support multiple payment methods
- Process payment callbacks asynchronously
- Implement idempotency to prevent duplicate payments

### 4. Transaction Handling

- Order creation and inventory reservation in same transaction
- Use domain events to decouple inter-module communication

### 5. Performance Optimization

- Product information caching
- Inventory query optimization
- Order list pagination

---

## Related Documentation

- [Directory Structure Standards](/en/architecture/directory-structure)
- [Dependency Direction Rules](/en/architecture/dependency-rules)
- [PER Coding Style](/en/coding-standards/per-coding-style)
