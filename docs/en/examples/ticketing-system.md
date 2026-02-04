---
title: "Ticketing/Customer Service System"
description: "Ticketing management and customer service system architecture example based on Webman"
---

## Table of Contents

- [Complete Directory Tree](#complete-directory-tree)
- [Module Division](#module-division)
- [Directory Responsibilities](#directory-responsibilities)
- [Key Code Examples](#key-code-examples)

---

## Complete Directory Tree

```
app/
├─ controller/
│  ├─ api/
│  │  └─ v1/
│  │     ├─ TicketController.php          # Ticket management
│  │     ├─ CommentController.php         # Comment management
│  │     ├─ AssignmentController.php      # Ticket assignment
│  │     └─ SlaController.php             # SLA management
│  └─ admin/
│     └─ TicketManagementController.php   # Admin management
│
├─ model/
│  └─ eloquent/
│     ├─ Ticket.php                       # Ticket model
│     ├─ Comment.php                      # Comment model
│     ├─ Assignment.php                   # Assignment record
│     ├─ SlaPolicy.php                    # SLA policy
│     └─ TicketHistory.php                # Ticket history
│
├─ middleware/
│  ├─ auth/
│  │  ├─ AgentAuthMiddleware.php         # Agent authentication
│  │  └─ CustomerAuthMiddleware.php      # Customer authentication
│  └─ permission/
│     └─ TicketAccessMiddleware.php       # Ticket access permission
│
├─ process/
│  ├─ task/
│  │  ├─ SlaMonitorTask.php              # SLA monitoring task
│  │  ├─ AutoAssignTask.php              # Auto assignment task
│  │  └─ EscalationTask.php              # Escalation task
│  └─ queue/
│     └─ NotificationQueue.php            # Notification queue
│
├─ service/
│  ├─ ticket/
│  │  ├─ CreateTicketService.php         # Create ticket
│  │  ├─ UpdateTicketService.php         # Update ticket
│  │  ├─ CloseTicketService.php          # Close ticket
│  │  ├─ AssignTicketService.php         # Assign ticket
│  │  └─ EscalateTicketService.php       # Escalate ticket
│  ├─ comment/
│  │  ├─ AddCommentService.php           # Add comment
│  │  └─ AddInternalNoteService.php      # Add internal note
│  ├─ sla/
│  │  ├─ CalculateSlaService.php         # Calculate SLA
│  │  └─ CheckSlaBreachService.php       # Check SLA breach
│  └─ assignment/
│     ├─ AutoAssignService.php            # Auto assignment
│     └─ LoadBalanceService.php           # Load balancing
│
├─ domain/
│  ├─ ticket/
│  │  ├─ entity/
│  │  │  ├─ Ticket.php                   # Ticket entity
│  │  │  ├─ Comment.php                  # Comment entity
│  │  │  └─ Assignment.php               # Assignment entity
│  │  ├─ enum/                           # Enums
│  │  │  ├─ TicketStatus.php            # Ticket status
│  │  │  ├─ Priority.php                # Priority
│  │  │  └─ Category.php                # Category
│  │  ├─ vo/                             # Value Objects
│  │  │  └─ TicketNumber.php            # Ticket number
│  │  ├─ event/
│  │  │  ├─ TicketCreated.php           # Ticket created
│  │  │  ├─ TicketAssigned.php          # Ticket assigned
│  │  │  ├─ TicketStatusChanged.php     # Status changed
│  │  │  └─ TicketEscalated.php         # Ticket escalated
│  │  └─ rule/
│  │     ├─ AssignmentRule.php          # Assignment rules
│  │     └─ EscalationRule.php          # Escalation rules
│  │
│  └─ sla/
│     ├─ entity/
│     │  ├─ SlaPolicy.php               # SLA policy entity
│     │  └─ SlaTarget.php               # SLA target
│     ├─ enum/                           # Enums
│     │  └─ SlaStatus.php               # SLA status
│     ├─ vo/                             # Value Objects
│     │  ├─ ResponseTime.php            # Response time
│     │  └─ ResolutionTime.php          # Resolution time
│     └─ rule/
│        └─ SlaCalculationRule.php      # SLA calculation rules
│
├─ contract/
│  ├─ repository/
│  │  ├─ TicketRepositoryInterface.php
│  │  ├─ CommentRepositoryInterface.php
│  │  ├─ AssignmentRepositoryInterface.php
│  │  └─ SlaRepositoryInterface.php
│  ├─ gateway/
│  │  ├─ EmailGatewayInterface.php      # Email gateway
│  │  └─ SmsGatewayInterface.php        # SMS gateway
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
│  │  │  └─ SendgridEmailGateway.php    # Sendgrid email
│  │  └─ sms/
│  │     └─ TwilioSmsGateway.php        # Twilio SMS
│  │
│  └─ notification/
│     ├─ EmailNotificationChannel.php    # Email notification channel
│     └─ SmsNotificationChannel.php      # SMS notification channel
│
└─ support/
   ├─ helper/
   │  └─ ticket_helper.php
   └─ exception/
      ├─ TicketException.php
      └─ SlaException.php
```

---

## Module Division

### Core Modules

1. **Ticket Module**
   - Create/update/close tickets
   - Ticket status transitions
   - Ticket history records
   - Ticket search and filtering

2. **Assignment Module**
   - Manual assignment
   - Auto assignment (load balancing)
   - Ticket transfer
   - Agent workload statistics

3. **SLA Module (Service Level Agreement)**
   - SLA policy management
   - Response time monitoring
   - Resolution time monitoring
   - SLA breach alerts

4. **Comment Module**
   - Customer comments
   - Agent replies
   - Internal notes
   - Attachment management

5. **Escalation Module**
   - Auto escalation rules
   - Manual escalation
   - Escalation notifications

---

## Directory Responsibilities

### `app/service/ticket/`
**Responsibility**: Ticket business orchestration
- Create ticket flow (validation, assignment, notification)
- Update ticket flow (status change, history recording)
- Close ticket flow (satisfaction survey)

### `app/service/sla/`
**Responsibility**: SLA management orchestration
- Calculate SLA time
- Check SLA breaches
- Trigger alerts

### `app/domain/ticket/`
**Responsibility**: Ticket domain logic
- Ticket state machine
- Priority rules
- Assignment rules
- Escalation rules

### `app/domain/sla/`
**Responsibility**: SLA domain logic
- SLA policy definition
- Response time calculation
- Resolution time calculation
- Business hours calculation (excluding non-working hours)

### `app/process/task/`
**Responsibility**: Background tasks
- SLA monitoring (check every minute)
- Auto assignment (queue processing)
- Auto escalation (scheduled check)

---

## Key Code Examples

### 1. Create Ticket Service

```php
<?php

declare(strict_types=1);

namespace app\service\ticket;

use app\contract\repository\TicketRepositoryInterface;
use app\domain\ticket\entity\Ticket;
use app\domain\ticket\enum\Priority;
use app\domain\ticket\enum\Category;
use app\service\assignment\AutoAssignService;
use app\service\sla\CalculateSlaService;
use support\Db;

/**
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
            // 1. Create ticket entity
            $ticket = Ticket::create(
                customerId: $customerId,
                subject: $subject,
                description: $description,
                priority: Priority::from($priority),
                category: Category::from($category)
            );

            // 2. Generate ticket number
            $ticket->generateTicketNumber();

            // 3. Persist
            $this->ticketRepository->save($ticket);

            // 4. Auto assign to agent
            $this->autoAssignService->assign($ticket);

            // 5. Calculate SLA target time
            $this->calculateSlaService->calculate($ticket);

            // 6. Send notifications (via events)
            foreach ($ticket->releaseEvents() as $event) {
                event($event);
            }

            return $ticket;
        });
    }
}
```

### 2. Ticket Status Value Object

```php
<?php

declare(strict_types=1);

namespace app\domain\ticket\values;

/**
 * Ticket Status Enum
 */
enum TicketStatus: string
{
    case New = 'new';
    case Assigned = 'assigned';
    case InProgress = 'in_progress';
    case WaitingCustomer = 'waiting_customer';
    case Resolved = 'resolved';
    case Closed = 'closed';

    /**
     * Get allowed status transitions
     */
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::New => [self::Assigned, self::Closed],
            self::Assigned => [self::InProgress, self::Closed],
            self::InProgress => [self::WaitingCustomer, self::Resolved, self::Closed],
            self::WaitingCustomer => [self::InProgress, self::Closed],
            self::Resolved => [self::Closed, self::InProgress],
            self::Closed => [],
        };
    }

    public function canTransitionTo(self $newStatus): bool
    {
        return in_array($newStatus, $this->allowedTransitions(), true);
    }

    public function isClosed(): bool
    {
        return $this === self::Closed;
    }
}
```

### 3. Auto Assignment Service

```php
<?php

declare(strict_types=1);

namespace app\service\assignment;

use app\contract\repository\TicketRepositoryInterface;
use app\contract\repository\AssignmentRepositoryInterface;
use app\domain\ticket\entity\Ticket;
use app\service\assignment\LoadBalanceService;

/**
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
        // 1. Select agent based on assignment rules
        $agentId = $this->selectAgent($ticket);

        if ($agentId === null) {
            // No available agent, put in pending queue
            return;
        }

        // 2. Assign ticket
        $ticket->assign($agentId);
        $this->ticketRepository->save($ticket);

        // 3. Record assignment history
        $this->assignmentRepository->recordAssignment(
            $ticket->id(),
            $agentId,
            'auto'
        );
    }

    private function selectAgent(Ticket $ticket): ?int
    {
        // 1. Get available agents for this category
        $availableAgents = $this->getAvailableAgents($ticket->category());

        if (empty($availableAgents)) {
            return null;
        }

        // 2. Use load balancing algorithm to select agent
        return $this->loadBalanceService->selectAgent(
            $availableAgents,
            $ticket->priority()
        );
    }
}
```

### 4. SLA Monitor Task

```php
<?php

declare(strict_types=1);

namespace app\process\task;

use app\service\sla\CheckSlaBreachService;
use Workerman\Timer;

/**
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
        // Check SLA every minute
        Timer::add(60, function () {
            $this->checkSlaBreaches();
        });
    }

    private function checkSlaBreaches(): void
    {
        try {
            // Check response time breaches
            $this->checkSlaBreachService->checkResponseTimeBreaches();

            // Check resolution time breaches
            $this->checkSlaBreachService->checkResolutionTimeBreaches();
        } catch (\Exception $e) {
            logger()->error('SLA monitor task failed', [
                'error' => $e->getMessage(),
            ]);
        }
    }
}
```

---

## Best Practices

### Ticket Status Management

1. **State Machine**: Use state machine pattern to manage ticket status transitions
2. **Status Validation**: Validate if transition is allowed before status change
3. **History Recording**: Record all status change history
4. **Event Driven**: Status changes trigger domain events

### SLA Management

1. **Business Hours Calculation**: Exclude non-working hours and holidays
2. **Real-time Monitoring**: Scheduled tasks check SLA breaches
3. **Early Warning**: Alert before SLA is about to breach
4. **Auto Escalation**: Auto escalate ticket priority on SLA breach

### Assignment Strategy

1. **Load Balancing**: Assign based on agent's current workload
2. **Skill Matching**: Match agent skills with ticket category
3. **Priority**: High priority tickets assigned first
4. **Round Robin**: Avoid overloading certain agents

---

## Related Documentation

- [Directory Structure Standards](/en/architecture/directory-structure)
- [Dependency Direction Rules](/en/architecture/dependency-rules)
- [Pest Testing Framework](/en/tools/pest)
