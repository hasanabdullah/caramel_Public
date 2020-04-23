$(document).ready(function () {
    $('#zip').keyup(function () {
        $.ajax({
            url: "http://api.zippopotam.us/us/" + $(this).val(),
            type: 'GET',
            statusCode: {
                404: function (response) {
                    console.log(response);
                }
            },
            success: function (data) {
                $('#city').val(data.places[0]['place name']);
                $('#state').val(data.places[0]['state abbreviation']);
            }
        });
    });
    $('#accountType').on('change', function () {
        if ($(this).val() === 'personal') {
            $('#personal').show();
            $('#company').hide();
            $('#companyName').removeAttr('required');
        } else {
            $('#personal').hide();
            $('#company').show();
            $('#firstName').removeAttr('required');
            $('#lastName').removeAttr('required');
        }
    });
});