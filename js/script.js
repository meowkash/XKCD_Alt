(function() {
  var home_path = "snippets/home.html";
  var about_path = "snippets/about.html";

  var month_array = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var run_number = 0;

  var xkcd_utils = {
    base_url: 'https://xkcd.now.sh/?comic=',
    latestXkcd: 'https://xkcd.now.sh/?comic=latest',
    total_comics: 0,
    current_comic_number: 0,
    favourite_comic: -1
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

  function checkFavourite(self) {
    if(self.current_comic_number == self.favourite_comic) {
      document.getElementById("favBtn").style.backgroundImage = "url('assets/favoriteSmall.png')";
    }
    else {
      document.getElementById("favBtn").style.backgroundImage = "url('assets/favorite_off_small.png')";
    }
  }
  
  function loadComic(url) {
    // Asynchronously load the xkcd JSON
    ajaxUtils.sendGetRequest(url, function(xkcd_response) {
      // Get and store the total number of comics in the first run
      if(run_number == 0) {
        xkcd_utils.total_comics = xkcd_response.num;
        run_number += 1;
        $("#forwdBtn").disabled = true;
      }
      xkcd_utils.current_comic_number = xkcd_response.num;
      
      // If the comic is a favourite, show it so
      checkFavourite(xkcd_utils);

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

  // Handling the back button
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
  });

  // Handling the forward button
  document.querySelector("#forwdBtn").addEventListener("click", function(event) {
    if(xkcd_utils.current_comic_number < xkcd_utils.total_comics) {
      xkcd_utils.current_comic_number += 1;
      showLoading("#main_content");
      loadComic(xkcd_utils.base_url+xkcd_utils.current_comic_number); 
    }
    else {
      $("#forwdBtn").disabled = true;
    }
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
    // Doesn't work with firefox
    $("#bottomNav").show(); 
  });

  document.querySelector("#brand-link-home").addEventListener("click", function(event) {
    showLoading("#main_content");
    loadComic(xkcd_utils.latestXkcd); 
    // Doesn't work with firefox
    $("#bottomNav").show();
  });

  // Add favourite/unfavourite ability
  document.querySelector("#favBtn").addEventListener("click", function(event) {
    // Toggle the state and update it
    if(xkcd_utils.favourite_comic!=xkcd_utils.current_comic_number) {
      xkcd_utils.favourite_comic = xkcd_utils.current_comic_number;
    }
    else {
      // Toggle it off
      xkcd_utils.favourite_comic = -1;
    }
    checkFavourite(xkcd_utils);
  });

  $("#favBtn").hover(function() {
    this.style.backgroundImage = "url('assets/favoriteSmall.png')";
  }, function() {
    this.style.backgroundImage = "url('assets/favorite_off_small.png')";
    // So that once you leave hover, it'll still retain its old state
    checkFavourite(xkcd_utils);
  });
  // Add bookmark/un-bookmark ability -- Left for version 1.5
})(window);
