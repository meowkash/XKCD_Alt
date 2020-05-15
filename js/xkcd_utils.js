(function(global) {
  var xkcd_utils = {
    base_url: 'https://xkcd.now.sh/?comic=',
    latestXkcd: 'https://xkcd.now.sh/?comic=latest',
    total_comics: 0,
    current_comic_number: 0,
    fav_comic_number: [-1]
  };

  var month_array = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var run_number = 0;
  var home_path = "snippets/home.html";

  // Favourite Functionality

  // Load from cache, if available
  var isStored = localStorage['fav_comic_number'];
  if(isStored) {
    xkcd_utils.fav_comic_number = isStored;
  }

  xkcd_utils.updateFavouriteCache = function() {
    localStorage['fav_comic_number'] = this.fav_comic_number;
  }

  xkcd_utils.addFavourite = function(comic_num) {
    this.fav_comic_number.push(comic_num);
    this.updateFavouriteCache();
  }

  xkcd_utils.removeFavourite = function(comic_num) {
    for(var i=0; i<this.fav_comic_number.length; i++) {
      if(this.fav_comic_number[i] === comic_num) {
        this.fav_comic_number.splice(i, 1);
        break;
      }
    }
    this.updateFavouriteCache();
  }

  xkcd_utils.isFavourite = function(comic_num) {
    return this.fav_comic_number.includes(comic_num);
  }

  // Check if a comic is already a favourite or not and update icon accordingly
  xkcd_utils.updateFavouriteIcon = function() {
    if(this.isFavourite(xkcd_utils.current_comic_number)) {
      document.getElementById("favBtn").style.backgroundImage = "url('assets/favoriteSmall.png')";
    } 
    else {
      document.getElementById("favBtn").style.backgroundImage = "url('assets/favorite_off_small.png')";
    }
  }

  // Random comic functionality
  xkcd_utils.getRandomIcon = function() {
    var random_icon_number = Math.ceil(Math.random()*6);
    return random_icon_number;
  }

  xkcd_utils.setRandomIcon = function() {
    var icon_location = "url('assets/r" + this.getRandomIcon() + "_small.png')";
    document.getElementById("randomBtn").style.backgroundImage = icon_location;
  }

  xkcd_utils.loadComic = function(url) {
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
      xkcd_utils.updateFavouriteIcon();
      xkcd_utils.setRandomIcon();

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
        main_div.querySelector("#comic_date_num").innerHTML = "Comic #" + xkcd_response.num + "...\t \t Published on " + comic_date;
        main_div.querySelector("#comic_img").src = img_url;
      },
      false);
    },
    true);
  }

  global.xkcd_utils = xkcd_utils;
})(window);