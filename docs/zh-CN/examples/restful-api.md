---
title: "RESTful API 服务示例"
description: "完整的 RESTful API 服务架构示例，展示 API 设计、版本控制、认证授权、限流"
---

## 目录

- [系统概述](#系统概述)
- [完整目录树](#完整目录树)
- [模块划分](#模块划分)
- [关键代码示例](#关键代码示例)

---

## 系统概述

### 核心功能

- RESTful API 设计
- API 版本控制
- JWT 认证
- OAuth2 授权
- API 限流
- API 文档
- 第三方 API 集成

### 技术特点

- 标准 RESTful 规范
- JWT Token 认证
- API 版本管理
- 请求限流
- 响应缓存
- 使用 Saloon 进行 HTTP 客户端集成

---

## 完整目录树

```
app/
├── controller/
│   └── api/
│       ├── v1/
│       │   ├── AuthController.php              # 认证接口
│       │   ├── UserController.php              # 用户资源
│       │   ├── PostController.php              # 文章资源
│       │   └── CommentController.php           # 评论资源
│       └── v2/
│           ├── UserController.php              # 用户资源 v2
│           └── PostController.php              # 文章资源 v2
│
├── model/
│   └── eloquent/
│       ├── User.php
│       ├── Post.php
│       └── Comment.php
│
├── service/
│   ├── auth/
│   │   ├── LoginService.php                    # 登录服务
│   │   ├── RegisterService.php                 # 注册服务
│   │   ├── RefreshTokenService.php             # 刷新令牌
│   │   └── RevokeTokenService.php              # 撤销令牌
│   ├── user/
│   │   ├── CreateUserService.php
│   │   ├── UpdateUserService.php
│   │   └── DeleteUserService.php
│   └── integration/
│       ├── SendEmailService.php                # 邮件集成
│       └── FetchExternalDataService.php        # 外部数据获取
│
├── domain/
│   ├── auth/
│   │   ├── entity/
│   │   │   └── AccessToken.php                 # 访问令牌实体
│   │   ├── enum/                               # 枚举
│   │   │   └── TokenType.php                   # 令牌类型枚举
│   │   ├── vo/                                 # 值对象
│   │   │   └── TokenExpiry.php                 # 令牌过期时间
│   │   └── rule/
│   │       └── TokenValidationRule.php         # 令牌验证规则
│   │
│   ├── user/
│   │   ├── entity/
│   │   │   └── User.php
│   │   └── vo/                                 # 值对象
│   │       ├── Email.php
│   │       └── Password.php
│   │
│   └── post/
│       ├── entity/
│       │   └── Post.php
│       └── enum/                               # 枚举
│           └── PostStatus.php
│
├── contract/
│   ├── repository/
│   │   ├── UserRepositoryInterface.php
│   │   ├── PostRepositoryInterface.php
│   │   └── TokenRepositoryInterface.php
│   ├── gateway/
│   │   ├── EmailGatewayInterface.php
│   │   └── ExternalApiGatewayInterface.php
│   └── service/
│       └── TokenGeneratorInterface.php
│
├── infrastructure/
│   ├── repository/
│   │   └── eloquent/
│   │       ├── EloquentUserRepository.php
│   │       ├── EloquentPostRepository.php
│   │       └── EloquentTokenRepository.php
│   ├── gateway/
│   │   ├── email/
│   │   │   └── SendGridEmailGateway.php
│   │   └── external/
│   │       └── saloon/
│   │           ├── ExternalApiConnector.php    # Saloon Connector
│   │           ├── requests/
│   │           │   ├── GetUserRequest.php      # Saloon Request
│   │           │   └── CreateOrderRequest.php
│   │           └── responses/
│   │               └── UserResponse.php        # Saloon Response
│   └── service/
│       └── JwtTokenGenerator.php               # JWT 生成器
│
├── middleware/
│   ├── auth/
│   │   ├── AuthenticateMiddleware.php          # JWT 认证
│   │   └── OptionalAuthMiddleware.php          # 可选认证
│   ├── rate_limit/
│   │   ├── ApiRateLimitMiddleware.php          # API 限流
│   │   └── ThrottleMiddleware.php              # 节流
│   ├── cors/
│   │   └── CorsMiddleware.php                  # CORS 处理
│   └── transform/
│       ├── TransformRequestMiddleware.php      # 请求转换
│       └── TransformResponseMiddleware.php     # 响应转换
│
├── resource/
│   ├── UserResource.php                        # 用户资源转换
│   ├── PostResource.php                        # 文章资源转换
│   ├── CommentResource.php                     # 评论资源转换
│   └── collection/
│       ├── UserCollection.php                  # 用户集合
│       └── PostCollection.php                  # 文章集合
│
├── request/
│   ├── auth/
│   │   ├── LoginRequest.php                    # 登录请求验证
│   │   └── RegisterRequest.php                 # 注册请求验证
│   ├── user/
│   │   ├── CreateUserRequest.php
│   │   └── UpdateUserRequest.php
│   └── post/
│       ├── CreatePostRequest.php
│       └── UpdatePostRequest.php
│
└── support/
    ├── exception/
    │   ├── ApiException.php                    # API 异常基类
    │   ├── UnauthorizedException.php           # 未授权异常
    │   ├── ValidationException.php             # 验证异常
    │   └── RateLimitExceededException.php      # 限流异常
    ├── response/
    │   └── ApiResponse.php                     # 统一响应格式
    └── trait/
        └── ApiResponseTrait.php                # API 响应 Trait
```

---

## 模块划分

### 1. 认证授权模块

**功能**: JWT 认证、Token 管理、OAuth2

**核心类**:
- `service/auth/LoginService.php` - 登录服务
- `middleware/auth/AuthenticateMiddleware.php` - JWT 认证中间件
- `domain/auth/entity/AccessToken.php` - 访问令牌实体

### 2. 资源管理模块

**功能**: RESTful 资源 CRUD、资源转换

**核心类**:
- `controller/api/v1/UserController.php` - 用户资源控制器
- `resource/UserResource.php` - 用户资源转换器

### 3. API 版本控制模块

**功能**: 多版本 API 支持、版本路由

**核心类**:
- `controller/api/v1/` - V1 版本控制器
- `controller/api/v2/` - V2 版本控制器

### 4. 限流模块

**功能**: API 调用限流、防滥用

**核心类**:
- `middleware/rate_limit/ApiRateLimitMiddleware.php` - 限流中间件

### 5. 第三方集成模块

**功能**: 使用 Saloon 集成外部 API

**核心类**:
- `infrastructure/gateway/external/saloon/ExternalApiConnector.php` - Saloon 连接器
- 参考文档: [Saloon Integration](/zh-CN/tools/saloon)

---

## 关键代码示例

### 1. JWT 认证中间件

```php
<?php

declare(strict_types=1);

namespace app\middleware\auth;

use app\contract\service\TokenGeneratorInterface;
use app\contract\repository\UserRepositoryInterface;
use app\support\exception\UnauthorizedException;
use Webman\MiddlewareInterface;
use Webman\Http\Response;
use Webman\Http\Request;

final class AuthenticateMiddleware implements MiddlewareInterface
{
    public function __construct(
        private readonly TokenGeneratorInterface $tokenGenerator,
        private readonly UserRepositoryInterface $userRepository
    ) {
    }

    public function process(Request $request, callable $next): Response
    {
        // 1. 从 Header 获取 Token
        $token = $this->extractToken($request);

        if ($token === null) {
            throw new UnauthorizedException('Token not provided');
        }

        // 2. 验证 Token
        try {
            $payload = $this->tokenGenerator->verify($token);
        } catch (\Exception $e) {
            throw new UnauthorizedException('Invalid token: ' . $e->getMessage());
        }

        // 3. 获取用户
        $user = $this->userRepository->findById($payload['user_id']);

        if ($user === null) {
            throw new UnauthorizedException('User not found');
        }

        // 4. 设置用户到请求上下文
        $request->user = $user;

        return $next($request);
    }

    private function extractToken(Request $request): ?string
    {
        $header = $request->header('authorization', '');

        if (preg_match('/Bearer\s+(.*)$/i', $header, $matches)) {
            return $matches[1];
        }

        return null;
    }
}
```

### 2. 登录服务

```php
<?php

declare(strict_types=1);

namespace app\service\auth;

use app\contract\repository\UserRepositoryInterface;
use app\contract\repository\TokenRepositoryInterface;
use app\contract\service\TokenGeneratorInterface;
use app\domain\auth\entity\AccessToken;
use app\support\exception\UnauthorizedException;

final class LoginService
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly TokenRepositoryInterface $tokenRepository,
        private readonly TokenGeneratorInterface $tokenGenerator
    ) {
    }

    public function handle(string $email, string $password): array
    {
        // 1. 验证用户凭证
        $user = $this->userRepository->findByEmail($email);

        if ($user === null || !$user->verifyPassword($password)) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // 2. 生成访问令牌
        $accessToken = $this->tokenGenerator->generate([
            'user_id' => $user->id(),
            'email' => $user->email(),
        ], 3600); // 1 hour

        // 3. 生成刷新令牌
        $refreshToken = $this->tokenGenerator->generate([
            'user_id' => $user->id(),
            'type' => 'refresh',
        ], 2592000); // 30 days

        // 4. 保存令牌记录
        $tokenEntity = AccessToken::create(
            userId: $user->id(),
            accessToken: $accessToken,
            refreshToken: $refreshToken,
            expiresAt: new \DateTimeImmutable('+1 hour')
        );

        $this->tokenRepository->save($tokenEntity);

        return [
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'token_type' => 'Bearer',
            'expires_in' => 3600,
        ];
    }
}
```

### 3. 用户资源控制器

```php
<?php

declare(strict_types=1);

namespace app\controller\api\v1;

use app\service\user\CreateUserService;
use app\service\user\UpdateUserService;
use app\service\user\DeleteUserService;
use app\contract\repository\UserRepositoryInterface;
use app\resource\UserResource;
use app\resource\collection\UserCollection;
use app\request\user\CreateUserRequest;
use app\request\user\UpdateUserRequest;
use support\Request;
use support\Response;

final class UserController
{
    public function __construct(
        private readonly CreateUserService $createUserService,
        private readonly UpdateUserService $updateUserService,
        private readonly DeleteUserService $deleteUserService,
        private readonly UserRepositoryInterface $userRepository
    ) {
    }

    /**
     * GET /api/v1/users
     * 获取用户列表
     */
    public function index(Request $request): Response
    {
        $page = (int) $request->get('page', 1);
        $perPage = (int) $request->get('per_page', 15);

        $result = $this->userRepository->paginate($page, $perPage);

        return json([
            'data' => UserCollection::make($result['items']),
            'meta' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $result['total'],
                'last_page' => (int) ceil($result['total'] / $perPage),
            ],
        ]);
    }

    /**
     * GET /api/v1/users/{id}
     * 获取用户详情
     */
    public function show(Request $request, int $id): Response
    {
        $user = $this->userRepository->findById($id);

        if ($user === null) {
            return json([
                'error' => 'User not found',
            ], 404);
        }

        return json([
            'data' => UserResource::make($user),
        ]);
    }

    /**
     * POST /api/v1/users
     * 创建用户
     */
    public function store(CreateUserRequest $request): Response
    {
        $validated = $request->validated();

        $user = $this->createUserService->handle(
            name: $validated['name'],
            email: $validated['email'],
            password: $validated['password']
        );

        return json([
            'data' => UserResource::make($user),
            'message' => 'User created successfully',
        ], 201);
    }

    /**
     * PUT /api/v1/users/{id}
     * 更新用户
     */
    public function update(UpdateUserRequest $request, int $id): Response
    {
        $validated = $request->validated();

        $user = $this->updateUserService->handle($id, $validated);

        return json([
            'data' => UserResource::make($user),
            'message' => 'User updated successfully',
        ]);
    }

    /**
     * DELETE /api/v1/users/{id}
     * 删除用户
     */
    public function destroy(Request $request, int $id): Response
    {
        $this->deleteUserService->handle($id);

        return json([
            'message' => 'User deleted successfully',
        ], 204);
    }
}
```

### 4. 资源转换器

```php
<?php

declare(strict_types=1);

namespace app\resource;

final class UserResource
{
    public static function make(object $user): array
    {
        return [
            'id' => $user->id(),
            'name' => $user->name(),
            'email' => $user->email(),
            'created_at' => $user->createdAt()->format('Y-m-d H:i:s'),
            'updated_at' => $user->updatedAt()->format('Y-m-d H:i:s'),
        ];
    }
}
```

```php
<?php

declare(strict_types=1);

namespace app\resource\collection;

final class UserCollection
{
    public static function make(array $users): array
    {
        return array_map(
            fn ($user) => \app\resource\UserResource::make($user),
            $users
        );
    }
}
```

### 5. API 限流中间件

```php
<?php

declare(strict_types=1);

namespace app\middleware\rate_limit;

use app\support\exception\RateLimitExceededException;
use support\Redis;
use Webman\MiddlewareInterface;
use Webman\Http\Response;
use Webman\Http\Request;

final class ApiRateLimitMiddleware implements MiddlewareInterface
{
    private const MAX_REQUESTS = 60; // 每分钟最大请求数
    private const WINDOW = 60; // 时间窗口（秒）

    public function process(Request $request, callable $next): Response
    {
        $key = $this->getRateLimitKey($request);

        // 获取当前请求数
        $current = (int) Redis::get($key);

        if ($current >= self::MAX_REQUESTS) {
            throw new RateLimitExceededException(
                'Rate limit exceeded. Try again later.'
            );
        }

        // 增加计数
        Redis::incr($key);

        // 设置过期时间（首次请求时）
        if ($current === 0) {
            Redis::expire($key, self::WINDOW);
        }

        $response = $next($request);

        // 添加限流响应头
        $response->withHeaders([
            'X-RateLimit-Limit' => self::MAX_REQUESTS,
            'X-RateLimit-Remaining' => max(0, self::MAX_REQUESTS - $current - 1),
            'X-RateLimit-Reset' => time() + Redis::ttl($key),
        ]);

        return $response;
    }

    private function getRateLimitKey(Request $request): string
    {
        // 基于用户 ID 或 IP 地址
        $identifier = $request->user?->id ?? $request->getRealIp();

        return "rate_limit:{$identifier}:" . floor(time() / self::WINDOW);
    }
}
```

### 6. Saloon HTTP 客户端集成

详细文档请参考: [Saloon Integration](/zh-CN/tools/saloon)

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\external\saloon;

use Saloon\Http\Connector;
use Saloon\Traits\Plugins\AcceptsJson;

final class ExternalApiConnector extends Connector
{
    use AcceptsJson;

    public function resolveBaseUrl(): string
    {
        return config('external_api.base_url');
    }

    protected function defaultHeaders(): array
    {
        return [
            'Accept' => 'application/json',
            'X-API-Key' => config('external_api.api_key'),
        ];
    }

    protected function defaultConfig(): array
    {
        return [
            'timeout' => 30,
        ];
    }
}
```

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\external\saloon\requests;

use Saloon\Enums\Method;
use Saloon\Http\Request;

final class GetUserRequest extends Request
{
    protected Method $method = Method::GET;

    public function __construct(
        private readonly int $userId
    ) {
    }

    public function resolveEndpoint(): string
    {
        return "/users/{$this->userId}";
    }
}
```

```php
<?php

declare(strict_types=1);

namespace app\service\integration;

use app\infrastructure\gateway\external\saloon\ExternalApiConnector;
use app\infrastructure\gateway\external\saloon\requests\GetUserRequest;

final class FetchExternalDataService
{
    public function __construct(
        private readonly ExternalApiConnector $connector
    ) {
    }

    public function fetchUser(int $userId): array
    {
        $request = new GetUserRequest($userId);
        $response = $this->connector->send($request);

        return $response->json();
    }
}
```

### 7. 统一异常处理

```php
<?php

declare(strict_types=1);

namespace app\support\exception;

use support\exception\Handler;
use Throwable;
use Webman\Http\Request;
use Webman\Http\Response;

final class ApiExceptionHandler extends Handler
{
    public function render(Request $request, Throwable $exception): Response
    {
        // API 请求返回 JSON 格式错误
        if (str_starts_with($request->path(), '/api/')) {
            return $this->renderApiException($exception);
        }

        return parent::render($request, $exception);
    }

    private function renderApiException(Throwable $exception): Response
    {
        $statusCode = $this->getStatusCode($exception);

        return json([
            'error' => [
                'message' => $exception->getMessage(),
                'code' => $exception->getCode(),
                'type' => class_basename($exception),
            ],
        ], $statusCode);
    }

    private function getStatusCode(Throwable $exception): int
    {
        return match (true) {
            $exception instanceof UnauthorizedException => 401,
            $exception instanceof ValidationException => 422,
            $exception instanceof RateLimitExceededException => 429,
            default => 500,
        };
    }
}
```

### 8. API 响应 Trait

```php
<?php

declare(strict_types=1);

namespace app\support\trait;

use support\Response;

trait ApiResponseTrait
{
    protected function success(mixed $data = null, string $message = 'Success', int $code = 200): Response
    {
        return json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    protected function error(string $message, int $code = 400, mixed $errors = null): Response
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return json($response, $code);
    }

    protected function paginated(array $items, int $total, int $page, int $perPage): Response
    {
        return json([
            'success' => true,
            'data' => $items,
            'meta' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'last_page' => (int) ceil($total / $perPage),
            ],
        ]);
    }
}
```

---

## 路由配置示例

```php
<?php
// config/route.php

use app\controller\api\v1\AuthController;
use app\controller\api\v1\UserController;
use app\controller\api\v1\PostController;
use app\middleware\auth\AuthenticateMiddleware;
use app\middleware\rate_limit\ApiRateLimitMiddleware;
use app\middleware\cors\CorsMiddleware;

// API v1
Route::group('/api/v1', function () {
    // 公开路由
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);

    // 需要认证的路由
    Route::group('', function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::post('/auth/refresh', [AuthController::class, 'refresh']);

        // 用户资源
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        // 文章资源
        Route::resource('/posts', PostController::class);
    })->middleware([AuthenticateMiddleware::class]);
})->middleware([
    CorsMiddleware::class,
    ApiRateLimitMiddleware::class,
]);
```

---

## 依赖注入配置

```php
<?php
// config/container.php

use app\contract\repository\UserRepositoryInterface;
use app\contract\service\TokenGeneratorInterface;
use app\infrastructure\repository\eloquent\EloquentUserRepository;
use app\infrastructure\service\JwtTokenGenerator;
use app\infrastructure\gateway\external\saloon\ExternalApiConnector;

return [
    UserRepositoryInterface::class => EloquentUserRepository::class,
    TokenGeneratorInterface::class => JwtTokenGenerator::class,

    ExternalApiConnector::class => function () {
        return new ExternalApiConnector();
    },
];
```

---

## RESTful API 设计规范

### 1. HTTP 方法

- `GET` - 获取资源
- `POST` - 创建资源
- `PUT` - 完整更新资源
- `PATCH` - 部分更新资源
- `DELETE` - 删除资源

### 2. 状态码

- `200 OK` - 请求成功
- `201 Created` - 资源创建成功
- `204 No Content` - 删除成功
- `400 Bad Request` - 请求参数错误
- `401 Unauthorized` - 未认证
- `403 Forbidden` - 无权限
- `404 Not Found` - 资源不存在
- `422 Unprocessable Entity` - 验证失败
- `429 Too Many Requests` - 请求过多
- `500 Internal Server Error` - 服务器错误

### 3. URL 设计

```
GET    /api/v1/users           # 获取用户列表
GET    /api/v1/users/{id}      # 获取单个用户
POST   /api/v1/users           # 创建用户
PUT    /api/v1/users/{id}      # 更新用户
DELETE /api/v1/users/{id}      # 删除用户

GET    /api/v1/users/{id}/posts  # 获取用户的文章
```

### 4. 响应格式

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "Success"
}
```

### 5. 分页格式

```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 100,
    "last_page": 7
  }
}
```

---

## 最佳实践

### 1. API 版本控制

- URL 版本: `/api/v1/users`
- Header 版本: `Accept: application/vnd.api.v1+json`

### 2. 认证授权

- JWT Token 认证
- Token 刷新机制
- Token 黑名单

### 3. 限流策略

- 基于用户的限流
- 基于 IP 的限流
- 不同端点不同限流策略

### 4. 缓存策略

- ETag 缓存
- Last-Modified 缓存
- 响应缓存

### 5. 错误处理

- 统一错误格式
- 详细错误信息
- 错误码规范

### 6. 第三方 API 集成

- 使用 Saloon 进行 HTTP 客户端集成
- 详细文档: [Saloon Integration](/zh-CN/tools/saloon)

---

## 相关文档

- [目录结构规范](/zh-CN/architecture/directory-structure)
- [依赖方向规则](/zh-CN/architecture/dependency-rules)
- [PER Coding Style](/zh-CN/coding-standards/per-coding-style)
- [Saloon Integration](/zh-CN/tools/saloon)
