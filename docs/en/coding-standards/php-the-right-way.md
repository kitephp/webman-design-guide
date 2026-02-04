---
title: "PHP The Right Way Overview"
description: "Modern PHP Development Best Practices Guide"
---

## Table of Contents

- [What is PHP The Right Way](#what-is-php-the-right-way)
- [Core Best Practices Summary](#core-best-practices-summary)
- [Code Examples](#code-examples)
- [Best Practices Quick Reference](#best-practices-quick-reference)
- [Common Pitfalls](#common-pitfalls)
- [Related Resources](#related-resources)
- [FAQ](#faq)

---

## What is PHP The Right Way

**PHP The Right Way** is an easy-to-read, quick reference for PHP best practices, accepted coding standards, and links to authoritative tutorials around the Web.

### Key Features

- **No Canonical Way** - There is no canonical way to use PHP. This guide presents best practices, available options, and useful information
- **Living Document** - Continuously updated to reflect the latest PHP ecosystem
- **Community Driven** - Contributed and maintained by the PHP community
- **Practical Focus** - Focuses on real-world development problems and solutions

### Why It Matters

1. **Avoid Common Pitfalls** - Helps developers avoid common mistakes and anti-patterns
2. **Modern Practices** - Promotes modern PHP development approaches
3. **Ecosystem Guide** - Introduces excellent tools and libraries
4. **Continuous Learning** - Updates as PHP evolves

---

## Core Best Practices Summary

### 1. Getting Started

#### Use Current Stable Version (PHP 8.3+)

```php
<?php

// Use modern PHP features
declare(strict_types=1);

// Type declarations
function calculateTotal(float $price, int $quantity): float
{
    return $price * $quantity;
}

// Named arguments (PHP 8.0+)
$total = calculateTotal(price: 19.99, quantity: 3);
```

#### Built-in Web Server

```bash
# Quick start for development
php -S localhost:8000 -t public/
```

### 2. Coding Style

#### Follow PSR Standards

- **PSR-1**: Basic Coding Standard
- **PSR-12**: Extended Coding Style Guide
- **PER**: Modern PHP Coding Style

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

### 3. Language Highlights

#### Namespaces

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

#### Standard PHP Library (SPL)

```php
<?php

// Data structures
$stack = new \SplStack();
$stack->push('item1');
$stack->push('item2');
$item = $stack->pop();

// Iterators
$iterator = new \ArrayIterator([1, 2, 3, 4, 5]);
foreach ($iterator as $value) {
    echo $value;
}

// File handling
$file = new \SplFileObject('data.csv');
$file->setFlags(\SplFileObject::READ_CSV);
foreach ($file as $row) {
    print_r($row);
}
```

#### Command Line Interface

```php
<?php

// Get command line arguments
$options = getopt('f:v::', ['file:', 'verbose::']);

// Output to STDERR
fwrite(STDERR, "Error: File not found\n");

// Exit code
exit(1);
```

### 4. Dependency Management

#### Using Composer

```bash
# Install dependencies
composer require vendor/package

# Development dependencies
composer require --dev phpunit/phpunit

# Update dependencies
composer update

# Autoload
composer dump-autoload
```

**composer.json example**:

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

### 5. Coding Practices

#### Date and Time

```php
<?php

// Use DateTimeImmutable (recommended)
$now = new \DateTimeImmutable();
$tomorrow = $now->modify('+1 day');

// Timezone handling
$timezone = new \DateTimeZone('Asia/Shanghai');
$date = new \DateTimeImmutable('now', $timezone);

// Formatting
echo $date->format('Y-m-d H:i:s');

// Comparing dates
$date1 = new \DateTimeImmutable('2024-01-01');
$date2 = new \DateTimeImmutable('2024-12-31');
$interval = $date1->diff($date2);
echo $interval->days; // 365
```

#### Design Patterns

**Dependency Injection**:

```php
<?php

// Bad practice
class OrderService
{
    private $repository;

    public function __construct()
    {
        $this->repository = new OrderRepository(); // Hardcoded dependency
    }
}

// Good practice
class OrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $repository,
    ) {
    }
}

// Usage
$repository = new OrderRepository();
$service = new OrderService($repository);
```

**Factory Pattern**:

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

**Strategy Pattern**:

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

### 6. Databases

#### PDO Usage

```php
<?php

// Connect to database
$dsn = 'mysql:host=localhost;dbname=testdb;charset=utf8mb4';
$pdo = new \PDO($dsn, 'username', 'password', [
    \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
    \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
    \PDO::ATTR_EMULATE_PREPARES => false,
]);

// Prepared statements (prevent SQL injection)
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

// Insert data
$stmt = $pdo->prepare('INSERT INTO users (name, email) VALUES (:name, :email)');
$stmt->execute([
    'name' => $name,
    'email' => $email,
]);
$userId = $pdo->lastInsertId();

// Transactions
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

### 7. Errors and Exceptions

#### Exception Handling

```php
<?php

// Custom exceptions
class OrderNotFoundException extends \RuntimeException
{
}

class PaymentFailedException extends \RuntimeException
{
}

// Using exceptions
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
            // Log error
            $this->logger->error('Payment failed', [
                'order_id' => $orderId,
                'error' => $e->getMessage(),
            ]);

            // Re-throw or handle
            throw $e;
        }
    }
}

// Global exception handler
set_exception_handler(function (\Throwable $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal Server Error',
        'message' => $e->getMessage(),
    ]);
});
```

### 8. Security

#### Password Hashing

```php
<?php

// Hash password
$hash = password_hash($password, PASSWORD_ARGON2ID);

// Verify password
if (password_verify($password, $hash)) {
    // Password correct

    // Check if rehash needed
    if (password_needs_rehash($hash, PASSWORD_ARGON2ID)) {
        $newHash = password_hash($password, PASSWORD_ARGON2ID);
        // Update hash in database
    }
}
```

#### Input Filtering and Validation

```php
<?php

// Filter input
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$age = filter_input(INPUT_POST, 'age', FILTER_VALIDATE_INT);
$url = filter_input(INPUT_POST, 'url', FILTER_VALIDATE_URL);

// Sanitize output
$safe = htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');

// Validation
function validateEmail(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}
```

#### SQL Injection Prevention

```php
<?php

// Always use prepared statements
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');
$stmt->execute(['email' => $email]);

// Don't do this
// $query = "SELECT * FROM users WHERE email = '$email'"; // Dangerous!
```

#### XSS Prevention

```php
<?php

// Escape on output
echo htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');

// Use Content Security Policy
header("Content-Security-Policy: default-src 'self'");
```

#### CSRF Prevention

```php
<?php

// Generate CSRF token
session_start();
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Validate token
if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    die('CSRF token validation failed');
}
```

### 9. Testing

#### PHPUnit Unit Testing

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

## Best Practices Quick Reference

| Category | Best Practice | Priority |
|----------|--------------|----------|
| **PHP Version** | Use PHP 8.1+ | High |
| **Dependency Management** | Use Composer for dependencies | High |
| **Coding Style** | Follow PER Coding Style | High |
| **Type Declarations** | Enable `declare(strict_types=1)` | High |
| **Type Hints** | Use type declarations for all function parameters and return values | High |
| **Password Security** | Use `password_hash()` and `password_verify()` | High |
| **SQL Security** | Always use prepared statements (PDO/MySQLi) | High |
| **XSS Prevention** | Use `htmlspecialchars()` on output | High |
| **Error Handling** | Use exceptions instead of error codes | High |
| **Date/Time** | Use `DateTimeImmutable` instead of `DateTime` | Medium |
| **Dependency Injection** | Inject dependencies via constructor | High |
| **Unit Testing** | Write tests covering core business logic | High |
| **Static Analysis** | Use PHPStan or Psalm | Medium |
| **Code Formatting** | Use Laravel Pint or PHP-CS-Fixer | Medium |
| **Namespaces** | Follow PSR-4 autoloading standard | High |
| **Configuration** | Use environment variables, don't hardcode sensitive info | High |
| **Logging** | Use PSR-3 compatible logging library (e.g., Monolog) | Medium |

### Code Quality Checklist

```bash
# 1. Code formatting
./vendor/bin/pint

# 2. Static analysis
./vendor/bin/phpstan analyse

# 3. Run tests
./vendor/bin/phpunit

# 4. Code coverage
./vendor/bin/phpunit --coverage-html coverage

# 5. Security check
composer audit
```

---

## Common Pitfalls

### 1. Not Using Type Declarations

**Don't**:

```php
<?php

// No type declarations, error-prone
function calculateTotal($price, $quantity)
{
    return $price * $quantity;
}

// May cause unexpected results
$total = calculateTotal('19.99', '3'); // String operation
```

**Do**:

```php
<?php

declare(strict_types=1);

// Explicit type declarations
function calculateTotal(float $price, int $quantity): float
{
    return $price * $quantity;
}

// Type errors throw exceptions immediately
$total = calculateTotal(19.99, 3); // Correct
```

### 2. Insecure Password Storage

**Don't**:

```php
<?php

// Storing plaintext passwords - extremely dangerous!
$query = "INSERT INTO users (username, password) VALUES (?, ?)";
$stmt->execute([$username, $password]);

// Using MD5 or SHA1 - insecure!
$hashedPassword = md5($password);
```

**Do**:

```php
<?php

declare(strict_types=1);

// Use password_hash() - secure and simple
$hashedPassword = password_hash($password, PASSWORD_ARGON2ID);

// Verify password
if (password_verify($password, $user['password'])) {
    // Password correct
}
```

### 3. SQL Injection Vulnerabilities

**Don't**:

```php
<?php

// Direct SQL concatenation - extremely dangerous!
$sql = "SELECT * FROM users WHERE email = '$email'";
$result = $pdo->query($sql);
```

**Do**:

```php
<?php

declare(strict_types=1);

// Always use prepared statements
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();
```

### 4. Not Using Dependency Injection

**Don't**:

```php
<?php

// Creating dependencies inside class - hard to test
class OrderService
{
    public function __construct()
    {
        // Hardcoded dependency
        $this->repository = new OrderRepository();
    }
}
```

**Do**:

```php
<?php

declare(strict_types=1);

// Inject dependencies via constructor
class OrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $repository,
    ) {
    }
}
```

### 5. Using DateTime Instead of DateTimeImmutable

**Don't**:

```php
<?php

// DateTime is mutable, may cause unexpected side effects
function processOrder(DateTime $orderDate): void
{
    $deliveryDate = $orderDate->modify('+3 days'); // Modifies original object!
}
```

**Do**:

```php
<?php

declare(strict_types=1);

// DateTimeImmutable is immutable, safer
function processOrder(DateTimeImmutable $orderDate): void
{
    $deliveryDate = $orderDate->modify('+3 days'); // Returns new object
}
```

### 6. Hardcoding Configuration and Sensitive Information

**Don't**:

```php
<?php

// Hardcoded database credentials - dangerous!
$pdo = new PDO(
    'mysql:host=localhost;dbname=myapp',
    'root',
    'password123' // Password exposed in code!
);
```

**Do**:

```php
<?php

declare(strict_types=1);

// Use environment variables
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

## Related Resources

### Official Resources

- [PHP The Right Way Official Website](https://phptherightway.com/)
- [PHP The Right Way GitHub](https://github.com/codeguy/php-the-right-way)
- [PHP Official Documentation](https://www.php.net/manual/en/)

### Recommended Tools

- [Composer](https://getcomposer.org/) - Dependency management
- [PHPUnit](https://phpunit.de/) - Unit testing
- [Pest](https://pestphp.com/) - Modern testing framework
- [PHPStan](https://phpstan.org/) - Static analysis
- [Psalm](https://psalm.dev/) - Static analysis
- [Laravel Pint](https://laravel.com/docs/pint) - Code formatting

### Recommended Packages

- [Symfony Components](https://symfony.com/components) - Reusable components
- [Guzzle](https://docs.guzzlephp.org/) - HTTP client
- [Monolog](https://github.com/Seldaek/monolog) - Logging library
- [Carbon](https://carbon.nesbot.com/) - Date/time library
- [Doctrine](https://www.doctrine-project.org/) - ORM and database tools

---

## FAQ

### Q: Is PHP The Right Way an official standard?

A: No, it's not an official standard but a community-driven best practices guide. It aggregates the experience and consensus of the PHP community.

### Q: Must I follow all these practices?

A: Not mandatory, but strongly recommended. These practices are community-verified and help you write better code.

### Q: How to promote these practices in a team?

A:
1. Share and discuss within the team
2. Configure automated tools to enforce standards
3. Reference these standards during code reviews
4. Regularly update team knowledge

### Q: Do these practices apply to all projects?

A: Most practices apply to all projects, but specific application should be adjusted based on project scale and requirements.
