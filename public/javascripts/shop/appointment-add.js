var startTime, endTime;
$(document).ready(function () {
    function round(date, duration, method) {
        return moment(Math[method]((+date) / (+duration)) * (+duration));
    }

    $('input[name="startTime"]').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        minDate: round(new Date(), moment.duration(30, "minutes"), "ceil"),
        startDate: round(new Date(), moment.duration(30, "minutes"), "ceil"),
        locale: {
            format: 'M/DD hh:mm A'
        },
        timePickerIncrement: 30,
        autoUpdateInput: false
    });
    $('#startTime').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD hh:mm A'));
        startTime = picker.startDate.format();
        var test = picker.startDate;
        $('#endTime').show();
        $('input[name="endTime"]').daterangepicker({
            singleDatePicker: true,
            timePicker: true,
            minDate: test.add(0.25, 'hour'),
            startDate: test.add(0.25, 'hour'),
            locale: {
                format: 'M/DD hh:mm A'
            },
            timePickerIncrement: 30,
            autoUpdateInput: false
        });
    });
    $('#startTime').on('cancel.daterangepicker', function (ev, picker) {
        $('#startTime').val('');
        $('#endTime').hide();
        location.reload();
    });
    $('#endTime').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD hh:mm A'));
        endTime = picker.startDate.format();
    });
    $('#endTime').on('cancel.daterangepicker', function (ev, picker) {
        $('#endTime').val('');
    });
});
$(document).ready(function () {
    $('#nameInput').on('input', function () {
        var val = $(this).val();
        $("#nameList").find("option").each(function () {
            if ($(this).val() == val) {
                $("#vehicleInput").attr("disabled", false);
                $.ajax({
                    url: window.location.toString() + "/refreshVehicle",
                    type: 'GET',
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
    $("#divButton").click(function () {
        var jobs = [];
        $("input[name='jobs']:checked").each(function () {
            jobs.push(this.value);
        });
        if ($('#startTime').val() != ''
            && $('#endTime').val() != ''
            && jobs.length != 0) {
            $("#nameList").find("option").each(function () {
                if ($(this).val() == $("#nameInput").val()) {
                    var name = $(this).attr('id');
                    $("#vehicleList").find("option").each(function () {
                        if ($(this).val() == $("#vehicleInput").val()) {
                            var vehicle = $(this).attr('id');
                            $.ajax({
                                url: window.location.toString() + "/addFromLocal",
                                type: 'GET',
                                data: {
                                    Customer: name,
                                    Vehicle: vehicle,
                                    desc: $("#desc").val(),
                                    tech: $('#techList option:selected').attr('id'),
                                    jobs: jobs,
                                    startTime: startTime,
                                    endTime: endTime
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
    });
});