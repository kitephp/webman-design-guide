# 微服务示例 | Microservices Example

> 基于 Webman 的微服务架构示例，展示如何拆分和组织微服务
> Microservices architecture example based on Webman, showing how to split and organize microservices

---

## 📋 目录 | Table of Contents

- [架构概览](#架构概览)
- [服务拆分](#服务拆分)
- [目录结构](#目录结构)
- [关键代码示例](#关键代码示例)
- [服务间通信](#服务间通信)

---

## 架构概览

### 微服务拆分原则 | Microservices Split Principles

1. **按业务领域拆分** - 基于限界上下文（Bounded Context）
2. **单一职责** - 每个服务只负责一个业务领域
3. **独立部署** - 服务可以独立开发、测试、部署
4. **数据独立** - 每个服务有自己的数据库

### 服务架构图 | Service Architecture

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

## 服务拆分

### 1. User Service (用户服务)

**职责**:
- 用户注册/登录
- 用户信息管理
- 认证和授权
- 用户权限管理

**端口**: 8001

### 2. Order Service (订单服务)

**职责**:
- 订单创建
- 订单状态管理
- 订单查询
- 库存扣减

**端口**: 8002

### 3. Payment Service (支付服务)

**职责**:
- 支付处理
- 退款处理
- 支付状态查询
- 支付网关集成

**端口**: 8003

### 4. API Gateway (API 网关)

**职责**:
- 路由转发
- 认证鉴权
- 限流熔断
- 日志监控

**端口**: 8000

---

## 目录结构

### 整体项目结构 | Overall Project Structure

```
microservices/
├─ gateway/                          # API 网关
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
├─ user-service/                     # 用户服务
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
│  │  │     └─ value_object/
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
├─ order-service/                    # 订单服务
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
│  │  │     └─ value_object/
│  │  │        ├─ OrderStatus.php
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
│  │     │  ├─ UserServiceClient.php      # 调用用户服务
│  │     │  └─ PaymentServiceClient.php   # 调用支付服务
│  │     └─ event/
│  │        └─ OrderEventPublisher.php
│  ├─ config/
│  │  ├─ database.php
│  │  └─ services.php                     # 服务地址配置
│  └─ start.php
│
├─ payment-service/                  # 支付服务
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
│  │  │     └─ value_object/
│  │  │        ├─ PaymentStatus.php
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
└─ shared/                           # 共享库
   ├─ src/
   │  ├─ event/
   │  │  ├─ EventBus.php
   │  │  └─ EventSubscriber.php
   │  ├─ http/
   │  │  └─ ServiceClient.php        # HTTP 客户端基类
   │  └─ value_object/
   │     └─ Money.php                # 共享值对象
   └─ composer.json
```

---

## 关键代码示例

### 1. 服务间通信 - HTTP 客户端基类

使用 [Saloon Integration](../tools/saloon.md) 实现服务间 HTTP 通信。

```php
<?php

declare(strict_types=1);

namespace shared\http;

use Saloon\Http\Connector;
use Saloon\Traits\Plugins\AcceptsJson;

/**
 * 服务客户端基类
 * Service Client Base Class
 */
abstract class ServiceClient extends Connector
{
    use AcceptsJson;

    abstract protected function getServiceName(): string;

    public function resolveBaseUrl(): string
    {
        // 从配置读取服务地址
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

### 2. 用户服务客户端

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\client;

use shared\http\ServiceClient;
use Saloon\Http\Response;

/**
 * 用户服务客户端
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

### 3. 获取用户请求

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\client\requests;

use Saloon\Enums\Method;
use Saloon\Http\Request;

/**
 * 获取用户请求
 * Get User Request
 */
final class GetUserRequest extends Request
{
    protected Method $method = Method::GET;

    public function __construct(
        private readonly int $userId
    ) {
    }

    public function resolveEndpoint(): string
    {
        return "/api/v1/users/{$this->userId}";
    }
}
```

### 4. 订单服务 - 创建订单

```php
<?php

declare(strict_types=1);

namespace app\service\order;

use app\contract\repository\OrderRepositoryInterface;
use app\contract\client\UserServiceClientInterface;
use app\contract\client\PaymentServiceClientInterface;
use app\domain\order\entity\Order;
use app\domain\order\value_object\Money;
use support\Db;

/**
 * 创建订单服务
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
            // 1. 调用用户服务验证用户
            if (!$this->userServiceClient->verifyUser($userId)) {
                throw new \RuntimeException('User not found or inactive');
            }

            // 2. 创建订单实体
            $order = Order::create(
                userId: $userId,
                items: $items,
                shippingAddress: $shippingAddress
            );

            // 3. 计算总金额
            $order->calculateTotal();

            // 4. 持久化订单
            $this->orderRepository->save($order);

            // 5. 调用支付服务创建支付
            $paymentResult = $this->paymentServiceClient->createPayment(
                orderId: $order->id(),
                amount: $order->totalAmount()->toDollars(),
                currency: 'USD'
            );

            // 6. 更新订单支付信息
            $order->setPaymentId($paymentResult['payment_id']);
            $this->orderRepository->save($order);

            return $order;
        });
    }
}
```

### 5. 事件总线 - 发布订阅模式

```php
<?php

declare(strict_types=1);

namespace shared\event;

use support\Redis;

/**
 * 事件总线
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

### 6. 订单事件发布器

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\event;

use shared\event\EventBus;
use app\domain\order\entity\Order;

/**
 * 订单事件发布器
 * Order Event Publisher
 */
final class OrderEventPublisher
{
    public function __construct(
        private readonly EventBus $eventBus
    ) {
    }

    public function publishOrderCreated(Order $order): void
    {
        $this->eventBus->publish('order.created', [
            'order_id' => $order->id(),
            'user_id' => $order->userId(),
            'total_amount' => $order->totalAmount()->toDollars(),
            'status' => $order->status()->value(),
        ]);
    }

    public function publishOrderPaid(Order $order): void
    {
        $this->eventBus->publish('order.paid', [
            'order_id' => $order->id(),
            'user_id' => $order->userId(),
            'payment_id' => $order->paymentId(),
        ]);
    }
}
```

### 7. 支付服务 - 监听订单事件

```php
<?php

declare(strict_types=1);

namespace app\process\subscriber;

use shared\event\EventBus;
use app\service\payment\ProcessPaymentService;

/**
 * 订单事件订阅器
 * Order Event Subscriber
 */
final class OrderEventSubscriber
{
    public function __construct(
        private readonly EventBus $eventBus,
        private readonly ProcessPaymentService $processPaymentService
    ) {
    }

    public function onWorkerStart(): void
    {
        // 订阅订单创建事件
        $this->eventBus->subscribe('order.created', function (array $payload) {
            $this->handleOrderCreated($payload);
        });
    }

    private function handleOrderCreated(array $payload): void
    {
        try {
            // 处理支付逻辑
            $this->processPaymentService->handle(
                orderId: $payload['order_id'],
                amount: $payload['total_amount']
            );

            logger()->info('Payment processed for order', [
                'order_id' => $payload['order_id'],
            ]);
        } catch (\Exception $e) {
            logger()->error('Failed to process payment', [
                'order_id' => $payload['order_id'],
                'error' => $e->getMessage(),
            ]);
        }
    }
}
```

### 8. API 网关 - 路由转发

```php
<?php

declare(strict_types=1);

namespace app\controller;

use support\Request;
use support\Response;
use GuzzleHttp\Client;

/**
 * 网关控制器
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
        // 1. 解析目标服务
        $service = $this->resolveService($request->path());

        if ($service === null) {
            return json(['error' => 'Service not found'], 404);
        }

        // 2. 获取服务地址
        $serviceUrl = config("services.{$service}.url");

        // 3. 转发请求
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

### 9. 服务配置文件

```php
<?php

declare(strict_types=1);

// config/services.php

return [
    'user-service' => [
        'url' => env('USER_SERVICE_URL', 'http://localhost:8001'),
        'timeout' => 30,
    ],

    'order-service' => [
        'url' => env('ORDER_SERVICE_URL', 'http://localhost:8002'),
        'timeout' => 30,
    ],

    'payment-service' => [
        'url' => env('PAYMENT_SERVICE_URL', 'http://localhost:8003'),
        'timeout' => 30,
    ],
];
```

### 10. 熔断器中间件

```php
<?php

declare(strict_types=1);

namespace app\middleware;

use Webman\MiddlewareInterface;
use Webman\Http\Response;
use Webman\Http\Request;
use support\Redis;

/**
 * 熔断器中间件
 * Circuit Breaker Middleware
 */
final class CircuitBreakerMiddleware implements MiddlewareInterface
{
    private const FAILURE_THRESHOLD = 5;
    private const TIMEOUT_SECONDS = 60;

    public function process(Request $request, callable $handler): Response
    {
        $service = $this->getServiceName($request);

        // 检查熔断器状态
        if ($this->isCircuitOpen($service)) {
            return json([
                'error' => 'Service temporarily unavailable',
                'service' => $service,
            ], 503);
        }

        try {
            $response = $handler($request);

            // 请求成功，重置失败计数
            if ($response->getStatusCode() < 500) {
                $this->recordSuccess($service);
            } else {
                $this->recordFailure($service);
            }

            return $response;
        } catch (\Exception $e) {
            // 请求失败，记录失败
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
        // 从请求路径解析服务名
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

## 服务间通信

### 1. 同步通信 - HTTP/REST

**使用场景**: 需要立即获取结果的操作

**实现方式**: 使用 [Saloon HTTP Client](../tools/saloon.md)

**优点**:
- 简单直观
- 易于调试
- 实时响应

**缺点**:
- 服务耦合
- 性能瓶颈
- 级联失败

### 2. 异步通信 - 消息队列

**使用场景**: 不需要立即响应的操作

**实现方式**: Redis Pub/Sub 或 RabbitMQ

**优点**:
- 服务解耦
- 削峰填谷
- 高可用

**缺点**:
- 复杂度高
- 最终一致性
- 调试困难

### 3. 事件驱动架构

**核心概念**:
- **事件发布**: 服务发布领域事件
- **事件订阅**: 其他服务订阅感兴趣的事件
- **事件处理**: 异步处理事件

**示例流程**:
```
1. 订单服务创建订单 → 发布 "order.created" 事件
2. 支付服务订阅事件 → 创建支付记录
3. 库存服务订阅事件 → 扣减库存
4. 通知服务订阅事件 → 发送通知
```

---

## 最佳实践

### 服务拆分

1. **按业务领域拆分**: 基于 DDD 的限界上下文
2. **避免过度拆分**: 不要为了微服务而微服务
3. **数据独立**: 每个服务独立数据库
4. **接口稳定**: 保持 API 向后兼容

### 服务治理

1. **服务注册与发现**: 使用 Consul 或 Etcd
2. **负载均衡**: 使用 Nginx 或服务网格
3. **熔断降级**: 防止级联失败
4. **限流保护**: 保护服务不被压垮

### 数据一致性

1. **最终一致性**: 使用事件驱动保证最终一致
2. **分布式事务**: 使用 Saga 模式
3. **补偿机制**: 失败时执行补偿操作
4. **幂等性**: 保证重复调用结果一致

### 监控和日志

1. **分布式追踪**: 使用 Request ID 追踪请求链路
2. **集中式日志**: 使用 ELK 收集日志
3. **性能监控**: 监控服务响应时间和错误率
4. **告警机制**: 及时发现和处理问题

### 部署和运维

1. **容器化**: 使用 Docker 容器化部署
2. **编排工具**: 使用 Kubernetes 编排
3. **CI/CD**: 自动化构建和部署
4. **灰度发布**: 逐步发布新版本

---

## 从单体到微服务的迁移

### 迁移策略

1. **绞杀者模式 (Strangler Pattern)**
   - 逐步将功能从单体迁移到微服务
   - 新功能直接在微服务中开发
   - 旧功能逐步重构迁移

2. **数据库拆分**
   - 先拆分应用，共享数据库
   - 再逐步拆分数据库
   - 使用事件同步数据

3. **API 网关**
   - 统一入口
   - 路由转发
   - 认证鉴权

### 迁移步骤

```
1. 识别限界上下文
   └─ 分析业务领域，划分服务边界

2. 提取共享库
   └─ 将通用代码提取到 shared 库

3. 拆分第一个服务
   └─ 选择耦合度低的模块先拆分

4. 实现服务间通信
   └─ HTTP 同步调用 + 事件异步通信

5. 拆分数据库
   └─ 每个服务独立数据库

6. 逐步迁移其他服务
   └─ 重复步骤 3-5

7. 下线单体应用
   └─ 所有功能迁移完成后下线
```

---

## 相关文档

- [Saloon Integration](../tools/saloon.md) - HTTP 客户端集成
- [目录结构规范](../architecture/directory-structure.md)
- [依赖方向规则](../architecture/dependency-rules.md)
- [支付网关集成](./payment-gateway.md) - 支付服务参考

---

**最后更新**: 2026-02-02
