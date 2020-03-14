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

  window.generation = {
    generatePictures: generatePictures,
  };
})();
