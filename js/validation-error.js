'use strict';

(function () {
  var ERROR_STYLE = 'width: 450px; margin: -10px auto 10px; text-transform: none; text-align: left; color: crimson';
  var TEXTAREA_ERROR_GAP = '8px';

  var createErrorMessage = function (input) {
    var errorMessage = document.createElement('p');
    errorMessage.classList.add('text__error');
    errorMessage.dataset.error = input.name;
    errorMessage.style.cssText = ERROR_STYLE;

    if (input.tagName === 'INPUT') {
      input.parentElement.insertBefore(errorMessage, input.nextSibling);
    } else {
      errorMessage.style.marginTop = TEXTAREA_ERROR_GAP;
      input.parentElement.appendChild(errorMessage);
    }
  };

  var setErrorCondition = function (input, errors) {
    if (!document.querySelector('[data-error=' + input.name + ']')) {
      createErrorMessage(input);
    }
    var errorMessage = document.querySelector('[data-error=' + input.name + ']');

    if (errors && typeof errors === 'string') {
      errorMessage.textContent = errors;
    } else {
      errorMessage.textContent = errors.join(' ');
    }
  };

  var cleanError = function (input) {
    if (input) {
      var errorMessage = document.querySelector('[data-error=' + input.name + ']');
      if (errorMessage) {
        errorMessage.textContent = '';
      }
    } else {
      var errorMessages = document.querySelectorAll('.text__error');
      Array.from(errorMessages).forEach(function (it) {
        it.textContent = '';
      });
    }
  };

  window.validationError = {
    setErrorCondition: setErrorCondition,
    cleanError: cleanError
  };
})();
