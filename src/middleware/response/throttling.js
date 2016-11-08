module.exports = function(client, request, response, next){
  
  // Throttled responses have an HTTP status code of 429. We also check to make
  // sure we haven't maxed out on throttled retries.
  if(response.statusCode === 429 && request.retries < client.maxThrottledRetries){
    
    // Throttled responses include a retry header that tells us how long to wait
    // until we retry the request
    var retryAfter = parseInt(response.getHeader('Retry'), 10) * 1000 || 1000;
    setTimeout(function(){
      client._execute(request, function(response){
        response.throttled = true;
        response.retries = ++request.retries;
        setTimeout(function(){
          request.callback(response);
        });
      });
    }, retryAfter);
    next(true);
  } else {
    next();
  }
};