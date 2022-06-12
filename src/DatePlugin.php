<?php

namespace Performing\Taskday\Date;

use Taskday\Bundles\AssetBundle;
use Taskday\Base\Plugin;
use Performing\Taskday\Date\Fields\DateField;

class DatePlugin extends Plugin
{
    public string $handle = 'date';

    public string $description;

    function bundle(): ?AssetBundle
    {
        return new DateAssetBundle;
    }

    public function fields(): array
    {
        return [
            new DateField()
        ];
    }
}
