'use strict';

(function () {
  var picturesPlace = document.querySelector('.pictures');
  var fullPicture = document.querySelector('.big-picture');
  var fullPictureButtonClose = fullPicture.querySelector('.big-picture__cancel');
  var commentCount = fullPicture.querySelector('.social__comment-count');
  var commentsLoader = fullPicture.querySelector('.comments-loader');
  var uploadInput = document.querySelector('#upload-file');
  var filters = document.querySelector('.img-filters');

  var picturesDataLoaded;

  var removePictures = function () {
    while (picturesPlace.lastElementChild.classList.contains('picture')) {
      picturesPlace.removeChild(picturesPlace.lastElementChild);
    }
  };

  var showPictures = function (picturesArray) {
    if (picturesPlace.lastElementChild.classList.contains('picture')) {
      removePictures();
    }
    picturesPlace.appendChild(window.render.renderPictures(picturesArray));
  };

  var updatePicturesData = function (picturesArray) {
    picturesArray.forEach(function (picture, index) {
      picture.id = index;
    });
    return picturesArray;
  };

  var onSuccessLoadData = function (data) {
    picturesDataLoaded = updatePicturesData(data);
    showPictures(picturesDataLoaded);
    window.filter.initializeFilter(filters, picturesDataLoaded, showPictures);
  };

  window.backend.loadData(onSuccessLoadData, window.requestResponse.setResponseCondition);

  var closeFullPicture = function () {
    fullPicture.classList.add('hidden');
    fullPictureButtonClose.removeEventListener('click', closeFullPicture);
    document.removeEventListener('keydown', fullPictureEscKeypressHandler);
    document.body.classList.remove('modal-open');
  };

  var closeFullPictureClickHandler = function () {
    closeFullPicture();
  };

  var fullPictureEscKeypressHandler = function (evt) {
    window.util.isEscapeEvent(evt, closeFullPicture);
  };

  var showFullPicture = function (index) {
    window.render.renderFullPicture(fullPicture, picturesDataLoaded[index]);
    fullPictureButtonClose.addEventListener('click', closeFullPictureClickHandler);
    document.addEventListener('keydown', fullPictureEscKeypressHandler);
    document.body.classList.add('modal-open');
  };

  var picturesClickHandler = function (evt) {
    if (evt.target.classList.contains('picture__img')) {
      evt.preventDefault();
      var target = evt.target;
      while (!target.classList.contains('picture')) {
        target = target.parentNode;
      }
      var index = target.dataset.index;
      showFullPicture(index);
    }
  };

  var picturesEscKeypressHandler = function (evt) {
    if (evt.key === window.util.Key.ENTER && evt.target.classList.contains('picture')) {
      var index = evt.target.dataset.index;
      showFullPicture(index);
    }
  };

  picturesPlace.addEventListener('click', picturesClickHandler);
  picturesPlace.addEventListener('keydown', picturesEscKeypressHandler);
  uploadInput.addEventListener('change', window.imageSetup.uploadInputChangeHandler);

  // ////////////
  // временно по заданию
  commentCount.classList.add('hidden');
  commentsLoader.classList.add('hidden');
})();
