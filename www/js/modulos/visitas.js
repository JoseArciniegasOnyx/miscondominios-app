var propietarios = '';
function funcionesVisitas(){
	var now = new Date();
	var day = ("0" + now.getDate()).slice(-2);
	var month = ("0" + (now.getMonth() + 1)).slice(-2);
	var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
	$('#desde').val(today);
	$('#hasta').val(today);
	cargarVisitas();
	$('#desde').change(function(){
		cargarVisitas();
	});
	$('#hasta').change(function(){
		cargarVisitas();
	});
}

function cargarVisitas(){
	Util.cargando();

	var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));
	var params = { 
		id_usuario: datos_login.usuario_id, 
		id_customer: datos_login.id_customer, 
		id_propietario: datos_login.id_propietario, 
		id_comunidad: datos_login.id_comunidad,
		desde: $('#desde').val(),
		hasta: $('#hasta').val()
	};
	$('#visitas').html('');

	if(datos_login.hasOwnProperty('portero')){
      $('#btnPersonas').addClass('hide');
      $('#contFechas').addClass('hide');
      $('#btnVolver').addClass('hide');
      params['id_portero'] = datos_login.portero;
    }else{
      $('#btnCerrar').addClass('hide');    	
    }

	  //$('.tituloCabecera').append(' - ' + carpeta);
	  $('#backVis').removeClass('hide');
	$.ajax({
		url: ruta_app+'api/listaVisitas',
		data: params,
		dataType: 'json',
	    beforeSend: function(j, s){
	      //alert(s.url);
	    },
		success: function(data){
			//alert(JSON.stringify(data));
			$.ajax({
				url: 'paginas/visitas/_li_vis.html',
				dataType: 'html',
				success: function(li){
					$.each(data.visitas, function(i, v){
						var li_vis = li.replace('__HREF__', 'javascript:detalleVisita(\'' + v.id + '\');')
							.replace('__NOMBRE__', v.nombre)
							.replace('__PROP__', v.propietario)
							.replace('__FECHAINI__', v.fechaIni)
							.replace('__FECHAFIN__', 'Fin: '+(v.fechaFin ? v.fechaFin : ''))
							.replace('__COLOR__', (v.fechaFin ? '#bbee99' : '#fce8aa'))
							.replace('__SALIDA__', (v.fechaFin ? '' : '<input type="button" style="float: right;" value="Salida" onclick="javascript:marcarSalida('+v.id+');" />'));

						$('#visitas').append(li_vis);
					});
					propietarios = JSON.stringify(data.propietarios);
					$('#visitas').listview( "refresh" );
					Util.cargado();
				}
			});
		},
		error: function(jqXHR, textStatus, errorThrown){
			Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
		}
	});
}

function marcarSalida(id){
	if(confirm('¿Desea marcar la salida?')){
		Util.cargando();
		$.ajax({
			url: ruta_app+'api/marcarSalidaVisita',
			data: {id: id},
			type: 'post',
			success: function(data){
	          if($.trim(data) == 'OK'){
	            app.visitas();
	          }else{
	            alert('Ha habido un error, contacto con el administrador');
	            Util.cargado();
	          }
	        }
		});
	}
}

function nuevaVisita(){
	Util.cargando();

	var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));

	app.cargarContenido('paginas/visitas/nueva.html', function(){
    $('#id_comunidad').val(datos_login.id_comunidad);
    $('#id_customer').val(datos_login.id_customer);
    $('#id_usuario').val(datos_login.usuario_id);
    var prop = JSON.parse(propietarios);
    $.each(prop, function(i, p){
    	$('#propietario').append('<option value="'+p.id+'">'+p.nombre+'</option>');
    });
    $("#propietario").selectmenu("refresh");

    $('#form_nueva_visita').attr('action', ruta_app+'api/nuevaVisita');

		$('#form_nueva_visita').ajaxForm({
			dataType: 'json',
			beforeSubmit: function(){
				Util.cargando();
			},
			success: function(data){
				Util.cargado();
				Util.logDump(data, 'visita');

				if(data.status === 'KO'){
					Util.alertError(data.errors.join("\n"));
				}else{
					Util.alertInfo('Se ha dado de alta la visita');
					app.visitas();
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				//alert(jqXHR.responseText);
				Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
			}
		});

		$('#propietario').change(function(){
			$('#btnComprobar').show();
	        $('#btnAutorizar').hide();
	        $('#spAutorizacion').html('');
	        if(datos_login.hasOwnProperty('portero')){
	        	$('#btnNotificar').hide();
	        }

		});

		$('#dni').on('keyup', function () {
			$('#btnComprobar').show();
	        $('#btnAutorizar').hide();
	        $('#spAutorizacion').html('');
	        if(datos_login.hasOwnProperty('portero')){
	        	$('#btnNotificar').hide();
	        }
		});

		$('#nombre').on('keyup', function () {
			$('#btnComprobar').show();
	        $('#btnAutorizar').hide();
	        $('#spAutorizacion').html('');
	        if(datos_login.hasOwnProperty('portero')){
	        	$('#btnNotificar').hide();
	        }
		});

	    $('#btnComprobar').click(function(){
	      Util.cargando();
	      var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));
	      if($('#dni').val() == '' || $('#nombre').val() == ''){
	        $('#spAutorizacion').css('color', '#E82222');
	        $('#spAutorizacion').html('Introduzca nombre, apellidos y dni');
	        Util.cargado();
	        return false;
	      }
	      $.ajax({
	        url: ruta_app+'api/comprobarVisitante',
	        data: {dni: $('#dni').val(), propietario: $('#propietario').val(), comunidad: $('#id_comunidad').val()},
	        type: 'post',
	        dataType: 'json',
	        success: function(data){
	          if(data.estado == 1){
	            $('#spAutorizacion').css('color', '#18992A');
	            $('#spAutorizacion').html(data.msg);
	            $('#id_visitante').val(data.id);
	            $('#btnComprobar').hide();
	            $('#btnGuardar').prop("disabled", false);
	          }else if(data.estado == 0){
	            $('#spAutorizacion').css('color', '#E82222');
	            $('#spAutorizacion').html(data.msg);
	          }else if(data.estado == 2){
	            $('#spAutorizacion').css('color', '#E82222');
	            $('#spAutorizacion').html(data.msg);
	            $('#btnComprobar').hide();
	            $('#btnAutorizar').show();
	            if(datos_login.hasOwnProperty('portero')){
	        		$('#btnNotificar').show();
	        	}
	          }
	          Util.cargado();
	        }
	      });
	    });

	    $('#btnNotificar').click(function(){
	      var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));
	      Util.cargando();
	      $.ajax({
	        url: ruta_app+'api/notificar',
	        data: {dni: $('#dni').val(), nombre: $('#nombre').val(), comunidad: $('#id_comunidad').val(), propietario: $('#propietario').val(), customer: $('#id_customer').val(), usuario: datos_login.usuario_id},
	        type: 'post',
	        dataType: 'json',
	        success: function(data){
	          $('#spAutorizacion').css('color', data.color);
	          $('#spAutorizacion').html(data.msg);
	          $('#id_visitante').val(data.id);
	          $('#btnAutorizar').hide();
       		  $('#btnNotificar').hide();
       		  $('#btnComprobar').show();
	          Util.cargado();
	        }
	      });
	    });

	    $('#btnAutorizar').click(function(){
	      var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));
	      Util.alertConfirm('¿Ha contactado con el propietario?', function(buttonIndex){
		      	if(buttonIndex == 1){
				      Util.cargando();
				      $.ajax({
				        url: ruta_app+'api/autorizarVisitante',
				        data: {dni: $('#dni').val(), nombre: $('#nombre').val(), comunidad: $('#id_comunidad').val(), propietario: $('#propietario').val(), customer: $('#id_customer').val()},
				        type: 'post',
				        dataType: 'json',
				        success: function(data){
				          $('#spAutorizacion').css('color', '#18992A');
				          $('#spAutorizacion').html(data.msg);
				          $('#id_visitante').val(data.id);
				          $('#btnAutorizar').hide();
				          if(datos_login.hasOwnProperty('portero')){
			        		$('#btnNotificar').hide();
			        	  }
				          $('#btnGuardar').prop("disabled", false);
				          Util.cargado();
				        }
				      });
				}
			});
	    });

	    $('#btnGuardar').click(function(){
	      Util.cargando();
	      $.ajax({
	        url: ruta_app+'api/guardarVisita',
	        data: {visitante: $('#id_visitante').val(), portero: $('#id_portero').val(), comunidad: $('#id_comunidad').val(), propietario: $('#propietario').val(), customer: $('#id_customer').val()},
	        type: 'post',
	        success: function(data){
	          if($.trim(data) == 'OK'){
	            app.visitas();
	          }else{
	            alert('Ha habido un error, contacto con el administrador');
	            Util.cargado();
	          }
	        }
	      });
	    });

    Util.cargado();
  });
}

function cargarPersonas(){
	Util.cargando();

	var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));
	var params = { 
		id_usuario: datos_login.usuario_id, 
		id_customer: datos_login.id_customer, 
		id_propietario: datos_login.id_propietario, 
		id_comunidad: datos_login.id_comunidad
	};

	$('#personas').html('');

	  //$('.tituloCabecera').append(' - ' + carpeta);
	  $('#backPers').removeClass('hide');

	$.ajax({
		url: ruta_app+'api/listaVisitantes',
		data: params,
		dataType: 'json',
	    beforeSend: function(j, s){
	      //alert(s.url);
	    },
		success: function(data){
			//alert(JSON.stringify(data));
			$.ajax({
				url: 'paginas/visitas/_li_pers.html',
				dataType: 'html',
				success: function(li){
					$.each(data.visitantes, function(i, v){
						var color = '';
						if(v.autorizado){
							color = '#bbee99';
						}else if(!v.autorizado && v.pendiente){
							color = '#fce8aa';
						}else{
							color = '#E89698';
						}
						var li_vis = li.replace('__HREF__', 'javascript:nuevoVisitante(\'' + v.id + '\');')
							.replace('__NOMBRE__', v.nombre)
							.replace('__PROP__', v.propietario)
							.replace('__COLOR__', color);
						$('#personas').append(li_vis);
					});
					propietarios = JSON.stringify(data.propietarios);
					$('#personas').listview( "refresh" );
					Util.cargado();
				}
			});
		},
		error: function(jqXHR, textStatus, errorThrown){
			Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
		}
	});
}

function nuevoVisitante(id){
	Util.cargando();

	var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));

	app.cargarContenido('paginas/visitas/nuevapers.html', function(){
    $('#id_comunidad').val(datos_login.id_comunidad);
    $('#id_customer').val(datos_login.id_customer);
    $('#id_usuario').val(datos_login.usuario_id);
    $('#id_visitante').val(id);

    var prop = JSON.parse(propietarios);
    $.each(prop, function(i, p){
    	$('#propietario').append('<option value="'+p.id+'">'+p.nombre+'</option>');
    });
    $("#propietario").selectmenu("refresh");

    $('#form_nuevo_visitante').attr('action', ruta_app+'api/nuevoVisitante');
    if(id == 0){
    	$('.tituloCabecera').html('Nueva Persona');
    	$('#cancelar').removeClass('hide');
    }else{
    	$('.tituloCabecera').html('Editar Persona');
    	cargarVisitante(id);
    	$('#eliminar').removeClass('hide');
    }

		$('#form_nuevo_visitante').ajaxForm({
			dataType: 'json',
			beforeSubmit: function(){
				Util.cargando();
			},
			success: function(data){
				Util.cargado();
				Util.logDump(data, 'visitante');

				if(data.status === 'KO'){
					Util.alertError(data.errors.join("\n"));
				}else{
					Util.alertInfo('Se ha dado de alta la persona');
					app.personas();
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				//alert(jqXHR.responseText);
				Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
			}
		});

	    $('#btnGuardar').click(function(){
	      Util.cargando();
	      if($('#dni').val() == '' || $('#nombre').val() == ''){
	        $('#spMsg').css('color', '#E82222');
	        $('#spMsg').html('Introduzca nombre, apellidos y dni');
	        Util.cargado();
	        return false;
	      }
	      var autorizado = 0;
	      if($('#autorizado').prop('checked')){autorizado = 1;}
	      $.ajax({
	        url: ruta_app+'api/guardarVisitante',
	        data: {id: $('#id_visitante').val(), dni: $('#dni').val(), nombre: $('#nombre').val(), autorizado: autorizado, comunidad: $('#id_comunidad').val(), propietario: $('#propietario').val(), customer: $('#id_customer').val()},
	        type: 'post',
	        success: function(data){
	          if($.trim(data) == 'OK'){
	            app.personas();
	          }else{
	            alert('Ha habido un error, contacto con el administrador');
	            Util.cargado();
	          }
	        }
	      });
	    });

    Util.cargado();
  });
}

function cargarVisitante(id){
	Util.cargando();

	$.ajax({
		url: ruta_app+'api/cargarVisitante',
		data: {id: id},
		dataType: 'json',
	    beforeSend: function(j, s){
	      //alert(s.url);
	    },
		success: function(data){
			$('#dni').val(data.dni);
			$('#nombre').val(data.nombre);
			$('#propietario').val(data.propietario);
			if(data.autorizado){
				$('#autorizado').attr("checked",true).checkboxradio("refresh");
			}
			$("#propietario").selectmenu("refresh");
		},
		error: function(jqXHR, textStatus, errorThrown){
			Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
		}
	});
}

function eliminarPers(){
	Util.alertConfirm(txt_eliminar_gral, function(buttonIndex){
		if(buttonIndex == 1){
			Util.cargando();
			var id = $('#id_visitante').val();
			$.ajax({
				url: ruta_app+'api/eliminarVisitante',
				data: {id: id},
				success: function(data){
					Util.cargado();
					app.personas();
				},
				error: function(jqXHR, textStatus, errorThrown){
					Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
				}
			});
		}
	});
}