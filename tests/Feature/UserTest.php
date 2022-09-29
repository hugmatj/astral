<?php

use App\Models\Star;
use App\Models\Tag;
use Illuminate\Support\Facades\Http;

it('deletes all of the user\'s data when ther user deletes their account', function () {
    //Ensure revokeGrant() does not make an actual request
    Http::fake();

    $this->login();

    Star::factory(5)->create(['user_id' => auth()->id()]);
    Tag::factory(5)->create(['user_id' => auth()->id()]);

    expect(Star::all())->toHaveCount(5);
    expect(Tag::all())->toHaveCount(5);

    $this->delete(route('user.destroy'));

    expect(Star::all())->toHaveCount(0);
    expect(Tag::all())->toHaveCount(0);
});
