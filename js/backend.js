'use strict';

(function () {
  var TIMEOUT_LOAD = 5000;
  var Url = {
    GET_PICTURES_DATA: 'https://js.dump.academy/kekstagram/data',
    POST_PICTURE_DATA: 'https://js.dump.academy/kekstagram',
  };

  var Code = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404
  };

  var ErrorMessage = {
    BAD_REQUEST: 'Неверный запрос',
    UNAUTHORIZED: 'Пользователь не авторизован',
    NOT_FOUND: 'Ничего не найдено',
    DEFAULT: 'Статус ответа: ',
    EVENT_ERROR: 'Произошла ошибка соединения',
    TIMEOUT: 'Запрос не успел выполниться за ',
  };

  var ButtonText = {
    LOAD: 'Закрыть',
    UPLOAD: 'Попробуйте еще раз',
  };

  var handleRequestStatus = function (xhr, onSuccessResponse, onError, closeButtonText) {
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === Code.SUCCESS) {
        onSuccessResponse(xhr.response);
      } else {
        switch (xhr.status) {
          case Code.BAD_REQUEST:
            onError(ErrorMessage.BAD_REQUEST, closeButtonText);
            break;
          case Code.UNAUTHORIZED:
            onError(ErrorMessage.UNAUTHORIZED, closeButtonText);
            break;
          case Code.NOT_FOUND:
            onError(ErrorMessage.NOT_FOUND, closeButtonText);
            break;
          default:
            onError((ErrorMessage.DEFAULT + xhr.status + ' ' + xhr.statusText), closeButtonText);
        }
      }
    });

    xhr.addEventListener('error', function () {
      onError(ErrorMessage.EVENT_ERROR, closeButtonText);
    });

    xhr.addEventListener('timeout', function () {
      onError((ErrorMessage.TIMEOUT + xhr.timeout + 'мс'), closeButtonText);
    });

    xhr.timeout = TIMEOUT_LOAD;
  };

  var loadData = function (onSuccessResponse, onError) {
    var xhr = new XMLHttpRequest();
    var closeButtonText = ButtonText.LOAD;

    handleRequestStatus(xhr, onSuccessResponse, onError, closeButtonText);
    xhr.open('GET', Url.GET_PICTURES_DATA);
    xhr.send();
  };

  var uploadData = function (data, onSuccessResponse, onError) {
    var xhr = new XMLHttpRequest();
    var closeButtonText = ButtonText.UPLOAD;

    handleRequestStatus(xhr, onSuccessResponse, onError, closeButtonText);
    xhr.open('POST', Url.POST_PICTURE_DATA);
    xhr.send(data);
  };

  window.backend = {
    loadData: loadData,
    uploadData: uploadData,
  };
})();
