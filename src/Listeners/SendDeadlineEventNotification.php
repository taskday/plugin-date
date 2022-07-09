<?php

namespace Performing\Taskday\Date\Listeners;

use Performing\Taskday\Date\Notifications\RecurringEventNotification;
use Taskday\Models\Card;
use Performing\Taskday\Date\Events\DeadlineEvent;

class SendDeadlineEventNotification
{
    public function handle(DeadlineEvent $event)
    {
      $card = Card::find($event->cardId);

      $card->project->sharedUsers->each(function ($user) use ($card) {
        $user->notify(new RecurringEventNotification($card));
      });
    }
}
