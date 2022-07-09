<?php

namespace Performing\Taskday\Date\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DeadlineEvent
{
  use Dispatchable, InteractsWithSockets, SerializesModels;

  public function __construct(
    public int $cardId,
    public int $fieldId,
    public mixed $data
  ) {}
}
