'use strict';

(function () {
  var FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif'];
  var Error = {
    type: 'error',
    message: 'Допустимые форматы файлов: jpg, jpeg, png, gif',
    buttonText: 'Загрузить другой файл',
  };
  var uploadInput = document.querySelector('#upload-file');
  var loadedPicture = document.querySelector('.img-upload__preview img');
  var previewImages = document.querySelectorAll('.effects__preview');

  var processUploadPicture = function () {
    var file = uploadInput.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        loadedPicture.src = reader.result;

        previewImages.forEach(function (it) {
          it.style.backgroundImage = 'url("' + reader.result + '")';
        });
      });

      reader.readAsDataURL(file);
    } else {
      window.requestResponse.setResponseCondition(null, null, Error);
    }

    return matches;
  };

  window.uploadImage = {
    processUploadPicture: processUploadPicture,
  };
})();
