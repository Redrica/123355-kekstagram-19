'use strict';

(function () {
  var COMMENTS_PART_COUNT = 5;
  var fullPicture = document.querySelector('.big-picture');
  var commentsParentElement = fullPicture.querySelector('.social__comments');
  var commentCount = fullPicture.querySelector('.social__comment-count');
  var commentsLoader = fullPicture.querySelector('.comments-loader');
  var pictureComments = [];
  var shownCommentsCount;

  // создаем сущность фотографии по объекту
  var createPictureElement = function (picture) {
    var pictureElement = document.querySelector('#picture').content.querySelector('.picture').cloneNode(true);
    pictureElement.dataset.index = picture.id;
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

  // функция создания блока комментариев
  var createCommentsFragment = function (comments) {
    var commentsFragment = document.createDocumentFragment();
    var commentsToCreate = comments.length > COMMENTS_PART_COUNT ? shownCommentsCount + COMMENTS_PART_COUNT : comments.length;
    for (var i = shownCommentsCount; i < commentsToCreate; i++) {
      commentsFragment.appendChild(createCommentLayout(comments[i]));
      shownCommentsCount++;
      if (shownCommentsCount === comments.length) {
        break;
      }
    }

    return commentsFragment;
  };

  var commentsLoaderClickHandler = function () {
    commentsParentElement.appendChild(createCommentsFragment(pictureComments));

    var shownComments = fullPicture.querySelectorAll('.social__comment');
    if (shownComments.length === pictureComments.length) {
      commentsLoader.classList.add('hidden');
      commentsLoader.removeEventListener('click', commentsLoaderClickHandler);
    }
  };

  // функция отрисовки полноразмерной фотографии со всеми причитающимися.
  var renderFullPicture = function (picture) {
    fullPicture.classList.remove('hidden');
    fullPicture.querySelector('.big-picture__img img').src = picture.url;
    fullPicture.querySelector('.likes-count').textContent = picture.likes;
    fullPicture.querySelector('.comments-count').textContent = picture.comments.length.toString();
    fullPicture.querySelector('.social__caption').textContent = picture.description;

    commentsParentElement.innerHTML = '';
    pictureComments = picture.comments;
    shownCommentsCount = 0;

    commentsParentElement.appendChild(createCommentsFragment(pictureComments));

    if (picture.comments.length <= COMMENTS_PART_COUNT) {
      commentsLoader.classList.add('hidden');
    } else {
      if (commentsLoader.classList.contains('hidden')) {
        commentsLoader.classList.remove('hidden');
      }
      commentsLoader.addEventListener('click', commentsLoaderClickHandler);
    }

    commentCount.classList.add('hidden');
  };

  window.render = {
    renderPictures: renderPictures,
    renderFullPicture: renderFullPicture,
  };
})();
