'use strict';

(function () {
  var RANDOM_PICTURES_AMOUNT = 10;
  var FilterType = {
    RANDOM_FIXED_QUANTITY: 'filter-random',
    DISCUSSED: 'filter-discussed',
  };
  var filters = document.querySelector('.img-filters');

  var makeRandomPicturesArray = function (picturesArray, customLength) {
    var newPicturesArray = picturesArray.slice();
    newPicturesArray = window.util.shuffleArray(newPicturesArray, customLength);

    return newPicturesArray.slice(0, customLength);
  };

  var sortPicturesByComments = function (picturesArray) {
    var sortedPicturesArray = picturesArray.slice();
    sortedPicturesArray = sortedPicturesArray.sort(function (next, previous) {
      return previous.comments.length - next.comments.length;
    });

    return sortedPicturesArray;
  };

  var changeActiveFilter = function (evt, activeFilter) {
    activeFilter.classList.remove('img-filters__button--active');
    evt.target.classList.add('img-filters__button--active');
  };

  var filterPictures = function (picturesArray, filterType) {
    var filteredPictures;
    switch (filterType) {
      case FilterType.RANDOM_FIXED_QUANTITY:
        filteredPictures = makeRandomPicturesArray(picturesArray, RANDOM_PICTURES_AMOUNT);
        break;
      case FilterType.DISCUSSED:
        filteredPictures = sortPicturesByComments(picturesArray);
        break;
      default:
        filteredPictures = picturesArray;
    }

    return filteredPictures;
  };

  var filterBlockClickHandler = window.debounce(function (evt) {
    var activeFilterButton = filters.querySelector('.img-filters__button--active');

    if (evt.target.classList.contains('img-filters__button') && evt.target !== activeFilterButton) {
      var filterType = evt.target.id;
      changeActiveFilter(evt, activeFilterButton);

      var filteredPictures = filterPictures(window.main.picturesDataLoaded, filterType);
      window.main.showPictures(filteredPictures);
    }
  });

  var initializeFilter = function () {
    filters.classList.remove('img-filters--inactive');
    filters.addEventListener('click', filterBlockClickHandler);
  };

  window.filter = {
    initializeFilter: initializeFilter,
  };
})();
