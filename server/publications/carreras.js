Meteor.publish('carreras', function(search) {
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
  	  var result = Carreras.find(query);
      return result;
  }
});


