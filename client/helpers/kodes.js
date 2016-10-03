
Template.registerHelper('generarClave', function() {
	var letters = ['a','b','c','d','e','f','g','h','i','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    var numbers = [0,1,2,3,4,5,6,7,8,9];
    var randomstring = '';
    for(var i=0;i<5;i++){
        var rlet = Math.floor(Math.random()*letters.length);
        randomstring += letters[rlet];
    }
    for(var i=0;i<3;i++){
        var rnum = Math.floor(Math.random()*numbers.length);
        randomstring += numbers[rnum];
    }
   return randomstring;
});



Template.registerHelper('formatoNumerico', function(value) {
    return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
});

Template.registerHelper("seleccionarItem",function(valor){
  valor1 = Session.get("codigoActual")
  return valor==valor1?"selected":"";
});

Template.registerHelper("seleccionarItem2",function(valor){
  valor1 = Session.get("codigoActual1")
  return valor==valor1?"selected":"";
});

Template.registerHelper("estadoBotonBorrar",function(){
  return Session.get("botonBorrar");
});






