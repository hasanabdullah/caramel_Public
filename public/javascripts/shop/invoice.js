$(document).ready(function () {
    $('#dialog').hide();
    $('#invoiceTable').DataTable({"order": [[2, "desc"]]});

    $('[id^=invoiceList]').click(function () {
        var first = $(this).attr('id').replace('invoiceList', '');
        var oid = first.substring(first.indexOf("/") + 1);
        var invid = first.substring(0, first.indexOf("/"));
        var viewLink="orders/" + oid + "/invoice/" + invid;
        $(function () {
            $('#dialog').show();
            $("#dialog").dialog({
                modal: true,
                resizable: false,
                buttons: {
                    "View PDF": function () {
                        window.open("orders/" + oid + "/invoice/" + invid);
                    },
                    "View Repair Order": function () {
                        window.location = "orders/" + oid;
                    }
                }
            });
        });
    });
});