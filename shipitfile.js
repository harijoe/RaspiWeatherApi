module.exports = function (shipit) {
  require('shipit-deploy')(shipit);
  require('shipit-shared')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/raspi-weather-api',
      repositoryUrl: 'https://github.com/harijoe/RaspiWeatherApi',
      ignores: ['.git'],
      keepReleases: 3,
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

  var restartForever = function() {
    return shipit.remote("cd " + shipit.releasePath + " && forever -l /var/log/WeatherApi/forever.log restart /var/www/WeatherApi/current/app.js")
  }

  shipit.on('published', function() {
    return npmInstall()
        .then(restartForever())
      .then(function () {
        shipit.log('Install Done!');
      });
  });

};
