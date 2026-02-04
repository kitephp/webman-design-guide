---
title: "IM/Chat System"
description: "Real-time chat system architecture example based on Webman WebSocket"
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
│  │     ├─ ChatController.php           # Chat HTTP API
│  │     ├─ MessageController.php        # Message management
│  │     └─ ContactController.php        # Contact management
│  └─ websocket/
│     └─ ChatHandler.php                 # WebSocket connection handler
│
├─ model/
│  └─ eloquent/
│     ├─ Message.php                     # Message model
│     ├─ Conversation.php                # Conversation model
│     ├─ Contact.php                     # Contact model
│     └─ MessageRead.php                 # Message read records
│
├─ middleware/
│  ├─ auth/
│  │  ├─ JwtAuthMiddleware.php          # JWT authentication
│  │  └─ WebSocketAuthMiddleware.php    # WebSocket authentication
│  └─ rate_limit/
│     └─ MessageRateLimitMiddleware.php  # Message rate limiting
│
├─ process/
│  ├─ websocket/
│  │  └─ ChatServer.php                  # WebSocket server process
│  ├─ task/
│  │  ├─ MessagePushTask.php            # Message push task
│  │  └─ OfflineMessageTask.php         # Offline message processing
│  └─ monitor/
│     └─ ConnectionMonitor.php           # Connection monitoring
│
├─ service/
│  ├─ chat/
│  │  ├─ SendMessageService.php         # Send message
│  │  ├─ CreateConversationService.php  # Create conversation
│  │  ├─ MarkMessageReadService.php     # Mark as read
│  │  └─ GetChatHistoryService.php      # Get chat history
│  ├─ connection/
│  │  ├─ HandleConnectionService.php    # Handle connection
│  │  ├─ BroadcastMessageService.php    # Broadcast message
│  │  └─ ManagePresenceService.php      # Online status management
│  └─ notification/
│     └─ PushOfflineMessageService.php   # Push offline messages
│
├─ domain/
│  ├─ chat/
│  │  ├─ entity/
│  │  │  ├─ Message.php                 # Message entity
│  │  │  ├─ Conversation.php            # Conversation entity
│  │  │  └─ Participant.php             # Participant entity
│  │  ├─ enum/                          # Enums
│  │  │  ├─ MessageType.php             # Message type enum (text/image/file)
│  │  │  ├─ ConversationType.php        # Conversation type enum (private/group)
│  │  │  └─ MessageStatus.php           # Message status enum
│  │  ├─ vo/                            # Value Objects
│  │  │  └─ MessageContent.php          # Message content
│  │  ├─ event/
│  │  │  ├─ MessageSent.php             # Message sent
│  │  │  ├─ MessageReceived.php         # Message received
│  │  │  ├─ MessageRead.php             # Message read
│  │  │  └─ UserOnlineStatusChanged.php # User online status changed
│  │  └─ rule/
│  │     ├─ MessageValidationRule.php   # Message validation rules
│  │     └─ ConversationAccessRule.php  # Conversation access rules
│  │
│  └─ connection/
│     ├─ entity/
│     │  └─ Connection.php              # Connection entity
│     ├─ enum/                          # Enums
│     │  └─ PresenceStatus.php          # Online status enum
│     ├─ vo/                            # Value Objects
│     │  ├─ ConnectionId.php            # Connection ID
│     │  └─ DeviceInfo.php              # Device information
│     └─ event/
│        ├─ UserConnected.php           # User connected
│        └─ UserDisconnected.php        # User disconnected
│
├─ contract/
│  ├─ repository/
│  │  ├─ MessageRepositoryInterface.php
│  │  ├─ ConversationRepositoryInterface.php
│  │  └─ ConnectionRepositoryInterface.php
│  ├─ gateway/
│  │  ├─ PushNotificationGatewayInterface.php  # Push notification
│  │  └─ FileStorageGatewayInterface.php       # File storage
│  └─ service/
│     └─ WebSocketServiceInterface.php
│
├─ infrastructure/
│  ├─ repository/
│  │  ├─ eloquent/
│  │  │  ├─ EloquentMessageRepository.php
│  │  │  └─ EloquentConversationRepository.php
│  │  └─ redis/
│  │     ├─ RedisConnectionRepository.php      # Connection info storage
│  │     └─ RedisPresenceRepository.php        # Online status storage
│  │
│  ├─ gateway/
│  │  ├─ push/
│  │  │  ├─ FirebasePushGateway.php           # Firebase push
│  │  │  └─ ApnsPushGateway.php               # APNs push
│  │  └─ storage/
│  │     └─ S3FileStorageGateway.php          # S3 file storage
│  │
│  └─ websocket/
│     ├─ WorkermanWebSocketAdapter.php        # Workerman adapter
│     └─ ConnectionManager.php                # Connection manager
│
└─ support/
   ├─ helper/
   │  └─ websocket_helper.php
   └─ exception/
      ├─ ConnectionException.php
      └─ MessageException.php
```

---

## Module Division

### Core Modules

1. **Chat Module**
   - Send/receive messages
   - Message history query
   - Message read status
   - Conversation management

2. **Connection Module**
   - WebSocket connection management
   - User online status
   - Heartbeat detection
   - Reconnection handling

3. **Notification Module**
   - Offline message push
   - System notifications
   - Message reminders

4. **File Module**
   - Image upload
   - File upload
   - File download

---

## Directory Responsibilities

### `app/controller/websocket/`
**Responsibility**: WebSocket connection handling entry point
- Handle WebSocket handshake
- Route messages to corresponding services
- Manage connection lifecycle

### `app/process/websocket/`
**Responsibility**: WebSocket server process
- Start WebSocket server
- Listen on port
- Process management

### `app/service/chat/`
**Responsibility**: Chat business orchestration
- Send message flow
- Create conversation flow
- Mark message as read flow

### `app/service/connection/`
**Responsibility**: Connection management orchestration
- Connection establishment/disconnection
- Message broadcasting
- Online status synchronization

### `app/domain/chat/`
**Responsibility**: Chat domain logic
- Message entity and business rules
- Conversation entity and access control
- Message type and status management

### `app/domain/connection/`
**Responsibility**: Connection domain logic
- Connection entity
- Online status management
- Device information

### `app/infrastructure/repository/redis/`
**Responsibility**: Redis storage implementation
- Connection info storage (temporary data)
- Online status storage (fast query)
- Conversation cache

### `app/infrastructure/websocket/`
**Responsibility**: WebSocket infrastructure
- Workerman adapter
- Connection manager
- Message serialization

---

## Key Code Examples

### 1. WebSocket Server Process

```php
<?php

declare(strict_types=1);

namespace app\process\websocket;

use Workerman\Worker;
use Workerman\Connection\TcpConnection;

/**
 * WebSocket Server Process
 */
final class ChatServer
{
    public function onWorkerStart(Worker $worker): void
    {
        echo "WebSocket server started on {$worker->name}\n";
    }

    public function onConnect(TcpConnection $connection): void
    {
        echo "New connection: {$connection->id}\n";
    }

    public function onMessage(TcpConnection $connection, string $data): void
    {
        // Parse message
        $message = json_decode($data, true);

        // Route to corresponding handler
        $handler = container()->get(\app\controller\websocket\ChatHandler::class);
        $handler->handle($connection, $message);
    }

    public function onClose(TcpConnection $connection): void
    {
        echo "Connection closed: {$connection->id}\n";

        // Clean up connection info
        $handler = container()->get(\app\controller\websocket\ChatHandler::class);
        $handler->handleDisconnect($connection);
    }
}
```

### 2. WebSocket Connection Handler

```php
<?php

declare(strict_types=1);

namespace app\controller\websocket;

use app\service\connection\HandleConnectionService;
use app\service\chat\SendMessageService;
use Workerman\Connection\TcpConnection;

/**
 * WebSocket Connection Handler
 */
final class ChatHandler
{
    public function __construct(
        private readonly HandleConnectionService $handleConnectionService,
        private readonly SendMessageService $sendMessageService
    ) {
    }

    public function handle(TcpConnection $connection, array $message): void
    {
        $type = $message['type'] ?? '';

        match ($type) {
            'auth' => $this->handleAuth($connection, $message),
            'message' => $this->handleMessage($connection, $message),
            'ping' => $this->handlePing($connection),
            'read' => $this->handleRead($connection, $message),
            default => $this->sendError($connection, 'Unknown message type'),
        };
    }

    private function handleAuth(TcpConnection $connection, array $message): void
    {
        $token = $message['token'] ?? '';

        try {
            // Verify token and establish connection
            $userId = $this->handleConnectionService->authenticate($token);
            $this->handleConnectionService->register($connection->id, $userId);

            // Bind user ID to connection
            $connection->userId = $userId;

            $this->sendSuccess($connection, [
                'type' => 'auth',
                'message' => 'Authentication successful',
            ]);
        } catch (\Exception $e) {
            $this->sendError($connection, $e->getMessage());
            $connection->close();
        }
    }

    private function handleMessage(TcpConnection $connection, array $message): void
    {
        if (!isset($connection->userId)) {
            $this->sendError($connection, 'Not authenticated');
            return;
        }

        try {
            // Send message
            $result = $this->sendMessageService->handle(
                senderId: $connection->userId,
                receiverId: $message['to'],
                content: $message['content'],
                type: $message['message_type'] ?? 'text'
            );

            $this->sendSuccess($connection, [
                'type' => 'message',
                'message_id' => $result->id(),
                'timestamp' => $result->createdAt()->getTimestamp(),
            ]);
        } catch (\Exception $e) {
            $this->sendError($connection, $e->getMessage());
        }
    }

    private function handlePing(TcpConnection $connection): void
    {
        $connection->send(json_encode([
            'type' => 'pong',
            'timestamp' => time(),
        ]));
    }

    public function handleDisconnect(TcpConnection $connection): void
    {
        if (isset($connection->userId)) {
            $this->handleConnectionService->unregister($connection->id);
        }
    }

    private function sendSuccess(TcpConnection $connection, array $data): void
    {
        $connection->send(json_encode([
            'success' => true,
            'data' => $data,
        ]));
    }

    private function sendError(TcpConnection $connection, string $error): void
    {
        $connection->send(json_encode([
            'success' => false,
            'error' => $error,
        ]));
    }
}
```

### 3. Send Message Service

```php
<?php

declare(strict_types=1);

namespace app\service\chat;

use app\contract\repository\MessageRepositoryInterface;
use app\contract\repository\ConversationRepositoryInterface;
use app\domain\chat\entity\Message;
use app\domain\chat\vo\MessageContent;
use app\domain\chat\enum\MessageType;
use app\service\connection\BroadcastMessageService;
use support\Db;

/**
 * Send Message Service
 */
final class SendMessageService
{
    public function __construct(
        private readonly MessageRepositoryInterface $messageRepository,
        private readonly ConversationRepositoryInterface $conversationRepository,
        private readonly BroadcastMessageService $broadcastMessageService
    ) {
    }

    public function handle(
        int $senderId,
        int $receiverId,
        string $content,
        string $type = 'text'
    ): Message {
        return Db::transaction(function () use ($senderId, $receiverId, $content, $type) {
            // 1. Get or create conversation
            $conversation = $this->conversationRepository->findOrCreatePrivate(
                $senderId,
                $receiverId
            );

            // 2. Create message entity
            $message = Message::create(
                conversationId: $conversation->id(),
                senderId: $senderId,
                content: MessageContent::fromString($content),
                type: MessageType::from($type)
            );

            // 3. Validate message
            $message->validate();

            // 4. Persist
            $this->messageRepository->save($message);

            // 5. Push to receiver in real-time
            $this->broadcastMessageService->sendToUser($receiverId, [
                'type' => 'new_message',
                'message' => [
                    'id' => $message->id(),
                    'conversation_id' => $conversation->id(),
                    'sender_id' => $senderId,
                    'content' => $content,
                    'type' => $type,
                    'created_at' => $message->createdAt()->format('Y-m-d H:i:s'),
                ],
            ]);

            return $message;
        });
    }
}
```

### 4. Message Entity

```php
<?php

declare(strict_types=1);

namespace app\domain\chat\entity;

use app\domain\chat\vo\MessageContent;
use app\domain\chat\enum\MessageType;
use app\domain\chat\enum\MessageStatus;
use app\domain\chat\event\MessageSent;
use app\domain\chat\exception\InvalidMessageException;

/**
 * Message Entity
 */
final class Message
{
    private array $domainEvents = [];

    private function __construct(
        private readonly int $id,
        private readonly int $conversationId,
        private readonly int $senderId,
        private readonly MessageContent $content,
        private readonly MessageType $type,
        private MessageStatus $status,
        private readonly \DateTimeImmutable $createdAt
    ) {
    }

    public static function create(
        int $conversationId,
        int $senderId,
        MessageContent $content,
        MessageType $type
    ): self {
        $message = new self(
            id: 0,
            conversationId: $conversationId,
            senderId: $senderId,
            content: $content,
            type: $type,
            status: MessageStatus::Sent,
            createdAt: new \DateTimeImmutable()
        );

        $message->recordEvent(new MessageSent($message));

        return $message;
    }

    public function validate(): void
    {
        // Validate message content
        if ($this->content->isEmpty()) {
            throw new InvalidMessageException('Message content cannot be empty');
        }

        // Validate message length
        if ($this->type->isText() && $this->content->length() > 5000) {
            throw new InvalidMessageException('Text message too long');
        }
    }

    public function markAsDelivered(): void
    {
        $this->status = MessageStatus::Delivered;
    }

    public function markAsRead(): void
    {
        $this->status = MessageStatus::Read;
    }

    // Getters
    public function id(): int
    {
        return $this->id;
    }

    public function conversationId(): int
    {
        return $this->conversationId;
    }

    public function senderId(): int
    {
        return $this->senderId;
    }

    public function content(): MessageContent
    {
        return $this->content;
    }

    public function type(): MessageType
    {
        return $this->type;
    }

    public function status(): MessageStatus
    {
        return $this->status;
    }

    public function createdAt(): \DateTimeImmutable
    {
        return $this->createdAt;
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

### 5. Connection Management Service

```php
<?php

declare(strict_types=1);

namespace app\service\connection;

use app\contract\repository\ConnectionRepositoryInterface;
use app\domain\connection\entity\Connection;
use app\domain\connection\vo\ConnectionId;
use app\domain\connection\enum\PresenceStatus;

/**
 * Connection Management Service
 */
final class HandleConnectionService
{
    public function __construct(
        private readonly ConnectionRepositoryInterface $connectionRepository
    ) {
    }

    public function authenticate(string $token): int
    {
        // Verify JWT token
        $payload = $this->verifyJwtToken($token);

        return $payload['user_id'];
    }

    public function register(string $connectionId, int $userId): void
    {
        // Create connection entity
        $connection = Connection::create(
            connectionId: ConnectionId::fromString($connectionId),
            userId: $userId,
            status: PresenceStatus::Online
        );

        // Store in Redis
        $this->connectionRepository->save($connection);

        // Broadcast user online status
        $this->broadcastPresenceChange($userId, 'online');
    }

    public function unregister(string $connectionId): void
    {
        // Get connection info
        $connection = $this->connectionRepository->findByConnectionId(
            ConnectionId::fromString($connectionId)
        );

        if ($connection === null) {
            return;
        }

        // Delete connection
        $this->connectionRepository->delete($connection);

        // Check if user has other connections
        $hasOtherConnections = $this->connectionRepository->hasActiveConnections(
            $connection->userId()
        );

        if (!$hasOtherConnections) {
            // Broadcast user offline status
            $this->broadcastPresenceChange($connection->userId(), 'offline');
        }
    }

    private function verifyJwtToken(string $token): array
    {
        // JWT verification logic
        // Return payload
        return [];
    }

    private function broadcastPresenceChange(int $userId, string $status): void
    {
        // Broadcast online status change
    }
}
```

### 6. Broadcast Message Service

```php
<?php

declare(strict_types=1);

namespace app\service\connection;

use app\contract\repository\ConnectionRepositoryInterface;
use app\infrastructure\websocket\ConnectionManager;

/**
 * Broadcast Message Service
 */
final class BroadcastMessageService
{
    public function __construct(
        private readonly ConnectionRepositoryInterface $connectionRepository,
        private readonly ConnectionManager $connectionManager
    ) {
    }

    public function sendToUser(int $userId, array $data): void
    {
        // Get all connections for the user
        $connections = $this->connectionRepository->findByUserId($userId);

        foreach ($connections as $connection) {
            $this->connectionManager->send(
                $connection->connectionId()->toString(),
                json_encode($data)
            );
        }
    }

    public function sendToConversation(int $conversationId, array $data): void
    {
        // Get all participants in the conversation
        $participantIds = $this->getConversationParticipants($conversationId);

        foreach ($participantIds as $userId) {
            $this->sendToUser($userId, $data);
        }
    }

    public function broadcast(array $data): void
    {
        // Broadcast to all online users
        $this->connectionManager->broadcast(json_encode($data));
    }

    private function getConversationParticipants(int $conversationId): array
    {
        // Get conversation participant ID list
        return [];
    }
}
```

### 7. Redis Connection Repository

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\repository\redis;

use app\contract\repository\ConnectionRepositoryInterface;
use app\domain\connection\entity\Connection;
use app\domain\connection\vo\ConnectionId;
use app\domain\connection\enum\PresenceStatus;
use support\Redis;

/**
 * Redis Connection Repository
 */
final class RedisConnectionRepository implements ConnectionRepositoryInterface
{
    private const PREFIX = 'chat:connection:';
    private const USER_PREFIX = 'chat:user:connections:';
    private const TTL = 3600; // 1 hour

    public function save(Connection $connection): void
    {
        $key = self::PREFIX . $connection->connectionId()->toString();

        Redis::setex($key, self::TTL, json_encode([
            'connection_id' => $connection->connectionId()->toString(),
            'user_id' => $connection->userId(),
            'status' => $connection->status()->value(),
            'connected_at' => $connection->connectedAt()->format('Y-m-d H:i:s'),
        ]));

        // Add to user connection set
        $userKey = self::USER_PREFIX . $connection->userId();
        Redis::sadd($userKey, $connection->connectionId()->toString());
        Redis::expire($userKey, self::TTL);
    }

    public function findByConnectionId(ConnectionId $connectionId): ?Connection
    {
        $key = self::PREFIX . $connectionId->toString();
        $data = Redis::get($key);

        if ($data === null) {
            return null;
        }

        $data = json_decode($data, true);

        return Connection::reconstitute(
            connectionId: ConnectionId::fromString($data['connection_id']),
            userId: $data['user_id'],
            status: PresenceStatus::from($data['status']),
            connectedAt: new \DateTimeImmutable($data['connected_at'])
        );
    }

    public function findByUserId(int $userId): array
    {
        $userKey = self::USER_PREFIX . $userId;
        $connectionIds = Redis::smembers($userKey);

        $connections = [];
        foreach ($connectionIds as $connectionId) {
            $connection = $this->findByConnectionId(
                ConnectionId::fromString($connectionId)
            );
            if ($connection !== null) {
                $connections[] = $connection;
            }
        }

        return $connections;
    }

    public function delete(Connection $connection): void
    {
        $key = self::PREFIX . $connection->connectionId()->toString();
        Redis::del($key);

        // Remove from user connection set
        $userKey = self::USER_PREFIX . $connection->userId();
        Redis::srem($userKey, $connection->connectionId()->toString());
    }

    public function hasActiveConnections(int $userId): bool
    {
        $userKey = self::USER_PREFIX . $userId;
        return Redis::scard($userKey) > 0;
    }
}
```

---

## Best Practices

### WebSocket Connection Management

1. **Authentication**: Use JWT token for WebSocket authentication
2. **Heartbeat Detection**: Periodically send ping/pong to keep connection alive
3. **Reconnection**: Client implements exponential backoff reconnection strategy
4. **Connection Pool**: Use Redis to manage connection info, supporting horizontal scaling

### Message Reliability

1. **Message Acknowledgment**: Implement message delivery confirmation mechanism
2. **Offline Messages**: Store messages when user is offline, push when online
3. **Message Deduplication**: Use message ID to prevent duplicate messages
4. **Message Ordering**: Use timestamps to ensure message order

### Performance Optimization

1. **Redis Cache**: Store connection info and online status in Redis
2. **Message Queue**: Use queue to process offline message push
3. **Database Optimization**: Partition message table by conversation ID
4. **Connection Limits**: Limit maximum connections per user

---

## Related Documentation

- [Directory Structure Standards](/en/architecture/directory-structure)
- [Dependency Direction Rules](/en/architecture/dependency-rules)
- [Pest Testing Framework](/en/tools/pest)
