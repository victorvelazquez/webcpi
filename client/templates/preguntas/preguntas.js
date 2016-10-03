var formatarSummerNote = function () {
   $('#pregunta').summernote({
         height: 100,   
         focus: true,   
         lang: 'es-ES',
         tabsize: 2,
         hint: {
            match: /:([\-+\w]+)$/,
            search: function (keyword, callback) {
            callback($.grep(emojis, function (item) {
                return item.indexOf(keyword)  === 0;
            }));
            },
            template: function (item) {
                var content = emojiUrls[item];
                return '<img src="' + content + '" width="20" /> :' + item + ':';
            },
            content: function (item) {
                var url = emojiUrls[item];
                if (url) {
                    return $('<img />').attr('src', url).css('width', 20)[0];
                }
            return '';
            }
        }
     });

     $('#correcta').summernote({
         height: 100,   
         lang: 'es-ES'
         
     });
     $('#incorrecta1').summernote({
         height: 100,   
         lang: 'es-ES'
     });
     $('#incorrecta2').summernote({
         height: 100,   
         lang: 'es-ES'
     });
     $('#incorrecta3').summernote({
         height: 100,   
         lang: 'es-ES'
     });
     $('#incorrecta4').summernote({
         height: 100,   
         lang: 'es-ES'
     });
};

// Emoticones
$.ajax({
  url: 'https://api.github.com/emojis',
  async: false 
}).then(function(data) {
  window.emojis = Object.keys(data);
  window.emojiUrls = data; 
});;

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



var obtenerIdProfesor = function() {
	var user = Meteor.users.findOne({_id: Meteor.userId()})
	var idProfesor = user.profile.idTeacher;
	return idProfesor;
};

var esAdmin = function() {
  var user = Meteor.user();
  var result = false;
  if(user){
      if (Roles.userIsInRole(user._id, ['admin'])){
          result = true;
      }
  }
  return result;
};


Template.listaPreguntas.onCreated( () => {
  let template = Template.instance();
  template.subscribe( 'users');
  template.subscribe( 'materias');
  template.subscribe( 'carreras');
  subscribeTemplate("preguntas", template);
});



Template.listaPreguntas.helpers({
  esAdmin: function() {
    return esAdmin();
  },
	preguntas: function () {
    if (esAdmin) {
      return Preguntas.find({}, {sort: {fechaM: -1}})
    }
		var materias = [];
		Materias.find({idProfesor: obtenerIdProfesor()}).forEach( function(item) { 
			materias.push(item._id);
		 } );
        let result = Preguntas.find({idMateria: {$in: materias}}, {sort: {fechaM: -1}})
        if ( result) {
            return result;
        };
		
	},
	nombreMateria: function() {
		var idMateria = this.idMateria;
		var materia = Materias.findOne({_id: idMateria});
    if (materia) {
      return materia.nombre;
    }
		return '';
	},
  nombreCarrera: function(idMateria) {
    var materia = Materias.findOne({_id: idMateria});
    if (!materia) {
      return '';
    }
    var idCarrera = materia.idCarrera;
    var carrera = Carreras.findOne({_id: idCarrera});
    if (carrera) {
      return carrera.nombre;
    }
    return '';
  },
  registroCantidad: function() {
    return Preguntas.find({}).count();
  },
    noVinculado: function() {
    var idBorrar = this._id;
    var vinculado = true;
    //var cant = Materias.find({_id: idBorrar}).count();
    //if (cant > 0) {
    //  vinculado = true;
    //};
    return vinculado;
  },
  searching() {
    return Template.instance().searching.get();
  },
  query() {
    return Template.instance().searchQuery.get();
  },
  valorIncorrecta: function(id, pos) {
    var pregu = Preguntas.findOne({_id: id});
    if (pregu) {
        return pregu.incorrecta[pos];
    }
    return '';
  },
}); 

Template.listaPreguntas.events({
  'click .btn-borrar': function(e, b){
    event.preventDefault();
    var idBorrar = this._id;
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
      Meteor.call('sBorrarPregunta', idBorrar, function (error, result) {
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
    var materias = [];
        Materias.find({idProfesor: obtenerIdProfesor()}).forEach( function(item) { 
            materias.push(item._id);
    } );
    template.searchQuery.set( value, materias );
    template.searching.set( true );
    return '';
    },
});


Template.agregarPregunta.onCreated( () => {
  let template = Template.instance();
  template.subscribe( 'carreras');
  template.subscribe( 'materias');
  template.subscribe( 'facultades');
  subscribeTemplate("preguntas", template);
});


Template.agregarPregunta.helpers({
	materias: function () {
		return Materias.find({idProfesor: obtenerIdProfesor()});
	},
	nombreCarrera: function(idCarrera) {
    var carr = Carreras.findOne({_id: idCarrera});
    if (carr) {
      return carr.nombre;
    }
    return '';
	},
}); 

Template.agregarPregunta.rendered = function() {
  formatarSummerNote();    
};
Template.agregarPregunta.events({
  'submit form': function(event, template){
    event.preventDefault();
    // Obteniendo variables
    var varMateria = $('#materias').val();
    var varEnunciado = $('#pregunta').summernote('code');
    var varCorrecta = $('#correcta').summernote('code');
    var varIncorrecta1 = $('#incorrecta1').summernote('code');
    var varIncorrecta2 = $('#incorrecta2').summernote('code');
    var varIncorrecta3 = $('#incorrecta3').summernote('code');
    var varIncorrecta4 = $('#incorrecta4').summernote('code');
    //
    var pregunta = {
      texto: varEnunciado,
      idMateria: varMateria,
      respuestas:  [varCorrecta,varIncorrecta1, varIncorrecta2, varIncorrecta3, varIncorrecta4]
    };
    Meteor.call('sAgregarPregunta', pregunta, function (error, result) {
      if(!error){
          $('#pregunta').summernote('code', '');
          $('#correcta').summernote('code', '');
          $('#incorrecta1').summernote('code', '');
          $('#incorrecta2').summernote('code', '');
          $('#incorrecta3').summernote('code', '');
          $('#incorrecta4').summernote('code', '');
          $('#materias').focus();
      }else {
        $('#materias').focus();
        return throwError(error.message);
      }
    });
    return false;
  }
});

Template.editarPregunta.rendered = function() {
  formatarSummerNote();    
};
Template.editarPregunta.onCreated(function () {
  var variable = this.data.idMateria;
  Session.set("codigoActual", variable);
  let template = Template.instance();
  template.subscribe( 'carreras');
  template.subscribe( 'materias');
  template.subscribe( 'facultades');
  subscribeTemplate("preguntas", template);
});



Template.editarPregunta.helpers({
  respuesta: function (pos) {
    var pregunta = Preguntas.findOne({_id: this._id});
    if (pregunta) {
        return pregunta.respuestas[pos];
    }
    return ''
  },
  materias: function () {
    return Materias.find({idProfesor: obtenerIdProfesor()});
  },
  nombreCarrera: function(idCarrera) {
    var carr = Carreras.findOne({_id: idCarrera});
    if (carr) {
      return carr.nombre;
    }
    return '';
  },
}); 

Template.editarPregunta.events({
  'submit form': function(event, template){
    event.preventDefault();
    // Obteniendo variables
    var id = $('#id').val();
    var varMateria = $('#materias').val();
    var varEnunciado = $('#pregunta').summernote('code');
    var varCorrecta = $('#correcta').summernote('code');
    var varIncorrecta1 = $('#incorrecta1').summernote('code');
    var varIncorrecta2 = $('#incorrecta2').summernote('code');
    var varIncorrecta3 = $('#incorrecta3').summernote('code');
    var varIncorrecta4 = $('#incorrecta4').summernote('code');
    //
    var pregunta = {
      texto: varEnunciado,
      idMateria: varMateria,
      respuestas:  [varCorrecta,varIncorrecta1, varIncorrecta2, varIncorrecta3, varIncorrecta4]
    };
   Meteor.call('sActualizarPregunta',id, pregunta, function(error, result) {
      if(!error){
        Router.go('preguntas');
      }else {
        return throwError(error.message);
      }
    });
 },
});




  
