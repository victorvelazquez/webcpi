Meteor.publish('facultades', function(search) {
  check( search, Match.OneOf( String, null, undefined ));
  let query = {};
  if(this.userId){
  	if ( search ) {
   		let regex = new RegExp( search, 'i' );
    	query = {nombre: regex };
  	}
    else {
      query = {};
    }
  	  var result = Facultades.find(query);
      return result;
  }
});

