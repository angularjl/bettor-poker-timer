// Check if a new cache is available on page load.
(function (window) {
    'use strict';

    window.addEventListener('load', function () {

        window.applicationCache.addEventListener('updateready', function () {
            if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
                // Browser downloaded a new app cache.
                // Swap it in and reload the page to get the new hotness.
                window.applicationCache.swapCache();
                window.location.reload();
            } else {
                // Manifest didn't changed. Nothing new to server.
            }
        }, false);

    }, false);
})(window);

(function (angular) {
    'use strict';

    angular.module('MyApp', ['timer', 'ngAudio'])
        .controller('MyAppController', [
            '$scope',
            'ngAudio',
            function ($scope, ngAudio) {
                $scope.voice = ngAudio.load('sounds/one_minute_remaining.mp3');
                $scope.alarm = ngAudio.load('sounds/alarm.mp3');

                $scope.timerRunning = false;

                $scope.startTimer = function () {
                    $scope.$broadcast('timer-start');
                    $scope.timerRunning = true;
                };

                $scope.stopTimer = function () {
                    $scope.$broadcast('timer-stop');
                    $scope.timerRunning = false;
                };

                $scope.$on('timer-stopped', function (event, data) {
                    console.log('Timer Stopped - data = ', data);
                });

                $scope.$on('timer-tick', function (event, data) {
                    var secs = data.millis / 1000;

                    if (secs === 60) {
                        $scope.voice.play();
                    } else if (secs <= 10) {
                        $scope.alarm.play();
                    }
                });
            }
        ]);
})(window.angular);
