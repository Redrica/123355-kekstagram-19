'use strict';

(function () {
  var effectListClickHandler;

  var addFilterClickHandler = function (filterGroup, callback) {

    effectListClickHandler = function (evt) {
      if (evt.target.tagName === 'INPUT') {
        var newEffect = evt.target.value;
        callback(newEffect);
      }
    };

    filterGroup.addEventListener('click', effectListClickHandler);
  };

  var removeFilterClickHandler = function (filterGroup) {
    filterGroup.removeEventListener('click', effectListClickHandler);
  };

  window.filter = {
    addFilterClickHandler: addFilterClickHandler,
    removeFilterClickHandler: removeFilterClickHandler,
  };
})();
