# Saloon - HTTP 客户端 | HTTP Client

> 优雅的 PHP HTTP 客户端，专为构建 API SDK 和第三方服务集成而设计
> Elegant PHP HTTP client designed for building API SDKs and third-party service integrations

---

## 📋 目录 | Table of Contents

- [简介](#简介)
- [Saloon vs Guzzle](#saloon-vs-guzzle)
- [安装与配置](#安装与配置)
- [核心概念](#核心概念)
- [与 Webman 集成](#与-webman-集成)
- [代码示例](#代码示例)
- [认证模式](#认证模式)
- [错误处理](#错误处理)
- [最佳实践](#最佳实践)

---

## 简介

### 什么是 Saloon？

Saloon 是一个现代化的 PHP HTTP 客户端，专注于构建类型安全、可测试的 API 集成。它提供了一种声明式的方式来定义 HTTP 请求。

**核心特性**：
- 面向对象的 API 设计
- 类型安全的请求和响应
- 内置认证支持
- 强大的中间件系统
- 易于测试和 Mock
- 插件生态系统

### Why Saloon?

Saloon is a modern PHP HTTP client focused on building type-safe, testable API integrations. It provides a declarative way to define HTTP requests.

**Key Features**:
- Object-oriented API design
- Type-safe requests and responses
- Built-in authentication support
- Powerful middleware system
- Easy to test and mock
- Plugin ecosystem

### 适用场景 | Use Cases

**✅ 推荐使用 Saloon**：
- 构建第三方 API SDK（支付、短信、物流等）
- 复杂的 API 集成（需要认证、重试、缓存）
- 需要类型安全的 HTTP 客户端
- 需要可测试的 API 调用
- 微服务间通信

**⚠️ 可选使用 Guzzle**：
- 简单的一次性 HTTP 请求
- 快速原型验证
- 不需要复杂的认证和错误处理

---

## Saloon vs Guzzle

### 对比表 | Comparison Table

| 特性 | Saloon | Guzzle | Feature | Saloon | Guzzle |
|------|--------|--------|---------|--------|--------|
| 学习曲线 | 中等 | 低 | Learning Curve | Medium | Low |
| 类型安全 | ✅ 强 | ⚠️ 弱 | Type Safety | ✅ Strong | ⚠️ Weak |
| 可测试性 | ✅ 优秀 | ⚠️ 一般 | Testability | ✅ Excellent | ⚠️ Fair |
| 代码组织 | ✅ 结构化 | ⚠️ 自由 | Code Organization | ✅ Structured | ⚠️ Free-form |
| 认证支持 | ✅ 内置 | ⚠️ 手动 | Auth Support | ✅ Built-in | ⚠️ Manual |
| 中间件 | ✅ 强大 | ✅ 支持 | Middleware | ✅ Powerful | ✅ Supported |
| 性能 | ✅ 优秀 | ✅ 优秀 | Performance | ✅ Excellent | ✅ Excellent |
| 社区 | ⚠️ 较小 | ✅ 庞大 | Community | ⚠️ Smaller | ✅ Large |

### 代码对比 | Code Comparison

#### Guzzle 方式

```php
<?php

declare(strict_types=1);

use GuzzleHttp\Client;

// 每次都需要手动构建请求
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
    // 手动处理错误
}
```

#### Saloon 方式

```php
<?php

declare(strict_types=1);

use Saloon\Http\Connector;
use Saloon\Http\Request;
use Saloon\Http\Response;

// 定义 Connector（可复用）
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

// 定义 Request（类型安全）
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

// 使用（简洁明了）
$connector = new StripeConnector();
$request = new CreateChargeRequest(amount: 1000, currency: 'usd');
$response = $connector->send($request);

$data = $response->json();
```

### 何时使用哪个？ | When to Use Which?

#### 使用 Saloon 的场景

```php
<?php

// ✅ 场景 1：构建 API SDK
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

// ✅ 场景 2：需要认证的 API
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

// ✅ 场景 3：需要重试和错误处理
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

#### 使用 Guzzle 的场景

```php
<?php

// ✅ 场景 1：简单的一次性请求
$client = new Client();
$response = $client->get('https://api.example.com/status');

// ✅ 场景 2：快速原型
$response = $client->post('https://webhook.site/xxx', [
    'json' => ['test' => 'data'],
]);

// ✅ 场景 3：不需要复杂封装
$response = $client->request('GET', 'https://api.example.com/data');
```

---

## 安装与配置

### 安装 | Installation

```bash
# 安装 Saloon
composer require saloonphp/saloon

# 安装常用插件
composer require saloonphp/laravel-plugin
composer require saloonphp/cache-plugin
composer require saloonphp/rate-limit-plugin

# 验证安装
composer show saloonphp/saloon
```

---

## 核心概念

### 1. Connector（连接器）

Connector 代表一个 API 服务，定义基础 URL、默认头部、认证等。

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

### 2. Request（请求）

Request 代表一个具体的 API 请求，定义端点、方法、参数等。

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

### 3. Response（响应）

Response 封装 HTTP 响应，提供便捷的数据访问方法。

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

## 与 Webman 集成

### 集成模式 | Integration Patterns

#### 模式 1：Gateway 模式（推荐）

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

#### 模式 2：Service 模式

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

### 依赖注入配置

在 `config/container.php` 中配置：

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

## 代码示例

### 示例 1：支付网关集成

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

### 示例 2：短信服务集成

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

### 示例 3：物流查询集成

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

// 使用
$connector = new LogisticsConnector(config('logistics.api_key'));
$request = new TrackShipmentRequest('1234567890');
$response = $connector->send($request);

$data = $response->json();
```

---

## 认证模式

### 1. Token 认证

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

### 2. Basic 认证

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

### 4. 自定义认证

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

## 错误处理

### 1. 基础错误处理

```php
<?php

declare(strict_types=1);

use Saloon\Exceptions\Request\RequestException;

try {
    $response = $connector->send($request);

    if ($response->failed()) {
        // 处理失败响应
        throw new \RuntimeException('Request failed: ' . $response->body());
    }

    $data = $response->json();
} catch (RequestException $e) {
    // 处理请求异常
    logger()->error('API request failed', [
        'error' => $e->getMessage(),
        'response' => $e->getResponse()?->body(),
    ]);

    throw $e;
}
```

### 2. 自定义异常

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

### 3. 重试机制

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
            // 添加重试逻辑
        });
    }
}
```

### 4. 响应验证

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

## 最佳实践

### ✅ DO

1. **使用 Connector 封装 API**
   ```php
   // ✅ 好 - 可复用
   class StripeConnector extends Connector
   {
       // 配置集中管理
   }
   ```

2. **为每个端点创建 Request 类**
   ```php
   // ✅ 好 - 类型安全
   class CreateChargeRequest extends Request
   {
       public function __construct(
           private readonly int $amount
       ) {
       }
   }
   ```

3. **使用 Response DTO**
   ```php
   // ✅ 好 - 类型安全的响应
   class ChargeResponse
   {
       public static function fromResponse(Response $response): self
       {
           // 转换为领域对象
       }
   }
   ```

4. **实现 Gateway 接口**
   ```php
   // ✅ 好 - 依赖倒置
   class StripePaymentGateway implements PaymentGatewayInterface
   {
       // 实现接口
   }
   ```

5. **集中配置管理**
   ```php
   // config/payment.php
   return [
       'stripe' => [
           'api_key' => env('STRIPE_API_KEY'),
       ],
   ];
   ```

6. **记录日志**
   ```php
   logger()->info('Payment request', [
       'amount' => $amount,
       'currency' => $currency,
   ]);
   ```

### ❌ DON'T

1. **不要在 Controller 中直接使用 Connector**
   ```php
   // ❌ 错误
   class OrderController
   {
       public function create(Request $request)
       {
           $connector = new StripeConnector();
           $response = $connector->send(...);
       }
   }

   // ✅ 正确
   class OrderController
   {
       public function __construct(
           private readonly PaymentGatewayInterface $paymentGateway
       ) {
       }
   }
   ```

2. **不要硬编码 API 密钥**
   ```php
   // ❌ 错误
   $connector = new StripeConnector('sk_test_xxx');

   // ✅ 正确
   $connector = new StripeConnector(config('stripe.api_key'));
   ```

3. **不要忽略错误处理**
   ```php
   // ❌ 错误
   $response = $connector->send($request);
   $data = $response->json();

   // ✅ 正确
   $response = $connector->send($request);
   if ($response->failed()) {
       throw new PaymentGatewayException('Payment failed');
   }
   $data = $response->json();
   ```

4. **不要在 Domain 层使用 Saloon**
   ```php
   // ❌ 错误 - Domain 层不应依赖外部库
   class Order
   {
       public function pay(StripeConnector $connector)
       {
           // ...
       }
   }

   // ✅ 正确 - 通过 Gateway 接口
   class Order
   {
       public function pay(PaymentGatewayInterface $gateway)
       {
           // ...
       }
   }
   ```

---

## 测试

### Mock Connector

```php
<?php

declare(strict_types=1);

use Saloon\Http\Faking\MockClient;
use Saloon\Http\Faking\MockResponse;

test('can create payment', function () {
    // 创建 Mock Client
    $mockClient = new MockClient([
        CreateChargeRequest::class => MockResponse::make([
            'id' => 'ch_123',
            'amount' => 1000,
            'status' => 'succeeded',
        ], 200),
    ]);

    // 使用 Mock Client
    $connector = new StripeConnector('test_key');
    $connector->withMockClient($mockClient);

    $request = new CreateChargeRequest(1000, 'usd', 'tok_visa');
    $response = $connector->send($request);

    expect($response->json())->toHaveKey('id');
});
```

---

## 相关文档

- [目录结构规范](../architecture/directory-structure.md)
- [依赖方向规则](../architecture/dependency-rules.md)
- [Pest 测试框架](./pest.md)
- [CI/CD 流水线](./ci-pipeline.md)

---

## 参考资源

- [Saloon 官方文档](https://docs.saloon.dev/)
- [Saloon GitHub](https://github.com/saloonphp/saloon)
- [Guzzle 文档](https://docs.guzzlephp.org/)

---

**最后更新 | Last Updated**: 2026-02-02
