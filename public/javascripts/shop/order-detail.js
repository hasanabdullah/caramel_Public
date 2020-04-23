$(document).ready(function () {
    function round(date, duration, method) {
        return moment(Math[method]((+date) / (+duration)) * (+duration));
    }

    $('#startTime').daterangepicker({
        singleDatePicker: true,
        minDate: round(new Date(), moment.duration(30, "minutes"), "ceil"),
        startDate: round(new Date(), moment.duration(30, "minutes"), "ceil"),
        locale: {
            format: 'M/DD'
        },
        autoUpdateInput: false
    });
    $('#startTime').on('apply.daterangepicker', function (ev, picker) {
        $.ajax({
            url: window.location.toString(),
            type: 'PUT',
            data: {
                dateStarted: picker.startDate.format(),
                type: "dateStarted"
            },
            success: function (data) {
            }
        });
    });
    $('#endTime').daterangepicker({
        singleDatePicker: true,
        minDate: round(new Date($('#startTime').val()), moment.duration(30, "minutes"), "ceil"),
        startDate: round(new Date($('#startTime').val()), moment.duration(30, "minutes"), "ceil"),
        locale: {
            format: 'M/DD'
        },
        autoUpdateInput: false
    });
    $('#endTime').on('apply.daterangepicker', function (ev, picker) {
        $.ajax({
            url: window.location.toString(),
            type: 'PUT',
            data: {
                dateEnded: picker.startDate.format(),
                type: "dateEnded"
            },
            success: function (data) {
                location.reload();
            }
        });
    });
    $('#startMileage').focusout(function () {
        if ($(this).val() >= 0) {
            $.ajax({
                url: window.location.toString(),
                type: 'PUT',
                data: {
                    startMileage: $(this).val(),
                    type: "startMileage"
                },
                success: function (data) {
                }
            });
        } else {
            window.alert("wrong format");
            location.reload();
        }
    });
    $('#endMileage').focusout(function () {
        if ($(this).val() >= $('#startMileage').val()) {
            $.ajax({
                url: window.location.toString(),
                type: 'PUT',
                data: {
                    endMileage: $(this).val(),
                    type: "endMileage"
                },
                success: function (data) {
                }
            });
        } else {
            window.alert("wrong format");
            location.reload();
        }
    });
    $('#issueTable').DataTable({
        responsive: true,
        searching: false,
        paging: false
    });
    $('#orderTable').DataTable({
        responsive: true,
        searching: false,
        paging: false,
        "footerCallback": function (row, data, start, end, display) {
            var api = this.api(), data;
            // Remove the formatting to get integer data for summation
            var intVal = function (i) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };
        }
    });
    $('#invoiceTable').DataTable({
        responsive: true,
        searching: false,
        paging: false,
        "columnDefs": [
            {"width": "10%", "targets": 0},
            {"width": "30%", "targets": 1}
        ]
    });
    $('#quoteTable').DataTable({
        responsive: true,
        searching: false,
        paging: false,
        "columnDefs": [
            {"width": "10%", "targets": 0},
            {"width": "30%", "targets": 1}
        ]
    });
    $('#addCorrection').blur(function () {
        if ($('#addComplaint').val().trim() != '' || $('#addCause').val().trim() != '' || $('#addCorrection').val().trim() != '') {
            $.ajax({
                url: window.location.toString() + "/issue",
                type: 'POST',
                data: {
                    complaint: $('#addComplaint').val().trim(),
                    cause: $('#addCause').val().trim(),
                    correction: $('#addCorrection').val().trim()
                },
                success: function (data) {
                    location.reload();
                }
            });
        }
    });
    $('#addCause, #addComplaint').blur(function () {
        setTimeout(function () {
            if (!$('.addingIssue').is(':focus')) {
                if ($('#addComplaint').val().trim() != '' || $('#addCause').val().trim() != '' || $('#addCorrection').val().trim() != '') {
                    $.ajax({
                        url: window.location.toString() + "/issue",
                        type: 'POST',
                        data: {
                            complaint: $('#addComplaint').val().trim(),
                            cause: $('#addCause').val().trim(),
                            correction: $('#addCorrection').val().trim()
                        },
                        success: function (data) {
                            location.reload();
                        }
                    });
                }
            }
        }, 100);
    });
    $('#tags').keydown(function (e) {
        if (e.which === 13) {
            if ($(this).text().trim() != "") {
                $.ajax({
                    url: window.location.toString() + "/tag",
                    type: 'PUT',
                    data: {
                        tags: $(this).text().trim(),
                        type: "tags"
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
    $('#tags').blur(function (e) {
            if ($(this).text().trim() != "") {
                $.ajax({
                    url: window.location.toString() + "/tag",
                    type: 'PUT',
                    data: {
                        tags: $(this).text().trim(),
                        type: "tags"
                    },
                    success: function (data) {
                        location.reload();
                    }
                });
            }
    });
    $('#jobInput, #addUnitCost, #addQuantity', '#addSource').blur(function () {
        setTimeout(function () {
            if (!$('.addService').is(':focus')) {
                if ($('#addUnitCost').val() != '' && $('#addQuantity').val() != '') {
                    $.ajax({
                        url: window.location.toString() + "/service",
                        type: 'POST',
                        data: {
                            jobInput: $('#jobInput').val(),
                            category: $('#category').val(),
                            source: $('#addSource').val(),
                            unitCost: $('#addUnitCost').val(),
                            quantity: $('#addQuantity').val(),
                            issueNumber: $('#issueNumber').val(),
                            technician: $('#technicianInput').val()
                        },
                        success: function (data) {
                            //location.reload();
                        }
                    });
                } else {
                    window.alert("Must input unit cost and quantity");
                }
            }
        }, 100);
    });
    $('#jobInput').on('input', function () {
        var val = $(this).val();
        $("#jobList").find("option").each(function () {
            if ($(this).val() == val) {
                var splits = $(this).text().split(',', 2);
                $('#category').val(splits[0].trim());
                $('#addUnitCost').val(splits[1].trim());
            }
        });
    });
    $('#addService').on('change', 'input', function () {
        $('#subTotal').text(($('#addUnitCost').val() * $('#addQuantity').val()).toFixed(2));
    });
    $('#editLaborTax').on('change', 'input', function () {
        $('#laborTax').text(($(this).val() / 100 * $('#laborSubtotal').text()).toFixed(2));
        var total = parseFloat($('#laborTax').text()) + parseFloat($('#partsTax').text()) + parseFloat($('#laborSubtotal').text()) + parseFloat($('#partsSubtotal').text());
        $('#total').text(total.toFixed(2));
        var id = window.location.pathname.split("/")[4];
        $.ajax({
            url: "/tax/labor/" + id + "/" + $(this).val(),
            type: 'GET'
        });
    });
    $('#editPartsTax').on('change', 'input', function () {
        $('#partsTax').text(($(this).val() / 100 * $('#partsSubtotal').text()).toFixed(2));
        var total = parseFloat($('#laborTax').text()) + parseFloat($('#partsTax').text()) + parseFloat($('#laborSubtotal').text()) + parseFloat($('#partsSubtotal').text());
        $('#total').text(total.toFixed(2));
        var id = window.location.pathname.split("/")[4];
        $.ajax({
            url: "/tax/parts/" + id + "/" + $(this).val(),
            type: 'GET'
        });
    });
    $('.editService').on('change', 'input', function () {
        if ($(this).attr("id") !== undefined) {
            if ($(this).attr("id").includes('editQuan')) {
                var id = $(this).attr("id").replace("editQuan", "");
                $('#subTotal' + id).text(($('#editCost' + id).val() * $('#editQuan' + id).val()).toFixed(2));
            } else if ($(this).attr("id").includes('editCost')) {
                var id = $(this).attr("id").replace("editCost", "");
                $('#subTotal' + id).text(($('#editCost' + id).val() * $('#editQuan' + id).val()).toFixed(2));
            } else {
            }
        }
    });
    $('#addService').keydown(function (e) {
        if (e.which === 13) {
            if ($('#addUnitCost').val() != '' && $('#addQuantity').val() != '') {
                $.ajax({
                    url: window.location.toString() + "/service",
                    type: 'POST',
                    data: {
                        jobInput: $('#jobInput').val(),
                        category: $('#category').val(),
                        source: $('#addSource').val(),
                        unitCost: $('#addUnitCost').val(),
                        quantity: $('#addQuantity').val(),
                        issueNumber: $('#issueNumber').val(),
                        technician: $('#technicianInput').val()
                    },
                    success: function (data) {
                        //location.reload();
                    }
                });
            } else {
                window.alert("Must input unit cost and quantity");
            }
        }
    });
    $('#addQuantity, #addUnitCost, .editQuan, .editCost').keyup(function (e) {
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
    $('.editName').blur(function () {
        if ($(this).val().trim() != "") {
            $.ajax({
                url: window.location.toString() + "/service/" + $(this).attr("name").trim(),
                type: 'PUT',
                data: {
                    Name: $(this).val().trim(),
                    type: "name"
                },
                success: function (data) {
                }
            });
        }
        else {
            window.alert("wrong format");
            //location.reload();
        }
    });
    $('.editQuan').blur(function () {
        if ($(this).val().trim() >= 0) {
            $.ajax({
                url: window.location.toString() + "/service/" + $(this).attr("name").trim(),
                type: 'PUT',
                data: {
                    Quan: $(this).val().trim(),
                    type: "quan"
                },
                success: function (data) {
                    //location.reload();
                }
            });
        }
        else {
            window.alert("wrong format");
            //location.reload();
        }
    });
    $('.editCost').blur(function () {
        if ($(this).val().trim() >= 0) {
            $.ajax({
                url: window.location.toString() + "/service/" + $(this).attr("name").trim(),
                type: 'PUT',
                data: {
                    Cost: $(this).val().trim(),
                    type: "cost"
                },
                success: function (data) {
                    //location.reload();
                }
            });
        } else {
            window.alert("wrong format");
            //location.reload();
        }
    });
    $('.editSource').blur(function () {
        if ($(this).text().trim() >= 0) {
            $.ajax({
                url: window.location.toString() + "/service/" + $(this).attr("name").trim(),
                type: 'PUT',
                data: {
                    Source: $(this).val().trim(),
                    type: "source"
                },
                success: function (data) {
                    //location.reload();
                }
            });
        } else {
            window.alert("wrong format");
            //location.reload();
        }
    });
    $('.editCategory').on('change', function () {
        $.ajax({
            url: window.location.toString() + "/service/" + $(this).attr("name"),
            type: 'PUT',
            data: {
                Category: $(this).val(),
                type: "category"
            },
            success: function (data) {
                //location.reload();
            }
        });
    });
    $('.editIssueNum').on('change', function () {
        $.ajax({
            url: window.location.toString() + "/service/" + $(this).attr("name"),
            type: 'PUT',
            data: {
                IssueNum: $(this).val(),
                type: "issueNum"
            },
            success: function (data) {
            }
        });
    });
    $('.editTechnician').on('change', function () {
        $.ajax({
            url: window.location.toString() + "/service/" + $(this).attr("name"),
            type: 'PUT',
            data: {
                Technician: $(this).val(),
                type: "technician"
            },
            success: function (data) {
            }
        });
    });
    $('.editStatus').click(function () {
        if ($(this).val() === 'In progress') {
            if ($('#remainingBalance').text() > 0) {
                var r = confirm("Invoice still has a remaining balance. Are you sure you want to close it?");
                if (r === true) {
                    $.ajax({
                        url: window.location.toString(),
                        type: 'PUT',
                        data: {
                            status: "Closed",
                            type: "status"
                        },
                        success: function (data) {
                            location.reload();
                        }
                    });
                } else {
                    location.reload();
                }
            } else {
                $.ajax({
                    url: window.location.toString(),
                    type: 'PUT',
                    data: {
                        status: "Closed",
                        type: "status"
                    },
                    success: function (data) {
                        location.reload();
                    }
                });
            }
        } else {
            $.ajax({
                url: window.location.toString(),
                type: 'PUT',
                data: {
                    status: "In progress",
                    type: "status"
                },
                success: function (data) {
                    location.reload();
                }
            });
        }
    });
    $("button[name='deleteIssue']").click(function () {
        $.ajax({
            url: window.location.toString() + "/issue",
            type: 'DELETE',
            data: {
                id: $(this).attr("id")
            },
            success: function (data) {
                location.reload();
            }
        });
    });
    $("button[name='deleteService']").click(function () {
        $.ajax({
            url: window.location.toString() + "/service",
            type: 'DELETE',
            data: {
                id: $(this).attr("id")
            },
            success: function (data) {
                location.reload();
            }
        });
    });
    $('.editComplaint').blur(function () {
        $.ajax({
            url: window.location.toString() + "/issue/" + $(this).attr("id"),
            type: 'PUT',
            data: {
                Complaint: $(this).val().trim(),
                type: "complaint"
            },
            success: function (data) {
            }
        });
    });
    $('.editCause').blur(function () {
        $.ajax({
            url: window.location.toString() + "/issue/" + $(this).attr("id"),
            type: 'PUT',
            data: {
                Cause: $(this).val().trim(),
                type: "cause"
            },
            success: function (data) {
            }
        });
    });
    $('.editCorrection').blur(function () {
        $.ajax({
            url: window.location.toString() + "/issue/" + $(this).attr("id"),
            type: 'PUT',
            data: {
                Correction: $(this).val().trim(),
                type: "correction"
            },
            success: function (data) {
            }
        });
    });
    $('#generateQuote').click(function () {
        $.ajax({
            url: window.location.toString() + "/quote",
            type: 'POST',
            data: {
                amount: $('#total').text(),
                type: 'amount'
            },
            success: function (data) {
                location.reload();
            }
        });
    });
    $('#generateInvoice').click(function () {
        $.ajax({
            url: window.location.toString() + "/invoice/add",
            type: 'POST',
            data: {
                amount: $('#total').text(),
                type: 'amount'
            },
            success: function (data) {
                location.reload();
            },
            failure: function (data) {
                location.replace('google.com');
            }
        });
    });
    $('#updateInvoice').click(function () {
        $.ajax({
            url: window.location.toString() + "/invoice/update",
            type: 'POST',
            data: {
                amount: $('#total').text(),
                type: 'amount'
            },
            success: function (data) {
                location.reload();
            },
            failure: function (data) {
                location.replace('google.com');
            }
        });
    });
    $('.emailQuote').click(function () {
        $.ajax({
            url: window.location.toString() + "/quote/" + $(this).attr("id"),
            type: 'PUT',
            success: function (data) {
                window.alert("quote email sent");
                location.reload();
            }
        });
    });
    $('.emailInvoice').click(function () {
        $.ajax({
            url: window.location.toString() + "/invoice/" + $(this).attr("id"),
            type: 'PUT',
            success: function (data) {
                window.alert("invoice email sent");
                location.reload();
            }
        });
    });
    $('[id^=deleteQuote]').click(function () {
        var r = confirm("Are you sure you want to delete this quote?");
        if (r === true) {
            $.ajax(
                {
                    url: window.location.toString() + "/quote/" + $(this).attr('id').replace('deleteQuote', ''),
                    type: 'DELETE',
                    success: function (data) {
                        location.reload();
                    }
                }
            )
        }
    });
    $('.deleteInvoice').click(function () {
        var r = confirm("Are you sure you want to delete this invoice");
        if (r === true) {
            $.ajax({
                url: window.location.toString() + "/invoice/" + $(this).attr("id"),
                type: 'DELETE',
                success: function (data) {
                    location.reload();
                }
            });
        }
    });
    $('[id^=deletePayment]').click(function () {
        var r = confirm("Are you sure you want to delete this payment?");
        if (r === true) {
            $.ajax({
                url: window.location.toString() + "/payment/" + $(this).attr('id').replace('deletePayment', ''),
                type: 'DELETE',
                data: {
                    id: $(this).attr('id').replace('deletePayment', ''),
                    type: 'id'
                },
                success: function (data) {
                    location.reload();
                }
            });
        }
    });
    $('.markPaid').click(function () {
        $('#paymentBox').css('display', 'inline-block');
    });
});
