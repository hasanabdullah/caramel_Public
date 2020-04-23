$(document).ready(function () {
    $('.remove').click(function () {
        $.ajax({
            url: window.location.toString(),
            type: 'DELETE',
            data: {
                id: $(this).attr("name")
            },
            success: function () {
                location.reload();
            }
        });
    });
    $('.like').click(function () {
        $.ajax({
            url: window.location.toString(),
            type: 'POST',
            data: {
                id: $(this).attr("name")
            },
            success: function () {
                location.reload();
            }
        });
    });
});