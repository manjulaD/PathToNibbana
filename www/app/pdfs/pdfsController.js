angular.module('pdfs', [])
    .controller('pdfsCtrl', function ($scope,PdfsService,$stateParams,  $ionicPopup) {


$scope.pdfurl1="https://drive.google.com/file/d/0B6Sn09pqHZS6eVBCeGZ4aS1FQ0U/edit";

 
        $scope.onClick= function (){
         // alert("des");
        };

//    var id= $scope.playlistId = $stateParams.listId.id;

//    // alert("lol"+$scope.playlistId);

//       //get Past appointments for Doctors
//       PdfsService.getPlaylist( function (data) {
//        $scope.playlist = data.data.items;

//       }, function (error) {

        
//       });



    })
    .service('PdfsService', function (apiClient) {
      return {
        getPlaylist: function (onRequestSubmissionSuccess, onRequestSubmissionError) {
          var apiConfigObject = {};
          apiConfigObject.queryParams = {
          
           
          };
          apiClient.invoke('getPlaylist', false, apiConfigObject, onRequestSubmissionSuccess, onRequestSubmissionError);
        }
       
      }
    });