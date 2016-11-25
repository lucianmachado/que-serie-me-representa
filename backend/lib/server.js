const http = require('http')
const router = require('./router')

//Le todas as rotas do config/routes e registra as rotas com seus devidos métodos
router.registerRoutes()
/**
 * Exporta o server com o CORS habilitado e o handler encapsulado.
 */
module.exports.server = http.createServer(function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.setHeader('Access-Control-Allow-Headers', '*');

    handler = router.route(req);
    handler.process(req, res);
});