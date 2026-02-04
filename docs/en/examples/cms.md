---
title: "CMS Example"
description: "Complete CMS system architecture example with article, category, tag, and media management"
---

## Table of Contents

- [System Overview](#system-overview)
- [Complete Directory Tree](#complete-directory-tree)
- [Module Breakdown](#module-breakdown)
- [Key Code Examples](#key-code-examples)

---

## System Overview

### Core Features

- Article Management - Create, edit, publish, draft
- Category Management - Hierarchical categories
- Tag System - Multi-tag support
- Media Library - Image and video upload management
- Comment System - Moderation, replies
- SEO Optimization - Metadata, URL friendly

### Technical Features

- Article version control
- Scheduled publishing
- Content review workflow
- Full-text search
- Caching strategy

---

## Complete Directory Tree

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
│   │   ├── enum/                              # Enums
│   │   │   └── ArticleStatus.php
│   │   ├── vo/                                # Value Objects
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
│   │   ├── vo/                                # Value Objects
│   │   │   ├── CategoryPath.php
│   │   │   └── CategorySlug.php
│   │   └── rule/
│   │       └── CategoryHierarchyRule.php
│   │
│   ├── tag/
│   │   ├── entity/
│   │   │   └── Tag.php
│   │   └── vo/                                # Value Objects
│   │       └── TagSlug.php
│   │
│   ├── media/
│   │   ├── entity/
│   │   │   └── Media.php
│   │   ├── enum/                              # Enums
│   │   │   └── MediaType.php
│   │   ├── vo/                                # Value Objects
│   │   │   ├── FileSize.php
│   │   │   └── FilePath.php
│   │   └── rule/
│   │       └── MediaUploadRule.php
│   │
│   └── comment/
│       ├── entity/
│       │   └── Comment.php
│       ├── enum/                              # Enums
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

## Module Breakdown

### 1. Article Module

**Features**: Article CRUD, version control, scheduled publishing, status management

**Core Classes**:
- `domain/article/entity/Article.php` - Article entity
- `service/article/PublishArticleService.php` - Publish service
- `domain/article/rule/PublishingRule.php` - Publishing rule

### 2. Category Module

**Features**: Hierarchical categories, category sorting, category tree

**Core Classes**:
- `domain/category/entity/Category.php` - Category entity
- `domain/category/rule/CategoryHierarchyRule.php` - Hierarchy rule

### 3. Tag Module

**Features**: Tag management, tag associations

**Core Classes**:
- `domain/tag/entity/Tag.php` - Tag entity

### 4. Media Module

**Features**: File upload, image processing, media library management

**Core Classes**:
- `domain/media/entity/Media.php` - Media entity
- `service/media/UploadMediaService.php` - Upload service
- `infrastructure/gateway/storage/S3StorageGateway.php` - Storage gateway

### 5. Comment Module

**Features**: Comment posting, moderation, replies

**Core Classes**:
- `domain/comment/entity/Comment.php` - Comment entity
- `service/comment/ModerateCommentService.php` - Moderation service

---

## Key Code Examples

### 1. Article Entity

```php
<?php

declare(strict_types=1);

namespace app\domain\article\entity;

use app\domain\article\enum\ArticleStatus;
use app\domain\article\vo\ArticleContent;
use app\domain\article\vo\PublishSchedule;
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
            status: ArticleStatus::Draft,
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

        $this->status = ArticleStatus::Published;
        $this->publishedAt = new \DateTimeImmutable();
        $this->recordEvent(new ArticlePublished($this));
    }

    public function schedulePublish(PublishSchedule $schedule): void
    {
        if (!$this->status->isDraft()) {
            throw new InvalidArticleOperationException('Only draft articles can be scheduled');
        }

        $this->publishSchedule = $schedule;
        $this->status = ArticleStatus::Scheduled;
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

### 2. Publish Article Service

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
            // 1. Get article
            $article = $this->articleRepository->findById($articleId);
            if ($article === null) {
                throw new \RuntimeException('Article not found');
            }

            // 2. Verify permissions
            if ($article->authorId() !== $userId) {
                throw new \RuntimeException('Unauthorized');
            }

            // 3. Apply publishing rules
            $this->publishingRule->validate($article);

            // 4. Publish article
            $article->publish();

            // 5. Save
            $this->articleRepository->save($article);

            // 6. Index to search engine
            $this->searchEngine->index('articles', $article->id(), [
                'title' => $article->title(),
                'content' => $article->content()->toPlainText(),
                'slug' => $article->slug()->value(),
            ]);
        });
    }
}
```

### 3. Media Upload Service

```php
<?php

declare(strict_types=1);

namespace app\service\media;

use app\contract\repository\MediaRepositoryInterface;
use app\contract\gateway\StorageGatewayInterface;
use app\domain\media\entity\Media;
use app\domain\media\enum\MediaType;
use app\domain\media\vo\FileSize;
use app\domain\media\vo\FilePath;
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
        // 1. Validate upload rules
        $this->uploadRule->validate($mimeType, $size);

        // 2. Upload to storage
        $path = $this->storageGateway->upload(
            file: $tmpPath,
            directory: 'media/' . date('Y/m'),
            filename: $this->generateUniqueFilename($filename)
        );

        // 3. Create media entity
        $media = Media::create(
            filename: $filename,
            path: FilePath::fromString($path),
            type: MediaType::fromMimeType($mimeType),
            size: FileSize::fromBytes($size),
            uploadedBy: $userId
        );

        // 4. Save
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

### 4. Category Hierarchy Rule

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

### 5. Article Controller

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

## Scheduled Task Example

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

## Dependency Injection Configuration

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

## Best Practices

### 1. Article Version Control

Save article versions on each edit, support rollback

### 2. SEO Friendly

- Auto-generate slugs
- Metadata management
- Structured data

### 3. Caching Strategy

- Article list caching
- Category tree caching
- Tag cloud caching

### 4. Full-text Search

Use Elasticsearch for high-performance search

### 5. Media Management

- Cloud storage integration (S3)
- Automatic image compression
- CDN acceleration

---

## Related Documentation

- [Directory Structure Standards](../architecture/directory-structure.mdx)
- [Dependency Direction Rules](../architecture/dependency-rules.mdx)
- [PER Coding Style](../coding-standards/per-coding-style.mdx)
