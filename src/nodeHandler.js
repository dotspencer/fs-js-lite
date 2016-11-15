/**
 * Request handler used in node.js
 */
 
var request = require('request');
 
module.exports = function(req, callback){
  request({
    url: req.url,
    method: req.method,
    headers: req.headers,
    body: req.body
  }, function(error, res, body){
    if(error){
      console.error(error.stack);
    }
    var response = createResponse(req, res, body);
    setTimeout(function(){
      callback(response);
    });
  });
};

/**
 * Convert an node response to a standard sdk response object
 * 
 * @param {Object} request {url, method, headers, retries}
 * @param {http.IncomingMessage} response
 * @param {String} body
 * @return {Object} response
 */
function createResponse(request, response, body){
  return {
    statusCode: response.statusCode,
    statusText: response.statusMsg,
    getHeader: function(name){
      return response.headers[name.toLowerCase()];
    },
    getAllHeaders: function(){
      return response.headers;
    },
    originalUrl: request.url,
    effectiveUrl: request.url,
    redirected: false,
    requestMethod: request.method,
    requestHeaders: request.headers,
    body: body,
    retries: 0,
    throttled: false
  };
}