<?php
use App\Models\User;
use App\Models\Tag;

it('can append a tag to a star', function () {
    $user = User::factory()->has(Tag::factory()->count(1))->create();
    $tag = $user->tags()->first();

    $this
        ->login($user)
        ->post(route('star.tags.store'), ['tagId' => $tag->id, 'repoId' => 25631]);

    $this->assertDatabaseHas('star_tag', ['tag_id' => $tag->id, 'star_id' => auth()->user()->stars()->first()->id]);
    $this->assertDatabaseCount('stars', 1);
});
