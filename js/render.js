'use strict';

(function () {
  var PICTURS_QUANTITY = 25;
  var fullPicture = document.querySelector('.big-picture');
  var commentCount = fullPicture.querySelector('.social__comment-count');
  var commentsLoader = fullPicture.querySelector('.comments-loader');

  var picturesGenerated = window.generation.generatePictures(PICTURS_QUANTITY);

  // //////////
  // рендер превьюшек
  // /////////

  // создаем сущность фотографии по объекту
  var createPictureElement = function (picture) {
    var pictureElement = document.querySelector('#picture').content.querySelector('.picture').cloneNode(true);
    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length + '';
    return pictureElement;
  };

  // отрисовка фотографий
  var renderPictures = function (picturesData) {
    var picturesFragment = document.createDocumentFragment();
    for (var i = 0; i < picturesData.length; i++) {
      picturesFragment.appendChild(createPictureElement(picturesData[i]));
    }
    return picturesFragment;
  };

  // отрисовка в DOM
  var picturesPlace = document.querySelector('.pictures');
  picturesPlace.appendChild(renderPictures(picturesGenerated));

  // //////////
  // рендер увеличенной фотографии
  // /////////

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

  renderFullPicture(picturesGenerated[0]);

  // ////////////
  // временно по заданию
  commentCount.classList.add('hidden');
  commentsLoader.classList.add('hidden');
})();
