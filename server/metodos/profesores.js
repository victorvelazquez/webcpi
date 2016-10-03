import { Meteor } from 'meteor/meteor'

Meteor.methods({
    'sAgregarProfesor': function(profesor){
        check(profesor.documento, String);
        check(profesor.nombres, String);
        check(profesor.telefono, String);
        check(profesor.correo, String);
        var existeDocumento = Profesores.findOne({documento: profesor.documento})
        var existeCorreo = Profesores.findOne({correo: profesor.correo})
        var existeCelular = Profesores.findOne({movil: profesor.telefono})
        //
        if (typeof profesor.carreras[0] == 'undefined' && profesor.carreras[0] == null) {
            throw new Meteor.Error("Campo Obligatorio", "Se debe seleccionar por lo menos una Carrera");
            return false;
        };
        // Valor null o vacio no se acepta
        if (profesor.documento == '' || profesor.documento == null) {
            throw new Meteor.Error("", "Documento obligatorio");
            return false;
        }
        if (existeDocumento){
            throw new Meteor.Error("Valor Duplicada", "El documento " + profesor.documento + " ya existe...");
            return false;
        }
        //
        if (profesor.nombres == '' || profesor.nombres == null) {
            throw new Meteor.Error("", "Nombres obligatorio");
            return false;
        }
        if (Meteor.users.findOne({'emails.address': profesor.correo })) {
            throw new Meteor.Error("Correo Duplicado", "Ya existe un usuario con este correo electrónico");
            return false;
        }
        if (profesor.correo == '' || profesor.correo == null) {
            throw new Meteor.Error("", "Correo obligatorio");
            return false;
        }
        if (existeCorreo){
            throw new Meteor.Error("Valor Duplicada", "El correo "+ profesor.correo + " ya existe");
            return false;
        }
        if (profesor.telefono == '' || profesor.telefono == null) {
            throw new Meteor.Error("", "Nº Celular obligatorio");
            return false;
        }
        if (existeCelular){
            throw new Meteor.Error("Valor Duplicada", "El Número de celular " + profesor.telefono + " ya fue cargada");
            return false;
        }
        var varIdUsuario = Meteor.userId();
        var idTeacher = Profesores.insert({
            documento: profesor.documento,
            nombres: profesor.nombres, 
            movil: profesor.telefono,
            correo: profesor.correo,
            carreras: profesor.carreras,
            idUsuario: varIdUsuario,
            fechaM: new Date()
        });
        if (idTeacher) {
            var userId  = Accounts.createUser({
                email: profesor.correo,
                username: profesor.nombres,
                password: profesor.clave,
                idTeacher: idTeacher 
            });
            var user = Meteor.users.findOne({_id: userId});
            if (user) {
                console.log('Actualizando rol del usuario....');
                Roles.addUsersToRoles(user._id, ['teacher']);
            };
        };
    },
    'sActualizarProfesor': function(id, profesor){
        check(profesor.documento, String);
        check(profesor.nombres, String);
        check(profesor.telefono, String);
        check(profesor.correo, String);
        //
        var existeDocumento = Profesores.findOne({documento: profesor.documento})
        var existeCorreo = Profesores.findOne({correo: profesor.correo})
        var existeCelular = Profesores.findOne({movil: profesor.telefono})
        //
        //
        if (typeof profesor.carreras[0] == 'undefined' && profesor.carreras[0] == null) {
            throw new Meteor.Error("Campo Obligatorio", "Se debe seleccionar por lo menos una Facultad");
            return false;
        };
        // Valor null o vacio no se acepta
        if (profesor.documento == '' || profesor.documento == null) {
            throw new Meteor.Error("", "Documento obligatorio");
            return false;
        }
        if (existeDocumento){
            if (existeDocumento._id != id) {
                throw new Meteor.Error("Valor Duplicada", "El documento " + profesor.documento + " ya existe...");
                return false;
            }
        }
        //
        if (profesor.nombres == '' || profesor.nombres == null) {
            throw new Meteor.Error("", "Nombres obligatorio");
            return false;
        }
        if (profesor.correo == '' || profesor.correo == null) {
            throw new Meteor.Error("", "Correo obligatorio");
            return false;
        }
        if (existeCorreo){
            if (existeCorreo._id != id) {
                throw new Meteor.Error("Valor Duplicada", "El correo "+ profesor.correo + " ya existe");
                return false;
            }   
        }
        if (profesor.telefono == '' || profesor.telefono == null) {
            throw new Meteor.Error("", "Nº Celular obligatorio");
            return false;
        }
        if (existeCelular){
            if (existeCelular._id != id) {
                throw new Meteor.Error("Valor Duplicada", "El Número de celular " + profesor.telefono + " ya fue cargada");
                return false;
             }   
        }
        var varIdUsuario = Meteor.userId();
        var estado = Profesores.update(id, { $set: { 
            documento: profesor.documento,
            nombres: profesor.nombres, 
            movil: profesor.telefono,
            correo: profesor.correo,
            carreras: profesor.carreras,
            idUsuario: varIdUsuario
         }});
        if (estado) {
            console.log("Actualizando datos del usuario... ");
            var usuario = Meteor.users.findOne({'profile.idTeacher': id});
            if (usuario) {
               var idUser = usuario._id;
                Meteor.users.update(idUser, { $set: {
                    'profile.email': profesor.correo,
                    username: profesor.nombres,
                }});
            };
        };    
    },
    'sBorrarProfesor': function(id){
        check(id, String);
        var user = Meteor.users.find({});
        if (user) {
             user.forEach(function(obj) {
                if (obj.profile.idTeacher == id){
                    Profesores.remove({_id: id});
                    Meteor.users.remove({_id: obj._id});
                    return;
                }
            });
        }
     },
 });