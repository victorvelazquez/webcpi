Template.layout.events({
    'click #logout-button': function(e, t) {
        e.preventDefault();
        Meteor.logout();
        Router.go('/login');
    }
});


Template.header.helpers({
 isAdmin: function() {
 	var user = Meteor.user();
 	var result = false;
 	if(user){
    	if (Roles.userIsInRole(user._id, ['admin'])){
    	  	result = true;
    	}
  	}
  	return result;
 	},
 isTeacher: function() {
    var user = Meteor.user();
    var result = false;
    if(user){
        if (Roles.userIsInRole(user._id, ['teacher'])){
            result = true;
        }
    }
    return result;
    }
});