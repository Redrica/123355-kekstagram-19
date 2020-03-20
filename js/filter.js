'use strict';

(function () {
  var RANDOM_PICTURES_AMOUNT = 10;
  var FilterType = {
    DEFAULT: 'filter-default',
    RANDOM_FIXED_QUANTITY: 'filter-random',
    DISCUSSED: 'filter-discussed',
  };

  var makeRandomPicturesArray = function (picturesArray, customLength) {
    var newPicturesArray = picturesArray.slice();
    newPicturesArray = window.util.shuffleArray(newPicturesArray, customLength);

    return newPicturesArray.slice(0, customLength);
  };

  var sortByComments = function (picturesArray) {
    var newPicturesArray = picturesArray.slice();
    newPicturesArray = newPicturesArray.sort(function (next, previous) {
      return previous.comments.length - next.comments.length;
    });

    return newPicturesArray;
  };

  var changeActiveFilter = function (evt, activeFilter) {
    activeFilter.classList.remove('img-filters__button--active');
    evt.target.classList.add('img-filters__button--active');
  };

  var filterPictures = function (picturesArray, filterType) {
    var filteredPictures;
    switch (filterType) {
      case FilterType.DEFAULT:
        filteredPictures = picturesArray;
        break;
      case FilterType.RANDOM_FIXED_QUANTITY:
        filteredPictures = makeRandomPicturesArray(picturesArray, RANDOM_PICTURES_AMOUNT);
        break;
      case FilterType.DISCUSSED:
        filteredPictures = sortByComments(picturesArray);
        break;
      default:
        filteredPictures = picturesArray;
    }

    return filteredPictures;
  };

  var filterBlockClickHandler;

  var initializeFilter = function (filterBlock, picturesArray, callback) {

    filterBlockClickHandler = function (evt) {
      var activeFilterButton = filterBlock.querySelector('.img-filters__button--active');

      if (evt.target.classList.contains('img-filters__button') && evt.target !== activeFilterButton) {
        var filterType = evt.target.id;
        changeActiveFilter(evt, activeFilterButton);

        var filteredPictures = filterPictures(picturesArray, filterType);
        callback(filteredPictures);
      }
    };

    filterBlock.classList.remove('img-filters--inactive');
    filterBlock.addEventListener('click', filterBlockClickHandler);
  };

  window.filter = {
    initializeFilter: initializeFilter,
  };
})();
