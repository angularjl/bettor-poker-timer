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
                var updateView = function () {
                    $scope.smallBlind = $scope.blinds[$scope.level];
                    $scope.bigBlind = $scope.smallBlind * 2;
                };

                $scope.blinds = [0.1, 0.2, 0.3, 0.4, 0.6, 0.9, 1.3, 2, 3, 5, 7, 10];

                $scope.voice = ngAudio.load('sounds/one_minute_remaining.mp3');
                $scope.alarm = ngAudio.load('sounds/alarm.mp3');
                $scope.beep = ngAudio.load('sounds/beep.mp3');
                $scope.reset = ngAudio.load('sounds/reset.mp3');
                $scope.level = 0;
                $scope.duration = 17;
                $scope.first = true;
                $scope.countdown = 1;

                $scope.timerRunning = false;

                updateView();

                $scope.startTimer = function () {
                    if ($scope.first) {
                        $scope.first = false;
                        $scope.$broadcast('timer-add-cd-seconds', $scope.duration * 60);
                    }

                    $scope.$broadcast('timer-start');
                    $scope.timerRunning = true;
                };

                $scope.stopTimer = function () {
                    $scope.$broadcast('timer-clear');
                    $scope.timerRunning = false;
                };

                $scope.finished = function () {
                    $scope.$broadcast('timer-add-cd-seconds', $scope.duration * 60);
                    $scope.level++;
                    updateView();
                };

                $scope.$on('timer-stopped', function () {
                    $scope.reset.play();
                });

                $scope.$on('timer-tick', function (event, data) {
                    var secs = data.millis / 1000;

                    if (secs === 0) {
                        $scope.alarm.play();
                    } else if (secs === 60) {
                        $scope.voice.play();
                    } else if (secs <= 10) {
                        $scope.beep.play();
                    }
                });
            }
        ]);
})(window.angular);
