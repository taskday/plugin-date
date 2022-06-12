<?php

use Illuminate\Support\Carbon;
use Performing\Taskday\Date\Fields\DateField;

test('example', function () {
    $data = json_decode('{"version":1,"start":1654387200000,"ending":null,"frequency":"weeks"}');

    expect($data->version)->toBe(1);
    expect(Carbon::createFromTimestamp($data->start / 1000)->toDateString())->toBe('2022-06-05');
    expect(DateField::findNextDate($data)->toDateString())->toBe('2022-06-12');
});
