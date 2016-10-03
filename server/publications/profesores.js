Meteor.publish('profesores', function(search) {
  check( search, Match.OneOf( String, null, undefined ));
//  var varIdUsuario = this.userId;
  let query = {};
  if(this.userId){
  	if ( search ) {
   		let regex = new RegExp( search, 'i' );
    	//query = {$and: [{nombres: regex}, {_id: { $ne: varIdUsuario }}]} ;
      query = {nombres: regex };
  	}
    else {
      //query = {_id: { $ne: varIdUsuario }};
       query = {};
    }
   	var result = Profesores.find(query);
    return result;
  }
});

