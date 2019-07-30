import * as chokidar from 'chokidar';
import * as path from 'path';

import { Request, Response, NextFunction } from 'express';

export default function(
  mockDirectory: string,
): (req: Request, res: Response, next: NextFunction) => void {
  const watcher = chokidar.watch(mockDirectory);
  var re = new RegExp(mockDirectory);
  watcher.on('ready', function() {
    watcher.on('all', function() {
      console.log('Clearing ' + mockDirectory + ' module cache from server');
      // remove all require caches under mock dir
      Object.keys(require.cache).forEach(function(id) {
        if (re.test(id.replace(new RegExp('\\' + path.sep, 'g'), '/'))) {
          delete require.cache[id];
        }
      });
    });
  });

  return function(req: Request, res: Response, next: NextFunction) {
    try {
      let filePath = req.path.substr(1);
      const v = require(filePath);
      if (typeof v === 'function') {
        v.call(null, req, res, next);
        return;
      } else if (v) {
        res.json(v);
        return;
      }
    } catch {}
    require(mockDirectory)(req, res, next);
  };
}
