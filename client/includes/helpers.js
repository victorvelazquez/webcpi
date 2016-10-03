Template.busqueda.onCreated( () => {
	 let template = Template.instance()
	 Session.set("path", template.data.btnAgregar)
	 Session.set("admin", template.data.admin)

});

Template.busqueda.helpers({
	ruta: function() {
		return Session.get("path");
	}, 
	esAdmin: function() {
		var ad = Session.get("admin");
		if (ad) {
			return true;
		}
		return false;
	}, 
});