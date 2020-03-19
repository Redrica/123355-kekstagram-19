'use strict';

(function () {
  var Key = {
    ESCAPE: 'Escape',
    ENTER: 'Enter',
  };

  var isEscapeEvent = function (evt, action) {
    if (evt.key === Key.ESCAPE) {
      action();
    }
  };

  var escapeStopPropagationHandler = function (evt) {
    if (evt.key === Key.ESCAPE) {
      evt.stopPropagation();
    }
  };

  // получение случайного целого числа от min до max
  var getRandomNumber = function (max, min) {
    var minNumber = min ? min : 0;
    return Math.round(Math.random() * (max - minNumber)) + minNumber;
  };

  // перемешивание массива
  var shuffleArray = function (array) {
    var j;
    var temp;
    for (var i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[j];
      array[j] = array[i];
      array[i] = temp;
    }
    return array;
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
    Key: Key,
    isEscapeEvent: isEscapeEvent,
    escapeStopPropagationHandler: escapeStopPropagationHandler,
    getRandomNumber: getRandomNumber,
    getCustomIntervalValue: getCustomIntervalValue,
    changeValue: changeValue,
    getValuesArray: getValuesArray,
  };
})();
