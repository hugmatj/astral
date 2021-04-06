<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Socialite;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth', ['except' => ['redirectToProvider', 'handleProviderCallback']]);
    }

    public function redirectToProvider(Request $request)
    {
        $scope = $request->input('scope', 'read:user');
        $request->session()->put(['auth_scope' => $scope]);

        return Socialite::driver('github')
            ->setScopes([$scope])
            ->redirect();
    }

    public function handleProviderCallback(Request $request)
    {
        $scope = $request->session()->pull('auth_scope', 'read:user');

        $githubUser = Socialite::driver('github')->user();

        $user = User::firstOrNew(['github_id' => $githubUser->getId()]);

        if (is_null($user->access_token) || $user->scope !== $scope) {
            $user->access_token = $githubUser->token;
            $user->scope = $scope;
        }

        $user->updateFromGitHubProfile($githubUser);

        $user->save();

        auth()->login($user, true);

        return redirect()->route('dashboard.index');
    }
}
