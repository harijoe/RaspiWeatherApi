
exports = module.exports = function (sp, io) {
// Serial port
  sp.on("data", function (rawData) {
    try {
      console.log('Receiving data');
      var data = JSON.parse(rawData);
      if (data['lumi']) {
        console.log('Emitting data');
        io.emit('arduino_emitting', data);
      }

    } catch (error) {
      console.log(error);
    }
  });
};