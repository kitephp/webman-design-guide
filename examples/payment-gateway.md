# 支付网关集成 | Payment Gateway Integration

> 基于 Webman 的多支付网关集成架构示例，使用 Saloon HTTP 客户端
> Multi-payment gateway integration architecture example based on Webman, using Saloon HTTP client

---

## 📋 目录 | Table of Contents

- [完整目录树](#完整目录树)
- [模块划分](#模块划分)
- [目录职责](#目录职责)
- [关键代码示例](#关键代码示例)

---

## 完整目录树

```
app/
├─ controller/
│  └─ api/
│     └─ v1/
│        ├─ PaymentController.php         # 支付接口
│        ├─ RefundController.php          # 退款接口
│        └─ WebhookController.php         # 回调接口
│
├─ model/
│  └─ eloquent/
│     ├─ Payment.php                      # 支付记录
│     ├─ Refund.php                       # 退款记录
│     └─ PaymentLog.php                   # 支付日志
│
├─ middleware/
│  ├─ auth/
│  │  └─ WebhookSignatureMiddleware.php  # Webhook 签名验证
│  └─ rate_limit/
│     └─ PaymentRateLimitMiddleware.php   # 支付限流
│
├─ process/
│  └─ task/
│     ├─ PaymentStatusSyncTask.php       # 支付状态同步
│     └─ RefundProcessTask.php           # 退款处理任务
│
├─ service/
│  ├─ payment/
│  │  ├─ CreatePaymentService.php        # 创建支付
│  │  ├─ ProcessPaymentService.php       # 处理支付
│  │  ├─ CancelPaymentService.php        # 取消支付
│  │  └─ QueryPaymentService.php         # 查询支付
│  ├─ refund/
│  │  ├─ CreateRefundService.php         # 创建退款
│  │  └─ ProcessRefundService.php        # 处理退款
│  └─ webhook/
│     └─ HandleWebhookService.php         # 处理 Webhook
│
├─ domain/
│  ├─ payment/
│  │  ├─ entity/
│  │  │  ├─ Payment.php                  # 支付实体
│  │  │  └─ Refund.php                   # 退款实体
│  │  ├─ value_object/
│  │  │  ├─ Money.php                    # 金额
│  │  │  ├─ PaymentStatus.php           # 支付状态
│  │  │  ├─ PaymentMethod.php           # 支付方式
│  │  │  └─ Currency.php                # 货币
│  │  ├─ event/
│  │  │  ├─ PaymentCreated.php          # 支付已创建
│  │  │  ├─ PaymentSucceeded.php        # 支付成功
│  │  │  ├─ PaymentFailed.php           # 支付失败
│  │  │  └─ RefundProcessed.php         # 退款已处理
│  │  └─ rule/
│  │     ├─ PaymentValidationRule.php   # 支付验证规则
│  │     └─ RefundEligibilityRule.php   # 退款资格规则
│  │
│  └─ gateway/
│     ├─ value_object/
│     │  ├─ GatewayType.php             # 网关类型
│     │  └─ TransactionId.php           # 交易 ID
│     └─ exception/
│        └─ GatewayException.php         # 网关异常
│
├─ contract/
│  ├─ repository/
│  │  ├─ PaymentRepositoryInterface.php
│  │  └─ RefundRepositoryInterface.php
│  └─ gateway/
│     ├─ PaymentGatewayInterface.php     # 支付网关接口
│     └─ RefundGatewayInterface.php      # 退款网关接口
│
├─ infrastructure/
│  ├─ repository/
│  │  └─ eloquent/
│  │     ├─ EloquentPaymentRepository.php
│  │     └─ EloquentRefundRepository.php
│  │
│  └─ gateway/
│     ├─ stripe/
│     │  ├─ StripeConnector.php          # Stripe Saloon 连接器
│     │  ├─ StripePaymentGateway.php     # Stripe 支付实现
│     │  └─ requests/
│     │     ├─ CreatePaymentIntentRequest.php
│     │     ├─ CapturePaymentRequest.php
│     │     └─ CreateRefundRequest.php
│     │
│     ├─ paypal/
│     │  ├─ PayPalConnector.php          # PayPal Saloon 连接器
│     │  ├─ PayPalPaymentGateway.php     # PayPal 支付实现
│     │  └─ requests/
│     │     ├─ CreateOrderRequest.php
│     │     └─ CaptureOrderRequest.php
│     │
│     └─ alipay/
│        ├─ AlipayConnector.php          # Alipay Saloon 连接器
│        ├─ AlipayPaymentGateway.php     # Alipay 支付实现
│        └─ requests/
│           ├─ CreateTradeRequest.php
│           └─ QueryTradeRequest.php
│
└─ support/
   ├─ helper/
   │  └─ payment_helper.php
   └─ exception/
      ├─ PaymentException.php
      └─ RefundException.php
```

---

## 模块划分

### 核心模块 | Core Modules

1. **支付模块 (Payment)** - 创建支付、处理支付、查询支付状态
2. **退款模块 (Refund)** - 创建退款、处理退款、退款查询
3. **网关模块 (Gateway)** - 多支付网关适配（Stripe、PayPal、Alipay）
4. **Webhook 模块** - 处理支付网关回调通知

---

## 目录职责

### `app/service/payment/`
**职责**: 支付业务编排 - 创建支付流程、处理支付结果、状态同步

### `app/domain/payment/`
**职责**: 支付领域逻辑 - 支付实体、金额计算、支付状态管理、业务规则验证

### `app/infrastructure/gateway/`
**职责**: 支付网关适配 - 使用 [Saloon](../tools/saloon.md) 实现各支付网关的 HTTP 通信

### `app/contract/gateway/`
**职责**: 网关接口定义 - 统一的支付网关接口，支持多网关切换

---

## 关键代码示例

### 1. 支付网关接口

```php
<?php

declare(strict_types=1);

namespace app\contract\gateway;

use app\domain\payment\entity\Payment;
use app\domain\payment\value_object\Money;

/**
 * 支付网关接口
 * Payment Gateway Interface
 */
interface PaymentGatewayInterface
{
    /**
     * 创建支付
     * Create payment
     */
    public function createPayment(
        string $orderId,
        Money $amount,
        string $currency,
        array $metadata = []
    ): array;

    /**
     * 捕获支付（确认支付）
     * Capture payment
     */
    public function capturePayment(string $transactionId): array;

    /**
     * 取消支付
     * Cancel payment
     */
    public function cancelPayment(string $transactionId): void;

    /**
     * 查询支付状态
     * Query payment status
     */
    public function queryPayment(string $transactionId): array;

    /**
     * 验证 Webhook 签名
     * Verify webhook signature
     */
    public function verifyWebhookSignature(string $payload, string $signature): bool;
}
```

### 2. Stripe Saloon 连接器

参考 [Saloon Integration](../tools/saloon.md) 文档了解 Saloon 的详细用法。

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\stripe;

use Saloon\Http\Connector;
use Saloon\Traits\Plugins\AcceptsJson;

/**
 * Stripe Saloon 连接器
 * Stripe Saloon Connector
 */
final class StripeConnector extends Connector
{
    use AcceptsJson;

    public function __construct(
        private readonly string $apiKey
    ) {
    }

    public function resolveBaseUrl(): string
    {
        return 'https://api.stripe.com/v1';
    }

    protected function defaultHeaders(): array
    {
        return [
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Stripe-Version' => '2023-10-16',
        ];
    }
}
```

### 3. Stripe 创建支付请求

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\stripe\requests;

use Saloon\Enums\Method;
use Saloon\Http\Request;

/**
 * 创建支付意图请求
 * Create Payment Intent Request
 */
final class CreatePaymentIntentRequest extends Request
{
    protected Method $method = Method::POST;

    public function __construct(
        private readonly int $amount,
        private readonly string $currency,
        private readonly array $metadata = []
    ) {
    }

    public function resolveEndpoint(): string
    {
        return '/payment_intents';
    }

    protected function defaultBody(): array
    {
        return [
            'amount' => $this->amount,
            'currency' => $this->currency,
            'metadata' => $this->metadata,
            'automatic_payment_methods' => [
                'enabled' => true,
            ],
        ];
    }
}
```

### 4. Stripe 支付网关实现

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\stripe;

use app\contract\gateway\PaymentGatewayInterface;
use app\domain\payment\value_object\Money;
use app\infrastructure\gateway\stripe\requests\CreatePaymentIntentRequest;
use app\infrastructure\gateway\stripe\requests\CapturePaymentRequest;
use Saloon\Exceptions\Request\RequestException;

/**
 * Stripe 支付网关
 * Stripe Payment Gateway
 */
final class StripePaymentGateway implements PaymentGatewayInterface
{
    private StripeConnector $connector;

    public function __construct(string $apiKey)
    {
        $this->connector = new StripeConnector($apiKey);
    }

    public function createPayment(
        string $orderId,
        Money $amount,
        string $currency,
        array $metadata = []
    ): array {
        try {
            $request = new CreatePaymentIntentRequest(
                amount: $amount->toCents(),
                currency: strtolower($currency),
                metadata: array_merge($metadata, ['order_id' => $orderId])
            );

            $response = $this->connector->send($request);

            return [
                'transaction_id' => $response->json('id'),
                'client_secret' => $response->json('client_secret'),
                'status' => $response->json('status'),
            ];
        } catch (RequestException $e) {
            throw new \RuntimeException(
                'Stripe payment creation failed: ' . $e->getMessage()
            );
        }
    }

    public function capturePayment(string $transactionId): array
    {
        try {
            $request = new CapturePaymentRequest($transactionId);
            $response = $this->connector->send($request);

            return [
                'transaction_id' => $response->json('id'),
                'status' => $response->json('status'),
                'amount' => $response->json('amount'),
            ];
        } catch (RequestException $e) {
            throw new \RuntimeException(
                'Stripe payment capture failed: ' . $e->getMessage()
            );
        }
    }

    public function cancelPayment(string $transactionId): void
    {
        // Implementation
    }

    public function queryPayment(string $transactionId): array
    {
        // Implementation
        return [];
    }

    public function verifyWebhookSignature(string $payload, string $signature): bool
    {
        // Stripe webhook signature verification
        return true;
    }
}
```

### 5. 支付实体

```php
<?php

declare(strict_types=1);

namespace app\domain\payment\entity;

use app\domain\payment\value_object\Money;
use app\domain\payment\value_object\PaymentStatus;
use app\domain\payment\value_object\PaymentMethod;
use app\domain\payment\event\PaymentCreated;
use app\domain\payment\event\PaymentSucceeded;

/**
 * 支付实体
 * Payment Entity
 */
final class Payment
{
    private array $domainEvents = [];

    private function __construct(
        private readonly int $id,
        private readonly string $orderId,
        private readonly string $transactionId,
        private readonly Money $amount,
        private readonly string $currency,
        private readonly PaymentMethod $method,
        private PaymentStatus $status,
        private readonly \DateTimeImmutable $createdAt,
        private ?\DateTimeImmutable $paidAt
    ) {
    }

    public static function create(
        string $orderId,
        string $transactionId,
        Money $amount,
        string $currency,
        PaymentMethod $method
    ): self {
        $payment = new self(
            id: 0,
            orderId: $orderId,
            transactionId: $transactionId,
            amount: $amount,
            currency: $currency,
            method: $method,
            status: PaymentStatus::pending(),
            createdAt: new \DateTimeImmutable(),
            paidAt: null
        );

        $payment->recordEvent(new PaymentCreated($payment));

        return $payment;
    }

    public function markAsSucceeded(): void
    {
        $this->status = PaymentStatus::succeeded();
        $this->paidAt = new \DateTimeImmutable();
        $this->recordEvent(new PaymentSucceeded($this));
    }

    public function markAsFailed(): void
    {
        $this->status = PaymentStatus::failed();
    }

    // Getters
    public function id(): int
    {
        return $this->id;
    }

    public function orderId(): string
    {
        return $this->orderId;
    }

    public function transactionId(): string
    {
        return $this->transactionId;
    }

    public function amount(): Money
    {
        return $this->amount;
    }

    public function status(): PaymentStatus
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

### 6. 创建支付服务

```php
<?php

declare(strict_types=1);

namespace app\service\payment;

use app\contract\repository\PaymentRepositoryInterface;
use app\contract\gateway\PaymentGatewayInterface;
use app\domain\payment\entity\Payment;
use app\domain\payment\value_object\Money;
use app\domain\payment\value_object\PaymentMethod;
use support\Db;

/**
 * 创建支付服务
 * Create Payment Service
 */
final class CreatePaymentService
{
    public function __construct(
        private readonly PaymentRepositoryInterface $paymentRepository,
        private readonly PaymentGatewayInterface $paymentGateway
    ) {
    }

    public function handle(
        string $orderId,
        float $amount,
        string $currency,
        string $method
    ): Payment {
        return Db::transaction(function () use ($orderId, $amount, $currency, $method) {
            // 1. 调用支付网关创建支付
            $gatewayResponse = $this->paymentGateway->createPayment(
                orderId: $orderId,
                amount: Money::fromDollars($amount),
                currency: $currency,
                metadata: ['source' => 'web']
            );

            // 2. 创建支付实体
            $payment = Payment::create(
                orderId: $orderId,
                transactionId: $gatewayResponse['transaction_id'],
                amount: Money::fromDollars($amount),
                currency: $currency,
                method: PaymentMethod::from($method)
            );

            // 3. 持久化
            $this->paymentRepository->save($payment);

            return $payment;
        });
    }
}
```

### 7. Webhook 处理服务

```php
<?php

declare(strict_types=1);

namespace app\service\webhook;

use app\contract\repository\PaymentRepositoryInterface;
use app\contract\gateway\PaymentGatewayInterface;

/**
 * Webhook 处理服务
 * Handle Webhook Service
 */
final class HandleWebhookService
{
    public function __construct(
        private readonly PaymentRepositoryInterface $paymentRepository,
        private readonly PaymentGatewayInterface $paymentGateway
    ) {
    }

    public function handle(string $payload, string $signature): void
    {
        // 1. 验证签名
        if (!$this->paymentGateway->verifyWebhookSignature($payload, $signature)) {
            throw new \RuntimeException('Invalid webhook signature');
        }

        // 2. 解析事件
        $event = json_decode($payload, true);
        $eventType = $event['type'] ?? '';

        // 3. 处理不同类型的事件
        match ($eventType) {
            'payment_intent.succeeded' => $this->handlePaymentSucceeded($event),
            'payment_intent.payment_failed' => $this->handlePaymentFailed($event),
            'charge.refunded' => $this->handleRefund($event),
            default => null,
        };
    }

    private function handlePaymentSucceeded(array $event): void
    {
        $transactionId = $event['data']['object']['id'];

        $payment = $this->paymentRepository->findByTransactionId($transactionId);
        if ($payment === null) {
            return;
        }

        $payment->markAsSucceeded();
        $this->paymentRepository->save($payment);
    }

    private function handlePaymentFailed(array $event): void
    {
        // Handle payment failure
    }

    private function handleRefund(array $event): void
    {
        // Handle refund
    }
}
```

---

## 最佳实践

### 使用 Saloon HTTP 客户端

详细文档: [Saloon Integration](../tools/saloon.md)

**优势**:
1. **类型安全**: 强类型请求和响应
2. **可测试**: 易于 mock 和测试
3. **可维护**: 清晰的请求结构
4. **可扩展**: 支持插件和中间件

### 多网关支持

1. **统一接口**: 使用 `PaymentGatewayInterface` 统一不同网关
2. **工厂模式**: 根据配置动态选择网关
3. **降级策略**: 主网关失败时切换备用网关

### 安全性

1. **Webhook 验证**: 验证回调签名防止伪造
2. **幂等性**: 使用订单 ID 防止重复支付
3. **金额验证**: 服务端验证支付金额
4. **日志记录**: 记录所有支付操作

### 异常处理

1. **网关异常**: 捕获并转换为业务异常
2. **重试机制**: 网络错误时自动重试
3. **降级处理**: 网关不可用时的备选方案

---

## 相关文档

- [Saloon Integration](../tools/saloon.md) - HTTP 客户端集成
- [目录结构规范](../architecture/directory-structure.md)
- [依赖方向规则](../architecture/dependency-rules.md)

---

**最后更新**: 2026-02-02
