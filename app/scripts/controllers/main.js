'use strict';

/**
 * @ngdoc function
 * @name angularUploaderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularUploaderApp
 */
angular.module('angularUploaderApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.uploadInit = {
      validExt: ['jpg','jpeg','png'],
      dragStyle:'border:dashed 2px #666;'
    };
    $scope.main = {
      uploadText: 'Upload you image here'
    };

    $scope.uploadFeedback = function(data){
      document.getElementById('image').width = 700;
      document.getElementById('image').src = data.result;
    };

  });
