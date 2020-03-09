'use strict';

(function () {

  // получение случайного целого числа от min до max
  function getRandomNumber(max, min) {
    var minNumber = min ? min : 0;
    return Math.round(Math.random() * (max - minNumber)) + minNumber;
  }

  // функция, возвращающая пропорциональное значение в заданном интервале
  function getCustomIntervalValue(minValue, maxValue, fractionValue) {
    var interval = maxValue - minValue;
    return fractionValue * interval + minValue;
  }

  window.util = {
    getRandomNumber: getRandomNumber,
    getCustomIntervalValue: getCustomIntervalValue,
  };
})();
