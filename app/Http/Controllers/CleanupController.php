<?php

namespace App\Http\Controllers;

use App\Lib\StarsJanitor;
use App\Lib\Sponsorship;

class CleanupController extends Controller
{
    protected $janitor;
    protected $sponsorship;

    public function __construct(StarsJanitor $janitor, Sponsorship $sponsorship) {
        $this->janitor = $janitor;
        $this->sponsorship = $sponsorship;
    }

    public function index()
    {
        $this->janitor->deleteEmptyStars();

        if (config('app.check_for_sponsorship')) {
            $this->sponsorship->updateUserSponsorshipStatus();
        }

        return redirect()->route('dashboard.index');
    }
}
