Meteor.publish('userData', function() {
    var currentUser;
    currentUser = this.userId;
    if (currentUser) {
        return Meteor.users.find({
            _id: currentUser
        }, {
            fields: {
                "emails": 1,
                "profile": 1,
                "roles": 2
            }
        });
    } else {
        return this.ready();
    }
});
