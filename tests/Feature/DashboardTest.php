<?php

use App\Models\Tag;
use App\Models\User;
use Inertia\Testing\Assert;

it('renders the dashboard with the user\'s tags', function () {
    $user = User::factory()->has(Tag::factory()->count(5))->create();

    $this
        ->login($user)->get(route('dashboard.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->has('tags', 5)
        );
});
