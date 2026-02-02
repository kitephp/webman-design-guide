# PHP The Right Way 概述

> 现代 PHP 开发最佳实践指南

---

## 目录

- [什么是 PHP The Right Way](#什么是-php-the-right-way)
- [核心最佳实践总结](#核心最佳实践总结)
- [代码示例](#代码示例)
- [完整中文翻译](#完整中文翻译)

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

#### 数据库抽象层

```php
<?php

// 使用查询构建器 (如 Doctrine DBAL)
$queryBuilder = $connection->createQueryBuilder();
$users = $queryBuilder
    ->select('u.id', 'u.name', 'u.email')
    ->from('users', 'u')
    ->where('u.status = :status')
    ->setParameter('status', 'active')
    ->orderBy('u.created_at', 'DESC')
    ->setMaxResults(10)
    ->executeQuery()
    ->fetchAllAssociative();
```

### 7. 模板

#### 原生 PHP 模板

```php
<!-- view.php -->
<!DOCTYPE html>
<html>
<head>
    <title><?= htmlspecialchars($title) ?></title>
</head>
<body>
    <h1><?= htmlspecialchars($heading) ?></h1>

    <?php if (!empty($items)): ?>
        <ul>
            <?php foreach ($items as $item): ?>
                <li><?= htmlspecialchars($item) ?></li>
            <?php endforeach; ?>
        </ul>
    <?php else: ?>
        <p>No items found.</p>
    <?php endif; ?>
</body>
</html>
```

```php
<?php

// 渲染模板
function render(string $template, array $data): string
{
    extract($data);
    ob_start();
    include $template;
    return ob_get_clean();
}

$html = render('view.php', [
    'title' => 'My Page',
    'heading' => 'Welcome',
    'items' => ['Item 1', 'Item 2', 'Item 3'],
]);
```

### 8. 错误和异常

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
            throw new OrderNotFoundException("Order {$orderId} not found");
        }

        try {
            $this->processPayment($order);
        } catch (PaymentFailedException $e) {
            // 记录错误
            $this->logger->error('Payment failed', [
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

#### 错误处理

```php
<?php

// 错误报告配置
error_reporting(E_ALL);
ini_set('display_errors', '0'); // 生产环境关闭
ini_set('log_errors', '1');
ini_set('error_log', '/path/to/error.log');

// 自定义错误处理
set_error_handler(function (int $errno, string $errstr, string $errfile, int $errline) {
    if (!(error_reporting() & $errno)) {
        return false;
    }

    throw new \ErrorException($errstr, 0, $errno, $errfile, $errline);
});
```

### 9. 安全

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

// 在表单中包含 token
// <input type="hidden" name="csrf_token" value="<?= $_SESSION['csrf_token'] ?>">

// 验证 token
if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    die('CSRF token validation failed');
}
```

### 10. 测试

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

#### Pest 测试

```php
<?php

use App\Domain\Order\OrderService;

it('creates an order successfully', function () {
    $repository = Mockery::mock(OrderRepositoryInterface::class);
    $repository->shouldReceive('save')->once();

    $service = new OrderService($repository);

    $order = $service->createOrder(
        userId: 'user123',
        items: [['id' => 1, 'qty' => 2]],
        totalAmount: 99.99,
    );

    expect($order)
        ->toBeInstanceOf(Order::class)
        ->and($order->totalAmount())->toBe(99.99);
});

it('throws exception when order not found', function () {
    $repository = Mockery::mock(OrderRepositoryInterface::class);
    $repository->shouldReceive('findById')->andReturn(null);

    $service = new OrderService($repository);

    $service->processPayment(
        OrderId::fromString('order123'),
        'credit_card',
    );
})->throws(OrderNotFoundException::class);
```

### 11. 服务器和部署

#### 虚拟主机配置

**Nginx**:

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/html/public;

    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

**Apache**:

```apache
<VirtualHost *:80>
    ServerName example.com
    DocumentRoot /var/www/html/public

    <Directory /var/www/html/public>
        AllowOverride All
        Require all granted
    </Directory>

    <FilesMatch \.php$>
        SetHandler "proxy:unix:/var/run/php/php8.3-fpm.sock|fcgi://localhost"
    </FilesMatch>
</VirtualHost>
```

---

## 最佳实践速查表

### Quick Reference Checklist

| 类别 Category | 最佳实践 Best Practice | 优先级 Priority |
|--------------|----------------------|----------------|
| **PHP 版本** | 使用 PHP 8.1+ | ⭐⭐⭐ |
| **依赖管理** | 使用 Composer 管理依赖 | ⭐⭐⭐ |
| **编码风格** | 遵循 PER Coding Style | ⭐⭐⭐ |
| **类型声明** | 启用 `declare(strict_types=1)` | ⭐⭐⭐ |
| **类型提示** | 所有函数参数和返回值都使用类型声明 | ⭐⭐⭐ |
| **密码安全** | 使用 `password_hash()` 和 `password_verify()` | ⭐⭐⭐ |
| **SQL 安全** | 始终使用预处理语句 (PDO/MySQLi) | ⭐⭐⭐ |
| **XSS 防护** | 输出时使用 `htmlspecialchars()` | ⭐⭐⭐ |
| **错误处理** | 使用异常而非错误码 | ⭐⭐⭐ |
| **日期时间** | 使用 `DateTimeImmutable` 而非 `DateTime` | ⭐⭐ |
| **依赖注入** | 通过构造函数注入依赖 | ⭐⭐⭐ |
| **单元测试** | 编写测试覆盖核心业务逻辑 | ⭐⭐⭐ |
| **静态分析** | 使用 PHPStan 或 Psalm | ⭐⭐ |
| **代码格式化** | 使用 Laravel Pint 或 PHP-CS-Fixer | ⭐⭐ |
| **命名空间** | 遵循 PSR-4 自动加载标准 | ⭐⭐⭐ |
| **配置管理** | 使用环境变量，不要硬编码敏感信息 | ⭐⭐⭐ |
| **日志记录** | 使用 PSR-3 兼容的日志库 (如 Monolog) | ⭐⭐ |
| **HTTP 客户端** | 使用 Guzzle 或 Saloon | ⭐⭐ |
| **缓存** | 使用 PSR-6/PSR-16 缓存接口 | ⭐⭐ |

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

### Common Pitfalls and Anti-Patterns

#### 1. 不使用类型声明

**❌ DON'T - 不推荐**:

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

**✅ DO - 推荐**:

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
// $total = calculateTotal('19.99', '3'); // TypeError
```

#### 2. 直接使用全局变量和超全局变量

**❌ DON'T - 不推荐**:

```php
<?php

// 直接访问超全局变量
function processLogin()
{
    $username = $_POST['username'];
    $password = $_POST['password'];

    // 没有验证，容易受到攻击
    $query = "SELECT * FROM users WHERE username = '$username'";
}

// 使用全局变量
global $db;
$db->query($sql);
```

**✅ DO - 推荐**:

```php
<?php

declare(strict_types=1);

// 通过依赖注入传递
class LoginController
{
    public function __construct(
        private readonly RequestInterface $request,
        private readonly DatabaseInterface $database,
    ) {
    }

    public function processLogin(): Response
    {
        // 验证和过滤输入
        $username = $this->request->input('username');
        $password = $this->request->input('password');

        // 使用预处理语句
        $stmt = $this->database->prepare(
            'SELECT * FROM users WHERE username = :username'
        );
        $stmt->execute(['username' => $username]);

        return new Response();
    }
}
```

#### 3. 不安全的密码存储

**❌ DON'T - 不推荐**:

```php
<?php

// 明文存储密码 - 极度危险!
$query = "INSERT INTO users (username, password) VALUES (?, ?)";
$stmt->execute([$username, $password]);

// 使用 MD5 或 SHA1 - 不安全!
$hashedPassword = md5($password);
$hashedPassword = sha1($password);

// 自定义加密算法 - 不要这样做!
$hashedPassword = base64_encode($password . 'salt');
```

**✅ DO - 推荐**:

```php
<?php

declare(strict_types=1);

// 使用 password_hash() - 安全且简单
$hashedPassword = password_hash($password, PASSWORD_ARGON2ID);

// 存储到数据库
$stmt = $pdo->prepare('INSERT INTO users (username, password) VALUES (?, ?)');
$stmt->execute([$username, $hashedPassword]);

// 验证密码
$stmt = $pdo->prepare('SELECT password FROM users WHERE username = ?');
$stmt->execute([$username]);
$user = $stmt->fetch();

if (password_verify($password, $user['password'])) {
    // 密码正确

    // 检查是否需要重新哈希
    if (password_needs_rehash($user['password'], PASSWORD_ARGON2ID)) {
        $newHash = password_hash($password, PASSWORD_ARGON2ID);
        // 更新数据库
    }
}
```

#### 4. SQL 注入漏洞

**❌ DON'T - 不推荐**:

```php
<?php

// 直接拼接 SQL - 极度危险!
$sql = "SELECT * FROM users WHERE email = '$email'";
$result = $pdo->query($sql);

// 使用 mysqli_real_escape_string 不够安全
$email = mysqli_real_escape_string($conn, $email);
$sql = "SELECT * FROM users WHERE email = '$email'";

// 动态表名/字段名拼接
$table = $_GET['table'];
$sql = "SELECT * FROM $table"; // 危险!
```

**✅ DO - 推荐**:

```php
<?php

declare(strict_types=1);

// 始终使用预处理语句
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

// 对于动态表名，使用白名单验证
$allowedTables = ['users', 'orders', 'products'];
$table = $_GET['table'];

if (!in_array($table, $allowedTables, true)) {
    throw new \InvalidArgumentException('Invalid table name');
}

$sql = "SELECT * FROM {$table}";
```

#### 5. 不处理异常

**❌ DON'T - 不推荐**:

```php
<?php

// 忽略异常
try {
    $result = $api->call();
} catch (\Exception $e) {
    // 空的 catch 块 - 错误被吞掉了!
}

// 捕获所有异常但不处理
try {
    $result = $api->call();
} catch (\Exception $e) {
    echo 'Error'; // 没有记录错误详情
}

// 不使用异常，返回 false
function processOrder($orderId)
{
    if (!$this->validate($orderId)) {
        return false; // 调用者不知道为什么失败
    }
    return true;
}
```

**✅ DO - 推荐**:

```php
<?php

declare(strict_types=1);

// 正确处理异常
try {
    $result = $api->call();
} catch (ApiException $e) {
    // 记录错误
    $this->logger->error('API call failed', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString(),
    ]);

    // 重新抛出或返回适当的响应
    throw new ServiceUnavailableException('Service temporarily unavailable', 0, $e);
}

// 使用异常传递错误信息
function processOrder(string $orderId): Order
{
    if (!$this->validate($orderId)) {
        throw new InvalidOrderException("Invalid order ID: {$orderId}");
    }

    $order = $this->repository->find($orderId);

    if ($order === null) {
        throw new OrderNotFoundException("Order not found: {$orderId}");
    }

    return $order;
}
```

#### 6. 不使用依赖注入

**❌ DON'T - 不推荐**:

```php
<?php

// 在类内部创建依赖 - 难以测试
class OrderService
{
    private $repository;
    private $mailer;

    public function __construct()
    {
        // 硬编码依赖
        $this->repository = new OrderRepository();
        $this->mailer = new Mailer();
    }

    public function createOrder($data)
    {
        // 使用单例 - 全局状态
        $logger = Logger::getInstance();
        $logger->info('Creating order');
    }
}
```

**✅ DO - 推荐**:

```php
<?php

declare(strict_types=1);

// 通过构造函数注入依赖
class OrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $repository,
        private readonly MailerInterface $mailer,
        private readonly LoggerInterface $logger,
    ) {
    }

    public function createOrder(array $data): Order
    {
        $this->logger->info('Creating order', ['data' => $data]);

        $order = Order::create($data);
        $this->repository->save($order);
        $this->mailer->send($order->getCustomerEmail(), 'Order Confirmation');

        return $order;
    }
}

// 在容器中配置依赖
$container->bind(OrderRepositoryInterface::class, OrderRepository::class);
$container->bind(MailerInterface::class, SmtpMailer::class);
$container->bind(LoggerInterface::class, MonologLogger::class);
```

#### 7. 使用 DateTime 而非 DateTimeImmutable

**❌ DON'T - 不推荐**:

```php
<?php

// DateTime 是可变的，可能导致意外的副作用
function processOrder(DateTime $orderDate): void
{
    $deliveryDate = $orderDate->modify('+3 days'); // 修改了原始对象!

    echo $orderDate->format('Y-m-d'); // 已经被修改了
}

$orderDate = new DateTime('2024-01-01');
processOrder($orderDate);
echo $orderDate->format('Y-m-d'); // 输出 2024-01-04，不是 2024-01-01!
```

**✅ DO - 推荐**:

```php
<?php

declare(strict_types=1);

// DateTimeImmutable 是不可变的，更安全
function processOrder(DateTimeImmutable $orderDate): void
{
    $deliveryDate = $orderDate->modify('+3 days'); // 返回新对象

    echo $orderDate->format('Y-m-d'); // 原始对象未被修改
    echo $deliveryDate->format('Y-m-d'); // 新的日期
}

$orderDate = new DateTimeImmutable('2024-01-01');
processOrder($orderDate);
echo $orderDate->format('Y-m-d'); // 仍然是 2024-01-01
```

#### 8. 不验证和清理用户输入

**❌ DON'T - 不推荐**:

```php
<?php

// 直接使用用户输入
$email = $_POST['email'];
$age = $_POST['age'];

// 直接输出到 HTML - XSS 漏洞!
echo "<p>Welcome, {$_POST['name']}</p>";

// 不验证数据类型
$userId = $_GET['id'];
$user = $db->query("SELECT * FROM users WHERE id = {$userId}");
```

**✅ DO - 推荐**:

```php
<?php

declare(strict_types=1);

// 验证和过滤输入
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
if ($email === false) {
    throw new ValidationException('Invalid email address');
}

$age = filter_input(INPUT_POST, 'age', FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 1, 'max_range' => 120],
]);
if ($age === false) {
    throw new ValidationException('Invalid age');
}

// 清理输出
$name = htmlspecialchars($_POST['name'], ENT_QUOTES, 'UTF-8');
echo "<p>Welcome, {$name}</p>";

// 使用类型声明和验证
function getUser(int $userId): ?User
{
    if ($userId <= 0) {
        throw new InvalidArgumentException('User ID must be positive');
    }

    $stmt = $this->pdo->prepare('SELECT * FROM users WHERE id = :id');
    $stmt->execute(['id' => $userId]);

    return $stmt->fetchObject(User::class) ?: null;
}
```

#### 9. 不使用命名空间

**❌ DON'T - 不推荐**:

```php
<?php

// 所有类都在全局命名空间
class OrderService
{
}

class Order
{
}

// 类名冲突风险
class User // 可能与其他库的 User 类冲突
{
}

// 文件组织混乱
require_once 'includes/OrderService.php';
require_once 'includes/Order.php';
```

**✅ DO - 推荐**:

```php
<?php

declare(strict_types=1);

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

// 遵循 PSR-4 自动加载
// App\Domain\Order\OrderService -> src/Domain/Order/OrderService.php
```

**composer.json**:

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    }
}
```

#### 10. 过度使用静态方法和单例

**❌ DON'T - 不推荐**:

```php
<?php

// 静态方法 - 难以测试和扩展
class OrderService
{
    public static function createOrder($data)
    {
        $db = Database::getInstance(); // 单例
        $logger = Logger::getInstance(); // 单例

        // 紧密耦合，无法替换依赖
    }
}

// 使用
OrderService::createOrder($data);

// 单例模式 - 全局状态
class Database
{
    private static $instance;

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
}
```

**✅ DO - 推荐**:

```php
<?php

declare(strict_types=1);

// 使用实例方法和依赖注入
class OrderService
{
    public function __construct(
        private readonly DatabaseInterface $database,
        private readonly LoggerInterface $logger,
    ) {
    }

    public function createOrder(array $data): Order
    {
        $this->logger->info('Creating order');

        // 可以轻松替换依赖进行测试
        $order = Order::create($data);
        $this->database->save($order);

        return $order;
    }
}

// 使用依赖注入容器
$orderService = $container->get(OrderService::class);
$order = $orderService->createOrder($data);

// 测试时可以轻松 mock
$mockDatabase = $this->createMock(DatabaseInterface::class);
$mockLogger = $this->createMock(LoggerInterface::class);
$service = new OrderService($mockDatabase, $mockLogger);
```

#### 11. 不写测试

**❌ DON'T - 不推荐**:

```php
<?php

// 没有测试，只能手动测试
class OrderService
{
    public function calculateTotal($items)
    {
        $total = 0;
        foreach ($items as $item) {
            $total += $item['price'] * $item['quantity'];
        }
        return $total;
    }
}

// 修改代码后不知道是否破坏了现有功能
```

**✅ DO - 推荐**:

```php
<?php

declare(strict_types=1);

namespace Tests\Unit\Domain\Order;

use App\Domain\Order\OrderService;
use PHPUnit\Framework\TestCase;

class OrderServiceTest extends TestCase
{
    private OrderService $service;

    protected function setUp(): void
    {
        $this->service = new OrderService();
    }

    public function testCalculateTotalWithSingleItem(): void
    {
        $items = [
            ['price' => 10.00, 'quantity' => 2],
        ];

        $total = $this->service->calculateTotal($items);

        $this->assertEquals(20.00, $total);
    }

    public function testCalculateTotalWithMultipleItems(): void
    {
        $items = [
            ['price' => 10.00, 'quantity' => 2],
            ['price' => 5.00, 'quantity' => 3],
        ];

        $total = $this->service->calculateTotal($items);

        $this->assertEquals(35.00, $total);
    }

    public function testCalculateTotalWithEmptyItems(): void
    {
        $total = $this->service->calculateTotal([]);

        $this->assertEquals(0.00, $total);
    }
}
```

#### 12. 硬编码配置和敏感信息

**❌ DON'T - 不推荐**:

```php
<?php

// 硬编码数据库凭据 - 危险!
$pdo = new PDO(
    'mysql:host=localhost;dbname=myapp',
    'root',
    'password123' // 密码暴露在代码中!
);

// 硬编码 API 密钥
$apiKey = 'sk_live_abc123xyz'; // 不要这样做!

// 硬编码配置
$config = [
    'debug' => true, // 生产环境也会开启调试模式!
    'cache_ttl' => 3600,
];
```

**✅ DO - 推荐**:

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
    $_ENV['DB_PASSWORD'],
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
);

// 使用配置文件
$config = require __DIR__ . '/config/app.php';

// API 密钥从环境变量读取
$apiKey = $_ENV['API_KEY'];
```

**.env 文件** (不要提交到版本控制):

```env
DB_HOST=localhost
DB_NAME=myapp
DB_USER=myapp_user
DB_PASSWORD=secure_password_here

API_KEY=sk_live_abc123xyz

APP_DEBUG=false
APP_ENV=production
```

**.gitignore**:

```
.env
.env.local
```

---

## 代码示例

### 完整示例：RESTful API 控制器

```php
<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Contract\Service\OrderServiceInterface;
use App\Domain\Order\Exception\OrderNotFoundException;
use App\Domain\Order\ValueObject\OrderId;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Order API Controller
 */
final class OrderController
{
    public function __construct(
        private readonly OrderServiceInterface $orderService,
    ) {
    }

    /**
     * Create new order
     *
     * POST /api/orders
     */
    public function create(ServerRequestInterface $request): ResponseInterface
    {
        $data = $request->getParsedBody();

        // 验证输入
        $errors = $this->validateCreateRequest($data);
        if (!empty($errors)) {
            return $this->jsonResponse(['errors' => $errors], 422);
        }

        try {
            $order = $this->orderService->createOrder(
                userId: $data['user_id'],
                items: $data['items'],
                totalAmount: (float) $data['total_amount'],
            );

            return $this->jsonResponse([
                'data' => [
                    'id' => $order->id()->value(),
                    'status' => $order->status()->value,
                    'total_amount' => $order->totalAmount(),
                    'created_at' => $order->createdAt()->format('c'),
                ],
            ], 201);
        } catch (\Exception $e) {
            return $this->jsonResponse([
                'error' => 'Failed to create order',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get order by ID
     *
     * GET /api/orders/{id}
     */
    public function show(ServerRequestInterface $request, string $id): ResponseInterface
    {
        try {
            $orderId = OrderId::fromString($id);
            $order = $this->orderService->getOrder($orderId);

            return $this->jsonResponse([
                'data' => [
                    'id' => $order->id()->value(),
                    'user_id' => $order->userId(),
                    'status' => $order->status()->value,
                    'items' => $order->items(),
                    'total_amount' => $order->totalAmount(),
                    'created_at' => $order->createdAt()->format('c'),
                    'updated_at' => $order->updatedAt()->format('c'),
                ],
            ]);
        } catch (OrderNotFoundException $e) {
            return $this->jsonResponse([
                'error' => 'Order not found',
            ], 404);
        } catch (\Exception $e) {
            return $this->jsonResponse([
                'error' => 'Failed to retrieve order',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Process payment for order
     *
     * POST /api/orders/{id}/payment
     */
    public function processPayment(ServerRequestInterface $request, string $id): ResponseInterface
    {
        $data = $request->getParsedBody();

        try {
            $orderId = OrderId::fromString($id);
            $success = $this->orderService->processPayment(
                orderId: $orderId,
                paymentMethod: $data['payment_method'] ?? 'credit_card',
            );

            if ($success) {
                return $this->jsonResponse([
                    'message' => 'Payment processed successfully',
                ]);
            }

            return $this->jsonResponse([
                'error' => 'Payment processing failed',
            ], 400);
        } catch (OrderNotFoundException $e) {
            return $this->jsonResponse([
                'error' => 'Order not found',
            ], 404);
        } catch (\Exception $e) {
            return $this->jsonResponse([
                'error' => 'Payment processing failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Cancel order
     *
     * DELETE /api/orders/{id}
     */
    public function cancel(ServerRequestInterface $request, string $id): ResponseInterface
    {
        $data = $request->getParsedBody();

        try {
            $orderId = OrderId::fromString($id);
            $this->orderService->cancelOrder(
                orderId: $orderId,
                reason: $data['reason'] ?? 'Customer request',
            );

            return $this->jsonResponse([
                'message' => 'Order cancelled successfully',
            ]);
        } catch (OrderNotFoundException $e) {
            return $this->jsonResponse([
                'error' => 'Order not found',
            ], 404);
        } catch (\LogicException $e) {
            return $this->jsonResponse([
                'error' => 'Cannot cancel order',
                'message' => $e->getMessage(),
            ], 400);
        } catch (\Exception $e) {
            return $this->jsonResponse([
                'error' => 'Failed to cancel order',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Validate create order request
     */
    private function validateCreateRequest(array $data): array
    {
        $errors = [];

        if (empty($data['user_id'])) {
            $errors['user_id'] = 'User ID is required';
        }

        if (empty($data['items']) || !is_array($data['items'])) {
            $errors['items'] = 'Items are required and must be an array';
        }

        if (empty($data['total_amount']) || !is_numeric($data['total_amount'])) {
            $errors['total_amount'] = 'Total amount is required and must be numeric';
        }

        return $errors;
    }

    /**
     * Create JSON response
     */
    private function jsonResponse(array $data, int $status = 200): ResponseInterface
    {
        $response = new \GuzzleHttp\Psr7\Response();
        $response->getBody()->write(json_encode($data));

        return $response
            ->withStatus($status)
            ->withHeader('Content-Type', 'application/json');
    }
}
```

---

## 完整中文翻译

查看完整的 PHP The Right Way 中文翻译:

[PHP The Right Way 中文完整版](../translates/chinese/phptherightway/index.md)

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
- [Saloon](https://docs.saloon.dev/) - 现代 HTTP 客户端
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

---

**最后更新**: 2026-02-02

**许可证**: 本文档基于 [PHP The Right Way](https://phptherightway.com/) (Creative Commons BY-NC-SA 3.0) 创作
