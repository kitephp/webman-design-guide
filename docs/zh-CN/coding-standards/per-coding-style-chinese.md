---
title: "PER Coding Style 中文完整版"
description: "PHP Evolving Recommendation - 现代 PHP 代码风格规范完整中文翻译"
---

**原文**: [PER Coding Style](https://www.php-fig.org/per/coding-style/)
**翻译**: Webman Design Guide 项目组
**许可证**: 本翻译基于 PER Coding Style (MIT License) 创作

---

## 目录

1. [概述](#1-概述)
2. [通用规则](#2-通用规则)
3. [文件](#3-文件)
4. [行](#4-行)
5. [缩进](#5-缩进)
6. [关键字和类型](#6-关键字和类型)
7. [声明、命名空间和导入](#7-声明命名空间和导入)
8. [类、属性和方法](#8-类属性和方法)
9. [控制结构](#9-控制结构)
10. [运算符](#10-运算符)
11. [闭包](#11-闭包)
12. [匿名类](#12-匿名类)

---

## 1. 概述

### 1.1 什么是 PER

PER (PHP Evolving Recommendation) 是 PHP-FIG 推出的持续演进的编码规范，作为 PSR-12 的继任者。

**关键特点**:
- 完全兼容 PSR-12
- 支持 PHP 8.0+ 新特性
- 持续更新以支持新的 PHP 语言特性
- 社区驱动和维护

### 1.2 规范目标

本规范的目标是减少不同开发者在阅读代码时的认知摩擦。通过统一的代码风格规则，使代码更易于阅读和维护。

---

## 2. 通用规则

### 2.1 基础编码标准

代码必须遵循 PSR-1 的所有规则。

### 2.2 文件

- 所有 PHP 文件必须使用 Unix LF (linefeed) 行尾
- 所有 PHP 文件必须以一个空行结束
- 纯 PHP 文件必须省略结束标签 `?>`

### 2.3 行

- 行长度不得有硬性限制
- 行长度的软限制必须是 120 个字符
- 行不应超过 80 个字符；超过的行应该被拆分成多个不超过 80 个字符的后续行

### 2.4 缩进

- 代码必须使用 4 个空格的缩进
- 不得使用制表符 (tab) 进行缩进

---

## 3. 文件

### 3.1 PHP 标签

PHP 代码必须使用长标签 `<?php ?>` 或短输出标签 `<?= ?>`；不得使用其他标签变体。

### 3.2 字符编码

PHP 代码必须只使用不带 BOM 的 UTF-8。

### 3.3 副作用

一个文件应该声明符号（类、函数、常量等）或者引起副作用（例如：生成输出、修改 .ini 设置等），但不应该两者都做。

**不好的例子**:
```php
<?php
// 副作用：修改 ini 设置
ini_set('error_reporting', E_ALL);

// 副作用：加载文件
include "file.php";

// 副作用：生成输出
echo "<html>\n";

// 声明
function foo()
{
    // 函数体
}
```

**好的例子**:
```php
<?php
// 只声明，没有副作用
function foo()
{
    // 函数体
}

// 条件声明不是副作用
if (!function_exists('bar')) {
    function bar()
    {
        // 函数体
    }
}
```

---

## 4. 行

### 4.1 行长度

- 行长度不得有硬性限制
- 行长度的软限制必须是 120 个字符
- 行不应超过 80 个字符

### 4.2 空行

- 在 `namespace` 声明后必须有一个空行
- 在 `use` 声明块后必须有一个空行
- 在类的开始大括号后不得有空行
- 在类的结束大括号前不得有空行
- 在方法的开始大括号后不得有空行
- 在方法的结束大括号前不得有空行

---

## 5. 缩进

### 5.1 基本缩进

代码必须使用 4 个空格的缩进，不得使用制表符。

```php
<?php

namespace Vendor\Package;

class ClassName
{
    public function fooBarBaz($arg1, &$arg2, $arg3 = [])
    {
        // 方法体使用 4 个空格缩进
        if ($arg1 === $arg2) {
            // if 体使用 8 个空格缩进
            return true;
        }

        return false;
    }
}
```

---

## 6. 关键字和类型

### 6.1 关键字

所有 PHP 保留关键字和类型必须使用小写。

```php
<?php

// 正确
public function foo(): void
{
    // ...
}

// 错误
public function foo(): Void
{
    // ...
}
```

### 6.2 类型关键字

所有 PHP 类型关键字必须使用小写形式。

**标量类型**:
- `bool`
- `int`
- `float`
- `string`

**复合类型**:
- `array`
- `object`
- `callable`
- `iterable`

**特殊类型**:
- `mixed`
- `void`
- `null`
- `true`
- `false`

### 6.3 类型声明

类型声明必须在类型关键字后有一个空格。

```php
<?php

// 正确
function foo(int $a, string $b): bool
{
    return true;
}

// 错误
function foo(int$a, string$b):bool
{
    return true;
}
```

### 6.4 联合类型 (PHP 8.0+)

联合类型声明中，管道符 `|` 前后不得有空格。

```php
<?php

// 正确
function foo(int|float $number): int|float
{
    return $number * 2;
}

// 错误
function foo(int | float $number): int | float
{
    return $number * 2;
}
```

### 6.5 交叉类型 (PHP 8.1+)

交叉类型声明中，与符号 `&` 前后不得有空格。

```php
<?php

// 正确
function foo(Countable&Traversable $data): void
{
    // ...
}

// 错误
function foo(Countable & Traversable $data): void
{
    // ...
}
```

### 6.6 可空类型

可空类型声明中，问号 `?` 和类型之间不得有空格。

```php
<?php

// 正确
function foo(?string $name): ?int
{
    return null;
}

// 错误
function foo(? string $name): ? int
{
    return null;
}
```

---

## 7. 声明、命名空间和导入

### 7.1 声明语句

`declare` 语句必须不包含空格，格式为 `declare(strict_types=1);`。

```php
<?php

declare(strict_types=1);

namespace Vendor\Package;
```

### 7.2 命名空间声明

- 命名空间声明后必须有一个空行
- 当存在时，所有 `use` 声明必须在 `namespace` 声明之后
- 每个声明必须使用一个 `use` 关键字
- `use` 声明块后必须有一个空行

```php
<?php

declare(strict_types=1);

namespace Vendor\Package;

use FooClass;
use BarClass as Bar;
use OtherVendor\OtherPackage\BazClass;

// 这里必须有一个空行
class ClassName
{
    // ...
}
```

### 7.3 导入语句分组

导入语句可以分组，每组之间用空行分隔。

```php
<?php

namespace Vendor\Package;

use Vendor\Package\{ClassA as A, ClassB, ClassC as C};
use Vendor\Package\SomeNamespace\ClassD as D;
use Vendor\Package\AnotherNamespace\ClassE as E;

use function Vendor\Package\{functionA, functionB, functionC};
use function Another\Vendor\functionD;

use const Vendor\Package\{CONSTANT_A, CONSTANT_B, CONSTANT_C};
use const Another\Vendor\CONSTANT_D;

class ClassName
{
    // ...
}
```

---

## 8. 类、属性和方法

### 8.1 扩展和实现

`extends` 和 `implements` 关键字必须与类名在同一行。

```php
<?php

namespace Vendor\Package;

use FooClass;
use BarClass as Bar;
use OtherVendor\OtherPackage\BazClass;

class ClassName extends ParentClass implements \ArrayAccess, \Countable
{
    // 类内容
}
```

如果实现的接口列表很长，可以拆分成多行，每个接口占一行。

```php
<?php

namespace Vendor\Package;

class ClassName extends ParentClass implements
    \ArrayAccess,
    \Countable,
    \Serializable
{
    // 类内容
}
```

### 8.2 使用 Traits

`use` 关键字用于导入 traits 必须在开始大括号后的下一行声明。

```php
<?php

namespace Vendor\Package;

class ClassName
{
    use FirstTrait;
    use SecondTrait;
    use ThirdTrait;
}
```

多个 traits 可以在一行声明。

```php
<?php

namespace Vendor\Package;

class ClassName
{
    use FirstTrait, SecondTrait, ThirdTrait;
}
```

Trait 冲突解决和别名。

```php
<?php

namespace Vendor\Package;

class ClassName
{
    use FirstTrait;
    use SecondTrait;
    use ThirdTrait {
        ThirdTrait::bigTalk insteadof SecondTrait;
        SecondTrait::bigTalk as talk;
    }
}
```

### 8.3 属性和常量

#### 可见性

所有属性必须声明可见性。

```php
<?php

class ClassName
{
    public string $foo;
    protected int $bar;
    private array $baz;
}
```

#### 类型声明

属性应该声明类型。

```php
<?php

class ClassName
{
    public string $name;
    public int $age;
    public ?string $email = null;
}
```

#### 只读属性 (PHP 8.1+)

```php
<?php

class User
{
    public function __construct(
        public readonly string $name,
        public readonly int $age,
    ) {
    }
}
```

#### 常量

类常量必须声明可见性。

```php
<?php

class ClassName
{
    public const VERSION = '1.0.0';
    protected const API_KEY = 'secret';
    private const INTERNAL = 'internal';
}
```

### 8.4 方法和函数

#### 可见性

所有方法必须声明可见性。

```php
<?php

class ClassName
{
    public function foo(): void
    {
        // ...
    }

    protected function bar(): int
    {
        return 1;
    }

    private function baz(): string
    {
        return 'baz';
    }
}
```

#### 方法参数

参数列表中，每个逗号前不得有空格，每个逗号后必须有一个空格。

```php
<?php

class ClassName
{
    public function foo(int $arg1, string $arg2, array $arg3 = []): void
    {
        // 方法体
    }
}
```

#### 参数列表拆分

参数列表可以拆分成多行，每个参数占一行。

```php
<?php

class ClassName
{
    public function aVeryLongMethodName(
        ClassTypeHint $arg1,
        &$arg2,
        array $arg3 = []
    ): void {
        // 方法体
    }
}
```

#### 构造器属性提升 (PHP 8.0+)

```php
<?php

class Point
{
    public function __construct(
        public float $x = 0.0,
        public float $y = 0.0,
        public float $z = 0.0,
    ) {
    }
}
```

#### 返回类型

返回类型声明中，冒号后必须有一个空格。

```php
<?php

function foo(): string
{
    return 'foo';
}

class ClassName
{
    public function bar(): int
    {
        return 1;
    }
}
```

#### 引用返回

```php
<?php

function &getReference(): array
{
    return $this->data;
}
```

---

## 9. 控制结构

### 9.1 通用规则

控制结构的通用规则：
- 控制结构关键字后必须有一个空格
- 开始括号后不得有空格
- 结束括号前不得有空格
- 结束括号和开始大括号之间必须有一个空格
- 结构体必须缩进一次
- 结束大括号必须在结构体后的下一行

### 9.2 if, elseif, else

```php
<?php

if ($expr1) {
    // if body
} elseif ($expr2) {
    // elseif body
} else {
    // else body
}
```

应该使用 `elseif` 而不是 `else if`，这样所有控制关键字看起来像单个词。

括号中的表达式可以拆分成多行。

```php
<?php

if (
    $expr1
    && $expr2
) {
    // if body
} elseif (
    $expr3
    && $expr4
) {
    // elseif body
}
```

### 9.3 switch, case

```php
<?php

switch ($expr) {
    case 0:
        echo 'First case, with a break';
        break;
    case 1:
        echo 'Second case, which falls through';
        // no break
    case 2:
    case 3:
    case 4:
        echo 'Third case, return instead of break';
        return;
    default:
        echo 'Default case';
        break;
}
```

括号中的表达式可以拆分成多行。

```php
<?php

switch (
    $expr1
    && $expr2
) {
    // 结构体
}
```

### 9.4 match (PHP 8.0+)

```php
<?php

$result = match ($expr) {
    0 => 'First case',
    1 => 'Second case',
    2, 3, 4 => 'Multiple cases',
    default => 'Default case',
};
```

多行 match 表达式。

```php
<?php

$result = match ($expr) {
    0 => 'First case',
    1 => 'Second case',
    default => 'Default case',
};
```

### 9.5 while, do while

```php
<?php

while ($expr) {
    // 结构体
}
```

```php
<?php

do {
    // 结构体
} while ($expr);
```

括号中的表达式可以拆分成多行。

```php
<?php

while (
    $expr1
    && $expr2
) {
    // 结构体
}

do {
    // 结构体
} while (
    $expr1
    && $expr2
);
```

### 9.6 for

```php
<?php

for ($i = 0; $i < 10; $i++) {
    // for 体
}
```

for 语句中的表达式可以拆分成多行。

```php
<?php

for (
    $i = 0;
    $i < 10;
    $i++
) {
    // for 体
}
```

### 9.7 foreach

```php
<?php

foreach ($iterable as $key => $value) {
    // foreach 体
}
```

### 9.8 try, catch, finally

```php
<?php

try {
    // try 体
} catch (FirstThrowableType $e) {
    // catch 体
} catch (OtherThrowableType | AnotherThrowableType $e) {
    // catch 体
} finally {
    // finally 体
}
```

---

## 10. 运算符

### 10.1 一元运算符

一元运算符和操作数之间不得有空格。

```php
<?php

$i++;
++$j;
!$value;
~$bits;
```

### 10.2 二元运算符

所有二元算术、比较、赋值、位运算、逻辑、字符串和类型运算符前后必须至少有一个空格。

```php
<?php

// 算术运算符
$result = $a + $b;
$result = $a - $b;
$result = $a * $b;
$result = $a / $b;
$result = $a % $b;
$result = $a ** $b;

// 比较运算符
if ($a == $b) { }
if ($a === $b) { }
if ($a != $b) { }
if ($a !== $b) { }
if ($a < $b) { }
if ($a > $b) { }
if ($a <= $b) { }
if ($a >= $b) { }
if ($a <=> $b) { }

// 赋值运算符
$a = $b;
$a += $b;
$a -= $b;
$a *= $b;
$a /= $b;

// 位运算符
$result = $a & $b;
$result = $a | $b;
$result = $a ^ $b;
$result = $a << $b;
$result = $a >> $b;

// 逻辑运算符
if ($a && $b) { }
if ($a || $b) { }
if ($a and $b) { }
if ($a or $b) { }
if ($a xor $b) { }

// 字符串运算符
$result = $a . $b;
$result .= $b;

// 类型运算符
if ($a instanceof $b) { }

// Null 合并运算符
$result = $a ?? $b;
$result ??= $b;
```

### 10.3 三元运算符

```php
<?php

$result = $condition ? $ifTrue : $ifFalse;
```

三元运算符可以拆分成多行。

```php
<?php

$result = $condition
    ? $ifTrue
    : $ifFalse;
```

嵌套三元运算符必须使用括号。

```php
<?php

$result = $condition1
    ? ($condition2 ? $value1 : $value2)
    : $value3;
```

---

## 11. 闭包

### 11.1 基本格式

闭包必须在 `function` 关键字后有一个空格，在 `use` 关键字前后各有一个空格。

```php
<?php

$closureWithArgs = function ($arg1, $arg2) {
    // 体
};

$closureWithArgsAndVars = function ($arg1, $arg2) use ($var1, $var2) {
    // 体
};

$closureWithArgsVarsAndReturn = function ($arg1, $arg2) use ($var1, $var2): bool {
    // 体
};
```

### 11.2 参数和变量列表拆分

参数列表和变量列表可以拆分成多行。

```php
<?php

$longArgs_noVars = function (
    $longArgument,
    $longerArgument,
    $muchLongerArgument
) {
    // 体
};

$noArgs_longVars = function () use (
    $longVar1,
    $longerVar2,
    $muchLongerVar3
) {
    // 体
};

$longArgs_longVars = function (
    $longArgument,
    $longerArgument,
    $muchLongerArgument
) use (
    $longVar1,
    $longerVar2,
    $muchLongerVar3
) {
    // 体
};
```

### 11.3 箭头函数 (PHP 7.4+)

```php
<?php

$arrow = fn($arg1, $arg2): int => $arg1 + $arg2;
```

箭头函数可以拆分成多行。

```php
<?php

$arrow = fn($arg1, $arg2): int =>
    $arg1 + $arg2 + $arg3;
```

---

## 12. 匿名类

### 12.1 基本格式

匿名类必须遵循与类和闭包相同的准则和原则。

```php
<?php

$instance = new class {
    // 类内容
};
```

### 12.2 实现接口

```php
<?php

$instance = new class extends \Foo implements \HandleableInterface {
    // 类内容
};
```

接口列表可以拆分成多行。

```php
<?php

$instance = new class extends \Foo implements
    \ArrayAccess,
    \Countable,
    \Serializable
{
    // 类内容
};
```

### 12.3 构造函数参数

```php
<?php

$instance = new class($arg1, $arg2) extends \Foo {
    // 类内容
};
```

构造函数参数可以拆分成多行。

```php
<?php

$instance = new class(
    $arg1,
    $arg2,
    $arg3
) extends \Foo implements
    \ArrayAccess,
    \Countable
{
    // 类内容
};
```

---

## 完整代码示例

### 示例 1: 完整的类定义

```php
<?php

declare(strict_types=1);

namespace Vendor\Package;

use Vendor\Package\{ClassA as A, ClassB, ClassC as C};
use Vendor\Package\SomeNamespace\ClassD as D;

use function Vendor\Package\{functionA, functionB, functionC};

use const Vendor\Package\{CONSTANT_A, CONSTANT_B, CONSTANT_C};

/**
 * 示例类
 */
class ClassName extends ParentClass implements
    \ArrayAccess,
    \Countable,
    \Serializable
{
    use FirstTrait;
    use SecondTrait;
    use ThirdTrait {
        ThirdTrait::bigTalk insteadof SecondTrait;
        SecondTrait::bigTalk as talk;
    }

    // 常量
    public const VERSION = '1.0.0';
    protected const API_KEY = 'secret';
    private const INTERNAL = 'internal';

    // 属性
    public string $publicProperty;
    protected int $protectedProperty;
    private array $privateProperty;

    /**
     * 构造函数
     */
    public function __construct(
        private string $name,
        private int $age,
        private readonly string $email,
    ) {
    }

    /**
     * 示例方法
     */
    public function sampleMethod(int $a, int $b = null): array
    {
        if ($a === $b) {
            bar();
        } elseif ($a > $b) {
            $foo->bar($arg1);
        } else {
            BazClass::bar($arg2, $arg3);
        }

        return [
            'result' => $a + $b,
        ];
    }

    /**
     * 静态方法
     */
    final public static function bar(): void
    {
        // 方法体
    }
}
```

### 示例 2: 枚举 (PHP 8.1+)

```php
<?php

declare(strict_types=1);

namespace App\Domain\Order;

enum OrderStatus: string
{
    case PENDING = 'pending';
    case PAID = 'paid';
    case PROCESSING = 'processing';
    case SHIPPED = 'shipped';
    case DELIVERED = 'delivered';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => '待支付',
            self::PAID => '已支付',
            self::PROCESSING => '处理中',
            self::SHIPPED => '已发货',
            self::DELIVERED => '已送达',
            self::CANCELLED => '已取消',
        };
    }

    public function canBeCancelled(): bool
    {
        return match ($this) {
            self::PENDING, self::PAID => true,
            default => false,
        };
    }
}
```

---

## 相关资源

- [PER Coding Style 官方规范](https://www.php-fig.org/per/coding-style/)
- [PSR-12 规范](https://www.php-fig.org/psr/psr-12/)
- [PHP-FIG 官网](https://www.php-fig.org/)
- [Laravel Pint](https://laravel.com/docs/pint)
- [PHP-CS-Fixer](https://github.com/PHP-CS-Fixer/PHP-CS-Fixer)

---

**注意**: 本文档是 PER Coding Style 的中文翻译和解读，旨在帮助中文开发者理解和应用该规范。完整的官方规范请参考 [PER Coding Style 官方文档](https://www.php-fig.org/per/coding-style/)。
