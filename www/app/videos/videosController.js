angular.module('videos', [])
    .controller('videosCtrl', function ($scope,$state, AppointmentService, $ionicPopup) {


        $scope.onClick= function (Playlist){
         // alert(Playlist.id);
          $state.go('app.playlist',{listId: Playlist});
        };

    

      //get Past appointments for Doctors
      AppointmentService.getgetPlaylists( function (data) {
       $scope.appointmentsUpcoming = data.data.items;

      }, function (error) {

        
      });



    })
    .service('AppointmentService', function (apiClient) {
      return {
        getgetPlaylists: function (onRequestSubmissionSuccess, onRequestSubmissionError) {
          var apiConfigObject = {};
          apiConfigObject.queryParams = {
                key: 'AIzaSyAgEzDC7SL3UisS939gyjMvtuE7eiaI5nc',
        type: 'video',
        maxResults: '50',
        part: 'id,snippet',
        //  q: 'creatorup',
        order: 'lad',
        channelId: 'UCz2vleeBz5qXDhGZjCvDl3g',
           
          };
          apiClient.invoke('getPlaylists', false, apiConfigObject, onRequestSubmissionSuccess, onRequestSubmissionError);
        }
       
      }
    });