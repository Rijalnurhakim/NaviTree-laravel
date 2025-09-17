<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Support\Facades\Log;

class MenuValidationException extends Exception
{
    protected $message = 'Menu validation failed.';

    public function __construct($message = null, $code = 0, Exception $previous = null)
    {
        $message = $message ?: $this->message;
        parent::__construct($message, $code, $previous);
    }

    public function report()
    {
        Log::error('Menu Validation Failed: ' . $this->getMessage());
    }
}
