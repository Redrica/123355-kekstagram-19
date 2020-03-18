'use strict';

(function () {
  var Filter = {
    chrome: {
      NAME: 'chrome',
      FILTER: 'grayscale',
      MIN: 0,
      MAX: 1,
      UNIT: '',
    },
    sepia: {
      NAME: 'sepia',
      FILTER: 'sepia',
      MIN: 0,
      MAX: 1,
      UNIT: '',
    },
    marvin: {
      NAME: 'marvin',
      FILTER: 'invert',
      MIN: 0,
      MAX: 100,
      UNIT: '%',
    },
    phobos: {
      NAME: 'phobos',
      FILTER: 'blur',
      MIN: 0,
      MAX: 3,
      UNIT: 'px',
    },
    heat: {
      NAME: 'heat',
      FILTER: 'brightness',
      MIN: 1,
      MAX: 3,
      UNIT: '',
    },
  };

  var FORM_ACTION = 'https://js.dump.academy/kekstagram';
  var PERCENT_FACTOR = 100;
  var EFFECT_CLASS_SUBSTRING = 'effects__preview--';
  var NO_EFFECT = 'none';
  var uploadForm = document.querySelector('.img-upload__form');
  var hashtagInput = uploadForm.querySelector('.text__hashtags');
  var commentInput = uploadForm.querySelector('.text__description');
  var uploadInput = uploadForm.querySelector('#upload-file');
  var imageSetup = uploadForm.querySelector('.img-upload__overlay');
  var imageSetupClose = uploadForm.querySelector('#upload-cancel');
  var loadedPicture = uploadForm.querySelector('.img-upload__preview img');
  var scaleInterface = uploadForm.querySelector('.scale');
  var effectsList = uploadForm.querySelector('.effects__list');
  var effectLevelInterface = uploadForm.querySelector('.effect-level');
  var effectLevelInput = effectLevelInterface.querySelector('.effect-level__value');
  var descriptionInput = uploadForm.querySelector('.text__description');
  var currentEffect;

  var setSetupToInitial = function () {
    loadedPicture.classList.remove(EFFECT_CLASS_SUBSTRING + currentEffect);
    uploadInput.value = '';
    effectLevelInput.value = '';
    hashtagInput.value = '';
    descriptionInput.value = '';
    loadedPicture.style.filter = '';
    loadedPicture.style.transform = '';
    // TODO: проверить, все ли чистится при закрытии заполненной, но не отправленной формы
  };

  var closeSetup = function () {
    imageSetup.classList.add('hidden');
    document.body.classList.remove('modal-open');
    imageSetupClose.removeEventListener('click', setupCloseClickHandler);
    document.removeEventListener('keydown', setupEscKeypressHandler);
    hashtagInput.removeEventListener('keydown', window.util.escapeStopPropagationHandler);
    descriptionInput.removeEventListener('keydown', window.util.escapeStopPropagationHandler);
    window.scale.removeScaleListener(scaleInterface);
    window.validation.cleanValidation(uploadForm, formSubmitHandler);
    window.filter.removeFilterClickHandler(effectsList);
    window.filterControlInterface.removeControlListener(effectLevelInterface);
    setSetupToInitial();
  };

  var setupCloseClickHandler = function () {
    closeSetup();
  };

  var setupEscKeypressHandler = function (evt) {
    window.util.isEscapeEvent(evt, closeSetup);
  };

  var handleImageEffect = function (effect) {
    if (effect !== currentEffect) {
      loadedPicture.classList.remove(EFFECT_CLASS_SUBSTRING + currentEffect);
      loadedPicture.classList.add(EFFECT_CLASS_SUBSTRING + effect);
      loadedPicture.style.filter = '';
      switchEffectInterface(effect);
      currentEffect = effect;
    }
  };

  var hideEffectInterface = function () {
    effectLevelInterface.classList.add('hidden');
    window.filterControlInterface.removeControlListener(effectLevelInterface);
  };

  var updateEffectInterface = function (effect) {
    effectLevelInput.value = Filter[effect].MAX;
    window.filterControlInterface.removeControlListener(effectLevelInterface);
    window.filterControlInterface.handleEffectInterface(effectLevelInterface, effect, setEffectValue);
  };

  // функция, обрабатывающая поведение контрола уровня эффекта
  var switchEffectInterface = function (effect) {
    if (effect === NO_EFFECT) { // переключились с любого эффекта на ORIGIN, настройки не нужны
      hideEffectInterface();
    } else {
      if (effectLevelInterface.classList.contains('hidden')) {
        effectLevelInterface.classList.remove('hidden');
      }
      updateEffectInterface(effect);
    }
  };

  // функция, возвращающая строку для записи в style картинки
  var getStyleFilterRule = function (filter, effectValue) {
    return filter.FILTER + '(' + window.util.getCustomIntervalValue(filter.MIN, filter.MAX, effectValue) + filter.UNIT + ')';
  };

  var setEffectValue = function (effect, effectValue) {
    // записываем значение в input для отправки
    effectLevelInput.value = effectValue * PERCENT_FACTOR;
    loadedPicture.style.filter = getStyleFilterRule(Filter[effect], effectValue);
  };

  var setImageScale = function (scale) {
    loadedPicture.style.transform = 'scale(' + scale / PERCENT_FACTOR + ')';
  };

  var formSubmitHandler = function (evt) {
    var hashtags = window.util.getValuesArray(hashtagInput);
    var hashtagsErrors = window.validation.checkHashtags(hashtags);
    var commentError = window.validation.checkComment(commentInput.value);
    var errorExist = false;

    if (hashtagsErrors.length > 0) {
      window.validation.handleValidationError(evt, hashtagInput, hashtagsErrors);
      errorExist = true;
    }

    if (commentError) {
      window.validation.handleValidationError(evt, commentInput, commentError);
      if (!errorExist) {
        errorExist = true;
      }
    }

    evt.preventDefault();
  };

  var uploadInputChangeHandler = function () {
    imageSetup.classList.remove('hidden');
    document.body.classList.add('modal-open');
    imageSetupClose.addEventListener('click', setupCloseClickHandler);
    document.addEventListener('keydown', setupEscKeypressHandler);
    hashtagInput.addEventListener('keydown', window.util.escapeStopPropagationHandler);
    descriptionInput.addEventListener('keydown', window.util.escapeStopPropagationHandler);
    window.scale.addScaleListener(scaleInterface, setImageScale);
    uploadForm.addEventListener('submit', formSubmitHandler);
    if (!uploadForm.getAttribute('action')) {
      uploadForm.setAttribute('action', FORM_ACTION);
    }
    effectLevelInterface.classList.add('hidden');
    window.filter.addFilterClickHandler(effectsList, handleImageEffect);
    effectLevelInput.value = '';
  };

  window.imageSetup = {
    uploadInputChangeHandler: uploadInputChangeHandler,
  };
})();
