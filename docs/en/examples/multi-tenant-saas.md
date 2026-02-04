---
title: "Multi-tenant SaaS Example"
description: "Complete multi-tenant SaaS architecture example with tenant isolation, subscription management, and billing system"
---

## Table of Contents

- [System Overview](#system-overview)
- [Complete Directory Tree](#complete-directory-tree)
- [Module Breakdown](#module-breakdown)
- [Key Code Examples](#key-code-examples)

---

## System Overview

### Core Features

- Tenant Management - Tenant registration, configuration, isolation
- Subscription Management - Plans, subscriptions, upgrades/downgrades
- Billing System - Invoice generation, payments, invoices
- Usage Tracking - API calls, storage, bandwidth statistics
- Multi-tenant Isolation - Data isolation, resource isolation

### Technical Features

- Database-level tenant isolation
- Tenant-based middleware
- Subscription status management
- Usage metering and rate limiting
- Automatic billing

---

## Complete Directory Tree

```
app/
├── controller/
│   ├── api/
│   │   └── v1/
│   │       ├── TenantController.php           # Tenant Management
│   │       ├── SubscriptionController.php     # Subscription Management
│   │       ├── BillingController.php          # Billing Management
│   │       ├── UsageController.php            # Usage Query
│   │       └── InvoiceController.php          # Invoice Management
│   └── webhook/
│       └── PaymentWebhookController.php       # Payment Callback
│
├── model/
│   └── eloquent/
│       ├── Tenant.php                         # Tenant Model
│       ├── Subscription.php                   # Subscription Model
│       ├── Plan.php                           # Plan Model
│       ├── Invoice.php                        # Invoice Model
│       ├── Usage.php                          # Usage Record Model
│       └── TenantUser.php                     # Tenant User Model
│
├── service/
│   ├── tenant/
│   │   ├── CreateTenantService.php            # Create Tenant
│   │   ├── ProvisionTenantService.php         # Tenant Provisioning
│   │   └── SuspendTenantService.php           # Suspend Tenant
│   ├── subscription/
│   │   ├── CreateSubscriptionService.php      # Create Subscription
│   │   ├── UpgradeSubscriptionService.php     # Upgrade Subscription
│   │   ├── CancelSubscriptionService.php      # Cancel Subscription
│   │   └── RenewSubscriptionService.php       # Renew Subscription
│   ├── billing/
│   │   ├── GenerateInvoiceService.php         # Generate Invoice
│   │   ├── ProcessPaymentService.php          # Process Payment
│   │   └── CalculateUsageService.php          # Calculate Usage
│   └── usage/
│       ├── TrackUsageService.php              # Track Usage
│       └── CheckQuotaService.php              # Check Quota
│
├── domain/
│   ├── tenant/
│   │   ├── entity/
│   │   │   └── Tenant.php                     # Tenant Entity
│   │   ├── enum/                              # Enums
│   │   │   └── TenantStatus.php               # Tenant Status enum
│   │   ├── vo/                                # Value Objects
│   │   │   ├── TenantSlug.php                 # Tenant Identifier
│   │   │   └── TenantConfig.php               # Tenant Config
│   │   ├── event/
│   │   │   ├── TenantCreated.php
│   │   │   ├── TenantSuspended.php
│   │   │   └── TenantActivated.php
│   │   └── rule/
│   │       └── TenantProvisioningRule.php     # Tenant Provisioning Rule
│   │
│   ├── subscription/
│   │   ├── entity/
│   │   │   ├── Subscription.php               # Subscription Entity
│   │   │   └── Plan.php                       # Plan Entity
│   │   ├── enum/                              # Enums
│   │   │   └── SubscriptionStatus.php         # Subscription Status enum
│   │   ├── vo/                                # Value Objects
│   │   │   ├── BillingCycle.php               # Billing Cycle
│   │   │   └── PlanFeatures.php               # Plan Features
│   │   ├── event/
│   │   │   ├── SubscriptionCreated.php
│   │   │   ├── SubscriptionUpgraded.php
│   │   │   ├── SubscriptionCancelled.php
│   │   │   └── SubscriptionExpired.php
│   │   └── rule/
│   │       ├── UpgradeRule.php                # Upgrade Rule
│   │       └── CancellationRule.php           # Cancellation Rule
│   │
│   ├── billing/
│   │   ├── entity/
│   │   │   └── Invoice.php                    # Invoice Entity
│   │   ├── enum/                              # Enums
│   │   │   └── InvoiceStatus.php              # Invoice Status enum
│   │   ├── vo/                                # Value Objects
│   │   │   ├── InvoiceNumber.php              # Invoice Number
│   │   │   └── BillingAmount.php              # Billing Amount
│   │   └── rule/
│   │       └── InvoiceGenerationRule.php      # Invoice Generation Rule
│   │
│   └── usage/
│       ├── entity/
│       │   └── Usage.php                      # Usage Entity
│       ├── enum/                              # Enums
│       │   └── UsageType.php                  # Usage Type enum
│       ├── vo/                                # Value Objects
│       │   ├── Quota.php                      # Quota
│       │   └── UsageMetric.php                # Usage Metric
│       └── rule/
│           └── QuotaEnforcementRule.php       # Quota Enforcement Rule
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
│       └── TenantResolverInterface.php        # Tenant Resolver Interface
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
│       ├── SubdomainTenantResolver.php        # Subdomain Tenant Resolver
│       └── HeaderTenantResolver.php           # Header Tenant Resolver
│
├── middleware/
│   ├── tenant/
│   │   ├── IdentifyTenantMiddleware.php       # Identify Tenant
│   │   └── EnforceTenantScopeMiddleware.php   # Enforce Tenant Scope
│   ├── subscription/
│   │   └── CheckSubscriptionMiddleware.php    # Check Subscription Status
│   └── usage/
│       └── TrackUsageMiddleware.php           # Track Usage
│
├── process/
│   ├── task/
│   │   ├── GenerateInvoicesTask.php           # Generate Invoices Task
│   │   ├── ProcessExpiredSubscriptionsTask.php # Process Expired Subscriptions
│   │   └── AggregateUsageTask.php             # Aggregate Usage Statistics
│   └── queue/
│       └── TenantProvisioningConsumer.php     # Tenant Provisioning Consumer
│
└── support/
    ├── exception/
    │   ├── TenantNotFoundException.php
    │   ├── SubscriptionExpiredException.php
    │   └── QuotaExceededException.php
    └── trait/
        └── BelongsToTenant.php                # Tenant Association Trait
```

---

## Module Breakdown

### 1. Tenant Management Module

**Features**: Tenant registration, configuration, status management, data isolation

**Core Classes**:
- `domain/tenant/entity/Tenant.php` - Tenant entity
- `service/tenant/CreateTenantService.php` - Create tenant
- `middleware/tenant/IdentifyTenantMiddleware.php` - Tenant identification

### 2. Subscription Management Module

**Features**: Plan management, subscription creation, upgrades/downgrades, renewal/cancellation

**Core Classes**:
- `domain/subscription/entity/Subscription.php` - Subscription entity
- `service/subscription/UpgradeSubscriptionService.php` - Upgrade service

### 3. Billing System Module

**Features**: Invoice generation, payment processing, invoice management

**Core Classes**:
- `domain/billing/entity/Invoice.php` - Invoice entity
- `service/billing/GenerateInvoiceService.php` - Generate invoice

### 4. Usage Tracking Module

**Features**: API call statistics, storage statistics, quota limits

**Core Classes**:
- `domain/usage/entity/Usage.php` - Usage entity
- `service/usage/CheckQuotaService.php` - Quota check

---

## Key Code Examples

### 1. Tenant Entity

```php
<?php

declare(strict_types=1);

namespace app\domain\tenant\entity;

use app\domain\tenant\enum\TenantStatus;
use app\domain\tenant\vo\TenantSlug;
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
            status: TenantStatus::Active,
            config: [],
            createdAt: new \DateTimeImmutable()
        );

        $tenant->recordEvent(new TenantCreated($tenant));
        return $tenant;
    }

    public function suspend(): void
    {
        $this->status = TenantStatus::Suspended;
    }

    public function activate(): void
    {
        $this->status = TenantStatus::Active;
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

### 2. Subscription Entity

```php
<?php

declare(strict_types=1);

namespace app\domain\subscription\entity;

use app\domain\subscription\enum\SubscriptionStatus;
use app\domain\subscription\vo\BillingCycle;
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
            status: SubscriptionStatus::Active,
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
        $this->status = SubscriptionStatus::Cancelled;
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

### 3. Identify Tenant Middleware

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
        // 1. Resolve tenant identifier (from subdomain or header)
        $tenantSlug = $this->tenantResolver->resolve($request);

        if ($tenantSlug === null) {
            throw new TenantNotFoundException('Tenant not identified');
        }

        // 2. Get tenant
        $tenant = $this->tenantRepository->findBySlug($tenantSlug);

        if ($tenant === null) {
            throw new TenantNotFoundException("Tenant not found: {$tenantSlug}");
        }

        // 3. Check tenant status
        if (!$tenant->status()->isActive()) {
            return json([
                'error' => 'Tenant is suspended',
            ], 403);
        }

        // 4. Set current tenant to request context
        $request->tenant = $tenant;

        // 5. Set database connection tenant scope
        $this->setTenantScope($tenant->id());

        return $next($request);
    }

    private function setTenantScope(int $tenantId): void
    {
        // Globally set tenant ID for query filtering
        app('tenant.context')->setCurrentTenantId($tenantId);
    }
}
```

### 4. Check Subscription Middleware

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

        // Get tenant's active subscription
        $subscription = $this->subscriptionRepository->findActivByTenantId($tenant->id());

        if ($subscription === null || !$subscription->isActive()) {
            throw new SubscriptionExpiredException('Subscription expired or not found');
        }

        // Set subscription to request context
        $request->subscription = $subscription;

        return $next($request);
    }
}
```

### 5. Check Quota Service

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
        // 1. Get tenant subscription
        $subscription = $this->subscriptionRepository->findActiveByTenantId($tenantId);

        if ($subscription === null) {
            throw new QuotaExceededException('No active subscription');
        }

        // 2. Get plan quota
        $quota = $subscription->plan()->getQuota($usageType);

        // 3. Get current usage
        $currentUsage = $this->usageRepository->getCurrentMonthUsage($tenantId, $usageType);

        // 4. Check if quota exceeded
        if (!$this->quotaRule->isWithinLimit($currentUsage, $quota)) {
            throw new QuotaExceededException(
                "Quota exceeded for {$usageType}. Current: {$currentUsage}, Limit: {$quota}"
            );
        }
    }
}
```

### 6. Generate Invoice Service

```php
<?php

declare(strict_types=1);

namespace app\service\billing;

use app\contract\repository\InvoiceRepositoryInterface;
use app\contract\repository\SubscriptionRepositoryInterface;
use app\contract\repository\UsageRepositoryInterface;
use app\domain\billing\entity\Invoice;
use app\domain\billing\vo\InvoiceNumber;

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
        // 1. Get subscription
        $subscription = $this->subscriptionRepository->findActiveByTenantId($tenantId);

        // 2. Calculate base amount
        $baseAmount = $subscription->plan()->price();

        // 3. Calculate usage amount (if overage exists)
        $usageAmount = $this->calculateUsageAmount($tenantId, $billingPeriodStart);

        // 4. Create invoice
        $invoice = Invoice::create(
            invoiceNumber: InvoiceNumber::generate(),
            tenantId: $tenantId,
            subscriptionId: $subscription->id(),
            baseAmount: $baseAmount,
            usageAmount: $usageAmount,
            billingPeriodStart: $billingPeriodStart,
            billingPeriodEnd: $subscription->billingCycle()->calculateEndDate($billingPeriodStart)
        );

        // 5. Save invoice
        $this->invoiceRepository->save($invoice);

        return $invoice;
    }

    private function calculateUsageAmount(int $tenantId, \DateTimeImmutable $periodStart): int
    {
        // Calculate overage usage amount
        $overageUsage = $this->usageRepository->getOverageUsage($tenantId, $periodStart);
        return $overageUsage * 100; // $1 per unit
    }
}
```

### 7. Tenant Controller

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

## Data Isolation Strategy

### 1. Global Scope

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

### 2. Usage Example

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

## Scheduled Task Example

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
        // Generate invoices at 1 AM daily
        Timer::add(86400, function () {
            $this->generateMonthlyInvoices();
        }, [], false);
    }

    private function generateMonthlyInvoices(): void
    {
        $today = new \DateTimeImmutable();

        // Only execute on the 1st of each month
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

## Dependency Injection Configuration

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

## Best Practices

### 1. Tenant Isolation

- Database-level isolation (Global Scope)
- Automatic tenant_id filtering on every query
- Prevent cross-tenant data access

### 2. Subscription Management

- Automatic subscription status checking
- Automatic expired subscription handling
- Smooth upgrade/downgrade transitions

### 3. Billing System

- Automatic monthly invoice generation
- Automatic overage billing
- Payment failure retry mechanism

### 4. Quota Limits

- API call rate limiting
- Storage space limits
- Real-time quota checking

### 5. Performance Optimization

- Tenant information caching
- Subscription status caching
- Async usage statistics aggregation

---

## Related Documentation

- [Directory Structure Standards](../architecture/directory-structure.mdx)
- [Dependency Direction Rules](../architecture/dependency-rules.mdx)
- [PER Coding Style](../coding-standards/per-coding-style.mdx)
