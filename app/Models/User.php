<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'github_id',
        'username',
        'access_token',
        'scope',
        'avatar'
    ];

    protected $hidden = [
        'remember_token',
    ];

    protected $casts = [
        'settings' => 'array',
    ];

    protected $attributes = [
        'settings' => '{"github_sponsor": false, "show_language_tags": true, "autosave_notes": true}',
    ];

    public function readSetting(string $name, $default = null)
    {
        if (array_key_exists($name, $this->settings)) {
            return $this->settings[$name];
        }

        return $default;
    }

    public function writeSetting(string $name, $value, bool $save = true): self
    {
        $this->settings = array_merge($this->settings, [$name => $value]);

        if ($save) {
            $this->save();
        }

        return $this;
    }

    public function updateFromGitHubProfile($githubUser): self
    {
        $this->username = $githubUser->getNickname();
        $this->github_id = $githubUser->getId();

        if ($githubUser->getName()) {
            $this->name = $githubUser->getName();
        }
        $this->avatar = $githubUser->getAvatar();

        return $this;
    }

    public function getIsGitHubSponsorAttribute(): bool
    {
        return (bool)$this->readSetting('github_sponsor', false);
    }

    public function tags() {
        return $this->hasMany(Tag::class);
    }

    public function stars() {
        return $this->hasMany(Star::class);
    }
}
