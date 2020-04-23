//var app=angular.module('calendarDemoApp', ['ui.rCalendar','ngMaterial']);
var app = angular.module('calendarDemoApp', ['ui.rCalendar', 'ui.bootstrap']);

app.config(function ($locationProvider) {
    //$locationProvider.html5Mode(true);
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

app.factory('myService', function ($http, $location) {
    var getData = function () {
        var thisUrl = $location.path();
        return $http({method: "GET", url: thisUrl + '/data'}).then(function (response) {
            return response.data;
        });
    };
    return {getData: getData};
});

app.controller('CalendarDemoCtrl', ['$scope', '$http', 'myService', '$modal', '$log', function ($scope, $http, myService, $modal, $log) {
    'use strict';

    $scope.changeMode = function (mode) {
        $scope.mode = mode;
    };

    $scope.today = function () {
        $scope.currentDate = new Date();
    };

    $scope.isToday = function () {
        var today = new Date(),
            currentCalendarDate = new Date($scope.currentDate);

        today.setHours(0, 0, 0, 0);
        currentCalendarDate.setHours(0, 0, 0, 0);
        return today.getTime() === currentCalendarDate.getTime();
    };

    $scope.loadEvents = function () {
        var oriData = [];
        var myData = myService.getData();
        myData.then(function (response) {
            oriData = response;
            $scope.eventSource = createRandomEvents(oriData);
            console.log(oriData.length);
        });
    };

    $scope.onEventSelected = function (event) {
        //$scope.event = event;
        var modalInstance = $modal.open({
            templateUrl: 'details.html',
            controller: 'detailsCtrl',
            windowClass: 'modal-fit',
            resolve: {
                item: function () {
                    return event;
                }
            }
        });

    };

    $scope.onTimeSelected = function (selectedTime, events) {
        console.log('Selected time: ' + selectedTime + ' hasEvents: ' + (events !== undefined && events.length !== 0));
    };

    function createRandomEvents(oriData) {
        var events = [];
        console.log('after response ' + oriData.length);
        var i = 0;
        while (i < oriData.length) {
            var startTime = new Date(oriData[i].startDate);
            var endTime = new Date(oriData[i].endDate);
            if (typeof startTime !== "undefined" && typeof endTime !== "undefined") {
                var description;
                if (oriData[i].desc == "") {
                    description = "(blank)";
                } else {
                    description = oriData[i].desc;
                }
                events.push({
                    id: oriData[i]._id,
                    description: description,
                    title: oriData[i].customer.firstName + " " + oriData[i].customer.lastName,
                    cid: oriData[i].customer._id,
                    vid: oriData[i].vehicle._id,
                    tid: oriData[i].technician,
                    firstname: oriData[i].customer.firstName,
                    lastname: oriData[i].customer.lastName,
                    startTime: startTime,
                    endTime: endTime,
                    allDay: false,
                    email: oriData[i].customer.email,
                    phone: oriData[i].customer.phone,
                    make: oriData[i].vehicle.make,
                    model: oriData[i].vehicle.model,
                    year: oriData[i].vehicle.year,
                    shop: oriData[i].shop,
                    create: oriData[i].create
                });
            }
            i = i + 1;
        }
        ;
        console.log(events.length);
        return events;
    }
}]);

app.controller('goController', function ($scope, $window, $location) {
    var url = $location.path();
    var id = url.slice(6, -9);
    $scope.Submit = function () {
        $window.location = '/shop/' + id;
    };
    $scope.Add = function () {
        $window.location = '/shop/' + id + '/calendar/shop-calendar-add-appointment';
    };
});

app.controller('detailsCtrl', function ($scope, $http, item, $modalInstance, $window, $location) {
    var url = $location.path();
    var id = url.slice(6, -9);
    $scope.create = true;
    $scope.item = item;
    $scope.Create = function () {
        var orderId;
        $http.get('/repairorder/' + item.cid + "/" + item.vid + "/" + item.shop).then(
            function (response) {
                console.log('create repair order status: ' + response.data);
                orderId = response.data;
                console.log(orderId);
            });
        if (item.description == "") {
            item.description = "(blank)";
        }
        $http.get('/changeappointment/' + item.id + "/" + item.description + "/" + item.startTime + "/" + item.endTime).then(
            function (response) {
                console.log("res " + item.description);
                console.log('change status: ' + response.data);
                $window.location = '/shop/' + item.shop + "/orders/" + orderId;
            });
        //$scope.edit=true;
        //$scope.create=false;

    };

    $scope.Cancel = function () {
        //$modalInstance.close();
        window.location.reload();
    };

    $scope.Delete = function () {
        $http.get('/deleteappointment/' + item.id).then(
            function (response) {
                console.log('delete status: ' + response.data);
            });
        window.location.reload();
    }
});