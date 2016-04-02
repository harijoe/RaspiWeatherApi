var fs = require('fs');
var AWS = require('aws-sdk');
var exec = require('child_process').exec;

const imgTmpPath = '/tmp/cam.jpg';
const targetFolder = '/tmp/cam/';

var takePhoto =  function () {
  console.log('Start take photo script');

  exec('raspistill -q 10 -vf -hf -o ' + imgTmpPath, function (err, stdout, stderr) {
    if (err) {
      throw err;
    } else {
      console.log('Photo taken');
      return sendImg();
    }
  });

  function sendImg() {
    var s3obj = new AWS.S3({params: {
      Bucket: 'home-juju-ire',
      Key: 'test',
      ACL: 'public-read',
    }});
    var body = fs.createReadStream(imgTmpPath);

    return s3obj.upload({Body: body}).on('httpUploadProgress', function (evt) {
      console.log(evt);
    }).send(function (err, data) {
      console.log(err, data);
      console.log('Photo sent');

      return data['Location'];
    });
  }
};

module.exports = takePhoto;