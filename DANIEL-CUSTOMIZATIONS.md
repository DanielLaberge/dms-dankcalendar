# Daniel's calendar customization branch

Upstream: https://github.com/arqueon/dms-dankcalendar
Fork: https://github.com/DanielLaberge/dms-dankcalendar
Branch: `codex/daniel-customizations`

This branch adds meeting-join buttons to the agenda and bar, highlights the active
timed event (otherwise the next), and routes Google Meet links to an installed web
app. The original upstream author's attribution and license are retained.

## Install

Keep this checkout outside DMS's managed plugin directory. Symlink it into that
directory as `danielCalendarAgenda`, enable **Dank Calendar Agenda (Daniel)**, and
replace the original agenda bar widget with this one. Disable the original widget.
Its distinct plugin ID avoids collisions with the upstream registry updater.
Copy any desired settings from the original plugin when switching IDs.

The Google Meet launcher currently targets `/opt/vivaldi/vivaldi`, `Profile 1`,
app ID `kjgfgldnnfoeklkmfkjfagphfepbbdan`. Adjust these to your installed Meet
desktop launcher on another machine. No calendar events or account credentials
are stored in this repository.

## Update deliberately

Keep `origin` pointed at the personal fork and `upstream` at the original repo.
With a clean working tree, fetch upstream, merge a chosen upstream release/ref
into this branch, resolve conflicts and run `bash tests/test-next-event.sh` and
`node tests/test-widget-customizations.js` (Node.js is only needed for this test).
Reload with `dms ipc call plugins reload danielCalendarAgenda` and verify the
agenda, highlighting and Join controls before pushing the tested result.
Use a separate test worktree when validating a larger update before deployment.

Do not use DMS's registry updater for this custom plugin. DMS v1.5.3 can delete
and re-clone a managed checkout when a pull fails; keeping the authoritative
checkout outside that directory protects the source. Upstream merges may still
require QML compatibility fixes. Once upstream supports these features, remove
the corresponding fork changes instead of maintaining duplicate implementations.
