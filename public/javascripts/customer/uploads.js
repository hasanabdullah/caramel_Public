var app = angular.module('uploads', []);
app.config(function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});
app.controller('uploadsController', function ($scope, $http, $location) {
    $scope.canEdit=true;
    $scope.save=false;
    $scope.cancel=false;
    url = $location.path();
    var id=url.split("/")[2];
    $http.get('/customer/' + id+"/uploads/getUploads").then(
        function (response) {
            $scope.uploads=response.data.file;
        });
    $scope.View=function(index){
        var fid=$scope.uploads[index]._id;
        window.open("/customer/"+id+"/uploads/showUploads/"+fid);
    }
    $scope.Delete=function(index){
        var fid=$scope.uploads[index]._id;
        $http.get('/customer/' + id+"/uploads/delete/"+fid).then(
            function (response) {
                window.location.reload();
            });
    }
});