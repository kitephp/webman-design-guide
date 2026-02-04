---
title: "后台管理系统示例"
description: "完整的后台管理系统架构示例，展示用户管理、权限控制、系统配置"
---

## 目录

- [系统概述](#系统概述)
- [完整目录树](#完整目录树)
- [模块划分](#模块划分)
- [关键代码示例](#关键代码示例)

---

## 系统概述

### 核心功能

- 用户管理 - CRUD、批量操作
- 角色权限 - RBAC 权限控制
- 菜单管理 - 动态菜单配置
- 操作日志 - 审计追踪
- 系统配置 - 参数配置
- 数据字典 - 枚举值管理

### 技术特点

- RBAC 权限模型
- 操作日志记录
- 数据权限过滤
- 动态菜单生成
- 配置热更新

---

## 完整目录树

```
app/
├── controller/
│   └── admin/
│       ├── UserController.php              # 用户管理
│       ├── RoleController.php              # 角色管理
│       ├── PermissionController.php        # 权限管理
│       ├── MenuController.php              # 菜单管理
│       ├── LogController.php               # 日志查询
│       ├── ConfigController.php            # 系统配置
│       └── DashboardController.php         # 仪表盘
│
├── model/
│   └── eloquent/
│       ├── User.php                        # 用户模型
│       ├── Role.php                        # 角色模型
│       ├── Permission.php                  # 权限模型
│       ├── Menu.php                        # 菜单模型
│       ├── OperationLog.php                # 操作日志模型
│       └── SystemConfig.php                # 系统配置模型
│
├── service/
│   ├── user/
│   │   ├── CreateUserService.php           # 创建用户
│   │   ├── UpdateUserService.php           # 更新用户
│   │   ├── DeleteUserService.php           # 删除用户
│   │   └── AssignRoleService.php           # 分配角色
│   ├── role/
│   │   ├── CreateRoleService.php           # 创建角色
│   │   ├── AssignPermissionService.php     # 分配权限
│   │   └── DeleteRoleService.php           # 删除角色
│   ├── permission/
│   │   └── CheckPermissionService.php      # 权限检查
│   ├── menu/
│   │   ├── BuildMenuTreeService.php        # 构建菜单树
│   │   └── SyncMenuService.php             # 同步菜单
│   └── log/
│       └── RecordOperationLogService.php   # 记录操作日志
│
├── domain/
│   ├── user/
│   │   ├── entity/
│   │   │   └── User.php                    # 用户实体
│   │   ├── enum/                           # 枚举
│   │   │   └── UserStatus.php              # 用户状态
│   │   ├── vo/                             # 值对象
│   │   │   ├── Username.php                # 用户名
│   │   │   └── Password.php                # 密码
│   │   ├── event/
│   │   │   ├── UserCreated.php
│   │   │   ├── UserDeleted.php
│   │   │   └── UserRoleChanged.php
│   │   └── rule/
│   │       └── UserDeletionRule.php        # 删除规则
│   │
│   ├── role/
│   │   ├── entity/
│   │   │   └── Role.php                    # 角色实体
│   │   ├── enum/                           # 枚举
│   │   │   └── RoleType.php                # 角色类型
│   │   ├── vo/                             # 值对象
│   │   │   └── RoleCode.php                # 角色编码
│   │   └── rule/
│   │       └── RoleAssignmentRule.php      # 角色分配规则
│   │
│   ├── permission/
│   │   ├── entity/
│   │   │   └── Permission.php              # 权限实体
│   │   ├── enum/                           # 枚举
│   │   │   └── PermissionType.php          # 权限类型
│   │   ├── vo/                             # 值对象
│   │   │   └── PermissionCode.php          # 权限编码
│   │   └── rule/
│   │       └── PermissionCheckRule.php     # 权限检查规则
│   │
│   ├── menu/
│   │   ├── entity/
│   │   │   └── Menu.php                    # 菜单实体
│   │   ├── vo/                             # 值对象
│   │   │   ├── MenuPath.php                # 菜单路径
│   │   │   └── MenuIcon.php                # 菜单图标
│   │   └── rule/
│   │       └── MenuHierarchyRule.php       # 菜单层级规则
│   │
│   └── log/
│       ├── entity/
│       │   └── OperationLog.php            # 操作日志实体
│       ├── enum/                           # 枚举
│       │   └── OperationType.php           # 操作类型
│       └── vo/                             # 值对象
│           └── IpAddress.php               # IP地址
│
├── contract/
│   ├── repository/
│   │   ├── UserRepositoryInterface.php
│   │   ├── RoleRepositoryInterface.php
│   │   ├── PermissionRepositoryInterface.php
│   │   ├── MenuRepositoryInterface.php
│   │   └── OperationLogRepositoryInterface.php
│   └── service/
│       ├── PasswordHasherInterface.php     # 密码加密接口
│       └── PermissionCheckerInterface.php  # 权限检查接口
│
├── infrastructure/
│   ├── repository/
│   │   └── eloquent/
│   │       ├── EloquentUserRepository.php
│   │       ├── EloquentRoleRepository.php
│   │       ├── EloquentPermissionRepository.php
│   │       ├── EloquentMenuRepository.php
│   │       └── EloquentOperationLogRepository.php
│   ├── service/
│   │   ├── BcryptPasswordHasher.php        # Bcrypt 密码加密
│   │   └── RbacPermissionChecker.php       # RBAC 权限检查
│   └── cache/
│       ├── RedisPermissionCache.php        # 权限缓存
│       └── RedisMenuCache.php              # 菜单缓存
│
├── middleware/
│   ├── auth/
│   │   ├── AuthenticateMiddleware.php      # 认证中间件
│   │   └── CheckPermissionMiddleware.php   # 权限检查中间件
│   └── log/
│       └── OperationLogMiddleware.php      # 操作日志中间件
│
├── process/
│   └── task/
│       ├── CleanupOldLogsTask.php          # 清理旧日志
│       └── SyncPermissionCacheTask.php     # 同步权限缓存
│
└── support/
    ├── exception/
    │   ├── UserNotFoundException.php
    │   ├── PermissionDeniedException.php
    │   └── InvalidPasswordException.php
    └── helper/
        └── permission_helper.php
```

---

## 模块划分

### 1. 用户管理模块

**功能**: 用户 CRUD、状态管理、角色分配

**核心类**:
- `domain/user/entity/User.php` - 用户实体
- `service/user/CreateUserService.php` - 创建用户服务
- `service/user/AssignRoleService.php` - 角色分配服务

### 2. 角色权限模块

**功能**: RBAC 权限控制、角色管理、权限分配

**核心类**:
- `domain/role/entity/Role.php` - 角色实体
- `domain/permission/entity/Permission.php` - 权限实体
- `service/permission/CheckPermissionService.php` - 权限检查服务

### 3. 菜单管理模块

**功能**: 动态菜单、菜单树构建、权限关联

**核心类**:
- `domain/menu/entity/Menu.php` - 菜单实体
- `service/menu/BuildMenuTreeService.php` - 菜单树构建服务

### 4. 操作日志模块

**功能**: 操作记录、审计追踪、日志查询

**核心类**:
- `domain/log/entity/OperationLog.php` - 操作日志实体
- `service/log/RecordOperationLogService.php` - 日志记录服务

### 5. 系统配置模块

**功能**: 参数配置、配置热更新

**核心类**:
- `domain/config/entity/SystemConfig.php` - 系统配置实体

---

## 关键代码示例

### 1. 用户实体

```php
<?php

declare(strict_types=1);

namespace app\domain\user\entity;

use app\domain\user\enum\UserStatus;
use app\domain\user\vo\Username;
use app\domain\user\vo\Password;
use app\domain\user\event\UserCreated;
use app\domain\user\event\UserRoleChanged;
use app\domain\user\exception\InvalidUserOperationException;

final class User
{
    private array $domainEvents = [];

    private function __construct(
        private readonly int $id,
        private Username $username,
        private Password $password,
        private string $email,
        private UserStatus $status,
        private array $roleIds,
        private readonly \DateTimeImmutable $createdAt,
        private \DateTimeImmutable $updatedAt
    ) {
    }

    public static function create(
        Username $username,
        Password $password,
        string $email
    ): self {
        $user = new self(
            id: 0,
            username: $username,
            password: $password,
            email: $email,
            status: UserStatus::Active,
            roleIds: [],
            createdAt: new \DateTimeImmutable(),
            updatedAt: new \DateTimeImmutable()
        );

        $user->recordEvent(new UserCreated($user));

        return $user;
    }

    public function assignRoles(array $roleIds): void
    {
        $this->roleIds = $roleIds;
        $this->recordEvent(new UserRoleChanged($this, $roleIds));
    }

    public function activate(): void
    {
        if ($this->status->isActive()) {
            throw new InvalidUserOperationException('User is already active');
        }

        $this->status = UserStatus::Active;
    }

    public function deactivate(): void
    {
        if ($this->status->isInactive()) {
            throw new InvalidUserOperationException('User is already inactive');
        }

        $this->status = UserStatus::Inactive;
    }

    public function changePassword(Password $newPassword): void
    {
        $this->password = $newPassword;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function hasRole(int $roleId): bool
    {
        return in_array($roleId, $this->roleIds, true);
    }

    // Getters
    public function id(): int
    {
        return $this->id;
    }

    public function username(): Username
    {
        return $this->username;
    }

    public function email(): string
    {
        return $this->email;
    }

    public function status(): UserStatus
    {
        return $this->status;
    }

    public function roleIds(): array
    {
        return $this->roleIds;
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

### 2. 权限检查服务

```php
<?php

declare(strict_types=1);

namespace app\service\permission;

use app\contract\repository\UserRepositoryInterface;
use app\contract\repository\RoleRepositoryInterface;
use app\contract\repository\PermissionRepositoryInterface;
use app\infrastructure\cache\RedisPermissionCache;

final class CheckPermissionService
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly RoleRepositoryInterface $roleRepository,
        private readonly PermissionRepositoryInterface $permissionRepository,
        private readonly RedisPermissionCache $permissionCache
    ) {
    }

    /**
     * 检查用户是否有指定权限
     */
    public function check(int $userId, string $permissionCode): bool
    {
        // 1. 尝试从缓存获取
        $cached = $this->permissionCache->getUserPermissions($userId);
        if ($cached !== null) {
            return in_array($permissionCode, $cached, true);
        }

        // 2. 获取用户
        $user = $this->userRepository->findById($userId);
        if ($user === null) {
            return false;
        }

        // 3. 获取用户的所有角色
        $roles = $this->roleRepository->findByIds($user->roleIds());

        // 4. 收集所有权限
        $permissionIds = [];
        foreach ($roles as $role) {
            $permissionIds = array_merge($permissionIds, $role->permissionIds());
        }
        $permissionIds = array_unique($permissionIds);

        // 5. 获取权限详情
        $permissions = $this->permissionRepository->findByIds($permissionIds);
        $permissionCodes = array_map(
            fn ($permission) => $permission->code()->value(),
            $permissions
        );

        // 6. 缓存权限列表
        $this->permissionCache->setUserPermissions($userId, $permissionCodes);

        return in_array($permissionCode, $permissionCodes, true);
    }

    /**
     * 检查用户是否有任一权限
     */
    public function checkAny(int $userId, array $permissionCodes): bool
    {
        foreach ($permissionCodes as $code) {
            if ($this->check($userId, $code)) {
                return true;
            }
        }

        return false;
    }

    /**
     * 检查用户是否有所有权限
     */
    public function checkAll(int $userId, array $permissionCodes): bool
    {
        foreach ($permissionCodes as $code) {
            if (!$this->check($userId, $code)) {
                return false;
            }
        }

        return true;
    }
}
```

### 3. 构建菜单树服务

```php
<?php

declare(strict_types=1);

namespace app\service\menu;

use app\contract\repository\MenuRepositoryInterface;
use app\service\permission\CheckPermissionService;
use app\infrastructure\cache\RedisMenuCache;

final class BuildMenuTreeService
{
    public function __construct(
        private readonly MenuRepositoryInterface $menuRepository,
        private readonly CheckPermissionService $permissionService,
        private readonly RedisMenuCache $menuCache
    ) {
    }

    /**
     * 为用户构建菜单树
     */
    public function buildForUser(int $userId): array
    {
        // 1. 尝试从缓存获取
        $cached = $this->menuCache->getUserMenuTree($userId);
        if ($cached !== null) {
            return $cached;
        }

        // 2. 获取所有菜单
        $allMenus = $this->menuRepository->findAll();

        // 3. 过滤用户有权限的菜单
        $authorizedMenus = array_filter(
            $allMenus,
            fn ($menu) => $this->isAuthorized($userId, $menu)
        );

        // 4. 构建树形结构
        $tree = $this->buildTree($authorizedMenus);

        // 5. 缓存结果
        $this->menuCache->setUserMenuTree($userId, $tree);

        return $tree;
    }

    /**
     * 检查用户是否有菜单权限
     */
    private function isAuthorized(int $userId, object $menu): bool
    {
        // 如果菜单没有权限要求，所有人可见
        if ($menu->permissionCode() === null) {
            return true;
        }

        return $this->permissionService->check($userId, $menu->permissionCode());
    }

    /**
     * 构建树形结构
     */
    private function buildTree(array $menus, ?int $parentId = null): array
    {
        $tree = [];

        foreach ($menus as $menu) {
            if ($menu->parentId() === $parentId) {
                $children = $this->buildTree($menus, $menu->id());

                $tree[] = [
                    'id' => $menu->id(),
                    'name' => $menu->name(),
                    'path' => $menu->path()->value(),
                    'icon' => $menu->icon()->value(),
                    'sort' => $menu->sort(),
                    'children' => $children,
                ];
            }
        }

        // 按排序字段排序
        usort($tree, fn ($a, $b) => $a['sort'] <=> $b['sort']);

        return $tree;
    }
}
```

### 4. 操作日志中间件

```php
<?php

declare(strict_types=1);

namespace app\middleware\log;

use app\service\log\RecordOperationLogService;
use Webman\MiddlewareInterface;
use Webman\Http\Response;
use Webman\Http\Request;

final class OperationLogMiddleware implements MiddlewareInterface
{
    public function __construct(
        private readonly RecordOperationLogService $logService
    ) {
    }

    public function process(Request $request, callable $next): Response
    {
        $startTime = microtime(true);

        // 执行请求
        $response = $next($request);

        // 记录日志（异步）
        $this->recordLog($request, $response, $startTime);

        return $response;
    }

    private function recordLog(Request $request, Response $response, float $startTime): void
    {
        // 只记录修改操作
        if (!in_array($request->method(), ['POST', 'PUT', 'DELETE', 'PATCH'], true)) {
            return;
        }

        $duration = (int) ((microtime(true) - $startTime) * 1000);

        // 异步记录日志
        go(function () use ($request, $response, $duration) {
            try {
                $this->logService->handle(
                    userId: $request->user()?->id ?? 0,
                    method: $request->method(),
                    path: $request->path(),
                    params: $request->all(),
                    ip: $request->getRealIp(),
                    userAgent: $request->header('user-agent', ''),
                    statusCode: $response->getStatusCode(),
                    duration: $duration
                );
            } catch (\Exception $e) {
                logger()->error('Failed to record operation log', [
                    'error' => $e->getMessage(),
                ]);
            }
        });
    }
}
```

### 5. 用户控制器

```php
<?php

declare(strict_types=1);

namespace app\controller\admin;

use app\service\user\CreateUserService;
use app\service\user\UpdateUserService;
use app\service\user\DeleteUserService;
use app\service\user\AssignRoleService;
use app\contract\repository\UserRepositoryInterface;
use support\Request;
use support\Response;

final class UserController
{
    public function __construct(
        private readonly CreateUserService $createUserService,
        private readonly UpdateUserService $updateUserService,
        private readonly DeleteUserService $deleteUserService,
        private readonly AssignRoleService $assignRoleService,
        private readonly UserRepositoryInterface $userRepository
    ) {
    }

    /**
     * 用户列表
     */
    public function index(Request $request): Response
    {
        $page = (int) $request->get('page', 1);
        $pageSize = (int) $request->get('page_size', 20);
        $keyword = $request->get('keyword', '');

        $result = $this->userRepository->paginate($page, $pageSize, $keyword);

        return json([
            'success' => true,
            'data' => [
                'items' => array_map(
                    fn ($user) => [
                        'id' => $user->id(),
                        'username' => $user->username()->value(),
                        'email' => $user->email(),
                        'status' => $user->status()->value(),
                        'created_at' => $user->createdAt()->format('Y-m-d H:i:s'),
                    ],
                    $result['items']
                ),
                'total' => $result['total'],
                'page' => $page,
                'page_size' => $pageSize,
            ],
        ]);
    }

    /**
     * 创建用户
     */
    public function create(Request $request): Response
    {
        $validated = $this->validate($request, [
            'username' => 'required|string|min:3|max:20',
            'password' => 'required|string|min:6',
            'email' => 'required|email',
            'role_ids' => 'array',
        ]);

        $user = $this->createUserService->handle(
            username: $validated['username'],
            password: $validated['password'],
            email: $validated['email'],
            roleIds: $validated['role_ids'] ?? []
        );

        return json([
            'success' => true,
            'data' => [
                'id' => $user->id(),
                'username' => $user->username()->value(),
            ],
        ]);
    }

    /**
     * 更新用户
     */
    public function update(Request $request, int $id): Response
    {
        $validated = $this->validate($request, [
            'email' => 'email',
            'status' => 'in:active,inactive',
        ]);

        $this->updateUserService->handle($id, $validated);

        return json([
            'success' => true,
            'message' => 'User updated successfully',
        ]);
    }

    /**
     * 删除用户
     */
    public function delete(Request $request, int $id): Response
    {
        $this->deleteUserService->handle($id);

        return json([
            'success' => true,
            'message' => 'User deleted successfully',
        ]);
    }

    /**
     * 分配角色
     */
    public function assignRoles(Request $request, int $id): Response
    {
        $validated = $this->validate($request, [
            'role_ids' => 'required|array',
        ]);

        $this->assignRoleService->handle($id, $validated['role_ids']);

        return json([
            'success' => true,
            'message' => 'Roles assigned successfully',
        ]);
    }
}
```

### 6. 权限检查中间件

```php
<?php

declare(strict_types=1);

namespace app\middleware\auth;

use app\service\permission\CheckPermissionService;
use app\support\exception\PermissionDeniedException;
use Webman\MiddlewareInterface;
use Webman\Http\Response;
use Webman\Http\Request;

final class CheckPermissionMiddleware implements MiddlewareInterface
{
    public function __construct(
        private readonly CheckPermissionService $permissionService
    ) {
    }

    public function process(Request $request, callable $next): Response
    {
        // 获取路由需要的权限
        $permission = $request->route?->getPermission();

        if ($permission === null) {
            return $next($request);
        }

        // 检查用户权限
        $user = $request->user();
        if ($user === null) {
            throw new PermissionDeniedException('User not authenticated');
        }

        if (!$this->permissionService->check($user->id, $permission)) {
            throw new PermissionDeniedException("Permission denied: {$permission}");
        }

        return $next($request);
    }
}
```

---

## 路由配置示例

```php
<?php
// config/route.php

use app\controller\admin\UserController;
use app\controller\admin\RoleController;
use app\middleware\auth\AuthenticateMiddleware;
use app\middleware\auth\CheckPermissionMiddleware;
use app\middleware\log\OperationLogMiddleware;

Route::group('/admin', function () {
    // 用户管理
    Route::get('/users', [UserController::class, 'index'])
        ->permission('user.list');
    Route::post('/users', [UserController::class, 'create'])
        ->permission('user.create');
    Route::put('/users/{id}', [UserController::class, 'update'])
        ->permission('user.update');
    Route::delete('/users/{id}', [UserController::class, 'delete'])
        ->permission('user.delete');
    Route::post('/users/{id}/roles', [UserController::class, 'assignRoles'])
        ->permission('user.assign_role');

    // 角色管理
    Route::get('/roles', [RoleController::class, 'index'])
        ->permission('role.list');
    Route::post('/roles', [RoleController::class, 'create'])
        ->permission('role.create');
})->middleware([
    AuthenticateMiddleware::class,
    CheckPermissionMiddleware::class,
    OperationLogMiddleware::class,
]);
```

---

## 依赖注入配置

```php
<?php
// config/container.php

use app\contract\repository\UserRepositoryInterface;
use app\contract\repository\RoleRepositoryInterface;
use app\contract\repository\PermissionRepositoryInterface;
use app\contract\service\PasswordHasherInterface;
use app\infrastructure\repository\eloquent\EloquentUserRepository;
use app\infrastructure\repository\eloquent\EloquentRoleRepository;
use app\infrastructure\repository\eloquent\EloquentPermissionRepository;
use app\infrastructure\service\BcryptPasswordHasher;

return [
    UserRepositoryInterface::class => EloquentUserRepository::class,
    RoleRepositoryInterface::class => EloquentRoleRepository::class,
    PermissionRepositoryInterface::class => EloquentPermissionRepository::class,
    PasswordHasherInterface::class => BcryptPasswordHasher::class,
];
```

---

## 最佳实践

### 1. RBAC 权限模型

- 用户 -> 角色 -> 权限
- 支持多角色
- 权限缓存优化

### 2. 操作日志

- 记录所有修改操作
- 异步写入日志
- 定期清理旧日志

### 3. 数据权限

- 部门数据隔离
- 行级权限控制

### 4. 菜单管理

- 动态菜单生成
- 权限关联
- 菜单缓存

### 5. 安全性

- 密码加密存储
- 登录失败限制
- 会话管理

---

## 相关文档

- [目录结构规范](../architecture/directory-structure.mdx)
- [依赖方向规则](../architecture/dependency-rules.mdx)
- [PER Coding Style](../coding-standards/per-coding-style.mdx)
