import { Meteor } from 'meteor/meteor'

Meteor.methods({
    'sAgregarFacultad': function(facultad){
        check(facultad.nombre, String);
        //var existe = Facultades.findOne({nombre: facultad.nombre})
        //var cantidad = Facultades.find({nombre: facultad.nombre}).count();
        // Valor null o vacio no se acepta
        if (facultad.nombre == '' || facultad.nombre == null) {
            throw new Meteor.Error("", "Nombre obligatoria");
        }
        // Valor duplicado
        if ((Facultades.find({nombre: facultad.nombre}).count()) > 0){
            throw new Meteor.Error("Valor Duplicada", facultad.nombre + " ya existe...");
        }else {
            var varIdUsuario = Meteor.userId();
            Facultades.insert({nombre: facultad.nombre, 
            idUsuario: varIdUsuario, 
            fechaA: new Date(), 
            fechaM: new Date()});
        }
    },
    'sActualizarFacultad': function(id, facultad){
        check(facultad.nombre, String);
        // Verificando valor nulo
        if (facultad.nombre == '' || facultad.nombre == null) {
            throw new Meteor.Error("", "Nombre obligatoria");

        }
        //Verificando si existe valor duplicado
        Facultades.find({nombre: facultad.nombre}).forEach( function(item) { 
            if (item._id != id) {
                throw new Meteor.Error("Valor Duplicada", facultad.nombre + " ya existe...");       
            } 
         } );
        var varIdUsuario = Meteor.userId();
        Facultades.update(id, { $set: { 
             nombre: facultad.nombre, 
             idUsuario: varIdUsuario, 
             fechaM: new Date()}});
    },
    'sBorrarFacultad': function(id){
        check(id, String);
        Facultades.remove({ _id: id});
     },
 });


