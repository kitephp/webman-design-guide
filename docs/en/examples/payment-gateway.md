---
title: "Payment Gateway Integration"
description: "Multi-payment gateway integration architecture example based on Webman, using Saloon HTTP client"
---

## Table of Contents

- [Complete Directory Tree](#complete-directory-tree)
- [Module Division](#module-division)
- [Directory Responsibilities](#directory-responsibilities)
- [Key Code Examples](#key-code-examples)

---

## Complete Directory Tree

```
app/
├─ controller/
│  └─ api/
│     └─ v1/
│        ├─ PaymentController.php         # Payment API
│        ├─ RefundController.php          # Refund API
│        └─ WebhookController.php         # Webhook API
│
├─ model/
│  └─ eloquent/
│     ├─ Payment.php                      # Payment record
│     ├─ Refund.php                       # Refund record
│     └─ PaymentLog.php                   # Payment log
│
├─ middleware/
│  ├─ auth/
│  │  └─ WebhookSignatureMiddleware.php  # Webhook signature verification
│  └─ rate_limit/
│     └─ PaymentRateLimitMiddleware.php   # Payment rate limiting
│
├─ process/
│  └─ task/
│     ├─ PaymentStatusSyncTask.php       # Payment status sync
│     └─ RefundProcessTask.php           # Refund processing task
│
├─ service/
│  ├─ payment/
│  │  ├─ CreatePaymentService.php        # Create payment
│  │  ├─ ProcessPaymentService.php       # Process payment
│  │  ├─ CancelPaymentService.php        # Cancel payment
│  │  └─ QueryPaymentService.php         # Query payment
│  ├─ refund/
│  │  ├─ CreateRefundService.php         # Create refund
│  │  └─ ProcessRefundService.php        # Process refund
│  └─ webhook/
│     └─ HandleWebhookService.php         # Handle Webhook
│
├─ domain/
│  ├─ payment/
│  │  ├─ entity/
│  │  │  ├─ Payment.php                  # Payment entity
│  │  │  └─ Refund.php                   # Refund entity
│  │  ├─ enum/                           # Enums
│  │  │  ├─ PaymentStatus.php           # Payment status
│  │  │  └─ PaymentMethod.php           # Payment method
│  │  ├─ vo/                             # Value Objects
│  │  │  ├─ Money.php                    # Money
│  │  │  └─ Currency.php                # Currency
│  │  ├─ event/
│  │  │  ├─ PaymentCreated.php          # Payment created
│  │  │  ├─ PaymentSucceeded.php        # Payment succeeded
│  │  │  ├─ PaymentFailed.php           # Payment failed
│  │  │  └─ RefundProcessed.php         # Refund processed
│  │  └─ rule/
│  │     ├─ PaymentValidationRule.php   # Payment validation rules
│  │     └─ RefundEligibilityRule.php   # Refund eligibility rules
│  │
│  └─ gateway/
│     ├─ enum/                           # Enums
│     │  └─ GatewayType.php             # Gateway type
│     ├─ vo/                             # Value Objects
│     │  └─ TransactionId.php           # Transaction ID
│     └─ exception/
│        └─ GatewayException.php         # Gateway exception
│
├─ contract/
│  ├─ repository/
│  │  ├─ PaymentRepositoryInterface.php
│  │  └─ RefundRepositoryInterface.php
│  └─ gateway/
│     ├─ PaymentGatewayInterface.php     # Payment gateway interface
│     └─ RefundGatewayInterface.php      # Refund gateway interface
│
├─ infrastructure/
│  ├─ repository/
│  │  └─ eloquent/
│  │     ├─ EloquentPaymentRepository.php
│  │     └─ EloquentRefundRepository.php
│  │
│  └─ gateway/
│     ├─ stripe/
│     │  ├─ StripeConnector.php          # Stripe Saloon connector
│     │  ├─ StripePaymentGateway.php     # Stripe payment implementation
│     │  └─ requests/
│     │     ├─ CreatePaymentIntentRequest.php
│     │     ├─ CapturePaymentRequest.php
│     │     └─ CreateRefundRequest.php
│     │
│     ├─ paypal/
│     │  ├─ PayPalConnector.php          # PayPal Saloon connector
│     │  ├─ PayPalPaymentGateway.php     # PayPal payment implementation
│     │  └─ requests/
│     │     ├─ CreateOrderRequest.php
│     │     └─ CaptureOrderRequest.php
│     │
│     └─ alipay/
│        ├─ AlipayConnector.php          # Alipay Saloon connector
│        ├─ AlipayPaymentGateway.php     # Alipay payment implementation
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

## Module Division

### Core Modules

1. **Payment Module** - Create payment, process payment, query payment status
2. **Refund Module** - Create refund, process refund, refund query
3. **Gateway Module** - Multi-payment gateway adaptation (Stripe, PayPal, Alipay)
4. **Webhook Module** - Handle payment gateway callback notifications

---

## Directory Responsibilities

### `app/service/payment/`
**Responsibility**: Payment business orchestration - Create payment flow, process payment results, status sync

### `app/domain/payment/`
**Responsibility**: Payment domain logic - Payment entity, amount calculation, payment status management, business rule validation

### `app/infrastructure/gateway/`
**Responsibility**: Payment gateway adaptation - Use Saloon to implement HTTP communication with various payment gateways

### `app/contract/gateway/`
**Responsibility**: Gateway interface definition - Unified payment gateway interface, supporting multi-gateway switching

---

## Key Code Examples

### 1. Payment Gateway Interface

```php
<?php

declare(strict_types=1);

namespace app\contract\gateway;

use app\domain\payment\entity\Payment;
use app\domain\payment\vo\Money;

/**
 * Payment Gateway Interface
 */
interface PaymentGatewayInterface
{
    /**
     * Create payment
     */
    public function createPayment(
        string $orderId,
        Money $amount,
        string $currency,
        array $metadata = []
    ): array;

    /**
     * Capture payment (confirm payment)
     */
    public function capturePayment(string $transactionId): array;

    /**
     * Cancel payment
     */
    public function cancelPayment(string $transactionId): void;

    /**
     * Query payment status
     */
    public function queryPayment(string $transactionId): array;

    /**
     * Verify Webhook signature
     */
    public function verifyWebhookSignature(string $payload, string $signature): bool;
}
```

### 2. Stripe Saloon Connector

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\stripe;

use Saloon\Http\Connector;
use Saloon\Traits\Plugins\AcceptsJson;

/**
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

### 3. Stripe Payment Gateway Implementation

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\stripe;

use app\contract\gateway\PaymentGatewayInterface;
use app\domain\payment\vo\Money;
use app\infrastructure\gateway\stripe\requests\CreatePaymentIntentRequest;
use Saloon\Exceptions\Request\RequestException;

/**
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
        // Implement capture payment logic
        return [];
    }

    public function cancelPayment(string $transactionId): void
    {
        // Implement cancel payment logic
    }

    public function queryPayment(string $transactionId): array
    {
        // Implement query payment logic
        return [];
    }

    public function verifyWebhookSignature(string $payload, string $signature): bool
    {
        // Stripe webhook signature verification
        return true;
    }
}
```

### 4. Create Payment Service

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
            // 1. Call payment gateway to create payment
            $gatewayResponse = $this->paymentGateway->createPayment(
                orderId: $orderId,
                amount: Money::fromDollars($amount),
                currency: $currency,
                metadata: ['source' => 'web']
            );

            // 2. Create payment entity
            $payment = Payment::create(
                orderId: $orderId,
                transactionId: $gatewayResponse['transaction_id'],
                amount: Money::fromDollars($amount),
                currency: $currency,
                method: PaymentMethod::from($method)
            );

            // 3. Persist
            $this->paymentRepository->save($payment);

            return $payment;
        });
    }
}
```

### 5. Webhook Handler Service

```php
<?php

declare(strict_types=1);

namespace app\service\webhook;

use app\contract\repository\PaymentRepositoryInterface;
use app\contract\gateway\PaymentGatewayInterface;

/**
 * Webhook Handler Service
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
        // 1. Verify signature
        if (!$this->paymentGateway->verifyWebhookSignature($payload, $signature)) {
            throw new \RuntimeException('Invalid webhook signature');
        }

        // 2. Parse event
        $event = json_decode($payload, true);
        $eventType = $event['type'] ?? '';

        // 3. Handle different event types
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

## Best Practices

### Using Saloon HTTP Client

**Advantages**:
1. **Type Safety**: Strongly typed requests and responses
2. **Testable**: Easy to mock and test
3. **Maintainable**: Clear request structure
4. **Extensible**: Supports plugins and middleware

### Multi-Gateway Support

1. **Unified Interface**: Use `PaymentGatewayInterface` to unify different gateways
2. **Factory Pattern**: Dynamically select gateway based on configuration
3. **Fallback Strategy**: Switch to backup gateway when primary fails

### Security

1. **Webhook Verification**: Verify callback signatures to prevent forgery
2. **Idempotency**: Use order ID to prevent duplicate payments
3. **Amount Validation**: Server-side validation of payment amounts
4. **Logging**: Record all payment operations

### Exception Handling

1. **Gateway Exceptions**: Catch and convert to business exceptions
2. **Retry Mechanism**: Auto retry on network errors
3. **Fallback Handling**: Alternative solutions when gateway is unavailable

---

## Related Documentation

- [Saloon Integration](/en/tools/saloon)
- [Directory Structure Standards](/en/architecture/directory-structure)
- [Dependency Direction Rules](/en/architecture/dependency-rules)
