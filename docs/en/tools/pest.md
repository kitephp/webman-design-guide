---
title: "Pest - Testing Framework"
description: "Elegant PHP testing framework that makes testing simple and enjoyable"
---

# Pest - Testing Framework

> Elegant PHP testing framework that makes testing simple and enjoyable

---

## Table of Contents

- [Introduction](#introduction)
- [Installation and Configuration](#installation-and-configuration)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Domain/Service/Controller Layer Tests](#domainservicecontroller-layer-tests)
- [Mocking and Assertions](#mocking-and-assertions)
- [CI Integration](#ci-integration)
- [Best Practices](#best-practices)

---

## Introduction

### What is Pest?

Pest is a modern testing framework built on top of PHPUnit, offering cleaner syntax and better developer experience.

**Key Features**:
- Clean test syntax
- Built-in Expectation API
- Parallel test execution
- Code coverage reports
- Plugin ecosystem
- Fully compatible with PHPUnit

### Pest vs PHPUnit

```php
<?php

// PHPUnit style
class OrderTest extends TestCase
{
    public function testCanCreateOrder(): void
    {
        $order = new Order(1, 'pending');

        $this->assertEquals(1, $order->getId());
        $this->assertEquals('pending', $order->getStatus());
    }
}

// Pest style
test('can create order', function () {
    $order = new Order(1, 'pending');

    expect($order->getId())->toBe(1)
        ->and($order->getStatus())->toBe('pending');
});
```

---

## Installation and Configuration

### Installation

```bash
# Install Pest
composer require --dev pestphp/pest --with-all-dependencies

# Install Pest plugins
composer require --dev pestphp/pest-plugin-laravel

# Initialize Pest
./vendor/bin/pest --init

# Verify installation
./vendor/bin/pest --version
```

### Configure Composer Scripts

Add to `composer.json`:

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

## Test Structure

### Directory Structure

```
tests/
├─ Unit/                    # Unit tests
│  ├─ Domain/               # Domain layer tests
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
│  ├─ Service/              # Service layer tests
│  │  ├─ Order/
│  │  │  ├─ CreateOrderServiceTest.php
│  │  │  └─ CancelOrderServiceTest.php
│  │  └─ User/
│  │
│  └─ Infrastructure/       # Infrastructure layer tests
│     └─ Repository/
│        └─ EloquentOrderRepositoryTest.php
│
├─ Feature/                 # Feature tests
│  ├─ Api/                  # API tests
│  │  └─ V1/
│  │     ├─ OrderControllerTest.php
│  │     └─ UserControllerTest.php
│  └─ Process/              # Process tests
│
├─ Pest.php                 # Pest configuration
└─ TestCase.php             # Base test class
```

### Pest.php Configuration

Create `tests/Pest.php`:

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
    // Test helper function
}
```

### TestCase.php

Create `tests/TestCase.php`:

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

        // Initialize test environment
    }

    protected function tearDown(): void
    {
        // Clean up test environment

        parent::tearDown();
    }
}
```

---

## Writing Tests

### Basic Syntax

```php
<?php

declare(strict_types=1);

// Simple test
test('basic test', function () {
    expect(true)->toBeTrue();
});

// Test with description
it('can do something', function () {
    expect(1 + 1)->toBe(2);
});

// Skip test
test('skipped test', function () {
    expect(true)->toBeTrue();
})->skip();

// Run only this test
test('only this test', function () {
    expect(true)->toBeTrue();
})->only();

// Todo test
test('todo test')->todo();
```

### Expectation API

```php
<?php

declare(strict_types=1);

test('expectation examples', function () {
    // Equality
    expect(1)->toBe(1);
    expect([1, 2])->toEqual([1, 2]);
    expect('hello')->toBeString();

    // Type checking
    expect(123)->toBeInt();
    expect(1.5)->toBeFloat();
    expect(true)->toBeBool();
    expect([])->toBeArray();
    expect(new stdClass())->toBeObject();

    // Null checking
    expect(null)->toBeNull();
    expect('')->toBeEmpty();
    expect([])->toBeEmpty();

    // Truthiness checking
    expect(true)->toBeTrue();
    expect(false)->toBeFalse();
    expect(1)->toBeTruthy();
    expect(0)->toBeFalsy();

    // Contains checking
    expect([1, 2, 3])->toContain(2);
    expect('hello world')->toContain('world');

    // Count checking
    expect([1, 2, 3])->toHaveCount(3);
    expect('hello')->toHaveLength(5);

    // Key checking
    expect(['name' => 'John'])->toHaveKey('name');
    expect(['name' => 'John'])->toHaveKeys(['name']);

    // Exception checking
    expect(fn () => throw new Exception('error'))
        ->toThrow(Exception::class);

    // Chained assertions
    expect($user)
        ->toBeInstanceOf(User::class)
        ->and($user->getName())->toBe('John')
        ->and($user->getAge())->toBeGreaterThan(18);
});
```

### Data Providers

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

// Named datasets
test('named datasets', function (int $value) {
    expect($value)->toBeGreaterThan(0);
})->with([
    'small' => [1],
    'medium' => [10],
    'large' => [100],
]);

// Dataset function
dataset('numbers', [1, 2, 3, 4, 5]);

test('uses dataset', function (int $number) {
    expect($number)->toBeInt();
})->with('numbers');
```

---

## Domain/Service/Controller Layer Tests

### Domain Layer Tests

#### Entity Tests

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

#### Value Object Tests

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

### Service Layer Tests

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
        // Create Mock objects
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

### Controller Layer Tests

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

## Mocking and Assertions

### Using Mockery

```php
<?php

declare(strict_types=1);

use Mockery;

test('mockery example', function () {
    // Create Mock
    $mock = Mockery::mock(SomeClass::class);

    // Set expectations
    $mock->shouldReceive('method')
        ->once()
        ->with('argument')
        ->andReturn('result');

    // Use Mock
    $result = $mock->method('argument');

    expect($result)->toBe('result');
});

// Partial Mock
test('partial mock', function () {
    $mock = Mockery::mock(SomeClass::class)->makePartial();

    $mock->shouldReceive('method')
        ->andReturn('mocked');

    // Other methods use real implementation
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

### Common Assertions

```php
<?php

declare(strict_types=1);

test('common assertions', function () {
    // Equality
    expect(1)->toBe(1);
    expect([1, 2])->toEqual([1, 2]);

    // Type
    expect($user)->toBeInstanceOf(User::class);
    expect(123)->toBeInt();

    // Truthiness
    expect(true)->toBeTrue();
    expect(false)->toBeFalse();

    // Null
    expect(null)->toBeNull();
    expect([])->toBeEmpty();

    // Contains
    expect([1, 2, 3])->toContain(2);

    // Count
    expect([1, 2, 3])->toHaveCount(3);

    // Exception
    expect(fn () => throw new Exception())
        ->toThrow(Exception::class);

    // Array keys
    expect(['name' => 'John'])->toHaveKey('name');

    // Comparison
    expect(10)->toBeGreaterThan(5);
    expect(5)->toBeLessThan(10);
    expect(5)->toBeGreaterThanOrEqual(5);
    expect(5)->toBeLessThanOrEqual(5);
});
```

---

## CI Integration

### GitHub Actions

Add to `.github/workflows/tests.yml`:

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

Add to `.gitlab-ci.yml`:

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

## Best Practices

### Recommended

1. **Use descriptive test names**
   ```php
   // Good
   test('can create order with valid items', function () {
       // ...
   });

   // Bad
   test('test1', function () {
       // ...
   });
   ```

2. **Follow AAA pattern**
   ```php
   test('example', function () {
       // Arrange - Prepare test data
       $user = new User('John');

       // Act - Execute operation
       $result = $user->getName();

       // Assert - Verify result
       expect($result)->toBe('John');
   });
   ```

3. **One test tests one thing**
   ```php
   // Good
   test('can create user', function () {
       $user = User::create('John');
       expect($user)->toBeInstanceOf(User::class);
   });

   test('user has correct name', function () {
       $user = User::create('John');
       expect($user->getName())->toBe('John');
   });

   // Bad
   test('user tests', function () {
       $user = User::create('John');
       expect($user)->toBeInstanceOf(User::class);
       expect($user->getName())->toBe('John');
       expect($user->getAge())->toBe(0);
       // Testing too many things
   });
   ```

4. **Use beforeEach and afterEach**
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

5. **Test boundary conditions**
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

6. **Use data providers to avoid repetition**
   ```php
   test('validates email', function (string $email, bool $valid) {
       expect(isValidEmail($email))->toBe($valid);
   })->with([
       ['test@example.com', true],
       ['invalid', false],
       ['@example.com', false],
   ]);
   ```

7. **Test exception cases**
   ```php
   test('throws exception for invalid input', function () {
       createOrder([]);
   })->throws(InvalidOrderException::class);
   ```

### Avoid

1. **Don't test framework code**
   ```php
   // Don't test Eloquent's save method
   test('can save model', function () {
       $model = new Model();
       $model->save();
       expect($model->exists)->toBeTrue();
   });
   ```

2. **Don't use real external services in tests**
   ```php
   // Wrong
   test('sends email', function () {
       sendEmail('test@example.com'); // Actually sends email
   });

   // Correct
   test('sends email', function () {
       $mailer = Mockery::mock(Mailer::class);
       $mailer->shouldReceive('send')->once();
   });
   ```

3. **Don't depend on test execution order**
   ```php
   // Wrong - depends on other tests
   test('test 1', function () {
       $this->user = User::create('John');
   });

   test('test 2', function () {
       expect($this->user)->toBeInstanceOf(User::class);
   });
   ```

4. **Don't ignore failing tests**
   ```php
   // Wrong
   test('broken test', function () {
       // ...
   })->skip('TODO: fix later');
   ```

5. **Don't over-mock**
   ```php
   // Over-mocking
   test('example', function () {
       $mock1 = Mockery::mock(Class1::class);
       $mock2 = Mockery::mock(Class2::class);
       $mock3 = Mockery::mock(Class3::class);
       // Too many mocks, test becomes fragile
   });
   ```

---

## Workflow Examples

### TDD Workflow

```bash
# 1. Write failing test
vim tests/Unit/Domain/Order/Entity/OrderTest.php

# 2. Run test (should fail)
composer test

# 3. Write minimal code to pass test
vim app/domain/order/entity/Order.php

# 4. Run test (should pass)
composer test

# 5. Refactor code
vim app/domain/order/entity/Order.php

# 6. Run test again (ensure still passing)
composer test

# 7. Commit
git add .
git commit -m "feat: add Order entity"
```

### Complete Test Flow

```bash
# 1. Run all tests
composer test

# 2. Run unit tests
composer test:unit

# 3. Run feature tests
composer test:feature

# 4. Generate coverage report
composer test:coverage

# 5. Run tests in parallel
composer test:parallel
```

---

## Related Documentation

- [Laravel Pint Code Formatting](./pint)
- [PHPStan Static Analysis](./phpstan)
- [Rector Auto Refactoring](./rector)
- [CI/CD Pipeline](./ci-pipeline)

---

## Reference Resources

- [Pest Official Documentation](https://pestphp.com/)
- [Pest Plugins](https://pestphp.com/docs/plugins)
- [Mockery Documentation](http://docs.mockery.io/)
- [PHPUnit Documentation](https://phpunit.de/)
