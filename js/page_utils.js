(function(global) {
  var page_utils = {};

  $('#navbarSupportedContent').on('show.bs.collapse', function () {
    $('#navbarSearchContent').collapse("hide");
  });
  $('#navbarSearchContent').on('show.bs.collapse', function () {
    $('#navbarSupportedContent').collapse("hide");
  });

  
  page_utils.registerServiceWorker = async function() {
    if('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('sw.js');
      } catch (e) {
        console.log("Unable to register Service Worker");
      }
    }
  }
  page_utils.insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };
  
  // Show loading icon inside element identified by 'selector'.
  page_utils.showLoading = function (selector) {
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
    this.insertHtml(selector, html);
  };
  global.utils = page_utils;
})(window);