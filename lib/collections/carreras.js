Carreras = new Mongo.Collection("carreras");

Carreras.attachSchema(new SimpleSchema({
  nombre: {
    type: String,
  },
  idFacultad: {
    type: String
  },
  idUsuario: {
    type: String
  },
  fechaA: {
  	type: Date,
    autoValue: function() {
      if ( this.isInsert ) {
        return new Date;
      } 
    }
  },
  fechaM: {
  	type: Date,
    autoValue: function() {
      if ( this.isUpdate ) {
        return new Date;
      } 
    }
  }
}));