function getFormattedDate(date) {
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return month + '/' + day + '/' + year;
}

function format(d) {
    var returnString = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
        '<tr>' +
        '<td><b>Service Name</b></td>' +
        '<td><b>Service Category</b></td>' +
        '<td><b>Unit Cost</b></td>' +
        '<td><b>Quantity</b></td>' +
        '</tr>';
    for (var i = 0; i < d.service.length; i++) {
        returnString = returnString +
            '<tr>' +
            '<td>' + d.service[i].name + '</td>' +
            '<td>' + d.service[i].category + '</td>' +
            '<td>' + (d.service[i].unitCost / 100).toFixed(2) + '</td>' +
            '<td>' + d.service[i].quantity + '</td>' +
            '</tr>'
    }
    return returnString;
}

$(document).ready(function () {
    var table = $('#orderTable').DataTable({
        ajax: {
            url: window.location.toString() + "/get",
            dataSrc: ''
        },
        columns: [
            {
                "className": 'details-control',
                "orderable": false,
                "data": null,
                "defaultContent": ''
            },
            {
                data: "dateCreated",
                "render": function (data) {
                    var date = new Date(data);
                    return getFormattedDate(date);
                }
            },
            {
                data: "lastModified",
                "render": function (data) {
                    var date = new Date(data);
                    return getFormattedDate(date);
                }
            }
        ],
        order: [[1, 'desc']]
    });
    $('#orderTable tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
        } else {
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });
});