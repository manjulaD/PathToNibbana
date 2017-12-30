angular.module('announcements', [])
  .controller('announcementsCtrl', function ($scope, $state,  $ionicPopup) {


    var dbName = "announcements";
     $scope.announcements = [];

    if (!firebase.apps.length) {
      firebase.initializeApp({});
    }
    var ref = firebase.database().ref(dbName);

 ref.on('value', data => {
      $scope.announcements = [];
     
      data.forEach(data => {
       
        var _an = data.val().announcement;
        var _date = data.val().date;
        
        
       
         $scope.announcements.push({
        announcement: _an,
        date: _date,
       

      });
      });
      if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
        $scope.$apply(function () { $scope.announcements = $scope.announcements; });
       
      }

    });






  })
