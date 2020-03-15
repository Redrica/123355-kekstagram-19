'use strict';

(function () {
  var effectLevelFull;
  var effectLevelLine;
  var controlElement;
  var effectInterfaceParams = {
    controlWidth: 0,
    CONTROL_MIN_COORDINATE: 0,
    controlMaxCoordinate: 0,
    initial: true,
  };
  var effectControlMousedownHandler;

  var setInterfaceCondition = function (controlInterface) {
    if (effectInterfaceParams.initial) {
      getInitialInterfaceParams(controlInterface);
    }
    effectLevelLine.style.width = effectInterfaceParams.controlMaxCoordinate + 'px';
    controlElement.style.left = effectInterfaceParams.controlMaxCoordinate + 'px';
  };

  var getInitialInterfaceParams = function (controlInterface) {
    effectLevelFull = controlInterface.querySelector('.effect-level__line');
    controlElement = controlInterface.querySelector('.effect-level__pin');
    effectLevelLine = controlInterface.querySelector('.effect-level__depth');
    effectInterfaceParams.controlWidth = controlElement.offsetWidth;
    effectInterfaceParams.controlMaxCoordinate = effectLevelFull.offsetWidth;
    effectInterfaceParams.initial = false;
  };

  var handleEffectInterface = function (effect, callback) {

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

  var removeControlListener = function () {
    controlElement.removeEventListener('mousedown', effectControlMousedownHandler);
  };

  window.filterControlInterface = {
    setInterfaceCondition: setInterfaceCondition,
    handleEffectInterface: handleEffectInterface,
    removeControlListener: removeControlListener,
  };
})();
