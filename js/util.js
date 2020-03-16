'use strict';

(function () {
  var ESCAPE_KEY = 'Escape';
  var ERROR_MESSAGE = 'Упс… что-то пошло не так!';
  var ErrorStyle = {
    BODY: 'position: fixed; left: 0; right: 0; z-index: 100; width: 330px; margin: 70px auto; padding: 25px 25px 0; font-size: 12px; text-transform: uppercase; text-align: center; background: white;  border: 2px solid red; border-radius: 15px; box-shadow: inset 0 0 10px red; color: black',
    CLOSE: 'position: absolute; top: 15px; right: 15px; z-index: 101; font-size: 20px; text-transform: uppercase; text-align: center; background: red; border: 1px solid #eeeeee; border-radius: 50%; transform: rotate(45deg); color: #eeeeee;'
  };

  var isEscapeEvent = function (evt, action) {
    if (evt.key === ESCAPE_KEY) {
      action();
    }
  };

  var escapeStopPropagationHandler = function (evt) {
    if (evt.key === ESCAPE_KEY) {
      evt.stopPropagation();
    }
  };

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

  // показ сообщения об ошибке при неудачном xhr запросе
  var onErrorMessage = function (errorMessage) {
    var node = document.createElement('div');
    node.style.cssText = ErrorStyle.BODY;
    node.textContent = ERROR_MESSAGE;
    document.body.insertAdjacentElement('afterbegin', node);

    var fragment = document.createDocumentFragment();
    var someText = document.createElement('p');
    someText.textContent = errorMessage;
    someText.style.fontSize = '20px';

    var closeButton = document.createElement('button');
    closeButton.style.cssText = ErrorStyle.CLOSE;
    closeButton.textContent = '+';

    fragment.appendChild(someText);
    fragment.appendChild(closeButton);
    node.appendChild(fragment);

    var errorCloseClickHandler = function () {
      closeButton.removeEventListener('click', errorCloseClickHandler);
      document.removeEventListener('keydown', errorEscapeHandler);
      node.parentNode.removeChild(node);
    };

    var errorEscapeHandler = function (evt) {
      isEscapeEvent(evt, errorCloseClickHandler);
    };

    closeButton.addEventListener('click', errorCloseClickHandler);
    document.addEventListener('keydown', errorEscapeHandler);
  };

  window.util = {
    isEscapeEvent: isEscapeEvent,
    escapeStopPropagationHandler: escapeStopPropagationHandler,
    getRandomNumber: getRandomNumber,
    getCustomIntervalValue: getCustomIntervalValue,
    changeValue: changeValue,
    getValuesArray: getValuesArray,
    onErrorMessage: onErrorMessage,
  };
})();
