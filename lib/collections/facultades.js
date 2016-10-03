Facultades = new Mongo.Collection("facultades");

Facultades.attachSchema(new SimpleSchema({
  nombre: {
    type: String,
    label: "Nombre de la facultad",
    max: 60,
    min: 3
  },
  idUsuario: {
    type: String
  },
  fechaA: {
  	type: Date
  },
  fechaM: {
  	type: Date
  }
}));