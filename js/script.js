(function() {
  var home_path = "snippets/home.html";
  
  var month_array = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var xkcd_utils = {
    base_url: 'https://xkcd.now.sh/?comic',
    currentXkcd: 'https://xkcd.now.sh/?comic=latest',
    total_comics: 0
  };

  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };
  
  // Show loading icon inside element identified by 'selector'.
  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
      if(window.matchMedia('(max-width: 600px)').matches) {
        html += "<img src='assets/loading_big_dark.png' width='300px' height='322px'></div>";
      }
      else {
        html += "<img src='assets/loading_big_dark.png' width='450px' height='484px'></div>";
      }
    } 
    else {
      if(window.matchMedia('(max-width: 600px)').matches) {
        html += "<img src='assets/loading_big.png' width='300px' height='322px'></div>";
      }
      else {
        html += "<img src='assets/loading_big.png' width='450px' height='484px'></div>";
      }
    }
    insertHtml(selector, html);
  };

  document.addEventListener("DOMContentLoaded", function() {
    // In the meantime show loading screen
    showLoading("#main_content");

    // Asynchronously load the xkcd JSON
    ajaxUtils.sendGetRequest(xkcd_utils.currentXkcd, function(xkcd_response) {
      // Set the maximum number of comics as well
      xkcd_utils.total_comics = xkcd_response.num;
      var comic_date = xkcd_response.day + " " + month_array[xkcd_response.month-1] + ", " + xkcd_response.year;
      var img_url = xkcd_response.img;
      var comic_title = xkcd_response.safe_title;
      var comic_alt = xkcd_response.alt;
      // Asynchronously load the HTML snippet
      ajaxUtils.sendGetRequest(home_path, function(html_response) {
        var main_div = document.querySelector("#main_content");
        main_div.innerHTML = html_response;
        main_div.querySelector("#comic_title").innerHTML = comic_title;
        main_div.querySelector("#comic_alt").innerHTML = comic_alt;
        main_div.querySelector("#comic_date").innerHTML = comic_date;
        main_div.querySelector("#comic_img").src = img_url;
      },
      false);
    },
    true);
  });


})(window);