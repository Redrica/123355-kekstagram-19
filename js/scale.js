'use strict';

(function () {
  var Scale = {
    NAME: 'scale',
    MIN: 0.25,
    MAX: 1,
    STEP: 0.25,
  };
  var PERSENT_FACTOR = 100;
  var loadedPicture = document.querySelector('.img-upload__preview img');
  var scaleUp = document.querySelector('.scale__control--bigger');
  var scaleDown = document.querySelector('.scale__control--smaller');
  var scaleInput = document.querySelector('.scale__control--value');

  function setScale(scaleValue) {
    loadedPicture.style.transform = Scale.NAME + '(' + window.util.getCustomIntervalValue(Scale.MIN, Scale.MAX, scaleValue) + ')';
    scaleInput.value = scaleValue * PERSENT_FACTOR + '%';
  }

  function countScaleValue(evt) {
    var currentScale = scaleInput.value.slice(0, (scaleInput.value.length - 1)) / PERSENT_FACTOR;
    if (evt.target === scaleUp && currentScale !== Scale.MAX) {
      currentScale += Scale.STEP;
    }
    if (evt.target === scaleDown && currentScale !== Scale.MIN) {
      currentScale -= Scale.STEP;
    }
    return currentScale;
  }

  function scaleControlsClickHandler(evt) {
    var currentScale = countScaleValue(evt);
    setScale(currentScale);
  }

  setScale(Scale.MAX);

  window.scale = {
    scaleControlsClickHandler: scaleControlsClickHandler,
  };
})();
