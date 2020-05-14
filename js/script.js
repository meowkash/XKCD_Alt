(function() {

  var about_path = "snippets/about.html";
  
  // For the initial landing experience
  document.addEventListener("DOMContentLoaded", function() {
    // In the meantime show loading screen
    utils.showLoading("#main_content");
    xkcd_utils.loadComic(xkcd_utils.latestXkcd);
    utils.registerServiceWorker();    
  });

  // Back Button Functionality
  document.querySelector("#backBtn").addEventListener("click", function(event) {
    if(xkcd_utils.current_comic_number > 0) {
      xkcd_utils.current_comic_number = xkcd_utils.current_comic_number - 1;
      utils.showLoading("#main_content");
      xkcd_utils.loadComic(xkcd_utils.base_url+xkcd_utils.current_comic_number); 
      $("#forwdBtn").disabled = false;
    }
    else {
      $("#backBtn").disabled = true;
    }
  });

  // Forward button functionality
  document.querySelector("#forwdBtn").addEventListener("click", function(event) {
    if(xkcd_utils.current_comic_number < xkcd_utils.total_comics) {
      xkcd_utils.current_comic_number += 1;
      utils.showLoading("#main_content");
      xkcd_utils.loadComic(xkcd_utils.base_url+xkcd_utils.current_comic_number); 
    }
    else {
      $("#forwdBtn").disabled = true;
    }
  });

  // Loading the About page
  document.querySelector("#about_link").addEventListener("click", function(event) {
    ajaxUtils.sendGetRequest(about_path, function(about_response) {
      var main_div = document.querySelector("#main_content");
      main_div.innerHTML = about_response;
    },
    false);
    // Hide the navbars
    $("#bottomNav").hide();
  });

  // Loading the Home page
  document.querySelector("#nav-link-home").addEventListener("click", function(event) {
    utils.showLoading("#main_content");
    xkcd_utils.loadComic(xkcd_utils.latestXkcd); 
    $("#bottomNav").show();   
  });

  document.querySelector("#brand-link-home").addEventListener("click", function(event) {
    utils.showLoading("#main_content");
    xkcd_utils.loadComic(xkcd_utils.latestXkcd); 
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
    xkcd_utils.checkFavourite();
  });

  // Favourite Button cosmetic effects
  $("#favBtn").hover(function() {
    this.style.backgroundImage = "url('assets/favoriteSmall.png')";
  }, function() {
    this.style.backgroundImage = "url('assets/favorite_off_small.png')";
    // So that once you leave hover, it'll still retain its old state
    xkcd_utils.checkFavourite();
  });

})(window);
