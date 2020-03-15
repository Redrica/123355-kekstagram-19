'use strict';

(function () {
  var onError = function (message) {
    console.error(message);
  };

  var onSuccess = function (data) {
    var pictures = data;
    console.log(pictures, 'from onSuccess');
  };

  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  xhr.addEventListener('load', function () {
    var error;
    switch (xhr.status) {
      case 200:
        onSuccess(xhr.response);
        break;
      case 400:
        error = 'Неверный запрос';
        break;
      case 401:
        error = 'Пользователь не авторизован';
        break;
      case 404:
        error = 'Ничего не найдено';
        break;
      default:
        error = 'Статус ответа: : ' + xhr.status + ' ' + xhr.statusText;
    }

    if (error) {
      onError(error);
    }
  });

  xhr.addEventListener('error', function () {
    onError('Произошла ошибка соединения');
  });

  xhr.addEventListener('timeout', function () {
    onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
  });

  xhr.timeout = 1000;

  xhr.open('GET', 'https://js.dump.academy/kekstagram/data');

  console.log(xhr.readyState);

  xhr.send();

  console.log(xhr.readyState);




})();
