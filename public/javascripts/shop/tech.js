$(document).ready(function () {
    $('[id^=deleteTech]').click(function () {
        var id = $(this).attr("id").replace('deleteTech', '');
        $.ajax({
            url: window.location.toString() + "/tech",
            type: 'DELETE',
            data: {
                id: id
            },
            success: function (data) {
                location.reload();
            }
        });
    });
    $('[id^=techName]').keydown(function (e) {
        if (e.which === 13) {
            var id = $(this).attr("id").replace('techName', '');
            if ($(this).text().trim() != "") {
                $.ajax({
                    url: window.location.toString() + "/tech",
                    type: 'PUT',
                    data: {
                        Tech: $(this).text().trim(),
                        id: id
                    },
                    success: function (data) {
                        location.reload();
                    }
                });
            } else {
                window.alert("wrong format");
                location.reload();
            }
        }
    });
});