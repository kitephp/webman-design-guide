# 多租户 SaaS 系统示例 | Multi-tenant SaaS Example

> 完整的多租户 SaaS 系统架构示例，展示租户隔离、订阅管理、计费系统
> Complete multi-tenant SaaS architecture example with tenant isolation, subscription management, and billing system

---

## 📋 目录 | Table of Contents

- [系统概述](#系统概述)
- [完整目录树](#完整目录树)
- [模块划分](#模块划分)
- [关键代码示例](#关键代码示例)

---

## 系统概述 | System Overview

### 核心功能 | Core Features

- 租户管理 (Tenant Management) - 租户注册、配置、隔离
- 订阅管理 (Subscription Management) - 套餐、订阅、升级降级
- 计费系统 (Billing System) - 账单生成、支付、发票
- 用量统计 (Usage Tracking) - API 调用、存储、带宽统计
- 多租户隔离 (Tenant Isolation) - 数据隔离、资源隔离

### 技术特点 | Technical Features

- 数据库级租户隔离
- 基于租户的中间件
- 订阅状态管理
- 用量计量和限流
- 自动计费

---

## 完整目录树 | Complete Directory Tree

```
app/
├── controller/
│   ├── api/
│   │   └── v1/
│   │       ├── TenantController.php           # 租户管理
│   │       ├── SubscriptionController.php     # 订阅管理
│   │       ├── BillingController.php          # 计费管理
│   │       ├── UsageController.php            # 用量查询
│   │       └── InvoiceController.php          # 发票管理
│   └── webhook/
│       └── PaymentWebhookController.php       # 支付回调
│
├── model/
│   └── eloquent/
│       ├── Tenant.php                         # 租户模型
│       ├── Subscription.php                   # 订阅模型
│       ├── Plan.php                           # 套餐模型
│       ├── Invoice.php                        # 发票模型
│       ├── Usage.php                          # 用量记录模型
│       └── TenantUser.php                     # 租户用户模型
│
├── service/
│   ├── tenant/
│   │   ├── CreateTenantService.php            # 创建租户
│   │   ├── ProvisionTenantService.php         # 租户初始化
│   │   └── SuspendTenantService.php           # 暂停租户
│   ├── subscription/
│   │   ├── CreateSubscriptionService.php      # 创建订阅
│   │   ├── UpgradeSubscriptionService.php     # 升级订阅
│   │   ├── CancelSubscriptionService.php      # 取消订阅
│   │   └── RenewSubscriptionService.php       # 续费订阅
│   ├── billing/
│   │   ├── GenerateInvoiceService.php         # 生成账单
│   │   ├── ProcessPaymentService.php          # 处理支付
│   │   └── CalculateUsageService.php          # 计算用量
│   └── usage/
│       ├── TrackUsageService.php              # 记录用量
│       └── CheckQuotaService.php              # 检查配额
│
├── domain/
│   ├── tenant/
│   │   ├── entity/
│   │   │   └── Tenant.php                     # 租户实体
│   │   ├── value_object/
│   │   │   ├── TenantStatus.php               # 租户状态
│   │   │   ├── TenantSlug.php                 # 租户标识
│   │   │   └── TenantConfig.php               # 租户配置
│   │   ├── event/
│   │   │   ├── TenantCreated.php
│   │   │   ├── TenantSuspended.php
│   │   │   └── TenantActivated.php
│   │   └── rule/
│   │       └── TenantProvisioningRule.php     # 租户初始化规则
│   │
│   ├── subscription/
│   │   ├── entity/
│   │   │   ├── Subscription.php               # 订阅实体
│   │   │   └── Plan.php                       # 套餐实体
│   │   ├── value_object/
│   │   │   ├── SubscriptionStatus.php         # 订阅状态
│   │   │   ├── BillingCycle.php               # 计费周期
│   │   │   └── PlanFeatures.php               # 套餐功能
│   │   ├── event/
│   │   │   ├── SubscriptionCreated.php
│   │   │   ├── SubscriptionUpgraded.php
│   │   │   ├── SubscriptionCancelled.php
│   │   │   └── SubscriptionExpired.php
│   │   └── rule/
│   │       ├── UpgradeRule.php                # 升级规则
│   │       └── CancellationRule.php           # 取消规则
│   │
│   ├── billing/
│   │   ├── entity/
│   │   │   └── Invoice.php                    # 发票实体
│   │   ├── value_object/
│   │   │   ├── InvoiceStatus.php              # 发票状态
│   │   │   ├── InvoiceNumber.php              # 发票号
│   │   │   └── BillingAmount.php              # 账单金额
│   │   └── rule/
│   │       └── InvoiceGenerationRule.php      # 账单生成规则
│   │
│   └── usage/
│       ├── entity/
│       │   └── Usage.php                      # 用量实体
│       ├── value_object/
│       │   ├── UsageType.php                  # 用量类型
│       │   ├── Quota.php                      # 配额
│       │   └── UsageMetric.php                # 用量指标
│       └── rule/
│           └── QuotaEnforcementRule.php       # 配额限制规则
│
├── contract/
│   ├── repository/
│   │   ├── TenantRepositoryInterface.php
│   │   ├── SubscriptionRepositoryInterface.php
│   │   ├── InvoiceRepositoryInterface.php
│   │   └── UsageRepositoryInterface.php
│   ├── gateway/
│   │   └── PaymentGatewayInterface.php
│   └── service/
│       └── TenantResolverInterface.php        # 租户解析接口
│
├── infrastructure/
│   ├── repository/
│   │   └── eloquent/
│   │       ├── EloquentTenantRepository.php
│   │       ├── EloquentSubscriptionRepository.php
│   │       ├── EloquentInvoiceRepository.php
│   │       └── EloquentUsageRepository.php
│   ├── gateway/
│   │   └── payment/
│   │       └── StripePaymentGateway.php
│   └── service/
│       ├── SubdomainTenantResolver.php        # 子域名租户解析
│       └── HeaderTenantResolver.php           # Header 租户解析
│
├── middleware/
│   ├── tenant/
│   │   ├── IdentifyTenantMiddleware.php       # 识别租户
│   │   └── EnforceTenantScopeMiddleware.php   # 强制租户隔离
│   ├── subscription/
│   │   └── CheckSubscriptionMiddleware.php    # 检查订阅状态
│   └── usage/
│       └── TrackUsageMiddleware.php           # 记录用量
│
├── process/
│   ├── task/
│   │   ├── GenerateInvoicesTask.php           # 生成账单任务
│   │   ├── ProcessExpiredSubscriptionsTask.php # 处理过期订阅
│   │   └── AggregateUsageTask.php             # 聚合用量统计
│   └── queue/
│       └── TenantProvisioningConsumer.php     # 租户初始化消费者
│
└── support/
    ├── exception/
    │   ├── TenantNotFoundException.php
    │   ├── SubscriptionExpiredException.php
    │   └── QuotaExceededException.php
    └── trait/
        └── BelongsToTenant.php                # 租户关联 Trait
```

---

## 模块划分 | Module Breakdown

### 1. 租户管理模块 (Tenant Management)

**功能**: 租户注册、配置、状态管理、数据隔离

**核心类**:
- `domain/tenant/entity/Tenant.php` - 租户实体
- `service/tenant/CreateTenantService.php` - 创建租户
- `middleware/tenant/IdentifyTenantMiddleware.php` - 租户识别

### 2. 订阅管理模块 (Subscription Management)

**功能**: 套餐管理、订阅创建、升级降级、续费取消

**核心类**:
- `domain/subscription/entity/Subscription.php` - 订阅实体
- `service/subscription/UpgradeSubscriptionService.php` - 升级服务

### 3. 计费系统模块 (Billing System)

**功能**: 账单生成、支付处理、发票管理

**核心类**:
- `domain/billing/entity/Invoice.php` - 发票实体
- `service/billing/GenerateInvoiceService.php` - 生成账单

### 4. 用量统计模块 (Usage Tracking)

**功能**: API 调用统计、存储统计、配额限制

**核心类**:
- `domain/usage/entity/Usage.php` - 用量实体
- `service/usage/CheckQuotaService.php` - 配额检查

---

## 关键代码示例 | Key Code Examples

### 1. 租户实体 (Tenant Entity)

```php
<?php

declare(strict_types=1);

namespace app\domain\tenant\entity;

use app\domain\tenant\value_object\TenantStatus;
use app\domain\tenant\value_object\TenantSlug;
use app\domain\tenant\event\TenantCreated;

final class Tenant
{
    private array $domainEvents = [];

    private function __construct(
        private readonly int $id,
        private readonly TenantSlug $slug,
        private string $name,
        private TenantStatus $status,
        private array $config,
        private readonly \DateTimeImmutable $createdAt
    ) {
    }

    public static function create(TenantSlug $slug, string $name): self
    {
        $tenant = new self(
            id: 0,
            slug: $slug,
            name: $name,
            status: TenantStatus::active(),
            config: [],
            createdAt: new \DateTimeImmutable()
        );

        $tenant->recordEvent(new TenantCreated($tenant));
        return $tenant;
    }

    public function suspend(): void
    {
        $this->status = TenantStatus::suspended();
    }

    public function activate(): void
    {
        $this->status = TenantStatus::active();
    }

    public function id(): int
    {
        return $this->id;
    }

    public function slug(): TenantSlug
    {
        return $this->slug;
    }

    public function status(): TenantStatus
    {
        return $this->status;
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

### 2. 订阅实体 (Subscription Entity)

```php
<?php

declare(strict_types=1);

namespace app\domain\subscription\entity;

use app\domain\subscription\value_object\SubscriptionStatus;
use app\domain\subscription\value_object\BillingCycle;
use app\domain\subscription\event\SubscriptionUpgraded;

final class Subscription
{
    private array $domainEvents = [];

    private function __construct(
        private readonly int $id,
        private readonly int $tenantId,
        private int $planId,
        private SubscriptionStatus $status,
        private BillingCycle $billingCycle,
        private \DateTimeImmutable $startDate,
        private \DateTimeImmutable $endDate,
        private readonly \DateTimeImmutable $createdAt
    ) {
    }

    public static function create(
        int $tenantId,
        int $planId,
        BillingCycle $billingCycle
    ): self {
        $startDate = new \DateTimeImmutable();
        $endDate = $billingCycle->calculateEndDate($startDate);

        return new self(
            id: 0,
            tenantId: $tenantId,
            planId: $planId,
            status: SubscriptionStatus::active(),
            billingCycle: $billingCycle,
            startDate: $startDate,
            endDate: $endDate,
            createdAt: new \DateTimeImmutable()
        );
    }

    public function upgrade(int $newPlanId): void
    {
        $oldPlanId = $this->planId;
        $this->planId = $newPlanId;
        $this->recordEvent(new SubscriptionUpgraded($this, $oldPlanId, $newPlanId));
    }

    public function cancel(): void
    {
        $this->status = SubscriptionStatus::cancelled();
    }

    public function isActive(): bool
    {
        return $this->status->isActive() && $this->endDate > new \DateTimeImmutable();
    }

    public function tenantId(): int
    {
        return $this->tenantId;
    }

    public function planId(): int
    {
        return $this->planId;
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

### 3. 租户识别中间件 (Identify Tenant Middleware)

```php
<?php

declare(strict_types=1);

namespace app\middleware\tenant;

use app\contract\service\TenantResolverInterface;
use app\contract\repository\TenantRepositoryInterface;
use app\support\exception\TenantNotFoundException;
use Webman\MiddlewareInterface;
use Webman\Http\Response;
use Webman\Http\Request;

final class IdentifyTenantMiddleware implements MiddlewareInterface
{
    public function __construct(
        private readonly TenantResolverInterface $tenantResolver,
        private readonly TenantRepositoryInterface $tenantRepository
    ) {
    }

    public function process(Request $request, callable $next): Response
    {
        // 1. 解析租户标识（从子域名或 Header）
        $tenantSlug = $this->tenantResolver->resolve($request);

        if ($tenantSlug === null) {
            throw new TenantNotFoundException('Tenant not identified');
        }

        // 2. 获取租户
        $tenant = $this->tenantRepository->findBySlug($tenantSlug);

        if ($tenant === null) {
            throw new TenantNotFoundException("Tenant not found: {$tenantSlug}");
        }

        // 3. 检查租户状态
        if (!$tenant->status()->isActive()) {
            return json([
                'error' => 'Tenant is suspended',
            ], 403);
        }

        // 4. 设置当前租户到请求上下文
        $request->tenant = $tenant;

        // 5. 设置数据库连接的租户作用域
        $this->setTenantScope($tenant->id());

        return $next($request);
    }

    private function setTenantScope(int $tenantId): void
    {
        // 全局设置租户 ID，用于查询过滤
        app('tenant.context')->setCurrentTenantId($tenantId);
    }
}
```

### 4. 检查订阅中间件 (Check Subscription Middleware)

```php
<?php

declare(strict_types=1);

namespace app\middleware\subscription;

use app\contract\repository\SubscriptionRepositoryInterface;
use app\support\exception\SubscriptionExpiredException;
use Webman\MiddlewareInterface;
use Webman\Http\Response;
use Webman\Http\Request;

final class CheckSubscriptionMiddleware implements MiddlewareInterface
{
    public function __construct(
        private readonly SubscriptionRepositoryInterface $subscriptionRepository
    ) {
    }

    public function process(Request $request, callable $next): Response
    {
        $tenant = $request->tenant;

        if ($tenant === null) {
            return json(['error' => 'Tenant not identified'], 400);
        }

        // 获取租户的活跃订阅
        $subscription = $this->subscriptionRepository->findActivByTenantId($tenant->id());

        if ($subscription === null || !$subscription->isActive()) {
            throw new SubscriptionExpiredException('Subscription expired or not found');
        }

        // 设置订阅到请求上下文
        $request->subscription = $subscription;

        return $next($request);
    }
}
```

### 5. 配额检查服务 (Check Quota Service)

```php
<?php

declare(strict_types=1);

namespace app\service\usage;

use app\contract\repository\UsageRepositoryInterface;
use app\contract\repository\SubscriptionRepositoryInterface;
use app\domain\usage\rule\QuotaEnforcementRule;
use app\support\exception\QuotaExceededException;

final class CheckQuotaService
{
    public function __construct(
        private readonly UsageRepositoryInterface $usageRepository,
        private readonly SubscriptionRepositoryInterface $subscriptionRepository,
        private readonly QuotaEnforcementRule $quotaRule
    ) {
    }

    public function check(int $tenantId, string $usageType): void
    {
        // 1. 获取租户订阅
        $subscription = $this->subscriptionRepository->findActiveByTenantId($tenantId);

        if ($subscription === null) {
            throw new QuotaExceededException('No active subscription');
        }

        // 2. 获取套餐配额
        $quota = $subscription->plan()->getQuota($usageType);

        // 3. 获取当前用量
        $currentUsage = $this->usageRepository->getCurrentMonthUsage($tenantId, $usageType);

        // 4. 检查是否超出配额
        if (!$this->quotaRule->isWithinLimit($currentUsage, $quota)) {
            throw new QuotaExceededException(
                "Quota exceeded for {$usageType}. Current: {$currentUsage}, Limit: {$quota}"
            );
        }
    }
}
```

### 6. 生成账单服务 (Generate Invoice Service)

```php
<?php

declare(strict_types=1);

namespace app\service\billing;

use app\contract\repository\InvoiceRepositoryInterface;
use app\contract\repository\SubscriptionRepositoryInterface;
use app\contract\repository\UsageRepositoryInterface;
use app\domain\billing\entity\Invoice;
use app\domain\billing\value_object\InvoiceNumber;

final class GenerateInvoiceService
{
    public function __construct(
        private readonly InvoiceRepositoryInterface $invoiceRepository,
        private readonly SubscriptionRepositoryInterface $subscriptionRepository,
        private readonly UsageRepositoryInterface $usageRepository
    ) {
    }

    public function handle(int $tenantId, \DateTimeImmutable $billingPeriodStart): Invoice
    {
        // 1. 获取订阅
        $subscription = $this->subscriptionRepository->findActiveByTenantId($tenantId);

        // 2. 计算基础费用
        $baseAmount = $subscription->plan()->price();

        // 3. 计算用量费用（如果有超出套餐的用量）
        $usageAmount = $this->calculateUsageAmount($tenantId, $billingPeriodStart);

        // 4. 创建发票
        $invoice = Invoice::create(
            invoiceNumber: InvoiceNumber::generate(),
            tenantId: $tenantId,
            subscriptionId: $subscription->id(),
            baseAmount: $baseAmount,
            usageAmount: $usageAmount,
            billingPeriodStart: $billingPeriodStart,
            billingPeriodEnd: $subscription->billingCycle()->calculateEndDate($billingPeriodStart)
        );

        // 5. 保存发票
        $this->invoiceRepository->save($invoice);

        return $invoice;
    }

    private function calculateUsageAmount(int $tenantId, \DateTimeImmutable $periodStart): int
    {
        // 计算超出套餐的用量费用
        $overageUsage = $this->usageRepository->getOverageUsage($tenantId, $periodStart);
        return $overageUsage * 100; // 每单位 $1
    }
}
```

### 7. 租户控制器 (Tenant Controller)

```php
<?php

declare(strict_types=1);

namespace app\controller\api\v1;

use app\service\tenant\CreateTenantService;
use app\contract\repository\TenantRepositoryInterface;
use support\Request;
use support\Response;

final class TenantController
{
    public function __construct(
        private readonly CreateTenantService $createTenantService,
        private readonly TenantRepositoryInterface $tenantRepository
    ) {
    }

    /**
     * 创建租户（注册）
     * Create tenant (registration)
     */
    public function create(Request $request): Response
    {
        $validated = $this->validate($request, [
            'slug' => 'required|string|alpha_dash|unique:tenants',
            'name' => 'required|string|max:100',
            'email' => 'required|email',
            'plan_id' => 'required|integer',
        ]);

        $tenant = $this->createTenantService->handle(
            slug: $validated['slug'],
            name: $validated['name'],
            email: $validated['email'],
            planId: $validated['plan_id']
        );

        return json([
            'success' => true,
            'data' => [
                'id' => $tenant->id(),
                'slug' => $tenant->slug()->value(),
                'subdomain' => $tenant->slug()->value() . '.example.com',
            ],
        ]);
    }

    /**
     * 获取当前租户信息
     * Get current tenant info
     */
    public function current(Request $request): Response
    {
        $tenant = $request->tenant;

        return json([
            'success' => true,
            'data' => [
                'id' => $tenant->id(),
                'slug' => $tenant->slug()->value(),
                'name' => $tenant->name(),
                'status' => $tenant->status()->value(),
            ],
        ]);
    }
}
```

---

## 数据隔离策略 | Data Isolation Strategy

### 1. 全局作用域 (Global Scope)

```php
<?php

namespace app\support\trait;

use Illuminate\Database\Eloquent\Builder;

trait BelongsToTenant
{
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope('tenant', function (Builder $builder) {
            $tenantId = app('tenant.context')->getCurrentTenantId();

            if ($tenantId !== null) {
                $builder->where('tenant_id', $tenantId);
            }
        });

        static::creating(function ($model) {
            if (!$model->tenant_id) {
                $model->tenant_id = app('tenant.context')->getCurrentTenantId();
            }
        });
    }
}
```

### 2. 使用示例

```php
<?php

namespace app\model\eloquent;

use Illuminate\Database\Eloquent\Model;
use app\support\trait\BelongsToTenant;

class Product extends Model
{
    use BelongsToTenant;

    protected $fillable = ['tenant_id', 'name', 'price'];
}
```

---

## 定时任务示例 | Scheduled Task Example

```php
<?php

declare(strict_types=1);

namespace app\process\task;

use app\service\billing\GenerateInvoiceService;
use app\contract\repository\TenantRepositoryInterface;
use Workerman\Timer;

final class GenerateInvoicesTask
{
    public function __construct(
        private readonly GenerateInvoiceService $invoiceService,
        private readonly TenantRepositoryInterface $tenantRepository
    ) {
    }

    public function onWorkerStart(): void
    {
        // 每天凌晨 1 点生成账单
        Timer::add(86400, function () {
            $this->generateMonthlyInvoices();
        }, [], false);
    }

    private function generateMonthlyInvoices(): void
    {
        $today = new \DateTimeImmutable();

        // 只在每月 1 号执行
        if ((int) $today->format('d') !== 1) {
            return;
        }

        $billingPeriodStart = $today->modify('-1 month');
        $tenants = $this->tenantRepository->findAllActive();

        foreach ($tenants as $tenant) {
            try {
                $this->invoiceService->handle($tenant->id(), $billingPeriodStart);
            } catch (\Exception $e) {
                logger()->error('Failed to generate invoice', [
                    'tenant_id' => $tenant->id(),
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }
}
```

---

## 依赖注入配置 | Dependency Injection Configuration

```php
<?php
// config/container.php

use app\contract\repository\TenantRepositoryInterface;
use app\contract\repository\SubscriptionRepositoryInterface;
use app\contract\service\TenantResolverInterface;
use app\infrastructure\repository\eloquent\EloquentTenantRepository;
use app\infrastructure\repository\eloquent\EloquentSubscriptionRepository;
use app\infrastructure\service\SubdomainTenantResolver;

return [
    TenantRepositoryInterface::class => EloquentTenantRepository::class,
    SubscriptionRepositoryInterface::class => EloquentSubscriptionRepository::class,
    TenantResolverInterface::class => SubdomainTenantResolver::class,
];
```

---

## 最佳实践 | Best Practices

### 1. 租户隔离

- 数据库级别隔离（Global Scope）
- 每个查询自动添加 tenant_id 过滤
- 防止跨租户数据访问

### 2. 订阅管理

- 订阅状态自动检查
- 过期订阅自动处理
- 升级降级平滑过渡

### 3. 计费系统

- 自动生成月度账单
- 用量超出自动计费
- 支付失败重试机制

### 4. 配额限制

- API 调用限流
- 存储空间限制
- 实时配额检查

### 5. 性能优化

- 租户信息缓存
- 订阅状态缓存
- 用量统计异步聚合

---

## 相关文档 | Related Documentation

- [目录结构规范](../architecture/directory-structure.md)
- [依赖方向规则](../architecture/dependency-rules.md)
- [PER Coding Style](../coding-standards/per-coding-style.md)

---

**最后更新 | Last Updated**: 2026-02-02
