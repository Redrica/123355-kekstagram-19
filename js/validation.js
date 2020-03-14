'use strict';

(function () {
  var ERROR_STYLE = 'width: 450px; margin: -10px auto 10px; text-transform: none; text-align: left; color: crimson';
  var ErrorMessage = {
    QUANTITY_LIMIT: 'Можно задать не более пяти хэштегов.',
    FIRST_SYMBOL: 'Первый символ должен быть #.',
    MIN_LENGTH: 'Должно быть больше одного символа.',
    MAX_LENGTH: 'Длина не более 20 символов.',
    INCORRECT_SYMBOL: 'Может включать только буквы и цифры.',
    NO_REPETITION: 'Значения не должны повторяться.',
  };
  var HashStingParam = {
    MIN_LENGTH: 2,
    MAX_LENGTH: 20,
    QUANTITY_LIMIT: 5,
    FIRST_SYMBOL: '#',
    REG_EXP: /^#?[а-яёa-z\d]+$/,
  };

  var submitFormHandler;

  var addError = function (errorsArray, error) {
    if (errorsArray.indexOf(error) === -1) {
      errorsArray.push(error);
    }
  };

  var checkHashSymbol = function (hashtag, errorsArray) {
    if (hashtag[0] !== '#') {
      addError(errorsArray, ErrorMessage.FIRST_SYMBOL);
    }
  };

  var checkHashtagMinLength = function (hashtag, errorsArray) {
    if (hashtag.length < HashStingParam.MIN_LENGTH && hashtag[0] === HashStingParam.FIRST_SYMBOL) {
      addError(errorsArray, ErrorMessage.MIN_LENGTH);
    }
  };

  var checkHashtagMaxLength = function (hashtag, errorsArray) {
    if (hashtag.length > HashStingParam.MAX_LENGTH) {
      addError(errorsArray, ErrorMessage.MAX_LENGTH);
    }
  };

  var checkCorrectSymbols = function (hashtag, errorsArray) {
    if (!hashtag.match(HashStingParam.REG_EXP)) {
      addError(errorsArray, ErrorMessage.INCORRECT_SYMBOL);
    }
  };

  var checkRepetiion = function (hashtag, errorsArray, hashtagsArray, currentIndex) {
    if (hashtagsArray.indexOf(hashtag, currentIndex + 1) > 0) {
      addError(errorsArray, ErrorMessage.NO_REPETITION);
    }
  };

  var checkHashtags = function (hashtagsArray) {
    var errors = [];
    if (hashtagsArray.length > 0) {
      if (hashtagsArray.length > HashStingParam.QUANTITY_LIMIT) {
        errors.push(ErrorMessage.QUANTITY_LIMIT);
      }

      hashtagsArray.forEach(function (it, index, array) {
        checkHashSymbol(it, errors);
        checkHashtagMinLength(it, errors);
        checkHashtagMaxLength(it, errors);
        checkCorrectSymbols(it, errors);
        checkRepetiion(it, errors, array, index);
      });
    }
    return errors;
  };

  var createErrorMessage = function (input) {
    var errorMessage = document.createElement('p');
    errorMessage.classList.add('text__error');
    errorMessage.style.cssText = ERROR_STYLE;

    input.parentElement.insertBefore(errorMessage, input.nextSibling);
  };

  var setErrorCondition = function (input, errors) {
    if (!document.querySelector('.text__error')) {
      createErrorMessage(input);
    }
    var errorMessage = document.querySelector('.text__error');
    errorMessage.textContent = errors.join(' ');
  };

  var cleanError = function () {
    var errorMessage = document.querySelector('.text__error');
    if (errorMessage) {
      errorMessage.textContent = '';
    }
  };

  var inputFocusHandler = function () {
    cleanError();
  };

  var addSubmitListener = function (form) {
    var hashtagInput = form.querySelector('.text__hashtags');

    submitFormHandler = function (evt) {
      var hashtags = window.util.getValuesArray(hashtagInput);
      var errors = checkHashtags(hashtags);

      if (errors.length > 0) {
        setErrorCondition(hashtagInput, errors);
        evt.preventDefault();
        hashtagInput.addEventListener('focus', inputFocusHandler);
      }
    };

    form.addEventListener('submit', submitFormHandler);
  };

  var cleanValidation = function (form) {
    var hashtagInput = form.querySelector('.text__hashtags');
    form.removeEventListener('submit', submitFormHandler);
    hashtagInput.removeEventListener('focus', inputFocusHandler);
    cleanError();
  };

  window.validation = {
    addSubmitListener: addSubmitListener,
    cleanValidation: cleanValidation,
  };
})();
