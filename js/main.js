'use strict';
(function () {

  var MESSAGES = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  var Picture = {
    PICTURE_URL_SUBSTRING: 'photos/',
    PICTURE_EXTENSION: '.jpg',
    PICTURE_NUMBER_MIN: 1,
    PICTURE_NUMBER_MAX: 25,
    DESCRIPTION: 'Описание вот этой конкретной фотографии – ',
    LIKES_MIN: 15,
    LIKES_MAX: 200,
  };

// Eslint: Comment is already defined as built-in (…). Не нашла Comment в списке зарезервированных слов Оо, но низя так низя.
  var UserComment = {
    AVATAR_URL_SUBSTRING: 'img/avatar-',
    AVATAR_EXTENSION: '.svg',
    AVATAR_NUMBER_MIN: 1,
    AVATAR_NUMBER_MAX: 6,
    MIN_MESSAGE_STRINGS: 1,
    MAX_MESSAGE_STRINGS: 2,
    NAMES: ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'],
    COMMENTS_QUANTITY_MIN: 0,
    COMMENTS_QUANTITY_MAX: 10,
  };

  var Code = {
    ENTER_KEY: 'Enter',
    ESCAPE_KEY: 'Escape'
  };

// генерация текста сообщения из случайного количества строк по массиву строк
  var generateCommentMessage = function () {
    var stringsQuantity = window.util.getRandomNumber(UserComment.MIN_MESSAGE_STRINGS, UserComment.MAX_MESSAGE_STRINGS);
    var message = '';
    for (var i = 0; i < stringsQuantity; i++) {
      message += MESSAGES[window.util.getRandomNumber(false, (MESSAGES.length - 1))] + ' ';
    }
    return message;
  };

// генерация объекта комментария
  var generateComment = function () {
    return {
      avatar: UserComment.AVATAR_URL_SUBSTRING + window.util.getRandomNumber(UserComment.AVATAR_NUMBER_MIN, UserComment.AVATAR_NUMBER_MAX) + UserComment.AVATAR_EXTENSION,
      message: generateCommentMessage(),
      name: UserComment.NAMES[window.util.getRandomNumber((UserComment.NAMES.length - 1))],
    };
  };

// сбор массива комментариев для одного фото
  var makePictureCommentsArray = function () {
    var commentsQuantity = window.util.getRandomNumber(UserComment.COMMENTS_QUANTITY_MIN, UserComment.COMMENTS_QUANTITY_MAX);
    var pictureComments = [];
    for (var i = 0; i < commentsQuantity; i++) {
      pictureComments.push(generateComment());
    }
    return pictureComments;
  };

// создание массива c объектами фотографий фотографий
  var generatePictures = function (quantity) {
    var pictures = [];
    for (var i = 0; i < quantity; i++) {
      var picture = {
        url: Picture.PICTURE_URL_SUBSTRING + (i + 1) + Picture.PICTURE_EXTENSION,
        description: Picture.DESCRIPTION + (i + 1) + Picture.PICTURE_EXTENSION,
        likes: window.util.getRandomNumber(Picture.LIKES_MIN, Picture.LIKES_MAX),
        comments: makePictureCommentsArray(),
      };
      pictures.push(picture);
    }
    return pictures;
  };

// создаем сущность фотографии по объекту
  var createPictureElement = function (picture) {
    var pictureElement = document.querySelector('#picture').content.querySelector('.picture').cloneNode(true);
    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length + '';
    return pictureElement;
  };

// отрисовка фотографий
  var renderPictures = function (pictures) {
    var picturesFragment = document.createDocumentFragment();
    for (var i = 0; i < pictures.length; i++) {
      picturesFragment.appendChild(createPictureElement(pictures[i]));
    }
    return picturesFragment;
  };

// итоговый массив с фотографиями для отрисовки
  var pictures = generatePictures(Picture.PICTURE_NUMBER_MAX);

// отрисовка в DOM
  var picturesPlace = document.querySelector('.pictures');
  picturesPlace.appendChild(renderPictures(pictures));

// работа с fullsize изображением
  var fullPicture = document.querySelector('.big-picture');
// показ полноразмерного фото, временно скрыто
// fullPicture.classList.remove('hidden');

// функция для создания разметки одного комментария
  var createCommentLayout = function (comment) {
    var commentFragment = document.createDocumentFragment();
    var commentElement = document.createElement('li');
    var commentPicture = document.createElement('img');
    var commentText = document.createElement('p');

    commentFragment.appendChild(commentElement);
    commentElement.classList.add('social__comment');

    commentElement.appendChild(commentPicture);
    commentPicture.classList.add('social__picture');
    commentPicture.src = comment.avatar;
    commentPicture.alt = comment.name;

    commentElement.appendChild(commentText);
    commentText.classList.add('social__text');
    commentText.textContent = comment.message;

    return commentFragment;
  };

// функция отрисовки блока комментариев
  var renderComments = function (picture) {
    var commentsFragment = document.createDocumentFragment();
    for (var i = 0; i < picture.comments.length; i++) {
      commentsFragment.appendChild(createCommentLayout(picture.comments[i]));
    }

    var commentsParentElement = fullPicture.querySelector('.social__comments');
    commentsParentElement.innerHTML = '';
    commentsParentElement.appendChild(commentsFragment);
  };

// функция отрисовки полноразмерной фотографии со всеми причитающимися.
  var renderFullPicture = function (picture) {
    fullPicture.querySelector('.big-picture__img img').src = picture.url;
    fullPicture.querySelector('.likes-count').textContent = picture.likes;
    fullPicture.querySelector('.comments-count').textContent = picture.comments.length.toString();
    fullPicture.querySelector('.social__caption').textContent = picture.description;

    renderComments(picture);
  };

  renderFullPicture(pictures[0]);

  var commentCount = fullPicture.querySelector('.social__comment-count');
  var commentsLoader = fullPicture.querySelector('.comments-loader');
  commentCount.classList.add('hidden');
  commentsLoader.classList.add('hidden');

// для показа полноразмерного фото, временно скрыто
// document.body.classList.add('modal-open');

// работа с загрузкой фотографии
  var PERSENT_FACTOR = 100;

  var uploadForm = document.querySelector('.img-upload__form');
  var uploadInput = uploadForm.querySelector('#upload-file');
  var imageSetup = uploadForm.querySelector('.img-upload__overlay');
  var imageSetupClose = uploadForm.querySelector('#upload-cancel');
  var loadedPicture = uploadForm.querySelector('.img-upload__preview img');

  var scaleInterface = uploadForm.querySelector('.scale');


  function setSetupToInitial() {
    uploadInput.value = '';
    hashtagInput.value = '';
    descriptionInput.value = '';
    // TODO: доработать установку начального эффекта при закрытии окна без отправки формы. setEffectValueToInitial()+
  }

  function closeSetup() {
    imageSetup.classList.add('hidden');
    document.body.classList.remove('modal-open');
    imageSetupClose.removeEventListener('click', setupCloseClickHandler);
    document.removeEventListener('keydown', setupEscKeypressHandler);
    window.scale.removeScaleListener(scaleInterface);
    cleanError();
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
    // TODO: сделать какую-то функцию setInitial?
    setImageScale(window.scale.Scale.INITIAL);
    scaleInterface.querySelector('input').value = window.scale.Scale.INITIAL + '%';

    // window.scale.addScaleListener(scaleInterface, function (scale) {
    //   setImageScale(scale);
    // });
    window.scale.addScaleListener(scaleInterface, setImageScale);
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

// ////////////
// валидация хэштегов
// ///////////

  var ErrorMessage = {
    QUANTITY_LIMIT: 'Можно задать не более пяти хэштегов.', // доработать на расчет кол-ва, т.к  может быть другое ограничение?
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
  };

  var hashtagInput = uploadForm.querySelector('.text__hashtags');
  var descriptionInput = uploadForm.querySelector('.text__description');

  function getValuesArray(input) {
    input.value = input.value.trim();
    if (input.value === '') {
      return [];
    }
    return input.value.toLowerCase().split(/\s+/);
  }

  function addError(errorsArray, error) {
    if (errorsArray.indexOf(error) === -1) {
      errorsArray.push(error);
    }
  }

  function checkHashSymbol(hashtag, errorsArray) {
    if (hashtag[0] !== '#') {
      addError(errorsArray, ErrorMessage.FIRST_SYMBOL);
    }
  }

  function checkHashtagMinLength(hashtag, errorsArray) {
    if (hashtag.length < HashStingParam.MIN_LENGTH && hashtag[0] === '#') {
      addError(errorsArray, ErrorMessage.MIN_LENGTH);
    }
  }

  function checkHashtagMaxLength(hashtag, errorsArray) {
    if (hashtag.length > HashStingParam.MAX_LENGTH) {
      addError(errorsArray, ErrorMessage.MAX_LENGTH);
    }
  }

  function checkCorrectSymbols(hashtag, errorsArray) {
    if (!hashtag.match(/^#?[а-яёa-z\d]+$/)) {
      addError(errorsArray, ErrorMessage.INCORRECT_SYMBOL);
    }
  }

  function checkRepetiion(hashtag, errorsArray, hashtagsArray, currentIndex) {
    if (hashtagsArray.indexOf(hashtag, currentIndex + 1) > 0) {
      addError(errorsArray, ErrorMessage.NO_REPETITION);
    }
  }

  function checkHashtags(hashtagsArray) {
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
  }

  function createErrorMessage() {
    var errorMessage = document.createElement('p');
    errorMessage.classList.add('text__error');
    hashtagInput.parentElement.insertBefore(errorMessage, hashtagInput.nextSibling);
  }

  function setErrorCondition(errors) {
    if (!document.querySelector('.text__error')) {
      createErrorMessage();
    }
    var errorMessage = document.querySelector('.text__error');
    errorMessage.textContent = errors.join(' ');
  }

  function cleanError() {
    var errorMessage = document.querySelector('.text__error');
    if (errorMessage) {
      errorMessage.textContent = '';
    }
  }

  function inputFocusHandler() {
    cleanError();
  }

  function submitFormHandler(evt) {
    var hashtags = getValuesArray(hashtagInput);
    var errors = checkHashtags(hashtags);

    if (errors.length > 0) {
      setErrorCondition(errors);
      evt.preventDefault();
      hashtagInput.addEventListener('focus', inputFocusHandler);
    } else {
      //evt.preventDefault();
      console.log('Все ок!');
    }
  }

  uploadForm.addEventListener('submit', submitFormHandler);

  /**
   + 1. Хэштег должен начинаться с #.
   + 2. Содержит только буквы и числа.
   + 3. Не может состоять только из #.
   + 4. Максимальная длина 20 символов вместе с #.
   + 5. Регистр не учитывается, аа === АА.
   + 6. Разделены пробелами. Любым количеством!
   + 7. Не повторяются.
   + 8. Максимум 5 штук.
   + 9. Могут вообще отсутствовать.
   */

// #котик #синий #джинСкот
})();
