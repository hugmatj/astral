<?php

namespace App\Http\Controllers;

use App\Models\Star;
use Illuminate\Http\Request;

class StarTagsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $repoIds = $request->input('repoIds');
        $tagId = $request->input('tagId');

        foreach($repoIds as $repoId) {
            $star = auth()->user()->stars()->firstOrCreate(['repo_id' => $repoId]);
            $star->tags()->syncWithoutDetaching([$tagId]);
        }

        return redirect()->route('dashboard.index');
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Star  $star
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Star $star)
    {
        $star = auth()->user()->stars()->firstOrCreate(['repo_id' => $star->repo_id]);
        $ids = [];

        tap($request->input('tags'), function ($tags) use($star, $ids) {
            if (empty($tags)) {
                $star->tags()->sync([]);
            } else {
                foreach($tags as $tag) {
                    $tag = auth()->user()->tags()->firstOrCreate(['name' => $tag['name']]);
                    $ids[] = $tag->id;
                }
                $star->tags()->sync($ids, true);
            }
        });

        return redirect()->route('dashboard.index');
    }

}
