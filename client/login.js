Template.login.events({
    'click #login-button': function(e, t) {
        e.preventDefault();
        var email = $('#login-email').val(),
            password = $('#login-password').val();

        Meteor.loginWithPassword(email, password, function(error) {
            if (error) {
                return swal({
                    title: "Email o clave incorrecto",
                    text: "Favor intente de nuevo...",
                    timer: 1700,
                    showConfirmButton: false,
                    type: "error"
                });
            } else {
                Router.go('/');
            }
        });
        return false;
    }
});
