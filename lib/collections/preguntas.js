Preguntas = new Mongo.Collection("preguntas");



Preguntas.attachSchema(new SimpleSchema({
  texto: {
    type: String
  },
  respuestas: {
    type: [String]
  },
  idMateria: {
    type: String
  },
  fechaA: {
  	type: Date
  },
  fechaM: {
  	type: Date
  }
}));