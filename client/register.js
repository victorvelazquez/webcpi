Template.register.events({
    'click #register-button': function(e, t) {
        e.preventDefault();
        // Retrieve the input field values
        var email = $('#email').val(),
            firstName = $('#first-name').val(),
            lastName = $('#last-name').val(),
            password = $('#password').val(),
            passwordAgain = $('#password-again').val();

        // Trim Helper
        var trimInput = function(val) {
            return val.replace(/^\s*|\s*$/g, "");
        }
        var email = trimInput(email);

        // Check password is at least 6 chars long
        var isValidPassword = function(pwd, pwd2) {
            if (pwd === pwd2) {
                return pwd.length >= 6 ? true : false;
            } else {
                return swal({
                    title: "Passwords don't match",
                    text: "Please try again",
                    showConfirmButton: true,
                    type: "error"
                });
            }
        }
        if (isValidPassword(password, passwordAgain)) { 
            Accounts.createUser({
                email: email,
                username: firstName + ' ' + lastName,
                firstName: firstName,
                lastName: lastName,
                password: password
            }, function(error) {
                if (error) {
                    return swal({
                    title: error.reason,
                    text: "Please try again",
                    showConfirmButton: true,
                    type: "error"
                });
                } else {
                    Router.go('/');
                }
            });
        }

        return false;
    }
});
