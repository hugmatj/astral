<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Tag;

class TagsTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_a_new_tag()
    {
        $this
            ->login()
            ->post(route('tags.store'), ['name' => 'JavaScript'])
            ->assertRedirect(route('dashboard.index'));

        $this->assertDatabaseHas('tags', ['name' => 'JavaScript', 'user_id' => auth()->id(), 'sort_order' => 0]);
    }

    public function test_can_delete_a_tag()
    {
        $user = User::factory()->has(Tag::factory()->count(1))->create();

        $this->assertDatabaseCount('tags', 1);

        $this
            ->login($user)
            ->delete(route('tags.destroy', ['tag' => $user->tags()->first()->id]))
            ->assertRedirect(route('dashboard.index'));

        $this->assertDatabaseCount('tags', 0);
    }
}
