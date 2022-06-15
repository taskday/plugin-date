<?php

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Event;
use Performing\Taskday\Date\Events\RecurringEvent;
use Performing\Taskday\Date\Fields\DateField;
use Taskday\Models\Card;
use Taskday\Models\Field;

it('can find the next date', function () {
    $data = json_decode('{"version":1,"start":1654587011000,"ending":null,"frequency":"weeks"}');

    expect($data->version)->toBe(1);
    expect(Carbon::createFromTimestamp($data->start / 1000)->toDateString())->toBe('2022-06-07');
    expect(DateField::findNextDate(Carbon::createFromTimestamp($data->start / 1000), $data->frequency)->toDateString())->toBe('2022-06-14');
});

it('should fire the recurring event', function () {
    Event::fake();

    $data = json_decode('{ "version": 1, "start": 1654587011000, "ending": null, "frequency": null }');

    $card = Card::factory()->create();
    $field = Field::factory()->create([ 'type' => 'date', 'handle' => 'date' ]);
    $card->setCustom($field, $data);
    
    $this->artisan('taskday-date:check-recurring-events');

    Event::assertDispatched(RecurringEvent::class);
});
