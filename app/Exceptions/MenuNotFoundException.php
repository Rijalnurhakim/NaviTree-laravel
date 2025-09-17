<?php

namespace App\Exceptions;

use Exception;

class MenuNotFoundException extends Exception
{
    protected $message = 'Menu not found.';

    public function __construct($message = null, $code = 0, Exception $previous = null)
    {
        $message = $message ?: $this->message;
        parent::__construct($message, $code, $previous);
    }
}
