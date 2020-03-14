'use strict';

(function () {
  var PICTURS_QUANTITY = 25;
  var picturesPlace = document.querySelector('.pictures');

  var picturesGenerated = window.generation.generatePictures(PICTURS_QUANTITY);
  picturesPlace.appendChild(window.render.renderPictures(picturesGenerated));
})();
