---
title: "Pest - 测试框架"
description: "优雅的 PHP 测试框架，让测试变得简单愉快"
---

# Pest - 测试框架

> 优雅的 PHP 测试框架，让测试变得简单愉快

---

## 目录

- [简介](#简介)
- [安装与配置](#安装与配置)
- [测试结构](#测试结构)
- [编写测试](#编写测试)
- [Domain/Service/Controller 层测试](#domainservicecontroller-层测试)
- [Mocking 和断言](#mocking-和断言)
- [CI 集成](#ci-集成)
- [最佳实践](#最佳实践)

---

## 简介

### 什么是 Pest？

Pest 是一个基于 PHPUnit 的现代化测试框架，提供更简洁的语法和更好的开发体验。

**核心特性**：
- 简洁的测试语法
- 内置 Expectation API
- 并行测试执行
- 代码覆盖率报告
- 插件生态系统
- 完全兼容 PHPUnit

### Pest vs PHPUnit

```php
<?php

// PHPUnit 风格
class OrderTest extends TestCase
{
    public function testCanCreateOrder(): void
    {
        $order = new Order(1, 'pending');

        $this->assertEquals(1, $order->getId());
        $this->assertEquals('pending', $order->getStatus());
    }
}

// Pest 风格
test('can create order', function () {
    $order = new Order(1, 'pending');

    expect($order->getId())->toBe(1)
        ->and($order->getStatus())->toBe('pending');
});
```

---

## 安装与配置

### 安装

```bash
# 安装 Pest
composer require --dev pestphp/pest --with-all-dependencies

# 安装 Pest 插件
composer require --dev pestphp/pest-plugin-laravel

# 初始化 Pest
./vendor/bin/pest --init

# 验证安装
./vendor/bin/pest --version
```

### 配置 Composer Scripts

在 `composer.json` 中添加：

```json
{
    "scripts": {
        "test": "pest",
        "test:unit": "pest --testsuite=Unit",
        "test:feature": "pest --testsuite=Feature",
        "test:coverage": "pest --coverage --min=80",
        "test:parallel": "pest --parallel"
    },
    "scripts-descriptions": {
        "test": "Run all tests",
        "test:unit": "Run unit tests only",
        "test:feature": "Run feature tests only",
        "test:coverage": "Run tests with coverage report",
        "test:parallel": "Run tests in parallel"
    }
}
```

---

## 测试结构

### 目录结构

```
tests/
├─ Unit/                    # 单元测试
│  ├─ Domain/               # 领域层测试
│  │  ├─ Order/
│  │  │  ├─ Entity/
│  │  │  │  └─ OrderTest.php
│  │  │  ├─ Enum/
│  │  │  │  └─ OrderStatusTest.php
│  │  │  ├─ Vo/
│  │  │  │  └─ MoneyTest.php
│  │  │  └─ Rule/
│  │  │     └─ OrderCancellationRuleTest.php
│  │  └─ User/
│  │
│  ├─ Service/              # 服务层测试
│  │  ├─ Order/
│  │  │  ├─ CreateOrderServiceTest.php
│  │  │  └─ CancelOrderServiceTest.php
│  │  └─ User/
│  │
│  └─ Infrastructure/       # 基础设施层测试
│     └─ Repository/
│        └─ EloquentOrderRepositoryTest.php
│
├─ Feature/                 # 功能测试
│  ├─ Api/                  # API 测试
│  │  └─ V1/
│  │     ├─ OrderControllerTest.php
│  │     └─ UserControllerTest.php
│  └─ Process/              # 进程测试
│
├─ Pest.php                 # Pest 配置
└─ TestCase.php             # 基础测试类
```

### Pest.php 配置

创建 `tests/Pest.php`：

```php
<?php

declare(strict_types=1);

use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
*/

uses(TestCase::class)->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
*/

function something(): void
{
    // 测试辅助函数
}
```

### TestCase.php

创建 `tests/TestCase.php`：

```php
<?php

declare(strict_types=1);

namespace Tests;

use PHPUnit\Framework\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // 初始化测试环境
    }

    protected function tearDown(): void
    {
        // 清理测试环境

        parent::tearDown();
    }
}
```

---

## 编写测试

### 基本语法

```php
<?php

declare(strict_types=1);

// 简单测试
test('basic test', function () {
    expect(true)->toBeTrue();
});

// 带描述的测试
it('can do something', function () {
    expect(1 + 1)->toBe(2);
});

// 跳过测试
test('skipped test', function () {
    expect(true)->toBeTrue();
})->skip();

// 仅运行此测试
test('only this test', function () {
    expect(true)->toBeTrue();
})->only();

// 待办测试
test('todo test')->todo();
```

### Expectation API

```php
<?php

declare(strict_types=1);

test('expectation examples', function () {
    // 相等性
    expect(1)->toBe(1);
    expect([1, 2])->toEqual([1, 2]);
    expect('hello')->toBeString();

    // 类型检查
    expect(123)->toBeInt();
    expect(1.5)->toBeFloat();
    expect(true)->toBeBool();
    expect([])->toBeArray();
    expect(new stdClass())->toBeObject();

    // 空值检查
    expect(null)->toBeNull();
    expect('')->toBeEmpty();
    expect([])->toBeEmpty();

    // 真值检查
    expect(true)->toBeTrue();
    expect(false)->toBeFalse();
    expect(1)->toBeTruthy();
    expect(0)->toBeFalsy();

    // 包含检查
    expect([1, 2, 3])->toContain(2);
    expect('hello world')->toContain('world');

    // 数量检查
    expect([1, 2, 3])->toHaveCount(3);
    expect('hello')->toHaveLength(5);

    // 键检查
    expect(['name' => 'John'])->toHaveKey('name');
    expect(['name' => 'John'])->toHaveKeys(['name']);

    // 异常检查
    expect(fn () => throw new Exception('error'))
        ->toThrow(Exception::class);

    // 链式断言
    expect($user)
        ->toBeInstanceOf(User::class)
        ->and($user->getName())->toBe('John')
        ->and($user->getAge())->toBeGreaterThan(18);
});
```

### 数据提供者

```php
<?php

declare(strict_types=1);

test('addition', function (int $a, int $b, int $expected) {
    expect($a + $b)->toBe($expected);
})->with([
    [1, 2, 3],
    [2, 3, 5],
    [5, 5, 10],
]);

// 命名数据集
test('named datasets', function (int $value) {
    expect($value)->toBeGreaterThan(0);
})->with([
    'small' => [1],
    'medium' => [10],
    'large' => [100],
]);

// 数据提供者函数
dataset('numbers', [1, 2, 3, 4, 5]);

test('uses dataset', function (int $number) {
    expect($number)->toBeInt();
})->with('numbers');
```

---

## Domain/Service/Controller 层测试

### Domain 层测试

#### 实体测试

```php
<?php

declare(strict_types=1);

use app\domain\order\entity\Order;
use app\domain\order\vo\Money;
use app\domain\order\enum\OrderStatus;
use app\domain\order\exception\InvalidOrderException;

describe('Order Entity', function () {
    test('can create order', function () {
        $order = Order::create(
            userId: 1,
            items: [
                ['id' => 1, 'price' => 1000, 'quantity' => 2],
            ],
            shippingAddress: ['city' => 'Beijing']
        );

        expect($order)
            ->toBeInstanceOf(Order::class)
            ->and($order->userId())->toBe(1)
            ->and($order->status() === OrderStatus::Pending)->toBeTrue();
    });

    test('can calculate total', function () {
        $order = Order::create(
            userId: 1,
            items: [
                ['id' => 1, 'price' => 1000, 'quantity' => 2],
                ['id' => 2, 'price' => 500, 'quantity' => 1],
            ],
            shippingAddress: ['city' => 'Beijing']
        );

        $order->calculateTotal();

        expect($order->totalAmount())
            ->toEqual(Money::fromCents(2500));
    });

    test('cannot create order with empty items', function () {
        Order::create(
            userId: 1,
            items: [],
            shippingAddress: ['city' => 'Beijing']
        );
    })->throws(InvalidOrderException::class, 'Order must have at least one item');

    test('can cancel pending order', function () {
        $order = Order::create(
            userId: 1,
            items: [['id' => 1, 'price' => 1000, 'quantity' => 1]],
            shippingAddress: ['city' => 'Beijing']
        );

        $order->cancel();

        expect($order->status() === OrderStatus::Cancelled)->toBeTrue();
    });

    test('cannot cancel shipped order', function () {
        $order = Order::create(
            userId: 1,
            items: [['id' => 1, 'price' => 1000, 'quantity' => 1]],
            shippingAddress: ['city' => 'Beijing']
        );

        $order->ship();
        $order->cancel();
    })->throws(InvalidOrderException::class);
});
```

#### 值对象测试

```php
<?php

declare(strict_types=1);

use app\domain\order\vo\Money;

describe('Money Value Object', function () {
    test('can create from cents', function () {
        $money = Money::fromCents(1000);

        expect($money->toCents())->toBe(1000)
            ->and($money->toDollars())->toBe(10.0);
    });

    test('can create from dollars', function () {
        $money = Money::fromDollars(10.5);

        expect($money->toCents())->toBe(1050)
            ->and($money->toDollars())->toBe(10.5);
    });

    test('can add money', function () {
        $money1 = Money::fromCents(1000);
        $money2 = Money::fromCents(500);

        $result = $money1->add($money2);

        expect($result->toCents())->toBe(1500);
    });

    test('can subtract money', function () {
        $money1 = Money::fromCents(1000);
        $money2 = Money::fromCents(300);

        $result = $money1->subtract($money2);

        expect($result->toCents())->toBe(700);
    });

    test('cannot create negative money', function () {
        Money::fromCents(-100);
    })->throws(InvalidArgumentException::class);

    test('money is immutable', function () {
        $money1 = Money::fromCents(1000);
        $money2 = $money1->add(Money::fromCents(500));

        expect($money1->toCents())->toBe(1000)
            ->and($money2->toCents())->toBe(1500);
    });
});
```

### Service 层测试

```php
<?php

declare(strict_types=1);

use app\service\order\CreateOrderService;
use app\contract\repository\OrderRepositoryInterface;
use app\contract\repository\UserRepositoryInterface;
use app\contract\gateway\PaymentGatewayInterface;
use app\domain\order\entity\Order;
use app\domain\user\entity\User;

describe('CreateOrderService', function () {
    beforeEach(function () {
        // 创建 Mock 对象
        $this->orderRepository = Mockery::mock(OrderRepositoryInterface::class);
        $this->userRepository = Mockery::mock(UserRepositoryInterface::class);
        $this->paymentGateway = Mockery::mock(PaymentGatewayInterface::class);

        $this->service = new CreateOrderService(
            $this->orderRepository,
            $this->userRepository,
            $this->paymentGateway
        );
    });

    afterEach(function () {
        Mockery::close();
    });

    test('can create order', function () {
        // Arrange
        $userId = 1;
        $items = [
            ['id' => 1, 'price' => 1000, 'quantity' => 2],
        ];
        $shippingAddress = ['city' => 'Beijing'];

        $user = Mockery::mock(User::class);
        $user->shouldReceive('id')->andReturn($userId);

        $this->userRepository
            ->shouldReceive('findById')
            ->with($userId)
            ->once()
            ->andReturn($user);

        $this->orderRepository
            ->shouldReceive('save')
            ->once()
            ->andReturnUsing(function ($order) {
                expect($order)->toBeInstanceOf(Order::class);
                return null;
            });

        $this->paymentGateway
            ->shouldReceive('createPaymentIntent')
            ->once();

        // Act
        $order = $this->service->handle($userId, $items, $shippingAddress);

        // Assert
        expect($order)->toBeInstanceOf(Order::class);
    });

    test('throws exception when user not found', function () {
        $this->userRepository
            ->shouldReceive('findById')
            ->andReturn(null);

        $this->service->handle(999, [], []);
    })->throws(Exception::class);
});
```

### Controller 层测试

```php
<?php

declare(strict_types=1);

use app\controller\api\v1\OrderController;
use app\service\order\CreateOrderService;
use support\Request;
use support\Response;

describe('OrderController', function () {
    beforeEach(function () {
        $this->createOrderService = Mockery::mock(CreateOrderService::class);
        $this->controller = new OrderController($this->createOrderService);
    });

    afterEach(function () {
        Mockery::close();
    });

    test('can create order', function () {
        // Arrange
        $request = Mockery::mock(Request::class);
        $request->shouldReceive('post')
            ->with('items')
            ->andReturn([
                ['id' => 1, 'price' => 1000, 'quantity' => 2],
            ]);
        $request->shouldReceive('post')
            ->with('shipping_address')
            ->andReturn(['city' => 'Beijing']);
        $request->shouldReceive('user->id')
            ->andReturn(1);

        $order = Mockery::mock(Order::class);
        $order->shouldReceive('toArray')
            ->andReturn(['id' => 1, 'status' => 'pending']);

        $this->createOrderService
            ->shouldReceive('handle')
            ->once()
            ->andReturn($order);

        // Act
        $response = $this->controller->create($request);

        // Assert
        expect($response)->toBeInstanceOf(Response::class);
    });

    test('returns validation error for invalid input', function () {
        $request = Mockery::mock(Request::class);
        $request->shouldReceive('post')
            ->with('items')
            ->andReturn(null);

        $response = $this->controller->create($request);

        expect($response->getStatusCode())->toBe(422);
    });
});
```

---

## Mocking 和断言

### 使用 Mockery

```php
<?php

declare(strict_types=1);

use Mockery;

test('mockery example', function () {
    // 创建 Mock
    $mock = Mockery::mock(SomeClass::class);

    // 设置期望
    $mock->shouldReceive('method')
        ->once()
        ->with('argument')
        ->andReturn('result');

    // 使用 Mock
    $result = $mock->method('argument');

    expect($result)->toBe('result');
});

// 部分 Mock
test('partial mock', function () {
    $mock = Mockery::mock(SomeClass::class)->makePartial();

    $mock->shouldReceive('method')
        ->andReturn('mocked');

    // 其他方法使用真实实现
    expect($mock->method())->toBe('mocked');
});

// Spy
test('spy example', function () {
    $spy = Mockery::spy(SomeClass::class);

    $spy->method('argument');

    $spy->shouldHaveReceived('method')
        ->once()
        ->with('argument');
});
```

### 常用断言

```php
<?php

declare(strict_types=1);

test('common assertions', function () {
    // 相等性
    expect(1)->toBe(1);
    expect([1, 2])->toEqual([1, 2]);

    // 类型
    expect($user)->toBeInstanceOf(User::class);
    expect(123)->toBeInt();

    // 真值
    expect(true)->toBeTrue();
    expect(false)->toBeFalse();

    // 空值
    expect(null)->toBeNull();
    expect([])->toBeEmpty();

    // 包含
    expect([1, 2, 3])->toContain(2);

    // 数量
    expect([1, 2, 3])->toHaveCount(3);

    // 异常
    expect(fn () => throw new Exception())
        ->toThrow(Exception::class);

    // 数组键
    expect(['name' => 'John'])->toHaveKey('name');

    // 大小比较
    expect(10)->toBeGreaterThan(5);
    expect(5)->toBeLessThan(10);
    expect(5)->toBeGreaterThanOrEqual(5);
    expect(5)->toBeLessThanOrEqual(5);
});
```

---

## CI 集成

### GitHub Actions

在 `.github/workflows/tests.yml` 中添加：

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  tests:
    name: Pest Tests
    runs-on: ubuntu-latest

    strategy:
      matrix:
        php: [8.1, 8.2, 8.3]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: ${{ matrix.php }}
          extensions: mbstring, pdo, pdo_mysql, redis
          coverage: xdebug

      - name: Install dependencies
        run: composer install --prefer-dist --no-progress --no-interaction

      - name: Run tests
        run: ./vendor/bin/pest --coverage --min=80

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml
```

### GitLab CI

在 `.gitlab-ci.yml` 中添加：

```yaml
test:
  stage: test
  image: php:8.3-cli
  before_script:
    - curl -sS https://getcomposer.org/installer | php
    - php composer.phar install --prefer-dist --no-progress
  script:
    - ./vendor/bin/pest --coverage --min=80
  coverage: '/^\s*Lines:\s*\d+.\d+\%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml
```

---

## 最佳实践

### 推荐做法

1. **使用描述性测试名称**
   ```php
   // 好
   test('can create order with valid items', function () {
       // ...
   });

   // 差
   test('test1', function () {
       // ...
   });
   ```

2. **遵循 AAA 模式**
   ```php
   test('example', function () {
       // Arrange - 准备测试数据
       $user = new User('John');

       // Act - 执行操作
       $result = $user->getName();

       // Assert - 验证结果
       expect($result)->toBe('John');
   });
   ```

3. **一个测试只测一件事**
   ```php
   // 好
   test('can create user', function () {
       $user = User::create('John');
       expect($user)->toBeInstanceOf(User::class);
   });

   test('user has correct name', function () {
       $user = User::create('John');
       expect($user->getName())->toBe('John');
   });

   // 差
   test('user tests', function () {
       $user = User::create('John');
       expect($user)->toBeInstanceOf(User::class);
       expect($user->getName())->toBe('John');
       expect($user->getAge())->toBe(0);
       // 测试太多东西
   });
   ```

4. **使用 beforeEach 和 afterEach**
   ```php
   beforeEach(function () {
       $this->user = User::create('John');
   });

   afterEach(function () {
       Mockery::close();
   });

   test('example', function () {
       expect($this->user->getName())->toBe('John');
   });
   ```

5. **测试边界条件**
   ```php
   test('handles empty array', function () {
       expect(calculateTotal([]))->toBe(0);
   });

   test('handles null value', function () {
       expect(processUser(null))->toBeNull();
   });

   test('handles large numbers', function () {
       expect(calculate(PHP_INT_MAX))->toBeInt();
   });
   ```

6. **使用数据提供者避免重复**
   ```php
   test('validates email', function (string $email, bool $valid) {
       expect(isValidEmail($email))->toBe($valid);
   })->with([
       ['test@example.com', true],
       ['invalid', false],
       ['@example.com', false],
   ]);
   ```

7. **测试异常情况**
   ```php
   test('throws exception for invalid input', function () {
       createOrder([]);
   })->throws(InvalidOrderException::class);
   ```

### 避免做法

1. **不要测试框架代码**
   ```php
   // 不要测试 Eloquent 的 save 方法
   test('can save model', function () {
       $model = new Model();
       $model->save();
       expect($model->exists)->toBeTrue();
   });
   ```

2. **不要在测试中使用真实的外部服务**
   ```php
   // 错误
   test('sends email', function () {
       sendEmail('test@example.com'); // 真实发送邮件
   });

   // 正确
   test('sends email', function () {
       $mailer = Mockery::mock(Mailer::class);
       $mailer->shouldReceive('send')->once();
   });
   ```

3. **不要依赖测试执行顺序**
   ```php
   // 错误 - 依赖其他测试
   test('test 1', function () {
       $this->user = User::create('John');
   });

   test('test 2', function () {
       expect($this->user)->toBeInstanceOf(User::class);
   });
   ```

4. **不要忽略失败的测试**
   ```php
   // 错误
   test('broken test', function () {
       // ...
   })->skip('TODO: fix later');
   ```

5. **不要过度 Mock**
   ```php
   // 过度 Mock
   test('example', function () {
       $mock1 = Mockery::mock(Class1::class);
       $mock2 = Mockery::mock(Class2::class);
       $mock3 = Mockery::mock(Class3::class);
       // 太多 Mock，测试变得脆弱
   });
   ```

---

## 工作流示例

### TDD 工作流

```bash
# 1. 编写失败的测试
vim tests/Unit/Domain/Order/Entity/OrderTest.php

# 2. 运行测试（应该失败）
composer test

# 3. 编写最少的代码使测试通过
vim app/domain/order/entity/Order.php

# 4. 运行测试（应该通过）
composer test

# 5. 重构代码
vim app/domain/order/entity/Order.php

# 6. 再次运行测试（确保仍然通过）
composer test

# 7. 提交
git add .
git commit -m "feat: add Order entity"
```

### 完整测试流程

```bash
# 1. 运行所有测试
composer test

# 2. 运行单元测试
composer test:unit

# 3. 运行功能测试
composer test:feature

# 4. 生成覆盖率报告
composer test:coverage

# 5. 并行运行测试
composer test:parallel
```

---

## 相关文档

- [Laravel Pint 代码格式化](./pint)
- [PHPStan 静态分析](./phpstan)
- [Rector 自动重构](./rector)
- [CI/CD 流水线](./ci-pipeline)

---

## 参考资源

- [Pest 官方文档](https://pestphp.com/)
- [Pest 插件](https://pestphp.com/docs/plugins)
- [Mockery 文档](http://docs.mockery.io/)
- [PHPUnit 文档](https://phpunit.de/)
