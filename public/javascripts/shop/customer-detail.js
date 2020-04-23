$(document).ready(function () {
    $('#representativeTable').DataTable({});
    $('#custname #firstName').keydown(function (e) {
        if (e.which === 13) {
            if ($(this).val() != "") {
                $.ajax({
                    url: window.location.toString(),
                    type: 'PUT',
                    data: {
                        firstName: $(this).val().trim(),
                        type: "firstname"
                    },
                    success: function (data) {
                        location.reload();
                    }
                });
            }
            else {
                window.alert("wrong format");
                location.reload();
            }
        }
    });
    $('#removeCust').click(function () {
        var r = confirm('Are you sure you want to delete ' + $(this).attr("name"));
        if (r === true) {
            $.ajax({
                url: window.location.toString(),
                type: 'DELETE',
                success: function (data) {
                    console.log("deleted");
                    window.location = data;
                }
            });
        }
    });
    $('#custname #lastName').keydown(function (e) {
        if (e.which === 13) {
            if ($(this).val() !== "") {
                $.ajax({
                    url: window.location.toString(),
                    type: 'PUT',
                    data: {
                        lastName: $(this).val().trim(),
                        type: "lastname"
                    },
                    success: function (data) {
                        location.reload();
                    }
                });
            }
            else {
                window.alert("wrong format");
                location.reload();
            }
        }
    });
    $('#compname #companyName').keydown(function (e) {
        if (e.which === 13) {
            if ($(this).val() !== "") {
                $.ajax({
                    url: window.location.toString(),
                    type: 'PUT',
                    data: {
                        companyName: $(this).val(),
                        type: "companyname"
                    },
                    success: function (data) {
                        location.reload();
                    }
                });
            }
            else {
                window.alert("wrong format");
                location.reload();
            }
        }
    });
    $('#custinfo #email').keydown(function (e) {
        if (e.which === 13) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test($(this).val())) {
                $.ajax({
                    url: window.location.toString(),
                    type: 'PUT',
                    data: {
                        email: $(this).val(),
                        type: "email"
                    },
                    success: function (data) {
                        location.reload();
                    }
                });
            }
            else {
                window.alert("wrong format");
                location.reload();
            }
        }
    });
    $('#custinfo #phone').keydown(function (e) {
        if (e.which === 13) {
            if (/^\d{10}$/.test($(this).val())) {
                $.ajax({
                    url: window.location.toString(),
                    type: 'PUT',
                    data: {
                        Phone: $(this).val(),
                        type: "phone"
                    },
                    success: function (data) {
                        location.reload();
                    }
                });
            }
            else {
                window.alert("wrong format");
                location.reload();
            }
        }
    });
    $('#custinfo #address').keydown(function (e) {
        if (e.which === 13) {
            if ($(this).val() != "") {
                $.ajax({
                    url: window.location.toString(),
                    type: 'PUT',
                    data: {
                        address: $(this).val(),
                        type: "address"
                    },
                    success: function (data) {
                        location.reload();
                    }
                });
            }
            else {
                window.alert("wrong format");
                location.reload();
            }
        }
    });
    $('#custinfo #city').keydown(function (e) {
        if (e.which === 13) {
            if (/[\w ]+/.test($(this).val())) {
                $.ajax({
                    url: window.location.toString(),
                    type: 'PUT',
                    data: {
                        city: $(this).val(),
                        type: "city"
                    },
                    success: function (data) {
                        location.reload();
                    }
                });
            }
            else {
                window.alert("wrong format");
                location.reload();
            }
        }
    });
    $('#custinfo #state').keydown(function (e) {
        if (e.which === 13) {
            if (/[\w ]+/.test($(this).val())) {
                $.ajax({
                    url: window.location.toString(),
                    type: 'PUT',
                    data: {
                        state: $(this).val(),
                        type: "state"
                    },
                    success: function (data) {
                        location.reload();
                    }
                });
            }
            else {
                window.alert("wrong format");
                location.reload();
            }
        }
    });
    $('#custinfo #zip').keydown(function (e) {
        if (e.which === 13) {
            if (/^[0-9]{5}$/.test($(this).val())) {
                $.ajax({
                    url: window.location.toString(),
                    type: 'PUT',
                    data: {
                        zip: $(this).val(),
                        type: "zip"
                    },
                    success: function (data) {
                        location.reload();
                    }
                });
            }
            else {
                window.alert("wrong format");
                location.reload();
            }
        }
    });
    $('#notes').keydown(function (e) {
        if (e.which === 13) {
            if ($(this).text().trim() != "") {
                $.ajax({
                    url: window.location.toString(),
                    type: 'PUT',
                    data: {
                        notes: $(this).text().trim(),
                        type: "notes"
                    },
                    success: function (data) {
                        location.reload();
                    }
                });
            }
            else {
                window.alert("could not update notes");
                location.reload();
            }
        }
    });
    $('#vehicinfo [id^=editMake]').keydown(function (e) {
        if (e.which === 13) {
            if ($(this).val().trim() != "") {
                $.ajax({
                    url: window.location.toString() + "/vehicle/" + $(this).attr("id").replace('editMake', ''),
                    type: 'PUT',
                    data: {
                        Make: $(this).val().trim(),
                        type: "make"
                    },
                    success: function (data) {
                        location.reload();
                    }
                });
            }
            else {
                window.alert("wrong format");
                location.reload();
            }
        }
    });
    $('#vehicinfo [id^=editModel]').keydown(function (e) {
        if (e.which === 13) {
            if ($(this).val().trim() != "") {
                $.ajax({
                    url: window.location.toString() + "/vehicle/" + $(this).attr("id").replace('editModel', ''),
                    type: 'PUT',
                    data: {
                        Model: $(this).val().trim(),
                        type: "model"
                    },
                    success: function (data) {
                        location.reload();
                    }
                });
            }
            else {
                window.alert("wrong format");
                location.reload();
            }
        }
    });
    $('#vehicinfo [id^=editYear]').keydown(function (e) {
        if (e.which === 13) {
            var reg = new RegExp('^[0-9]+$');
            if (reg.test($(this).val().trim())) {
                $.ajax({
                    url: window.location.toString() + "/vehicle/" + $(this).attr("id").replace('editYear', ''),
                    type: 'PUT',
                    data: {
                        Year: $(this).val().trim(),
                        type: "year"
                    },
                    success: function (data) {
                        location.reload();
                    }
                });
            }
            else {
                window.alert("wrong format");
                location.reload();
            }
        }
    });
    $('#vehicinfo [id^=editMileage]').keydown(function (e) {
        if (e.which === 13) {
            var reg = new RegExp('^[0-9]+$');
            if (reg.test($(this).val().trim())) {
                $.ajax({
                    url: window.location.toString() + "/vehicle/" + $(this).attr("id").replace('editMileage', ''),
                    type: 'PUT',
                    data: {
                        Mileage: $(this).val().trim(),
                        type: "mileage"
                    },
                    success: function (data) {
                        location.reload();
                    }
                });
            }
            else {
                window.alert("wrong format");
                location.reload();
            }
        }
    });
    $('#vehicinfo [id^=editVIN]').keydown(function (e) {
        if (e.which === 13) {
            if ($(this).val().trim() != "") {
                $.ajax({
                    url: window.location.toString() + "/vehicle/" + $(this).attr("id").replace('editVIN', ''),
                    type: 'PUT',
                    data: {
                        VIN: $(this).val().trim(),
                        type: "VIN"
                    },
                    success: function (data) {
                        location.reload();
                    }
                });
            }
            else {
                window.alert("wrong format");
                location.reload();
            }
        }
    });
    $('#addRep').click(function () {
        if ($('#addRepFirst').val().trim() !== '') {
            $.ajax({
                url: window.location.toString() + "/rep",
                type: 'POST',
                data: {
                    firstName: $('#addRepFirst').val(),
                    lastName: $('#addRepLast').val(),
                    phone: $('#addRepPhone').val(),
                    email: $('#addRepEmail').val(),
                    desc: $('#addRepDesc').val()
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
    $('.deleteRep').click(function () {
        $.ajax({
            url: window.location.toString() + "/rep",
            type: 'DELETE',
            data: {
                id: $(this).attr('id')
            },
            success: function (data) {
                location.reload();
            }
        });
    });
    $('#vehicinfo [id^=editLicense]').keydown(function (e) {
        if (e.which === 13) {
            if ($(this).val().trim() != "") {
                $.ajax({
                    url: window.location.toString() + "/vehicle/" + $(this).attr("id").replace('editLicense', ''),
                    type: 'PUT',
                    data: {
                        License: $(this).val().trim(),
                        type: "license"
                    },
                    success: function (data) {
                        location.reload();
                    }
                });
            }
            else {
                window.alert("wrong format");
                location.reload();
            }
        }
    });
    $('[id^=deleteNote]').click(function () {
        $.ajax({
            url: window.location.toString() + "/note",
            type: 'DELETE',
            data: {
                content: $(this).attr("id").replace('deleteNote', '')
            },
            success: function (data) {
                location.reload();
            }
        });
    });
    $('[id^=deleteCar]').click(function () {
        var r = confirm("Are you sure you want to delete this car?");
        if (r) {
            $.ajax({
                url: window.location.toString() + "/vehicle/" + $(this).attr("id").replace('deleteCar', ''),
                type: 'DELETE',
                data: {
                    id: $(this).attr("id").replace('deleteCar', '')
                },
                success: function (data) {
                    location.reload();
                }
            });
        }
    });
});

function showAddNotes() {
    var addButton = document.getElementById("addNotesButton");
    var vehicleBlock = document.getElementById("addNotesBlock");

    addButton.style.display = "none";
    vehicleBlock.style.display = "block";
}

function cancelButton() {
    var addButton = document.getElementById("addNotesButton");
    var vehicleBlock = document.getElementById("addNotesBlock");

    addButton.style.display = "block";
    vehicleBlock.style.display = "none";
}

function showAddVehicle() {
    var addbutton = document.getElementById("addButton");
    var vehicleBlock = document.getElementById("addVehicleBlock");

    addbutton.style.display = "none";
    vehicleBlock.style.display = "block";

}