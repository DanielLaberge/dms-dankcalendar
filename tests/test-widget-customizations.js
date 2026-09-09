// Exercise the actual QML JavaScript without opening a meeting or needing Qt.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const qml = fs.readFileSync(path.join(__dirname, '../DankCalendarWidget.qml'), 'utf8');
const calls = [];
const context = vm.createContext({
    hideEventTooltip() {},
    Quickshell: { execDetached: args => calls.push(['app', args]) },
    Qt: { openUrlExternally: url => calls.push(['url', url]) },
});
for (const name of ['selectHighlightedEvent', 'meetingLink', 'joinMeeting']) {
    const fn = qml.match(new RegExp('    function ' + name + '\\([^]*?\\n    \\}'));
    assert.ok(fn, 'Missing QML function: ' + name);
    vm.runInContext(fn[0], context);
}
const now = Date.parse('2026-09-09T16:00:00Z');
const ev = (uid, start, end, extra = {}) => ({uid,
    start: new Date(now + start * 60000).toISOString(),
    end: new Date(now + end * 60000).toISOString(), ...extra});
const past = ev('past', -60, -1), active = ev('active', -5, 20), next = ev('next', 30, 60);
assert.equal(context.selectHighlightedEvent([next, past, active], now), active);
assert.equal(context.selectHighlightedEvent([past, next], now), next);
assert.equal(context.selectHighlightedEvent([past], now), null);
assert.equal(context.selectHighlightedEvent([ev('day', -60, 60, {allDay:true}), next], now), next);
assert.equal(context.selectHighlightedEvent([ev('cancel', -5, 20, {status:'cancelled'}), next], now), next);
assert.equal(context.selectHighlightedEvent([ev('ended', -5, 0), next], now), next);
assert.equal(context.selectHighlightedEvent([active, ev('earlier', -10, 20)], now).uid, 'earlier');
context.joinMeeting('https://meet.google.com/abc-defg-hij?authuser=1');
assert.equal(calls[0][0], 'app');
assert.ok(calls[0][1].at(-1).endsWith('abc-defg-hij?authuser=1'));
context.joinMeeting('https://meet.google.com.example.org/example');
assert.equal(calls[1][0], 'url');
context.joinMeeting('javascript:alert(1)');
assert.equal(calls.length, 2);
console.log('Widget customization tests: ok');
