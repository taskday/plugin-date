<?php

namespace Performing\Taskday\Date\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Performing\Taskday\Date\Events\RecurringEvent;
use Performing\Taskday\Date\Fields\DateField;
use Taskday\Models\CardField;
use Performing\Taskday\Date\Events\DeadlineEvent;

class CheckRecurringEventsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'taskday-date:check-recurring-events';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for recurring events and create cards if necessary';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->info('Checking for recurring events...');

        CardField::query()
            ->whereHas('field', function ($fields) {
                $fields->where('type', DateField::type());
            })
            ->cursor()
            ->each(function (CardField $field) {
                $data = json_decode($field->value);

                if (!$field->value || !$data) {
                    return;
                }

                if ($data->start === 0) {
                    return;
                }

                $date = Carbon::createFromTimestamp($data->start / 1000);

                if ($data->frequency) {
                    $date = DateField::findNextDate($date, $data->frequency);
                    if ($date->toDateString() == Carbon::now()->toDateString()) {
                        event(new RecurringEvent($field->card_id, $field->field_id, $data));
                    }
                } else {
                    event(new DeadlineEvent($field->card_id, $field->field_id, $data));
                }
            });

        $this->info('Done!');
    }
}
