'use strict';

(function () {
  var Url = {
    GET_PICTURES_DATA: 'https://js.dump.academy/kekstagram/data',
    POST_PICTURE_DATA: 'https://js.dump.academy/kekstagram',
  };

  var TIMEOUT_LOAD = 5000;
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
    DEFAULT: 'Статус ответа: : ',
    EVENT_ERROR: 'Произошла ошибка соединения',
    TIMEOUT: 'Запрос не успел выполниться за ',
  };

  var makeDataRequest = function (onSuccessResponse, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case Code.SUCCESS:
          onSuccessResponse(xhr.response);
          break;
        case Code.BAD_REQUEST:
          error = ErrorMessage.BAD_REQUEST;
          break;
        case Code.UNAUTHORIZED:
          error = ErrorMessage.UNAUTHORIZED;
          break;
        case Code.NOT_FOUND:
          error = ErrorMessage.NOT_FOUND;
          break;
        default:
          error = ErrorMessage.DEFAULT + xhr.status + ' ' + xhr.statusText;
      }

      if (error) {
        onError(error);
      }
    });
    xhr.addEventListener('error', function () {
      onError(ErrorMessage.EVENT_ERROR);
    });

    xhr.addEventListener('timeout', function () {
      onError(ErrorMessage.TIMEOUT + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_LOAD;
    xhr.open('GET', Url.GET_PICTURES_DATA);
    xhr.send();
  };

  var uploadData = function (data, onSuccessUpload) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      onSuccessUpload(xhr.response);
    });

    xhr.open('POST', Url.POST_PICTURE_DATA);
    xhr.send();
  };

  window.backend = {
    makeDataRequest: makeDataRequest,
    uploadData: uploadData,
  };
})();
