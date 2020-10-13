(function(global) {
  var likes_utils = {};
  
  var main_content = document.getElementById('main_content');
  var inner_jumbo = document.createElement('div');
  inner_jumbo.classList.add('jumbotron-fluid');
  inner_jumbo.classList.add('overflow-auto');
  inner_jumbo.style.textAlign = 'center';
  inner_jumbo.style.overflow = 'hidden';
  inner_jumbo.setAttribute("style", "scrollbar-width: none;");
  var row = document.createElement('div');
  row.classList.add('row');

  function addElementtoPage(elem) {
    row.appendChild(elem);
  }

  function createImageElement(data) {
    // Create the image element
    var thumbnail = document.createElement('div');
    thumbnail.classList.add('col-lg-3', 'col-md-4', 'col-6');
    
    var inner_fig = document.createElement('figure');
    inner_fig.classList.add('figure');
    
    var inner_img = document.createElement('img');
    inner_img.classList.add('figure-img', 'img-fluid', 'rounded');
    inner_img.src = data.comic_img;
    inner_img.alt = data.comic_alt;
    inner_img.onclick = function() {
      xkcd_utils.loadComic(data.comic_url);
      $("#bottomNav").show();  
    }

    var inner_caption = document.createElement('figcaption');
    inner_caption.classList.add('figure-caption');
    inner_caption.innerHTML = "#" + data.comic_number + " : " + data.comic_title;

    inner_fig.appendChild(inner_caption);
    inner_fig.appendChild(inner_img);
    

    thumbnail.appendChild(inner_fig);
   
    addElementtoPage(thumbnail);
  }

  function createEmptyPage() {
    var emptyMsg = document.createElement('p');
    emptyMsg.classList.add('lead');
    emptyMsg.innerHTML = 'Sorry, you have not liked any comics yet :(';
    addElementtoPage(emptyMsg);  
  }

  function imagesToLoad() {
    row.innerHTML = "";
    var isStored = localStorage['fav_comic_number'];
    if(isStored) {
      var numStored = JSON.parse(isStored);
      var titleStored = JSON.parse(localStorage['fav_comic_title']);
      var urlStored = JSON.parse(localStorage['fav_comic_url']);
      var altStored = JSON.parse(localStorage['fav_comic_alt']);
      var imgStored = JSON.parse(localStorage['fav_comic_img']);
      
      numStored.forEach(function(item, index) {
        var toLoad = {
          comic_number: numStored[index],
          comic_title: titleStored[index],
          comic_alt: altStored[index],
          comic_img: imgStored[index],
          comic_url: urlStored[index]
        };
        createImageElement(toLoad);
      });
    }
    else {
      createEmptyPage();
    }
  }

  likes_utils.loadLikesView = function() {
    // Hide Main Page, then load comics
    main_content.innerHTML = "";
    imagesToLoad();
    inner_jumbo.appendChild(row);
    main_content.appendChild(inner_jumbo);
    // Now clear inner_jumbo for future use
  }

  global.likes_utils = likes_utils;
})(window);