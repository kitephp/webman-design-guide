# 内容管理系统示例 | CMS Example

> 完整的 CMS 系统架构示例，展示文章、分类、标签、媒体管理
> Complete CMS system architecture example with article, category, tag, and media management

---

## 📋 目录 | Table of Contents

- [系统概述](#系统概述)
- [完整目录树](#完整目录树)
- [模块划分](#模块划分)
- [关键代码示例](#关键代码示例)

---

## 系统概述 | System Overview

### 核心功能 | Core Features

- 文章管理 (Article Management) - 创建、编辑、发布、草稿
- 分类管理 (Category Management) - 层级分类
- 标签系统 (Tag System) - 多标签支持
- 媒体库 (Media Library) - 图片、视频上传管理
- 评论系统 (Comment System) - 审核、回复
- SEO 优化 (SEO Optimization) - 元数据、URL 友好

### 技术特点 | Technical Features

- 文章版本控制
- 定时发布
- 内容审核工作流
- 全文搜索
- 缓存策略

---

## 完整目录树 | Complete Directory Tree

```
app/
├── controller/
│   ├── api/
│   │   └── v1/
│   │       ├── ArticleController.php
│   │       ├── CategoryController.php
│   │       ├── TagController.php
│   │       ├── MediaController.php
│   │       └── CommentController.php
│   └── web/
│       ├── ArticleController.php
│       └── AdminController.php
│
├── model/
│   └── eloquent/
│       ├── Article.php
│       ├── ArticleVersion.php
│       ├── Category.php
│       ├── Tag.php
│       ├── Media.php
│       └── Comment.php
│
├── service/
│   ├── article/
│   │   ├── CreateArticleService.php
│   │   ├── PublishArticleService.php
│   │   ├── UpdateArticleService.php
│   │   └── DeleteArticleService.php
│   ├── category/
│   │   ├── CreateCategoryService.php
│   │   └── ReorderCategoryService.php
│   ├── media/
│   │   ├── UploadMediaService.php
│   │   └── DeleteMediaService.php
│   └── comment/
│       ├── CreateCommentService.php
│       └── ModerateCommentService.php
│
├── domain/
│   ├── article/
│   │   ├── entity/
│   │   │   ├── Article.php
│   │   │   ├── ArticleVersion.php
│   │   │   └── ArticleSlug.php
│   │   ├── value_object/
│   │   │   ├── ArticleStatus.php
│   │   │   ├── ArticleContent.php
│   │   │   └── PublishSchedule.php
│   │   ├── event/
│   │   │   ├── ArticleCreated.php
│   │   │   ├── ArticlePublished.php
│   │   │   └── ArticleDeleted.php
│   │   └── rule/
│   │       └── PublishingRule.php
│   │
│   ├── category/
│   │   ├── entity/
│   │   │   └── Category.php
│   │   ├── value_object/
│   │   │   ├── CategoryPath.php
│   │   │   └── CategorySlug.php
│   │   └── rule/
│   │       └── CategoryHierarchyRule.php
│   │
│   ├── tag/
│   │   ├── entity/
│   │   │   └── Tag.php
│   │   └── value_object/
│   │       └── TagSlug.php
│   │
│   ├── media/
│   │   ├── entity/
│   │   │   └── Media.php
│   │   ├── value_object/
│   │   │   ├── MediaType.php
│   │   │   ├── FileSize.php
│   │   │   └── FilePath.php
│   │   └── rule/
│   │       └── MediaUploadRule.php
│   │
│   └── comment/
│       ├── entity/
│       │   └── Comment.php
│       ├── value_object/
│       │   └── CommentStatus.php
│       └── rule/
│           └── CommentModerationRule.php
│
├── contract/
│   ├── repository/
│   │   ├── ArticleRepositoryInterface.php
│   │   ├── CategoryRepositoryInterface.php
│   │   ├── TagRepositoryInterface.php
│   │   ├── MediaRepositoryInterface.php
│   │   └── CommentRepositoryInterface.php
│   ├── gateway/
│   │   ├── StorageGatewayInterface.php
│   │   └── SearchEngineInterface.php
│   └── service/
│       └── SlugGeneratorInterface.php
│
├── infrastructure/
│   ├── repository/
│   │   └── eloquent/
│   │       ├── EloquentArticleRepository.php
│   │       ├── EloquentCategoryRepository.php
│   │       ├── EloquentTagRepository.php
│   │       ├── EloquentMediaRepository.php
│   │       └── EloquentCommentRepository.php
│   ├── gateway/
│   │   ├── storage/
│   │   │   ├── LocalStorageGateway.php
│   │   │   └── S3StorageGateway.php
│   │   └── search/
│   │       └── ElasticsearchGateway.php
│   └── service/
│       └── SlugGenerator.php
│
├── middleware/
│   ├── auth/
│   │   └── AuthenticateMiddleware.php
│   └── permission/
│       └── CheckPermissionMiddleware.php
│
├── process/
│   ├── task/
│   │   ├── PublishScheduledArticlesTask.php
│   │   └── CleanupMediaTask.php
│   └── queue/
│       └── ArticleIndexConsumer.php
│
└── support/
    ├── exception/
    │   ├── ArticleNotFoundException.php
    │   ├── InvalidSlugException.php
    │   └── MediaUploadException.php
    └── helper/
        └── slug_helper.php
```

---

## 模块划分 | Module Breakdown

### 1. 文章模块 (Article Module)

**功能**: 文章 CRUD、版本控制、定时发布、状态管理

**核心类**:
- `domain/article/entity/Article.php` - 文章实体
- `service/article/PublishArticleService.php` - 发布服务
- `domain/article/rule/PublishingRule.php` - 发布规则

### 2. 分类模块 (Category Module)

**功能**: 层级分类、分类排序、分类树

**核心类**:
- `domain/category/entity/Category.php` - 分类实体
- `domain/category/rule/CategoryHierarchyRule.php` - 层级规则

### 3. 标签模块 (Tag Module)

**功能**: 标签管理、标签关联

**核心类**:
- `domain/tag/entity/Tag.php` - 标签实体

### 4. 媒体模块 (Media Module)

**功能**: 文件上传、图片处理、媒体库管理

**核心类**:
- `domain/media/entity/Media.php` - 媒体实体
- `service/media/UploadMediaService.php` - 上传服务
- `infrastructure/gateway/storage/S3StorageGateway.php` - 存储网关

### 5. 评论模块 (Comment Module)

**功能**: 评论发布、审核、回复

**核心类**:
- `domain/comment/entity/Comment.php` - 评论实体
- `service/comment/ModerateCommentService.php` - 审核服务

---

## 关键代码示例 | Key Code Examples

### 1. 文章实体 (Article Entity)

```php
<?php

declare(strict_types=1);

namespace app\domain\article\entity;

use app\domain\article\value_object\ArticleStatus;
use app\domain\article\value_object\ArticleContent;
use app\domain\article\value_object\PublishSchedule;
use app\domain\article\event\ArticlePublished;
use app\domain\article\exception\InvalidArticleOperationException;

final class Article
{
    private array $domainEvents = [];

    private function __construct(
        private readonly int $id,
        private string $title,
        private ArticleSlug $slug,
        private ArticleContent $content,
        private ArticleStatus $status,
        private readonly int $authorId,
        private array $categoryIds,
        private array $tagIds,
        private ?PublishSchedule $publishSchedule,
        private ?\DateTimeImmutable $publishedAt,
        private readonly \DateTimeImmutable $createdAt,
        private \DateTimeImmutable $updatedAt
    ) {
    }

    public static function create(
        string $title,
        ArticleSlug $slug,
        ArticleContent $content,
        int $authorId
    ): self {
        return new self(
            id: 0,
            title: $title,
            slug: $slug,
            content: $content,
            status: ArticleStatus::draft(),
            authorId: $authorId,
            categoryIds: [],
            tagIds: [],
            publishSchedule: null,
            publishedAt: null,
            createdAt: new \DateTimeImmutable(),
            updatedAt: new \DateTimeImmutable()
        );
    }

    public function publish(): void
    {
        if (!$this->status->isDraft()) {
            throw new InvalidArticleOperationException('Only draft articles can be published');
        }

        $this->status = ArticleStatus::published();
        $this->publishedAt = new \DateTimeImmutable();
        $this->recordEvent(new ArticlePublished($this));
    }

    public function schedulePublish(PublishSchedule $schedule): void
    {
        if (!$this->status->isDraft()) {
            throw new InvalidArticleOperationException('Only draft articles can be scheduled');
        }

        $this->publishSchedule = $schedule;
        $this->status = ArticleStatus::scheduled();
    }

    public function update(string $title, ArticleContent $content): void
    {
        $this->title = $title;
        $this->content = $content;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function attachCategories(array $categoryIds): void
    {
        $this->categoryIds = $categoryIds;
    }

    public function attachTags(array $tagIds): void
    {
        $this->tagIds = $tagIds;
    }

    // Getters
    public function id(): int
    {
        return $this->id;
    }

    public function title(): string
    {
        return $this->title;
    }

    public function slug(): ArticleSlug
    {
        return $this->slug;
    }

    public function content(): ArticleContent
    {
        return $this->content;
    }

    public function status(): ArticleStatus
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

### 2. 发布文章服务 (Publish Article Service)

```php
<?php

declare(strict_types=1);

namespace app\service\article;

use app\contract\repository\ArticleRepositoryInterface;
use app\contract\gateway\SearchEngineInterface;
use app\domain\article\rule\PublishingRule;
use support\Db;

final class PublishArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $articleRepository,
        private readonly SearchEngineInterface $searchEngine,
        private readonly PublishingRule $publishingRule
    ) {
    }

    public function handle(int $articleId, int $userId): void
    {
        Db::transaction(function () use ($articleId, $userId) {
            // 1. 获取文章
            $article = $this->articleRepository->findById($articleId);
            if ($article === null) {
                throw new \RuntimeException('Article not found');
            }

            // 2. 验证权限
            if ($article->authorId() !== $userId) {
                throw new \RuntimeException('Unauthorized');
            }

            // 3. 应用发布规则
            $this->publishingRule->validate($article);

            // 4. 发布文章
            $article->publish();

            // 5. 保存
            $this->articleRepository->save($article);

            // 6. 索引到搜索引擎
            $this->searchEngine->index('articles', $article->id(), [
                'title' => $article->title(),
                'content' => $article->content()->toPlainText(),
                'slug' => $article->slug()->value(),
            ]);
        });
    }
}
```

### 3. 媒体上传服务 (Upload Media Service)

```php
<?php

declare(strict_types=1);

namespace app\service\media;

use app\contract\repository\MediaRepositoryInterface;
use app\contract\gateway\StorageGatewayInterface;
use app\domain\media\entity\Media;
use app\domain\media\value_object\MediaType;
use app\domain\media\value_object\FileSize;
use app\domain\media\value_object\FilePath;
use app\domain\media\rule\MediaUploadRule;

final class UploadMediaService
{
    public function __construct(
        private readonly MediaRepositoryInterface $mediaRepository,
        private readonly StorageGatewayInterface $storageGateway,
        private readonly MediaUploadRule $uploadRule
    ) {
    }

    public function handle(
        string $filename,
        string $mimeType,
        int $size,
        string $tmpPath,
        int $userId
    ): Media {
        // 1. 验证上传规则
        $this->uploadRule->validate($mimeType, $size);

        // 2. 上传到存储
        $path = $this->storageGateway->upload(
            file: $tmpPath,
            directory: 'media/' . date('Y/m'),
            filename: $this->generateUniqueFilename($filename)
        );

        // 3. 创建媒体实体
        $media = Media::create(
            filename: $filename,
            path: FilePath::fromString($path),
            type: MediaType::fromMimeType($mimeType),
            size: FileSize::fromBytes($size),
            uploadedBy: $userId
        );

        // 4. 保存
        $this->mediaRepository->save($media);

        return $media;
    }

    private function generateUniqueFilename(string $originalFilename): string
    {
        $extension = pathinfo($originalFilename, PATHINFO_EXTENSION);
        return uniqid() . '_' . time() . '.' . $extension;
    }
}
```

### 4. 分类层级规则 (Category Hierarchy Rule)

```php
<?php

declare(strict_types=1);

namespace app\domain\category\rule;

use app\domain\category\entity\Category;
use app\domain\category\exception\InvalidCategoryHierarchyException;

final class CategoryHierarchyRule
{
    private const MAX_DEPTH = 5;

    /**
     * 验证分类层级深度
     * Validate category hierarchy depth
     */
    public function validateDepth(Category $category, int $currentDepth): void
    {
        if ($currentDepth >= self::MAX_DEPTH) {
            throw new InvalidCategoryHierarchyException(
                "Category hierarchy cannot exceed " . self::MAX_DEPTH . " levels"
            );
        }
    }

    /**
     * 验证不能将分类设为自己的子分类
     * Validate category cannot be its own child
     */
    public function validateNotSelfParent(Category $category, ?int $parentId): void
    {
        if ($parentId !== null && $category->id() === $parentId) {
            throw new InvalidCategoryHierarchyException(
                'Category cannot be its own parent'
            );
        }
    }

    /**
     * 验证不能形成循环引用
     * Validate no circular reference
     */
    public function validateNoCircularReference(
        Category $category,
        ?Category $parent,
        array $allCategories
    ): void {
        if ($parent === null) {
            return;
        }

        $visited = [$category->id()];
        $current = $parent;

        while ($current !== null) {
            if (in_array($current->id(), $visited, true)) {
                throw new InvalidCategoryHierarchyException(
                    'Circular reference detected in category hierarchy'
                );
            }

            $visited[] = $current->id();
            $current = $this->findParent($current, $allCategories);
        }
    }

    private function findParent(Category $category, array $allCategories): ?Category
    {
        if ($category->parentId() === null) {
            return null;
        }

        foreach ($allCategories as $cat) {
            if ($cat->id() === $category->parentId()) {
                return $cat;
            }
        }

        return null;
    }
}
```

### 5. 文章控制器 (Article Controller)

```php
<?php

declare(strict_types=1);

namespace app\controller\api\v1;

use app\service\article\CreateArticleService;
use app\service\article\PublishArticleService;
use app\service\article\UpdateArticleService;
use app\contract\repository\ArticleRepositoryInterface;
use support\Request;
use support\Response;

final class ArticleController
{
    public function __construct(
        private readonly CreateArticleService $createArticleService,
        private readonly PublishArticleService $publishArticleService,
        private readonly UpdateArticleService $updateArticleService,
        private readonly ArticleRepositoryInterface $articleRepository
    ) {
    }

    /**
     * 创建文章
     * Create article
     */
    public function create(Request $request): Response
    {
        $validated = $this->validate($request, [
            'title' => 'required|string|max:200',
            'content' => 'required|string',
            'category_ids' => 'array',
            'tag_ids' => 'array',
        ]);

        $article = $this->createArticleService->handle(
            title: $validated['title'],
            content: $validated['content'],
            authorId: $request->user()->id,
            categoryIds: $validated['category_ids'] ?? [],
            tagIds: $validated['tag_ids'] ?? []
        );

        return json([
            'success' => true,
            'data' => [
                'id' => $article->id(),
                'slug' => $article->slug()->value(),
                'status' => $article->status()->value(),
            ],
        ]);
    }

    /**
     * 发布文章
     * Publish article
     */
    public function publish(Request $request, int $id): Response
    {
        $this->publishArticleService->handle(
            articleId: $id,
            userId: $request->user()->id
        );

        return json([
            'success' => true,
            'message' => 'Article published successfully',
        ]);
    }

    /**
     * 获取文章详情
     * Get article details
     */
    public function show(Request $request, string $slug): Response
    {
        $article = $this->articleRepository->findBySlug($slug);

        if ($article === null) {
            return json([
                'success' => false,
                'message' => 'Article not found',
            ], 404);
        }

        return json([
            'success' => true,
            'data' => [
                'id' => $article->id(),
                'title' => $article->title(),
                'slug' => $article->slug()->value(),
                'content' => $article->content()->toHtml(),
                'status' => $article->status()->value(),
                'published_at' => $article->publishedAt()?->format('Y-m-d H:i:s'),
            ],
        ]);
    }
}
```

---

## 定时任务示例 | Scheduled Task Example

```php
<?php

declare(strict_types=1);

namespace app\process\task;

use app\contract\repository\ArticleRepositoryInterface;
use Workerman\Timer;

final class PublishScheduledArticlesTask
{
    public function __construct(
        private readonly ArticleRepositoryInterface $articleRepository
    ) {
    }

    public function onWorkerStart(): void
    {
        // 每分钟检查一次待发布的文章
        // Check scheduled articles every minute
        Timer::add(60, function () {
            $this->publishScheduledArticles();
        });
    }

    private function publishScheduledArticles(): void
    {
        $articles = $this->articleRepository->findScheduledForPublish(new \DateTimeImmutable());

        foreach ($articles as $article) {
            try {
                $article->publish();
                $this->articleRepository->save($article);
            } catch (\Exception $e) {
                logger()->error('Failed to publish scheduled article', [
                    'article_id' => $article->id(),
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

use app\contract\repository\ArticleRepositoryInterface;
use app\contract\repository\CategoryRepositoryInterface;
use app\contract\gateway\StorageGatewayInterface;
use app\contract\gateway\SearchEngineInterface;
use app\infrastructure\repository\eloquent\EloquentArticleRepository;
use app\infrastructure\repository\eloquent\EloquentCategoryRepository;
use app\infrastructure\gateway\storage\S3StorageGateway;
use app\infrastructure\gateway\search\ElasticsearchGateway;

return [
    ArticleRepositoryInterface::class => EloquentArticleRepository::class,
    CategoryRepositoryInterface::class => EloquentCategoryRepository::class,

    StorageGatewayInterface::class => function () {
        return new S3StorageGateway(
            bucket: config('aws.s3.bucket'),
            region: config('aws.s3.region'),
            credentials: [
                'key' => config('aws.s3.key'),
                'secret' => config('aws.s3.secret'),
            ]
        );
    },

    SearchEngineInterface::class => function () {
        return new ElasticsearchGateway(
            hosts: config('elasticsearch.hosts')
        );
    },
];
```

---

## 最佳实践 | Best Practices

### 1. 文章版本控制

每次编辑保存文章版本，支持回滚

### 2. SEO 友好

- 自动生成 slug
- 元数据管理
- 结构化数据

### 3. 缓存策略

- 文章列表缓存
- 分类树缓存
- 标签云缓存

### 4. 全文搜索

使用 Elasticsearch 实现高性能搜索

### 5. 媒体管理

- 云存储集成 (S3)
- 图片自动压缩
- CDN 加速

---

## 相关文档 | Related Documentation

- [目录结构规范](../architecture/directory-structure.md)
- [依赖方向规则](../architecture/dependency-rules.md)
- [PER Coding Style](../coding-standards/per-coding-style.md)

---

**最后更新 | Last Updated**: 2026-02-02
