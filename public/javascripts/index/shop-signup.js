$(document).ready(function () {
    $.validate({
        form : '#register',
        modules : 'security',
        onSuccess : function($form) {
            return true; // Will stop the submission of the form
        },
    });
});