<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Inertia\Testing\Assert;
use App\Models\User;
use App\Models\Tag;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_renders_the_dashboard_with_the_users_tags()
    {
        $user = User::factory()->has(Tag::factory()->count(5))->create();

        $this
            ->login($user)->get(route('dashboard.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->has('tags', 5)
            );
    }
}
