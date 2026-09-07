<?php

namespace App\Enums;

enum AppointmentStatus: string
{
    case New = 'new';
    case Read = 'read';
    case Archived = 'archived';
}
