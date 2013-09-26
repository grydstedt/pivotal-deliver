var test        = require('tap').test,
    pivotal-deliver    = require(__dirname + '/../lib/index.js');

pivotal-deliver(function (err, obj) {
    test('functional', function (t) {
        t.equal(err, null, 'error object is null');
        t.end();
    });
});