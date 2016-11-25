var handlerFactory = require('./Handler');
const fs = require('fs');
var parser = require('url');
var handlers = {};
/**
 * Limpar os handlers
 */
 exports.clear = function() {
  handlers = {};
}
/**
 * Registra uma rota
 * @param url
 * @param function
 */
 exports.register = function(url, method) {
  handlers[url] = handlerFactory.createHandler(method);
}
/**
 * Lê o arquivo de rotas em config/routes.js e as guarda na memoria
 */
exports.registerRoutes = function() {
  try {
    let routes = require('../config/routes.js').routes
    for (let route in routes) {
      handlers[route] = handlerFactory.createHandler(routes[route]);
    }
  } catch (e) {
    console.log(e);
  }
}
/**
 * Roteia um path para o respectivo handler
 * @param request
 */
exports.route = function(req) {
  url = parser.parse(req.url, true);
  var handler = handlers[url.pathname];
  if (!handler) handler = this.missing(req)
    return handler;
}
    //Se a rota não foi declarada, tenta ler do public
    exports.missing = function(req) {
      var url = parser.parse(req.url, true);
      var path = process.cwd() + '/frontend' + url.pathname
      try {
        data = fs.readFileSync(path);
        return handlerFactory.createHandler(function(req, res) {
          res.end(data);
        });
      } catch (e) {
        //Caso não encontre, redireciona para o index.
        return handlerFactory.createHandler(function(req, res) {
          res.writeHead(404, {
            'Content-Type': 'text/html'
          });
          var path = process.cwd() + '/frontend/404.html'
          data = fs.readFileSync(path);
          res.end(data)
          res.end();
        });
      }
    }