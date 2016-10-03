var subscribeTemplate = function(database, template) {
  template.searchQuery = new ReactiveVar();
  template.searching   = new ReactiveVar( false );
  template.autorun( () => {
    template.subscribe( database, template.searchQuery.get(), () => {
      setTimeout( () => {
        template.searching.set( false );
      }, 300 );
    });
  });
} 


var generarClave =  function () {
  var letters = ['a','b','c','d','e','f','g','h','i','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    var numbers = [0,1,2,3,4,5,6,7,8,9];
    var randomstring = '';
    for(var i=0;i<8;i++){
        var rlet = Math.floor(Math.random()*letters.length);
        var aleatorio = Math.floor(Math.random()*11)+1;
        if (aleatorio < 5) {
          randomstring += letters[rlet].toUpperCase();
        }else {
          randomstring += letters[rlet];
        }
    }
    for(var i=0;i<4;i++){
        var rnum = Math.floor(Math.random()*numbers.length);
        randomstring += numbers[rnum];
    }
   return randomstring;
};
Template.listaProfesores.onCreated( () => {
  let template = Template.instance();
  template.subscribe( 'carreras');
  template.subscribe( 'materias');
  subscribeTemplate("profesores", template);
});

Template.listaProfesores.helpers({
  profesores: function() {
    return Profesores.find({},{sort: {fechaM: -1}});
  },
  usuarioNombre: function() {
    var usuario = Meteor.users.findOne(this.idUsuario);   
    return usuario.username;
  },
  registroCantidad: function() {
    return Profesores.find({}).count();
  },
  registroCarreras: function() {
    var cant = Carreras.find({}).count();
    var existe = false;
    if (cant > 0) {
      existe = true
    }
    return existe;
  },
  noVinculado: function() {
    var idBorrar = this._id;
    var vinculado = true;
    var mat = Materias.findOne({idProfesor: idBorrar});
    if (mat) {
      vinculado = false;
    };
    return vinculado;
  },
  searching() {
    return Template.instance().searching.get();
  },
  query() {
    return Template.instance().searchQuery.get();
  },
});

Template.listaProfesores.events({
  'click .btn-borrar': function(e, b){
    event.preventDefault();
    var idBorrar = this._id;
    var mat = Materias.findOne({idProfesor: idBorrar});
    if (mat) {
      swal(
        'Atención!',
        'No se puede borrar registro vinculado',
        'warning'
      );
      return;
    }
    swal({
        title: 'Borrar registro?',
        text: 'Estas seguro que desea borrar el registro',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd6b55',
        cancelButtonColor: '#d44',
        confirmButtonText: 'Si, borrar ahora!',
        cancelButtonText: 'No, cancelar',
        closeOnConfirm: false
    }, function() {
      Meteor.call('sBorrarProfesor', idBorrar, function (error, result) {
        if(error){
          return throwError(error.message);
        }else {
          swal(
          'Borrado!',
          'El registro ha sido eliminado.',
          'success'
          );
        }
      });  
    });
  },
  'keyup .btn-buscar': function(e, template){
    let value = $('#btn-buscar').val().trim();
    template.searchQuery.set( value );
    template.searching.set( true );
    return '';
    },
});





/// Template --> Agregar Profesor

Template.agregarProfesor.onCreated( () => {
  let template = Template.instance();
  template.subscribe( 'facultades');
  template.subscribe( 'carreras');
  subscribeTemplate("profesores", template);
});
Template.agregarProfesor.helpers({
  carreras: function() {
    return Carreras.find({},{sort: {nombre: 1}});
  },
  facultad: function() {
    var id = this.idFacultad;
    var facultad = Facultades.findOne({_id: id});
    if (facultad){
        return facultad.nombre ; 
    }else {
      return '';
    }
  },
});


Template.agregarProfesor.events({
  'submit form': function(event, template){
    event.preventDefault();
    // Obteniendo Las Facultades Seleccionadas
    var carrerasSelected = template.findAll( "input[type=checkbox]:checked");
    var carrerasArray = _.map(carrerasSelected, function(item) {
      return item.defaultValue;
    });
    // Otros variables
    var documento = $('#documento').val();
    var nombres = $('#nombre').val();
    var correo = $('#correo').val();
    var telefono = $('#celular').val();
    var clave = generarClave();
    //
    var profesor = {
      documento: documento,
      nombres: nombres,
      correo: correo,
      telefono: telefono,
      carreras: carrerasArray,
      clave: clave
    };
    Meteor.call('sAgregarProfesor', profesor, function (error, result) {
      if(!error){
          $('#form-new-profesor').find('input:text').val('');
          $('#documento').val('');
          $('#celular').val('');
          //$('#form-new-profesor').find('input:number').val('');
          $('#documento').focus();
          /// Enviar correo de bienvenida
          Meteor.call("sEnviarCorreo", profesor);
      }else {
        $('#documento').focus();
        return throwError(error.message);
      }
    });
    return false;
  }
});

// Template --> Editar Profesor
Template.editarProfesor.onCreated(function () {
  let template = Template.instance();
  template.subscribe( 'facultades');
  template.subscribe( 'carreras');
  subscribeTemplate("profesores", template);
  var variable = this.data._id;
  var listacarreras = this.data.carreras;
  Session.set("codigoProfesor", variable);
  Session.set("carrerasProfesor", listacarreras);
});

Template.editarProfesor.helpers({
  carreras: function() {
    return Carreras.find({},{sort: {nombre: 1}});
  },
  esMarcado: function() {
    var codigoProfesor = Session.get("codigoProfesor");
    var listacarreras = Session.get("carrerasProfesor");
    var check = false;
    var codigoObtenido = this._id;
    _.forEach(listacarreras, function(item){
        if (item == codigoObtenido) {
          check =  true;
        }
    });
    return check;
  },
  facultad: function() {
    var id = this.idFacultad;
    var facultad = Facultades.findOne({_id: id});
    if (facultad){
        return facultad.nombre ; 
    }else {
      return '';
    }
  },
});

Template.editarProfesor.events({
  'submit form': function(e, template){
    event.preventDefault();
    // Obteniendo Las Facultades Seleccionadas
    var carrerasSelected = template.findAll( "input[type=checkbox]:checked");
    var carrerasArray = _.map(carrerasSelected, function(item) {
      return item.defaultValue;
    });
    // Otros variables
    var documento = $('#documento').val();
    var nombres = $('#nombre').val();
    var correo = $('#correo').val();
    var telefono = $('#celular').val();
    var id = $('#id').val();
    //
    var profesor = {
      documento: documento,
      nombres: nombres,
      correo: correo,
      telefono: telefono,
      carreras: carrerasArray
    };
    Meteor.call('sActualizarProfesor',id, profesor, function(error, result) {
      if(!error){
        Router.go('profesores');
      }else {
        return throwError(error.message);
      }
    });
  }
});