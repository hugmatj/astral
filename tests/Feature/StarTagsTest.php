<?php
use App\Models\User;
use App\Models\Tag;

beforeEach(function () {
    $this->user = User::factory()->has(Tag::factory()->count(1))->create();
    $this->tag = $this->user->tags()->first();

    $this->login($this->user);
});

it('can append a tag to a star', function () {
    $this->post(route('star.tags.store'), ['tagId' => $this->tag->id, 'repoId' => 25631]);

    $this->assertDatabaseHas('star_tag', ['tag_id' => $this->tag->id, 'star_id' => auth()->user()->stars()->first()->id]);
    $this->assertDatabaseCount('stars', 1);
});

it('will not create a duplicate entry if the same star is dropped on a single tag', function() {
    $this->post(route('star.tags.store'), ['tagId' => $this->tag->id, 'repoId' => 25631]);
    $this->assertDatabaseCount('stars', 1);

    $this->post(route('star.tags.store'), ['tagId' => $this->tag->id, 'repoId' => 25631]);
    $this->assertDatabaseCount('stars', 1);
});
