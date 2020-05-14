(function(global) {
  var xkcd_utils = {
    base_url: 'https://xkcd.now.sh/?comic=',
    latestXkcd: 'https://xkcd.now.sh/?comic=latest',
    total_comics: 0,
    current_comic_number: 0,
    favourite_comic: -1
  };

  var month_array = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var run_number = 0;
  var home_path = "snippets/home.html";

  // Check if a comic is already a favourite or not
  xkcd_utils.checkFavourite = function() {
    if(xkcd_utils.current_comic_number == xkcd_utils.favourite_comic) {
      document.getElementById("favBtn").style.backgroundImage = "url('assets/favoriteSmall.png')";
    }
    else {
      document.getElementById("favBtn").style.backgroundImage = "url('assets/favorite_off_small.png')";
    }
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
      xkcd_utils.checkFavourite();

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



  global.xkcd_utils = xkcd_utils;
})(window);