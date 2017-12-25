// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','videos','pdfs','playlist','utils.module','api-client.module', 'firebase','youtube-embed'])

    .run(function ($ionicPlatform) {
      $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
      });
    })
    .factory("Auth", ["$firebaseAuth", "$rootScope",
      function ($firebaseAuth, $rootScope) {
        var ref = new Firebase(firebaseUrl);
        return $firebaseAuth(ref);
      }])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            cache: false
          })

         
         
           .state('app.videos', {
            url: '/videos',
            cache: false,
            views: {
              'menuContent': {
                templateUrl: 'app/videos/videos.html',
                controller: 'videosCtrl',

              }
            }

          })
          

          .state('app.playlist', {
            url: '/playlist',
            cache: false,
             params: 
             {
               listId: null
             },
            views: {
              'menuContent': {
                templateUrl: 'app/playlist/playlist.html',
                controller: 'playlistCtrl',

              }
            }

          })

          .state('app.pdfs', {
            url: '/pdfs',
            cache: false,
            views: {
              'menuContent': {
                templateUrl: 'app/pdfs/pdfs.html',
                controller: 'pdfsCtrl',

              }
            }

          })

          ;
      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/app/videos');


      var config = {
        apiKey: "AIzaSyAO1uZYz57IlIaP1qNfYFRoYLD87Xvg6SQ",
        databaseURL: "https://baxterpoc-9ccff.firebaseio.com",
        projectId: "baxterpoc-9ccff",
        storageBucket: "baxterpoc-9ccff.appspot.com",
        messagingSenderId: "979087637880"
      };
      firebase.initializeApp(config);
    });
