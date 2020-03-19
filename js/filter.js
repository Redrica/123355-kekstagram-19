'use strict';

(function () {
  // модуль для обработки фильтрации загруженных фото

  var showDefaulPictures = function (data) {
    window.render.renderPictures(data);
  };

  var showRandomPictures = function (data) {

  };

  var showDiscussedPictures = function (data) {

  };

  var filterBlockClickHandler;

  var initializeFilter = function (filterBlock, data) {

    filterBlockClickHandler = function (evt) {
      var activeFilterButton = filterBlock.querySelector('.img-filters__button--active');
      activeFilterButton.classList.remove('img-filters__button--active');
      evt.target.classList.add('img-filters__button--active');
    };

    filterBlock.classList.remove('img-filters--inactive');
    filterBlock.addEventListener('click', filterBlockClickHandler);
  };

  window.filter = {
    initializeFilter: initializeFilter,
  };
})();
