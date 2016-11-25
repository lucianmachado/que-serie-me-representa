"use strict";
let server = require('../backend/lib/server').server

before(function(done) {
	server.listen(8000,done)
});
after(function(done) {
	server.close(done)
})
