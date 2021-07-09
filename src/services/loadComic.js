function handleResponse(request, responseHandler, isJsonResponse) {
    if ((request.readyState == 4) &&
        (request.status == 200)) {
        if (isJsonResponse == undefined) {
            isJsonResponse = true;
        }
        if (isJsonResponse) {
            responseHandler(JSON.parse(request.responseText));
        }
        else {
            responseHandler(request.responseText);
        }
    }
}

export var sendGetRequest = 
    function(requestUrl, responseHandler, isJsonResponse) {
      var request = new XMLHttpRequest();
      request.onreadystatechange = 
        function() { 
          handleResponse(request, 
                         responseHandler,
                         isJsonResponse); 
        };
      request.open("GET", requestUrl, false);
      request.send(null); // for POST only
    };