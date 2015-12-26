module.exports = function (shipit) {
  require('shipit-deploy')(shipit);
  require('shipit-shared')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/raspi-weather-api',
      repositoryUrl: 'https://github.com/harijoe/RaspiWeatherApi',
      ignores: ['.git'],
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

  shipit.on('published', function() {
    return npmInstall()
      .then(function () {
        shipit.log('Install Done!');
      });
  });

};
