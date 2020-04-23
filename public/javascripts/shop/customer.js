$(document).ready(function () {

    $('#dataTable').DataTable({
        "columns": [
            null,
            null,
            null,
            null,
            null,
            null,
            {"visible": false, "searchable": true},
            {"visible": false, "searchable": true},
            {"visible": false, "searchable": true},
            {"visible": false, "searchable": true},
            {"visible": false, "searchable": true}
        ]
    });
    $('.remove').click(function () {
        var r = confirm('Are you sure you want to delete ' + $(this).attr("name"));
        if (r === true) {
            $.ajax({
                url: window.location.toString(),
                type: 'DELETE',
                data: {
                    id: $(this).attr("id")
                },
                success: function (data) {
                    window.location = data;
                }
            });
        }
    });
});
