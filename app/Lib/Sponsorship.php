<?php

namespace App\Lib;

use GitHub;

class Sponsorship
{
    public function updateUserSponsorshipStatus()
    {
        abort_unless(auth()->check(), 403);

        $query = '{user(login: "syropian") { isSponsoredBy(accountLogin: "'.auth()->user()->username.'") }}';

        $client = GitHub::getFactory()->make([
            'token'  => auth()->user()->access_token,
            'method' => 'token',
        ]);

        $result = $client->api('graphql')->execute($query);

        auth()->user()->setSponsorshipStatus((bool)$result['data']['user']['isSponsoredBy']);
    }
}
