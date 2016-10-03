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


var cargarFacultades = function (codigoProfesor) {
    var profesor = Profesores.findOne({_id: codigoProfesor});
    var facus = {};
    if (profesor) {
        facus = profesor.facultades;
     }
     $('#facultades').find('option').remove().end();
     var facultad =  {};
    _.forEach(facus, function(item){
        facultad =  Facultades.findOne({_id: item});                    
        $('#facultades').append("<option value='"+facultad._id+"'>"+facultad.nombre+"</option>");
    });
}

var cargarCarreras = function (codigoProfesor) {
    var profesor = Profesores.findOne({_id: codigoProfesor});
    var carreras = {};
    if (profesor) {
        carreras = profesor.carreras;
     }
     $('#carreras').find('option').remove().end();
     var carrera =  {};
    _.forEach(carreras, function(item){
        carrera =  Carreras.findOne({_id: item});
        var idFacu = carrera.idFacultad; 
        var facu = Facultades.findOne({_id: idFacu});      
        $('#carreras').append("<option value='"+carrera._id+"'>"+carrera.nombre+", "+facu.nombre + "</option>");
    });
}




Template.listaMaterias.onCreated( () => {
  let template = Template.instance();
  template.subscribe( 'profesores');
  template.subscribe( 'carreras');
  template.subscribe( 'preguntas');
  subscribeTemplate("materias", template);
});


  

Template.listaMaterias.helpers({
  materias: function() {
    return Materias.find({},{sort: {fechaM: -1}});
  },
  profesorNombre: function() {
    var profesor = Profesores.findOne(this.idProfesor);   
    return profesor.nombres;
  },
  carreraNombre: function() {
    var carrera = Carreras.findOne(this.idCarrera);   

    return carrera.nombre;
  },
  usuarioNombre: function() {
    var usuario = Meteor.users.findOne(this.idUsuario);   
    return usuario.username;
  },
  registroCantidad: function() {
    return Materias.find({}).count();
  },
  registroProfesores: function() {
    var cant = Profesores.find({}).count();
    var existe = false;
    if (cant > 0) {
      existe = true
    }
    return existe;
  },
  noVinculado: function() {
    var idBorrar = this._id;
    var vinculado = true;
    var cant = Preguntas.find({idMateria: idBorrar}).count();
    if (cant > 0) {
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
Template.listaMaterias.events({
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
      Meteor.call('sBorrarMateria', idBorrar, function (error, result) {
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

///-----------------------------------------------------------------------------
/// Template --> Agregar Materia
///-----------------------------------------------------------------------------
Template.agregarMateria.onCreated( () => {
  let template = Template.instance();
  template.subscribe( 'profesores');
  template.subscribe( 'carreras');
  template.subscribe( 'facultades');
  subscribeTemplate("materias", template);
});



Template.agregarMateria.helpers({
  profesores: function(){
    var profes = Profesores.find({}, {sort: {nombres: 1}});
    return profes;
  }
});
//


Template.agregarMateria.events({
  'submit form': function(e, b){
     event.preventDefault();
    // Obteniendo variable del formulario
    var varNombre = $('#nombre').val();
    var varProfesor = $('#profesores').val();
    var varCarrera = $('#carreras').val();
    var materia = {
      nombre: varNombre,
      profesor: varProfesor,
      carrera: varCarrera
    };
    Meteor.call('sAgregarMateria', materia, function (error, result) {
      if(!error){
          $('#form-new-materia').find('input:text').val('');
          $('#nombre').focus();
      }else {
        $('#nombre').focus();
        return throwError(error.message);
      }
    });
    return false;
  },
  'change #profesores': function(e, b) {
     event.preventDefault();
     var codigoProfesor = $('#profesores').val();
     cargarCarreras(codigoProfesor);
  },
  'focus #profesores': function(e, b) {
     event.preventDefault();
     var codigoProfesor = $('#profesores').val();
     cargarCarreras(codigoProfesor);
  },
});

Template.editarMateria.onCreated(function () {
   let template = Template.instance();
   template.subscribe( 'facultades');
  template.subscribe( 'profesores');
  template.subscribe( 'carreras');
  subscribeTemplate("materias", template);
  var variable = this.data.idProfesor;
  var carrera = this.data.idCarrera;
  Session.set("codigoActual", variable);
  Session.set("codigoActual1", carrera);
});


Template.editarMateria.helpers({
  profesores: function() {
    return Profesores.find({},{sort: {nombre: -1}});
  },
  carreras: function() {
    return Carreras.find({},{sort: {nombre: -1}});
  },
  nombreFacultad: function(id) {
    
    var facu = Facultades.findOne({_id: id});
    if (facu) {
      return facu.nombre;
    } else {
      return '';
    }
  },
});

Template.editarMateria.events({
  'submit form': function(e, template){
    event.preventDefault();
    // Obteniendo Las Facultades Seleccionadas
    var matId = $('#id').val();
    var matNombre =  $('#nombre').val();
    var matProfesor = $('#profesores').val();
    var matCarrera = $('#carreras').val();
    //
    var materia = {
      nombre: matNombre,
      profesor: matProfesor,
      carrera: matCarrera
    };
    Meteor.call('sActualizarMateria',matId, materia, function(error, result) {
      if(!error){
        Router.go('materias');
      }else {
        return throwError(error.message);
      }
    });
  },
  'change #profesores': function(e, b) {
     event.preventDefault();
     var codigoProfesor = $('#profesores').val();
     cargarCarreras(codigoProfesor);
  },
  'focus #profesores': function(e, b) {
     event.preventDefault();
     var codigoProfesor = $('#profesores').val();
     cargarCarreras(codigoProfesor);
  },
});