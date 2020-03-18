'use strict';

(function () {
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

  window.validation = {
    checkHashtags: checkHashtags,
    checkComment: checkComment,
  };
})();
