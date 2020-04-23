var startTime, endTime;
$(document).ready(function () {
    function round(date, duration, method) {
        return moment(Math[method]((+date) / (+duration)) * (+duration));
    }

    $('input[name="datetime"]').daterangepicker({
        timePicker: true,
        minDate: round(new Date(), moment.duration(30, "minutes"), "ceil"),
        startDate: round(new Date(), moment.duration(30, "minutes"), "ceil"),
        endDate: round(new Date(), moment.duration(30, "minutes"), "ceil").add(0.5, 'hour'),
        locale: {
            format: 'M/DD hh:mm A'
        },
        timePickerIncrement: 30,
        autoUpdateInput: false
    });
    $('#datetime').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD hh:mm A') + ' - ' + picker.endDate.format('YYYY-MM-DD hh:mm A'));
        startTime = picker.startDate.format();
        endTime = picker.endDate.format();
    });
    $('#datetime').on('cancel.daterangepicker', function (ev, picker) {
        $('#datetime').val('');
    });
});
$(document).ready(function () {
    $("#divButton").click(function () {
        var jobs = [];
        $("input[name='jobs']:checked").each(function () {
            jobs.push(this.value);
        });
        if ($('#datetime').val() != ''
            && startTime != endTime
            && jobs.length != 0
            && $('#techList option:selected').attr('id') != undefined) {
            $.ajax({
                url: window.location.protocol.toString() + "//" + window.location.host.toString()
                    + "/shop/" + "<%= user._id %>" + "/calendar/shop-calendar-add-appointment/addFromLocal",
                type: 'GET',
                data: {
                    Customer: "<%= customer._id %>",
                    Vehicle: "<%= vehicle._id %>",
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
});