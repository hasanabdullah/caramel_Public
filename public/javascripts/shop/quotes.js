$(document).ready(function () {
    $('#dialog').hide();
    $('#quoteTable').DataTable({"order": [[2, "desc"]]});
    $('[id^=quotesList]').click(function () {
        var first = $(this).attr('id').replace('quotesList', '');
        var oid = first.substring(first.indexOf("/") + 1);
        console.log(first);
        var qid = first.substring(0, first.indexOf("/"));
        $(function () {
            $('#dialog').show();
            $("#dialog").dialog({
                modal: true,
                resizable: false,
                buttons: {
                    "View PDF": function () {
                        window.open("quote/" + qid);
                    },
                    "View Repair Order": function () {
                        window.location = "orders/" + oid;
                    }
                }
            });
        });
    });
});