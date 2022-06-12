<?php

namespace Performing\Taskday\Date;

use Taskday\Bundles\AssetBundle;

class DateAssetBundle extends AssetBundle
{
    function scripts(): array
    {
        return [
            __DIR__ . '/../dist/taskday-date.es.js'
        ];
    }

    function styles(): array
    {
        return [
            //
        ];
    }
}
