# 轻量级架构规范 | Lightweight Architecture for Small Projects

> 适用于小型项目的简化架构方案
> Simplified architecture for small projects (< 5000 lines of code)

---

## 📋 目录 | Table of Contents

- [适用场景](#适用场景)
- [简化目录结构](#简化目录结构)
- [架构对比](#架构对比)
- [简化的依赖规则](#简化的依赖规则)
- [代码示例](#代码示例)
- [何时升级](#何时升级)
- [迁移指南](#迁移指南)
- [最佳实践](#最佳实践)

---

## 适用场景 | When to Use

### ✅ 适合使用轻量级架构

- **小型项目** - 预期代码量 < 5000 行
- **简单 CRUD** - 主要是数据库增删改查操作
- **快速原型** - 需要快速验证想法
- **个人项目** - 单人开发，不需要复杂协作
- **学习项目** - 学习 Webman 框架
- **业务规则简单** - 没有复杂的状态机、计算规则

### ❌ 不适合使用轻量级架构

- **中大型项目** - 预期代码量 > 5000 行
- **复杂业务逻辑** - 有状态机、权限系统、复杂计算
- **多人协作** - 团队开发，需要清晰的分层
- **长期维护** - 项目需要维护 2 年以上
- **需要测试** - 需要单元测试、集成测试

---

## 简化目录结构 | Simplified Directory Structure

### 完整目录树

```
app/
├── controller/              # HTTP 控制器
│   ├── api/                # API 控制器
│   │   └── UserController.php
│   └── web/                # Web 页面控制器
│       └── IndexController.php
│
├── model/                  # 数据模型（Eloquent ORM）
│   ├── User.php
│   ├── Post.php
│   └── Comment.php
│
├── service/                # 业务逻辑服务
│   ├── UserService.php
│   ├── PostService.php
│   └── CommentService.php
│
├── middleware/             # 中间件
│   ├── AuthMiddleware.php
│   └── CorsMiddleware.php
│
└── view/                   # 视图文件
    └── index/
        └── index.html

config/                     # 配置文件
├── app.php
├── database.php
└── redis.php

database/                   # 数据库
├── migrations/            # 迁移文件
└── seeders/               # 数据填充

tests/                      # 测试（可选）
└── Feature/
    └── UserTest.php
```

### 与完整架构的对比

| 目录 | 轻量级 | 完整架构 | 说明 |
|------|--------|---------|------|
| `controller/` | ✅ | ✅ | HTTP 入口 |
| `model/` | ✅ | ✅ | 数据模型 |
| `service/` | ✅ | ✅ | 业务逻辑 |
| `domain/` | ❌ | ✅ | 领域层（轻量级不需要） |
| `contract/` | ❌ | ✅ | 接口定义（轻量级不需要） |
| `infrastructure/` | ❌ | ✅ | 基础设施（轻量级不需要） |
| `repository/` | ❌ | ✅ | 仓储层（轻量级不需要） |

---

## 架构对比 | Architecture Comparison

### 轻量级架构 vs 完整架构

| 维度 | 轻量级架构 | 完整架构 |
|------|-----------|---------|
| **目录数量** | 3 层 (controller/model/service) | 7 层 (controller/service/domain/contract/infrastructure/repository/support) |
| **代码行数** | < 5000 行 | > 5000 行 |
| **学习曲线** | 低 - 1 天上手 | 中 - 1 周理解 |
| **开发速度** | 快 - 直接写代码 | 慢 - 需要设计分层 |
| **可测试性** | 低 - 依赖框架 | 高 - 领域层纯 PHP |
| **可维护性** | 中 - 适合小项目 | 高 - 适合大项目 |
| **扩展性** | 低 - 难以拆分 | 高 - 易于拆分 |
| **适用场景** | CRUD、原型、学习 | 复杂业务、长期维护 |

### 依赖关系对比

**轻量级架构**：
```
Controller → Service → Model
```

**完整架构**：
```
Controller → Service → Domain + Contract
                    ↓
            Infrastructure → Contract + Domain
```

---

## 简化的依赖规则 | Simplified Dependency Rules

### ✅ 允许的依赖

```
Controller → Service → Model
```

- **Controller** 只依赖 **Service**
- **Service** 可以依赖 **Model**
- **Model** 不依赖任何业务层

### ❌ 禁止的依赖

- ❌ **Controller** 直接依赖 **Model**（跳过 Service）
- ❌ **Model** 包含业务逻辑（只做数据映射）
- ❌ **Service** 之间循环依赖

### 为什么这样设计？

1. **Controller 薄** - 只做输入验证和输出格式化
2. **Service 胖** - 包含所有业务逻辑
3. **Model 纯** - 只做数据库映射，不包含业务规则

---

## 代码示例 | Code Examples

### 1. Controller - HTTP 入口

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
     * 获取用户列表
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
     * 创建用户
     */
    public function store(Request $request): Response
    {
        // 验证输入
        $validated = $this->validate($request, [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
        ]);

        // 调用服务层
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
     * 更新用户
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
     * 删除用户
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
        // 简化的验证逻辑
        // 实际项目中可以使用 webman-tech/laravel-validation
        return $request->all();
    }
}
```

### 2. Service - 业务逻辑

```php
<?php

declare(strict_types=1);

namespace app\service;

use app\model\User;
use support\Db;

final class UserService
{
    /**
     * 获取用户列表
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
     * 创建用户
     */
    public function createUser(string $name, string $email, string $password): User
    {
        // 业务规则：检查邮箱是否已存在
        if (User::where('email', $email)->exists()) {
            throw new \RuntimeException('Email already exists');
        }

        // 业务规则：密码加密
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        // 创建用户
        $user = new User();
        $user->name = $name;
        $user->email = $email;
        $user->password = $hashedPassword;
        $user->save();

        return $user;
    }

    /**
     * 更新用户
     */
    public function updateUser(int $id, array $data): User
    {
        $user = User::findOrFail($id);

        if (isset($data['name'])) {
            $user->name = $data['name'];
        }

        if (isset($data['email'])) {
            // 业务规则：检查新邮箱是否已被其他用户使用
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
     * 删除用户
     */
    public function deleteUser(int $id): void
    {
        $user = User::findOrFail($id);

        // 业务规则：删除用户前检查是否有关联数据
        if ($user->posts()->exists()) {
            throw new \RuntimeException('Cannot delete user with posts');
        }

        $user->delete();
    }

    /**
     * 根据邮箱查找用户
     */
    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }
}
```

### 3. Model - 数据模型

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
     * 用户的文章
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    /**
     * 用户的评论
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
```

---

## 何时升级 | When to Upgrade

### 升级信号 🚨

当出现以下情况时，考虑升级到完整架构：

#### 1. 代码量增长
- ✅ 单个 Service 文件超过 500 行
- ✅ 总代码量超过 5000 行
- ✅ Service 层有 10+ 个文件

#### 2. 业务复杂度增加
- ✅ 出现复杂的状态机（订单状态、工单状态）
- ✅ 需要复杂的权限控制（RBAC）
- ✅ 有复杂的计算规则（价格计算、优惠叠加）
- ✅ 需要领域事件（订单创建后触发多个操作）

#### 3. 测试需求
- ✅ 需要单元测试业务逻辑
- ✅ Service 层依赖太多外部服务，难以测试
- ✅ 需要 Mock 数据库进行测试

#### 4. 团队协作
- ✅ 团队人数 > 3 人
- ✅ 需要明确的分层和职责划分
- ✅ 代码审查时经常出现架构问题

#### 5. 可维护性问题
- ✅ Service 层代码重复严重
- ✅ 业务规则散落在多个地方
- ✅ 修改一个功能需要改多个文件

### 升级决策表

| 项目特征 | 轻量级 | 完整架构 |
|---------|--------|---------|
| 代码量 < 5000 行 | ✅ | - |
| 代码量 5000-10000 行 | ⚠️ | ✅ |
| 代码量 > 10000 行 | ❌ | ✅ |
| 简单 CRUD | ✅ | - |
| 有状态机 | ❌ | ✅ |
| 需要单元测试 | ❌ | ✅ |
| 单人开发 | ✅ | - |
| 团队开发 (3+ 人) | ❌ | ✅ |

---

## 迁移指南 | Migration Guide

### 从轻量级升级到完整架构

#### 步骤 1: 创建新目录

```bash
mkdir -p app/domain
mkdir -p app/contract
mkdir -p app/infrastructure
```

#### 步骤 2: 提取领域实体

**Before (轻量级)**:
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

**After (完整架构)**:
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

#### 步骤 3: 定义接口

```php
// app/contract/repository/OrderRepositoryInterface.php
interface OrderRepositoryInterface
{
    public function save(Order $order): void;
    public function findById(int $id): ?Order;
}
```

#### 步骤 4: 实现仓储

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

#### 步骤 5: 配置依赖注入

```php
// config/container.php
return [
    OrderRepositoryInterface::class => EloquentOrderRepository::class,
];
```

### 迁移检查清单

- [ ] 业务逻辑从 Service 移到 Domain
- [ ] 创建 Contract 接口
- [ ] 实现 Infrastructure 层
- [ ] 配置依赖注入
- [ ] 更新测试
- [ ] 更新文档

---

## 最佳实践 | Best Practices

### ✅ DO - 应该做的

1. **Controller 只做输入输出**
   ```php
   // ✅ Good
   public function store(Request $request): Response
   {
       $validated = $this->validate($request, [...]);
       $user = $this->userService->createUser(...$validated);
       return json(['data' => $user]);
   }
   ```

2. **Service 包含所有业务逻辑**
   ```php
   // ✅ Good
   public function createUser(string $name, string $email): User
   {
       // 业务规则：检查邮箱
       if ($this->emailExists($email)) {
           throw new \RuntimeException('Email exists');
       }

       // 业务规则：密码加密
       $password = $this->hashPassword($password);

       // 创建用户
       return User::create([...]);
   }
   ```

3. **Model 只做数据映射**
   ```php
   // ✅ Good
   final class User extends Model
   {
       protected $fillable = ['name', 'email', 'password'];

       public function posts(): HasMany
       {
           return $this->hasMany(Post::class);
       }
   }
   ```

4. **使用类型声明**
   ```php
   // ✅ Good
   public function createUser(string $name, string $email): User
   {
       // ...
   }
   ```

5. **使用命名参数**
   ```php
   // ✅ Good
   $user = $this->userService->createUser(
       name: $validated['name'],
       email: $validated['email']
   );
   ```

### ❌ DON'T - 不应该做的

1. **Controller 直接操作 Model**
   ```php
   // ❌ Bad
   public function store(Request $request): Response
   {
       $user = User::create($request->all());
       return json(['data' => $user]);
   }
   ```

2. **Model 包含业务逻辑**
   ```php
   // ❌ Bad
   final class User extends Model
   {
       public function createOrder(array $items): Order
       {
           // 业务逻辑不应该在 Model 里
       }
   }
   ```

3. **Service 之间循环依赖**
   ```php
   // ❌ Bad
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

4. **过度设计**
   ```php
   // ❌ Bad - 小项目不需要这么复杂
   interface UserRepositoryInterface {}
   interface UserServiceInterface {}
   interface UserFactoryInterface {}
   // ... 太多抽象层
   ```

5. **不使用类型声明**
   ```php
   // ❌ Bad
   public function createUser($name, $email)
   {
       // 没有类型声明
   }
   ```

---

## 相关文档 | Related Documentation

- [完整架构规范](./directory-structure.md)
- [依赖方向规则](./dependency-rules.md)
- [命名规范](./naming-conventions.md)
- [分层职责](./layer-responsibilities.md)

---

## 总结 | Summary

### 轻量级架构的核心原则

1. **简单优先** - 只用 Controller/Service/Model 三层
2. **快速开发** - 减少抽象层，直接写代码
3. **适时升级** - 当项目复杂度增加时，升级到完整架构
4. **保持纪律** - 即使是轻量级，也要遵守依赖方向

### 何时使用

- ✅ 小项目 (< 5000 行)
- ✅ 简单 CRUD
- ✅ 快速原型
- ✅ 学习项目

### 何时升级

- ❌ 代码量 > 5000 行
- ❌ 复杂业务逻辑
- ❌ 需要单元测试
- ❌ 团队协作 (3+ 人)

---

**最后更新**: 2026-02-03
