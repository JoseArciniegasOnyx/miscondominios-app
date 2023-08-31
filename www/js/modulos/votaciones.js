function funcionesVotaciones(){
	cargarVotaciones();
}

function cargarVotaciones(){
  Util.cargando();

	var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));
	var params = { id_usuario: datos_login.usuario_id, id_customer: datos_login.id_customer, id_propietario: datos_login.id_propietario, id_comunidad: datos_login.id_comunidad };

	$('#votaciones').html('');

	$.ajax({
		url: ruta_app+'api/listaVotaciones',
		data: params,
		dataType: 'json',
		success: function(data){
			$.ajax({
				url: 'paginas/votaciones/_li_votacion.html',
				dataType: 'html',
				success: function(li){	
				  $.each(data, function(i, od){
				    var li_vot = li.replace('__TITULO__', od.ordendia.titulo + '<br/><span style="font-weight: normal;">(' + od.junta.titulo + ' - ' + Util.formato_fecha(od.junta.fecha) + ')</span>')
				    	.replace('__DESCRIPCION__', od.ordendia.descripcion ? '<p>' + od.ordendia.descripcion + '</p>' : '')
				    	.replace('__PERIODO__', od.ordendia.fin_votacion ? '<p>Fecha limite: ' + Util.formato_fecha(od.ordendia.fin_votacion) + '</p>' : '')
				    	.replace('__ID__', od.ordendia.id);

				    $('#votaciones').append(li_vot);

				    $.each(od.opciones, function(j, opt){
				    	var id = 'voto_' + od.ordendia.id + '_' + opt.id;
				    	var label = '<label for="' + id + '">' + opt.texto + '</label>';
				    	var input = '<input id="' + id + '" name="voto" value="' + opt.id + '" type="radio" data-theme="a">';

				    	$('#form_' + od.ordendia.id + ' fieldset').append(input + label);
				    });

						var hiddens = '<input type="hidden" name="id_junta" value="' + od.junta.id + '"/><input type="hidden" name="id_ordendia" value="' + od.ordendia.id + '"/><input type="hidden" name="id_convocado" value="' + od.convocado.id + '"/>';

				    $('#form_' + od.ordendia.id).append(hiddens);
				    formularioVotacion($('#form_' + od.ordendia.id));

				    $('#votaciones').collapsibleset("refresh");
					});

				  $('#votaciones form').trigger( "create" );
					Util.cargado();	
				}
			});
		},
		error: function(jqXHR, textStatus, errorThrown){
			Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
		}
	});
}

function formularioVotacion(form){
	var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));

	form.attr('action', ruta_app + 'api/efectuarVotacion?id_customer=' + datos_login.id_customer + '&id_comunidad=' + datos_login.id_comunidad);

	form.ajaxForm({
		beforeSubmit: function(){
			var voto = $('input[type=radio]', form).filter(':checked');

			if(voto.length){
				Util.cargando();
			}else{
				Util.alertInfo('Debe seleccionar una opción.');
				return false;
			}			
		},
		success: function(data){
			Util.cargado();
	
			Util.alertInfo('Se ha efectuado la votación');
			app.votaciones();
		},
		error: function(jqXHR, textStatus, errorThrown){
			Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
		}
	});
}