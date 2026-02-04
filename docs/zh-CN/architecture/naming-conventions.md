---
title: "命名规范"
description: "统一的命名规范提升代码可读性和可维护性"
---

# 命名规范

> 统一的命名规范提升代码可读性和可维护性

---

## 目录

- [目录命名](#目录命名)
- [命名空间命名](#命名空间命名)
- [类命名](#类命名)
- [接口命名](#接口命名)
- [Service 命名](#service-命名)
- [Repository 命名](#repository-命名)
- [变量和方法命名](#变量和方法命名)
- [常量命名](#常量命名)

---

## 目录命名

### 规则

- **全部小写** (lowercase)
- **使用下划线分隔** (underscore-separated)
- **不使用驼峰** (no camelCase)
- **语义清晰** (clear semantics)

### 示例

```
正确示例
app/
├─ controller/
├─ service/
├─ domain/
│  ├─ order/
│  │  ├─ entity/
│  │  ├─ enum/                 枚举目录
│  │  ├─ vo/                   值对象目录
│  │  ├─ domain_event/         下划线分隔
│  │  └─ exception/
│  └─ user/
├─ contract/
│  ├─ repository/
│  └─ gateway/
├─ infrastructure/
│  ├─ repository/
│  │  ├─ eloquent/
│  │  └─ redis/
│  └─ gateway/
│     ├─ payment/
│     └─ sms/
└─ support/
   ├─ helper/
   └─ trait/

错误示例
app/
├─ Controller/                   首字母大写
├─ valueObject/                  驼峰命名
├─ domainEvent/                  驼峰命名
├─ PaymentGateway/               首字母大写
└─ helperFunctions/              驼峰命名
```

### 常见目录名称

| 目录用途 | 正确命名 | 错误命名 |
|---------|---------|---------|
| 枚举 | `enum/` | `Enum/`, `enums/` |
| 值对象 | `vo/` | `valueObject/`, `ValueObject/` |
| 领域事件 | `domain_event/` | `domainEvent/`, `DomainEvent/` |
| 外部网关 | `gateway/` | `Gateway/`, `gateways/` |
| 仓储实现 | `repository/` | `Repository/`, `repositories/` |
| 辅助函数 | `helper/` | `Helper/`, `helpers/` |
| 自定义异常 | `exception/` | `Exception/`, `exceptions/` |

---

## 命名空间命名

### 规则

- **跟随目录结构** (follow directory structure)
- **全部小写** (lowercase)
- **使用反斜杠分隔** (backslash separator)
- **与目录名完全一致** (match directory names exactly)

### 示例

```php
<?php

// 正确示例
namespace app\controller\api\v1;
namespace app\service\order;
namespace app\domain\order\entity;
namespace app\domain\order\enum;
namespace app\domain\order\vo;
namespace app\contract\repository;
namespace app\infrastructure\repository\eloquent;
namespace app\infrastructure\gateway\payment;
namespace app\support\helper;

// 错误示例
namespace App\Controller\Api\V1;              // 首字母大写
namespace app\service\Order;                  // Order 大写
namespace app\domain\order\valueObject;       // 驼峰命名
namespace app\infrastructure\PaymentGateway;  // 驼峰命名
```

### 命名空间与目录对应关系

```
目录路径                                    命名空间
app/controller/api/v1/          →          app\controller\api\v1
app/service/order/              →          app\service\order
app/domain/order/entity/        →          app\domain\order\entity
app/domain/order/enum/          →          app\domain\order\enum
app/domain/order/vo/            →          app\domain\order\vo
app/contract/repository/        →          app\contract\repository
app/infrastructure/repository/  →          app\infrastructure\repository
```

---

## 类命名

### 规则

- **StudlyCase** (首字母大写的驼峰)
- **单数形式** (singular form)
- **语义明确** (clear semantics)
- **一个文件一个类** (one class per file)

### 实体类 (Entity)

```php
<?php

declare(strict_types=1);

namespace app\domain\order\entity;

// 正确示例
final class Order { }
final class OrderItem { }
final class User { }
final class Product { }

// 错误示例
final class order { }           // 小写
final class ORDER { }           // 全大写
final class Orders { }          // 复数形式
final class order_entity { }    // 下划线分隔
```

### 枚举 (Enum) 和值对象 (Value Object)

> **enum/** - 固定选项集合，如状态、类型、方法
> **vo/** - 需要验证、运算或多属性的值对象

```php
<?php

declare(strict_types=1);

namespace app\domain\order\enum;

// Enum 示例 - 固定状态选项
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
}
```

```php
<?php

declare(strict_types=1);

namespace app\domain\order\vo;

// Value Object 示例 - 需要数学运算
final class Money { }

// Value Object 示例 - 多属性组合
final class Address { }

// Value Object 示例 - 需要验证逻辑
final class Email { }
final class PhoneNumber { }

// 错误示例
final class money { }           // 小写
final class order_status { }    // 下划线分隔
```

### 领域事件 (Domain Event)

```php
<?php

declare(strict_types=1);

namespace app\domain\order\event;

// 正确示例 - 过去式
final class OrderCreated { }
final class OrderCancelled { }
final class OrderShipped { }
final class PaymentReceived { }

// 错误示例
final class CreateOrder { }     // 动词原形
final class OrderCreate { }     // 动词原形
final class OrderCreatedEvent { }  // 可以，但 Event 后缀冗余
```

### 异常类 (Exception)

```php
<?php

declare(strict_types=1);

namespace app\domain\order\exception;

// 正确示例 - Exception 后缀
final class InvalidOrderException extends \Exception { }
final class OrderNotFoundException extends \Exception { }
final class InsufficientInventoryException extends \Exception { }

// 错误示例
final class InvalidOrder { }    // 缺少 Exception 后缀
final class OrderError { }      // 使用 Error 而非 Exception
```

---

## 接口命名

### 规则

- **Interface 后缀** (Interface suffix)
- **描述能力或职责** (describe capability or responsibility)
- **StudlyCase**

### Repository 接口

```php
<?php

declare(strict_types=1);

namespace app\contract\repository;

// 正确示例
interface OrderRepositoryInterface { }
interface UserRepositoryInterface { }
interface ProductRepositoryInterface { }

// 错误示例
interface OrderRepository { }           // 缺少 Interface 后缀
interface IOrderRepository { }          // 使用 I 前缀（C# 风格）
interface OrderRepositoryContract { }   // 使用 Contract 后缀
```

### Gateway 接口

```php
<?php

declare(strict_types=1);

namespace app\contract\gateway;

// 正确示例
interface PaymentGatewayInterface { }
interface SmsGatewayInterface { }
interface EmailGatewayInterface { }
interface StorageGatewayInterface { }

// 错误示例
interface PaymentGateway { }            // 缺少 Interface 后缀
interface IPaymentGateway { }           // 使用 I 前缀
```

### Service 接口

```php
<?php

declare(strict_types=1);

namespace app\contract\service;

// 正确示例
interface NotificationServiceInterface { }
interface CacheServiceInterface { }
interface LoggerServiceInterface { }

// 错误示例
interface NotificationService { }       // 缺少 Interface 后缀
interface INotificationService { }      // 使用 I 前缀
```

---

## Service 命名

### 规则

- **`{动词}{名词}Service`** 模式
- **描述用例** (describe use case)
- **单一职责** (single responsibility)

### 命名模式

```php
<?php

declare(strict_types=1);

namespace app\service\order;

// 正确示例 - 动词+名词+Service
final class CreateOrderService { }
final class CancelOrderService { }
final class UpdateOrderService { }
final class RefundOrderService { }
final class GetOrderService { }
final class ListOrdersService { }

// 错误示例
final class OrderService { }            // 太宽泛，职责不明确
final class OrderCreator { }            // 缺少 Service 后缀
final class OrderCreateService { }      // 名词在前
final class CreateOrder { }             // 缺少 Service 后缀
```

### 常用动词

| 动作 | 英文动词 | 示例 |
|------|---------|------|
| 创建 | Create | `CreateOrderService` |
| 更新 | Update | `UpdateOrderService` |
| 删除 | Delete | `DeleteOrderService` |
| 取消 | Cancel | `CancelOrderService` |
| 获取单个 | Get | `GetOrderService` |
| 获取列表 | List | `ListOrdersService` |
| 搜索 | Search | `SearchOrdersService` |
| 导出 | Export | `ExportOrdersService` |
| 导入 | Import | `ImportOrdersService` |
| 发送 | Send | `SendNotificationService` |
| 处理 | Process | `ProcessPaymentService` |
| 验证 | Validate | `ValidateOrderService` |
| 计算 | Calculate | `CalculateTotalService` |

### 完整示例

```php
<?php

declare(strict_types=1);

namespace app\service\order;

use app\contract\repository\OrderRepositoryInterface;
use app\domain\order\entity\Order;

// 正确示例 - 清晰的用例名称
final class CreateOrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository
    ) {
    }

    public function handle(int $userId, array $items, array $shippingAddress): Order
    {
        $order = Order::create($userId, $items, $shippingAddress);
        $this->orderRepository->save($order);
        return $order;
    }
}
```

---

## Repository 命名

### 接口命名

```php
<?php

declare(strict_types=1);

namespace app\contract\repository;

// 正确示例
interface OrderRepositoryInterface { }
interface UserRepositoryInterface { }
interface ProductRepositoryInterface { }
```

### 实现类命名

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\repository\eloquent;

// 正确示例 - `{实现方式}{实体名}Repository`
final class EloquentOrderRepository implements OrderRepositoryInterface { }
final class EloquentUserRepository implements UserRepositoryInterface { }
final class EloquentProductRepository implements ProductRepositoryInterface { }

// Redis 实现
namespace app\infrastructure\repository\redis;

final class RedisSessionRepository implements SessionRepositoryInterface { }
final class RedisCacheRepository implements CacheRepositoryInterface { }

// 错误示例
final class OrderRepository { }         // 缺少实现方式前缀
final class OrderEloquentRepository { } // 顺序错误
final class EloquentOrder { }           // 缺少 Repository 后缀
```

### Repository 方法命名

```php
<?php

declare(strict_types=1);

namespace app\contract\repository;

use app\domain\order\entity\Order;

interface OrderRepositoryInterface
{
    // 正确示例 - 清晰的方法名
    public function findById(int $id): ?Order;
    public function findByUserId(int $userId): array;
    public function findByStatus(string $status): array;
    public function save(Order $order): void;
    public function delete(Order $order): void;
    public function exists(int $id): bool;
    public function count(): int;
    public function nextIdentity(): int;

    // 错误示例
    public function get(int $id): ?Order;           // 不够明确
    public function getById(int $id): ?Order;       // 可以，但 find 更常用
    public function getByUser(int $userId): array;  // 可以，但 find 更常用
    public function persist(Order $order): void;    // 使用 save 更直观
    public function remove(Order $order): void;     // 可以，但 delete 更直观
}
```

---

## 变量和方法命名

### 变量命名

```php
<?php

declare(strict_types=1);

// 正确示例 - camelCase
$userId = 1;
$orderItems = [];
$shippingAddress = [];
$totalAmount = 0;
$isActive = true;
$hasPermission = false;

// 错误示例
$user_id = 1;               // 下划线分隔（PHP 传统风格，但不符合 PER）
$UserID = 1;                // 首字母大写
$USERID = 1;                // 全大写
$order_items = [];          // 下划线分隔
```

### 方法命名

```php
<?php

declare(strict_types=1);

namespace app\domain\order\entity;

final class Order
{
    // 正确示例 - camelCase
    public function calculateTotal(): void { }
    public function validateInventory(): void { }
    public function canBeCancelled(): bool { }
    public function isExpired(): bool { }
    public function hasItems(): bool { }

    // Getter 方法 - 不使用 get 前缀
    public function id(): int { }
    public function userId(): int { }
    public function totalAmount(): Money { }
    public function status(): OrderStatus { }

    // 错误示例
    public function CalculateTotal(): void { }      // 首字母大写
    public function calculate_total(): void { }     // 下划线分隔
    public function getId(): int { }                // 可以，但不推荐（冗余）
    public function getUserId(): int { }            // 可以，但不推荐（冗余）
}
```

### 布尔方法命名

```php
<?php

declare(strict_types=1);

// 正确示例 - 使用 is/has/can/should 前缀
public function isActive(): bool { }
public function isExpired(): bool { }
public function hasPermission(): bool { }
public function hasItems(): bool { }
public function canBeCancelled(): bool { }
public function canBeRefunded(): bool { }
public function shouldNotify(): bool { }
public function shouldRetry(): bool { }

// 错误示例
public function active(): bool { }              // 不清晰
public function expired(): bool { }             // 不清晰
public function checkPermission(): bool { }     // check 不如 has 清晰
```

---

## 常量命名

### 类常量

```php
<?php

declare(strict_types=1);

namespace app\domain\order\enum;

// 正确示例 - UPPER_SNAKE_CASE（用于传统常量类）
final class PaymentMethod
{
    public const CREDIT_CARD = 'credit_card';
    public const BANK_TRANSFER = 'bank_transfer';
    public const ALIPAY = 'alipay';
    public const WECHAT_PAY = 'wechat_pay';
}

// 推荐示例 - 使用 PHP 8.1+ Enum 替代常量类
enum PaymentMethod: string
{
    case CreditCard = 'credit_card';
    case BankTransfer = 'bank_transfer';
    case Alipay = 'alipay';
    case WechatPay = 'wechat_pay';
}

// 错误示例
final class PaymentMethod
{
    public const creditCard = 'credit_card';    // 小写
    public const CreditCard = 'credit_card';    // 驼峰
}
```

### 配置常量

```php
<?php

declare(strict_types=1);

// config/app.php

return [
    // 正确示例 - snake_case (配置文件使用下划线)
    'app_name' => 'Webman App',
    'app_debug' => true,
    'default_timezone' => 'Asia/Shanghai',
    'max_upload_size' => 10 * 1024 * 1024,

    // 错误示例
    'appName' => 'Webman App',              // 驼峰
    'AppDebug' => true,                     // 首字母大写
    'DEFAULT_TIMEZONE' => 'Asia/Shanghai',  // 全大写
];
```

---

## 完整示例

### 订单模块命名示例

```
app/domain/order/
├─ entity/
│  ├─ Order.php                          # 实体类 - StudlyCase
│  └─ OrderItem.php
├─ enum/                                 # 枚举目录
│  ├─ OrderStatus.php                    # Enum - 固定状态选项
│  └─ PaymentMethod.php                  # Enum - 支付方式
├─ vo/                                   # 值对象目录
│  ├─ Money.php                          # Value Object - 需要数学运算
│  └─ Address.php                        # Value Object - 多属性组合
├─ event/
│  ├─ OrderCreated.php                   # 事件 - 过去式
│  ├─ OrderCancelled.php
│  └─ OrderShipped.php
├─ exception/
│  ├─ InvalidOrderException.php          # 异常 - Exception 后缀
│  └─ OrderNotFoundException.php
└─ rule/
   └─ OrderCancellationRule.php          # 规则 - Rule 后缀
```

### 完整类示例

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
    // 常量 - UPPER_SNAKE_CASE
    private const MIN_ITEMS = 1;
    private const MAX_ITEMS = 100;

    private array $domainEvents = [];

    // 构造函数参数 - camelCase
    private function __construct(
        private readonly int $id,
        private readonly int $userId,
        private array $items,
        private Money $totalAmount,
        private OrderStatus $status,
        private readonly \DateTimeImmutable $createdAt
    ) {
    }

    // 静态工厂方法 - camelCase
    public static function create(
        int $userId,
        array $items,
        array $shippingAddress
    ): self {
        if (empty($items)) {
            throw new InvalidOrderException('Order must have at least one item');
        }

        $order = new self(
            id: 0,
            userId: $userId,
            items: $items,
            totalAmount: Money::zero(),
            status: OrderStatus::Pending,
            createdAt: new \DateTimeImmutable()
        );

        $order->recordEvent(new OrderCreated($order));

        return $order;
    }

    // 业务方法 - camelCase
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

    // 布尔方法 - can 前缀
    public function canBeCancelled(): bool
    {
        return $this->status->canBeCancelled();
    }

    // Getter 方法 - 不使用 get 前缀
    public function id(): int
    {
        return $this->id;
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

    // 私有方法 - camelCase
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

---

## 命名检查清单

### 目录和文件

- [ ] 目录名全部小写
- [ ] 使用下划线分隔多个单词
- [ ] 类文件名使用 StudlyCase
- [ ] 一个文件只包含一个类

### 命名空间和类

- [ ] 命名空间跟随目录结构
- [ ] 命名空间全部小写
- [ ] 类名使用 StudlyCase
- [ ] 接口使用 Interface 后缀

### Service 和 Repository

- [ ] Service 使用 `{动词}{名词}Service` 模式
- [ ] Repository 接口使用 Interface 后缀
- [ ] Repository 实现使用 `{实现方式}{实体名}Repository` 模式

### 变量和方法

- [ ] 变量名使用 camelCase
- [ ] 方法名使用 camelCase
- [ ] 布尔方法使用 is/has/can/should 前缀
- [ ] Getter 方法不使用 get 前缀

### 常量

- [ ] 类常量使用 UPPER_SNAKE_CASE
- [ ] 配置文件使用 snake_case
- [ ] 优先使用 Enum 替代常量类

---

## 相关文档

- [目录结构规范](./directory-structure)
- [依赖方向规则](./dependency-rules)
- [分层职责](./layer-responsibilities)
- [PER Coding Style](../coding-standards/per-coding-style)
