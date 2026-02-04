---
title: "Saloon - HTTP Client"
description: "Elegant PHP HTTP client designed for building API SDKs and third-party service integrations"
---

# Saloon - HTTP Client

> Elegant PHP HTTP client designed for building API SDKs and third-party service integrations

---

## Table of Contents

- [Introduction](#introduction)
- [Saloon vs Guzzle](#saloon-vs-guzzle)
- [Installation and Configuration](#installation-and-configuration)
- [Core Concepts](#core-concepts)
- [Integration with Webman](#integration-with-webman)
- [Code Examples](#code-examples)
- [Authentication Patterns](#authentication-patterns)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

---

## Introduction

### What is Saloon?

Saloon is a modern PHP HTTP client focused on building type-safe, testable API integrations. It provides a declarative way to define HTTP requests.

**Key Features**:
- Object-oriented API design
- Type-safe requests and responses
- Built-in authentication support
- Powerful middleware system
- Easy to test and mock
- Plugin ecosystem

### Use Cases

**Recommended for Saloon**:
- Building third-party API SDKs (payment, SMS, logistics, etc.)
- Complex API integrations (requiring authentication, retry, caching)
- Need for type-safe HTTP client
- Need for testable API calls
- Microservice communication

**Optional for Guzzle**:
- Simple one-off HTTP requests
- Quick prototyping
- No need for complex authentication and error handling

---

## Saloon vs Guzzle

### Comparison Table

| Feature | Saloon | Guzzle |
|---------|--------|--------|
| Learning Curve | Medium | Low |
| Type Safety | Strong | Weak |
| Testability | Excellent | Fair |
| Code Organization | Structured | Free-form |
| Auth Support | Built-in | Manual |
| Middleware | Powerful | Supported |
| Performance | Excellent | Excellent |
| Community | Smaller | Large |

### Code Comparison

#### Guzzle Approach

```php
<?php

declare(strict_types=1);

use GuzzleHttp\Client;

// Need to manually build request every time
$client = new Client([
    'base_uri' => 'https://api.stripe.com',
    'headers' => [
        'Authorization' => 'Bearer ' . $apiKey,
        'Content-Type' => 'application/json',
    ],
]);

try {
    $response = $client->post('/v1/charges', [
        'json' => [
            'amount' => 1000,
            'currency' => 'usd',
        ],
    ]);

    $data = json_decode($response->getBody()->getContents(), true);
} catch (\Exception $e) {
    // Manual error handling
}
```

#### Saloon Approach

```php
<?php

declare(strict_types=1);

use Saloon\Http\Connector;
use Saloon\Http\Request;
use Saloon\Http\Response;

// Define Connector (reusable)
class StripeConnector extends Connector
{
    public function resolveBaseUrl(): string
    {
        return 'https://api.stripe.com';
    }

    protected function defaultHeaders(): array
    {
        return [
            'Authorization' => 'Bearer ' . config('stripe.api_key'),
            'Content-Type' => 'application/json',
        ];
    }
}

// Define Request (type-safe)
class CreateChargeRequest extends Request
{
    protected Method $method = Method::POST;

    public function __construct(
        private readonly int $amount,
        private readonly string $currency
    ) {
    }

    public function resolveEndpoint(): string
    {
        return '/v1/charges';
    }

    protected function defaultBody(): array
    {
        return [
            'amount' => $this->amount,
            'currency' => $this->currency,
        ];
    }
}

// Usage (clean and clear)
$connector = new StripeConnector();
$request = new CreateChargeRequest(amount: 1000, currency: 'usd');
$response = $connector->send($request);

$data = $response->json();
```

### When to Use Which?

#### Scenarios for Saloon

```php
<?php

// Scenario 1: Building API SDK
class PaymentGateway
{
    public function __construct(
        private readonly PaymentConnector $connector
    ) {
    }

    public function createCharge(int $amount): Charge
    {
        $request = new CreateChargeRequest($amount);
        $response = $this->connector->send($request);

        return Charge::fromResponse($response);
    }
}

// Scenario 2: API requiring authentication
class AuthenticatedConnector extends Connector
{
    use HasTokenAuthentication;

    public function __construct(private readonly string $token)
    {
    }

    protected function defaultAuth(): TokenAuthenticator
    {
        return new TokenAuthenticator($this->token);
    }
}

// Scenario 3: Need retry and error handling
class ResilientConnector extends Connector
{
    protected function defaultConfig(): array
    {
        return [
            'timeout' => 30,
            'retry' => [
                'times' => 3,
                'interval' => 1000,
            ],
        ];
    }
}
```

#### Scenarios for Guzzle

```php
<?php

// Scenario 1: Simple one-off request
$client = new Client();
$response = $client->get('https://api.example.com/status');

// Scenario 2: Quick prototype
$response = $client->post('https://webhook.site/xxx', [
    'json' => ['test' => 'data'],
]);

// Scenario 3: No complex encapsulation needed
$response = $client->request('GET', 'https://api.example.com/data');
```

---

## Installation and Configuration

### Installation

```bash
# Install Saloon
composer require saloonphp/saloon

# Install common plugins
composer require saloonphp/laravel-plugin
composer require saloonphp/cache-plugin
composer require saloonphp/rate-limit-plugin

# Verify installation
composer show saloonphp/saloon
```

---

## Core Concepts

### 1. Connector

Connector represents an API service, defining base URL, default headers, authentication, etc.

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\payment;

use Saloon\Http\Connector;
use Saloon\Traits\Plugins\AcceptsJson;

class StripeConnector extends Connector
{
    use AcceptsJson;

    public function __construct(
        private readonly string $apiKey
    ) {
    }

    public function resolveBaseUrl(): string
    {
        return 'https://api.stripe.com';
    }

    protected function defaultHeaders(): array
    {
        return [
            'Authorization' => 'Bearer ' . $this->apiKey,
        ];
    }

    protected function defaultConfig(): array
    {
        return [
            'timeout' => 30,
        ];
    }
}
```

### 2. Request

Request represents a specific API request, defining endpoint, method, parameters, etc.

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\payment\request;

use Saloon\Enums\Method;
use Saloon\Http\Request;

class CreateChargeRequest extends Request
{
    protected Method $method = Method::POST;

    public function __construct(
        private readonly int $amount,
        private readonly string $currency,
        private readonly string $source
    ) {
    }

    public function resolveEndpoint(): string
    {
        return '/v1/charges';
    }

    protected function defaultBody(): array
    {
        return [
            'amount' => $this->amount,
            'currency' => $this->currency,
            'source' => $this->source,
        ];
    }
}
```

### 3. Response

Response encapsulates HTTP response, providing convenient data access methods.

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\payment\response;

use Saloon\Http\Response;

class ChargeResponse
{
    public function __construct(
        public readonly string $id,
        public readonly int $amount,
        public readonly string $status
    ) {
    }

    public static function fromResponse(Response $response): self
    {
        $data = $response->json();

        return new self(
            id: $data['id'],
            amount: $data['amount'],
            status: $data['status']
        );
    }
}
```

---

## Integration with Webman

### Integration Patterns

#### Pattern 1: Gateway Pattern (Recommended)

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\payment;

use app\contract\gateway\PaymentGatewayInterface;
use app\domain\order\entity\Order;
use app\infrastructure\gateway\payment\request\CreateChargeRequest;
use app\infrastructure\gateway\payment\response\ChargeResponse;

final class StripePaymentGateway implements PaymentGatewayInterface
{
    public function __construct(
        private readonly StripeConnector $connector
    ) {
    }

    public function createPaymentIntent(Order $order): string
    {
        $request = new CreateChargeRequest(
            amount: $order->totalAmount()->toCents(),
            currency: 'usd',
            source: 'tok_visa'
        );

        $response = $this->connector->send($request);

        $charge = ChargeResponse::fromResponse($response);

        return $charge->id;
    }
}
```

#### Pattern 2: Service Pattern

```php
<?php

declare(strict_types=1);

namespace app\service\notification;

use app\infrastructure\gateway\sms\TwilioConnector;
use app\infrastructure\gateway\sms\request\SendSmsRequest;

final class SmsNotificationService
{
    public function __construct(
        private readonly TwilioConnector $connector
    ) {
    }

    public function send(string $phone, string $message): bool
    {
        $request = new SendSmsRequest($phone, $message);

        $response = $this->connector->send($request);

        return $response->successful();
    }
}
```

### Dependency Injection Configuration

Configure in `config/container.php`:

```php
<?php

declare(strict_types=1);

use app\contract\gateway\PaymentGatewayInterface;
use app\infrastructure\gateway\payment\StripeConnector;
use app\infrastructure\gateway\payment\StripePaymentGateway;

return [
    // Connector
    StripeConnector::class => function () {
        return new StripeConnector(
            apiKey: config('stripe.api_key')
        );
    },

    // Gateway
    PaymentGatewayInterface::class => function ($container) {
        return new StripePaymentGateway(
            connector: $container->get(StripeConnector::class)
        );
    },
];
```

---

## Code Examples

### Example 1: Payment Gateway Integration

#### Connector

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\payment;

use Saloon\Http\Connector;
use Saloon\Traits\Plugins\AcceptsJson;

class AlipayConnector extends Connector
{
    use AcceptsJson;

    public function __construct(
        private readonly string $appId,
        private readonly string $privateKey
    ) {
    }

    public function resolveBaseUrl(): string
    {
        return 'https://openapi.alipay.com/gateway.do';
    }

    protected function defaultQuery(): array
    {
        return [
            'app_id' => $this->appId,
            'format' => 'JSON',
            'charset' => 'utf-8',
            'sign_type' => 'RSA2',
            'timestamp' => date('Y-m-d H:i:s'),
            'version' => '1.0',
        ];
    }
}
```

#### Request

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\payment\request;

use Saloon\Enums\Method;
use Saloon\Http\Request;

class CreateAlipayOrderRequest extends Request
{
    protected Method $method = Method::POST;

    public function __construct(
        private readonly string $outTradeNo,
        private readonly int $totalAmount,
        private readonly string $subject
    ) {
    }

    public function resolveEndpoint(): string
    {
        return '/gateway.do';
    }

    protected function defaultQuery(): array
    {
        return [
            'method' => 'alipay.trade.create',
            'biz_content' => json_encode([
                'out_trade_no' => $this->outTradeNo,
                'total_amount' => $this->totalAmount / 100,
                'subject' => $this->subject,
            ]),
        ];
    }
}
```

#### Gateway Implementation

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\payment;

use app\contract\gateway\PaymentGatewayInterface;
use app\domain\order\entity\Order;
use app\infrastructure\gateway\payment\request\CreateAlipayOrderRequest;

final class AlipayPaymentGateway implements PaymentGatewayInterface
{
    public function __construct(
        private readonly AlipayConnector $connector
    ) {
    }

    public function createPaymentIntent(Order $order): string
    {
        $request = new CreateAlipayOrderRequest(
            outTradeNo: (string) $order->id(),
            totalAmount: $order->totalAmount()->toCents(),
            subject: 'Order #' . $order->id()
        );

        $response = $this->connector->send($request);

        if (!$response->successful()) {
            throw new \RuntimeException('Failed to create Alipay order');
        }

        $data = $response->json();

        return $data['alipay_trade_create_response']['trade_no'];
    }
}
```

### Example 2: SMS Service Integration

#### Connector

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\sms;

use Saloon\Http\Connector;
use Saloon\Traits\Plugins\AcceptsJson;

class TwilioConnector extends Connector
{
    use AcceptsJson;

    public function __construct(
        private readonly string $accountSid,
        private readonly string $authToken
    ) {
    }

    public function resolveBaseUrl(): string
    {
        return "https://api.twilio.com/2010-04-01/Accounts/{$this->accountSid}";
    }

    protected function defaultAuth(): \Saloon\Http\Auth\BasicAuthenticator
    {
        return new \Saloon\Http\Auth\BasicAuthenticator(
            $this->accountSid,
            $this->authToken
        );
    }
}
```

#### Request

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\sms\request;

use Saloon\Enums\Method;
use Saloon\Http\Request;
use Saloon\Contracts\Body\HasBody;
use Saloon\Traits\Body\HasFormBody;

class SendSmsRequest extends Request implements HasBody
{
    use HasFormBody;

    protected Method $method = Method::POST;

    public function __construct(
        private readonly string $to,
        private readonly string $message,
        private readonly string $from
    ) {
    }

    public function resolveEndpoint(): string
    {
        return '/Messages.json';
    }

    protected function defaultBody(): array
    {
        return [
            'To' => $this->to,
            'From' => $this->from,
            'Body' => $this->message,
        ];
    }
}
```

### Example 3: Logistics Query Integration

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\logistics;

use Saloon\Http\Connector;
use Saloon\Http\Request;
use Saloon\Enums\Method;

class LogisticsConnector extends Connector
{
    public function __construct(
        private readonly string $apiKey
    ) {
    }

    public function resolveBaseUrl(): string
    {
        return 'https://api.logistics.com';
    }

    protected function defaultHeaders(): array
    {
        return [
            'X-API-Key' => $this->apiKey,
        ];
    }
}

class TrackShipmentRequest extends Request
{
    protected Method $method = Method::GET;

    public function __construct(
        private readonly string $trackingNumber
    ) {
    }

    public function resolveEndpoint(): string
    {
        return "/v1/tracking/{$this->trackingNumber}";
    }
}

// Usage
$connector = new LogisticsConnector(config('logistics.api_key'));
$request = new TrackShipmentRequest('1234567890');
$response = $connector->send($request);

$data = $response->json();
```

---

## Authentication Patterns

### 1. Token Authentication

```php
<?php

declare(strict_types=1);

use Saloon\Http\Connector;
use Saloon\Http\Auth\TokenAuthenticator;
use Saloon\Traits\Plugins\HasAuthentication;

class ApiConnector extends Connector
{
    use HasAuthentication;

    public function __construct(
        private readonly string $token
    ) {
    }

    protected function defaultAuth(): TokenAuthenticator
    {
        return new TokenAuthenticator($this->token);
    }
}
```

### 2. Basic Authentication

```php
<?php

declare(strict_types=1);

use Saloon\Http\Connector;
use Saloon\Http\Auth\BasicAuthenticator;

class ApiConnector extends Connector
{
    public function __construct(
        private readonly string $username,
        private readonly string $password
    ) {
    }

    protected function defaultAuth(): BasicAuthenticator
    {
        return new BasicAuthenticator($this->username, $this->password);
    }
}
```

### 3. OAuth 2.0

```php
<?php

declare(strict_types=1);

use Saloon\Http\Connector;
use Saloon\Http\Auth\AccessTokenAuthenticator;

class OAuthConnector extends Connector
{
    public function __construct(
        private readonly string $accessToken
    ) {
    }

    protected function defaultAuth(): AccessTokenAuthenticator
    {
        return new AccessTokenAuthenticator($this->accessToken);
    }
}
```

### 4. Custom Authentication

```php
<?php

declare(strict_types=1);

use Saloon\Http\Connector;

class CustomAuthConnector extends Connector
{
    public function __construct(
        private readonly string $apiKey,
        private readonly string $apiSecret
    ) {
    }

    protected function defaultHeaders(): array
    {
        $timestamp = time();
        $signature = hash_hmac('sha256', $timestamp, $this->apiSecret);

        return [
            'X-API-Key' => $this->apiKey,
            'X-Timestamp' => (string) $timestamp,
            'X-Signature' => $signature,
        ];
    }
}
```

---

## Error Handling

### 1. Basic Error Handling

```php
<?php

declare(strict_types=1);

use Saloon\Exceptions\Request\RequestException;

try {
    $response = $connector->send($request);

    if ($response->failed()) {
        // Handle failed response
        throw new \RuntimeException('Request failed: ' . $response->body());
    }

    $data = $response->json();
} catch (RequestException $e) {
    // Handle request exception
    logger()->error('API request failed', [
        'error' => $e->getMessage(),
        'response' => $e->getResponse()?->body(),
    ]);

    throw $e;
}
```

### 2. Custom Exceptions

```php
<?php

declare(strict_types=1);

namespace app\support\exception;

class PaymentGatewayException extends \RuntimeException
{
    public function __construct(
        string $message,
        public readonly ?array $response = null,
        ?\Throwable $previous = null
    ) {
        parent::__construct($message, 0, $previous);
    }
}
```

```php
<?php

use app\support\exception\PaymentGatewayException;

try {
    $response = $connector->send($request);

    if ($response->failed()) {
        throw new PaymentGatewayException(
            'Payment failed',
            $response->json()
        );
    }
} catch (PaymentGatewayException $e) {
    logger()->error('Payment gateway error', [
        'message' => $e->getMessage(),
        'response' => $e->response,
    ]);
}
```

### 3. Retry Mechanism

```php
<?php

declare(strict_types=1);

use Saloon\Http\Connector;

class ResilientConnector extends Connector
{
    protected function defaultConfig(): array
    {
        return [
            'timeout' => 30,
            'connect_timeout' => 10,
        ];
    }

    public function boot(): void
    {
        $this->middleware()->onRequest(function ($request) {
            // Add retry logic
        });
    }
}
```

### 4. Response Validation

```php
<?php

declare(strict_types=1);

use Saloon\Http\Response;

class ValidatedResponse
{
    public static function validate(Response $response): array
    {
        if (!$response->successful()) {
            throw new \RuntimeException('Request failed');
        }

        $data = $response->json();

        if (!isset($data['status']) || $data['status'] !== 'success') {
            throw new \RuntimeException('Invalid response format');
        }

        return $data;
    }
}
```

---

## Best Practices

### Recommended

1. **Use Connector to encapsulate API**
   ```php
   // Good - reusable
   class StripeConnector extends Connector
   {
       // Centralized configuration
   }
   ```

2. **Create Request class for each endpoint**
   ```php
   // Good - type-safe
   class CreateChargeRequest extends Request
   {
       public function __construct(
           private readonly int $amount
       ) {
       }
   }
   ```

3. **Use Response DTO**
   ```php
   // Good - type-safe response
   class ChargeResponse
   {
       public static function fromResponse(Response $response): self
       {
           // Convert to domain object
       }
   }
   ```

4. **Implement Gateway interface**
   ```php
   // Good - dependency inversion
   class StripePaymentGateway implements PaymentGatewayInterface
   {
       // Implement interface
   }
   ```

5. **Centralized configuration management**
   ```php
   // config/payment.php
   return [
       'stripe' => [
           'api_key' => env('STRIPE_API_KEY'),
       ],
   ];
   ```

6. **Log requests**
   ```php
   logger()->info('Payment request', [
       'amount' => $amount,
       'currency' => $currency,
   ]);
   ```

### Avoid

1. **Don't use Connector directly in Controller**
   ```php
   // Wrong
   class OrderController
   {
       public function create(Request $request)
       {
           $connector = new StripeConnector();
           $response = $connector->send(...);
       }
   }

   // Correct
   class OrderController
   {
       public function __construct(
           private readonly PaymentGatewayInterface $paymentGateway
       ) {
       }
   }
   ```

2. **Don't hardcode API keys**
   ```php
   // Wrong
   $connector = new StripeConnector('sk_test_xxx');

   // Correct
   $connector = new StripeConnector(config('stripe.api_key'));
   ```

3. **Don't ignore error handling**
   ```php
   // Wrong
   $response = $connector->send($request);
   $data = $response->json();

   // Correct
   $response = $connector->send($request);
   if ($response->failed()) {
       throw new PaymentGatewayException('Payment failed');
   }
   $data = $response->json();
   ```

4. **Don't use Saloon in Domain layer**
   ```php
   // Wrong - Domain layer should not depend on external libraries
   class Order
   {
       public function pay(StripeConnector $connector)
       {
           // ...
       }
   }

   // Correct - Through Gateway interface
   class Order
   {
       public function pay(PaymentGatewayInterface $gateway)
       {
           // ...
       }
   }
   ```

---

## Testing

### Mock Connector

```php
<?php

declare(strict_types=1);

use Saloon\Http\Faking\MockClient;
use Saloon\Http\Faking\MockResponse;

test('can create payment', function () {
    // Create Mock Client
    $mockClient = new MockClient([
        CreateChargeRequest::class => MockResponse::make([
            'id' => 'ch_123',
            'amount' => 1000,
            'status' => 'succeeded',
        ], 200),
    ]);

    // Use Mock Client
    $connector = new StripeConnector('test_key');
    $connector->withMockClient($mockClient);

    $request = new CreateChargeRequest(1000, 'usd', 'tok_visa');
    $response = $connector->send($request);

    expect($response->json())->toHaveKey('id');
});
```

---

## Related Documentation

- [Directory Structure](../architecture/directory-structure)
- [Dependency Rules](../architecture/dependency-rules)
- [Pest Testing Framework](./pest)
- [CI/CD Pipeline](./ci-pipeline)

---

## Reference Resources

- [Saloon Official Documentation](https://docs.saloon.dev/)
- [Saloon GitHub](https://github.com/saloonphp/saloon)
- [Guzzle Documentation](https://docs.guzzlephp.org/)
