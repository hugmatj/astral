<?php

use App\Lib\Abilities;
use App\Models\Tag;
use App\Models\User;

it('can create a new tag', function () {
    $this
        ->login()
        ->post(route('tags.store'), ['name' => 'JavaScript'])
        ->assertRedirect(route('dashboard.index'));

    expect(auth()->user()->tags()->whereName('JavaScript')->exists())->toBeTrue();
});

it('can delete a tag', function () {
    $user = User::factory()->has(Tag::factory()->count(1))->create();

    expect($user->tags()->count())->toBe(1);

    $this
        ->login($user)
        ->delete(route('tags.destroy', ['tag' => $user->tags()->first()->id]))
        ->assertRedirect(route('dashboard.index'));

    expect($user->tags()->count())->toBe(0);
});

it('prevents non-sponsors from going over the tag limit when creating a tag', function () {
    $user = User::factory()->has(Tag::factory()->count(5))->create();

    $this
        ->login($user)
        ->post(route('tags.store'), ['name' => 'JavaScript'])
        ->assertRedirect(route('dashboard.index'))
        ->assertSessionHas('sponsorship_required', Abilities::CREATE_TAG);

    expect(auth()->user()->tags()->whereName('JavaScript')->doesntExist());
});

it('allows sponsors to over the tag limit when creating a tag', function () {
    $user = User::factory()->has(Tag::factory()->count(5))->create(['is_sponsor' => true]);

    $this
        ->login($user)
        ->post(route('tags.store'), ['name' => 'JavaScript'])
        ->assertRedirect(route('dashboard.index'));

    expect(auth()->user()->tags()->whereName('JavaScript')->exists());
    expect(auth()->user()->tags()->count())->toBe(6);
});
