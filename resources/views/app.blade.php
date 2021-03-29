<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Astral</title>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="preload" as="style">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
        <link href="{{ mix('/css/app.css') }}" rel="stylesheet" />

        <script src="{{ mix('/js/app.js') }}" defer></script>
    </head>
    <body class="antialiased">
        @inertia
    </body>
</html>
