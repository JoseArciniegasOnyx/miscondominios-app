function seleccionarComunidad(inicio) {
  Util.cargando();
  var $page = $('#pagina_principal');

  if(inicio){
    var dl = { denominacion: '' };
  }else{
    var dl = JSON.parse(window.localStorage.getItem("datos_login"));
  }
  
  $.get('paginas/cabecera.html', function(data){
  	data = data.replace('__COMUNIDAD__', dl.denominacion);

    if(!$('#enlace_menu_principal').length){
      $page.removeClass('bgLoginPage');
      $page.html(data);
      $page.trigger('create');

      $('#enlace_menu_principal').remove();
    }

    cambioOfflineOnline();
    limpiarMenuSecundario();
    app.cargarContenido('paginas/comunidades/index.html', funcionesComunidades);
  }, 'html');
}

function funcionesComunidades() {  
  var comunidades = JSON.parse(window.localStorage.getItem("comunidades"));

  Util.cargando();

  $('#comunidades').html('');

  $.ajax({
    url: 'paginas/comunidades/_li_comunidad.html',
    dataType: 'html',
    success: function(li){
      $.each(comunidades, function(i, c){
        var li_com = li.replace('__COMUNIDAD__', c.descripcion)
          .replace('__ID__', c.id_comunidad)
          .replace('__DIRECCION__', Util.nl2br(c.direccion))
          .replace('__IMAGEN__', (c.imagen ? ruta_web + 'uploads/img/' + c.imagen : ruta_web + 'images/comunidad_sin_foto2.png'));

        $('#comunidades').append(li_com);
        $('#comunidades').listview( "refresh" );
      });
      Util.cargado();
    }
  });
}

function loguearComunidad(id){
  var usuario = window.localStorage.getItem("usuario");
  var clave = window.localStorage.getItem("clave");

  Util.cargando();

  $.ajax({
    url: ruta_app + 'api/login',
    data: {
      usuario: usuario,
      clave: clave,
      id_comunidad: id
    },
    dataType: 'json',
    success: function(data) {
      if (data.response == 1) {
        //window.localStorage.clear();
        funcionesLogin(usuario, clave, data.data);
      } else {
        Util.cargado();
        Util.alertError(data.data);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
    }
  });
}