Materias = new Mongo.Collection("materias");

Materias.attachSchema(new SimpleSchema({
  nombre: {
    type: String,
    label: "Nombre de la materia",
    max: 60,
    min: 3
  },
  idProfesor: {
    type: String
  },
  idCarrera: {
    type: String
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