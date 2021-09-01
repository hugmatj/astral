<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Laravel</title>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
        <link href="{{ mix('/css/app.css') }}" rel="stylesheet" />
    </head>
    <body class="antialiased">
        <div class="flex items-center justify-center w-screen h-screen">
        @auth
        <div class="text-center">
            <p class="mb-4">Hello {{ auth()->user()->username }}!</p>
            <a href="/" class="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Go to Dashboard</a>
        </div>
        @else
        <a href="/auth/github" class="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Sign In With GitHub</a>
        @endauth
        </div>

    </body>
</html>
