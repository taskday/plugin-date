<?php
namespace Performing\Taskday\Date\Console;

use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Support\Carbon;
use Performing\Taskday\Date\Events\RecurringEvent;
use Performing\Taskday\Date\Fields\DateField;
use Taskday\Models\Card;
use Taskday\Models\CardField;

class Kernel extends ConsoleKernel
{
    /**
     * Define the package's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
      $schedule->command(CheckRecurringEventsCommand::class)->dailyAt('08:00');
    }
}