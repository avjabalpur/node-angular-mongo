(function () {
  'use strict';

  angular.module('app').provider('$socket', socketProvider);

  function socketProvider() {
    var url='http://localhost:5000';

    this.setUrl = setUrl;
    this.getUrl = getUrl;
    this.$get = ['$rootScope', '$window', socketFactory];

    function setUrl(value) {
      url = value;
    }

    function getUrl() {
      return url;
    }

    function socketFactory($rootScope, $window) {
      var socket;

      var service = {
        addListener: addListener,
        on: addListener,
        once: addListenerOnce,
        removeListener: removeListener,
        removeAllListeners: removeAllListeners,
        emit: emit,
        getSocket: getSocket
      };

      return service;
      ////////////////////////////////

      function initializeSocket() {
        //Check if socket is undefined
        if (typeof socket === 'undefined') {
          if (url !== 'undefined') {
            socket = $window.io.connect(url, {
              transports: ['websocket', 'xhr-polling']
            });
          } else {
            socket = $window.io.connect('/', {
              transports: ['websocket', 'xhr-polling']
            });
          }
        }
      }

      function angularCallback(callback) {
        return function () {
          if (callback) {
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
          }
        };
      }

      function addListener(name, scope, callback) {
        initializeSocket();

        if (arguments.length === 2) {
          scope = null;
          callback = arguments[1];
        }

        socket.on(name, angularCallback(callback));

        if (scope !== null) {
          scope.$on('$destroy', function () {
            removeListener(name, callback);
          });
        }
      }

      function addListenerOnce(name, callback) {
        initializeSocket();
        socket.once(name, angularCallback(callback));
      }

      function removeListener(name, callback) {
        initializeSocket();
        socket.removeListener(name, angularCallback(callback));
      }

      function removeAllListeners(name) {
        initializeSocket();
        socket.removeAllListeners(name);
      }

      function emit(name, data, callback) {
        initializeSocket();
        socket.emit(name, data, angularCallback(callback));
      }

      function getSocket() {
        return socket;
      }
    }
  }

})();