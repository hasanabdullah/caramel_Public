function notify() {
    alert("This feature is coming soon!");
}

function notifyEmail() {
    alert("Invoice has been sent!");
}

function notifyNoEmail() {
    alert("No email address!");
}

$(document).ready(function () {
    $('#submitPayment').click(function () {
        if (/^[+]?\d+(\.\d+)?$/.test($('#payment').val().trim()) && Number($('#payment').val().trim()) <= $(this).attr("name")) {
            $.ajax({
                url: window.location.toString(),
                type: 'PUT',
                data: {
                    payment: $('#payment').val().trim()
                },
                success: function (data) {
                    location.reload();
                }
            });
        } else {
            window.alert("wrong format");
            location.reload();
        }
    });
    $('#reopen').click(function () {
        $.ajax({
            url: window.location.toString(),
            type: 'DELETE',
            success: function (data) {
                window.location = data;
            }
        });
    });
    $('#payment').keyup(function () {
        var val = this.value;
        var re = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g;
        var re1 = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)/g;
        if (re.test(val)) {
            //do something here
        } else {
            val = re1.exec(val);
            if (val) {
                this.value = val[0];
            } else {
                this.value = "";
            }
        }
    });
});