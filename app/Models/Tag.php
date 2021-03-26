<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Scopes\SortOrderScope;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected static function booted()
    {
        static::addGlobalScope(new SortOrderScope);

        static::creating(function ($tag) {
            $tag->sort_order = self::where('user_id', auth()->id())->count();
        });
    }
}
