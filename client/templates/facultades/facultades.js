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

Template.listaFacultades.onCreated( () => {
  let template = Template.instance();
  template.subscribe( 'carreras');
  subscribeTemplate("facultades", template);

});

Template.listaFacultades.helpers({
  facultades: function() {
    return Facultades.find({},{sort: {fechaM: -1}});
  },
  usuarioNombre: function() {
    var usuario = Meteor.users.findOne(this.idUsuario);   
    return usuario.username;
  },
  registroCantidad: function() {
    return Facultades.find({}).count();
  },
  noVinculado: function() {
    var idBorrar = this._id;
    var vinculado = true;
    var resul = Carreras.findOne({idFacultad: idBorrar});
    if (resul) {
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
  cantidadCarreras: function() {
    var id = this._id;
    var cant = Carreras.find({idFacultad: id}).count();
    return cant;
  },
});
Template.listaFacultades.events({
  'click .btn-borrar': function(e, b){
    e.preventDefault();
    var idBorrar = this._id;
    var prof = Profesores.findOne({facultades: idBorrar});
    if (prof) {
      swal(
        'Atención!',
        'No se puede borrar registro vinculado',
        'warning'
      );
      return;
    }
    swal({
        title: 'Borrar registro!!',
        text: 'Estas seguro que desea borrar el registro?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd6b55',
        cancelButtonColor: '#d44',
        confirmButtonText: 'Si, borrar ahora!',
        cancelButtonText: 'No, cancelar',
        closeOnConfirm: false
    }, function() {
      Meteor.call('sBorrarFacultad', idBorrar, function (error, result) {
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

Template.agregarFacultad.events({
  'submit form': function(e, b){
     e.preventDefault();
    // Obteniendo variable del formulario
    var varNombre = $('#nombre').val();
    var facultad = {
      nombre: varNombre
    };
    Meteor.call('sAgregarFacultad', facultad, function (error, result) {
      if(!error){
          $('#form-new-facultad').find('input:text').val('');
          $('#nombre').focus();
      }else {
        $('#nombre').focus();
        return throwError(error.message);
      }
    });
    return false;
  }
});

Template.editarFacultad.events({
  'submit form': function(e, b){
    e.preventDefault();
    var varNombre = $('#nombre').val();
    var varId = $('#id').val();
    var facultad = {
      nombre: varNombre
    };
    Meteor.call('sActualizarFacultad',varId, facultad, function(error, result) {
      if(!error){
        Router.go('facultades');
      }else {
        return throwError(error.message);
      }
    });
  }
});

Template.editarFacultad.onCreated( () => {
  let template = Template.instance();
  subscribeTemplate("facultades", template);
});
