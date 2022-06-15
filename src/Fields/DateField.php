<?php

namespace Performing\Taskday\Date\Fields;

use Illuminate\Support\Carbon;
use Taskday\Base\Field;

class DateField extends Field
{
    public function getSorter() 
    {
        return null;
    }

    public static function findNextDate(Carbon $date, ?string $frequency = null): Carbon|null 
    {
        while ($date->lt(Carbon::now()->startOfDay())) {
            match ($frequency) {
                'days' => $date->addDays(1),
                'weeks' => $date->addWeeks(1),
                'months' => $date->addMonths(1),
                'years' => $date->addYears(1),
            };
        }
        
        return $date;
    }
}
