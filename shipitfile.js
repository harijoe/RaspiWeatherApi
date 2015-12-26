module.exports = function (shipit) {
  require('shipit-deploy')(shipit);
  require('shipit-shared')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/raspi-weather-api',
      repositoryUrl: 'https://github.com/harijoe/RaspiWeatherApi',
      ignores: ['.git', 'node_modules'],
      keepReleases: 3,
      shallowClone: true,
      shared: {
        overwrite: true,
        dirs: [
          'node_modules'
        ]
      }
    },
    prod: {
      servers: 'pi@verson',
      branch: 'master',
      deployTo: '/var/www/WeatherApi'
    }
  });

  var npmInstall = function () {
    return shipit.remote("cd " + shipit.releasePath + " && npm install");
  };

  var gulpBuild = function () {
    return shipit.remote("cd " + shipit.releasePath + " && ./node_modules/.bin/gulp");
  };

  var foreverStart = function() {
    return shipit.remote("cd " + shipit.releasePath + " && ./node_modules/.bin/forever start app.js");
  };

  shipit.on('shared:link:files', function() {
    return shipit.start('install');
  });

  shipit.blTask('install', function() {
    return npmInstall()
      .then(gulpBuild)
      .then(foreverStart)
      .then(function () {
        shipit.log('Install Done!');
      });
  });
};
