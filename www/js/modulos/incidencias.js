function funcionesIncidencias(){
	cargarIncidencias();
}

function cargarIncidencias(filtro){
  Util.cargando();

	var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));
	var params = { id_usuario: datos_login.usuario_id, id_customer: datos_login.id_customer, id_propietario: datos_login.id_propietario, id_comunidad: datos_login.id_comunidad };

	if(filtro){
		$.extend( params, filtro );
	}

	$('#incidencias').html('');

	$.ajax({
		url: ruta_app+'api/listaIncidencias',
		data: params,
		dataType: 'json',
		success: function(data){
			$.ajax({
				url: 'paginas/incidencias/_li_incidencia.html',
				dataType: 'html',
				success: function(li){	
				  $.ajax({
						url: 'paginas/incidencias/_li_respuesta.html',
						dataType: 'html',
						success: function(lir){
						  $.each(data.incidencias, function(i, inc){
								var nResp  = data.respuestas.hasOwnProperty(inc.id_incidencia) ? data.respuestas[inc.id_incidencia].length : 0;
						    var li_inc = li.replace('__TITULO__', '#' + Util.pad(inc.id_incidencia, 5) + ' | ' + inc.titulo)
						      .replace('__TITULO2__', inc.titulo)
						    	.replace('__DESCRIPCION__', inc.descripcion)
						    	.replace('__ESTADO__', inc.estado)
						    	.replace('__NUMRESPUESTAS__', nResp)
						    	.replace(/\__ID__/g, inc.id_incidencia)
						    	.replace('__FECHA__', Util.formato_fecha(inc.created_at));

					    	var li_resp = '';
					    	if(nResp){
					    		$.each(data.respuestas[inc.id_incidencia], function(ir, resp){
						    		li_resp += lir.replace('__RESPUESTA__', resp.respuesta)
						    			.replace('__FECHA__', Util.formato_fecha(resp.updated_at, true))
						    			.replace('__USUARIO__', resp.usuario);
						    	});
					    	}
					    	li_inc = li_inc.replace('__RESPUESTAS__', li_resp);

						    $('#incidencias').append(li_inc);
						    $('#incidencias').collapsibleset("refresh");
						    $('#respuestas_' + inc.id_incidencia).listview().listview("refresh");
							});

							Util.cargado();	
						}
					});	
				}
			});
		},
		error: function(jqXHR, textStatus, errorThrown){
			Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
		}
	});
}

function filtrarIncidencias(){
	var filtro = { 
		final: Util.formato_fecha_bbdd($('#filtro_final').val()), 
		tipo: $('#filtro_pp').val() 
	};

  cargarIncidencias(filtro);
  $("#menu_secundario").panel("close");
}

function nuevaIncidencia(){
	Util.cargando();

	var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));

	app.cargarContenido('paginas/incidencias/nueva.html', function(){
    $('#incidencia_id_comunidad').val(datos_login.id_comunidad);
    $('#incidencia_id_customer').val(datos_login.id_customer);
    $('#incidencia_id_usuario').val(datos_login.usuario_id);

    $('#form_nueva_incidencia').attr('action', ruta_app+'api/altaIncidencia');

		$('#form_nueva_incidencia').ajaxForm({
			dataType: 'json',
			beforeSubmit: function(){
				Util.cargando();
			},
			success: function(data){
				Util.cargado();
				Util.logDump(data, 'incidencia');

				if(data.status === 'KO'){
					Util.alertError(data.errors.join("\n"));
				}else{
					Util.alertInfo('Se ha dado de alta la incidencia');
					app.incidencias();
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				//alert(jqXHR.responseText);
				Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
			}
		});

    Util.cargado();
  });
}

function responderIncidencia(id){
	Util.cargando();

	var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));

	app.cargarContenido('paginas/incidencias/responder.html', function(){
    $('#incidencia_id').val(id);
    $('#incidencia_id_customer').val(datos_login.id_customer);
    $('#incidencia_id_usuario').val(datos_login.usuario_id);

    $('#form_respuesta_incidencia').attr('action', ruta_app+'api/respuestaIncidencia');

		$('#form_respuesta_incidencia').ajaxForm({
			dataType: 'json',
			beforeSubmit: function(){
				Util.cargando();
			},
			success: function(data){
				Util.cargado();
				Util.logDump(data, 'respuesta');

				if(data.status === 'KO'){
					Util.alertError(data.errors.join("\n"));
				}else{	
				  Util.alertInfo('Se ha respondido a la incidencia');
					app.incidencias();
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				alert(jqXHR.responseText);
				Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
			}
		});

    Util.cargado();
  });
}

function mostrarOcultarRespuestasIncidencia(e){
  var ul = $(e).closest('ul');

  $('.li_respuesta', ul).toggleClass('hide');
}