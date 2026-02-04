---
title: "Analytics/Reporting System"
description: "Data analytics and reporting system architecture example based on Webman"
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
│  └─ api/
│     └─ v1/
│        ├─ ReportController.php          # Report API
│        ├─ DashboardController.php       # Dashboard API
│        ├─ MetricController.php          # Metric API
│        └─ ExportController.php          # Export API
│
├─ model/
│  └─ eloquent/
│     ├─ Report.php                       # Report model
│     ├─ Metric.php                       # Metric model
│     ├─ DataSource.php                   # Data source model
│     └─ ReportSchedule.php               # Report schedule
│
├─ middleware/
│  ├─ auth/
│  │  └─ ReportAccessMiddleware.php      # Report access permission
│  └─ cache/
│     └─ ReportCacheMiddleware.php        # Report cache
│
├─ process/
│  ├─ task/
│  │  ├─ MetricAggregationTask.php       # Metric aggregation task
│  │  ├─ ReportGenerationTask.php        # Report generation task
│  │  └─ DataSyncTask.php                # Data sync task
│  └─ queue/
│     └─ ExportQueue.php                  # Export queue
│
├─ service/
│  ├─ report/
│  │  ├─ GenerateReportService.php       # Generate report
│  │  ├─ ScheduleReportService.php       # Schedule report
│  │  └─ ExportReportService.php         # Export report
│  ├─ metric/
│  │  ├─ CalculateMetricService.php      # Calculate metric
│  │  ├─ AggregateMetricService.php      # Aggregate metric
│  │  └─ CompareMetricService.php        # Compare metric
│  ├─ dashboard/
│  │  ├─ BuildDashboardService.php       # Build dashboard
│  │  └─ RefreshDashboardService.php     # Refresh dashboard
│  └─ export/
│     ├─ ExportToCsvService.php          # Export to CSV
│     ├─ ExportToExcelService.php        # Export to Excel
│     └─ ExportToPdfService.php          # Export to PDF
│
├─ domain/
│  ├─ report/
│  │  ├─ entity/
│  │  │  ├─ Report.php                   # Report entity
│  │  │  ├─ ReportSection.php            # Report section
│  │  │  └─ ReportSchedule.php           # Report schedule
│  │  ├─ enum/                           # Enums
│  │  │  ├─ ReportType.php               # Report type enum
│  │  │  ├─ ReportFormat.php             # Report format enum
│  │  │  └─ ReportStatus.php             # Report status enum
│  │  ├─ vo/                             # Value Objects
│  │  │  └─ DateRange.php                # Date range
│  │  └─ rule/
│  │     └─ ReportGenerationRule.php     # Report generation rules
│  │
│  ├─ metric/
│  │  ├─ entity/
│  │  │  ├─ Metric.php                   # Metric entity
│  │  │  └─ MetricSnapshot.php           # Metric snapshot
│  │  ├─ enum/                           # Enums
│  │  │  ├─ MetricType.php               # Metric type enum
│  │  │  └─ AggregationType.php          # Aggregation type enum
│  │  ├─ vo/                             # Value Objects
│  │  │  ├─ MetricValue.php              # Metric value
│  │  │  └─ Dimension.php                # Dimension
│  │  └─ rule/
│  │     ├─ MetricCalculationRule.php    # Metric calculation rules
│  │     └─ MetricValidationRule.php     # Metric validation rules
│  │
│  └─ datasource/
│     ├─ entity/
│     │  └─ DataSource.php               # Data source entity
│     ├─ enum/                           # Enums
│     │  └─ DataSourceType.php           # Data source type enum
│     ├─ vo/                             # Value Objects
│     │  └─ QueryConfig.php              # Query configuration
│     └─ rule/
│        └─ DataAccessRule.php           # Data access rules
│
├─ contract/
│  ├─ repository/
│  │  ├─ ReportRepositoryInterface.php
│  │  ├─ MetricRepositoryInterface.php
│  │  └─ DataSourceRepositoryInterface.php
│  ├─ gateway/
│  │  └─ DataWarehouseGatewayInterface.php  # Data warehouse gateway
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
│  │     └─ RedisMetricCacheRepository.php  # Metric cache
│  │
│  ├─ gateway/
│  │  ├─ clickhouse/
│  │  │  └─ ClickHouseDataWarehouse.php    # ClickHouse data warehouse
│  │  └─ bigquery/
│  │     └─ BigQueryDataWarehouse.php      # BigQuery data warehouse
│  │
│  └─ export/
│     ├─ CsvExporter.php                   # CSV exporter
│     ├─ ExcelExporter.php                 # Excel exporter
│     └─ PdfExporter.php                   # PDF exporter
│
└─ support/
   ├─ helper/
   │  ├─ chart_helper.php                  # Chart helper functions
   │  └─ date_helper.php                   # Date helper functions
   └─ exception/
      ├─ ReportException.php
      └─ MetricException.php
```

---

## Module Division

### Core Modules

1. **Report Module** - Report generation, scheduling, export
2. **Metric Module** - Metric calculation, aggregation, comparison
3. **Dashboard Module** - Real-time data display
4. **DataSource Module** - Multi-data source integration
5. **Export Module** - CSV/Excel/PDF export

---

## Directory Responsibilities

### `app/service/report/`
**Responsibility**: Report business orchestration - Generate report flow, schedule reports, export reports

### `app/service/metric/`
**Responsibility**: Metric business orchestration - Calculate metrics, aggregate data, comparative analysis

### `app/domain/report/`
**Responsibility**: Report domain logic - Report entity, report types, generation rules

### `app/domain/metric/`
**Responsibility**: Metric domain logic - Metric entity, calculation rules, aggregation types

### `app/infrastructure/gateway/`
**Responsibility**: Data warehouse adaptation - ClickHouse, BigQuery and other data warehouse integration

### `app/process/task/`
**Responsibility**: Background tasks - Scheduled metric aggregation, report generation, data sync

---

## Key Code Examples

### 1. Metric Entity

```php
<?php

declare(strict_types=1);

namespace app\domain\metric\entity;

use app\domain\metric\enum\MetricType;
use app\domain\metric\vo\MetricValue;
use app\domain\metric\vo\Dimension;

/**
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

### 2. Calculate Metric Service

```php
<?php

declare(strict_types=1);

namespace app\service\metric;

use app\contract\repository\MetricRepositoryInterface;
use app\contract\gateway\DataWarehouseGatewayInterface;
use app\domain\metric\entity\Metric;
use app\domain\metric\enum\MetricType;
use app\domain\metric\vo\MetricValue;
use app\domain\report\vo\DateRange;

/**
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
        // 1. Query raw data from data warehouse
        $rawData = $this->dataWarehouse->query(
            metric: $metricName,
            dateRange: $dateRange,
            filters: $filters
        );

        // 2. Calculate based on metric type
        $value = match ($type->value()) {
            'sum' => $this->calculateSum($rawData),
            'avg' => $this->calculateAverage($rawData),
            'count' => $this->calculateCount($rawData),
            'max' => $this->calculateMax($rawData),
            'min' => $this->calculateMin($rawData),
            default => throw new \InvalidArgumentException('Unknown metric type'),
        };

        // 3. Create metric entity
        $metric = Metric::create(
            name: $metricName,
            type: $type,
            value: MetricValue::fromFloat($value)
        );

        // 4. Persist
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

### 3. Generate Report Service

```php
<?php

declare(strict_types=1);

namespace app\service\report;

use app\contract\repository\ReportRepositoryInterface;
use app\service\metric\CalculateMetricService;
use app\domain\report\entity\Report;
use app\domain\report\enum\ReportType;
use app\domain\report\vo\DateRange;
use support\Db;

/**
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
            // 1. Create report entity
            $report = Report::create(
                name: $reportName,
                type: $type,
                dateRange: $dateRange
            );

            // 2. Calculate all metrics
            foreach ($metricNames as $metricName) {
                $metric = $this->calculateMetricService->handle(
                    metricName: $metricName,
                    type: $this->getMetricType($metricName),
                    dateRange: $dateRange
                );

                $report->addMetric($metric);
            }

            // 3. Mark as completed
            $report->markAsCompleted();

            // 4. Persist
            $this->reportRepository->save($report);

            return $report;
        });
    }

    private function getMetricType(string $metricName): \app\domain\metric\values\MetricType
    {
        // Return calculation type based on metric name
        return \app\domain\metric\values\MetricType::sum();
    }
}
```

### 4. ClickHouse Data Warehouse Gateway

```php
<?php

declare(strict_types=1);

namespace app\infrastructure\gateway\clickhouse;

use app\contract\gateway\DataWarehouseGatewayInterface;
use app\domain\metric\values\DateRange;

/**
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
        // 1. Build SQL query
        $sql = $this->buildQuery($metric, $dateRange, $filters);

        // 2. Execute query
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

        // Date range condition
        $conditions[] = sprintf(
            "date >= '%s' AND date <= '%s'",
            $dateRange->start()->format('Y-m-d'),
            $dateRange->end()->format('Y-m-d')
        );

        // Other filter conditions
        foreach ($filters as $field => $value) {
            $conditions[] = sprintf("%s = '%s'", $field, $value);
        }

        return implode(' AND ', $conditions);
    }

    private function executeQuery(string $sql): array
    {
        // Execute ClickHouse query
        return [];
    }

    private function getTableName(string $metric): string
    {
        return 'metrics_' . $metric;
    }
}
```

### 5. Metric Aggregation Task

```php
<?php

declare(strict_types=1);

namespace app\process\task;

use app\service\metric\AggregateMetricService;
use app\domain\metric\enum\AggregationType;
use app\domain\report\vo\DateRange;
use Workerman\Timer;

/**
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
        // Aggregate metrics every hour
        Timer::add(3600, function () {
            $this->aggregateHourlyMetrics();
        });

        // Aggregate yesterday's metrics daily at midnight
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

## Best Practices

### Data Aggregation Strategy

1. **Pre-aggregation**: Scheduled tasks pre-aggregate common metrics to improve query speed
2. **Layered Aggregation**: Hour -> Day -> Week -> Month, aggregate layer by layer
3. **Incremental Calculation**: Only calculate new data, avoid full recalculation
4. **Caching Strategy**: Use Redis to cache hot metrics

### Performance Optimization

1. **Data Warehouse**: Use columnar databases like ClickHouse for analytics data
2. **Async Export**: Use queue for async export of large reports
3. **Pagination**: Return large datasets with pagination
4. **Index Optimization**: Create indexes on time fields and common dimensions

### Report Scheduling

1. **Scheduled Generation**: Use Cron expressions to configure report generation time
2. **Email Push**: Auto send email after report generation
3. **Incremental Updates**: Only update changed data
4. **Failure Retry**: Auto retry on generation failure

### Data Security

1. **Access Control**: Role-based report access permissions
2. **Data Masking**: Mask sensitive data in display
3. **Audit Logging**: Record all report access and export operations
4. **Export Limits**: Limit export data volume and frequency

---

## Related Documentation

- [Directory Structure Standards](/en/architecture/directory-structure)
- [Dependency Direction Rules](/en/architecture/dependency-rules)
- [Pest Testing Framework](/en/tools/pest)
