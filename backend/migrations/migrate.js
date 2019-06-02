var orm         = require("orm");
var MigrateTask = require("migrate-orm2");

var connectionString = "mysql://devuser@localhost/ILMOV2";

orm.connect(connectionString, function (err, connection) {
  if (err) throw err;
  var task = new MigrateTask(connection.driver);

  //task.generate("add_phone", function(err, result){});
  task.up(function(e,r){});
});