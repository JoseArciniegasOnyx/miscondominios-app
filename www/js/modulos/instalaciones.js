function funcionesInstalaciones(){
	cargarInstalaciones();
}

function cargarInstalaciones(){
	Util.cargando();

	var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));
	var params = { id_usuario: datos_login.usuario_id, id_customer: datos_login.id_customer, id_propietario: datos_login.id_propietario, id_comunidad: datos_login.id_comunidad };

	$('#instalaciones').html('');

	$.ajax({
		url: ruta_app+'api/listaInstalaciones',
		data: params,
		dataType: 'json',
		success: function(data){
			$.ajax({
				url: 'paginas/instalaciones/_li_inst.html',
				dataType: 'html',
				success: function(li){
					$.each(data.instalaciones, function(i, inst){
						var li_inst = li.replace('__IMAGEN__', ruta_web + 'uploads/img/' + inst.imagen)
							.replace('__NOMBRE__', inst.nombre)
							.replace('__DESC__', inst.descripcion)
							.replace('__COSTE__', Util.mostrarSaldo(inst.coste))
							.replace(/\__ID__/g, inst.id)
							.replace('__DATA__', JSON.stringify(inst));

						if(inst.activo === '1' && (inst.impedir_morosos === '0' || !data.moroso)){
							li_inst = li_inst.replace('__RESERVAR__', 1)
								.replace('__MOROSO__', '');
						}else if(inst.activo === '1' && inst.impedir_morosos === '1'){
							li_inst = li_inst.replace('__RESERVAR__', 0)
								.replace('__MOROSO__', '<p>**** Los morosos no pueden reservar esta instalación ****</p>');
						}else{
							li_inst = li_inst.replace('__RESERVAR__', 0)
								.replace('__MOROSO__', '<p>**** No se puede reservar la instalación, está fuera de servicio ****</p>');
						}

						$('#instalaciones').append(li_inst);
					  $('#instalaciones').listview( "refresh" );
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

function reservarInstalacion(id, reservar){
	if(reservar === 1){
		Util.cargando();

		var inst = JSON.parse($('#instalacion_' + id).val());
		var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));

		app.cargarContenido('paginas/instalaciones/reserva.html', function(){
			$('.tituloCabecera').html($('.tituloCabecera').html() + inst.nombre);

      $('#reserva_id').val(id);
      $('#reserva_id_comunidad').val(datos_login.id_comunidad);
      $('#reserva_id_customer').val(datos_login.id_customer);

      $.each(datos_login.propiedades, function(id_pp, pp){
      	$('#reserva_solicitante').append('<option value="' + id_pp + '">' + pp + '</option>');
      });
      $('#reserva_solicitante').selectmenu( "refresh" );
      $("#reserva_solicitante").closest("div").addClass("ui-alt-icon");
      $("#reserva_reglamento").closest("div").addClass("ui-alt-icon");

      if(inst.reglamento){
	      $("#verReglamento").on('click', function(){
	      	Util.alertInfo(inst.reglamento);
	      });
	    }else{
	    	$('#li_reglamento').remove();
	    }

      $('#form_reserva_instalacion').attr('action', ruta_app+'api/reservarInstalacion');

			$('#form_reserva_instalacion').ajaxForm({
				dataType: 'json',
				beforeSubmit: function(){
					Util.cargando();
				},
				success: function(data){
					Util.cargado();
					Util.logDump(data, 'reserva');

					if(data.status === 'KO'){
						Util.alertError(data.errors.join("\n"));
					}else{
						Util.alertInfo('Se ha realizado la reserva, pero no será definitiva hasta que el administrador la confirme.');
						cargarMenu();
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
}