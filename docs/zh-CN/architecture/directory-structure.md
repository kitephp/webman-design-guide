---
title: "目录结构规范"
description: "Webman 项目推荐的目录组织方式"
---

# 目录结构规范

> Webman 项目推荐的目录组织方式

---

## 目录

- [完整目录树](#完整目录树)
- [目录说明](#目录说明)
- [命名规则](#命名规则)
- [扩展性考虑](#扩展性考虑)

---

## 完整目录树

```
project-root/
├─ app/
│  ├─ controller/              # [Webman 默认] HTTP 控制器
│  │  ├─ api/                  # API 控制器
│  │  │  └─ v1/                # API 版本
│  │  └─ web/                  # Web 页面控制器
│  │
│  ├─ model/                   # [Webman 默认] ORM 模型（仅数据映射）
│  │  └─ eloquent/             # Eloquent 模型
│  │
│  ├─ middleware/              # [Webman 默认] 中间件
│  │  ├─ auth/                 # 认证相关
│  │  ├─ cors/                 # CORS 处理
│  │  └─ rate_limit/           # 限流
│  │
│  ├─ process/                 # [Webman 默认] 自定义进程
│  │  ├─ task/                 # 异步任务
│  │  └─ monitor/              # 监控进程
│  │
│  ├─ service/                 # [新增] 应用层服务
│  │  ├─ order/                # 订单相关用例
│  │  │  ├─ CreateOrderService.php
│  │  │  ├─ CancelOrderService.php
│  │  │  └─ RefundOrderService.php
│  │  ├─ user/                 # 用户相关用例
│  │  └─ payment/              # 支付相关用例
│  │
│  ├─ domain/                  # [新增] 领域层
│  │  ├─ order/                # 订单限界上下文
│  │  │  ├─ entity/            # 实体
│  │  │  │  ├─ Order.php
│  │  │  │  └─ OrderItem.php
│  │  │  ├─ enum/              # 枚举（固定选项）
│  │  │  │  ├─ OrderStatus.php
│  │  │  │  └─ PaymentMethod.php
│  │  │  ├─ vo/                # 值对象（需要验证/运算）
│  │  │  │  ├─ Money.php
│  │  │  │  └─ Address.php
│  │  │  ├─ event/             # 领域事件
│  │  │  │  ├─ OrderCreated.php
│  │  │  │  └─ OrderCancelled.php
│  │  │  └─ rule/              # 业务规则
│  │  │     └─ OrderCancellationRule.php
│  │  │
│  │  ├─ user/                 # 用户限界上下文
│  │  │  ├─ entity/
│  │  │  ├─ enum/
│  │  │  ├─ vo/
│  │  │  └─ event/
│  │  │
│  │  └─ shared/               # 共享领域概念
│  │     └─ vo/
│  │        ├─ Email.php
│  │        └─ PhoneNumber.php
│  │
│  ├─ contract/                # [新增] 接口定义
│  │  ├─ repository/           # 仓储接口
│  │  │  ├─ OrderRepositoryInterface.php
│  │  │  └─ UserRepositoryInterface.php
│  │  ├─ gateway/              # 外部服务网关接口
│  │  │  ├─ PaymentGatewayInterface.php
│  │  │  └─ SmsGatewayInterface.php
│  │  └─ service/              # 服务接口
│  │     └─ NotificationServiceInterface.php
│  │
│  ├─ infrastructure/          # [新增] 基础设施层
│  │  ├─ repository/           # 仓储实现
│  │  │  ├─ eloquent/          # Eloquent 实现
│  │  │  │  ├─ EloquentOrderRepository.php
│  │  │  │  └─ EloquentUserRepository.php
│  │  │  └─ redis/             # Redis 实现
│  │  │     └─ RedisSessionRepository.php
│  │  │
│  │  ├─ gateway/              # 外部服务适配器
│  │  │  ├─ payment/
│  │  │  │  ├─ StripePaymentGateway.php
│  │  │  │  └─ AlipayPaymentGateway.php
│  │  │  └─ sms/
│  │  │     └─ TwilioSmsGateway.php
│  │  │
│  │  ├─ persistence/          # 持久化相关
│  │  │  ├─ doctrine/          # Doctrine 配置
│  │  │  └─ migration/         # 数据库迁移
│  │  │
│  │  └─ cache/                # 缓存实现
│  │     └─ RedisCacheAdapter.php
│  │
│  ├─ support/                 # [新增] 通用支持类
│  │  ├─ helper/               # 辅助函数
│  │  │  └─ array_helper.php
│  │  ├─ trait/                # 可复用 Trait
│  │  │  └─ HasTimestamps.php
│  │  └─ exception/            # 自定义异常
│  │     ├─ BusinessException.php
│  │     └─ ValidationException.php
│  │
│  └─ view/                    # [Webman 默认] 视图文件
│     └─ index/
│
├─ config/                     # [Webman 默认] 配置文件
│  ├─ app.php
│  ├─ database.php
│  ├─ redis.php
│  ├─ container.php            # 依赖注入容器配置
│  └─ plugin/                  # 插件配置
│
├─ database/                   # 数据库相关
│  ├─ migrations/              # 迁移文件
│  ├─ seeders/                 # 数据填充
│  └─ factories/               # 模型工厂
│
├─ public/                     # [Webman 默认] 公共资源
│  ├─ index.php                # 入口文件
│  └─ static/                  # 静态资源
│
├─ runtime/                    # [Webman 默认] 运行时文件
│  ├─ logs/                    # 日志
│  └─ cache/                   # 缓存
│
├─ storage/                    # 存储目录
│  ├─ uploads/                 # 上传文件
│  └─ temp/                    # 临时文件
│
├─ tests/                      # 测试目录
│  ├─ Unit/                    # 单元测试
│  │  ├─ Domain/               # 领域层测试
│  │  └─ Service/              # 服务层测试
│  ├─ Feature/                 # 功能测试
│  │  └─ Api/                  # API 测试
│  └─ Pest.php                 # Pest 配置
│
├─ vendor/                     # Composer 依赖
├─ .env                        # 环境变量
├─ .env.example                # 环境变量示例
├─ composer.json               # Composer 配置
├─ phpstan.neon                # PHPStan 配置
├─ pint.json                   # Pint 配置
├─ rector.php                  # Rector 配置
└─ README.md                   # 项目说明
```

---

## 目录说明

### Webman 默认目录

这些目录保持 Webman 框架的默认结构，**不要修改**：

#### `app/controller/`
- **职责**：HTTP 请求入口，负责输入验证和输出格式化
- **原则**：薄控制器，不包含业务逻辑
- **依赖**：只依赖 `app/service/`

```php
<?php

declare(strict_types=1);

namespace app\controller\api\v1;

use app\service\order\CreateOrderService;
use support\Request;
use support\Response;

final class OrderController
{
    public function __construct(
        private readonly CreateOrderService $createOrderService
    ) {
    }

    public function create(Request $request): Response
    {
        // 1. 验证输入
        $validated = $this->validate($request, [
            'items' => 'required|array',
            'shipping_address' => 'required|array',
        ]);

        // 2. 调用服务层
        $order = $this->createOrderService->handle(
            userId: $request->user()->id,
            items: $validated['items'],
            shippingAddress: $validated['shipping_address']
        );

        // 3. 返回响应
        return json([
            'success' => true,
            'data' => $order->toArray(),
        ]);
    }
}
```

#### `app/model/`
- **职责**：ORM 模型，仅用于数据映射
- **原则**：不包含业务逻辑，只有数据访问
- **使用场景**：被 `infrastructure/repository/` 使用

```php
<?php

declare(strict_types=1);

namespace app\model\eloquent;

use Illuminate\Database\Eloquent\Model;

final class Order extends Model
{
    protected $table = 'orders';

    protected $fillable = [
        'user_id',
        'total_amount',
        'status',
        'shipping_address',
    ];

    protected $casts = [
        'shipping_address' => 'array',
        'total_amount' => 'decimal:2',
    ];
}
```

#### `app/middleware/`
- **职责**：请求/响应处理管道
- **分类**：认证、授权、CORS、限流、日志等

#### `app/process/`
- **职责**：自定义进程（队列、定时任务、监控等）
- **特点**：Webman 独有的进程管理能力

---

### 新增目录

#### `app/service/` - 应用层

**职责**：
- 用例编排（Use Case Orchestration）
- 事务管理
- 调用领域层和基础设施层
- 不包含业务规则（规则在 domain 层）

**命名规范**：
- 文件名：`{动词}{名词}Service.php`
- 示例：`CreateOrderService.php`, `CancelOrderService.php`

**代码示例**：

```php
<?php

declare(strict_types=1);

namespace app\service\order;

use app\contract\repository\OrderRepositoryInterface;
use app\contract\repository\UserRepositoryInterface;
use app\contract\gateway\PaymentGatewayInterface;
use app\domain\order\entity\Order;
use app\domain\order\vo\Money;
use app\domain\order\enum\OrderStatus;
use support\Db;

final class CreateOrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository,
        private readonly UserRepositoryInterface $userRepository,
        private readonly PaymentGatewayInterface $paymentGateway
    ) {
    }

    public function handle(int $userId, array $items, array $shippingAddress): Order
    {
        // 开启事务
        return Db::transaction(function () use ($userId, $items, $shippingAddress) {
            // 1. 获取用户（调用仓储）
            $user = $this->userRepository->findById($userId);

            // 2. 创建订单实体（调用领域层）
            $order = Order::create(
                userId: $user->id(),
                items: $items,
                shippingAddress: $shippingAddress
            );

            // 3. 应用业务规则（领域层负责）
            $order->calculateTotal();
            $order->validateInventory();

            // 4. 持久化（调用仓储）
            $this->orderRepository->save($order);

            // 5. 调用外部服务（支付网关）
            $this->paymentGateway->createPaymentIntent($order);

            return $order;
        });
    }
}
```

#### `app/domain/` - 领域层

**职责**：
- 核心业务逻辑
- 业务规则验证
- 领域事件
- **不依赖框架、不直接访问数据库**

**子目录结构**：
- `entity/` - 实体（有唯一标识）
- `enum/` - 枚举（固定选项集合）
- `vo/` - 值对象（需要验证/运算）
- `event/` - 领域事件
- `rule/` - 业务规则
- `exception/` - 领域异常

> **enum/** - 固定选项集合，如状态、类型、方法
> **vo/** - 需要验证、运算或多属性的值对象

**代码示例**：

```php
<?php

declare(strict_types=1);

namespace app\domain\order\entity;

use app\domain\order\vo\Money;
use app\domain\order\enum\OrderStatus;
use app\domain\order\event\OrderCreated;
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
        // 业务规则验证
        if (empty($items)) {
            throw new InvalidOrderException('Order must have at least one item');
        }

        $order = new self(
            id: 0, // 由仓储层分配
            userId: $userId,
            items: $items,
            totalAmount: Money::zero(),
            status: OrderStatus::Pending,
            createdAt: new \DateTimeImmutable()
        );

        // 触发领域事件
        $order->recordEvent(new OrderCreated($order));

        return $order;
    }

    public function calculateTotal(): void
    {
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
            throw new InvalidOrderException('Order cannot be cancelled in current status');
        }

        $this->status = OrderStatus::Cancelled;
        $this->recordEvent(new OrderCancelled($this));
    }

    // Getters
    public function id(): int
    {
        return $this->id;
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

**Enum 示例（OrderStatus）**：

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

**Value Object 示例（Money）**：

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
}
```

#### `app/contract/` - 接口定义

**职责**：
- 定义仓储接口
- 定义外部服务网关接口
- 定义服务契约

**命名规范**：
- 接口名：`{名词}Interface`
- 示例：`OrderRepositoryInterface`, `PaymentGatewayInterface`

**代码示例**：

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

#### `app/infrastructure/` - 基础设施层

**职责**：
- 实现仓储接口
- 实现外部服务适配器
- 数据库访问
- 缓存、消息队列等

**代码示例**：

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

    private function toDomain(OrderModel $model): Order
    {
        // 从数据库模型重建领域实体
        return Order::reconstitute(
            id: $model->id,
            userId: $model->user_id,
            totalAmount: Money::fromDollars($model->total_amount),
            status: OrderStatus::from($model->status),
            createdAt: new \DateTimeImmutable($model->created_at)
        );
    }

    public function nextIdentity(): int
    {
        return OrderModel::max('id') + 1;
    }
}
```

#### `app/support/` - 通用支持

**职责**：
- 辅助函数
- 可复用 Trait
- 自定义异常
- **不要当垃圾桶**：只放真正通用的代码

---

## 命名规则

### 目录命名

- **全部小写**：`app/domain/order/entity/`
- **使用下划线分隔**：`domain_event/`
- **不使用驼峰**：`domainEvent/` vs `domain_event/`

### 命名空间

- **跟随目录结构**：`app\domain\order\entity`
- **全部小写**：保持与目录一致
- **类名 StudlyCase**：`Order.php`, `OrderStatus.php`

### 文件命名

- **类文件**：`Order.php` (StudlyCase)
- **接口文件**：`OrderRepositoryInterface.php`
- **配置文件**：`database.php` (snake_case)
- **辅助函数**：`array_helper.php` (snake_case)

---

## 扩展性考虑

### 插件化

Webman 支持插件系统，未来可以将模块迁移到 `plugin/` 目录：

```
plugin/
└─ vendor/package/
   ├─ app/
   │  ├─ controller/
   │  ├─ service/
   │  └─ domain/
   └─ config/
```

### 微服务拆分

当需要拆分微服务时，按限界上下文拆分：

```
order-service/
├─ app/
│  ├─ domain/order/
│  ├─ service/order/
│  └─ infrastructure/

user-service/
├─ app/
│  ├─ domain/user/
│  ├─ service/user/
│  └─ infrastructure/
```

---

## 最佳实践

### DO

1. **保持 Webman 默认目录不变**
2. **目录全小写，类名 StudlyCase**
3. **按限界上下文组织 domain 目录**
4. **接口放 contract，实现放 infrastructure**
5. **service 层只编排，不写业务规则**

### DON'T

1. **不要在 controller 里写业务逻辑**
2. **不要在 domain 里依赖框架类**
3. **不要在 model 里写业务规则**
4. **不要把 support 当垃圾桶**
5. **不要混用大小写目录名**

---

## 相关文档

- [依赖方向规则](./dependency-rules)
- [命名规范](./naming-conventions)
- [分层职责](./layer-responsibilities)
