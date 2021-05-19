<?php
use App\Models\User;
use App\Models\Tag;

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

it('will not create a duplicate entry if the same star is dropped on a single tag', function() {
    $this->post(route('star.tags.store'), ['tagId' => $this->tag->id, 'repoIds' => [25631]]);
    expect(auth()->user()->stars()->where('repo_id', 25631)->count())->toBe(1);

    $this->post(route('star.tags.store'), ['tagId' => $this->tag->id, 'repoIds' => [25631]]);
    expect(auth()->user()->stars()->where('repo_id', 25631)->count())->toBe(1);
});

it('can add a tag to multiple stars', function() {
    $this->post(route('star.tags.store'), ['tagId' => $this->tag->id, 'repoIds' => [25631, 49612]]);

    expect(auth()->user()->stars()->count())->toBe(2);
});
