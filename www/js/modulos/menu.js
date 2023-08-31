
function cargarMenu() {
  Util.cargando();
  var $page = $('#pagina_principal');
  var dl = JSON.parse(window.localStorage.getItem("datos_login"));

  $.get('paginas/cabecera.html', function(data){
  	data = data.replace('__COMUNIDAD__', dl.denominacion);

    if(!$('#enlace_menu_principal').length){
      $page.removeClass('bgLoginPage');
      $page.html(data);
      $page.trigger('create');
    }

    $('#app_cabecera h1').html(dl.denominacion);

    cambioOfflineOnline();
    limpiarMenuSecundario();
    fcmpush.initialize();
    if(dl.hasOwnProperty('portero')){
      app.visitas();
    }else{
      app.cargarContenido('paginas/menu.html', funcionesMenu);      
    }
  }, 'html');
}

function cambioOfflineOnline() {
  if (window.localStorage.getItem("online") == 0) {
    $('#app_cabecera').addClass('ui-offline');
    $('a[data-online=1]').addClass('ui-disabled');
  } else {
    $('#app_cabecera').removeClass('ui-offline');
    $('a[data-online=1]').removeClass('ui-disabled');
  }
}

function funcionesMenu() {    
  cambiarColorImagen();

  ajustarMenu();
  $(window).resize(ajustarMenu);

  var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));
  var online = window.localStorage.getItem("online");

  if(datos_login.incidencias_desactivado){
    $('#incidencias').addClass('ui-disabled');
  }

  var comunidades = window.localStorage.getItem("comunidades");
  if(!comunidades || comunidades.length < 2){
    $('#menu_comunidades').hide();
  }

  if (online == 0) {
    $('a[data-online=1]').addClass('ui-disabled');
    Util.cargado();
    //navigator.splashscreen.hide();
  } else {
    $.ajax({
      url: ruta_app + 'api/menuPrincipal',
      data: { id_comunidad: datos_login.id_comunidad, id_usuario: datos_login.usuario_id, id_customer: datos_login.id_customer },
      dataType: 'json',
      success: function(data) {
        $('#num_mensajes').html(data.num_mensajes);
        $('#num_incidencias').html(data.num_incidencias);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
      }
    }).done(function() {
      Util.cargado();
      //navigator.splashscreen.hide();
    });
  }
}

function ajustarMenu() {
  if(Util.isAppleDevice()){
    $('#enlace_menu_principal').css('margin-top', '15px');
    $('#app_cabecera').css('padding-top', '15px');
    $('#enlace_menu_secundario').css('margin-top', '15px');
    $('#app_panel_content').css('padding-top', '15px');
  }

  if ($('.padre_enlace_menu').length && $('.enlace_menu:first').length) {
    if (!$('#menu_secundario #cerrar_menu_secundario').length) {
      var ww = $(window).width() - 30; //30 es el padding del contenedor
      var ew = Number($('.enlace_menu:first').width()) + Number($('.enlace_menu:first').css('margin-right').replace('px', '').replace('%', ''));
      var x = Math.floor(ww / ew);

      $('.padre_enlace_menu').width(x * ew);
    }
  }
}

function limpiarMenuSecundario() {
  $('#app_panel_content').html('');
}
