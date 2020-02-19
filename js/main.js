'use strict';

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

// получение случайного целого числа от min до max
var getRandomNumber = function (max, min) {
  var minNumber = min ? min : 0;
  return Math.round(Math.random() * (max - minNumber)) + minNumber;
};

// генерация текста сообщения из случайного количества строк по массиву строк
var generateCommentMessage = function () {
  var stringsQuantity = getRandomNumber(UserComment.MIN_MESSAGE_STRINGS, UserComment.MAX_MESSAGE_STRINGS);
  var message = '';
  for (var i = 0; i < stringsQuantity; i++) {
    message += MESSAGES[getRandomNumber(false, (MESSAGES.length - 1))] + ' ';
  }
  return message;
};

// генерация объекта комментария
var generateComment = function () {
  return {
    avatar: UserComment.AVATAR_URL_SUBSTRING + getRandomNumber(UserComment.AVATAR_NUMBER_MIN, UserComment.AVATAR_NUMBER_MAX) + UserComment.AVATAR_EXTENSION,
    message: generateCommentMessage(),
    name: UserComment.NAMES[getRandomNumber((UserComment.NAMES.length - 1))],
  };
};

// сбор массива комментариев для одного фото
var makePictureCommentsArray = function () {
  var commentsQuantity = getRandomNumber(UserComment.COMMENTS_QUANTITY_MIN, UserComment.COMMENTS_QUANTITY_MAX);
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
      likes: getRandomNumber(Picture.LIKES_MIN, Picture.LIKES_MAX),
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
var uploadInput = document.querySelector('#upload-file');
var imageSetup = document.querySelector('.img-upload__overlay');
var imageSetupClose = imageSetup.querySelector('#upload-cancel');
var hashtagInput = imageSetup.querySelector('.text__hashtags');

var closeSetup = function () {
  imageSetup.classList.add('hidden');
  document.body.classList.remove('modal-open');
  uploadInput.value = '';
  imageSetupClose.removeEventListener('click', editCloseClickHandler);
  document.removeEventListener('keydown', setupEscKeypressHandler);
};

var editCloseClickHandler = function () {
  closeSetup();
};

var setupEscKeypressHandler = function (evt) {
  if (evt.key === Code.ESCAPE_KEY && document.activeElement !== hashtagInput) {
    closeSetup();
  }
};

var uploadInputChangeHandler = function () {
  imageSetup.classList.remove('hidden');
  document.body.classList.add('modal-open');
  imageSetupClose.addEventListener('click', editCloseClickHandler);
  document.addEventListener('keydown', setupEscKeypressHandler);
};

uploadInput.addEventListener('change', uploadInputChangeHandler);

var loadedPicture = imageSetup.querySelector('.img-upload__preview img');
// я помню, что константы надо в начало выносить, но поскольку впереди разделение на модули – тут их проще не потерять в процессе.
var EFFECT_CLASS_SUBSTRING = 'effects__preview--';
var NO_EFFECT_CLASS = 'effects__preview--none';
var Filter = {
  CHROME: {
    NAME: 'chrome',
    FILTER: 'grayscale',
    MIN: 0,
    MAX: 1,
  },
  SEPIA: {
    NAME: 'sepia',
    FILTER: 'sepia',
    MIN: 0,
    MAX: 1,
  },
  MARVIN: {
    NAME: 'marvin',
    FILTER: 'invert',
    MIN: 0,
    MAX: 100,
  },
  PHOBOS: {
    NAME: 'phobos',
    FILTER: 'blur',
    MIN: 0,
    MAX: 3,
  },
  HEAT: {
    NAME: 'heat',
    FILTER: 'brightness',
    MIN: 1,
    MAX: 3,
  },
};
var effectLevelInterface = imageSetup.querySelector('.effect-level');
var effectLevelFull = effectLevelInterface.querySelector('.effect-level__line');
var effectControl = effectLevelInterface.querySelector('.effect-level__pin');
var effectLevelStripe = effectLevelInterface.querySelector('.effect-level__depth');
var effectsList = imageSetup.querySelector('.effects__list');
var effectLevelInput = effectLevelInterface.querySelector('.effect-level__value');
var currentEffectValue = 'none';
var currentEffectClass = NO_EFFECT_CLASS;
var effect = {
  fullValue: 0,
  controlWidth: 0,
  controlMinCoord: '0px',
  controlMaxCoord: 0,
  initial: true,
};

loadedPicture.classList.add(currentEffectClass);
effectLevelInterface.classList.add('hidden');

var changeImageEffect = function (evt) {
  loadedPicture.classList.remove(currentEffectClass);
  currentEffectValue = evt.target.value;
  currentEffectClass = EFFECT_CLASS_SUBSTRING + currentEffectValue;
  loadedPicture.classList.add(currentEffectClass);
  loadedPicture.style.filter = '';
};

var effectListClickHandler = function (evt) {
  if (evt.target.tagName === 'INPUT') {

    var newEffectClass = EFFECT_CLASS_SUBSTRING + evt.target.value;
    if (!loadedPicture.classList.contains(newEffectClass)) { // проверяем, должен ли измениться эффект, если да, то ->
      changeImageEffect(evt);

      if (newEffectClass === NO_EFFECT_CLASS) { // переключились с любого эффекта на ORIGIN, скрыли ползунок настройки
        effectLevelInterface.classList.add('hidden');
        effectControl.removeEventListener('mouseup', effectControlMouseupHandler);
      } else if (effectLevelInterface.classList.contains('hidden')) { // переключились с ORIGIN на любой другой эффект, показали ползунок настройки
        effectLevelInterface.classList.remove('hidden');
        effectControl.addEventListener('mouseup', effectControlMouseupHandler);

        if (effect.initial) {
          getInitialEffectParams();
        }
        // setEffectValueToInitial(); // временно скрыто, чтобы показать обработку mouseup
      }
    }
  }
};

var getInitialEffectParams = function () {
  effect.fullValue = effectLevelFull.offsetWidth;
  effect.controlWidth = effectControl.offsetWidth;
  effect.controlMaxCoord = effect.fullValue + 'px';
  effect.initial = false;
};

// понадобится для установки значения ползунка при переключении эффекта
var setEffectValueToInitial = function () {
  effectControl.style.left = effect.controlMaxCoord;
  effectLevelStripe.style.width = '100%';
  // обновить значение effectLevelInput
};

effectsList.addEventListener('click', effectListClickHandler);

var getCustomIntervalValue = function (minValue, maxValue, currentValue) {
  var interval = maxValue - minValue;
  return currentValue * interval + minValue;
};

var setEffectValue = function (effectValue) {
  effectLevelInput.value = effectValue;
  switch (currentEffectValue) {
    case Filter.CHROME.NAME:
      loadedPicture.style.filter = Filter.CHROME.FILTER + '(' + getCustomIntervalValue(Filter.CHROME.MIN, Filter.CHROME.MAX, effectValue) + ')';
      break;
    case Filter.SEPIA.NAME:
      loadedPicture.style.filter = Filter.SEPIA.FILTER + '(' + getCustomIntervalValue(Filter.SEPIA.MIN, Filter.SEPIA.MAX, effectValue) + ')';
      break;
    case Filter.MARVIN.NAME:
      loadedPicture.style.filter = Filter.MARVIN.FILTER + '(' + getCustomIntervalValue(Filter.MARVIN.MIN, Filter.MARVIN.MAX, effectValue) + '%)';
      break;
    case Filter.PHOBOS.NAME:
      loadedPicture.style.filter = Filter.PHOBOS.FILTER + '(' + getCustomIntervalValue(Filter.PHOBOS.MIN, Filter.PHOBOS.MAX, effectValue) + 'px)';
      break;
    case Filter.HEAT.NAME:
      loadedPicture.style.filter = Filter.HEAT.FILTER + '(' + getCustomIntervalValue(Filter.HEAT.MIN, Filter.HEAT.MAX, effectValue) + ')';
      break;
    default:
      break;
  }
};

var effectControlMouseupHandler = function () {
  var controlRelativeValue = effectControl.offsetLeft / effect.fullValue;
  setEffectValue(controlRelativeValue);
};
