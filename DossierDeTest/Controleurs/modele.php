<?php

function CONNECT()
{
    $base = mysqli_connect('localhost', 'root', '', 'giki');
    return $base;
}
