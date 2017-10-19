(function () {
  'use strict';

  var app = angular.module('examples', ['chart.js', 'ui.bootstrap']);

  app.config(function (ChartJsProvider) {
    ChartJsProvider.setOptions({
        colors: [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
        responsive: true,
        animation: false,
        scaleOverride: true,
        scaleStartValue: 0,
        scaleStepWidth: 10,
        scaleSteps: 10,//
        legendTemplate: ' '
    });
  });

  app.controller('DataCtrl',['$scope','$http',function($scope,$http){
    $scope.data = [];
    $http({
        method: 'GET',
        url: '/data'
      })
      .then(
        function success(response){
            $scope.data = response.data;
        },
        function failed (response) {
        }
    )
  }])

  app.controller('BarCtrl', ['$scope', '$timeout', '$interval','$location','$http', function ($scope, $timeout, $interval, $location, $http) {

    $scope.options = { scaleShowVerticalLines: false };

    $scope.labels = [];

    $scope.data = []
    
    var rawData = [];

    $scope.labelledData = []

    $interval(function(){
        $http({
            method: 'GET',
            url: '/version'
          })
          .then(
            function successCallback(response) {
                rawData.push(response.data.version);
                if (rawData.length == 1) {
                    for (let i = 0; i < 99; i++) {
                        rawData.push(response.data.version);
                    }
                }
             },
            function errorCallback(response) {
                rawData.push('error');
                if (rawData.length == 1) {
                    for (let i = 0; i < 99; i++) {
                        rawData.push('error');
                    }
                }
             }
        )
    },100)

    $interval(function () {
        if (rawData.length > 100) {
            rawData = rawData.splice(rawData.length-100,100);
        }
        var data = {}
        for (var i = 0; i < rawData.length; i++) {
            data[rawData[i]] = data[rawData[i]] ? data[rawData[i]]+1 : 1;
        }
        for (var k of Object.keys(data)) {
            var labelIndex = -1;
            for (var l = 0; l < $scope.labels.length; l++) {
                if ($scope.labels[l] == k) {
                    labelIndex = l;
                    break;
                }
            }
            if (labelIndex == -1) {
                labelIndex = $scope.labels.length;
                $scope.labels.push(k)
                var length = $scope.data.length;
                $scope.data.push(data[k]);
            } else {
                $scope.data[labelIndex] = data[k]
            }  
        }
        var spliced = false;
        do {
            spliced=false;
            for (var i = 0; i < $scope.labels.length; i++) {
                if (data[$scope.labels[i]] == undefined) {
                    $scope.data.splice(i,1);
                    $scope.labels.splice(i,1);
                    spliced=true;
                    break;
                }
            }
        } while (spliced);

        $scope.labelledData = [];
        for (var i = 0; i < $scope.data.length; i++) {
            $scope.labelledData.push({label:$scope.labels[i],value:$scope.data[i]})
        }
    },500)

  }]);

})();
