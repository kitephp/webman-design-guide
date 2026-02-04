---
title: "Microservices Example"
description: "Microservices architecture example based on Webman, showing how to split and organize microservices"
---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Service Split](#service-split)
- [Directory Structure](#directory-structure)
- [Key Code Examples](#key-code-examples)
- [Inter-Service Communication](#inter-service-communication)

---

## Architecture Overview

### Microservices Split Principles

1. **Split by Business Domain** - Based on Bounded Context
2. **Single Responsibility** - Each service handles only one business domain
3. **Independent Deployment** - Services can be developed, tested, and deployed independently
4. **Data Independence** - Each service has its own database

### Service Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     API Gateway                          │
│                   (Webman Gateway)                       │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ User Service │  │Order Service │  │Payment Service│
│  (Webman)    │  │  (Webman)    │  │  (Webman)     │
└──────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   MySQL      │  │   MySQL      │  │   MySQL      │
│  (Users DB)  │  │ (Orders DB)  │  │(Payments DB) │
└──────────────┘  └──────────────┘  └──────────────┘

        ┌─────────────────────────────┐
        │   Message Queue (Redis)     │
        │   Event Bus / RPC           │
        └─────────────────────────────┘
```

---

## Service Split

### 1. User Service

**Responsibilities**:
- User registration/login
- User information management
- Authentication and authorization
- User permission management

**Port**: 8001

### 2. Order Service

**Responsibilities**:
- Order creation
- Order status management
- Order query
- Inventory deduction

**Port**: 8002

### 3. Payment Service

**Responsibilities**:
- Payment processing
- Refund processing
- Payment status query
- Payment gateway integration

**Port**: 8003

### 4. API Gateway

**Responsibilities**:
- Route forwarding
- Authentication
- Rate limiting and circuit breaking
- Logging and monitoring

**Port**: 8000

---

## Directory Structure

### Overall Project Structure

```
microservices/
├─ gateway/                          # API Gateway
│  ├─ app/
│  │  ├─ controller/
│  │  │  └─ GatewayController.php
│  │  ├─ middleware/
│  │  │  ├─ AuthMiddleware.php
│  │  │  ├─ RateLimitMiddleware.php
│  │  │  └─ CircuitBreakerMiddleware.php
│  │  └─ service/
│  │     ├─ RouteService.php
│  │     └─ LoadBalancerService.php
│  ├─ config/
│  └─ start.php
│
├─ user-service/                     # User Service
│  ├─ app/
│  │  ├─ controller/
│  │  │  └─ api/
│  │  │     └─ v1/
│  │  │        ├─ UserController.php
│  │  │        └─ AuthController.php
│  │  ├─ service/
│  │  │  ├─ user/
│  │  │  │  ├─ CreateUserService.php
│  │  │  │  └─ UpdateUserService.php
│  │  │  └─ auth/
│  │  │     ├─ LoginService.php
│  │  │     └─ RegisterService.php
│  │  ├─ domain/
│  │  │  └─ user/
│  │  │     ├─ entity/
│  │  │     │  └─ User.php
│  │  │     └─ vo/                       # Value Objects
│  │  │        ├─ Email.php
│  │  │        └─ Password.php
│  │  ├─ contract/
│  │  │  └─ repository/
│  │  │     └─ UserRepositoryInterface.php
│  │  └─ infrastructure/
│  │     ├─ repository/
│  │     │  └─ eloquent/
│  │     │     └─ EloquentUserRepository.php
│  │     └─ event/
│  │        └─ UserEventPublisher.php
│  ├─ config/
│  │  └─ database.php
│  └─ start.php
│
├─ order-service/                    # Order Service
│  ├─ app/
│  │  ├─ controller/
│  │  │  └─ api/
│  │  │     └─ v1/
│  │  │        └─ OrderController.php
│  │  ├─ service/
│  │  │  └─ order/
│  │  │     ├─ CreateOrderService.php
│  │  │     └─ CancelOrderService.php
│  │  ├─ domain/
│  │  │  └─ order/
│  │  │     ├─ entity/
│  │  │     │  └─ Order.php
│  │  │     ├─ enum/                     # Enums
│  │  │     │  └─ OrderStatus.php
│  │  │     └─ vo/                       # Value Objects
│  │  │        └─ Money.php
│  │  ├─ contract/
│  │  │  ├─ repository/
│  │  │  │  └─ OrderRepositoryInterface.php
│  │  │  └─ client/
│  │  │     ├─ UserServiceClientInterface.php
│  │  │     └─ PaymentServiceClientInterface.php
│  │  └─ infrastructure/
│  │     ├─ repository/
│  │     │  └─ eloquent/
│  │     │     └─ EloquentOrderRepository.php
│  │     ├─ client/
│  │     │  ├─ UserServiceClient.php      # Call user service
│  │     │  └─ PaymentServiceClient.php   # Call payment service
│  │     └─ event/
│  │        └─ OrderEventPublisher.php
│  ├─ config/
│  │  ├─ database.php
│  │  └─ services.php                     # Service address config
│  └─ start.php
│
├─ payment-service/                  # Payment Service
│  ├─ app/
│  │  ├─ controller/
│  │  │  └─ api/
│  │  │     └─ v1/
│  │  │        └─ PaymentController.php
│  │  ├─ service/
│  │  │  └─ payment/
│  │  │     ├─ CreatePaymentService.php
│  │  │     └─ ProcessPaymentService.php
│  │  ├─ domain/
│  │  │  └─ payment/
│  │  │     ├─ entity/
│  │  │     │  └─ Payment.php
│  │  │     ├─ enum/                     # Enums
│  │  │     │  └─ PaymentStatus.php
│  │  │     └─ vo/                       # Value Objects
│  │  │        └─ Money.php
│  │  ├─ contract/
│  │  │  ├─ repository/
│  │  │  │  └─ PaymentRepositoryInterface.php
│  │  │  └─ gateway/
│  │  │     └─ PaymentGatewayInterface.php
│  │  └─ infrastructure/
│  │     ├─ repository/
│  │     │  └─ eloquent/
│  │     │     └─ EloquentPaymentRepository.php
│  │     ├─ gateway/
│  │     │  └─ stripe/
│  │     │     └─ StripePaymentGateway.php
│  │     └─ event/
│  │        └─ PaymentEventPublisher.php
│  ├─ config/
│  │  └─ database.php
│  └─ start.php
│
└─ shared/                           # Shared Library
   ├─ src/
   │  ├─ event/
   │  │  ├─ EventBus.php
   │  │  └─ EventSubscriber.php
   │  ├─ http/
   │  │  └─ ServiceClient.php        # HTTP client base class
   │  └─ vo/
   │     └─ Money.php                # Shared value object
   └─ composer.json
```

---

## Key Code Examples

### 1. Inter-Service Communication - HTTP Client Base Class

```php
<?php

declare(strict_types=1);

namespace shared\http;

use Saloon\Http\Connector;
use Saloon\Traits\Plugins\AcceptsJson;

/**
 * Service Client Base Class
 */
abstract class ServiceClient extends Connector
{
    use AcceptsJson;

    abstract protected function getServiceName(): string;

    public function resolveBaseUrl(): string
    {
        // Read service address from config
        $services = config('services');
        $serviceName = $this->getServiceName();

        if (!isset($services[$serviceName])) {
            throw new \RuntimeException("Service {$serviceName} not configured");
        }

        return $services[$serviceName]['url'];
    }

    protected function defaultHeaders(): array
    {
        return [
            'X-Service-Name' => config('app.name'),
            'X-Request-Id' => $this->generateRequestId(),
        ];
    }

    private function generateRequestId(): string
    {
        return uniqid('req_', true);
    }
}
```

### 2. User Service Client

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\client;

use shared\http\ServiceClient;

/**
 * User Service Client
 */
final class UserServiceClient extends ServiceClient
{
    protected function getServiceName(): string
    {
        return 'user-service';
    }

    public function getUserById(int $userId): ?array
    {
        $response = $this->send(
            new \app\infrastructure\client\requests\GetUserRequest($userId)
        );

        if (!$response->successful()) {
            return null;
        }

        return $response->json('data');
    }

    public function verifyUser(int $userId): bool
    {
        $response = $this->send(
            new \app\infrastructure\client\requests\VerifyUserRequest($userId)
        );

        return $response->successful();
    }
}
```

### 3. Order Service - Create Order

```php
<?php

declare(strict_types=1);

namespace app\service\order;

use app\contract\repository\OrderRepositoryInterface;
use app\contract\client\UserServiceClientInterface;
use app\contract\client\PaymentServiceClientInterface;
use app\domain\order\entity\Order;
use support\Db;

/**
 * Create Order Service
 */
final class CreateOrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository,
        private readonly UserServiceClientInterface $userServiceClient,
        private readonly PaymentServiceClientInterface $paymentServiceClient
    ) {
    }

    public function handle(
        int $userId,
        array $items,
        array $shippingAddress
    ): Order {
        return Db::transaction(function () use ($userId, $items, $shippingAddress) {
            // 1. Call user service to verify user
            if (!$this->userServiceClient->verifyUser($userId)) {
                throw new \RuntimeException('User not found or inactive');
            }

            // 2. Create order entity
            $order = Order::create(
                userId: $userId,
                items: $items,
                shippingAddress: $shippingAddress
            );

            // 3. Calculate total amount
            $order->calculateTotal();

            // 4. Persist order
            $this->orderRepository->save($order);

            // 5. Call payment service to create payment
            $paymentResult = $this->paymentServiceClient->createPayment(
                orderId: $order->id(),
                amount: $order->totalAmount()->toDollars(),
                currency: 'USD'
            );

            // 6. Update order payment info
            $order->setPaymentId($paymentResult['payment_id']);
            $this->orderRepository->save($order);

            return $order;
        });
    }
}
```

### 4. Event Bus - Publish/Subscribe Pattern

```php
<?php

declare(strict_types=1);

namespace shared\event;

use support\Redis;

/**
 * Event Bus
 */
final class EventBus
{
    private const CHANNEL_PREFIX = 'events:';

    public function publish(string $eventName, array $payload): void
    {
        $channel = self::CHANNEL_PREFIX . $eventName;

        $message = json_encode([
            'event' => $eventName,
            'payload' => $payload,
            'timestamp' => time(),
            'service' => config('app.name'),
        ]);

        Redis::publish($channel, $message);
    }

    public function subscribe(string $eventName, callable $handler): void
    {
        $channel = self::CHANNEL_PREFIX . $eventName;

        Redis::subscribe([$channel], function ($redis, $channel, $message) use ($handler) {
            $data = json_decode($message, true);
            $handler($data['payload']);
        });
    }
}
```

### 5. API Gateway - Route Forwarding

```php
<?php

declare(strict_types=1);

namespace app\controller;

use support\Request;
use support\Response;
use GuzzleHttp\Client;

/**
 * Gateway Controller
 */
final class GatewayController
{
    private array $serviceMap = [
        '/api/users' => 'user-service',
        '/api/orders' => 'order-service',
        '/api/payments' => 'payment-service',
    ];

    public function __construct(
        private readonly Client $httpClient
    ) {
    }

    public function forward(Request $request): Response
    {
        // 1. Resolve target service
        $service = $this->resolveService($request->path());

        if ($service === null) {
            return json(['error' => 'Service not found'], 404);
        }

        // 2. Get service address
        $serviceUrl = config("services.{$service}.url");

        // 3. Forward request
        try {
            $response = $this->httpClient->request(
                $request->method(),
                $serviceUrl . $request->path(),
                [
                    'headers' => $this->forwardHeaders($request),
                    'json' => $request->all(),
                    'timeout' => 30,
                ]
            );

            return response(
                $response->getBody()->getContents(),
                $response->getStatusCode()
            );
        } catch (\Exception $e) {
            logger()->error('Gateway forward failed', [
                'service' => $service,
                'path' => $request->path(),
                'error' => $e->getMessage(),
            ]);

            return json(['error' => 'Service unavailable'], 503);
        }
    }

    private function resolveService(string $path): ?string
    {
        foreach ($this->serviceMap as $prefix => $service) {
            if (str_starts_with($path, $prefix)) {
                return $service;
            }
        }

        return null;
    }

    private function forwardHeaders(Request $request): array
    {
        return [
            'Authorization' => $request->header('Authorization'),
            'X-Request-Id' => $request->header('X-Request-Id', uniqid('req_')),
            'X-Forwarded-For' => $request->getRealIp(),
        ];
    }
}
```

### 6. Circuit Breaker Middleware

```php
<?php

declare(strict_types=1);

namespace app\middleware;

use Webman\MiddlewareInterface;
use Webman\Http\Response;
use Webman\Http\Request;
use support\Redis;

/**
 * Circuit Breaker Middleware
 */
final class CircuitBreakerMiddleware implements MiddlewareInterface
{
    private const FAILURE_THRESHOLD = 5;
    private const TIMEOUT_SECONDS = 60;

    public function process(Request $request, callable $handler): Response
    {
        $service = $this->getServiceName($request);

        // Check circuit breaker status
        if ($this->isCircuitOpen($service)) {
            return json([
                'error' => 'Service temporarily unavailable',
                'service' => $service,
            ], 503);
        }

        try {
            $response = $handler($request);

            // Request successful, reset failure count
            if ($response->getStatusCode() < 500) {
                $this->recordSuccess($service);
            } else {
                $this->recordFailure($service);
            }

            return $response;
        } catch (\Exception $e) {
            // Request failed, record failure
            $this->recordFailure($service);
            throw $e;
        }
    }

    private function isCircuitOpen(string $service): bool
    {
        $key = "circuit_breaker:{$service}:failures";
        $failures = (int) Redis::get($key);

        return $failures >= self::FAILURE_THRESHOLD;
    }

    private function recordFailure(string $service): void
    {
        $key = "circuit_breaker:{$service}:failures";
        Redis::incr($key);
        Redis::expire($key, self::TIMEOUT_SECONDS);
    }

    private function recordSuccess(string $service): void
    {
        $key = "circuit_breaker:{$service}:failures";
        Redis::del($key);
    }

    private function getServiceName(Request $request): string
    {
        $path = $request->path();

        if (str_starts_with($path, '/api/users')) {
            return 'user-service';
        }

        if (str_starts_with($path, '/api/orders')) {
            return 'order-service';
        }

        if (str_starts_with($path, '/api/payments')) {
            return 'payment-service';
        }

        return 'unknown';
    }
}
```

---

## Inter-Service Communication

### 1. Synchronous Communication - HTTP/REST

**Use Cases**: Operations that require immediate results

**Advantages**:
- Simple and intuitive
- Easy to debug
- Real-time response

**Disadvantages**:
- Service coupling
- Performance bottleneck
- Cascading failures

### 2. Asynchronous Communication - Message Queue

**Use Cases**: Operations that don't require immediate response

**Implementation**: Redis Pub/Sub or RabbitMQ

**Advantages**:
- Service decoupling
- Peak shaving
- High availability

**Disadvantages**:
- Higher complexity
- Eventual consistency
- Difficult to debug

### 3. Event-Driven Architecture

**Core Concepts**:
- **Event Publishing**: Services publish domain events
- **Event Subscription**: Other services subscribe to events of interest
- **Event Processing**: Asynchronous event handling

**Example Flow**:
```
1. Order service creates order -> Publish "order.created" event
2. Payment service subscribes -> Create payment record
3. Inventory service subscribes -> Deduct inventory
4. Notification service subscribes -> Send notification
```

---

## Best Practices

### Service Split

1. **Split by Business Domain**: Based on DDD bounded contexts
2. **Avoid Over-splitting**: Don't microservice for the sake of microservices
3. **Data Independence**: Each service has independent database
4. **Interface Stability**: Keep APIs backward compatible

### Service Governance

1. **Service Registration & Discovery**: Use Consul or Etcd
2. **Load Balancing**: Use Nginx or service mesh
3. **Circuit Breaking & Degradation**: Prevent cascading failures
4. **Rate Limiting**: Protect services from being overwhelmed

### Data Consistency

1. **Eventual Consistency**: Use event-driven to ensure eventual consistency
2. **Distributed Transactions**: Use Saga pattern
3. **Compensation Mechanism**: Execute compensation on failure
4. **Idempotency**: Ensure consistent results on repeated calls

### Monitoring and Logging

1. **Distributed Tracing**: Use Request ID to trace request chain
2. **Centralized Logging**: Use ELK to collect logs
3. **Performance Monitoring**: Monitor service response time and error rate
4. **Alerting**: Timely detection and handling of issues

---

## Related Documentation

- [Saloon Integration](/en/tools/saloon)
- [Directory Structure Standards](/en/architecture/directory-structure)
- [Dependency Direction Rules](/en/architecture/dependency-rules)
- [Payment Gateway Integration](/en/examples/payment-gateway)
