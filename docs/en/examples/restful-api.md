---
title: "RESTful API Service Example"
description: "Complete RESTful API service architecture example with API design, versioning, authentication, and rate limiting"
---

## Table of Contents

- [System Overview](#system-overview)
- [Complete Directory Tree](#complete-directory-tree)
- [Module Breakdown](#module-breakdown)
- [Key Code Examples](#key-code-examples)

---

## System Overview

### Core Features

- RESTful API Design
- API Versioning
- JWT Authentication
- OAuth2 Authorization
- API Rate Limiting
- API Documentation
- Third-party API Integration

### Technical Features

- Standard RESTful conventions
- JWT Token authentication
- API version management
- Request rate limiting
- Response caching
- HTTP client integration using Saloon

---

## Complete Directory Tree

```
app/
├── controller/
│   └── api/
│       ├── v1/
│       │   ├── AuthController.php              # Authentication API
│       │   ├── UserController.php              # User Resource
│       │   ├── PostController.php              # Post Resource
│       │   └── CommentController.php           # Comment Resource
│       └── v2/
│           ├── UserController.php              # User Resource v2
│           └── PostController.php              # Post Resource v2
│
├── model/
│   └── eloquent/
│       ├── User.php
│       ├── Post.php
│       └── Comment.php
│
├── service/
│   ├── auth/
│   │   ├── LoginService.php                    # Login Service
│   │   ├── RegisterService.php                 # Register Service
│   │   ├── RefreshTokenService.php             # Refresh Token
│   │   └── RevokeTokenService.php              # Revoke Token
│   ├── user/
│   │   ├── CreateUserService.php
│   │   ├── UpdateUserService.php
│   │   └── DeleteUserService.php
│   └── integration/
│       ├── SendEmailService.php                # Email Integration
│       └── FetchExternalDataService.php        # External Data Fetch
│
├── domain/
│   ├── auth/
│   │   ├── entity/
│   │   │   └── AccessToken.php                 # Access Token Entity
│   │   ├── enum/                               # Enums
│   │   │   └── TokenType.php                   # Token Type enum
│   │   ├── vo/                                 # Value Objects
│   │   │   └── TokenExpiry.php                 # Token Expiry
│   │   └── rule/
│   │       └── TokenValidationRule.php         # Token Validation Rule
│   │
│   ├── user/
│   │   ├── entity/
│   │   │   └── User.php
│   │   └── vo/                                 # Value Objects
│   │       ├── Email.php
│   │       └── Password.php
│   │
│   └── post/
│       ├── entity/
│       │   └── Post.php
│       └── enum/                               # Enums
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
│       └── JwtTokenGenerator.php               # JWT Generator
│
├── middleware/
│   ├── auth/
│   │   ├── AuthenticateMiddleware.php          # JWT Authentication
│   │   └── OptionalAuthMiddleware.php          # Optional Authentication
│   ├── rate_limit/
│   │   ├── ApiRateLimitMiddleware.php          # API Rate Limiting
│   │   └── ThrottleMiddleware.php              # Throttle
│   ├── cors/
│   │   └── CorsMiddleware.php                  # CORS Handling
│   └── transform/
│       ├── TransformRequestMiddleware.php      # Request Transform
│       └── TransformResponseMiddleware.php     # Response Transform
│
├── resource/
│   ├── UserResource.php                        # User Resource Transform
│   ├── PostResource.php                        # Post Resource Transform
│   ├── CommentResource.php                     # Comment Resource Transform
│   └── collection/
│       ├── UserCollection.php                  # User Collection
│       └── PostCollection.php                  # Post Collection
│
├── request/
│   ├── auth/
│   │   ├── LoginRequest.php                    # Login Request Validation
│   │   └── RegisterRequest.php                 # Register Request Validation
│   ├── user/
│   │   ├── CreateUserRequest.php
│   │   └── UpdateUserRequest.php
│   └── post/
│       ├── CreatePostRequest.php
│       └── UpdatePostRequest.php
│
└── support/
    ├── exception/
    │   ├── ApiException.php                    # API Exception Base
    │   ├── UnauthorizedException.php           # Unauthorized Exception
    │   ├── ValidationException.php             # Validation Exception
    │   └── RateLimitExceededException.php      # Rate Limit Exception
    ├── response/
    │   └── ApiResponse.php                     # Unified Response Format
    └── trait/
        └── ApiResponseTrait.php                # API Response Trait
```

---

## Module Breakdown

### 1. Authentication & Authorization Module

**Features**: JWT authentication, Token management, OAuth2

**Core Classes**:
- `service/auth/LoginService.php` - Login service
- `middleware/auth/AuthenticateMiddleware.php` - JWT authentication middleware
- `domain/auth/entity/AccessToken.php` - Access token entity

### 2. Resource Management Module

**Features**: RESTful resource CRUD, resource transformation

**Core Classes**:
- `controller/api/v1/UserController.php` - User resource controller
- `resource/UserResource.php` - User resource transformer

### 3. API Versioning Module

**Features**: Multi-version API support, version routing

**Core Classes**:
- `controller/api/v1/` - V1 version controllers
- `controller/api/v2/` - V2 version controllers

### 4. Rate Limiting Module

**Features**: API call rate limiting, abuse prevention

**Core Classes**:
- `middleware/rate_limit/ApiRateLimitMiddleware.php` - Rate limit middleware

### 5. Third-party Integration Module

**Features**: External API integration using Saloon

**Core Classes**:
- `infrastructure/gateway/external/saloon/ExternalApiConnector.php` - Saloon connector
- Reference: [Saloon Integration](/en/tools/saloon)

---

## Key Code Examples

### 1. JWT Authentication Middleware

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
        // 1. Extract token from header
        $token = $this->extractToken($request);

        if ($token === null) {
            throw new UnauthorizedException('Token not provided');
        }

        // 2. Verify token
        try {
            $payload = $this->tokenGenerator->verify($token);
        } catch (\Exception $e) {
            throw new UnauthorizedException('Invalid token: ' . $e->getMessage());
        }

        // 3. Get user
        $user = $this->userRepository->findById($payload['user_id']);

        if ($user === null) {
            throw new UnauthorizedException('User not found');
        }

        // 4. Set user to request context
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

### 2. Login Service

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
        // 1. Verify user credentials
        $user = $this->userRepository->findByEmail($email);

        if ($user === null || !$user->verifyPassword($password)) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // 2. Generate access token
        $accessToken = $this->tokenGenerator->generate([
            'user_id' => $user->id(),
            'email' => $user->email(),
        ], 3600); // 1 hour

        // 3. Generate refresh token
        $refreshToken = $this->tokenGenerator->generate([
            'user_id' => $user->id(),
            'type' => 'refresh',
        ], 2592000); // 30 days

        // 4. Save token record
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

### 3. User Resource Controller

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
     * Get user list
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
     * Get user details
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
     * Create user
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
     * Update user
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
     * Delete user
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

### 4. Resource Transformer

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

### 5. API Rate Limit Middleware

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
    private const MAX_REQUESTS = 60; // Max requests per minute
    private const WINDOW = 60; // Time window (seconds)

    public function process(Request $request, callable $next): Response
    {
        $key = $this->getRateLimitKey($request);

        // Get current request count
        $current = (int) Redis::get($key);

        if ($current >= self::MAX_REQUESTS) {
            throw new RateLimitExceededException(
                'Rate limit exceeded. Try again later.'
            );
        }

        // Increment counter
        Redis::incr($key);

        // Set expiry (on first request)
        if ($current === 0) {
            Redis::expire($key, self::WINDOW);
        }

        $response = $next($request);

        // Add rate limit headers
        $response->withHeaders([
            'X-RateLimit-Limit' => self::MAX_REQUESTS,
            'X-RateLimit-Remaining' => max(0, self::MAX_REQUESTS - $current - 1),
            'X-RateLimit-Reset' => time() + Redis::ttl($key),
        ]);

        return $response;
    }

    private function getRateLimitKey(Request $request): string
    {
        // Based on user ID or IP address
        $identifier = $request->user?->id ?? $request->getRealIp();

        return "rate_limit:{$identifier}:" . floor(time() / self::WINDOW);
    }
}
```

### 6. Saloon HTTP Client Integration

For detailed documentation, see: [Saloon Integration](/en/tools/saloon)

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

### 7. Unified Exception Handling

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
        // Return JSON format errors for API requests
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

### 8. API Response Trait

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

## Route Configuration Example

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
    // Public routes
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);

    // Authenticated routes
    Route::group('', function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::post('/auth/refresh', [AuthController::class, 'refresh']);

        // User resource
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        // Post resource
        Route::resource('/posts', PostController::class);
    })->middleware([AuthenticateMiddleware::class]);
})->middleware([
    CorsMiddleware::class,
    ApiRateLimitMiddleware::class,
]);
```

---

## Dependency Injection Configuration

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

## RESTful API Design Standards

### 1. HTTP Methods

- `GET` - Retrieve resource
- `POST` - Create resource
- `PUT` - Full update resource
- `PATCH` - Partial update resource
- `DELETE` - Delete resource

### 2. Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Delete successful
- `400 Bad Request` - Request parameter error
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - No permission
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation failed
- `429 Too Many Requests` - Too many requests
- `500 Internal Server Error` - Server error

### 3. URL Design

```
GET    /api/v1/users           # Get user list
GET    /api/v1/users/{id}      # Get single user
POST   /api/v1/users           # Create user
PUT    /api/v1/users/{id}      # Update user
DELETE /api/v1/users/{id}      # Delete user

GET    /api/v1/users/{id}/posts  # Get user's posts
```

### 4. Response Format

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

### 5. Pagination Format

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

## Best Practices

### 1. API Versioning

- URL versioning: `/api/v1/users`
- Header versioning: `Accept: application/vnd.api.v1+json`

### 2. Authentication & Authorization

- JWT Token authentication
- Token refresh mechanism
- Token blacklist

### 3. Rate Limiting Strategy

- User-based rate limiting
- IP-based rate limiting
- Different rate limits for different endpoints

### 4. Caching Strategy

- ETag caching
- Last-Modified caching
- Response caching

### 5. Error Handling

- Unified error format
- Detailed error messages
- Error code standards

### 6. Third-party API Integration

- Use Saloon for HTTP client integration
- Detailed documentation: [Saloon Integration](/en/tools/saloon)

---

## Related Documentation

- [Directory Structure Standards](/en/architecture/directory-structure)
- [Dependency Direction Rules](/en/architecture/dependency-rules)
- [PER Coding Style](/en/coding-standards/per-coding-style)
- [Saloon Integration](/en/tools/saloon)
