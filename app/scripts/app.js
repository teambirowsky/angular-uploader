'use strict';

/**
 * @ngdoc overview
 * @name angularUploaderApp
 * @description
 * # angularUploaderApp
 *
 * Main module of the application.
 */
angular
  .module('angularUploaderApp', [
    'ngAnimate',
    'ngRoute',
    'ngSanitize',
    'angular.upload'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
