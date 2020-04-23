var app = angular.module('profile', []);
app.config(function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});
app.controller('profileController', function ($scope, $http, $location) {
    var url = $location.path();
    var id=url.split("/")[2];
    $http.get('/customer/' + id+"/profile/getProfile").then(
        function (response) {
            $scope.customer=response.data[0];
        });
    $scope.canEdit=true;
    $scope.edit=true;
    $scope.save=false;
    $scope.cancel=false;
    $scope.Edit=function(){
        $scope.canEdit=false;
        $scope.edit=false;
        $scope.save=true;
        $scope.cancel=true;
    }
    $scope.Save=function(){
        var customer=$scope.customer;
        $http.get('/customer/' + id+"/profile/updateProfile/"+customer.name+"/"+customer.phone+"/"+customer.email+"/"+customer.address+"/"+customer.zip+"/"+customer.city+"/"+customer.state).then(
            function (response) {
                window.location.reload();
            });
    }
    $scope.Cancel=function(){
        window.location.reload();
    }
});