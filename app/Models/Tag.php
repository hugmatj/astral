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
        'sort_order'
    ];

    protected $hidden = ['pivot'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function stars()
    {
        return $this->belongsToMany(Star::class)->withTimestamps();
    }

    public function scopeWithStarCount($query)
    {
        return $query->withCount('stars');
    }

    protected static function booted()
    {
        static::addGlobalScope(new SortOrderScope);

        static::creating(function (Tag $tag) {
            $tag->sort_order = self::where('user_id', auth()->id())->count();
        });

        static::deleted(function(Tag $tag) {
            $tag->stars()->each(function (Star $star) use ($tag) {
                $star->tags()->detach($tag->id);

                if ($star->fresh()->isOrphan()) {
                    $star->delete();
                }
            });
        });
    }
}
