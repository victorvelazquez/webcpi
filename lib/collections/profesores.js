Profesores = new Mongo.Collection("profesores");

Profesores.attachSchema(new SimpleSchema({
  documento: {
    type: String
  },
  nombres: {
    type: String,
    max: 60,
    min: 3
  },
  correo: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  movil:{
    type: String,
    max: 25,
  },
  carreras: {
      type: [String],
      optional: true
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