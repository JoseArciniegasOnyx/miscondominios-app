function funcionesDocumentos(carpeta){
	cargarDocumentos(carpeta);
}

function cargarDocumentos(carpeta){
	Util.cargando();

	var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));
	var params = { 
		id_usuario: datos_login.usuario_id, 
		id_customer: datos_login.id_customer, 
		id_propietario: datos_login.id_propietario, 
		id_comunidad: datos_login.id_comunidad, 
		carpeta: carpeta 
	};

	$('#documentos').html('');

  if(carpeta){
	  $('.tituloCabecera').append(' - ' + carpeta);
	  $('#backDocs').removeClass('hide');
	}

	$.ajax({
		url: ruta_app+'api/listaDocumentos',
		data: params,
		dataType: 'json',
		success: function(data){
			$.ajax({
				url: 'paginas/documentos/_li_doc.html',
				dataType: 'html',
				success: function(li){
					$.each(data.carpetas, function(i, dir){
						var li_doc = li.replace('__HREF__', 'javascript:app.documentos(\'' + dir + '\');')
						  .replace('__IMAGEN__', 'css/images/icon_folder.png')
						  .replace('__ICON__', 'class="ui-alt-icon"')
							.replace('__NOMBRE__', dir)
							.replace('__DESC__', '')
							.replace('__FECHA__', '');

						$('#documentos').append(li_doc);
					});

					$.each(data.documentos, function(i, doc){
						var li_doc = li.replace('__HREF__', 'javascript:abrirDocumento(\'' + ruta_web + data.path + doc.nombre + '\');')
							.replace('__IMAGEN__', 'img/file_icons/' + doc.icon + '.gif')
						  .replace('__ICON_', 'data-icon="false"')
							.replace('__NOMBRE__', doc.nombre_real)
							.replace('__DESC__', '<p>' + doc.descripcion + '</p>')
							.replace('__FECHA__', '<p>' + Util.formato_fecha(doc.updated_at , true) + '</p>');

						$('#documentos').append(li_doc);
					});

					$('#documentos').listview( "refresh" );
					Util.cargado();
				}
			});
		},
		error: function(jqXHR, textStatus, errorThrown){
			Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
		}
	});
}