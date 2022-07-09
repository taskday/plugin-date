<?php

namespace Performing\Taskday\Date\Notifications;

use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Taskday\Models\Card;
use Taskday\Notifications\Notification;
use Taskday\Notifications\PendingNotification;

class DeadlineEventNotification extends Notification implements ShouldBroadcast
{
    public $card;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(Card $card)
    {
        $this->card = $card;
    }

    /**
     * Return the web push notification message.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toPendingNotification(): PendingNotification
    {
        return (new PendingNotification)
            ->title('"' . $this->card->title  . '"' . 'is due today')
            ->body('')
            ->action('View', route('cards.show', [$this->card]));
    }
}
