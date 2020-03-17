'use strict';

(function () {
  var ERROR_STYLE = 'width: 450px; margin: -10px auto 10px; text-transform: none; text-align: left; color: crimson';
  var TEXTAREA_ERROR_GAP = '8px';
  var COMMENT_MAX_LENGTH = 140;
  var ErrorMessage = {
    QUANTITY_LIMIT: 'Можно задать не более пяти хэштегов.',
    FIRST_SYMBOL: 'Первый символ должен быть #.',
    MIN_HASHTAG_LENGTH: 'Должно быть больше одного символа.',
    MAX_HASHTAG_LENGTH: 'Длина не более 20 символов.',
    INCORRECT_SYMBOL: 'Может включать только буквы и цифры.',
    NO_REPETITION: 'Значения не должны повторяться.',
    MAX_COMMENT_LENGTH: 'Длина комментария не может составлять более 140 символов.',
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
      addError(errorsArray, ErrorMessage.MIN_HASHTAG_LENGTH);
    }
  };

  var checkHashtagMaxLength = function (hashtag, errorsArray) {
    if (hashtag.length > HashStingParam.MAX_LENGTH) {
      addError(errorsArray, ErrorMessage.MAX_HASHTAG_LENGTH);
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

  var checkComment = function (commentString) {
    var error;
    if (commentString.length > COMMENT_MAX_LENGTH) {
      error = ErrorMessage.MAX_COMMENT_LENGTH;
    }
    return error;
  };

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

  var inputFocusHandler;

  var handleValidationError = function (evt, input, errorsArray) {
    setErrorCondition(input, errorsArray);

    inputFocusHandler = function (inputElement) {
      inputElement = input;
      cleanError(inputElement);
    };

    input.addEventListener('focus', inputFocusHandler);
  };

  var addSubmitListener = function (form) {
    var hashtagInput = form.querySelector('.text__hashtags');
    var commentInput = form.querySelector('.text__description');
    var data = new FormData(form);

    submitFormHandler = function (evt) {

      var hashtags = window.util.getValuesArray(hashtagInput);
      var hashtagsErrors = checkHashtags(hashtags);
      var commentError = checkComment(commentInput.value);
      var errorExist = false;

      if (hashtagsErrors.length > 0) {
        handleValidationError(evt, hashtagInput, hashtagsErrors);
        errorExist = true;
      }

      if (commentError) {
        handleValidationError(evt, commentInput, commentError);
        if (!errorExist) {
          errorExist = true;
        }
      }

      if (!errorExist) {
        var uploadForm = form;
        console.log(data);
        window.backend.uploadData(new FormData(uploadForm), function (response) {
          console.log(response);
        });
      }

      evt.preventDefault();
    };

    form.addEventListener('submit', submitFormHandler);
  };

  var cleanValidation = function (form) {
    var hashtagInput = form.querySelector('.text__hashtags');
    var commentInput = form.querySelector('.text__description');

    form.removeEventListener('submit', submitFormHandler);
    hashtagInput.removeEventListener('focus', inputFocusHandler);
    commentInput.removeEventListener('focus', inputFocusHandler);
    cleanError();
  };

  window.validation = {
    addSubmitListener: addSubmitListener,
    cleanValidation: cleanValidation,
  };
})();
