const chokidar = require('chokidar');
const path = require('path');

module.exports = function (mockDirectory) {
  const watcher = chokidar.watch(mockDirectory);
  var re = new RegExp(mockDirectory);
  watcher.on('ready', function () {
    watcher.on('all', function () {
      console.log('Clearing ' + mockDirectory + ' module cache from server');
      Object.keys(require.cache).forEach(function (id) {
        if (re.test(id.replace(new RegExp('\\' + path.sep, 'g'), '/'))) {
          delete require.cache[id];
        }
      });
    });
  });

  return function (req, res, next) {
    require(mockDirectory)(req, res, next);
  };
};
