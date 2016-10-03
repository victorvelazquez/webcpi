import { Meteor } from 'meteor/meteor'

Meteor.methods({
    'sAgregarCarrera': function(objeto){
        check(objeto.nombre, String);
        check(objeto.idFacultad, String);

        var duplicado = Carreras.find({$and: [{nombre: objeto.nombre},{idFacultad: objeto.idFacultad}]}).count();
        // Valor null o vacio no se acepta
        if (objeto.nombre == '' || objeto.nombre == null) {
            throw new Meteor.Error("", "Nombre obligatoria");
        }
        if (duplicado > 0){
            var facultad =  Facultades.findOne({_id: objeto.idFacultad});
            throw new Meteor.Error("Valor Duplicada", objeto.nombre +" - en la "+ facultad.nombre + "  ya fue cargada");
        }else {
            var varIdUsuario = Meteor.userId();
            Carreras.insert({nombre: objeto.nombre, 
            idUsuario: varIdUsuario, 
            idFacultad: objeto.idFacultad,
            fechaA: new Date(), 
            fechaM: new Date()});
        }
    },
    'sActualizarCarrera': function(id, objeto){
        check(objeto.nombre, String);
        check(objeto.idFacultad, String);
       if (objeto.nombre == '' || objeto.nombre == null) {
            throw new Meteor.Error("", "Nombre obligatoria");
        }
         //Verificando si existe valor duplicado
        Carreras.find({nombre: objeto.nombre}).forEach( function(item) { 
            if (item.idFacultad == objeto.idFacultad && item._id != id) {
                var facultad = Facultades.findOne({_id: objeto.idFacultad});
                throw new Meteor.Error("Valor Duplicada", objeto.nombre +" - en la "+ facultad.nombre + "  ya fue cargada");       
            }; 
         });
        var varIdUsuario = Meteor.userId();
        Carreras.update(id, { $set: { 
            nombre: objeto.nombre, 
            idUsuario: varIdUsuario, 
            idFacultad: objeto.idFacultad,
            fechaM: new Date()}});
    },
    'sBorrarCarrera': function(id){
        check(id, String);
        Carreras.remove({ _id: id});
     },
 });