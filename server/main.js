export const APP_NAME = 'Examen v1.0';

Meteor.startup(() => {
	// Configuración del Cliente de Correo
	  smtp = {
    	username: '',   
    	password: '',   
	    server:   'smtp.gmail.com',  
    	port: 465
  	}
    //"smtp://kodespy@gmail.com:car79los@smtp.gmail.com:465"

	  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + 
  		':' + encodeURIComponent(smtp.password) + '@' + 
  		encodeURIComponent(smtp.server) + ':' + smtp.port;
  		
  	// Configurando database MONGO 
  	//var database = "mongodb://127.0.0.1:27017/cpidb";	
    //var database = "mongodb://unican:unican2016@olympia.modulusmongo.net:27017/hugydA3x"
  	//process.env.MONGO_URL = database;
    //process.env.ROOT_URL = "http://webcpi-81774.onmodulus.net";
  	//

  	//
    console.log("----------------------------------------------------");
    console.log("Universidad Nacional de Canindeyú - UNICAN");
    console.log("Facultad de Ciencias y Tecnológia");
    console.log("");
    console.log("");
    console.log("Trabajo Final de Grado");
    console.log("");
    console.log("");
    console.log("WEBCPI - Sistema para generar itenes del ");
    console.log("         Curso Probatorio de Ingreso");
    console.log("");
    console.log("");
    console.log("Desarrollado por: Carlos Martínez & Victor Velázquez");
    console.log("                       @2016 ");
    console.log("-------------------------------------------------------");
    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log("Iniciar servidor.... OK");
    console.log("");
    console.log("");
    if (Meteor.users.find().count() === 0) {
 		   console.log("Creando usuario Administador... OK");
       var userId  = Accounts.createUser({
        email: 'webcpi@gmail.com',
        username: 'Administrador',
        password: 'incorrecto' 
      });
      var user = Meteor.users.findOne({_id: userId});
      if (user) {
            console.log('Actualizando rol del usuario.... OK');
            Roles.addUsersToRoles(user._id, ['admin']);
      };
	  }
    else {
      "Usuario administrador activado.... SI";
    };
});