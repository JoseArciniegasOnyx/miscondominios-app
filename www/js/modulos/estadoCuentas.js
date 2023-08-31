function funcionesEstadoCuentas(){
	cargarEstadoCuentas();
}

function cargarEstadoCuentas(filtro){
	Util.cargando();
	var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));
	var params = { id_usuario: datos_login.usuario_id, id_customer: datos_login.id_customer, id_propietario: datos_login.id_propietario, id_comunidad: datos_login.id_comunidad };

	if(filtro){
		$.extend( params, filtro );
	}

	$('#estadoCuentas').html('');

	$.ajax({
		url: ruta_app+'api/estadoCuentas',
		data: params,
		dataType: 'json',
		success: function(data){
			$.ajax({
				url: 'paginas/estadoCuentas/_li_movimiento.html',
				dataType: 'html',
				success: function(li){
					if(data.hasOwnProperty('inicio')){
						$('.tituloCabecera').html('Estado de cuentas del ' + Util.formato_fecha(data.inicio) + ' al ' + Util.formato_fecha(data.final) + ' (' + data.propiedad + ')');
						$('.total_saldo_anterior').html(Util.mostrarSaldo(data.saldo_ant));
						$('.total_ingresos').html(Util.mostrarSaldo(data.movimientos.ingresos));
						$('.total_gastos').html(Util.mostrarSaldo(data.movimientos.gastos));
						$('.total_saldo_periodo').html(Util.mostrarSaldo(data.movimientos.total));
						$('.total_saldo_final').html(Util.mostrarSaldo(data.movimientos.total + data.saldo_ant));

						if(Number(data.saldo_ant) < 0){
							$('.total_saldo_anterior').addClass('menor');
						}
						if(Number(data.movimientos.total) < 0){
							$('.total_saldo_periodo').addClass('menor');
						}
						if(Number(data.movimientos.total + data.saldo_ant) < 0){
							$('.total_saldo_final').addClass('menor');
						}

						if($.trim($('#filtro_pp').html()) === ''){
							$.each(data.opciones, function(i, opt){
								$('#filtro_pp').append('<option value="' + opt.id_pp + '">' + opt.prop + '</option>');
							});
							$('#filtro_pp').selectmenu( "refresh" );
						}
						
						$('#filtro_inicio').val(data.inicio);
						$('#filtro_final').val(data.final);

						var saldo =  Number(data.saldo_ant);
						$.each(data.movimientos, function(i, m){
							if(!isNaN(i)){
								if(m.hasOwnProperty('ingreso')){
									saldo += Number(m.ingreso);
								}else{
									saldo -= Number(m.gasto);
								}

								var li_mov = li.replace('__FECHA__', Util.formato_fecha(m.fecha))
									.replace('__CONCEPTO__', m.concepto)
									.replace('__TIPO__', m.tipo)
									.replace('__IMPORTE__', Util.mostrarSaldo(m.hasOwnProperty('ingreso') ? m.ingreso : m.gasto))
									.replace('__SALDO__', Util.mostrarSaldo(saldo))
									.replace('__REFERENCIA__', (m.hasOwnProperty('referencia') ? m.referencia : ''))
									.replace('__COLORTIPO__', m.color)
									.replace('__COLORIMPORTE__', (m.hasOwnProperty('ingreso') ? 'mayor' : 'menor'))
									.replace('__COLORSALDO__', (saldo > 0 ? 'mayor' : ( saldo < 0 ? 'menor' : '')));

								$('#estadoCuentas').append(li_mov);
							  $('#estadoCuentas').listview( "refresh" );
							}
						});
					}
					Util.cargado();
				}
			});
		},
		error: function(jqXHR, textStatus, errorThrown){
			Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
		}
	});
}

function filtrarEstadoCuentas(){
	var filtro = { 
		inicio: Util.formato_fecha_bbdd($('#filtro_inicio').val()), 
		final: Util.formato_fecha_bbdd($('#filtro_final').val()), 
		tipo: $('#filtro_pp').val() 
	};

  cargarEstadoCuentas(filtro);
  $("#menu_secundario").panel("close");
}