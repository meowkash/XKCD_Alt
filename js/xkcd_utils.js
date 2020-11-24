(function (global) {
  var xkcd_utils = {
    base_url: 'https://xkcd.now.sh/?comic=',
    latestXkcd: 'https://xkcd.now.sh/?comic=latest',
    total_comics: 0,
    current_comic_number: 0,
    current_comic_date: " ",
    current_comic_title: " ",
    current_comic_alt: " ",
    current_comic_img: " ",
    current_comic_url: " ",
    fav_comic_number: [],
    comic_url: [],
    comic_title: [],
    comic_alt: [],
    comic_img: []
  };

  var isExplainMode = false;

  var month_array = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var run_number = 0;
  var home_path = "snippets/home.html";

  // Load from cache, if available
  xkcd_utils.loadFromCache = function () {
    var isStored = localStorage.getItem('fav_comic_number');
    if (isStored) {
      xkcd_utils.fav_comic_number = JSON.parse(isStored);
      xkcd_utils.comic_url = JSON.parse(localStorage.getItem('fav_comic_url'));
      xkcd_utils.comic_title = JSON.parse(localStorage.getItem('fav_comic_title'));
      xkcd_utils.comic_alt = JSON.parse(localStorage.getItem('fav_comic_alt'));
      xkcd_utils.comic_img = JSON.parse(localStorage.getItem('fav_comic_img'));
    }
  }

  xkcd_utils.updateFavouriteCache = function () {
    localStorage.setItem('fav_comic_number', JSON.stringify(this.fav_comic_number));
    localStorage.setItem('fav_comic_title', JSON.stringify(this.comic_title));
    localStorage.setItem('fav_comic_url', JSON.stringify(this.comic_url));
    localStorage.setItem('fav_comic_alt', JSON.stringify(this.comic_alt));
    localStorage.setItem('fav_comic_img', JSON.stringify(this.comic_img));
  }

  xkcd_utils.addFavourite = function () {
    this.loadFromCache();
    this.fav_comic_number.push(this.current_comic_number);
    this.comic_url.push(this.current_comic_url);
    this.comic_title.push(this.current_comic_title);
    this.comic_alt.push(this.current_comic_alt);
    this.comic_img.push(this.current_comic_img);
    this.updateFavouriteCache();
  }

  xkcd_utils.removeFavourite = function () {
    this.loadFromCache();
    for (var i = 0; i < this.fav_comic_number.length; i++) {
      if (this.fav_comic_number[i] === this.current_comic_number) {
        this.fav_comic_number.splice(i, 1);
        this.comic_title.splice(i, 1);
        this.comic_url.splice(i, 1);
        this.comic_alt.splice(i, 1);
        this.comic_img.splice(i, 1);
        break;
      }
    }
    this.updateFavouriteCache();
  }

  xkcd_utils.isFavourite = function (comic_num) {
    return this.fav_comic_number.includes(comic_num);
  }

  // Check if a comic is already a favourite or not and update icon accordingly
  xkcd_utils.updateFavouriteIcon = function (response) {
    this.loadFromCache();
    if (this.isFavourite(xkcd_utils.current_comic_number)) {
      document.getElementById("favBtn").style.backgroundImage = "url('assets/favoriteSmall.png')";
    }
    else {
      document.getElementById("favBtn").style.backgroundImage = "url('assets/favorite_off_small.png')";
    }
  }

  // Random comic functionality
  xkcd_utils.getRandomIcon = function () {
    var random_icon_number = Math.ceil(Math.random() * 6);
    return random_icon_number;
  }

  xkcd_utils.setRandomIcon = function () {
    var icon_location = "url('assets/r" + this.getRandomIcon() + "_small.png')";
    document.getElementById("randomBtn").style.backgroundImage = icon_location;
  }

  xkcd_utils.loadComic = function (url) {
    utils.showLoading("#main_content");
    // Asynchronously load the xkcd JSON
    ajaxUtils.sendGetRequest(url, function (xkcd_response) {
      // Get and store the total number of comics in the first run
      if (run_number == 0) {
        xkcd_utils.total_comics = xkcd_response.num;
        run_number += 1;
        $("#forwdBtn").disabled = true;
      }
      xkcd_utils.current_comic_number = xkcd_response.num;

      // If the comic is a favourite, show it so
      xkcd_utils.updateFavouriteIcon(xkcd_response);
      xkcd_utils.setRandomIcon();

      var comic_date = xkcd_response.day + " " + month_array[xkcd_response.month - 1] + ", " + xkcd_response.year;
      var img_url = xkcd_response.img;
      var comic_title = xkcd_response.safe_title;
      var comic_alt = xkcd_response.alt;

      // Store for easy favourite functionality
      xkcd_utils.current_comic_title = comic_title;
      xkcd_utils.current_comic_alt = comic_alt;
      xkcd_utils.current_comic_img = img_url;
      xkcd_utils.current_comic_date = comic_date;
      xkcd_utils.current_comic_url = url;
      // Asynchronously load the HTML snippet
      ajaxUtils.sendGetRequest(home_path, function (html_response) {
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

  xkcd_utils.goForward = function () {
    if (xkcd_utils.current_comic_number < xkcd_utils.total_comics) {
      xkcd_utils.current_comic_number += 1;
      utils.showLoading("#main_content");
      xkcd_utils.loadComic(xkcd_utils.base_url + xkcd_utils.current_comic_number);
    }
    else {
      alert("This is the latest comic. You can't go forward.");
      $("#forwdBtn").disabled = true;
    }
  }

  xkcd_utils.shareComic = function () {
    shareData = {
      title: this.current_comic_title,
      text: this.current_comic_alt,
      url: 'https://xkcd.com/' + this.current_comic_number
    };
    navigator.share(shareData);
  }

  xkcd_utils.explainComic = function () {
    // Using the Explain:XKCD Wiki Page
    var url = 'https://cors-anywhere.herokuapp.com/https://www.explainxkcd.com/wiki/index.php/' + this.current_comic_number;

    if (isExplainMode) {
      // If already in explain mode, remove the explain popover
      var overlay = document.getElementById('overlay');
      $('#overlay').removeClass('fade-in');
      $('#overlay').addClass('fade-out');
      // document.body.removeChild(overlay);
      isExplainMode = false;
    } else {
      // Create the overlay 
      var overlay = document.getElementById("overlay");
      $('#overlay').removeClass('fade-out');
      $('#overlay').addClass('fade-in');

      isExplainMode = true;

      ajaxUtils.sendGetRequest(url, function (response) {
        var startIndex = response.indexOf('<h2><span class="mw-headline" id="Explanation">Explanation</span>');
        var endIndex = response.indexOf('<h2><span class="mw-headline" id="Transcript">Transcript</span>')
        var explanation = response.substring(startIndex, endIndex);
        // There are two types of explanations : Complete and Incomplete. For the first, the explanation is in a p block while for the other there is a warning box

        // Search for incomplete explanation 
        var isIncomplete = response.indexOf('This explanation may be incomplete or incorrect');

        var cleanedText = "";
        if (isIncomplete > 0) {
          // Incomplete Explanation
          var exclIndex = explanation.indexOf('</table>')
          var finIndex = explanation.lastIndexOf('</p>');
          cleanedText = cleanedText + explanation.substring(exclIndex + 8, finIndex);

          var somediv = document.createElement("div");
          somediv.innerHTML = cleanedText;
          cleanedText = somediv.textContent || somediv.innerText || "";

        } else {
          // Complete Explanation 
          var startIndex = explanation.indexOf('<p>');
          while (startIndex > 0) {
            var endIndex = explanation.indexOf('</p>', startIndex);
            cleanedText = cleanedText + explanation.substring(startIndex + 3, endIndex);
            startIndex = explanation.indexOf('<p>', endIndex);
          }

          var somediv = document.createElement("div");
          somediv.innerHTML = cleanedText;
          cleanedText = somediv.textContent || somediv.innerText || "";
        }

        $('#expln_text').text(cleanedText);
      },
        false);
    }
  }

  xkcd_utils.goBackward = function () {
    if (xkcd_utils.current_comic_number > 1) {
      xkcd_utils.current_comic_number = xkcd_utils.current_comic_number - 1;
      utils.showLoading("#main_content");
      xkcd_utils.loadComic(xkcd_utils.base_url + xkcd_utils.current_comic_number);
      $("#forwdBtn").disabled = false;
    }
    else {
      alert("This is the oldest comic. You can't go back.");
      $("#backBtn").disabled = true;
    }
  }


  $("#closeExplnBtn").on('click', function () {
    $('#overlay').removeClass('fade-in');
    $('#overlay').addClass('fade-out');
    isExplainMode = false;
  });

  global.xkcd_utils = xkcd_utils;
})(window);