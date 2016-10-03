
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: "notEncontrado"
});
 
Router.route('/', function () {
  if (!Meteor.user()) {
    this.render('login');
    this.layout('/singlePage');
  } else {
    this.render('home');
    this.layout('/layout');
  }  
  
});
/*
Router.route('/home', function () {
  if (!Meteor.user()) {
    this.render('/');
    this.layout('/layout');
  }  
 
});
*/
Router.route('/login', function () {
  this.render('login');
  this.layout('singlePage');
});
Router.route('/register', function () {
  this.render('register');
  this.layout('layout');
});
//
Router.route('/facultades', function () {
  this.render('listaFacultades');
  this.layout('layout');
});

Router.route('/facultad/agregar', {name: 'agregarFacultad'});

Router.route('/facultad/:_id/edit', {
  name: 'editarFacultad',
  data: function() { 
    var facultad = Facultades.findOne(this.params._id);
    return facultad;
  }
});
//
Router.route('/carreras', function () {
  this.render('listaCarreras');
  this.layout('layout');
});
Router.route('/carrera/agregar', {name: 'agregarCarrera'});
Router.route('/carrera/:_id/edit', {
  name: 'editarCarrera',
  data: function() { 
    var carrera = Carreras.findOne(this.params._id);
    return carrera;
  }
});


//
Router.route('/profesores', function () {
  this.render('listaProfesores');
  this.layout('layout');
});
Router.route('/profesor/agregar', {name: 'agregarProfesor'});
Router.route('/profesor/:_id/edit', {
  name: 'editarProfesor',
  data: function() { 
    var profesor = Profesores.findOne(this.params._id);
    return profesor;
  }
});



//
Router.route('/materias', function () {
  this.render('listaMaterias');
  this.layout('layout');
});
Router.route('/materia/agregar', {name: 'agregarMateria'});
Router.route('/materia/:_id/edit', {
  name: 'editarMateria',
  data: function() { 
    var materia = Materias.findOne(this.params._id);
    return materia;
  }
});
//
Router.route('/preguntas', function () {
  this.render('listaPreguntas');
  this.layout('layout');
});
Router.route('/pregunta/agregar', {name: 'agregarPregunta'});
Router.route('/pregunta/:_id/edit', {
  name: 'editarPregunta',
  data: function() { 
    var pregunta = Preguntas.findOne(this.params._id);
    return pregunta;
  }
});
//
Router.route('/examenes', function () {
  this.render('listaExamenes');
  this.layout('layout');
});
//

var requireLogin = function(page) {
  console.log(page);
  var accesoProfesor = "pregexamhome";
  var url = page.url.substr(1, 4);
  if (!Meteor.user()) {
      this.layout('singlePage');
      this.render('accesoDenegado');
  } else {
    // ver por rolesss;    
      var user = Meteor.user();
      if(user){
        if (Roles.userIsInRole(user._id, ['admin'])){
           this.next();
        }
        else {
          if (accesoProfesor.indexOf(url) !== -1){
              this.next();
          }else {
            this.layout('singlePage');
            this.render('accesoProhibido');
          }
        }
      }
  };

}

Router.onBeforeAction(requireLogin, {only: '/'}, {admin: 'false'});

Router.onBeforeAction(requireLogin, {only: 'home'});
Router.onBeforeAction(requireLogin, {only: 'register'});
// Facultades
Router.onBeforeAction(requireLogin, {only: 'facultades'});
Router.onBeforeAction(requireLogin, {only: 'agregarFacultad'});
Router.onBeforeAction(requireLogin, {only: 'editarFacultad'});
// Carreras
Router.onBeforeAction(requireLogin, {only: 'carreras'});
Router.onBeforeAction(requireLogin, {only: 'agregarCarrera'});
Router.onBeforeAction(requireLogin, {only: 'editarCarrera'});

// Profesores
Router.onBeforeAction(requireLogin, {only: 'profesores'});
Router.onBeforeAction(requireLogin, {only: 'agregarProfesor'});
Router.onBeforeAction(requireLogin, {only: 'editarProfesor'});
// Materias
Router.onBeforeAction(requireLogin, {only: 'materias'});
Router.onBeforeAction(requireLogin, {only: 'agregarMateria'});
Router.onBeforeAction(requireLogin, {only: 'editarMateria'});
// Preguntas
Router.onBeforeAction(requireLogin, {only: 'preguntas'}, {admin: false});
Router.onBeforeAction(requireLogin, {only: 'agregarPregunta'});
Router.onBeforeAction(requireLogin, {only: 'editarPregunta'});
// Examenes
Router.onBeforeAction(requireLogin, {only: 'examenes'}, {admin: false});
