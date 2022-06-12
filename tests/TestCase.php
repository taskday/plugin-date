<?php

namespace Tests;

use Orchestra\Testbench\TestCase as Orchestra;
use Performing\Taskday\TaskdayCoreServiceProvider;

class TestCase extends Orchestra
{
    protected function getPackageProviders($app)
    {
        return [
            TaskdayCoreServiceProvider::class,
        ];
    }
}
