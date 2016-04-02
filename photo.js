var fs = require('fs');
var AWS = require('aws-sdk');
var exec = require('child_process').exec;

const imgTmpPath = '/tmp/cam.jpg';

var takePhoto =  function (io) {

  console.log('Start take photo script');

  exec('raspistill -q 10 -w 1920 -h 1080 -o ' + imgTmpPath, function (err, stdout, stderr) {
    if (err) {
      console.log ('!Aborting photo taking')
    } else {
      console.log('Photo taken');
      sendImg();
    }
  });


  function sendImg() {
    var s3obj = new AWS.S3({params: {
      Bucket: 'home-juju-ire',
      Key: 'cam.jpg',
      ACL: 'public-read',
    }});
    var body = fs.createReadStream(imgTmpPath);

    s3obj.upload({Body: body}).on('httpUploadProgress', function (evt) {
      console.log(evt);
    }).send(function (err, data) {
      console.log(err, data);
      console.log('Photo sent');

      io.emit('photo_ready', data['Location']);
    });
  }
};

module.exports = takePhoto;