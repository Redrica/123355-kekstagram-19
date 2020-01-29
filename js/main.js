'use strict';

var Picture = {
  PICTURE_URL_SUBSTRING: 'photos/',
  PICTURE_EXTENSION: '.jpg',
  PICTURE_NUMBER_MIN: 1,
  PICTURE_NUMBER_MAX: 25,
  DESCRIPTION: 'Описание вот этой конкретной фотографии – ',
  LIKES_MIN: 15,
  LIKES_MAX: 200,
  Comment: {
    AVATAR_URL_SUBSTRING: 'img/avatar-',
    AVATAR_EXTENSION: '.svg',
    AVATAR_NUMBER_MIN: 1,
    AVATAR_NUMBER_MAX: 6,
    MESSAGES: [
      'Всё отлично!',
      'В целом всё неплохо. Но не всё.',
      'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
      'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
      'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
      'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
    ],
    MIN_MESSAGE_STRINGS: 1,
    MAX_MESSAGE_STRINGS: 2,
    NAMES: ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'],
    COMMENTS_QUANTITY_MIN: 0,
    COMMENTS_QUANTITY_MAX: 10,
  }
};

// получение случайного целого числа от min до max
var getRandomNumber = function (min, max) {
  var minNumber = min ? min : 0;
  return Math.floor(Math.random() * (max - minNumber + 1)) + minNumber;
};

// создание массива последовательных значений целых чисел от min до max
var makeNumericArray = function (min, max) {
  var numericArray = [];
  for (var i = min; i <= max; i++) {
    numericArray.push(i);
  }
  return numericArray;
};

// перемешивание массива
var shuffleArray = function (array) {
  var j;
  var temp;
  for (var i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
};

// генерация текста сообщения из случайного количества строк по массиву строк
var generateCommentMessage = function () {
  var stringsQuantity = getRandomNumber(Picture.Comment.MIN_MESSAGE_STRINGS, Picture.Comment.MAX_MESSAGE_STRINGS);
  var message = '';
  for (var i = 0; i < stringsQuantity; i++) {
    message += Picture.Comment.MESSAGES[getRandomNumber(false, (Picture.Comment.MESSAGES.length - 1))] + ' ';
  }
  return message;
};

// генерация объекта комментария
var generateComment = function () {
  return {
    avatar: Picture.Comment.AVATAR_URL_SUBSTRING + getRandomNumber(Picture.Comment.AVATAR_NUMBER_MIN, Picture.Comment.AVATAR_NUMBER_MAX) + Picture.Comment.AVATAR_EXTENSION,
    message: generateCommentMessage(),
    name: Picture.Comment.NAMES[getRandomNumber(false, (Picture.Comment.NAMES.length - 1))],
  };
};

// сбор массива комментариев для одного фото
var makePictureCommentsArray = function () {
  var commentsQuantity = getRandomNumber(Picture.Comment.COMMENTS_QUANTITY_MIN, Picture.Comment.COMMENTS_QUANTITY_MAX);
  var pictureComments = [];
  for (var i = 0; i < commentsQuantity; i++) {
    pictureComments.push(generateComment());
  }
  return pictureComments;
};

// создание массива c объектами фотографий фотографий
var generatePictures = function (quantity, numbers) {
  var picturesObjectsArray = [];
  for (var i = 0; i < quantity; i++) {
    var picture = {
      url: Picture.PICTURE_URL_SUBSTRING + numbers[i] + Picture.PICTURE_EXTENSION,
      description: Picture.DESCRIPTION + numbers[i] + Picture.PICTURE_EXTENSION,
      likes: getRandomNumber(Picture.LIKES_MIN, Picture.LIKES_MAX),
      comments: makePictureCommentsArray(),
    };
    picturesObjectsArray.push(picture);
  }
  return picturesObjectsArray;
};

// создаем сущность фотографии по объекту
var createPictureElement = function (pictureObject) {
  var pictureElement = document.querySelector('#picture').content.querySelector('.picture').cloneNode(true);
  pictureElement.querySelector('.picture__img').src = pictureObject.url;
  pictureElement.querySelector('.picture__likes').textContent = pictureObject.likes;
  pictureElement.querySelector('.picture__comments').textContent = pictureObject.comments.length + '';
  return pictureElement;
};

// отрисовка фотографий
var renderPictures = function (picturesObjectsArray) {
  var picturesFragment = document.createDocumentFragment();
  for (var i = 0; i < picturesObjectsArray.length; i++) {
    picturesFragment.appendChild(createPictureElement(picturesObjectsArray[i]));
  }
  return picturesFragment;
};

// массив с уникальными номерами фотографий
var pictureNumbers = shuffleArray(makeNumericArray(Picture.PICTURE_NUMBER_MIN, Picture.PICTURE_NUMBER_MAX));

// итоговый массив с фотографиями для отрисовки
var pictures = generatePictures(Picture.PICTURE_NUMBER_MAX, pictureNumbers);

// отрисовка в DOM
var picturesPlace = document.querySelector('.pictures');
picturesPlace.appendChild(renderPictures(pictures));
