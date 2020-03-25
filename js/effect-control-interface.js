'use strict';

(function () {
  var effectInterfaceParams = {
    controlWidth: 0,
    CONTROL_MIN_COORDINATE: 0,
    controlMaxCoordinate: 0,
    initial: true,
  };
  var effectControlMousedownHandler;

  var setInterfaceCondition = function (controlElement, effectLevelFull, effectLevelLine) {
    if (effectInterfaceParams.initial) {
      getInitialInterfaceParameters(controlElement, effectLevelFull);
    }
    effectLevelLine.style.width = effectInterfaceParams.controlMaxCoordinate + 'px';
    controlElement.style.left = effectInterfaceParams.controlMaxCoordinate + 'px';
  };

  var getInitialInterfaceParameters = function (controlElement, effectLevelFull) {
    effectInterfaceParams.controlWidth = controlElement.offsetWidth;
    effectInterfaceParams.controlMaxCoordinate = effectLevelFull.offsetWidth;
    effectInterfaceParams.initial = false;
  };

  var handleEffectInterface = function (controlInterface, effect, callback) {
    var controlElement = controlInterface.querySelector('.effect-level__pin');
    var effectLevelFull = controlInterface.querySelector('.effect-level__line');
    var effectLevelLine = controlInterface.querySelector('.effect-level__depth');

    setInterfaceCondition(controlElement, effectLevelFull, effectLevelLine);

    effectControlMousedownHandler = function (evt) {
      evt.preventDefault();
      var startCoordinates = {
        x: evt.clientX,
        y: evt.clientY,
      };

      var documentMouseMoveHandler = function (moveEvent) {
        moveEvent.preventDefault();

        var shift = {
          x: startCoordinates.x - moveEvent.clientX,
          y: startCoordinates.y,
        };

        startCoordinates.x = moveEvent.clientX;

        var getCoordinateX = function () {
          var currentX = controlElement.offsetLeft - shift.x;

          if (currentX > effectInterfaceParams.controlMaxCoordinate) {
            return effectInterfaceParams.controlMaxCoordinate;
          } else if (currentX < effectInterfaceParams.CONTROL_MIN_COORDINATE) {
            return effectInterfaceParams.CONTROL_MIN_COORDINATE;
          }

          return currentX;
        };

        var currentX = getCoordinateX();

        controlElement.style.left = currentX + 'px';
        effectLevelLine.style.width = currentX + 'px';
        var controlFractionValue = (currentX / effectInterfaceParams.controlMaxCoordinate).toFixed(2);
        callback(effect, controlFractionValue);
      };

      var documentMouseUpHandler = function (upEvent) {
        upEvent.preventDefault();
        document.removeEventListener('mousemove', documentMouseMoveHandler);
        document.removeEventListener('mouseup', documentMouseUpHandler);
      };

      document.addEventListener('mousemove', documentMouseMoveHandler);
      document.addEventListener('mouseup', documentMouseUpHandler);
    };

    controlElement.addEventListener('mousedown', effectControlMousedownHandler);
  };

  var removeControlListener = function (controlInterface) {
    var controlElement = controlInterface.querySelector('.effect-level__pin');
    controlElement.removeEventListener('mousedown', effectControlMousedownHandler);
  };

  window.effectControlInterface = {
    handleEffectInterface: handleEffectInterface,
    removeControlListener: removeControlListener,
  };
})();
