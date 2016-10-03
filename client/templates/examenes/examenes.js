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
Template.listaExamenes.onCreated( () => {
  let template = Template.instance();
  subscribeTemplate("preguntas", template);
});



Template.listaExamenes.events({
  'click .generar': function(event,template){
     $('#valores').html("");
     var subrayado = $('#subrayado').val();
     var preguntas = [];
     var cantidad = 0;
     var preg = Preguntas.find().forEach( function(collection) {
      preguntas.push(collection._id);
     } );
     var random = _.sample(Preguntas.find().fetch());
     var resultado = {};
     var respuestas= [];
     var alfabeto =['a','b','c','d','e'];
      while (cantidad < 10) {
        var rand = Math.floor(Math.random() * preguntas.length);
        var valor = preguntas[rand];
        resultado = Preguntas.findOne({_id: valor});
        if (resultado) {
          preguntas.splice(rand, 1);
          $('#valores').append("<hr>");
          $('#valores').append("<label class='titulo'>" +resultado.texto.trim() +"</label></br>");
          var cantidad1= 0;
          respuestas= [0,1,2,3,4];
          while (cantidad1 < 5) {
            var rand1 = Math.floor(Math.random() * respuestas.length);
            var valor1 = respuestas[rand1];
            var texto = alfabeto[cantidad1] +")   " +replace_html(resultado.respuestas[valor1])
            var verdadero = 0;
            if (valor1 == 0){
              verdadero = 1;
              if ($('#subrayado').prop('checked')) {
                var html = "<label class='correcta' >"+ texto.trim() +"</label></br>";
              } else {
                var html = "<label class='falsa' >"+ texto.trim() +"</label></br>";  
              }

            }else {
              var html = "<label class='falsa' >"+ texto.trim() +"</label></br>";
            }
            //var html = "<label><input type='text' name='respuestas[]' value='"+verdadero +"'/> "+resultado.respuestas[valor1].trim()+"</label></br>";
            $('#valores').append(html);
            respuestas.splice(rand1,1);
            cantidad1 +=1;
          };
        };
        cantidad += 1;
      };
    return '';
  },
});


Template.examen.helpers({ 
  preguntas: function() {
     var preguntas = [];
     var cantidad = 0;
     var preg = Preguntas.find().forEach( function(collection) {
        preguntas.push(collection._id);
      } );
     
     var random = _.sample(Preguntas.find().fetch());
     var resultado = {};
     var respuestas= [];
     var alfabeto =['a','b','c','d','e'];

      while (cantidad < 10) {
        var rand = Math.floor(Math.random() * preguntas.length);
        var valor = preguntas[rand];
        resultado = Preguntas.findOne({_id: valor});
        if (resultado) {

          preguntas.splice(rand, 1);
          $('#valores').append("<label class='titulo'>" +resultado.texto.trim() +"</label></br>");
          var cantidad1= 0;
          respuestas= [0,1,2,3,4];

          while (cantidad1 < 5) {
            var rand1 = Math.floor(Math.random() * respuestas.length);
            var valor1 = respuestas[rand1];
            var texto = alfabeto[cantidad1] +")   " +replace_html(resultado.respuestas[valor1])
            var verdadero = 0;
            if (valor1 == 0){
              verdadero = 1;
              var html = "<label class='correcta' >"+ texto.trim() +"</label></br>";
            }else {
              var html = "<label class='falsa' >"+ texto.trim() +"</label></br>";
            }
            
            
            
            
            //var html = "<label><input type='text' name='respuestas[]' value='"+verdadero +"'/> "+resultado.respuestas[valor1].trim()+"</label></br>";
            $('#valores').append(html);
            
            respuestas.splice(rand1,1);
            cantidad1=cantidad1+1;
          };
        };
        cantidad = cantidad+1;
      };
    return '';
  },

});

function replace_html(texto) {
  var nuevo = texto.replace("<p>", "");
  return nuevo.replace("</p>", "");
}