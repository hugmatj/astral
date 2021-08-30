<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Crypt;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'github_id',
        'username',
        'access_token',
        'scope',
        'avatar',
        'is_sponsor',
    ];

    protected $hidden = [
        'remember_token',
    ];

    protected $casts = [
        'settings' => 'array',
        'is_sponsor' => 'boolean',
    ];

    public const AVAILABLE_SETTINGS = ['show_language_tags', 'autosave_notes'];

    protected $attributes = [
        'settings' => '{"show_language_tags": true, "autosave_notes": true}',
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
        throw_if(!in_array($name, self::AVAILABLE_SETTINGS), new \Exception('Setting not available'));

        $this->settings = array_merge($this->settings, [$name => $value]);

        if ($save) {
            $this->save();
        }

        return $this;
    }

    public function getAccessTokenAttribute($value)
    {
        return $value ? Crypt::decryptString($value) : null;
    }

    public function setAccessTokenAttribute($value)
    {
        $this->attributes['access_token'] = Crypt::encryptString($value);
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

    public function isSponsor(): bool
    {
        return (bool) $this->is_sponsor;
    }

    public function isNotSponsor(): bool
    {
        return ! (bool) $this->is_sponsor;
    }

    public function setSponsorshipStatus(boolean $isSponsor): self
    {
        $this->update(['is_sponsor' => $isSponsor ? now() : null]);

        return $this;
    }

    public function tags()
    {
        return $this->hasMany(Tag::class);
    }

    public function stars()
    {
        return $this->hasMany(Star::class);
    }
}
