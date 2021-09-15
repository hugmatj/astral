<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Astral is the best way to manage your starred repositories on GitHub using tags, notes and a powerful search feature.">
        <meta name="keywords" content="astral, stars, github, tags, app, organize">
        <title>Astral</title>
        <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
        <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96">
        {{-- <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="preload" as="style">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" media="print" onload="this.media='all'"> --}}
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
        @vite
        {{-- <link href="{{ mix('/css/app.css') }}" rel="stylesheet" /> --}}

        {{-- <script src="{{ mix('/js/app.js') }}" defer></script> --}}
    </head>
    <body class="antialiased">
        @inertia
    </body>
</html>
