(function() {

  var about_path = "snippets/about.html";
  
  // For the initial landing experience
  document.addEventListener("DOMContentLoaded", function() {
    // In the meantime show loading screen
    // utils.showLoading("#main_content");
    xkcd_utils.loadComic(xkcd_utils.latestXkcd);
    utils.registerServiceWorker();    
  });

  // Back Button Functionality
  document.querySelector("#backBtn").addEventListener("click", function(event) {
    xkcd_utils.goBackward();
  });

  // Forward button functionality
  document.querySelector("#forwdBtn").addEventListener("click", function(event) {
    xkcd_utils.goForward();
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

  // Loading the Likes page
  document.querySelector('#favourites_link').addEventListener("click", function(event) {
    likes_utils.loadLikesView();
    $("#bottomNav").hide();
  });

  // Loading the Home page
  document.querySelector("#nav-link-home").addEventListener("click", function(event) {
    xkcd_utils.loadComic(xkcd_utils.latestXkcd); 
    $("#bottomNav").show();   
  });

  document.querySelector("#brand-link-home").addEventListener("click", function(event) {
    xkcd_utils.loadComic(xkcd_utils.latestXkcd); 
    $("#bottomNav").show();
  });

  // Add favourite/unfavourite ability
  document.querySelector("#favBtn").addEventListener("click", function(event) {
    var comic_Check = xkcd_utils.current_comic_number;
    if(xkcd_utils.isFavourite(comic_Check)) {
      xkcd_utils.removeFavourite();
    }
    else {
      xkcd_utils.addFavourite();
    }
    // Update the icon
    xkcd_utils.updateFavouriteIcon();
  });

  // Favourite Button cosmetic effects
  $("#favBtn").hover(function() {
    this.style.backgroundImage = "url('assets/favoriteSmall.png')";
  }, function() {
    if(!xkcd_utils.isFavourite(xkcd_utils.current_comic_number)) {
      this.style.backgroundImage = "url('assets/favorite_off_small.png')";
    }
  });

  // Random Button effects
  $("#randomBtn").click(function() {
    var comic_number = Math.ceil(Math.random() * xkcd_utils.total_comics);
    // utils.showLoading('#main_content');
    xkcd_utils.loadComic(xkcd_utils.base_url + comic_number);
  });

  // Search Button setup
  $('#searchFormButton').click(function() {
    var input_string = document.getElementById("inputForm").value;
    // Validate number
    var num_to_search = parseInt(input_string, 10);
    if(num_to_search > 0 && num_to_search <= xkcd_utils.total_comics) {
      // Valid so load the comic
      // utils.showLoading('#main_content');
      xkcd_utils.loadComic(xkcd_utils.base_url + num_to_search);
    }
    else {
      alert("Input must be a number between 1 and " + xkcd_utils.total_comics);
    }
    // Clear the form
    document.getElementById("inputForm").value = '';
    // Hide the search bar
    $('#navbarSearchContent').collapse("hide");
  });

  $("#inputForm").keypress(function(e) {
    //Enter key
    if (e.which == 13) {
      return false;
    }
  });

  document.getElementById("main_content").addEventListener('swr', xkcd_utils.goBackward, false);
  document.getElementById("main_content").addEventListener('swl', xkcd_utils.goForward, false);
})(window);
