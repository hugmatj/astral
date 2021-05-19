<?php

use App\Models\User;
use App\Models\Tag;

it('can create a new tag', function() {
    $this
        ->login()
        ->post(route('tags.store'), ['name' => 'JavaScript'])
        ->assertRedirect(route('dashboard.index'));

    expect(auth()->user()->tags()->whereName('JavaScript')->exists())->toBeTrue();
});

it('can delete a tag', function() {
    $user = User::factory()->has(Tag::factory()->count(1))->create();

    expect($user->tags()->count())->toBe(1);

    $this
        ->login($user)
        ->delete(route('tags.destroy', ['tag' => $user->tags()->first()->id]))
        ->assertRedirect(route('dashboard.index'));

    expect($user->tags()->count())->toBe(0);
});
