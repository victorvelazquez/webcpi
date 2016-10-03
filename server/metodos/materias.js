import { Meteor } from 'meteor/meteor'

Meteor.methods({
    'sAgregarMateria': function(materia){
        check(materia.nombre, String);
        check(materia.profesor, String);
        check(materia.carrera, String);
        var existeMateria = Materias.find({$and: [{nombre: materia.nombre},{idCarrera: materia.carrera}]}).count();
        // Valor null o vacio no se acepta
        if (materia.nombre == '' || materia.nombre == null) {
            throw new Meteor.Error("", "Nombre obligatoria");
        }
        // Valor duplicado
        if (existeMateria > 0){
            var carrera =  Carreras.findOne({_id: materia.carrera});
            throw new Meteor.Error("", "La materia " + materia.nombre +" ya fue cargada, en la carrera "+ carrera.nombre);
        }else {
            var varIdUsuario = Meteor.userId();
            Materias.insert({nombre: materia.nombre, 
            idUsuario: varIdUsuario, 
            idProfesor: materia.profesor,
            idCarrera: materia.carrera,
            fechaA: new Date(), 
            fechaM: new Date()});
        }
    },
    'sActualizarMateria': function(id, materia){
        check(materia.nombre, String);
        check(materia.profesor, String);
        check(materia.carrera, String);
        var listaMateria = Materias.find({$and: [{nombre: materia.nombre},{idCarrera: materia.carrera}]});
        var existeMateria = false;
        listaMateria.forEach(function(data){
                var obj = {id: data._id, nombre: data.nombre, carrera: data.idCarrera};
                if ((data._id != id) && (data.nombre == materia.nombre) && (data.idCarrera == materia.carrera)) {
                    existeMateria = true;
                }
        });
        if (materia.nombre == '' || materia.nombre == null) {
            throw new Meteor.Error("", "Nombre obligatoria");
        }
        // Valor duplicado
        if (existeMateria){
            var carrera =  Carreras.findOne({_id: materia.carrera});
            throw new Meteor.Error("", "La materia " + materia.nombre +" ya fue cargada, en la carrera "+ carrera.nombre);
        }else {
            var varIdUsuario = Meteor.userId();
            Materias.update(id, { $set: { 
             nombre: materia.nombre, 
             idUsuario: varIdUsuario, 
             idProfesor: materia.profesor, 
             idCarrera: materia.carrera,
             fechaM: new Date()}});
        }
    },
    'sBorrarMateria': function(id){
        check(id, String);
        Materias.remove({ _id: id});
     },
 });