'use strict';

(function () {
  // создаем сущность фотографии по объекту
  var createPictureElement = function (picture, index) {
    var pictureElement = document.querySelector('#picture').content.querySelector('.picture').cloneNode(true);
    pictureElement.dataset.index = index;
    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length + '';

    return pictureElement;
  };

  // отрисовка фотографий
  var renderPictures = function (picturesData) {
    var picturesFragment = document.createDocumentFragment();
    for (var i = 0; i < picturesData.length; i++) {
      picturesFragment.appendChild(createPictureElement(picturesData[i], i));
    }
    return picturesFragment;
  };

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
  var renderComments = function (pictureElement, picture) {
    var commentsFragment = document.createDocumentFragment();
    for (var i = 0; i < picture.comments.length; i++) {
      commentsFragment.appendChild(createCommentLayout(picture.comments[i]));
    }

    var commentsParentElement = pictureElement.querySelector('.social__comments');
    commentsParentElement.innerHTML = '';
    commentsParentElement.appendChild(commentsFragment);
  };

  // функция отрисовки полноразмерной фотографии со всеми причитающимися.
  var renderFullPicture = function (pictureElement, picture) {
    pictureElement.classList.remove('hidden');
    pictureElement.querySelector('.big-picture__img img').src = picture.url;
    pictureElement.querySelector('.likes-count').textContent = picture.likes;
    pictureElement.querySelector('.comments-count').textContent = picture.comments.length.toString();
    pictureElement.querySelector('.social__caption').textContent = picture.description;

    renderComments(pictureElement, picture);
  };

  window.render = {
    renderPictures: renderPictures,
    renderFullPicture: renderFullPicture,
  };
})();
