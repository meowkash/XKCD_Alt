(function(global) {
  var xkcd_utils = {
    base_url: 'https://xkcd.now.sh/?comic=',
    latestXkcd: 'https://xkcd.now.sh/?comic=latest',
    total_comics: 0,
    current_comic_number: 0,
    current_comic_date: " ",
    current_comic_title: " ",
    current_comic_alt: " ",
    current_comic_img: " ",
    fav_comic_number: [],
    comic_date: [],
    comic_title: [],
    comic_alt: [],
    comic_img: []
  };


  var month_array = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var run_number = 0;
  var home_path = "snippets/home.html";
  
  // Load from cache, if available
  var isStored = localStorage['fav_comic_number'];
  if(isStored) {
    xkcd_utils.fav_comic_number = isStored;
  }

  xkcd_utils.updateFavouriteCache = function() {
    localStorage['fav_comic_number'] = JSON.stringify(this.fav_comic_number);
    localStorage['fav_comic_title'] = JSON.stringify(this.comic_title);
    localStorage['fav_comic_date'] = JSON.stringify(this.comic_date);
    localStorage['fav_comic_alt'] = JSON.stringify(this.comic_alt);
    localStorage['fav_comic_img'] = JSON.stringify(this.comic_img);
  }

  xkcd_utils.addFavourite = function() {
    this.fav_comic_number.push(this.current_comic_number);
    this.comic_date.push(this.current_comic_date);
    this.comic_title.push(this.current_comic_title);
    this.comic_alt.push(this.current_comic_alt); 
    this.comic_img.push(this.current_comic_img); 
    this.updateFavouriteCache();
  }

  xkcd_utils.removeFavourite = function() {
    for(var i=0; i<this.fav_comic_number.length; i++) {
      if(this.fav_comic_number[i] === this.current_comic_number) {
        this.fav_comic_number.splice(i, 1);
        this.comic_title.splice(i, 1);
        this.comic_date.splice(i, 1);
        this.comic_alt.splice(i, 1);
        this.comic_img.splice(i, 1);
        break;
      }
    }
    this.updateFavouriteCache();
  }

  xkcd_utils.isFavourite = function(comic_num) {
    return this.fav_comic_number.includes(comic_num);
  }

  // Check if a comic is already a favourite or not and update icon accordingly
  xkcd_utils.updateFavouriteIcon = function(response) {
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
      xkcd_utils.updateFavouriteIcon(xkcd_response);
      xkcd_utils.setRandomIcon();

      var comic_date = xkcd_response.day + " " + month_array[xkcd_response.month-1] + ", " + xkcd_response.year;
      var img_url = xkcd_response.img;
      var comic_title = xkcd_response.safe_title;
      var comic_alt = xkcd_response.alt;

      // Store for easy favourite functionality
      xkcd_utils.current_comic_title = comic_title;
      xkcd_utils.current_comic_alt = comic_alt;
      xkcd_utils.current_comic_img = img_url;
      xkcd_utils.current_comic_date = comic_date;

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

  xkcd_utils.goForward = function() {
    if(xkcd_utils.current_comic_number < xkcd_utils.total_comics) {
      xkcd_utils.current_comic_number += 1;
      utils.showLoading("#main_content");
      xkcd_utils.loadComic(xkcd_utils.base_url+xkcd_utils.current_comic_number); 
    }
    else {
      $("#forwdBtn").disabled = true;
    }
  }

  xkcd_utils.goBackward = function() {
    if(xkcd_utils.current_comic_number > 0) {
      xkcd_utils.current_comic_number = xkcd_utils.current_comic_number - 1;
      utils.showLoading("#main_content");
      xkcd_utils.loadComic(xkcd_utils.base_url+xkcd_utils.current_comic_number); 
      $("#forwdBtn").disabled = false;
    }
    else {
      $("#backBtn").disabled = true;
    }
  }

  /* Add functionality for favourites : store/load from localStorage 
  * The following data is to be cached : Image_urls, Date, Title, Number and Alt
  */
  
  global.xkcd_utils = xkcd_utils;
})(window);