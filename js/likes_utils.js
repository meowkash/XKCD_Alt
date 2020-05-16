(function(global) {
  var likes_utils = {};
  
  var main_content = document.getElementById('main_content');
  var inner_jumbo = document.createElement('div');
  inner_jumbo.classList.add('jumbotron-fluid');

  function addElementtoPage(elem) {
    inner_jumbo.appendChild(elem);
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

    var inner_caption = document.createElement('figcaption');
    inner_caption.classList.add('figure-caption');
    inner_caption.innerHTML = "#" + data.comic_number + " : " + data.comic_title;

    inner_fig.appendChild(inner_img);
    inner_fig.appendChild(inner_caption);

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
    inner_jumbo.innerHTML = "";
    var isStored = localStorage['fav_comic_number'];
    if(isStored) {
      var numStored = JSON.parse(isStored);
      var titleStored = JSON.parse(localStorage['fav_comic_title']);
      var dateStored = JSON.parse(localStorage['fav_comic_date']);
      var altStored = JSON.parse(localStorage['fav_comic_alt']);
      var imgStored = JSON.parse(localStorage['fav_comic_img']);
      
      numStored.forEach(function(item, index) {
        var toLoad = {
          comic_number: numStored[index],
          comic_title: titleStored[index],
          comic_alt: altStored[index],
          comic_img: imgStored[index],
          comic_date: dateStored[index]
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
    main_content.appendChild(inner_jumbo);
    // Now clear inner_jumbo for future use
  }

  global.likes_utils = likes_utils;
})(window);