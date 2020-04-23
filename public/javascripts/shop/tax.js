var app = angular.module('tax', []);
app.config(function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});
app.controller('taxController', function ($scope, $http, $location) {
    $scope.addService=true;
    $scope.add=function(){
        $scope.addService=false;
        if ($('#addUnitCost').val() != '' && $('#addQuantity').val() != '') {
            $.ajax({
                url: window.location.toString() + "/service",
                type: 'POST',
                data: {
                    jobInput: $('#jobInput').val(),
                    category: $('#category').val(),
                    source: $('#addSource').val(),
                    unitCost: $('#addUnitCost').val(),
                    quantity: $('#addQuantity').val(),
                    issueNumber: $('#issueNumber').val(),
                    technician: $('#technicianInput').val()
                },
                success: function (data) {
                    window.location.reload();
                }
            });
        } else {
            window.alert("Must input unit cost and quantity");
        }
    }
    var url = $location.path();
    var id = url.split("/")[4];
    $http.get('/tax/' + id).then(
        function (response) {
            $scope.laborTax = response.data[0].laborTax;
            $scope.partsTax = response.data[0].partsTax;
            $scope.laborTotal = ($scope.laborTax / 100 * $('#laborSubtotal').text()).toFixed(2);
            $scope.partsTotal = ($scope.partsTax / 100 * $('#partsSubtotal').text()).toFixed(2);
            $scope.total = (parseFloat($scope.laborTotal) + parseFloat($scope.partsTotal) + parseFloat($('#laborSubtotal').text()) + parseFloat($('#partsSubtotal').text()) + parseFloat($('#feesSubtotal').text())).toFixed(2);
        });
    $scope.save=function(){
        window.location.reload();
    }

});