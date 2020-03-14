'use strict';

(function () {
  var effectInterfaceParams = {
    fullValue: 0,
    controlWidth: 0,
    CONTROL_MIN_COORDINATE: '0px',
    controlMaxCoordinate: 0,
    initial: true,
  };

  var checkInterfaceCondition = function (controlInterface) {
    if (effectInterfaceParams.initial) {
      getInitialInterfaceParams(controlInterface);
    }
  };

  var getInitialInterfaceParams = function (controlInterface) {
    var effectLevelFull = controlInterface.querySelector('.effect-level__line');
    var effectControl = controlInterface.querySelector('.effect-level__pin');
    effectInterfaceParams.fullValue = effectLevelFull.offsetWidth;
    effectInterfaceParams.controlWidth = effectControl.offsetWidth;
    effectInterfaceParams.controlMaxCoordinate = effectInterfaceParams.fullValue + 'px';
    effectInterfaceParams.initial = false;
  };

  var effectControlMouseupHandler;

  var handleEffectInterface = function (controlInterface, effect, callback) {
    if (effectInterfaceParams.initial) {
      getInitialInterfaceParams(controlInterface);
    }

    var controlElement = controlInterface.querySelector('.effect-level__pin');

    effectControlMouseupHandler = function () {
      var controlFractionValue = (controlElement.offsetLeft / effectInterfaceParams.fullValue).toFixed(2);
      callback(effect, controlFractionValue);
    };

    controlElement.addEventListener('mouseup', effectControlMouseupHandler);
  };

  var removeControlListener = function (controlInterface) {
    var controlElement = controlInterface.querySelector('.effect-level__pin');
    controlElement.removeEventListener('mouseup', effectControlMouseupHandler);
  };

  window.filterControlInterface = {
    checkInterfaceCondition: checkInterfaceCondition,
    getInitialInterfaceParams: getInitialInterfaceParams,
    handleEffectInterface: handleEffectInterface,
    removeControlListener: removeControlListener,
  };
})();
