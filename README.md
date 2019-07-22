# Webpack DevServer Mock Middleware

## Create a directory for mock data

Server would watch the directory and would hot reload whenever whatever changed under the directory.

### Create entry file `index.js` contains configuration similar to the following:

```Javascript
  const config = {
    '/api/user/:id': (req, res, next) => {
      res.json({
        id: req.params.id,
        name: `user-${req.param.id}`
      })
    },
    '/api/users': [{
      id: 1,
      name: 'user-1'
    },{
      id: 2,
      name: 'user-2'
    }],
    '/api/login': request('./login'),// need to create login.js
    '/api/info': request('./info.json'), // need to create info.json
  };
  module.exports = (req, res, next) => {
    const { path } = req;
    const c = config[path];
    if (c) {
      if (typeof c === 'function') {
        return c.call(null,req, res, next);
      } else {
        res.json(c);
      }
    } else {
      next();
    }
  }
```

### Config Webpack DevServer `webpackage.config.js`:

```js
const path = require('path');
const mockMiddleware = require('mock-middleware');
module.exports = {
  devServer: {
    before: function(app, server) {
      // ...
      app.use(mockMiddleware(path.resolve('../mock')));
    },
  },
};
```
