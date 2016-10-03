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

Template.listaCarreras.onCreated( () => {
  let template = Template.instance();
  template.subscribe( 'facultades');
  template.subscribe( 'profesores');
  subscribeTemplate("carreras", template);
});

Template.listaCarreras.helpers({
  carreras: function() {
    return Carreras.find({},{sort: {nombre: 1}});
  },
  registroFacultades: function() {
    var cant = Facultades.find().count();
    var existe = false;
    if (cant > 0) {
      existe = true
    }
    return existe;
  },
  registroCantidad: function() {
    return Carreras.find({}).count();
  },
  searching() {
    return Template.instance().searching.get();
  },
  query() {
    return Template.instance().searchQuery.get();
  },
  facultades: function() {
    var facus = Facultades.find({},{sort: {nombre: 1}});
    return facus;
  },
  facultadNombre: function() {
    var facultad = Facultades.findOne({_id: this.idFacultad});
    if (facultad) {
      return facultad.nombre;
    }
    return '';
  },
  noVinculado: function() {
    var idBorrar = this._id;
    var vinculado = true;
    var mat = Profesores.find({carreras: idBorrar});
    if (mat.count() > 0) {
      vinculado = false;
    };
    return vinculado;
  },
});

Template.listaCarreras.events({
  'click .btn-borrar': function(e, b){
    event.preventDefault();
    var idBorrar = this._id;
    //var mat = Materias.findOne({facultades: idBorrar});
    //if (prof) {
    //  swal(
    //    'Atención!',
    //    'No se puede borrar registro vinculado',
    //    'warning'
    //  );
    //  return;
    //}
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
      Meteor.call('sBorrarCarrera', idBorrar, function (error, result) {
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
   'keyup .btn-buscar': function(event, template){
    event.preventDefault();
    let value = $('#btn-buscar').val().trim();
    template.searchQuery.set( value);
    template.searching.set( true );
    return '';
    },
});

///-----------------------------------------------------------------------------
/// Template --> Agregar Carrera
///-----------------------------------------------------------------------------
Template.agregarCarrera.onCreated( () => {
  let template = Template.instance();
  template.subscribe( 'facultades');
  subscribeTemplate("carreras", template);
});

Template.agregarCarrera.helpers({
  facultades: function() {
    return Facultades.find({},{sort: {nombre: 1}});
  },
}); 

Template.agregarCarrera.events({
  'submit form': function(event, template){
    event.preventDefault();
    var varNombre = $('#nombre').val();
    var varIdFacultad = $('#facultad').val();
    //
    var carrera = {
      nombre: varNombre,
      idFacultad: varIdFacultad
    };
    Meteor.call('sAgregarCarrera', carrera, function (error, result) {
      if(!error){
          $('#form-new-carrera').find('input:text').val('');
          $('#nombre').focus();
      }else {
        $('#nombre').focus();
        return throwError(error.message);
      }
    });
    return false;
  }
});
///-----------------------------------------------------------------------------
/// Template --> Modificar Carrera
///-----------------------------------------------------------------------------
Template.editarCarrera.onCreated(function () {
  var variable = this.data.idFacultad;
  Session.set("codigoActual", variable);
  let template = Template.instance();
  template.subscribe( 'facultades');
  subscribeTemplate("carreras", template);
});
Template.editarCarrera.helpers({
  facultades: function() {
    return Facultades.find({},{sort: {nombre: 1}});
  },
}); 
Template.editarCarrera.events({
  'submit form': function(e, template){
    event.preventDefault();
    // Obteniendo Las Facultades Seleccionadas
    var id = $('#id').val();
    var nombre =  $('#nombre').val();
    var facultad = $('#facultades').val();
    //
    var carrera = {
      nombre: nombre,
      idFacultad: facultad
    };
    Meteor.call('sActualizarCarrera',id, carrera, function(error, result) {
      if(!error){
        Router.go('carreras');
      }else {
        return throwError(error.message);
      }
    });
  },
});
