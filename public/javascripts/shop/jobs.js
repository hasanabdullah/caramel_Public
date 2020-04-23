$(document).ready(function () {
    $('[id^=deleteJob]').click(function () {
        var id = $(this).attr("id").replace('deleteJob', '');
        $.ajax({
            url: window.location.toString() + "/job",
            type: 'DELETE',
            data: {
                id: id
            },
            success: function (data) {
                location.reload();
            }
        });
    });
    $('[id^=jobName]').keydown(function (e) {
        if (e.which === 13) {
            if ($(this).text().trim() !== "") {
                $.ajax({
                    url: window.location.toString() + "/job",
                    type: 'PUT',
                    data: {
                        Name: $(this).text().trim(),
                        id: $(this).attr("id").replace('jobName', ''),
                        type: "name"
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
    $('[id^=cost]').keydown(function (e) {
        if (e.which === 13) {
            $.ajax({
                url: window.location.toString() + "/job",
                type: 'PUT',
                data: {
                    Cost: $(this).val(),
                    id: $(this).attr("id").replace('cost', ''),
                    type: "cost"
                },
                success: function (data) {
                    location.reload();
                }
            });
        }
    });
    $('#unitCost').keyup(function () {
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
    $('[id^=cost]').keyup(function () {
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
    $('[id^=categoryDiv]').dblclick(function () {
        $('#jobCategory' + $(this).attr("id").replace('categoryDiv', '')).toggle();
        $('#categorySpan' + $(this).attr("id").replace('categoryDiv', '')).toggle();
    });
    $('[id^=changeJob]').click(function () {
        if (!$("input[name='changeCategory']:checked").val()) {
            window.alert("select one category");
            location.reload();
        } else {
            $.ajax({
                url: window.location.toString() + "/job",
                type: 'PUT',
                data: {
                    category: $("input[name='changeCategory']:checked").val(),
                    id: $(this).attr("id").replace('changeJob', ''),
                    type: "category"
                },
                success: function (data) {
                    location.reload();
                }
            });
        }
    });
});

function showHideInfo() {
    var dis = document.getElementById("edit-info");
    var info = document.getElementById("profile-info");
    var button = document.getElementById("button-normal");
    if (button.value === "Change Password") {
        info.style.display = "none";
        button.value = "Cancel";
        dis.style.display = "block";

    } else {
        button.value = "Change Password";
        dis.style.display = "none";
        info.style.display = "block";
    }
}