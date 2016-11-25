/**
 * Cria um handler
 * @param function
 */
exports.createHandler = function (method) {
  return new Handler(method);
}

/**
 * Execupta uma função com seus argumentos ao receber uma request
 * @param function
 */
Handler = function(method) {
  this.process = function(req, res) {
    params = null;
    return method.apply(this, [req, res, params]);
  }
}