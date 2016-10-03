import { Meteor } from 'meteor/meteor'


SSR.compileTemplate('htmlEmail', Assets.getText('bienvenidos.html'));

Meteor.methods({
    'sEnviarCorreo1': function(html, profesor){
        Email.send({
              to: profesor.correo,
              from: "UNICAN - Universidad Nacional de Canindeyú",
              subject: "Bienvenidos a Web CPI",
              html: html,
          });
     },
    'sEnviarCorreo': function(profesor){
      console.log("Enviando correo a: "+ profesor.correo);
    	var emailData = {
				  nombres: profesor.nombres,
  				  correo: profesor.correo,
  				  clave: profesor.clave,
  				  logo: Meteor.absoluteUrl() + "img/logo.png",
  				  link: Meteor.absoluteUrl() + 'login',
		};
      // Con esto se desactiva seguridades para poder enviar correo desde METEOR - MODULUS
       //https://www.google.com/settings/security/lesssecureapps
       //https://accounts.google.com/b/0/DisplayUnlockCaptcha
        Email.send({
              to: profesor.correo,
              from: "UNICAN - Universidad Nacional de Canindeyú",
              subject: "Bienvenidos a Web CPI",
              html: SSR.render('htmlEmail', emailData),
          });
     },


 });


