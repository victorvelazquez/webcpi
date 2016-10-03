Meteor.publish('preguntas', function(search, materias) {
  check( search, Match.OneOf( String, null, undefined ));
  let query = {};
  if(this.userId){
  	if ( search ) {
   		let regex = new RegExp( search, 'i' );
    	query = {texto: regex }, {idMateria: {$in: materias}};
  	};
  	  var result = Preguntas.find(query);
      return result;
  };
});