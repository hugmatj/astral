<?php

use App\Lib\Abilities;
use App\Models\Star;
use App\Models\Tag;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->has(Tag::factory()->count(1))->create();
    $this->tag = $this->user->tags()->first();

    $this->login($this->user);
});

it('can append a tag to a star', function () {
    $this->post(route('star.tags.store'), ['tagId' => $this->tag->id, 'repoIds' => [25631]]);

    $this->assertDatabaseHas('star_tag', ['tag_id' => $this->tag->id, 'star_id' => auth()->user()->stars()->first()->id]);
    expect(auth()->user()->stars()->where('repo_id', 25631)->exists())->toBeTrue();
});

it('will not create a duplicate entry if the same star is dropped on a single tag', function () {
    $this->post(route('star.tags.store'), ['tagId' => $this->tag->id, 'repoIds' => [25631]]);
    expect(auth()->user()->stars()->where('repo_id', 25631)->count())->toBe(1);

    $this->post(route('star.tags.store'), ['tagId' => $this->tag->id, 'repoIds' => [25631]]);
    expect(auth()->user()->stars()->where('repo_id', 25631)->count())->toBe(1);
});

it('can add a tag to multiple stars', function () {
    $this->post(route('star.tags.store'), ['tagId' => $this->tag->id, 'repoIds' => [25631, 49612]]);

    expect(auth()->user()->stars()->count())->toBe(2);
});

it('can sync multiple tags to one star', function () {
    $star = Star::factory()->create(['user_id' => auth()->id()]);

    $star->tags()->attach($this->tag->id);
    expect($star->tags()->count())->toBe(1);

    $res = $this->put(route('star.tags.update'), [
        'repoId' => $star->repo_id,
        'tags' => [
            ['name' => 'JavaScript'],
            ['name' => 'Vue'],
            ['name' => 'Laravel'],
            ['name' => $this->tag->name],
        ],
    ]);

    expect($star->fresh()->tags()->count())->toBe(4);

    $this->put(route('star.tags.update'), [
        'repoId' => $star->repo_id,
        'tags' => [],
    ]);

    expect($star->fresh()->tags()->count())->toBe(0);
});

it('prevents non-sponsors from going over the tag limit when syncing tags to a star', function () {
    $star = Star::factory()->create(['user_id' => auth()->id()]);
    // dump(auth()->user()->tags()->get());
    $this
        ->put(route('star.tags.update'), [
            'repoId' => $star->repo_id,
            'tags' => [
                ['name' => 'JavaScript'],
                ['name' => 'Vue'],
                ['name' => 'Laravel'],
                ['name' => 'Nuxt'],
                ['name' => 'Gatsby'],
            ],
        ])
        ->assertRedirect(route('dashboard.index'))
        ->assertSessionHas('sponsorship_required', Abilities::CREATE_TAG);

    expect(auth()->user()->tags()->disableCache()->count())->toBe(1);
    expect($star->fresh()->tags()->count())->toBe(0);
});

it('allows sponsors to over the tag limit when syncing tags to a star', function () {
    auth()->user()->update(['is_sponsor' => true]);

    $star = Star::factory()->create(['user_id' => auth()->id()]);

    $this
        ->put(route('star.tags.update'), [
            'repoId' => $star->repo_id,
            'tags' => [
                ['name' => 'JavaScript'],
                ['name' => 'Vue'],
                ['name' => 'Laravel'],
                ['name' => 'Nuxt'],
                ['name' => 'Gatsby'],
            ],
        ])
        ->assertRedirect(route('dashboard.index'));

    expect(auth()->user()->tags()->count())->toBe(6);
    expect($star->fresh()->tags()->count())->toBe(5);
});
