$(document).ready(function () {
    $('#vin').keydown(function () {
        $.ajax({
            url: "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVINValuesBatch/",
            type: 'POST',
            data: {format: "json", data: $(this).val()},
            success: function (data) {
                if (data.Message === "No data found") {

                } else {
                    if (data.Results[0].Make !== '') {
                        $('#make').val(data.Results[0].Make);
                    }
                    if (data.Results[0].Model !== '') {
                        $('#model').val(data.Results[0].Model);
                    }
                    if (data.Results[0].ModelYear !== '') {
                        $('#year').val(data.Results[0].ModelYear);
                    }
                }
            }
        });
    });
});