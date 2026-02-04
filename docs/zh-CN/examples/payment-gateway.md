---
title: "支付网关集成"
description: "基于 Webman 的多支付网关集成架构示例，使用 Saloon HTTP 客户端"
---

## 目录

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
│  │  ├─ enum/                           # 枚举
│  │  │  ├─ PaymentStatus.php           # 支付状态
│  │  │  └─ PaymentMethod.php           # 支付方式
│  │  ├─ vo/                             # 值对象
│  │  │  ├─ Money.php                    # 金额
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
│     ├─ enum/                           # 枚举
│     │  └─ GatewayType.php             # 网关类型
│     ├─ vo/                             # 值对象
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

### 核心模块

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
**职责**: 支付网关适配 - 使用 Saloon 实现各支付网关的 HTTP 通信

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
use app\domain\payment\vo\Money;

/**
 * 支付网关接口
 */
interface PaymentGatewayInterface
{
    /**
     * 创建支付
     */
    public function createPayment(
        string $orderId,
        Money $amount,
        string $currency,
        array $metadata = []
    ): array;

    /**
     * 捕获支付（确认支付）
     */
    public function capturePayment(string $transactionId): array;

    /**
     * 取消支付
     */
    public function cancelPayment(string $transactionId): void;

    /**
     * 查询支付状态
     */
    public function queryPayment(string $transactionId): array;

    /**
     * 验证 Webhook 签名
     */
    public function verifyWebhookSignature(string $payload, string $signature): bool;
}
```

### 2. Stripe Saloon 连接器

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\stripe;

use Saloon\Http\Connector;
use Saloon\Traits\Plugins\AcceptsJson;

/**
 * Stripe Saloon 连接器
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

### 3. Stripe 支付网关实现

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\stripe;

use app\contract\gateway\PaymentGatewayInterface;
use app\domain\payment\vo\Money;
use app\infrastructure\gateway\stripe\requests\CreatePaymentIntentRequest;
use Saloon\Exceptions\Request\RequestException;

/**
 * Stripe 支付网关
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
        // 实现捕获支付逻辑
        return [];
    }

    public function cancelPayment(string $transactionId): void
    {
        // 实现取消支付逻辑
    }

    public function queryPayment(string $transactionId): array
    {
        // 实现查询支付逻辑
        return [];
    }

    public function verifyWebhookSignature(string $payload, string $signature): bool
    {
        // Stripe webhook 签名验证
        return true;
    }
}
```

### 4. 创建支付服务

```php
<?php

declare(strict_types=1);

namespace app\service\payment;

use app\contract\repository\PaymentRepositoryInterface;
use app\contract\gateway\PaymentGatewayInterface;
use app\domain\payment\entity\Payment;
use app\domain\payment\vo\Money;
use app\domain\payment\values\PaymentMethod;
use support\Db;

/**
 * 创建支付服务
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

### 5. Webhook 处理服务

```php
<?php

declare(strict_types=1);

namespace app\service\webhook;

use app\contract\repository\PaymentRepositoryInterface;
use app\contract\gateway\PaymentGatewayInterface;

/**
 * Webhook 处理服务
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
        // 处理支付失败
    }

    private function handleRefund(array $event): void
    {
        // 处理退款
    }
}
```

---

## 最佳实践

### 使用 Saloon HTTP 客户端

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

- [Saloon Integration](/zh-CN/tools/saloon)
- [目录结构规范](/zh-CN/architecture/directory-structure)
- [依赖方向规则](/zh-CN/architecture/dependency-rules)
