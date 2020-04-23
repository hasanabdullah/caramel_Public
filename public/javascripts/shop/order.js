$(document).ready(function () {
    $('#nameInput').on('input', function () {
        var val = $(this).val();
        $("#nameList").find("option").each(function () {
            if ($(this).val() == val) {
                $("#vehicleInput").attr("disabled", false);
                $.ajax({
                    url: window.location.toString(),
                    type: 'PUT',
                    data: {
                        Customer: $(this).attr('id')
                    },
                    success: function (data) {
                        var vehicleList = $('#vehicleList');
                        for (var i = 0; i < data.length; i++) {
                            if (!vehicleList.find('option[id="' + data[i]._id + '"]').length) {
                                vehicleList.append('<option id="' + data[i]._id + '">' + data[i].make + " " + data[i].model + " " + data[i].year + '</option>');
                            }
                        }
                    }
                });
                return false;
            } else {
                $("#vehicleInput").attr("disabled", true);
            }
        });
    });
    $("#addOrder").click(function () {
        
        $("#nameList").find("option").each(function () {
            if ($(this).val() == $("#nameInput").val()) {
                var name = $(this).attr('id');
                $("#vehicleList").find("option").each(function () {
                    if ($(this).val() == $("#vehicleInput").val()) {
                        var vehicle = $(this).attr('id');
                        var date=new Date();
                        var year=date.getFullYear();
                        var month=date.getMonth()+1;
                        var yearMonth;
                        var uniqueId;
                        var lastYear;
                        var lastMonth;
                        var lastNumber;
                        if (month>9){
                            yearMonth=year.toString().substring(2,4)+month.toString();
                        }else{
                            yearMonth=year.toString().substring(2,4)+"0"+month.toString();
                        }
                        $.ajax({
                            url: window.location.toString()+"/generateId/"+year,
                            type: 'POST',
                            success: function (data) {
                                lastYear=data[0].lastYear;
                                lastMonth=data[0].lastMonth;
                                lastNumber=data[0].lastNumber;
                                if(year!=lastYear){
                                    lastYear=year;
                                    lastNumber=0;
                                }else{
                                    if(month!=lastMonth){
                                        lastMonth=month;
                                        lastNumber=0;
                                    }else{
                                        lastNumber=data[0].lastNumber+1;
                                    }
                                }
                                if (lastNumber<10){
                                    uniqueId=yearMonth+"0000"+lastNumber.toString();
                                }else if(10<=lastNumber<100){
                                    uniqueId=yearMonth+"000"+lastNumber.toString();
                                }else if (100<=lastNumber<1000){
                                    uniqueId=yearMonth+"00"+lastNumber.toString();
                                }else if(1000<=lastNumber<10000){
                                    uniqueId=yearMonth+"0"+lastNumber.toString();
                                }else{
                                    uniqueId=yearMonth+lastNumber.toString();
                                }
                                $.ajax({
                                    url: window.location.toString()+"/updateId/"+lastYear+"/"+lastMonth+"/"+lastNumber,
                                    type: 'POST',
                                    success: function (data) {
                                        $.ajax({
                                            url: window.location.toString(),
                                            type: 'POST',
                                            data: {
                                                Customer: name,
                                                Vehicle: vehicle,
                                                uniqueId: uniqueId
                                            },
                                            success: function (data) {
                                                window.location = data;
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                })
            }
        });
    });
    $('#start').click(function () {
        $('#newCustomer').show();
        $('#existing').show();
    });
    $('#existing').click(function () {
        $('#newForm').show();
    });
    $('#repairsTable').DataTable({"order": [[6, "desc"]]});

    $("#add").click(function () {
        var num = document.getElementById("vehicleList").options.length;
        if (num == 0) {
            window.alert("No available vehicles");
        } else {
            $("#nameList").find("option").each(function () {
                if ($(this).val() == $("#nameInput").val()) {
                    var name = $(this).attr('id');
                    $("#vehicleList").find("option").each(function () {
                        if ($(this).val() == $("#vehicleInput").val()) {
                            var vehicle = $(this).attr('id');
                            $("#add").hide();
                            $.ajax({
                                url: window.location.toString() + '/searchOrder',
                                type: 'GET',
                                data: {
                                    Customer: name,
                                    Vehicle: vehicle
                                },
                                success: function (orders) {
                                    if (orders != null && orders.length > 0) {
                                        alert('The vehicle has orders in progress!');
                                        $("#addOrder").show();
                                        $("#currentOrders").show();
                                        for (let i = 0; i < orders.length; i++) {
                                            $button = $('<button/>', {
                                                text: "Order #: " + orders[i]._id + ", Date Created: " + new Date(orders[i].dateCreated).toLocaleDateString() + ", Last Modified: " + new Date(orders[i].lastModified).toLocaleDateString(),
                                                click: function () {
                                                    window.location = window.location.href.split('?')[0] + "/" + orders[i]._id
                                                }
                                            });
                                            $button.appendTo($("#currentOrders"));
                                        }
                                    } else {
                                        $("#nameList").find("option").each(function () {
                                            if ($(this).val() == $("#nameInput").val()) {
                                                var name = $(this).attr('id');
                                                $("#vehicleList").find("option").each(function () {
                                                    if ($(this).val() == $("#vehicleInput").val()) {
                                                        var vehicle = $(this).attr('id');
                                                        var date=new Date();
                                                        var year=date.getFullYear();
                                                        var month=date.getMonth()+1;
                                                        var yearMonth;
                                                        var uniqueId;
                                                        var lastYear;
                                                        var lastMonth;
                                                        var lastNumber;
                                                        if (month>9){
                                                            yearMonth=year.toString().substring(2,4)+month.toString();
                                                        }else{
                                                            yearMonth=year.toString().substring(2,4)+"0"+month.toString();
                                                        }
                                                        $.ajax({
                                                            url: window.location.toString()+"/generateId/"+year,
                                                            type: 'POST',
                                                            success: function (data) {
                                                                lastYear=data[0].lastYear;
                                                                lastMonth=data[0].lastMonth;
                                                                lastNumber=data[0].lastNumber;
                                                                if(year!=lastYear){
                                                                    lastYear=year;
                                                                    lastNumber=0;
                                                                }else{
                                                                    if(month!=lastMonth){
                                                                        lastMonth=month;
                                                                        lastNumber=0;
                                                                    }else{
                                                                        lastNumber=data[0].lastNumber+1;
                                                                    }
                                                                }
                                                                if (lastNumber<10){
                                                                    uniqueId=yearMonth+"0000"+lastNumber.toString();
                                                                }else if(10<=lastNumber<100){
                                                                    uniqueId=yearMonth+"000"+lastNumber.toString();
                                                                }else if (100<=lastNumber<1000){
                                                                    uniqueId=yearMonth+"00"+lastNumber.toString();
                                                                }else if(1000<=lastNumber<10000){
                                                                    uniqueId=yearMonth+"0"+lastNumber.toString();
                                                                }else{
                                                                    uniqueId=yearMonth+lastNumber.toString()
                                                                }
                                                                $.ajax({
                                                                    url: window.location.toString()+"/updateId/"+lastYear+"/"+lastMonth+"/"+lastNumber,
                                                                    type: 'POST',
                                                                    success: function (data) {
                                                                        $.ajax({
                                                                            url: window.location.toString(),
                                                                            type: 'POST',
                                                                            data: {
                                                                                Customer: name,
                                                                                Vehicle: vehicle,
                                                                                uniqueId: uniqueId
                                                                            },
                                                                            success: function (data) {
                                                                                window.location = data;
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                })
                                            }
                                        });
                                    }
                                }
                            })
                        }
                    });
                }
            });
        }
    });
    $('[id^=order]').click(function () {
        window.alert($(this).attr('id'));
    });
});