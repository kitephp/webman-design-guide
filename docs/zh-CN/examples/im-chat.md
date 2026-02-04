---
title: "即时通讯系统"
description: "基于 Webman WebSocket 的实时聊天系统架构示例"
---

## 目录

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
│  │     ├─ ChatController.php           # 聊天 HTTP API
│  │     ├─ MessageController.php        # 消息管理
│  │     └─ ContactController.php        # 联系人管理
│  └─ websocket/
│     └─ ChatHandler.php                 # WebSocket 连接处理
│
├─ model/
│  └─ eloquent/
│     ├─ Message.php                     # 消息模型
│     ├─ Conversation.php                # 会话模型
│     ├─ Contact.php                     # 联系人模型
│     └─ MessageRead.php                 # 消息已读记录
│
├─ middleware/
│  ├─ auth/
│  │  ├─ JwtAuthMiddleware.php          # JWT 认证
│  │  └─ WebSocketAuthMiddleware.php    # WebSocket 认证
│  └─ rate_limit/
│     └─ MessageRateLimitMiddleware.php  # 消息限流
│
├─ process/
│  ├─ websocket/
│  │  └─ ChatServer.php                  # WebSocket 服务进程
│  ├─ task/
│  │  ├─ MessagePushTask.php            # 消息推送任务
│  │  └─ OfflineMessageTask.php         # 离线消息处理
│  └─ monitor/
│     └─ ConnectionMonitor.php           # 连接监控
│
├─ service/
│  ├─ chat/
│  │  ├─ SendMessageService.php         # 发送消息
│  │  ├─ CreateConversationService.php  # 创建会话
│  │  ├─ MarkMessageReadService.php     # 标记已读
│  │  └─ GetChatHistoryService.php      # 获取历史消息
│  ├─ connection/
│  │  ├─ HandleConnectionService.php    # 处理连接
│  │  ├─ BroadcastMessageService.php    # 广播消息
│  │  └─ ManagePresenceService.php      # 在线状态管理
│  └─ notification/
│     └─ PushOfflineMessageService.php   # 推送离线消息
│
├─ domain/
│  ├─ chat/
│  │  ├─ entity/
│  │  │  ├─ Message.php                 # 消息实体
│  │  │  ├─ Conversation.php            # 会话实体
│  │  │  └─ Participant.php             # 参与者实体
│  │  ├─ enum/                          # 枚举
│  │  │  ├─ MessageType.php             # 消息类型枚举 (text/image/file)
│  │  │  ├─ ConversationType.php        # 会话类型枚举 (private/group)
│  │  │  └─ MessageStatus.php           # 消息状态枚举
│  │  ├─ vo/                            # 值对象
│  │  │  └─ MessageContent.php          # 消息内容
│  │  ├─ event/
│  │  │  ├─ MessageSent.php             # 消息已发送
│  │  │  ├─ MessageReceived.php         # 消息已接收
│  │  │  ├─ MessageRead.php             # 消息已读
│  │  │  └─ UserOnlineStatusChanged.php # 用户在线状态变更
│  │  └─ rule/
│  │     ├─ MessageValidationRule.php   # 消息验证规则
│  │     └─ ConversationAccessRule.php  # 会话访问规则
│  │
│  └─ connection/
│     ├─ entity/
│     │  └─ Connection.php              # 连接实体
│     ├─ enum/                          # 枚举
│     │  └─ PresenceStatus.php          # 在线状态枚举
│     ├─ vo/                            # 值对象
│     │  ├─ ConnectionId.php            # 连接 ID
│     │  └─ DeviceInfo.php              # 设备信息
│     └─ event/
│        ├─ UserConnected.php           # 用户已连接
│        └─ UserDisconnected.php        # 用户已断开
│
├─ contract/
│  ├─ repository/
│  │  ├─ MessageRepositoryInterface.php
│  │  ├─ ConversationRepositoryInterface.php
│  │  └─ ConnectionRepositoryInterface.php
│  ├─ gateway/
│  │  ├─ PushNotificationGatewayInterface.php  # 推送通知
│  │  └─ FileStorageGatewayInterface.php       # 文件存储
│  └─ service/
│     └─ WebSocketServiceInterface.php
│
├─ infrastructure/
│  ├─ repository/
│  │  ├─ eloquent/
│  │  │  ├─ EloquentMessageRepository.php
│  │  │  └─ EloquentConversationRepository.php
│  │  └─ redis/
│  │     ├─ RedisConnectionRepository.php      # 连接信息存储
│  │     └─ RedisPresenceRepository.php        # 在线状态存储
│  │
│  ├─ gateway/
│  │  ├─ push/
│  │  │  ├─ FirebasePushGateway.php           # Firebase 推送
│  │  │  └─ ApnsPushGateway.php               # APNs 推送
│  │  └─ storage/
│  │     └─ S3FileStorageGateway.php          # S3 文件存储
│  │
│  └─ websocket/
│     ├─ WorkermanWebSocketAdapter.php        # Workerman 适配器
│     └─ ConnectionManager.php                # 连接管理器
│
└─ support/
   ├─ helper/
   │  └─ websocket_helper.php
   └─ exception/
      ├─ ConnectionException.php
      └─ MessageException.php
```

---

## 模块划分

### 核心模块

1. **聊天模块 (Chat)**
   - 发送/接收消息
   - 消息历史查询
   - 消息已读状态
   - 会话管理

2. **连接模块 (Connection)**
   - WebSocket 连接管理
   - 用户在线状态
   - 心跳检测
   - 断线重连

3. **通知模块 (Notification)**
   - 离线消息推送
   - 系统通知
   - 消息提醒

4. **文件模块 (File)**
   - 图片上传
   - 文件上传
   - 文件下载

---

## 目录职责

### `app/controller/websocket/`
**职责**: WebSocket 连接处理入口
- 处理 WebSocket 握手
- 路由消息到对应服务
- 管理连接生命周期

### `app/process/websocket/`
**职责**: WebSocket 服务进程
- 启动 WebSocket 服务器
- 监听端口
- 进程管理

### `app/service/chat/`
**职责**: 聊天业务编排
- 发送消息流程
- 创建会话流程
- 消息已读流程

### `app/service/connection/`
**职责**: 连接管理编排
- 连接建立/断开
- 消息广播
- 在线状态同步

### `app/domain/chat/`
**职责**: 聊天领域逻辑
- 消息实体和业务规则
- 会话实体和访问控制
- 消息类型和状态管理

### `app/domain/connection/`
**职责**: 连接领域逻辑
- 连接实体
- 在线状态管理
- 设备信息

### `app/infrastructure/repository/redis/`
**职责**: Redis 存储实现
- 连接信息存储 (临时数据)
- 在线状态存储 (快速查询)
- 会话缓存

### `app/infrastructure/websocket/`
**职责**: WebSocket 基础设施
- Workerman 适配器
- 连接管理器
- 消息序列化

---

## 关键代码示例

### 1. WebSocket 服务进程

```php
<?php

declare(strict_types=1);

namespace app\process\websocket;

use Workerman\Worker;
use Workerman\Connection\TcpConnection;

/**
 * WebSocket 服务进程
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
        // 解析消息
        $message = json_decode($data, true);

        // 路由到对应处理器
        $handler = container()->get(\app\controller\websocket\ChatHandler::class);
        $handler->handle($connection, $message);
    }

    public function onClose(TcpConnection $connection): void
    {
        echo "Connection closed: {$connection->id}\n";

        // 清理连接信息
        $handler = container()->get(\app\controller\websocket\ChatHandler::class);
        $handler->handleDisconnect($connection);
    }
}
```

### 2. WebSocket 连接处理器

```php
<?php

declare(strict_types=1);

namespace app\controller\websocket;

use app\service\connection\HandleConnectionService;
use app\service\chat\SendMessageService;
use Workerman\Connection\TcpConnection;

/**
 * WebSocket 连接处理器
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
            // 验证 token 并建立连接
            $userId = $this->handleConnectionService->authenticate($token);
            $this->handleConnectionService->register($connection->id, $userId);

            // 绑定用户 ID 到连接
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
            // 发送消息
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

### 3. 发送消息服务

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
 * 发送消息服务
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
            // 1. 获取或创建会话
            $conversation = $this->conversationRepository->findOrCreatePrivate(
                $senderId,
                $receiverId
            );

            // 2. 创建消息实体
            $message = Message::create(
                conversationId: $conversation->id(),
                senderId: $senderId,
                content: MessageContent::fromString($content),
                type: MessageType::from($type)
            );

            // 3. 验证消息
            $message->validate();

            // 4. 持久化
            $this->messageRepository->save($message);

            // 5. 实时推送给接收者
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

### 4. 消息实体

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
 * 消息实体
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
        // 验证消息内容
        if ($this->content->isEmpty()) {
            throw new InvalidMessageException('Message content cannot be empty');
        }

        // 验证消息长度
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

### 5. 连接管理服务

```php
<?php

declare(strict_types=1);

namespace app\service\connection;

use app\contract\repository\ConnectionRepositoryInterface;
use app\domain\connection\entity\Connection;
use app\domain\connection\vo\ConnectionId;
use app\domain\connection\enum\PresenceStatus;

/**
 * 连接管理服务
 */
final class HandleConnectionService
{
    public function __construct(
        private readonly ConnectionRepositoryInterface $connectionRepository
    ) {
    }

    public function authenticate(string $token): int
    {
        // 验证 JWT token
        $payload = $this->verifyJwtToken($token);

        return $payload['user_id'];
    }

    public function register(string $connectionId, int $userId): void
    {
        // 创建连接实体
        $connection = Connection::create(
            connectionId: ConnectionId::fromString($connectionId),
            userId: $userId,
            status: PresenceStatus::Online
        );

        // 存储到 Redis
        $this->connectionRepository->save($connection);

        // 广播用户上线状态
        $this->broadcastPresenceChange($userId, 'online');
    }

    public function unregister(string $connectionId): void
    {
        // 获取连接信息
        $connection = $this->connectionRepository->findByConnectionId(
            ConnectionId::fromString($connectionId)
        );

        if ($connection === null) {
            return;
        }

        // 删除连接
        $this->connectionRepository->delete($connection);

        // 检查用户是否还有其他连接
        $hasOtherConnections = $this->connectionRepository->hasActiveConnections(
            $connection->userId()
        );

        if (!$hasOtherConnections) {
            // 广播用户离线状态
            $this->broadcastPresenceChange($connection->userId(), 'offline');
        }
    }

    private function verifyJwtToken(string $token): array
    {
        // JWT 验证逻辑
        // 返回 payload
        return [];
    }

    private function broadcastPresenceChange(int $userId, string $status): void
    {
        // 广播在线状态变更
    }
}
```

### 6. 广播消息服务

```php
<?php

declare(strict_types=1);

namespace app\service\connection;

use app\contract\repository\ConnectionRepositoryInterface;
use app\infrastructure\websocket\ConnectionManager;

/**
 * 广播消息服务
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
        // 获取用户的所有连接
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
        // 获取会话的所有参与者
        $participantIds = $this->getConversationParticipants($conversationId);

        foreach ($participantIds as $userId) {
            $this->sendToUser($userId, $data);
        }
    }

    public function broadcast(array $data): void
    {
        // 广播给所有在线用户
        $this->connectionManager->broadcast(json_encode($data));
    }

    private function getConversationParticipants(int $conversationId): array
    {
        // 获取会话参与者 ID 列表
        return [];
    }
}
```

### 7. Redis 连接仓储

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
 * Redis 连接仓储
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

        // 添加到用户连接集合
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

        // 从用户连接集合中移除
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

## 最佳实践

### WebSocket 连接管理

1. **认证机制**: 使用 JWT token 进行 WebSocket 认证
2. **心跳检测**: 定期发送 ping/pong 保持连接活跃
3. **断线重连**: 客户端实现指数退避重连策略
4. **连接池**: 使用 Redis 管理连接信息，支持水平扩展

### 消息可靠性

1. **消息确认**: 实现消息送达确认机制
2. **离线消息**: 用户离线时存储消息，上线后推送
3. **消息去重**: 使用消息 ID 防止重复消息
4. **消息顺序**: 使用时间戳保证消息顺序

### 性能优化

1. **Redis 缓存**: 连接信息、在线状态存储在 Redis
2. **消息队列**: 使用队列处理离线消息推送
3. **数据库优化**: 消息表按会话 ID 分区
4. **连接限制**: 限制单用户最大连接数

---

## 相关文档

- [目录结构规范](/zh-CN/architecture/directory-structure)
- [依赖方向规则](/zh-CN/architecture/dependency-rules)
- [Pest 测试框架](/zh-CN/tools/pest)
