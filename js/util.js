'use strict';

(function () {

  // получение случайного целого числа от min до max
  var getRandomNumber = function (max, min) {
    var minNumber = min ? min : 0;
    return Math.round(Math.random() * (max - minNumber)) + minNumber;
  };

  // функция, возвращающая пропорциональное значение в заданном интервале
  var getCustomIntervalValue = function (minValue, maxValue, fractionValue) {
    var interval = maxValue - minValue;
    return fractionValue * interval + minValue;
  };

  // функция, изменяющая текущее значение на заданную величину
  var changeValue = function (currentValue, change, min, max) {
    var result = currentValue + change;
    if (result < min) {
      return min;
    }

    if (result > max) {
      return max;
    }

    return result;
  };

  // функция, собирающая массив из введенной строки по пробелам
  function getValuesArray(input) {
    input.value = input.value.trim();
    if (input.value === '') {
      return [];
    }
    return input.value.toLowerCase().split(/\s+/);
  }

  window.util = {
    getRandomNumber: getRandomNumber,
    getCustomIntervalValue: getCustomIntervalValue,
    changeValue: changeValue,
    getValuesArray: getValuesArray,
  };
})();
