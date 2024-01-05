const restana = require('restana')();

const router = restana.newRouter();

require('./modules/users/routes/users.routes')(router);
require('./modules/notes/routes/notes.routes')(router);

module.exports = router;