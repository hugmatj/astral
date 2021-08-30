<?php

it('saves the correct value to the user\'s settings', function() {
    $this->login();

    expect(auth()->user()->readSetting('autosave_notes'))->toBeTrue();

    $this->put(route('settings.update'), ['key' => 'autosave_notes', 'enabled' => false]);

    expect(auth()->user()->readSetting('autosave_notes'))->toBeFalse();

    $this->put(route('settings.update'), ['key' => 'autosave_notes', 'enabled' => true]);

    expect(auth()->user()->readSetting('autosave_notes'))->toBeTrue();
});

it("only allows valid keys to be passed", function () {
    $this
        ->login()
        ->put(route('settings.update'), ['key' => 'a_disallowed_key', 'enabled' => true])
        ->assertSessionHasErrors('key');

    expect(auth()->user()->readSetting('a_disallowed_key'))->toBeNull();
});

it("ensures the enabled value is a bool", function () {
    $this->login();

    expect(auth()->user()->readSetting('autosave_notes'))->toBeTrue();

    $this->put(route('settings.update'), ['key' => 'autosave_notes', 'enabled' => 'whoops'])
        ->assertSessionHasErrors('enabled');

    expect(auth()->user()->readSetting('autosave_notes'))->toBeTrue();
});
