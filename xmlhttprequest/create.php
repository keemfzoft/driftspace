<?php

header('Content-Type: application/json');

$name = $_POST['name'] ?? null;
$description = $_POST['description'] ?? null;

$response = [
    'received' => true,
    'item' => [
        'name' => $name,
        'description' => $description,
    ],
];

echo json_encode($response);
