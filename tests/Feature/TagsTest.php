<?php

use App\Models\User;
use App\Models\Tag;

it('can create a new tag', function() {
    $this
    ->login()
    ->post(route('tags.store'), ['name' => 'JavaScript'])
    ->assertRedirect(route('dashboard.index'));

    $this->assertDatabaseHas('tags', ['name' => 'JavaScript', 'user_id' => auth()->id(), 'sort_order' => 0]);
});

it('can delete a tag', function() {
    $user = User::factory()->has(Tag::factory()->count(1))->create();

    $this->assertDatabaseCount('tags', 1);

    $this
        ->login($user)
        ->delete(route('tags.destroy', ['tag' => $user->tags()->first()->id]))
        ->assertRedirect(route('dashboard.index'));

    $this->assertDatabaseCount('tags', 0);
});
