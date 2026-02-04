---
title: "Lightweight Architecture Specification"
description: "Simplified architecture for small projects"
---

# Lightweight Architecture Specification

> Simplified architecture for small projects (< 5000 lines of code)

---

## Table of Contents

- [When to Use](#when-to-use)
- [Simplified Directory Structure](#simplified-directory-structure)
- [Architecture Comparison](#architecture-comparison)
- [Simplified Dependency Rules](#simplified-dependency-rules)
- [Code Examples](#code-examples)
- [When to Upgrade](#when-to-upgrade)
- [Migration Guide](#migration-guide)
- [Best Practices](#best-practices)

---

## When to Use

### Suitable for Lightweight Architecture

- **Small projects** - Expected code < 5000 lines
- **Simple CRUD** - Mainly database CRUD operations
- **Rapid prototyping** - Need to quickly validate ideas
- **Personal projects** - Solo development, no complex collaboration needed
- **Learning projects** - Learning Webman framework
- **Simple business rules** - No complex state machines or calculation rules

### Not Suitable for Lightweight Architecture

- **Medium to large projects** - Expected code > 5000 lines
- **Complex business logic** - State machines, permission systems, complex calculations
- **Team collaboration** - Team development requiring clear layering
- **Long-term maintenance** - Projects needing maintenance for 2+ years
- **Testing requirements** - Need unit tests, integration tests

---

## Simplified Directory Structure

### Complete Directory Tree

```
app/
├── controller/              # HTTP Controllers
│   ├── api/                # API Controllers
│   │   └── UserController.php
│   └── web/                # Web Page Controllers
│       └── IndexController.php
│
├── model/                  # Data Models (Eloquent ORM)
│   ├── User.php
│   ├── Post.php
│   └── Comment.php
│
├── service/                # Business Logic Services
│   ├── UserService.php
│   ├── PostService.php
│   └── CommentService.php
│
├── middleware/             # Middleware
│   ├── AuthMiddleware.php
│   └── CorsMiddleware.php
│
└── view/                   # View Files
    └── index/
        └── index.html

config/                     # Configuration Files
├── app.php
├── database.php
└── redis.php

database/                   # Database
├── migrations/            # Migration Files
└── seeders/               # Data Seeders

tests/                      # Tests (Optional)
└── Feature/
    └── UserTest.php
```

### Comparison with Full Architecture

| Directory | Lightweight | Full Architecture | Description |
|-----------|-------------|-------------------|-------------|
| `controller/` | Yes | Yes | HTTP Entry |
| `model/` | Yes | Yes | Data Models |
| `service/` | Yes | Yes | Business Logic |
| `domain/` | No | Yes | Domain Layer (with entity/enum/vo/event/rule) |
| `contract/` | No | Yes | Interface Definitions (not needed for lightweight) |
| `infrastructure/` | No | Yes | Infrastructure (not needed for lightweight) |
| `repository/` | No | Yes | Repository Layer (not needed for lightweight) |

---

## Architecture Comparison

### Lightweight vs Full Architecture

| Dimension | Lightweight | Full Architecture |
|-----------|-------------|-------------------|
| **Directory Count** | 3 layers (controller/model/service) | 7 layers (controller/service/domain/contract/infrastructure/repository/support) |
| **Code Lines** | < 5000 lines | > 5000 lines |
| **Learning Curve** | Low - 1 day to start | Medium - 1 week to understand |
| **Development Speed** | Fast - write code directly | Slow - need to design layers |
| **Testability** | Low - depends on framework | High - domain layer is pure PHP |
| **Maintainability** | Medium - suitable for small projects | High - suitable for large projects |
| **Scalability** | Low - hard to split | High - easy to split |
| **Use Cases** | CRUD, prototypes, learning | Complex business, long-term maintenance |

### Dependency Relationship Comparison

**Lightweight Architecture**:
```
Controller → Service → Model
```

**Full Architecture**:
```
Controller → Service → Domain + Contract
                    ↓
            Infrastructure → Contract + Domain
```

---

## Simplified Dependency Rules

### Allowed Dependencies

```
Controller → Service → Model
```

- **Controller** only depends on **Service**
- **Service** can depend on **Model**
- **Model** doesn't depend on any business layer

### Forbidden Dependencies

- **Controller** directly depending on **Model** (skipping Service)
- **Model** containing business logic (only data mapping)
- Circular dependencies between **Services**

### Why This Design?

1. **Thin Controller** - Only input validation and output formatting
2. **Fat Service** - Contains all business logic
3. **Pure Model** - Only database mapping, no business rules

---

## Code Examples

### 1. Controller - HTTP Entry

```php
<?php

declare(strict_types=1);

namespace app\controller\api;

use app\service\UserService;
use support\Request;
use support\Response;

final class UserController
{
    public function __construct(
        private readonly UserService $userService
    ) {
    }

    /**
     * GET /api/users
     * Get user list
     */
    public function index(Request $request): Response
    {
        $page = (int) $request->get('page', 1);
        $perPage = (int) $request->get('per_page', 15);

        $users = $this->userService->getUsers($page, $perPage);

        return json([
            'data' => $users,
        ]);
    }

    /**
     * POST /api/users
     * Create user
     */
    public function store(Request $request): Response
    {
        // Validate input
        $validated = $this->validate($request, [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
        ]);

        // Call service layer
        $user = $this->userService->createUser(
            name: $validated['name'],
            email: $validated['email'],
            password: $validated['password']
        );

        return json([
            'data' => $user,
            'message' => 'User created successfully',
        ], 201);
    }

    /**
     * PUT /api/users/{id}
     * Update user
     */
    public function update(Request $request, int $id): Response
    {
        $validated = $this->validate($request, [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
        ]);

        $user = $this->userService->updateUser($id, $validated);

        return json([
            'data' => $user,
            'message' => 'User updated successfully',
        ]);
    }

    /**
     * DELETE /api/users/{id}
     * Delete user
     */
    public function destroy(Request $request, int $id): Response
    {
        $this->userService->deleteUser($id);

        return json([
            'message' => 'User deleted successfully',
        ], 204);
    }

    private function validate(Request $request, array $rules): array
    {
        // Simplified validation logic
        // In real projects, use webman-tech/laravel-validation
        return $request->all();
    }
}
```

### 2. Service - Business Logic

```php
<?php

declare(strict_types=1);

namespace app\service;

use app\model\User;
use support\Db;

final class UserService
{
    /**
     * Get user list
     */
    public function getUsers(int $page, int $perPage): array
    {
        $offset = ($page - 1) * $perPage;

        $users = User::query()
            ->offset($offset)
            ->limit($perPage)
            ->get();

        return $users->toArray();
    }

    /**
     * Create user
     */
    public function createUser(string $name, string $email, string $password): User
    {
        // Business rule: Check if email already exists
        if (User::where('email', $email)->exists()) {
            throw new \RuntimeException('Email already exists');
        }

        // Business rule: Hash password
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        // Create user
        $user = new User();
        $user->name = $name;
        $user->email = $email;
        $user->password = $hashedPassword;
        $user->save();

        return $user;
    }

    /**
     * Update user
     */
    public function updateUser(int $id, array $data): User
    {
        $user = User::findOrFail($id);

        if (isset($data['name'])) {
            $user->name = $data['name'];
        }

        if (isset($data['email'])) {
            // Business rule: Check if new email is used by another user
            $exists = User::where('email', $data['email'])
                ->where('id', '!=', $id)
                ->exists();

            if ($exists) {
                throw new \RuntimeException('Email already exists');
            }

            $user->email = $data['email'];
        }

        $user->save();

        return $user;
    }

    /**
     * Delete user
     */
    public function deleteUser(int $id): void
    {
        $user = User::findOrFail($id);

        // Business rule: Check for related data before deletion
        if ($user->posts()->exists()) {
            throw new \RuntimeException('Cannot delete user with posts');
        }

        $user->delete();
    }

    /**
     * Find user by email
     */
    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }
}
```

### 3. Model - Data Model

```php
<?php

declare(strict_types=1);

namespace app\model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class User extends Model
{
    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * User's posts
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    /**
     * User's comments
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
```

---

## When to Upgrade

### Upgrade Signals

Consider upgrading to full architecture when:

#### 1. Code Growth
- Single Service file exceeds 500 lines
- Total code exceeds 5000 lines
- Service layer has 10+ files

#### 2. Business Complexity Increases
- Complex state machines appear (order status, ticket status)
- Need complex permission control (RBAC)
- Complex calculation rules (pricing, discount stacking)
- Need domain events (multiple actions after order creation)

#### 3. Testing Requirements
- Need unit tests for business logic
- Service layer has too many external dependencies, hard to test
- Need to mock database for testing

#### 4. Team Collaboration
- Team size > 3 people
- Need clear layering and responsibility division
- Architecture issues frequently appear in code reviews

#### 5. Maintainability Issues
- Severe code duplication in Service layer
- Business rules scattered across multiple places
- Modifying one feature requires changing multiple files

### Upgrade Decision Table

| Project Characteristic | Lightweight | Full Architecture |
|------------------------|-------------|-------------------|
| Code < 5000 lines | Recommended | - |
| Code 5000-10000 lines | Caution | Recommended |
| Code > 10000 lines | Not Recommended | Recommended |
| Simple CRUD | Recommended | - |
| Has State Machine | Not Recommended | Recommended |
| Needs Unit Tests | Not Recommended | Recommended |
| Solo Development | Recommended | - |
| Team Development (3+) | Not Recommended | Recommended |

---

## Migration Guide

### Upgrading from Lightweight to Full Architecture

#### Step 1: Create New Directories

```bash
mkdir -p app/domain
mkdir -p app/contract
mkdir -p app/infrastructure
```

#### Step 2: Extract Domain Entities

**Before (Lightweight)**:
```php
// app/service/OrderService.php
public function createOrder(int $userId, array $items): Order
{
    $total = 0;
    foreach ($items as $item) {
        $total += $item['price'] * $item['quantity'];
    }

    $order = new Order();
    $order->user_id = $userId;
    $order->total = $total;
    $order->status = 'pending';
    $order->save();

    return $order;
}
```

**After (Full Architecture)**:
```php
// app/domain/order/entity/Order.php
final class Order
{
    public static function create(int $userId, array $items): self
    {
        $order = new self(
            userId: $userId,
            items: $items,
            status: OrderStatus::pending()
        );

        $order->calculateTotal();

        return $order;
    }

    public function calculateTotal(): void
    {
        $this->total = array_reduce(
            $this->items,
            fn ($carry, $item) => $carry + ($item['price'] * $item['quantity']),
            0
        );
    }
}

// app/service/order/CreateOrderService.php
public function handle(int $userId, array $items): Order
{
    return Db::transaction(function () use ($userId, $items) {
        $order = Order::create($userId, $items);
        $this->orderRepository->save($order);
        return $order;
    });
}
```

#### Step 3: Define Interfaces

```php
// app/contract/repository/OrderRepositoryInterface.php
interface OrderRepositoryInterface
{
    public function save(Order $order): void;
    public function findById(int $id): ?Order;
}
```

#### Step 4: Implement Repository

```php
// app/infrastructure/repository/eloquent/EloquentOrderRepository.php
final class EloquentOrderRepository implements OrderRepositoryInterface
{
    public function save(Order $order): void
    {
        $model = OrderModel::findOrNew($order->id());
        $model->user_id = $order->userId();
        $model->total = $order->total();
        $model->status = $order->status()->value();
        $model->save();
    }
}
```

#### Step 5: Configure Dependency Injection

```php
// config/container.php
return [
    OrderRepositoryInterface::class => EloquentOrderRepository::class,
];
```

### Migration Checklist

- [ ] Move business logic from Service to Domain
- [ ] Create Contract interfaces
- [ ] Implement Infrastructure layer
- [ ] Configure dependency injection
- [ ] Update tests
- [ ] Update documentation

---

## Best Practices

### DO - Should Do

1. **Controller only handles input/output**
   ```php
   // Good
   public function store(Request $request): Response
   {
       $validated = $this->validate($request, [...]);
       $user = $this->userService->createUser(...$validated);
       return json(['data' => $user]);
   }
   ```

2. **Service contains all business logic**
   ```php
   // Good
   public function createUser(string $name, string $email): User
   {
       // Business rule: Check email
       if ($this->emailExists($email)) {
           throw new \RuntimeException('Email exists');
       }

       // Business rule: Hash password
       $password = $this->hashPassword($password);

       // Create user
       return User::create([...]);
   }
   ```

3. **Model only does data mapping**
   ```php
   // Good
   final class User extends Model
   {
       protected $fillable = ['name', 'email', 'password'];

       public function posts(): HasMany
       {
           return $this->hasMany(Post::class);
       }
   }
   ```

4. **Use type declarations**
   ```php
   // Good
   public function createUser(string $name, string $email): User
   {
       // ...
   }
   ```

5. **Use named arguments**
   ```php
   // Good
   $user = $this->userService->createUser(
       name: $validated['name'],
       email: $validated['email']
   );
   ```

### DON'T - Should Not Do

1. **Controller directly operating Model**
   ```php
   // Bad
   public function store(Request $request): Response
   {
       $user = User::create($request->all());
       return json(['data' => $user]);
   }
   ```

2. **Model containing business logic**
   ```php
   // Bad
   final class User extends Model
   {
       public function createOrder(array $items): Order
       {
           // Business logic should not be in Model
       }
   }
   ```

3. **Circular dependencies between Services**
   ```php
   // Bad
   final class UserService
   {
       public function __construct(
           private readonly OrderService $orderService
       ) {}
   }

   final class OrderService
   {
       public function __construct(
           private readonly UserService $userService
       ) {}
   }
   ```

4. **Over-engineering**
   ```php
   // Bad - Small projects don't need this complexity
   interface UserRepositoryInterface {}
   interface UserServiceInterface {}
   interface UserFactoryInterface {}
   // ... too many abstraction layers
   ```

5. **Not using type declarations**
   ```php
   // Bad
   public function createUser($name, $email)
   {
       // No type declarations
   }
   ```

---

## Related Documentation

- [Full Architecture Specification](./directory-structure)
- [Dependency Direction Rules](./dependency-rules)
- [Naming Conventions](./naming-conventions)
- [Layer Responsibilities](./layer-responsibilities)

---

## Summary

### Core Principles of Lightweight Architecture

1. **Simplicity First** - Only use Controller/Service/Model three layers
2. **Fast Development** - Reduce abstraction layers, write code directly
3. **Timely Upgrade** - Upgrade to full architecture when complexity increases
4. **Maintain Discipline** - Even lightweight, follow dependency direction

### When to Use

- Small projects (< 5000 lines)
- Simple CRUD
- Rapid prototyping
- Learning projects

### When to Upgrade

- Code > 5000 lines
- Complex business logic
- Need unit tests
- Team collaboration (3+ people)
