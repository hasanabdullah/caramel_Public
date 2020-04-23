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
    $('#showChangePWD').click(function () {
        $('#changePWD').show();
        $('#showChangePWD').hide();
    });
    $('#changePassword').click(function () {
        if ($('#password').val() != $('#retype').val()) {
            alert("password does not match");
            location.reload();
        } else {
            $.ajax({
                url: window.location.toString() + "/",
                type: 'PUT',
                data: {
                    password: $('#password').val(),
                    type: "password"
                },
                success: function (data) {
                    window.location = data;
                }
            });
        }
    });
    $('#password').focus(function () {
        $('#message').show();
    });
    $('#password').blur(function () {
        $('#message').hide();
    });
    $('#password').keyup(function() {
        // Validate lowercase letters
        if (/[a-z]/g.test($('#password').val())) {
            $('#letter').removeClass('invalid');
            $('#letter').addClass('valid');
        } else {
            $('#letter').removeClass('valid');
            $('#letter').addClass('invalid');
        }

        // Validate capital letters
        if (/[A-Z]/g.test($('#password').val())) {
            $('#capital').removeClass('invalid');
            $('#capital').addClass('valid');
        } else {
            $('#capital').removeClass('valid');
            $('#capital').addClass('invalid');
        }

        // Validate numbers
        if (/\d/g.test($('#password').val())) {
            $('#number').removeClass('invalid');
            $('#number').addClass('valid');
        } else {
            $('#number').removeClass('valid');
            $('#number').addClass('invalid');
        }

        // Validate length
        if($('#password').val().length >= 8) {
            $('#length').removeClass('invalid');
            $('#length').addClass('valid');
        } else {
            $('#length').removeClass('valid');
            $('#length').addClass('invalid');
        }
    });
    $('#bay').keydown(function (e) {
        if (e.which === 13) {
            var reg = new RegExp('^[0-9]+$');
            var content = $(this).text().trim();
            if (reg.test(content)) {
                $.ajax({
                    url: window.location.toString(),
                    type: 'PUT',
                    data: {
                        Bay: content,
                        type: "bay"
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
    $('#name').keydown(function (e) {
        if (e.which === 13) {
            if ($(this).text().trim() !== "") {
                $.ajax({
                    url: window.location.toString(),
                    type: 'PUT',
                    data: {
                        Name: $(this).text().trim(),
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
    $('#phone').keydown(function (e) {
        if (e.which === 13) {
            if (/^\d{10}$/.test($(this).text().trim())) {
                $.ajax({
                    url: window.location.toString(),
                    type: 'PUT',
                    data: {
                        Phone: $(this).text().trim(),
                        type: "phone"
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
    $('#address').keydown(function (e) {
        if (e.which === 13) {
            $.ajax({
                url: window.location.toString(),
                type: 'PUT',
                data: {
                    Address: $(this).text().trim(),
                    type: "address"
                },
                success: function (data) {
                    location.reload();
                }
            });
        }
    });
    $('#city').keydown(function (e) {
        if (e.which === 13) {
            if (/[\w ]+/.test($(this).text().trim())) {
                $.ajax({
                    url: window.location.toString(),
                    type: 'PUT',
                    data: {
                        City: $(this).text().trim(),
                        type: "city"
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
    $('#state').keydown(function (e) {
        if (e.which === 13) {
            if (/[\w ]+/.test($(this).text().trim())) {
                $.ajax({
                    url: window.location.toString(),
                    type: 'PUT',
                    data: {
                        State: $(this).text().trim(),
                        type: "state"
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
    $('#zip').keydown(function (e) {
        if (e.which === 13) {
            if (/^[0-9]{5}$/.test($(this).text().trim())) {
                $.ajax({
                    url: window.location.toString(),
                    type: 'PUT',
                    data: {
                        Zip: $(this).text().trim(),
                        type: "zip"
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
    $('#repairsTable').DataTable({"order": [[4, "desc"]]});
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