import { Meteor } from 'meteor/meteor'

Meteor.methods({
    'sAgregarPregunta': function(pregunta){
        check(pregunta.texto, String);
        check(pregunta.idMateria, String);
        if (pregunta.texto == '' || pregunta.texto == null) {
            throw new Meteor.Error("", "Pregunta obligatoria");
        }
        var i = 0;
        while (i < 5) {
            if (pregunta.respuestas[i] == '' || pregunta.respuestas[i] == null) {
                throw new Meteor.Error("", "Respuestas obligatoria");
            };
            i=i+1;
        }; 
        Preguntas.insert({texto: pregunta.texto, 
            idMateria: pregunta.idMateria, 
            respuestas: pregunta.respuestas,
            fechaA: new Date(), 
            fechaM: new Date()
        });
    },
    'sActualizarPregunta': function(id, pregunta){
        check(pregunta.texto, String);
        check(pregunta.idMateria, String);
        var varIdUsuario = Meteor.userId();
        if (pregunta.texto == '' || pregunta.texto == null) {
            throw new Meteor.Error("", "Pregunta obligatoria");
        }
        var i = 0;
        while (i < 5) {
            if (pregunta.respuestas[i] == '' || pregunta.respuestas[i] == null) {
                throw new Meteor.Error("", "Respuestas obligatoria");
            };
            i=i+1;
        }; 
        Preguntas.update(id, { $set: { 
             texto: pregunta.texto, 
             idMateria: pregunta.idMateria, 
             respuestas: pregunta.respuestas,
             fechaM: new Date()}});
    },
    'sBorrarPregunta': function(id){
        check(id, String);
        Preguntas.remove({ _id: id});
     },
 });