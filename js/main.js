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
fullPicture.classList.remove('hidden');

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

var body = document.body;
body.classList.add('modal-open');
