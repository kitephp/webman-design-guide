# 工单客服系统 | Ticketing/Customer Service System

> 基于 Webman 的工单管理和客服系统架构示例
> Ticketing management and customer service system architecture example based on Webman

---

## 📋 目录 | Table of Contents

- [完整目录树](#完整目录树)
- [模块划分](#模块划分)
- [目录职责](#目录职责)
- [关键代码示例](#关键代码示例)

---

## 完整目录树

```
app/
├─ controller/
│  ├─ api/
│  │  └─ v1/
│  │     ├─ TicketController.php          # 工单管理
│  │     ├─ CommentController.php         # 评论管理
│  │     ├─ AssignmentController.php      # 工单分配
│  │     └─ SlaController.php             # SLA 管理
│  └─ admin/
│     └─ TicketManagementController.php   # 后台管理
│
├─ model/
│  └─ eloquent/
│     ├─ Ticket.php                       # 工单模型
│     ├─ Comment.php                      # 评论模型
│     ├─ Assignment.php                   # 分配记录
│     ├─ SlaPolicy.php                    # SLA 策略
│     └─ TicketHistory.php                # 工单历史
│
├─ middleware/
│  ├─ auth/
│  │  ├─ AgentAuthMiddleware.php         # 客服认证
│  │  └─ CustomerAuthMiddleware.php      # 客户认证
│  └─ permission/
│     └─ TicketAccessMiddleware.php       # 工单访问权限
│
├─ process/
│  ├─ task/
│  │  ├─ SlaMonitorTask.php              # SLA 监控任务
│  │  ├─ AutoAssignTask.php              # 自动分配任务
│  │  └─ EscalationTask.php              # 升级任务
│  └─ queue/
│     └─ NotificationQueue.php            # 通知队列
│
├─ service/
│  ├─ ticket/
│  │  ├─ CreateTicketService.php         # 创建工单
│  │  ├─ UpdateTicketService.php         # 更新工单
│  │  ├─ CloseTicketService.php          # 关闭工单
│  │  ├─ AssignTicketService.php         # 分配工单
│  │  └─ EscalateTicketService.php       # 升级工单
│  ├─ comment/
│  │  ├─ AddCommentService.php           # 添加评论
│  │  └─ AddInternalNoteService.php      # 添加内部备注
│  ├─ sla/
│  │  ├─ CalculateSlaService.php         # 计算 SLA
│  │  └─ CheckSlaBreachService.php       # 检查 SLA 违规
│  └─ assignment/
│     ├─ AutoAssignService.php            # 自动分配
│     └─ LoadBalanceService.php           # 负载均衡
│
├─ domain/
│  ├─ ticket/
│  │  ├─ entity/
│  │  │  ├─ Ticket.php                   # 工单实体
│  │  │  ├─ Comment.php                  # 评论实体
│  │  │  └─ Assignment.php               # 分配实体
│  │  ├─ value_object/
│  │  │  ├─ TicketStatus.php            # 工单状态
│  │  │  ├─ Priority.php                # 优先级
│  │  │  ├─ Category.php                # 分类
│  │  │  └─ TicketNumber.php            # 工单号
│  │  ├─ event/
│  │  │  ├─ TicketCreated.php           # 工单已创建
│  │  │  ├─ TicketAssigned.php          # 工单已分配
│  │  │  ├─ TicketStatusChanged.php     # 状态已变更
│  │  │  └─ TicketEscalated.php         # 工单已升级
│  │  └─ rule/
│  │     ├─ AssignmentRule.php          # 分配规则
│  │     └─ EscalationRule.php          # 升级规则
│  │
│  └─ sla/
│     ├─ entity/
│     │  ├─ SlaPolicy.php               # SLA 策略实体
│     │  └─ SlaTarget.php               # SLA 目标
│     ├─ value_object/
│     │  ├─ ResponseTime.php            # 响应时间
│     │  ├─ ResolutionTime.php          # 解决时间
│     │  └─ SlaStatus.php               # SLA 状态
│     └─ rule/
│        └─ SlaCalculationRule.php      # SLA 计算规则
│
├─ contract/
│  ├─ repository/
│  │  ├─ TicketRepositoryInterface.php
│  │  ├─ CommentRepositoryInterface.php
│  │  ├─ AssignmentRepositoryInterface.php
│  │  └─ SlaRepositoryInterface.php
│  ├─ gateway/
│  │  ├─ EmailGatewayInterface.php      # 邮件网关
│  │  └─ SmsGatewayInterface.php        # 短信网关
│  └─ service/
│     └─ NotificationServiceInterface.php
│
├─ infrastructure/
│  ├─ repository/
│  │  └─ eloquent/
│  │     ├─ EloquentTicketRepository.php
│  │     ├─ EloquentCommentRepository.php
│  │     └─ EloquentSlaRepository.php
│  │
│  ├─ gateway/
│  │  ├─ email/
│  │  │  └─ SendgridEmailGateway.php    # Sendgrid 邮件
│  │  └─ sms/
│  │     └─ TwilioSmsGateway.php        # Twilio 短信
│  │
│  └─ notification/
│     ├─ EmailNotificationChannel.php    # 邮件通知渠道
│     └─ SmsNotificationChannel.php      # 短信通知渠道
│
└─ support/
   ├─ helper/
   │  └─ ticket_helper.php
   └─ exception/
      ├─ TicketException.php
      └─ SlaException.php
```

---

## 模块划分

### 核心模块 | Core Modules

1. **工单模块 (Ticket)**
   - 创建/更新/关闭工单
   - 工单状态流转
   - 工单历史记录
   - 工单搜索和过滤

2. **分配模块 (Assignment)**
   - 手动分配
   - 自动分配（负载均衡）
   - 转派工单
   - 客服工作量统计

3. **SLA 模块 (Service Level Agreement)**
   - SLA 策略管理
   - 响应时间监控
   - 解决时间监控
   - SLA 违规告警

4. **评论模块 (Comment)**
   - 客户评论
   - 客服回复
   - 内部备注
   - 附件管理

5. **升级模块 (Escalation)**
   - 自动升级规则
   - 手动升级
   - 升级通知

---

## 目录职责

### `app/service/ticket/`
**职责**: 工单业务编排
- 创建工单流程（验证、分配、通知）
- 更新工单流程（状态变更、历史记录）
- 关闭工单流程（满意度调查）

### `app/service/sla/`
**职责**: SLA 管理编排
- 计算 SLA 时间
- 检查 SLA 违规
- 触发告警

### `app/domain/ticket/`
**职责**: 工单领域逻辑
- 工单状态机
- 优先级规则
- 分配规则
- 升级规则

### `app/domain/sla/`
**职责**: SLA 领域逻辑
- SLA 策略定义
- 响应时间计算
- 解决时间计算
- 工作时间计算（排除非工作时间）

### `app/process/task/`
**职责**: 后台任务
- SLA 监控（每分钟检查）
- 自动分配（队列处理）
- 自动升级（定时检查）

---

## 关键代码示例

### 1. 创建工单服务

```php
<?php

declare(strict_types=1);

namespace app\service\ticket;

use app\contract\repository\TicketRepositoryInterface;
use app\domain\ticket\entity\Ticket;
use app\domain\ticket\value_object\Priority;
use app\domain\ticket\value_object\Category;
use app\service\assignment\AutoAssignService;
use app\service\sla\CalculateSlaService;
use support\Db;

/**
 * 创建工单服务
 * Create Ticket Service
 */
final class CreateTicketService
{
    public function __construct(
        private readonly TicketRepositoryInterface $ticketRepository,
        private readonly AutoAssignService $autoAssignService,
        private readonly CalculateSlaService $calculateSlaService
    ) {
    }

    public function handle(
        int $customerId,
        string $subject,
        string $description,
        string $priority,
        string $category
    ): Ticket {
        return Db::transaction(function () use (
            $customerId,
            $subject,
            $description,
            $priority,
            $category
        ) {
            // 1. 创建工单实体
            $ticket = Ticket::create(
                customerId: $customerId,
                subject: $subject,
                description: $description,
                priority: Priority::from($priority),
                category: Category::from($category)
            );

            // 2. 生成工单号
            $ticket->generateTicketNumber();

            // 3. 持久化
            $this->ticketRepository->save($ticket);

            // 4. 自动分配客服
            $this->autoAssignService->assign($ticket);

            // 5. 计算 SLA 目标时间
            $this->calculateSlaService->calculate($ticket);

            // 6. 发送通知（通过事件）
            foreach ($ticket->releaseEvents() as $event) {
                event($event);
            }

            return $ticket;
        });
    }
}
```

### 2. 工单实体

```php
<?php

declare(strict_types=1);

namespace app\domain\ticket\entity;

use app\domain\ticket\value_object\TicketStatus;
use app\domain\ticket\value_object\Priority;
use app\domain\ticket\value_object\Category;
use app\domain\ticket\value_object\TicketNumber;
use app\domain\ticket\event\TicketCreated;
use app\domain\ticket\event\TicketStatusChanged;
use app\domain\ticket\exception\InvalidTicketException;

/**
 * 工单实体
 * Ticket Entity
 */
final class Ticket
{
    private array $domainEvents = [];

    private function __construct(
        private readonly int $id,
        private readonly int $customerId,
        private ?int $assignedAgentId,
        private TicketNumber $ticketNumber,
        private readonly string $subject,
        private readonly string $description,
        private Priority $priority,
        private readonly Category $category,
        private TicketStatus $status,
        private readonly \DateTimeImmutable $createdAt,
        private ?\DateTimeImmutable $firstResponseAt,
        private ?\DateTimeImmutable $resolvedAt,
        private ?\DateTimeImmutable $closedAt
    ) {
    }

    public static function create(
        int $customerId,
        string $subject,
        string $description,
        Priority $priority,
        Category $category
    ): self {
        // 验证
        if (empty($subject)) {
            throw new InvalidTicketException('Subject cannot be empty');
        }

        $ticket = new self(
            id: 0,
            customerId: $customerId,
            assignedAgentId: null,
            ticketNumber: TicketNumber::generate(),
            subject: $subject,
            description: $description,
            priority: $priority,
            category: $category,
            status: TicketStatus::new(),
            createdAt: new \DateTimeImmutable(),
            firstResponseAt: null,
            resolvedAt: null,
            closedAt: null
        );

        $ticket->recordEvent(new TicketCreated($ticket));

        return $ticket;
    }

    public function assign(int $agentId): void
    {
        if ($this->status->isClosed()) {
            throw new InvalidTicketException('Cannot assign closed ticket');
        }

        $this->assignedAgentId = $agentId;
        $this->status = TicketStatus::assigned();

        $this->recordEvent(new TicketStatusChanged($this, 'assigned'));
    }

    public function markAsInProgress(): void
    {
        if (!$this->status->canTransitionTo(TicketStatus::inProgress())) {
            throw new InvalidTicketException('Invalid status transition');
        }

        $this->status = TicketStatus::inProgress();
        $this->recordEvent(new TicketStatusChanged($this, 'in_progress'));
    }

    public function markAsResolved(): void
    {
        if (!$this->status->canTransitionTo(TicketStatus::resolved())) {
            throw new InvalidTicketException('Invalid status transition');
        }

        $this->status = TicketStatus::resolved();
        $this->resolvedAt = new \DateTimeImmutable();
        $this->recordEvent(new TicketStatusChanged($this, 'resolved'));
    }

    public function close(): void
    {
        if (!$this->status->canTransitionTo(TicketStatus::closed())) {
            throw new InvalidTicketException('Invalid status transition');
        }

        $this->status = TicketStatus::closed();
        $this->closedAt = new \DateTimeImmutable();
        $this->recordEvent(new TicketStatusChanged($this, 'closed'));
    }

    public function escalate(): void
    {
        // 提升优先级
        $this->priority = $this->priority->escalate();
        $this->recordEvent(new TicketEscalated($this));
    }

    public function recordFirstResponse(): void
    {
        if ($this->firstResponseAt === null) {
            $this->firstResponseAt = new \DateTimeImmutable();
        }
    }

    public function generateTicketNumber(): void
    {
        $this->ticketNumber = TicketNumber::generate();
    }

    // Getters
    public function id(): int
    {
        return $this->id;
    }

    public function customerId(): int
    {
        return $this->customerId;
    }

    public function assignedAgentId(): ?int
    {
        return $this->assignedAgentId;
    }

    public function ticketNumber(): TicketNumber
    {
        return $this->ticketNumber;
    }

    public function subject(): string
    {
        return $this->subject;
    }

    public function priority(): Priority
    {
        return $this->priority;
    }

    public function category(): Category
    {
        return $this->category;
    }

    public function status(): TicketStatus
    {
        return $this->status;
    }

    public function createdAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function firstResponseAt(): ?\DateTimeImmutable
    {
        return $this->firstResponseAt;
    }

    public function resolvedAt(): ?\DateTimeImmutable
    {
        return $this->resolvedAt;
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

### 3. 工单状态值对象

```php
<?php

declare(strict_types=1);

namespace app\domain\ticket\value_object;

/**
 * 工单状态值对象
 * Ticket Status Value Object
 */
final class TicketStatus
{
    private const NEW = 'new';
    private const ASSIGNED = 'assigned';
    private const IN_PROGRESS = 'in_progress';
    private const WAITING_CUSTOMER = 'waiting_customer';
    private const RESOLVED = 'resolved';
    private const CLOSED = 'closed';

    private const VALID_TRANSITIONS = [
        self::NEW => [self::ASSIGNED, self::CLOSED],
        self::ASSIGNED => [self::IN_PROGRESS, self::CLOSED],
        self::IN_PROGRESS => [self::WAITING_CUSTOMER, self::RESOLVED, self::CLOSED],
        self::WAITING_CUSTOMER => [self::IN_PROGRESS, self::CLOSED],
        self::RESOLVED => [self::CLOSED, self::IN_PROGRESS],
        self::CLOSED => [],
    ];

    private function __construct(
        private readonly string $value
    ) {
        if (!in_array($value, [
            self::NEW,
            self::ASSIGNED,
            self::IN_PROGRESS,
            self::WAITING_CUSTOMER,
            self::RESOLVED,
            self::CLOSED,
        ], true)) {
            throw new \InvalidArgumentException("Invalid ticket status: {$value}");
        }
    }

    public static function new(): self
    {
        return new self(self::NEW);
    }

    public static function assigned(): self
    {
        return new self(self::ASSIGNED);
    }

    public static function inProgress(): self
    {
        return new self(self::IN_PROGRESS);
    }

    public static function waitingCustomer(): self
    {
        return new self(self::WAITING_CUSTOMER);
    }

    public static function resolved(): self
    {
        return new self(self::RESOLVED);
    }

    public static function closed(): self
    {
        return new self(self::CLOSED);
    }

    public static function from(string $value): self
    {
        return new self($value);
    }

    public function canTransitionTo(self $newStatus): bool
    {
        return in_array(
            $newStatus->value,
            self::VALID_TRANSITIONS[$this->value] ?? [],
            true
        );
    }

    public function isClosed(): bool
    {
        return $this->value === self::CLOSED;
    }

    public function isResolved(): bool
    {
        return $this->value === self::RESOLVED;
    }

    public function value(): string
    {
        return $this->value;
    }

    public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }
}
```

### 4. 自动分配服务

```php
<?php

declare(strict_types=1);

namespace app\service\assignment;

use app\contract\repository\TicketRepositoryInterface;
use app\contract\repository\AssignmentRepositoryInterface;
use app\domain\ticket\entity\Ticket;
use app\service\assignment\LoadBalanceService;

/**
 * 自动分配服务
 * Auto Assignment Service
 */
final class AutoAssignService
{
    public function __construct(
        private readonly TicketRepositoryInterface $ticketRepository,
        private readonly AssignmentRepositoryInterface $assignmentRepository,
        private readonly LoadBalanceService $loadBalanceService
    ) {
    }

    public function assign(Ticket $ticket): void
    {
        // 1. 根据分配规则选择客服
        $agentId = $this->selectAgent($ticket);

        if ($agentId === null) {
            // 没有可用客服，放入待分配队列
            return;
        }

        // 2. 分配工单
        $ticket->assign($agentId);
        $this->ticketRepository->save($ticket);

        // 3. 记录分配历史
        $this->assignmentRepository->recordAssignment(
            $ticket->id(),
            $agentId,
            'auto'
        );
    }

    private function selectAgent(Ticket $ticket): ?int
    {
        // 1. 获取该分类下的可用客服
        $availableAgents = $this->getAvailableAgents($ticket->category());

        if (empty($availableAgents)) {
            return null;
        }

        // 2. 使用负载均衡算法选择客服
        return $this->loadBalanceService->selectAgent(
            $availableAgents,
            $ticket->priority()
        );
    }

    private function getAvailableAgents(Category $category): array
    {
        // 获取在线且未满负载的客服
        return [];
    }
}
```

### 5. SLA 计算服务

```php
<?php

declare(strict_types=1);

namespace app\service\sla;

use app\contract\repository\SlaRepositoryInterface;
use app\domain\ticket\entity\Ticket;
use app\domain\sla\entity\SlaTarget;
use app\domain\sla\value_object\ResponseTime;
use app\domain\sla\value_object\ResolutionTime;

/**
 * SLA 计算服务
 * SLA Calculation Service
 */
final class CalculateSlaService
{
    public function __construct(
        private readonly SlaRepositoryInterface $slaRepository
    ) {
    }

    public function calculate(Ticket $ticket): SlaTarget
    {
        // 1. 获取 SLA 策略
        $policy = $this->slaRepository->findPolicyByPriorityAndCategory(
            $ticket->priority(),
            $ticket->category()
        );

        // 2. 计算响应时间目标
        $responseTarget = $this->calculateResponseTarget(
            $ticket->createdAt(),
            $policy->responseTimeMinutes()
        );

        // 3. 计算解决时间目标
        $resolutionTarget = $this->calculateResolutionTarget(
            $ticket->createdAt(),
            $policy->resolutionTimeMinutes()
        );

        // 4. 创建 SLA 目标
        $slaTarget = SlaTarget::create(
            ticketId: $ticket->id(),
            responseTarget: ResponseTime::fromMinutes($policy->responseTimeMinutes()),
            resolutionTarget: ResolutionTime::fromMinutes($policy->resolutionTimeMinutes()),
            responseDeadline: $responseTarget,
            resolutionDeadline: $resolutionTarget
        );

        // 5. 保存
        $this->slaRepository->saveSlaTarget($slaTarget);

        return $slaTarget;
    }

    private function calculateResponseTarget(
        \DateTimeImmutable $startTime,
        int $minutes
    ): \DateTimeImmutable {
        // 计算工作时间（排除非工作时间）
        return $this->addBusinessMinutes($startTime, $minutes);
    }

    private function calculateResolutionTarget(
        \DateTimeImmutable $startTime,
        int $minutes
    ): \DateTimeImmutable {
        return $this->addBusinessMinutes($startTime, $minutes);
    }

    private function addBusinessMinutes(
        \DateTimeImmutable $startTime,
        int $minutes
    ): \DateTimeImmutable {
        // 简化实现：实际需要考虑工作时间、节假日等
        return $startTime->modify("+{$minutes} minutes");
    }
}
```

### 6. SLA 监控任务

```php
<?php

declare(strict_types=1);

namespace app\process\task;

use app\service\sla\CheckSlaBreachService;
use Workerman\Timer;

/**
 * SLA 监控任务
 * SLA Monitor Task
 */
final class SlaMonitorTask
{
    public function __construct(
        private readonly CheckSlaBreachService $checkSlaBreachService
    ) {
    }

    public function onWorkerStart(): void
    {
        // 每分钟检查一次 SLA
        Timer::add(60, function () {
            $this->checkSlaBreaches();
        });
    }

    private function checkSlaBreaches(): void
    {
        try {
            // 检查响应时间违规
            $this->checkSlaBreachService->checkResponseTimeBreaches();

            // 检查解决时间违规
            $this->checkSlaBreachService->checkResolutionTimeBreaches();
        } catch (\Exception $e) {
            logger()->error('SLA monitor task failed', [
                'error' => $e->getMessage(),
            ]);
        }
    }
}
```

### 7. 工单控制器

```php
<?php

declare(strict_types=1);

namespace app\controller\api\v1;

use app\service\ticket\CreateTicketService;
use app\service\ticket\UpdateTicketService;
use app\service\ticket\CloseTicketService;
use support\Request;
use support\Response;

/**
 * 工单控制器
 * Ticket Controller
 */
final class TicketController
{
    public function __construct(
        private readonly CreateTicketService $createTicketService,
        private readonly UpdateTicketService $updateTicketService,
        private readonly CloseTicketService $closeTicketService
    ) {
    }

    public function create(Request $request): Response
    {
        $validated = $this->validate($request, [
            'subject' => 'required|string|max:200',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high,urgent',
            'category' => 'required|string',
        ]);

        $ticket = $this->createTicketService->handle(
            customerId: $request->user()->id,
            subject: $validated['subject'],
            description: $validated['description'],
            priority: $validated['priority'],
            category: $validated['category']
        );

        return json([
            'success' => true,
            'data' => [
                'ticket_id' => $ticket->id(),
                'ticket_number' => $ticket->ticketNumber()->toString(),
                'status' => $ticket->status()->value(),
            ],
        ]);
    }

    public function update(Request $request, int $id): Response
    {
        $validated = $this->validate($request, [
            'status' => 'sometimes|string',
            'priority' => 'sometimes|in:low,medium,high,urgent',
        ]);

        $ticket = $this->updateTicketService->handle($id, $validated);

        return json([
            'success' => true,
            'data' => [
                'ticket_id' => $ticket->id(),
                'status' => $ticket->status()->value(),
            ],
        ]);
    }

    public function close(Request $request, int $id): Response
    {
        $validated = $this->validate($request, [
            'resolution_note' => 'required|string',
            'satisfaction_rating' => 'sometimes|integer|min:1|max:5',
        ]);

        $this->closeTicketService->handle(
            $id,
            $validated['resolution_note'],
            $validated['satisfaction_rating'] ?? null
        );

        return json([
            'success' => true,
            'message' => 'Ticket closed successfully',
        ]);
    }
}
```

---

## 最佳实践

### 工单状态管理

1. **状态机**: 使用状态机模式管理工单状态流转
2. **状态验证**: 在状态变更前验证是否允许转换
3. **历史记录**: 记录所有状态变更历史
4. **事件驱动**: 状态变更触发领域事件

### SLA 管理

1. **工作时间计算**: 排除非工作时间和节假日
2. **实时监控**: 定时任务检查 SLA 违规
3. **预警机制**: SLA 即将违规时提前告警
4. **自动升级**: SLA 违规自动升级工单优先级

### 分配策略

1. **负载均衡**: 根据客服当前工作量分配
2. **技能匹配**: 根据工单分类匹配客服技能
3. **优先级**: 高优先级工单优先分配
4. **轮询机制**: 避免某些客服过载

### 通知机制

1. **多渠道**: 支持邮件、短信、站内信
2. **异步处理**: 使用队列异步发送通知
3. **模板管理**: 统一管理通知模板
4. **用户偏好**: 尊重用户通知偏好设置

---

## 相关文档

- [目录结构规范](../architecture/directory-structure.md)
- [依赖方向规则](../architecture/dependency-rules.md)
- [Pest 测试框架](../tools/pest.md)

---

**最后更新**: 2026-02-02
