'use strict';

(function () {
  var ERROR_INPUT_STYLE = '1px solid crimson';
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
    input.classList.add('input-error');
    if (!document.querySelector('[data-error=' + input.name + ']')) {
      createErrorMessage(input);
    }
    var errorMessage = document.querySelector('[data-error=' + input.name + ']');

    if (errors && typeof errors === 'string') {
      errorMessage.textContent = errors;
    } else {
      errorMessage.textContent = errors.join(' ');
    }

    input.style.border = ERROR_INPUT_STYLE;
  };

  var cleanInputErrorCondition = function (input) {
    input.classList.remove('input-error');
    input.style.border = '';
  };

  var cleanError = function (input) {
    if (input) {
      var errorMessage = document.querySelector('[data-error=' + input.name + ']');
      if (errorMessage) {
        errorMessage.textContent = '';
        cleanInputErrorCondition(input);
      }
    } else {
      var errorMessages = document.querySelectorAll('.text__error');

      Array.from(errorMessages).forEach(function (it) {
        it.textContent = '';
      });

      var errorInputs = document.querySelectorAll('.text .input-error');

      errorInputs.forEach(cleanInputErrorCondition);
    }
  };

  var inputFocusHandler;

  var handleValidationError = function (evt, input, errorsArray) {
    setErrorCondition(input, errorsArray);

    inputFocusHandler = function (inputElement) {
      inputElement = input;
      cleanError(inputElement);
    };

    input.addEventListener('focus', inputFocusHandler);
  };

  var cleanErrorsHandling = function (form) {
    var hashtagInput = form.querySelector('.text__hashtags');
    var commentInput = form.querySelector('.text__description');

    hashtagInput.removeEventListener('focus', inputFocusHandler);
    commentInput.removeEventListener('focus', inputFocusHandler);
    cleanError();
  };

  window.validationError = {
    handleValidationError: handleValidationError,
    cleanErrorsHandling: cleanErrorsHandling,
  };
})();
