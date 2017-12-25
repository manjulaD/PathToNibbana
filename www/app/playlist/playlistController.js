angular.module('playlist', [])
    .controller('playlistCtrl', function ($scope,PlaylistService,$stateParams,  $ionicPopup) {


        $scope.onClick= function (){
         // alert("des");
        };

   var id= $scope.playlistId = $stateParams.listId.id;

   // alert("lol"+$scope.playlistId);

      //get Past appointments for Doctors
      PlaylistService.getPlaylist( id,function (data) {
       $scope.playlist = data.data.items;

      }, function (error) {

        
      });

$scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        }

    })
    .service('PlaylistService', function (apiClient) {
      return {
        getPlaylist: function (id,onRequestSubmissionSuccess, onRequestSubmissionError) {
          var apiConfigObject = {};
          apiConfigObject.queryParams = {
            key: 'AIzaSyAgEzDC7SL3UisS939gyjMvtuE7eiaI5nc',
      type: 'video',
      maxResults: '20',
      part: 'id,snippet',
    //  q: 'creatorup',
      order: 'viewCount',
      channelId: 'UCz2vleeBz5qXDhGZjCvDl3g',
      playlistId:id
           
          };
          apiClient.invoke('getPlaylist', false, apiConfigObject, onRequestSubmissionSuccess, onRequestSubmissionError);
        }
       
      }
    });