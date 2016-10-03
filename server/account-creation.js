Accounts.onCreateUser(function(options, user) {
    // Use provided profile in options, or create an empty profile object
    user.profile = options.profile || {};
    // Assigns the first and last names to the newly created user object
    //user.profile.firstName = options.firstName;
    user.profile.idTeacher = options.idTeacher;
//    user.username =  options.firstName + ' ' +  options.lastName;
    //user.profile.profPicture = Meteor.absoluteUrl() + "img/default/user.jpg";
    //user.profile.organization = ["Org"];
    //Basic Role Set Up
    //if (!user.roles) {;
    //    user.roles = ['teacher'];
    //};
    return user;
});
