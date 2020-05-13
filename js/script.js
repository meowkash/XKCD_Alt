(function() {
  var home_path = "snippets/home.html";
  var about_path = "snippets/about.html";

  var month_array = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var run_number = 0;

  var xkcd_utils = {
    base_url: 'https://xkcd.now.sh/?comic=',
    latestXkcd: 'https://xkcd.now.sh/?comic=latest',
    total_comics: 0,
    current_comic_number: 0
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

  function loadComic(url) {
    // Asynchronously load the xkcd JSON
    ajaxUtils.sendGetRequest(url, function(xkcd_response) {
      // Set the maximum number of comics as well
      if(run_number == 0) {
        // For the first run only
        xkcd_utils.total_comics = xkcd_response.num;
        run_number += 1;
        $("#forwdBtn").disabled = true;
      }
      xkcd_utils.current_comic_number = xkcd_response.num;
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
  }

  // For the initial landing experience
  document.addEventListener("DOMContentLoaded", function() {
    // In the meantime show loading screen
    showLoading("#main_content");
    loadComic(xkcd_utils.latestXkcd);    
  });

  // Handling the back/forward buttons
  document.querySelector("#backBtn").addEventListener("click", function(event) {
    if(xkcd_utils.current_comic_number > 0) {
      xkcd_utils.current_comic_number = xkcd_utils.current_comic_number - 1;
      showLoading("#main_content");
      loadComic(xkcd_utils.base_url+xkcd_utils.current_comic_number); 
      $("#forwdBtn").disabled = false;
    }
    else {
      $("#backBtn").disabled = true;
    }
    console.log(xkcd_utils);
  });

  document.querySelector("#forwdBtn").addEventListener("click", function(event) {
    if(xkcd_utils.current_comic_number < xkcd_utils.total_comics) {
      xkcd_utils.current_comic_number += 1;
      showLoading("#main_content");
      loadComic(xkcd_utils.base_url+xkcd_utils.current_comic_number); 
    }
    else {
      $("#forwdBtn").disabled = true;
    }
    console.log(xkcd_utils);
  });

  // Load the About page
  document.querySelector("#about_link").addEventListener("click", function(event) {
    ajaxUtils.sendGetRequest(about_path, function(about_response) {
      var main_div = document.querySelector("#main_content");
      main_div.innerHTML = about_response;
    },
    false);
    // Hide the lower navbar
    $("#bottomNav").hide();
  });

  // Load the Home page
  document.querySelector("#nav-link-home").addEventListener("click", function(event) {
    showLoading("#main_content");
    loadComic(xkcd_utils.latestXkcd);  
  });

})(window);