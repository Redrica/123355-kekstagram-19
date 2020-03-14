'use strict';

(function () {
  var Scale = {
    INITIAL: 100,
    MIN: 25,
    MAX: 100,
    STEP: 25,
  };

  var scaleControlClickHandler;

  var addScaleListener = function (formElement, callback) {
    var scaleInput = formElement.querySelector('.scale__control--value');
    var scaleUp = formElement.querySelector('.scale__control--bigger');
    var scaleDown = formElement.querySelector('.scale__control--smaller');

    scaleInput.value = Scale.INITIAL + '%';
    // callback(Scale.INITIAL); // TODO: срабатывает в любом случае, надо, чтобы только при измененном размере

    scaleControlClickHandler = function (evt) {
      var currentScale = parseInt(scaleInput.value, 10);
      if (evt.target === scaleDown) {
        currentScale = window.util.changeValue(currentScale, -Scale.STEP, Scale.MIN, Scale.MAX);
      }

      if (evt.target === scaleUp) {
        currentScale = window.util.changeValue(currentScale, Scale.STEP, Scale.MIN, Scale.MAX);
      }

      scaleInput.value = currentScale + '%';
      callback(currentScale);
    };

    formElement.addEventListener('click', scaleControlClickHandler);
  };

  var removeScaleListener = function (formElement) {
    formElement.removeEventListener('click', scaleControlClickHandler);
  };

  window.scale = {
    Scale: Scale,
    addScaleListener: addScaleListener,
    removeScaleListener: removeScaleListener,
  };
})();
