'use strict';

(function () {
  var PICTURS_QUANTITY = 25;
  var picturesPlace = document.querySelector('.pictures');
  var fullPicture = document.querySelector('.big-picture');
  var fullPictureButtonClose = fullPicture.querySelector('.big-picture__cancel');
  var commentCount = fullPicture.querySelector('.social__comment-count');
  var commentsLoader = fullPicture.querySelector('.comments-loader');
  var uploadInput = document.querySelector('#upload-file');

  var picturesGenerated = window.generation.generatePictures(PICTURS_QUANTITY);
  picturesPlace.appendChild(window.render.renderPictures(picturesGenerated));

  var closeFullPicture = function () {
    fullPicture.classList.add('hidden');
    fullPictureButtonClose.removeEventListener('click', closeFullPicture);
    document.removeEventListener('keydown', fullPictureEscKeypressHandler);
  };

  var closeFullPictureClickHandler = function () {
    closeFullPicture();
  };

  var fullPictureEscKeypressHandler = function (evt) {
    window.util.isEscapeEvent(evt, closeFullPicture);
  };

  var picturesClickHandler = function (evt) {
    if (evt.target.classList.contains('picture__img')) {
      evt.preventDefault();
      var target = evt.target;
      while (!target.classList.contains('picture')) {
        target = target.parentNode;
      }
      var index = target.dataset.index;
      window.render.renderFullPicture(fullPicture, picturesGenerated[index]);
      fullPictureButtonClose.addEventListener('click', closeFullPictureClickHandler);
      document.addEventListener('keydown', fullPictureEscKeypressHandler);
    }
  };

  picturesPlace.addEventListener('click', picturesClickHandler);
  uploadInput.addEventListener('change', window.imageSetup.uploadInputChangeHandler);

  // ////////////
  // временно по заданию
  commentCount.classList.add('hidden');
  commentsLoader.classList.add('hidden');
})();
