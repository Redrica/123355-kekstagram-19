'use strict';
(function () {
  // var PICTURS_QUANTITY = 25;

  var Code = {
    ENTER_KEY: 'Enter',
    ESCAPE_KEY: 'Escape'
  };

// // создаем сущность фотографии по объекту
//   var createPictureElement = function (picture) {
//     var pictureElement = document.querySelector('#picture').content.querySelector('.picture').cloneNode(true);
//     pictureElement.querySelector('.picture__img').src = picture.url;
//     pictureElement.querySelector('.picture__likes').textContent = picture.likes;
//     pictureElement.querySelector('.picture__comments').textContent = picture.comments.length + '';
//     return pictureElement;
//   };

// // отрисовка фотографий
//   var renderPictures = function (pictures) {
//     var picturesFragment = document.createDocumentFragment();
//     for (var i = 0; i < pictures.length; i++) {
//       picturesFragment.appendChild(createPictureElement(pictures[i]));
//     }
//     return picturesFragment;
//   };

// // итоговый массив с фотографиями для отрисовки
//   var pictures = window.generation.generatePictures(PICTURS_QUANTITY);

// // отрисовка в DOM
//   var picturesPlace = document.querySelector('.pictures');
//   picturesPlace.appendChild(renderPictures(pictures));

// работа с fullsize изображением
  //var fullPicture = document.querySelector('.big-picture');
// показ полноразмерного фото, временно скрыто
  //fullPicture.classList.remove('hidden');

// // функция для создания разметки одного комментария
//   var createCommentLayout = function (comment) {
//     var commentFragment = document.createDocumentFragment();
//     var commentElement = document.createElement('li');
//     var commentPicture = document.createElement('img');
//     var commentText = document.createElement('p');
//
//     commentFragment.appendChild(commentElement);
//     commentElement.classList.add('social__comment');
//
//     commentElement.appendChild(commentPicture);
//     commentPicture.classList.add('social__picture');
//     commentPicture.src = comment.avatar;
//     commentPicture.alt = comment.name;
//
//     commentElement.appendChild(commentText);
//     commentText.classList.add('social__text');
//     commentText.textContent = comment.message;
//
//     return commentFragment;
//   };
//
// // функция отрисовки блока комментариев
//   var renderComments = function (picture) {
//     var commentsFragment = document.createDocumentFragment();
//     for (var i = 0; i < picture.comments.length; i++) {
//       commentsFragment.appendChild(createCommentLayout(picture.comments[i]));
//     }
//
//     var commentsParentElement = fullPicture.querySelector('.social__comments');
//     commentsParentElement.innerHTML = '';
//     commentsParentElement.appendChild(commentsFragment);
//   };

// // функция отрисовки полноразмерной фотографии со всеми причитающимися.
//   var renderFullPicture = function (picture) {
//     fullPicture.querySelector('.big-picture__img img').src = picture.url;
//     fullPicture.querySelector('.likes-count').textContent = picture.likes;
//     fullPicture.querySelector('.comments-count').textContent = picture.comments.length.toString();
//     fullPicture.querySelector('.social__caption').textContent = picture.description;
//
//     renderComments(picture);
//   };
//
//   renderFullPicture(pictures[0]);

  // var commentCount = fullPicture.querySelector('.social__comment-count');
  // var commentsLoader = fullPicture.querySelector('.comments-loader');
  // commentCount.classList.add('hidden');
  // commentsLoader.classList.add('hidden');

// для показа полноразмерного фото, временно скрыто
// document.body.classList.add('modal-open');

// работа с загрузкой фотографии
  var PERSENT_FACTOR = 100;

  var uploadForm = document.querySelector('.img-upload__form');
  var uploadInput = uploadForm.querySelector('#upload-file');
  var imageSetup = uploadForm.querySelector('.img-upload__overlay');
  var imageSetupClose = uploadForm.querySelector('#upload-cancel');
  var loadedPicture = uploadForm.querySelector('.img-upload__preview img');
  var descriptionInput = uploadForm.querySelector('.text__description');
  var hashtagInput = uploadForm.querySelector('.text__hashtags');

  var scaleInterface = uploadForm.querySelector('.scale');


  function setSetupToInitial() {
    uploadInput.value = '';
    descriptionInput.value = ''; // TODO: перенести в валидацию
    // TODO: доработать установку начального эффекта при закрытии окна без отправки формы. setEffectValueToInitial()+
  }

  function closeSetup() {
    imageSetup.classList.add('hidden');
    document.body.classList.remove('modal-open');
    imageSetupClose.removeEventListener('click', setupCloseClickHandler);
    document.removeEventListener('keydown', setupEscKeypressHandler);
    window.scale.removeScaleListener(scaleInterface);
    window.validation.cleanValidation(uploadForm);
    setSetupToInitial();
  }

  function setupCloseClickHandler() {
    closeSetup();
  }

  function setupEscKeypressHandler(evt) {
    if (evt.key === Code.ESCAPE_KEY && document.activeElement !== hashtagInput) {
      closeSetup();
    }
  }

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
  };

  uploadInput.addEventListener('change', uploadInputChangeHandler);

// ////////////////////
// фильтры на фото
// ////////////////////

  //var loadedPicture = uploadForm.querySelector('.img-upload__preview img');
// я помню, что константы надо в начало выносить, но поскольку впереди разделение на модули – тут их проще не потерять в процессе.
  var EFFECT_CLASS_SUBSTRING = 'effects__preview--';
  var NO_EFFECT = 'none';
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
  var effectLevelInterface = uploadForm.querySelector('.effect-level');
  var effectLevelFull = effectLevelInterface.querySelector('.effect-level__line');
  var effectControl = effectLevelInterface.querySelector('.effect-level__pin');
  // var effectLevelStripe = effectLevelInterface.querySelector('.effect-level__depth');
  var effectsList = uploadForm.querySelector('.effects__list');
  var effectLevelInput = effectLevelInterface.querySelector('.effect-level__value');
  var effectInterfaceParams = {
    fullValue: 0,
    controlWidth: 0,
    CONTROL_MIN_COORD: '0px',
    controlMaxCoord: 0,
    initial: true,
    isShown: false,
  };

  var currentEffectClass = EFFECT_CLASS_SUBSTRING + document.querySelector('.effects__radio:checked').value;
  loadedPicture.classList.add(currentEffectClass);
  effectLevelInterface.classList.add('hidden');

  // функция, применяющая эффект при выборе фильтра
  function changeImageEffect(effect) {
    loadedPicture.classList.remove(currentEffectClass);
    currentEffectClass = EFFECT_CLASS_SUBSTRING + effect;
    loadedPicture.classList.add(currentEffectClass);
    loadedPicture.style.filter = '';
  }

  // функция-обработчик клика по превьюшкам фильтра. Должна применить эффект и в зависимости от выбранного скрыть/показать/и т.п. контрол уровня.
  function effectListClickHandler(evt) {
    if (evt.target.tagName === 'INPUT') {
      var newEffect = evt.target.value;
      var newEffectClass = EFFECT_CLASS_SUBSTRING + newEffect;
      if (!loadedPicture.classList.contains(newEffectClass)) { // проверяем, должен ли измениться эффект, если да, то ->
        changeImageEffect(newEffect);
        handleEffectInterface(newEffect);
      }
    }
  }

  function hideEffectInterface() {
    effectLevelInterface.classList.add('hidden');
    effectControl.removeEventListener('mouseup', effectControlMouseupHandler);
    effectInterfaceParams.isShown = false;
  }

  function showEffectInterface() {
    effectLevelInterface.classList.remove('hidden');
    effectControl.addEventListener('mouseup', effectControlMouseupHandler);
    effectInterfaceParams.isShown = true;
  }

  // функция, обрабатывающая поведение контрола уровня эффекта
  function handleEffectInterface(effect) {
    if (effect === NO_EFFECT) { // переключились с любого эффекта на ORIGIN, настройки не нужны
      hideEffectInterface();
    } else {
      if (!effectInterfaceParams.isShown) {
        showEffectInterface();
      }
      if (effectInterfaceParams.initial && effectInterfaceParams.isShown) {
        getInitialEffectParams();
      }
      // setEffectValueToInitial(); // отключено, иначе обработку mouseUp без D&D не видно
    }
  }

  // TODO: исправить сокращения - не Coord, а Coordinate or so.
  function getInitialEffectParams() {
    effectInterfaceParams.fullValue = effectLevelFull.offsetWidth;
    effectInterfaceParams.controlWidth = effectControl.offsetWidth;
    effectInterfaceParams.controlMaxCoord = effectInterfaceParams.fullValue + 'px';
    effectInterfaceParams.initial = false;
  }

  // понадобится для установки значения при переключении эффекта
  // var setEffectValueToInitial = function () {
  //   effectControl.style.left = effectInterfaceParams.controlMaxCoord;
  //   effectLevelStripe.style.width = '100%';
  //   var currentEffectValue = document.querySelector('.effects-radio:checked').value;
  //   effectLevelInput.value = Filter[currentEffectValue].MAX;
  // };

  effectsList.addEventListener('click', effectListClickHandler);

  // функция, возвращающая строку для записи в style картинки
  function getStyleFilterRule(filter, effectValue) {
    return filter.FILTER + '(' + window.util.getCustomIntervalValue(filter.MIN, filter.MAX, effectValue) + filter.UNIT + ')';
  }

  function setEffectValue(effectValue) {
    // записываем значение в input для отправки
    effectLevelInput.value = effectValue;
    var currentFilter = document.querySelector('.effects__radio:checked').value;
    loadedPicture.style.filter = getStyleFilterRule(Filter[currentFilter], effectValue);
  }

  function effectControlMouseupHandler() {
    var controlFractionValue = (effectControl.offsetLeft / effectInterfaceParams.fullValue).toFixed(2);
    setEffectValue(controlFractionValue);
  }

})();
