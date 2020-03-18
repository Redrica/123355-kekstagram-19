'use strict';

(function () {
  var ERROR_STYLE_LINE_HEIGHT = '1.2';
  var RequestResponse = {
    ERROR: 'error',
    SUCCESS: 'success',
  };
  var messageType;

  var closePopup = function () {
    var errorInstance = document.querySelector('.' + messageType + '');

    document.removeEventListener('keydown', popupEscapeHandler);
    document.removeEventListener('click', documentClickHandler);
    document.body.removeChild(errorInstance);
  };

  var popupEscapeHandler = function (evt) {
    window.util.isEscapeEvent(evt, closePopup);
  };

  var documentClickHandler = function (evt) {
    var errorInstance = document.querySelector('.' + messageType + '');
    var popupButton = errorInstance.querySelector('.' + messageType + '__button');

    if (evt.target === errorInstance || evt.target === popupButton) {
      closePopup();
    }
  };

  var setResponseCondition = function (errorMessage, closeButtonText) {
    messageType = (errorMessage && closeButtonText) ? RequestResponse.ERROR : RequestResponse.SUCCESS;

    var messageElement = document.querySelector('#' + messageType + '').content.querySelector('.' + messageType + '').cloneNode(true);

    if (messageType === RequestResponse.ERROR) {
      var messageText = messageElement.querySelector('.' + messageType + '__title');
      var messageButton = messageElement.querySelector('.' + messageType + '__button');

      messageText.style.lineHeight = ERROR_STYLE_LINE_HEIGHT;
      messageText.textContent = errorMessage;
      messageButton.textContent = closeButtonText;
    }

    document.body.appendChild(messageElement);
    document.addEventListener('keydown', popupEscapeHandler);
    document.addEventListener('click', documentClickHandler);
  };

  window.requestResponse = {
    setResponseCondition: setResponseCondition,
  };
})();
