---
title: "PHP The Right Way 概述"
description: "现代 PHP 开发最佳实践指南"
---

## 目录

- [什么是 PHP The Right Way](#什么是-php-the-right-way)
- [核心最佳实践总结](#核心最佳实践总结)
- [代码示例](#代码示例)
- [最佳实践速查表](#最佳实践速查表)
- [常见陷阱](#常见陷阱)
- [相关资源](#相关资源)
- [常见问题](#常见问题)

---

## 什么是 PHP The Right Way

**PHP The Right Way** 是一个易于阅读的 PHP 最佳实践快速参考，包含编码标准、权威教程链接和当前被认为是最佳实践的内容。

### 核心特点

- **无固定方式** - 没有规范的使用 PHP 的方式，本指南展示最佳实践、可用选项和有用信息
- **活跃文档** - 持续更新，反映最新的 PHP 生态系统
- **社区驱动** - 由 PHP 社区贡献和维护
- **实用导向** - 关注实际开发中的问题和解决方案

### 为什么重要

1. **避免常见陷阱** - 帮助开发者避免常见的错误和反模式
2. **现代化实践** - 推广现代 PHP 开发方式
3. **生态系统指南** - 介绍优秀的工具和库
4. **持续学习** - 随着 PHP 发展而更新

---

## 核心最佳实践总结

### 1. 入门基础

#### 使用当前稳定版本 (PHP 8.3+)

```php
<?php

// 使用现代 PHP 特性
declare(strict_types=1);

// 类型声明
function calculateTotal(float $price, int $quantity): float
{
    return $price * $quantity;
}

// 命名参数 (PHP 8.0+)
$total = calculateTotal(price: 19.99, quantity: 3);
```

#### 内置 Web 服务器

```bash
# 开发环境快速启动
php -S localhost:8000 -t public/
```

### 2. 编码风格

#### 遵循 PSR 标准

- **PSR-1**: 基础编码标准
- **PSR-12**: 扩展编码风格指南
- **PER**: 现代 PHP 编码风格

```php
<?php

declare(strict_types=1);

namespace Vendor\Package;

use Vendor\Package\{ClassA, ClassB};

class ClassName extends ParentClass implements InterfaceA, InterfaceB
{
    public function __construct(
        private string $name,
        private int $age,
    ) {
    }

    public function sampleMethod(int $arg1, string $arg2): bool
    {
        return true;
    }
}
```

### 3. 语言亮点

#### 命名空间

```php
<?php

namespace App\Domain\Order;

use App\Contract\Repository\OrderRepositoryInterface;
use App\Domain\Order\Exception\OrderNotFoundException;

class OrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $repository,
    ) {
    }
}
```

#### 标准 PHP 库 (SPL)

```php
<?php

// 数据结构
$stack = new \SplStack();
$stack->push('item1');
$stack->push('item2');
$item = $stack->pop();

// 迭代器
$iterator = new \ArrayIterator([1, 2, 3, 4, 5]);
foreach ($iterator as $value) {
    echo $value;
}

// 文件处理
$file = new \SplFileObject('data.csv');
$file->setFlags(\SplFileObject::READ_CSV);
foreach ($file as $row) {
    print_r($row);
}
```

#### 命令行接口

```php
<?php

// 获取命令行参数
$options = getopt('f:v::', ['file:', 'verbose::']);

// 输出到 STDERR
fwrite(STDERR, "Error: File not found\n");

// 退出码
exit(1);
```

### 4. 依赖管理

#### 使用 Composer

```bash
# 安装依赖
composer require vendor/package

# 开发依赖
composer require --dev phpunit/phpunit

# 更新依赖
composer update

# 自动加载
composer dump-autoload
```

**composer.json 示例**:

```json
{
    "name": "vendor/project",
    "description": "Project description",
    "type": "project",
    "require": {
        "php": "^8.1",
        "vendor/package": "^2.0"
    },
    "require-dev": {
        "phpunit/phpunit": "^10.0",
        "laravel/pint": "^1.0"
    },
    "autoload": {
        "psr-4": {
            "App\\": "app/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "Tests\\": "tests/"
        }
    }
}
```

### 5. 编码实践

#### 日期和时间

```php
<?php

// 使用 DateTimeImmutable (推荐)
$now = new \DateTimeImmutable();
$tomorrow = $now->modify('+1 day');

// 时区处理
$timezone = new \DateTimeZone('Asia/Shanghai');
$date = new \DateTimeImmutable('now', $timezone);

// 格式化
echo $date->format('Y-m-d H:i:s');

// 比较日期
$date1 = new \DateTimeImmutable('2024-01-01');
$date2 = new \DateTimeImmutable('2024-12-31');
$interval = $date1->diff($date2);
echo $interval->days; // 365
```

#### 设计模式

**依赖注入**:

```php
<?php

// 不好的做法
class OrderService
{
    private $repository;

    public function __construct()
    {
        $this->repository = new OrderRepository(); // 硬编码依赖
    }
}

// 好的做法
class OrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $repository,
    ) {
    }
}

// 使用
$repository = new OrderRepository();
$service = new OrderService($repository);
```

**工厂模式**:

```php
<?php

interface PaymentGateway
{
    public function charge(float $amount): bool;
}

class PaymentGatewayFactory
{
    public function create(string $type): PaymentGateway
    {
        return match ($type) {
            'stripe' => new StripeGateway(),
            'paypal' => new PayPalGateway(),
            'alipay' => new AlipayGateway(),
            default => throw new \InvalidArgumentException("Unknown gateway: {$type}"),
        };
    }
}
```

**策略模式**:

```php
<?php

interface ShippingStrategy
{
    public function calculateCost(float $weight): float;
}

class StandardShipping implements ShippingStrategy
{
    public function calculateCost(float $weight): float
    {
        return $weight * 5.0;
    }
}

class ExpressShipping implements ShippingStrategy
{
    public function calculateCost(float $weight): float
    {
        return $weight * 10.0;
    }
}

class ShippingCalculator
{
    public function __construct(
        private ShippingStrategy $strategy,
    ) {
    }

    public function calculate(float $weight): float
    {
        return $this->strategy->calculateCost($weight);
    }
}
```

### 6. 数据库

#### PDO 使用

```php
<?php

// 连接数据库
$dsn = 'mysql:host=localhost;dbname=testdb;charset=utf8mb4';
$pdo = new \PDO($dsn, 'username', 'password', [
    \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
    \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
    \PDO::ATTR_EMULATE_PREPARES => false,
]);

// 预处理语句 (防止 SQL 注入)
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

// 插入数据
$stmt = $pdo->prepare('INSERT INTO users (name, email) VALUES (:name, :email)');
$stmt->execute([
    'name' => $name,
    'email' => $email,
]);
$userId = $pdo->lastInsertId();

// 事务
$pdo->beginTransaction();
try {
    $pdo->exec('INSERT INTO accounts (balance) VALUES (100)');
    $pdo->exec('UPDATE accounts SET balance = balance - 100 WHERE id = 1');
    $pdo->commit();
} catch (\Exception $e) {
    $pdo->rollBack();
    throw $e;
}
```

### 7. 错误和异常

#### 异常处理

```php
<?php

// 自定义异常
class OrderNotFoundException extends \RuntimeException
{
}

class PaymentFailedException extends \RuntimeException
{
}

// 使用异常
class OrderService
{
    public function processOrder(string $orderId): void
    {
        $order = $this->findOrder($orderId);

        if ($order === null) {
            throw new OrderNotFoundException("订单 {$orderId} 未找到");
        }

        try {
            $this->processPayment($order);
        } catch (PaymentFailedException $e) {
            // 记录错误
            $this->logger->error('支付失败', [
                'order_id' => $orderId,
                'error' => $e->getMessage(),
            ]);

            // 重新抛出或处理
            throw $e;
        }
    }
}

// 全局异常处理
set_exception_handler(function (\Throwable $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal Server Error',
        'message' => $e->getMessage(),
    ]);
});
```

### 8. 安全

#### 密码哈希

```php
<?php

// 哈希密码
$hash = password_hash($password, PASSWORD_ARGON2ID);

// 验证密码
if (password_verify($password, $hash)) {
    // 密码正确

    // 检查是否需要重新哈希
    if (password_needs_rehash($hash, PASSWORD_ARGON2ID)) {
        $newHash = password_hash($password, PASSWORD_ARGON2ID);
        // 更新数据库中的哈希
    }
}
```

#### 输入过滤和验证

```php
<?php

// 过滤输入
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$age = filter_input(INPUT_POST, 'age', FILTER_VALIDATE_INT);
$url = filter_input(INPUT_POST, 'url', FILTER_VALIDATE_URL);

// 清理输出
$safe = htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');

// 验证
function validateEmail(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}
```

#### SQL 注入防护

```php
<?php

// 永远使用预处理语句
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');
$stmt->execute(['email' => $email]);

// 不要这样做
// $query = "SELECT * FROM users WHERE email = '$email'"; // 危险!
```

#### XSS 防护

```php
<?php

// 输出时转义
echo htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');

// 使用 Content Security Policy
header("Content-Security-Policy: default-src 'self'");
```

#### CSRF 防护

```php
<?php

// 生成 CSRF token
session_start();
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// 验证 token
if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    die('CSRF token validation failed');
}
```

### 9. 测试

#### PHPUnit 单元测试

```php
<?php

use PHPUnit\Framework\TestCase;

class OrderServiceTest extends TestCase
{
    private OrderService $service;
    private OrderRepositoryInterface $repository;

    protected function setUp(): void
    {
        $this->repository = $this->createMock(OrderRepositoryInterface::class);
        $this->service = new OrderService($this->repository);
    }

    public function testCreateOrder(): void
    {
        $this->repository
            ->expects($this->once())
            ->method('save')
            ->with($this->isInstanceOf(Order::class));

        $order = $this->service->createOrder(
            userId: 'user123',
            items: [['id' => 1, 'qty' => 2]],
            totalAmount: 99.99,
        );

        $this->assertInstanceOf(Order::class, $order);
        $this->assertEquals(99.99, $order->totalAmount());
    }

    public function testProcessPaymentThrowsExceptionWhenOrderNotFound(): void
    {
        $this->repository
            ->method('findById')
            ->willReturn(null);

        $this->expectException(OrderNotFoundException::class);

        $this->service->processPayment(
            OrderId::fromString('order123'),
            'credit_card',
        );
    }
}
```

---

## 最佳实践速查表

| 类别 | 最佳实践 | 优先级 |
|------|---------|--------|
| **PHP 版本** | 使用 PHP 8.1+ | 高 |
| **依赖管理** | 使用 Composer 管理依赖 | 高 |
| **编码风格** | 遵循 PER Coding Style | 高 |
| **类型声明** | 启用 `declare(strict_types=1)` | 高 |
| **类型提示** | 所有函数参数和返回值都使用类型声明 | 高 |
| **密码安全** | 使用 `password_hash()` 和 `password_verify()` | 高 |
| **SQL 安全** | 始终使用预处理语句 (PDO/MySQLi) | 高 |
| **XSS 防护** | 输出时使用 `htmlspecialchars()` | 高 |
| **错误处理** | 使用异常而非错误码 | 高 |
| **日期时间** | 使用 `DateTimeImmutable` 而非 `DateTime` | 中 |
| **依赖注入** | 通过构造函数注入依赖 | 高 |
| **单元测试** | 编写测试覆盖核心业务逻辑 | 高 |
| **静态分析** | 使用 PHPStan 或 Psalm | 中 |
| **代码格式化** | 使用 Laravel Pint 或 PHP-CS-Fixer | 中 |
| **命名空间** | 遵循 PSR-4 自动加载标准 | 高 |
| **配置管理** | 使用环境变量，不要硬编码敏感信息 | 高 |
| **日志记录** | 使用 PSR-3 兼容的日志库 (如 Monolog) | 中 |

### 代码质量检查清单

```bash
# 1. 代码格式化
./vendor/bin/pint

# 2. 静态分析
./vendor/bin/phpstan analyse

# 3. 运行测试
./vendor/bin/phpunit

# 4. 代码覆盖率
./vendor/bin/phpunit --coverage-html coverage

# 5. 安全检查
composer audit
```

---

## 常见陷阱

### 1. 不使用类型声明

**不推荐**:

```php
<?php

// 没有类型声明，容易出错
function calculateTotal($price, $quantity)
{
    return $price * $quantity;
}

// 可能导致意外结果
$total = calculateTotal('19.99', '3'); // 字符串运算
```

**推荐**:

```php
<?php

declare(strict_types=1);

// 明确的类型声明
function calculateTotal(float $price, int $quantity): float
{
    return $price * $quantity;
}

// 类型错误会立即抛出异常
$total = calculateTotal(19.99, 3); // 正确
```

### 2. 不安全的密码存储

**不推荐**:

```php
<?php

// 明文存储密码 - 极度危险!
$query = "INSERT INTO users (username, password) VALUES (?, ?)";
$stmt->execute([$username, $password]);

// 使用 MD5 或 SHA1 - 不安全!
$hashedPassword = md5($password);
```

**推荐**:

```php
<?php

declare(strict_types=1);

// 使用 password_hash() - 安全且简单
$hashedPassword = password_hash($password, PASSWORD_ARGON2ID);

// 验证密码
if (password_verify($password, $user['password'])) {
    // 密码正确
}
```

### 3. SQL 注入漏洞

**不推荐**:

```php
<?php

// 直接拼接 SQL - 极度危险!
$sql = "SELECT * FROM users WHERE email = '$email'";
$result = $pdo->query($sql);
```

**推荐**:

```php
<?php

declare(strict_types=1);

// 始终使用预处理语句
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();
```

### 4. 不使用依赖注入

**不推荐**:

```php
<?php

// 在类内部创建依赖 - 难以测试
class OrderService
{
    public function __construct()
    {
        // 硬编码依赖
        $this->repository = new OrderRepository();
    }
}
```

**推荐**:

```php
<?php

declare(strict_types=1);

// 通过构造函数注入依赖
class OrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $repository,
    ) {
    }
}
```

### 5. 使用 DateTime 而非 DateTimeImmutable

**不推荐**:

```php
<?php

// DateTime 是可变的，可能导致意外的副作用
function processOrder(DateTime $orderDate): void
{
    $deliveryDate = $orderDate->modify('+3 days'); // 修改了原始对象!
}
```

**推荐**:

```php
<?php

declare(strict_types=1);

// DateTimeImmutable 是不可变的，更安全
function processOrder(DateTimeImmutable $orderDate): void
{
    $deliveryDate = $orderDate->modify('+3 days'); // 返回新对象
}
```

### 6. 硬编码配置和敏感信息

**不推荐**:

```php
<?php

// 硬编码数据库凭据 - 危险!
$pdo = new PDO(
    'mysql:host=localhost;dbname=myapp',
    'root',
    'password123' // 密码暴露在代码中!
);
```

**推荐**:

```php
<?php

declare(strict_types=1);

// 使用环境变量
$pdo = new PDO(
    sprintf(
        'mysql:host=%s;dbname=%s;charset=utf8mb4',
        $_ENV['DB_HOST'],
        $_ENV['DB_NAME']
    ),
    $_ENV['DB_USER'],
    $_ENV['DB_PASSWORD']
);
```

---

## 相关资源

### 官方资源

- [PHP The Right Way 官网](https://phptherightway.com/)
- [PHP The Right Way GitHub](https://github.com/codeguy/php-the-right-way)
- [PHP 官方文档](https://www.php.net/manual/zh/)

### 推荐工具

- [Composer](https://getcomposer.org/) - 依赖管理
- [PHPUnit](https://phpunit.de/) - 单元测试
- [Pest](https://pestphp.com/) - 现代测试框架
- [PHPStan](https://phpstan.org/) - 静态分析
- [Psalm](https://psalm.dev/) - 静态分析
- [Laravel Pint](https://laravel.com/docs/pint) - 代码格式化

### 推荐包

- [Symfony Components](https://symfony.com/components) - 可复用组件
- [Guzzle](https://docs.guzzlephp.org/) - HTTP 客户端
- [Monolog](https://github.com/Seldaek/monolog) - 日志库
- [Carbon](https://carbon.nesbot.com/) - 日期时间库
- [Doctrine](https://www.doctrine-project.org/) - ORM 和数据库工具

---

## 常见问题

### Q: PHP The Right Way 是官方标准吗?

A: 不是官方标准，而是社区驱动的最佳实践指南。它汇集了 PHP 社区的经验和共识。

### Q: 必须完全遵循这些实践吗?

A: 不是强制的，但强烈推荐。这些实践经过社区验证，能帮助你写出更好的代码。

### Q: 如何在团队中推广这些实践?

A:
1. 在团队中分享和讨论
2. 配置自动化工具强制执行
3. 代码审查时参考这些标准
4. 定期更新团队知识

### Q: 这些实践适用于所有项目吗?

A: 大部分实践适用于所有项目，但具体应用需要根据项目规模和需求调整。
