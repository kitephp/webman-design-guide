---
title: "Admin Dashboard Example"
description: "Complete admin dashboard architecture example with user management, permission control, and system configuration"
---

## Table of Contents

- [System Overview](#system-overview)
- [Complete Directory Tree](#complete-directory-tree)
- [Module Breakdown](#module-breakdown)
- [Key Code Examples](#key-code-examples)

---

## System Overview

### Core Features

- User Management - CRUD, batch operations
- Role & Permission - RBAC permission control
- Menu Management - Dynamic menu configuration
- Operation Log - Audit trail
- System Config - Parameter configuration
- Data Dictionary - Enum value management

### Technical Features

- RBAC permission model
- Operation log recording
- Data permission filtering
- Dynamic menu generation
- Configuration hot reload

---

## Complete Directory Tree

```
app/
├── controller/
│   └── admin/
│       ├── UserController.php              # User Management
│       ├── RoleController.php              # Role Management
│       ├── PermissionController.php        # Permission Management
│       ├── MenuController.php              # Menu Management
│       ├── LogController.php               # Log Query
│       ├── ConfigController.php            # System Config
│       └── DashboardController.php         # Dashboard
│
├── model/
│   └── eloquent/
│       ├── User.php                        # User Model
│       ├── Role.php                        # Role Model
│       ├── Permission.php                  # Permission Model
│       ├── Menu.php                        # Menu Model
│       ├── OperationLog.php                # Operation Log Model
│       └── SystemConfig.php                # System Config Model
│
├── service/
│   ├── user/
│   │   ├── CreateUserService.php           # Create User
│   │   ├── UpdateUserService.php           # Update User
│   │   ├── DeleteUserService.php           # Delete User
│   │   └── AssignRoleService.php           # Assign Role
│   ├── role/
│   │   ├── CreateRoleService.php           # Create Role
│   │   ├── AssignPermissionService.php     # Assign Permission
│   │   └── DeleteRoleService.php           # Delete Role
│   ├── permission/
│   │   └── CheckPermissionService.php      # Permission Check
│   ├── menu/
│   │   ├── BuildMenuTreeService.php        # Build Menu Tree
│   │   └── SyncMenuService.php             # Sync Menu
│   └── log/
│       └── RecordOperationLogService.php   # Record Operation Log
│
├── domain/
│   ├── user/
│   │   ├── entity/
│   │   │   └── User.php                    # User Entity
│   │   ├── enum/                           # Enums
│   │   │   └── UserStatus.php              # User Status
│   │   ├── vo/                             # Value Objects
│   │   │   ├── Username.php                # Username
│   │   │   └── Password.php                # Password
│   │   ├── event/
│   │   │   ├── UserCreated.php
│   │   │   ├── UserDeleted.php
│   │   │   └── UserRoleChanged.php
│   │   └── rule/
│   │       └── UserDeletionRule.php        # Deletion Rule
│   │
│   ├── role/
│   │   ├── entity/
│   │   │   └── Role.php                    # Role Entity
│   │   ├── enum/                           # Enums
│   │   │   └── RoleType.php                # Role Type
│   │   ├── vo/                             # Value Objects
│   │   │   └── RoleCode.php                # Role Code
│   │   └── rule/
│   │       └── RoleAssignmentRule.php      # Role Assignment Rule
│   │
│   ├── permission/
│   │   ├── entity/
│   │   │   └── Permission.php              # Permission Entity
│   │   ├── enum/                           # Enums
│   │   │   └── PermissionType.php          # Permission Type
│   │   ├── vo/                             # Value Objects
│   │   │   └── PermissionCode.php          # Permission Code
│   │   └── rule/
│   │       └── PermissionCheckRule.php     # Permission Check Rule
│   │
│   ├── menu/
│   │   ├── entity/
│   │   │   └── Menu.php                    # Menu Entity
│   │   ├── vo/                             # Value Objects
│   │   │   ├── MenuPath.php                # Menu Path
│   │   │   └── MenuIcon.php                # Menu Icon
│   │   └── rule/
│   │       └── MenuHierarchyRule.php       # Menu Hierarchy Rule
│   │
│   └── log/
│       ├── entity/
│       │   └── OperationLog.php            # Operation Log Entity
│       ├── enum/                           # Enums
│       │   └── OperationType.php           # Operation Type
│       └── vo/                             # Value Objects
│           └── IpAddress.php               # IP Address
│
├── contract/
│   ├── repository/
│   │   ├── UserRepositoryInterface.php
│   │   ├── RoleRepositoryInterface.php
│   │   ├── PermissionRepositoryInterface.php
│   │   ├── MenuRepositoryInterface.php
│   │   └── OperationLogRepositoryInterface.php
│   └── service/
│       ├── PasswordHasherInterface.php     # Password Hasher Interface
│       └── PermissionCheckerInterface.php  # Permission Checker Interface
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
│   │   ├── BcryptPasswordHasher.php        # Bcrypt Password Hasher
│   │   └── RbacPermissionChecker.php       # RBAC Permission Checker
│   └── cache/
│       ├── RedisPermissionCache.php        # Permission Cache
│       └── RedisMenuCache.php              # Menu Cache
│
├── middleware/
│   ├── auth/
│   │   ├── AuthenticateMiddleware.php      # Authentication Middleware
│   │   └── CheckPermissionMiddleware.php   # Permission Check Middleware
│   └── log/
│       └── OperationLogMiddleware.php      # Operation Log Middleware
│
├── process/
│   └── task/
│       ├── CleanupOldLogsTask.php          # Cleanup Old Logs
│       └── SyncPermissionCacheTask.php     # Sync Permission Cache
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

## Module Breakdown

### 1. User Management Module

**Features**: User CRUD, status management, role assignment

**Core Classes**:
- `domain/user/entity/User.php` - User entity
- `service/user/CreateUserService.php` - Create user service
- `service/user/AssignRoleService.php` - Role assignment service

### 2. Role & Permission Module

**Features**: RBAC permission control, role management, permission assignment

**Core Classes**:
- `domain/role/entity/Role.php` - Role entity
- `domain/permission/entity/Permission.php` - Permission entity
- `service/permission/CheckPermissionService.php` - Permission check service

### 3. Menu Management Module

**Features**: Dynamic menu, menu tree building, permission association

**Core Classes**:
- `domain/menu/entity/Menu.php` - Menu entity
- `service/menu/BuildMenuTreeService.php` - Menu tree building service

### 4. Operation Log Module

**Features**: Operation recording, audit trail, log query

**Core Classes**:
- `domain/log/entity/OperationLog.php` - Operation log entity
- `service/log/RecordOperationLogService.php` - Log recording service

### 5. System Config Module

**Features**: Parameter configuration, configuration hot reload

**Core Classes**:
- `domain/config/entity/SystemConfig.php` - System config entity

---

## Key Code Examples

### 1. User Entity

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

### 2. Check Permission Service

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
     * Check if user has specified permission
     */
    public function check(int $userId, string $permissionCode): bool
    {
        // 1. Try to get from cache
        $cached = $this->permissionCache->getUserPermissions($userId);
        if ($cached !== null) {
            return in_array($permissionCode, $cached, true);
        }

        // 2. Get user
        $user = $this->userRepository->findById($userId);
        if ($user === null) {
            return false;
        }

        // 3. Get all user roles
        $roles = $this->roleRepository->findByIds($user->roleIds());

        // 4. Collect all permissions
        $permissionIds = [];
        foreach ($roles as $role) {
            $permissionIds = array_merge($permissionIds, $role->permissionIds());
        }
        $permissionIds = array_unique($permissionIds);

        // 5. Get permission details
        $permissions = $this->permissionRepository->findByIds($permissionIds);
        $permissionCodes = array_map(
            fn ($permission) => $permission->code()->value(),
            $permissions
        );

        // 6. Cache permission list
        $this->permissionCache->setUserPermissions($userId, $permissionCodes);

        return in_array($permissionCode, $permissionCodes, true);
    }

    /**
     * Check if user has any of the specified permissions
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
     * Check if user has all specified permissions
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

### 3. Build Menu Tree Service

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
     * Build menu tree for user
     */
    public function buildForUser(int $userId): array
    {
        // 1. Try to get from cache
        $cached = $this->menuCache->getUserMenuTree($userId);
        if ($cached !== null) {
            return $cached;
        }

        // 2. Get all menus
        $allMenus = $this->menuRepository->findAll();

        // 3. Filter menus user has permission for
        $authorizedMenus = array_filter(
            $allMenus,
            fn ($menu) => $this->isAuthorized($userId, $menu)
        );

        // 4. Build tree structure
        $tree = $this->buildTree($authorizedMenus);

        // 5. Cache result
        $this->menuCache->setUserMenuTree($userId, $tree);

        return $tree;
    }

    /**
     * Check if user is authorized for menu
     */
    private function isAuthorized(int $userId, object $menu): bool
    {
        // If menu has no permission requirement, visible to all
        if ($menu->permissionCode() === null) {
            return true;
        }

        return $this->permissionService->check($userId, $menu->permissionCode());
    }

    /**
     * Build tree structure
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

        // Sort by sort field
        usort($tree, fn ($a, $b) => $a['sort'] <=> $b['sort']);

        return $tree;
    }
}
```

### 4. Operation Log Middleware

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

        // Execute request
        $response = $next($request);

        // Record log (async)
        $this->recordLog($request, $response, $startTime);

        return $response;
    }

    private function recordLog(Request $request, Response $response, float $startTime): void
    {
        // Only record modification operations
        if (!in_array($request->method(), ['POST', 'PUT', 'DELETE', 'PATCH'], true)) {
            return;
        }

        $duration = (int) ((microtime(true) - $startTime) * 1000);

        // Record log asynchronously
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

### 5. User Controller

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
     * User list
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
     * Create user
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
     * Update user
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
     * Delete user
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
     * Assign roles
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

### 6. Check Permission Middleware

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
        // Get required permission from route
        $permission = $request->route?->getPermission();

        if ($permission === null) {
            return $next($request);
        }

        // Check user permission
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

## Route Configuration Example

```php
<?php
// config/route.php

use app\controller\admin\UserController;
use app\controller\admin\RoleController;
use app\middleware\auth\AuthenticateMiddleware;
use app\middleware\auth\CheckPermissionMiddleware;
use app\middleware\log\OperationLogMiddleware;

Route::group('/admin', function () {
    // User Management
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

    // Role Management
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

## Dependency Injection Configuration

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

## Best Practices

### 1. RBAC Permission Model

- User -> Role -> Permission
- Support multiple roles
- Permission cache optimization

### 2. Operation Log

- Record all modification operations
- Async log writing
- Periodic cleanup of old logs

### 3. Data Permission

- Department data isolation
- Row-level permission control

### 4. Menu Management

- Dynamic menu generation
- Permission association
- Menu caching

### 5. Security

- Encrypted password storage
- Login failure limiting
- Session management

---

## Related Documentation

- [Directory Structure Standards](/en/architecture/directory-structure)
- [Dependency Direction Rules](/en/architecture/dependency-rules)
- [PER Coding Style](/en/coding-standards/per-coding-style)
