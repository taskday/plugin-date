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

    public static function findNextDate($data): Carbon|null 
    {
        $date = Carbon::createFromTimestamp($data->start / 1000);
        
        if (! $data->start) {
            return null;
        }

        while ($date->lt(Carbon::now()->startOfDay())) {
            match ($data->frequency) {
                'days' => $date->addDays(1),
                'weeks' => $date->addWeeks(1),
                'months' => $date->addMonths(1),
                'years' => $date->addYears(1),
            };
        }
        
        return $date;
    }
}
