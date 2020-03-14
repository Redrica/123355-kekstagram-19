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

  var Code = {
    ENTER_KEY: 'Enter',
    ESCAPE_KEY: 'Escape'
  };

// работа с загрузкой фотографии
  var FORM_ACTION = 'https://js.dump.academy/kekstagram';
  var PERSENT_FACTOR = 100;
  var EFFECT_CLASS_SUBSTRING = 'effects__preview--';
  var NO_EFFECT = 'none';

  var uploadForm = document.querySelector('.img-upload__form');
  var uploadInput = uploadForm.querySelector('#upload-file');
  var imageSetup = uploadForm.querySelector('.img-upload__overlay');
  var imageSetupClose = uploadForm.querySelector('#upload-cancel');
  var loadedPicture = uploadForm.querySelector('.img-upload__preview img');
  // var descriptionInput = uploadForm.querySelector('.text__description');
  var hashtagInput = uploadForm.querySelector('.text__hashtags');

  var scaleInterface = uploadForm.querySelector('.scale');
  var effectsList = uploadForm.querySelector('.effects__list');
  var effectLevelInterface = uploadForm.querySelector('.effect-level');
  var effectLevelInput = effectLevelInterface.querySelector('.effect-level__value');


  var currentEffect;

  var setSetupToInitial = function () {
    uploadInput.value = '';
    loadedPicture.classList.remove(EFFECT_CLASS_SUBSTRING + currentEffect);
    effectLevelInput.value = '';

    //descriptionInput.value = ''; // TODO: перенести в валидацию
    // TODO: доработать установку начального эффекта при закрытии окна без отправки формы. setEffectValueToInitial()+
  };

  var closeSetup = function () {
    imageSetup.classList.add('hidden');
    document.body.classList.remove('modal-open');
    imageSetupClose.removeEventListener('click', setupCloseClickHandler);
    document.removeEventListener('keydown', setupEscKeypressHandler);
    window.scale.removeScaleListener(scaleInterface);
    window.validation.cleanValidation(uploadForm);
    setSetupToInitial();

    // effectsList.removeEventListener('click', effectListClickHandler);
    window.filter.removeFilterClickHandler(effectsList);
    window.filterControlInterface.removeControlListener(effectLevelInterface);
  };

  var setupCloseClickHandler = function () {
    closeSetup();
  };

  var setupEscKeypressHandler = function (evt) {
    if (evt.key === Code.ESCAPE_KEY && document.activeElement !== hashtagInput) {
      closeSetup();
    }
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

  var setImageScale = function (scale) {
    loadedPicture.style.transform = 'scale(' + scale / PERSENT_FACTOR + ')';
  };

  var uploadInputChangeHandler = function () {
    imageSetup.classList.remove('hidden');
    document.body.classList.add('modal-open');
    imageSetupClose.addEventListener('click', setupCloseClickHandler);
    document.addEventListener('keydown', setupEscKeypressHandler);

    window.scale.addScaleListener(scaleInterface, setImageScale);
    window.validation.addSubmitListener(uploadForm);
    if (!uploadForm.getAttribute('action')) {
      uploadForm.setAttribute('action', FORM_ACTION);
    }

    effectLevelInterface.classList.add('hidden');
    currentEffect = NO_EFFECT;
    window.filter.addFilterClickHandler(effectsList, handleImageEffect);
  };

  uploadInput.addEventListener('change', uploadInputChangeHandler);

  // понадобится для установки значения при переключении эффекта
  // var setEffectValueToInitial = function () {
  //   effectControl.style.left = effectInterfaceParams.controlMaxCoordinate;
  //   effectLevelStripe.style.width = '100%';
  //   var currentEffectValue = document.querySelector('.effects-radio:checked').value;
  //   effectLevelInput.value = Filter[currentEffectValue].MAX;
  // };

  // функция, возвращающая строку для записи в style картинки
  var getStyleFilterRule = function (filter, effectValue) {
    return filter.FILTER + '(' + window.util.getCustomIntervalValue(filter.MIN, filter.MAX, effectValue) + filter.UNIT + ')';
  };

  var setEffectValue = function (effect, effectValue) {
    // записываем значение в input для отправки
    effectLevelInput.value = effectValue * PERSENT_FACTOR;
    loadedPicture.style.filter = getStyleFilterRule(Filter[effect], effectValue);
  };
})();
