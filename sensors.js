var debug = require('debug')('serial-port');

exports = module.exports = function (sp, db, io) {
// Serial port
  debug("Serial port imported");
  sp.on("data", function (rawData) {
    try {
      debug("Receiving data from sensors");
      var data = JSON.parse(rawData);
      if (data['lumi']) {
        io.emit('arduino_emitting', data);
      }

    } catch (error) {
      debug(error);
    }
  });
};

function insertIntoDB(data, db) {
  debug("Storing data in database");
  var collection = db.get('sensorsCollection');
  collection.insert({
    "t": data.t,
    "lumi": data.lumi/40, // /40 to scale with other values
    "h": data.h,
    "f": data.f,
    "hi": data.hi,
    "date": new Date()
  });
}
