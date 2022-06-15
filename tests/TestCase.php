<?php

namespace Performing\Taskday\Date\Tests;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Performing\Taskday\Date\DateServiceProvider;
use Taskday\TaskdayServiceProvider;

class TestCase extends \Orchestra\Testbench\TestCase
{
    use DatabaseMigrations;

    protected function getPackageProviders($app)
    {
        return [
            DateServiceProvider::class,
            TaskdayServiceProvider::class,
        ];
    }
}
