# 数据报表系统 | Analytics/Reporting System

> 基于 Webman 的数据分析和报表系统架构示例
> Data analytics and reporting system architecture example based on Webman

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
│  └─ api/
│     └─ v1/
│        ├─ ReportController.php          # 报表接口
│        ├─ DashboardController.php       # 仪表盘接口
│        ├─ MetricController.php          # 指标接口
│        └─ ExportController.php          # 导出接口
│
├─ model/
│  └─ eloquent/
│     ├─ Report.php                       # 报表模型
│     ├─ Metric.php                       # 指标模型
│     ├─ DataSource.php                   # 数据源模型
│     └─ ReportSchedule.php               # 报表调度
│
├─ middleware/
│  ├─ auth/
│  │  └─ ReportAccessMiddleware.php      # 报表访问权限
│  └─ cache/
│     └─ ReportCacheMiddleware.php        # 报表缓存
│
├─ process/
│  ├─ task/
│  │  ├─ MetricAggregationTask.php       # 指标聚合任务
│  │  ├─ ReportGenerationTask.php        # 报表生成任务
│  │  └─ DataSyncTask.php                # 数据同步任务
│  └─ queue/
│     └─ ExportQueue.php                  # 导出队列
│
├─ service/
│  ├─ report/
│  │  ├─ GenerateReportService.php       # 生成报表
│  │  ├─ ScheduleReportService.php       # 调度报表
│  │  └─ ExportReportService.php         # 导出报表
│  ├─ metric/
│  │  ├─ CalculateMetricService.php      # 计算指标
│  │  ├─ AggregateMetricService.php      # 聚合指标
│  │  └─ CompareMetricService.php        # 对比指标
│  ├─ dashboard/
│  │  ├─ BuildDashboardService.php       # 构建仪表盘
│  │  └─ RefreshDashboardService.php     # 刷新仪表盘
│  └─ export/
│     ├─ ExportToCsvService.php          # 导出 CSV
│     ├─ ExportToExcelService.php        # 导出 Excel
│     └─ ExportToPdfService.php          # 导出 PDF
│
├─ domain/
│  ├─ report/
│  │  ├─ entity/
│  │  │  ├─ Report.php                   # 报表实体
│  │  │  ├─ ReportSection.php            # 报表章节
│  │  │  └─ ReportSchedule.php           # 报表调度
│  │  ├─ value_object/
│  │  │  ├─ ReportType.php               # 报表类型
│  │  │  ├─ DateRange.php                # 日期范围
│  │  │  ├─ ReportFormat.php             # 报表格式
│  │  │  └─ ReportStatus.php             # 报表状态
│  │  └─ rule/
│  │     └─ ReportGenerationRule.php     # 报表生成规则
│  │
│  ├─ metric/
│  │  ├─ entity/
│  │  │  ├─ Metric.php                   # 指标实体
│  │  │  └─ MetricSnapshot.php           # 指标快照
│  │  ├─ value_object/
│  │  │  ├─ MetricType.php               # 指标类型
│  │  │  ├─ AggregationType.php          # 聚合类型
│  │  │  ├─ MetricValue.php              # 指标值
│  │  │  └─ Dimension.php                # 维度
│  │  └─ rule/
│  │     ├─ MetricCalculationRule.php    # 指标计算规则
│  │     └─ MetricValidationRule.php     # 指标验证规则
│  │
│  └─ datasource/
│     ├─ entity/
│     │  └─ DataSource.php               # 数据源实体
│     ├─ value_object/
│     │  ├─ DataSourceType.php           # 数据源类型
│     │  └─ QueryConfig.php              # 查询配置
│     └─ rule/
│        └─ DataAccessRule.php           # 数据访问规则
│
├─ contract/
│  ├─ repository/
│  │  ├─ ReportRepositoryInterface.php
│  │  ├─ MetricRepositoryInterface.php
│  │  └─ DataSourceRepositoryInterface.php
│  ├─ gateway/
│  │  └─ DataWarehouseGatewayInterface.php  # 数据仓库网关
│  └─ service/
│     ├─ ExportServiceInterface.php
│     └─ AggregationServiceInterface.php
│
├─ infrastructure/
│  ├─ repository/
│  │  ├─ eloquent/
│  │  │  ├─ EloquentReportRepository.php
│  │  │  └─ EloquentMetricRepository.php
│  │  └─ redis/
│  │     └─ RedisMetricCacheRepository.php  # 指标缓存
│  │
│  ├─ gateway/
│  │  ├─ clickhouse/
│  │  │  └─ ClickHouseDataWarehouse.php    # ClickHouse 数据仓库
│  │  └─ bigquery/
│  │     └─ BigQueryDataWarehouse.php      # BigQuery 数据仓库
│  │
│  └─ export/
│     ├─ CsvExporter.php                   # CSV 导出器
│     ├─ ExcelExporter.php                 # Excel 导出器
│     └─ PdfExporter.php                   # PDF 导出器
│
└─ support/
   ├─ helper/
   │  ├─ chart_helper.php                  # 图表辅助函数
   │  └─ date_helper.php                   # 日期辅助函数
   └─ exception/
      ├─ ReportException.php
      └─ MetricException.php
```

---

## 模块划分

### 核心模块 | Core Modules

1. **报表模块 (Report)** - 报表生成、调度、导出
2. **指标模块 (Metric)** - 指标计算、聚合、对比
3. **仪表盘模块 (Dashboard)** - 实时数据展示
4. **数据源模块 (DataSource)** - 多数据源接入
5. **导出模块 (Export)** - CSV/Excel/PDF 导出

---

## 目录职责

### `app/service/report/`
**职责**: 报表业务编排 - 生成报表流程、调度报表、导出报表

### `app/service/metric/`
**职责**: 指标业务编排 - 计算指标、聚合数据、对比分析

### `app/domain/report/`
**职责**: 报表领域逻辑 - 报表实体、报表类型、生成规则

### `app/domain/metric/`
**职责**: 指标领域逻辑 - 指标实体、计算规则、聚合类型

### `app/infrastructure/gateway/`
**职责**: 数据仓库适配 - ClickHouse、BigQuery 等数据仓库接入

### `app/process/task/`
**职责**: 后台任务 - 定时聚合指标、生成报表、同步数据

---

## 关键代码示例

### 1. 指标实体

```php
<?php

declare(strict_types=1);

namespace app\domain\metric\entity;

use app\domain\metric\value_object\MetricType;
use app\domain\metric\value_object\MetricValue;
use app\domain\metric\value_object\Dimension;

/**
 * 指标实体
 * Metric Entity
 */
final class Metric
{
    private function __construct(
        private readonly int $id,
        private readonly string $name,
        private readonly MetricType $type,
        private readonly MetricValue $value,
        private readonly array $dimensions,
        private readonly \DateTimeImmutable $timestamp
    ) {
    }

    public static function create(
        string $name,
        MetricType $type,
        MetricValue $value,
        array $dimensions = []
    ): self {
        return new self(
            id: 0,
            name: $name,
            type: $type,
            value: $value,
            dimensions: $dimensions,
            timestamp: new \DateTimeImmutable()
        );
    }

    public function withDimension(Dimension $dimension): self
    {
        $dimensions = $this->dimensions;
        $dimensions[] = $dimension;

        return new self(
            id: $this->id,
            name: $this->name,
            type: $this->type,
            value: $this->value,
            dimensions: $dimensions,
            timestamp: $this->timestamp
        );
    }

    // Getters
    public function id(): int
    {
        return $this->id;
    }

    public function name(): string
    {
        return $this->name;
    }

    public function type(): MetricType
    {
        return $this->type;
    }

    public function value(): MetricValue
    {
        return $this->value;
    }

    public function dimensions(): array
    {
        return $this->dimensions;
    }

    public function timestamp(): \DateTimeImmutable
    {
        return $this->timestamp;
    }
}
```

### 2. 计算指标服务

```php
<?php

declare(strict_types=1);

namespace app\service\metric;

use app\contract\repository\MetricRepositoryInterface;
use app\contract\gateway\DataWarehouseGatewayInterface;
use app\domain\metric\entity\Metric;
use app\domain\metric\value_object\MetricType;
use app\domain\metric\value_object\MetricValue;
use app\domain\metric\value_object\DateRange;

/**
 * 计算指标服务
 * Calculate Metric Service
 */
final class CalculateMetricService
{
    public function __construct(
        private readonly MetricRepositoryInterface $metricRepository,
        private readonly DataWarehouseGatewayInterface $dataWarehouse
    ) {
    }

    public function handle(
        string $metricName,
        MetricType $type,
        DateRange $dateRange,
        array $filters = []
    ): Metric {
        // 1. 从数据仓库查询原始数据
        $rawData = $this->dataWarehouse->query(
            metric: $metricName,
            dateRange: $dateRange,
            filters: $filters
        );

        // 2. 根据指标类型计算
        $value = match ($type->value()) {
            'sum' => $this->calculateSum($rawData),
            'avg' => $this->calculateAverage($rawData),
            'count' => $this->calculateCount($rawData),
            'max' => $this->calculateMax($rawData),
            'min' => $this->calculateMin($rawData),
            default => throw new \InvalidArgumentException('Unknown metric type'),
        };

        // 3. 创建指标实体
        $metric = Metric::create(
            name: $metricName,
            type: $type,
            value: MetricValue::fromFloat($value)
        );

        // 4. 持久化
        $this->metricRepository->save($metric);

        return $metric;
    }

    private function calculateSum(array $data): float
    {
        return array_sum(array_column($data, 'value'));
    }

    private function calculateAverage(array $data): float
    {
        $sum = $this->calculateSum($data);
        $count = count($data);
        return $count > 0 ? $sum / $count : 0.0;
    }

    private function calculateCount(array $data): float
    {
        return (float) count($data);
    }

    private function calculateMax(array $data): float
    {
        $values = array_column($data, 'value');
        return !empty($values) ? max($values) : 0.0;
    }

    private function calculateMin(array $data): float
    {
        $values = array_column($data, 'value');
        return !empty($values) ? min($values) : 0.0;
    }
}
```

### 3. 聚合指标服务

```php
<?php

declare(strict_types=1);

namespace app\service\metric;

use app\contract\repository\MetricRepositoryInterface;
use app\domain\metric\value_object\AggregationType;
use app\domain\metric\value_object\DateRange;

/**
 * 聚合指标服务
 * Aggregate Metric Service
 */
final class AggregateMetricService
{
    public function __construct(
        private readonly MetricRepositoryInterface $metricRepository
    ) {
    }

    public function handle(
        string $metricName,
        AggregationType $aggregationType,
        DateRange $dateRange,
        string $groupBy = 'day'
    ): array {
        // 1. 获取时间范围内的所有指标数据
        $metrics = $this->metricRepository->findByNameAndDateRange(
            $metricName,
            $dateRange
        );

        // 2. 按时间维度分组
        $grouped = $this->groupByTimeDimension($metrics, $groupBy);

        // 3. 对每组进行聚合
        $aggregated = [];
        foreach ($grouped as $period => $periodMetrics) {
            $aggregated[$period] = $this->aggregate($periodMetrics, $aggregationType);
        }

        return $aggregated;
    }

    private function groupByTimeDimension(array $metrics, string $groupBy): array
    {
        $grouped = [];

        foreach ($metrics as $metric) {
            $key = match ($groupBy) {
                'hour' => $metric->timestamp()->format('Y-m-d H:00'),
                'day' => $metric->timestamp()->format('Y-m-d'),
                'week' => $metric->timestamp()->format('Y-W'),
                'month' => $metric->timestamp()->format('Y-m'),
                default => $metric->timestamp()->format('Y-m-d'),
            };

            $grouped[$key][] = $metric;
        }

        return $grouped;
    }

    private function aggregate(array $metrics, AggregationType $type): float
    {
        $values = array_map(fn ($m) => $m->value()->toFloat(), $metrics);

        return match ($type->value()) {
            'sum' => array_sum($values),
            'avg' => count($values) > 0 ? array_sum($values) / count($values) : 0.0,
            'max' => !empty($values) ? max($values) : 0.0,
            'min' => !empty($values) ? min($values) : 0.0,
            default => 0.0,
        };
    }
}
```

### 4. 生成报表服务

```php
<?php

declare(strict_types=1);

namespace app\service\report;

use app\contract\repository\ReportRepositoryInterface;
use app\service\metric\CalculateMetricService;
use app\domain\report\entity\Report;
use app\domain\report\value_object\ReportType;
use app\domain\report\value_object\DateRange;
use support\Db;

/**
 * 生成报表服务
 * Generate Report Service
 */
final class GenerateReportService
{
    public function __construct(
        private readonly ReportRepositoryInterface $reportRepository,
        private readonly CalculateMetricService $calculateMetricService
    ) {
    }

    public function handle(
        string $reportName,
        ReportType $type,
        DateRange $dateRange,
        array $metricNames = []
    ): Report {
        return Db::transaction(function () use (
            $reportName,
            $type,
            $dateRange,
            $metricNames
        ) {
            // 1. 创建报表实体
            $report = Report::create(
                name: $reportName,
                type: $type,
                dateRange: $dateRange
            );

            // 2. 计算所有指标
            foreach ($metricNames as $metricName) {
                $metric = $this->calculateMetricService->handle(
                    metricName: $metricName,
                    type: $this->getMetricType($metricName),
                    dateRange: $dateRange
                );

                $report->addMetric($metric);
            }

            // 3. 标记为已完成
            $report->markAsCompleted();

            // 4. 持久化
            $this->reportRepository->save($report);

            return $report;
        });
    }

    private function getMetricType(string $metricName): \app\domain\metric\value_object\MetricType
    {
        // 根据指标名称返回对应的计算类型
        return \app\domain\metric\value_object\MetricType::sum();
    }
}
```

### 5. 导出报表服务

```php
<?php

declare(strict_types=1);

namespace app\service\export;

use app\contract\repository\ReportRepositoryInterface;
use app\infrastructure\export\ExcelExporter;
use app\domain\report\value_object\ReportFormat;

/**
 * 导出报表服务
 * Export Report Service
 */
final class ExportReportService
{
    public function __construct(
        private readonly ReportRepositoryInterface $reportRepository,
        private readonly ExcelExporter $excelExporter
    ) {
    }

    public function handle(int $reportId, ReportFormat $format): string
    {
        // 1. 获取报表
        $report = $this->reportRepository->findById($reportId);
        if ($report === null) {
            throw new \RuntimeException('Report not found');
        }

        // 2. 根据格式导出
        return match ($format->value()) {
            'excel' => $this->exportToExcel($report),
            'csv' => $this->exportToCsv($report),
            'pdf' => $this->exportToPdf($report),
            default => throw new \InvalidArgumentException('Unsupported format'),
        };
    }

    private function exportToExcel($report): string
    {
        // 使用 ExcelExporter 导出
        $filePath = storage_path('exports/' . $report->id() . '.xlsx');
        $this->excelExporter->export($report, $filePath);
        return $filePath;
    }

    private function exportToCsv($report): string
    {
        // CSV 导出实现
        return '';
    }

    private function exportToPdf($report): string
    {
        // PDF 导出实现
        return '';
    }
}
```

### 6. ClickHouse 数据仓库网关

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\clickhouse;

use app\contract\gateway\DataWarehouseGatewayInterface;
use app\domain\metric\value_object\DateRange;

/**
 * ClickHouse 数据仓库网关
 * ClickHouse Data Warehouse Gateway
 */
final class ClickHouseDataWarehouse implements DataWarehouseGatewayInterface
{
    public function __construct(
        private readonly string $host,
        private readonly int $port,
        private readonly string $database
    ) {
    }

    public function query(
        string $metric,
        DateRange $dateRange,
        array $filters = []
    ): array {
        // 1. 构建 SQL 查询
        $sql = $this->buildQuery($metric, $dateRange, $filters);

        // 2. 执行查询
        $result = $this->executeQuery($sql);

        return $result;
    }

    private function buildQuery(
        string $metric,
        DateRange $dateRange,
        array $filters
    ): string {
        $table = $this->getTableName($metric);
        $where = $this->buildWhereClause($dateRange, $filters);

        return "SELECT * FROM {$table} WHERE {$where}";
    }

    private function buildWhereClause(DateRange $dateRange, array $filters): string
    {
        $conditions = [];

        // 日期范围条件
        $conditions[] = sprintf(
            "date >= '%s' AND date <= '%s'",
            $dateRange->start()->format('Y-m-d'),
            $dateRange->end()->format('Y-m-d')
        );

        // 其他过滤条件
        foreach ($filters as $field => $value) {
            $conditions[] = sprintf("%s = '%s'", $field, $value);
        }

        return implode(' AND ', $conditions);
    }

    private function executeQuery(string $sql): array
    {
        // 执行 ClickHouse 查询
        // 实际实现需要使用 ClickHouse 客户端
        return [];
    }

    private function getTableName(string $metric): string
    {
        // 根据指标名称返回对应的表名
        return 'metrics_' . $metric;
    }
}
```

### 7. 指标聚合任务

```php
<?php

declare(strict_types=1);

namespace app\process\task;

use app\service\metric\AggregateMetricService;
use app\domain\metric\value_object\AggregationType;
use app\domain\metric\value_object\DateRange;
use Workerman\Timer;

/**
 * 指标聚合任务
 * Metric Aggregation Task
 */
final class MetricAggregationTask
{
    public function __construct(
        private readonly AggregateMetricService $aggregateMetricService
    ) {
    }

    public function onWorkerStart(): void
    {
        // 每小时聚合一次指标
        Timer::add(3600, function () {
            $this->aggregateHourlyMetrics();
        });

        // 每天凌晨聚合昨天的指标
        Timer::add(86400, function () {
            $this->aggregateDailyMetrics();
        });
    }

    private function aggregateHourlyMetrics(): void
    {
        try {
            $dateRange = DateRange::lastHour();

            $this->aggregateMetricService->handle(
                metricName: 'revenue',
                aggregationType: AggregationType::sum(),
                dateRange: $dateRange,
                groupBy: 'hour'
            );

            logger()->info('Hourly metrics aggregated successfully');
        } catch (\Exception $e) {
            logger()->error('Hourly metric aggregation failed', [
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function aggregateDailyMetrics(): void
    {
        try {
            $dateRange = DateRange::yesterday();

            $this->aggregateMetricService->handle(
                metricName: 'revenue',
                aggregationType: AggregationType::sum(),
                dateRange: $dateRange,
                groupBy: 'day'
            );

            logger()->info('Daily metrics aggregated successfully');
        } catch (\Exception $e) {
            logger()->error('Daily metric aggregation failed', [
                'error' => $e->getMessage(),
            ]);
        }
    }
}
```

---

## 最佳实践

### 数据聚合策略

1. **预聚合**: 定时任务预先聚合常用指标，提升查询速度
2. **分层聚合**: 小时 → 天 → 周 → 月，逐层聚合
3. **增量计算**: 只计算新增数据，避免全量计算
4. **缓存策略**: 使用 Redis 缓存热点指标

### 性能优化

1. **数据仓库**: 使用 ClickHouse 等列式数据库存储分析数据
2. **异步导出**: 大报表使用队列异步导出
3. **分页查询**: 大数据集分页返回
4. **索引优化**: 在时间字段和常用维度上建立索引

### 报表调度

1. **定时生成**: 使用 Cron 表达式配置报表生成时间
2. **邮件推送**: 报表生成后自动发送邮件
3. **增量更新**: 只更新变化的数据
4. **失败重试**: 生成失败自动重试

### 数据安全

1. **权限控制**: 基于角色的报表访问权限
2. **数据脱敏**: 敏感数据脱敏展示
3. **审计日志**: 记录所有报表访问和导出操作
4. **导出限制**: 限制导出数据量和频率

---

## 相关文档

- [目录结构规范](../architecture/directory-structure.md)
- [依赖方向规则](../architecture/dependency-rules.md)
- [Pest 测试框架](../tools/pest.md)

---

**最后更新**: 2026-02-02
