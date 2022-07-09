<?php

namespace Performing\Taskday\Date;

use Taskday\Facades\Taskday;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Event;
use Performing\Taskday\Date\Console\Commands\CheckRecurringEventsCommand;
use Performing\Taskday\Date\Events\RecurringEvent;
use Performing\Taskday\Date\Listeners\SendNotificationForRecurringEvent;
use Performing\Taskday\Date\Events\DeadlineEvent;
use Performing\Taskday\Date\Listeners\SendDeadlineEventNotification;
use Performing\Taskday\Date\Listeners\SendRecurringEventNotification;

class DateServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     */
    public function boot()
    {
        // Register plugin
        Taskday::register(new DatePlugin, 'date');

        // Registering extra web routes
        Route::middleware('web')->group(__DIR__ . '/../routes/web.php');

        // Registering console commands
        $this->commands([ CheckRecurringEventsCommand::class ]);

        // Listen for event
        Event::listen(
            RecurringEvent::class,
            [SendRecurringEventNotification::class, 'handle']
        );

        Event::listen(
            DeadlineEvent::class,
            [SendDeadlineEventNotification::class, 'handle']
        );
    }

    /**
     * Register the application services.
     */
    public function register()
    {
        
        $this->app->singleton('performing.taskday.date.console.kernel', function($app) {
            $dispatcher = $app->make(\Illuminate\Contracts\Events\Dispatcher::class);
            return new \Performing\Taskday\Date\Console\Kernel($app, $dispatcher);
        });
        
        $this->app->make('performing.taskday.date.console.kernel');
    }
}
