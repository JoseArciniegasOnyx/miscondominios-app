/**        FUNCIONES MENSAJES       **/

/**
 * @param entrada (int) 0/1.
 */
function funcionesMensajes(entrada){
	cargarMensajes(entrada);
}

function cargarMensajes(entrada){
	Util.cargando();
	var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));

	if(entrada) $('.tituloCabecera').html('Buzón de entrada');
	else $('.tituloCabecera').html('Buzón de salida');

	$('#swipeMe').html('');

	$.ajax({
		url: ruta_app+'api/mensajes',
		data: {id_usuario: datos_login.usuario_id, id_customer: datos_login.id_customer, entrada: entrada, id_comunidad: datos_login.id_comunidad },
		dataType: 'json',
		success: function(data){
			$.ajax({
				url: 'paginas/mensajes/_li_msg.html',
				dataType: 'html',
				success: function(li){
					$.each(data.mensajes, function(i, m){
						var li_msg = li.replace('__ASUNTO__', (m.asunto ? m.asunto : ''))
						.replace('__SINLEER__',(entrada && m.leido != 1) ? 'b' : '')
						.replace('__ICONALT__', (!entrada || m.leido == 1) ? 'ui-alt-icon' : '')
						.replace('__FECHA__',Util.formato_fecha(m.created_at, true))
						.replace('__DATACOMUN__',m.comun)
						.replace('__DATAENTRADA__',entrada);

						if(entrada){
							var usuario = data.usuarios[m.id_usuario];
							li_msg = li_msg.replace('__USUARIO__',(usuario ? usuario : ''));
						}else{
							var usu = '';
							var usuarios = m.receptores.split(',');
							$.each(usuarios, function(n, u){
								usuario =  data.usuarios[u];
								if(usuario) usu += usuario+'; ';
							});
							li_msg = li_msg.replace('__USUARIO__',usu);
						}

						$('#swipeMe').append(li_msg);
						$('#swipeMe').listview( "refresh" );
					});
					Util.cargado();
				}
			});
		},
		error: function(jqXHR, textStatus, errorThrown){
			Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
		}
	});
}

function verMensaje(obj){    
	app.cargarContenido('paginas/mensajes/mensaje.html', function(){
		rellenarMensaje($(obj));
	});
}

function nuevoMensaje(obj){
	app.cargarContenido('paginas/mensajes/nuevo.html', function(){
		formularioMensaje($(obj));
	});
}

function formularioMensaje($obj){
	var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));
	var param = {
			id_usuario: datos_login.usuario_id, 
			id_customer: datos_login.id_customer,
			id_comunidad: datos_login.id_comunidad
	};
	if($obj.attr('data-id')){
		$.extend( param, { resp: $obj.attr('data-id') } );
	}

	Util.cargando();
	$.ajax({
		url: ruta_app+'api/crearMensaje',
		data: param,
		dataType: 'html',
		success: function(data){
			$('#content_nuevo_msg').html(data);
			$("#mensaje_id_receptor").closest("div").addClass("ui-alt-icon");
			$('#form_nuevo_mensaje').attr('action',ruta_app+'api/crearMensaje');

			$('#form_nuevo_mensaje').ajaxForm({
				beforeSubmit: function(){
					Util.cargando();
				},
				success: function(data){
					Util.cargado();
					if($.trim(data) == 'OK'){
						app.mensajes(1);
					}else{
						$('#content_nuevo_msg').html(data);
						$('#pagina_principal').page("destroy").page();
					}
				},
				error: function(jqXHR, textStatus, errorThrown){
					Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
				}
			});


			$('#pagina_principal').page("destroy").page();
			Util.cargado();
		},
		error: function(jqXHR, textStatus, errorThrown){
			Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
		}
	})
}

function eliminarMensaje(obj){
	var id = $(obj).attr('data-id');
	var entrada = Number($(obj).attr('data-entrada'));

	Util.alertConfirm(txt_eliminar_gral, function(buttonIndex){
		fn_eliminar_mensaje(buttonIndex, entrada, id);
	});
}

function fn_eliminar_mensaje(buttonIndex, entrada, id){
	if(buttonIndex == 1){
		Util.cargando();
		$.ajax({
			url: ruta_app+'api/eliminarMensaje',
			data: { id: id },
			dataType: 'html',
			success: function(){
				Util.cargado();
				app.mensajes(entrada);
			},
			error: function(jqXHR, textStatus, errorThrown){
				Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
			}
		});
	}   
}

function rellenarMensaje($obj){
	Util.cargando();
	var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));
	var id = $obj.attr('data-comun');
	var entrada = $obj.attr('data-entrada');

	$.ajax({
		url: ruta_app+'api/leerMensaje',
		data: {id_usuario: datos_login.usuario_id, id_customer: datos_login.id_customer, entrada: entrada, id: id, id_comunidad: datos_login.id_comunidad },
		dataType: 'json',
		success: function(data){
			if(entrada == '1'){
				$('#msg_responder').attr('data-id',data.mensaje.comun).removeClass('hide');
			}else{
				$('#msg_responder').hide();
			}
			$('#msg_eliminar').attr('data-id',data.mensaje.id).attr('data-entrada',entrada);
			$('#msg_asunto').html(data.mensaje.asunto);
			$('#msg_fecha').html(Util.formato_fecha(data.mensaje.created_at, true));
			$('#msg_texto').html(Util.nl2br(data.mensaje.texto));
			$('#msg_usu span:eq(0)').html((entrada == '1' ? 'De:' : 'Para:'));

			if(entrada == '1'){
				var usuario = data.usuarios[data.mensaje.id_usuario];
				$('#msg_usu span:eq(1)').html((usuario ? usuario : ''));
			}else{
				var usu = '';
				var usuarios = data.mensaje.receptores.split(',');
				$.each(usuarios, function(n, u){
					usuario =  data.usuarios[u];
					if(usuario) usu += usuario+'; ';
				});
				$('#msg_usu span:eq(1)').html(usu);
			}
			Util.cargado();           
		},
		error: function(jqXHR, textStatus, errorThrown){
			Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
		}
	});
}
/**        FIN FUNCIONES MENSAJES       **/