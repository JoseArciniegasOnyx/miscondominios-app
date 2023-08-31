// var ruta_app = 'http://192.168.1.39:80/app_dev.php/';
// var ruta_web = 'http://192.168.1.39:80/';
var debug = 0;

//var ruta_app = 'https://www.miscondominios.com/';
//var ruta_web = 'https://www.miscondominios.com/';

var ruta_app = "http://192.168.30.90:80/";
var ruta_web = "http://192.168.30.90:80/";

var app = {
  // Application Constructor
  initialize: function () {
    app.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function () {
    window.localStorage.setItem("ready", 0);
    window.localStorage.setItem("online", 1);

    document.addEventListener("deviceready", app.onDeviceReady, false);
    document.addEventListener("online", app.onLineEvent, false);
    document.addEventListener("offline", app.offLineEvent, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function () {
    window.localStorage.setItem("ready", 1);

    app.comprobarSesion();
  },
  onLineEvent: function () {
    if (window.localStorage.getItem("ready") == 1) {
      window.localStorage.setItem("online", 1);
    }
  },
  offLineEvent: function () {
    if (window.localStorage.getItem("ready") == 1) {
      window.localStorage.setItem("online", 0);
    }
  },
  //Comprobar si esta logueado
  comprobarSesion: function (fnCallback) {
    var login = window.localStorage.getItem("login");

    if (login == 1) {
      if (fnCallback) {
        cambiarColorApp(fnCallback);
      } else {
        cambiarColorApp(cargarMenu);
      }
    } else {
      $("#pagina_principal").addClass("bgLoginPage");
      $("#pagina_principal #app_cabecera").remove();
      $("#pagina_principal #app_content").html("");
      app.cargarContenido("paginas/login.html", function () {
        var h = $("#mobile-login").height();
        $("#mobile-login").css("margin-top", "-" + h / 2 + "px");
        //navigator.splashscreen.hide();
      });
    }
  },
  cargarContenido: function (url, callBack) {
    Util.cargando();
    callBack ? (callBack = callBack) : (callBack = false);
    var $page = $("#pagina_principal");

    $.ajax({
      url: url,
      dataType: "html",
      success: function (data) {
        $("#app_content").html(data);
        $page.page("destroy").page();
        $("body").scrollTop(0);
        Util.cargado();

        if (url === "paginas/menu.html") {
          $("#enlace_menu_secundario").hide();
        }

        if (!$("#menu_secundario #cerrar_menu_secundario").length) {
          $("#enlace_menu_secundario").hide();
        } else {
          $("#enlace_menu_secundario").show();
        }

        if (callBack !== false) {
          callBack();
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
      },
    });
  },
  // Login
  login: function () {
    var usuario = $("#usuario_usuario").val();
    var clave = $("#usuario_clave").val();

    Util.cargando();

    app.comprobarMiServidor(usuario, function (host) {
      $.ajax({
        url: ruta_app + "api/login",
        data: {
          usuario: usuario,
          clave: clave,
        },
        dataType: "json",
        success: function (data) {
          if (data.hasOwnProperty("comunidades")) {
            window.localStorage.setItem(
              "comunidades",
              JSON.stringify(data.comunidades)
            );
          }
          window.localStorage.setItem("usuario", usuario);
          window.localStorage.setItem("clave", clave);

          var resp = Number(data.response);
          if (resp === 1) {
            //Login correcto y con solo una comunidad
            funcionesLogin(usuario, clave, data.data);
          } else if (resp === 2) {
            //Login correcto pero con más de una comunidad
            seleccionarComunidad(true);
          } else {
            Util.cargado();
            Util.alertError(data.data);
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
        },
      });
    });

    return false;
  },
  // Comprobar de que servidor llamar a la api
  comprobarMiServidor: function (email, callback) {
    $.ajax({
      url: ruta_app + "api/miServidor",
      data: {
        email: email,
      },
      dataType: "json",
      success: function (data) {
        if (data.host) {
          // data.host = 'localhost:80';
          Util.log("HOST: " + data.host);

          // ruta_app = 'http://' + data.host + '/app_dev.php';
          ruta_app = "http://" + data.host + "/";
          ruta_web = "http://" + data.host + "/";
        }
        callback();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        Util.globalAjaxError(jqXHR, textStatus, errorThrown, new Error());
      },
    });
  },
  // Logout
  logout: function () {
    window.localStorage.clear();
    app.comprobarSesion();
  },
  acerdaDe: function () {
    limpiarMenuSecundario();
    app.cargarContenido("paginas/acercade.html", function () {
      cordova.getAppVersion.getVersionNumber(function (version) {
        $("#version").append(version);
      });
    });
  },
  // Menu mensajes
  mensajes: function (entrada) {
    $.ajax({
      url: "paginas/mensajes/menu.html",
      dataType: "html",
      success: function (data) {
        $("#app_panel_content").html(data);
        app.cargarContenido("paginas/mensajes/index.html", function () {
          funcionesMensajes(entrada);
        });
      },
    });
  },
  // Estado de cuentas
  estadoCuentas: function () {
    $.ajax({
      url: "paginas/estadoCuentas/menu.html",
      dataType: "html",
      success: function (data) {
        $("#app_panel_content").html(data);
        $("#filtro_pp").closest("div").addClass("ui-alt-icon");
        app.cargarContenido("paginas/estadoCuentas/index.html", function () {
          funcionesEstadoCuentas();
        });
      },
    });
  },
  // Instalaciones
  instalaciones: function () {
    limpiarMenuSecundario();
    app.cargarContenido("paginas/instalaciones/index.html", function () {
      funcionesInstalaciones();
    });
  },
  // Incidencias
  incidencias: function () {
    limpiarMenuSecundario();
    app.cargarContenido("paginas/incidencias/index.html", function () {
      funcionesIncidencias();
    });
  },
  // Votaciones
  votaciones: function () {
    limpiarMenuSecundario();
    app.cargarContenido("paginas/votaciones/index.html", function () {
      funcionesVotaciones();
    });
  },
  // Documentos
  documentos: function (carpeta) {
    var carpeta = carpeta ? carpeta : "";
    limpiarMenuSecundario();
    app.cargarContenido("paginas/documentos/index.html", function () {
      funcionesDocumentos(carpeta);
    });
  },
  // Visitas
  visitas: function () {
    limpiarMenuSecundario();
    app.cargarContenido("paginas/visitas/index.html", function () {
      funcionesVisitas();
    });
  },
  // Personas
  personas: function () {
    limpiarMenuSecundario();
    app.cargarContenido("paginas/visitas/personas.html", function () {
      cargarPersonas();
    });
  },
};

/** FUNCIONES GENERALES **/

function funcionesLogin(usuario, clave, data) {
  window.localStorage.setItem("login", 1);
  window.localStorage.setItem("datos_login", JSON.stringify(data));

  cambiarColorApp(function () {
    Util.cargado();
    cargarMenu();
  });
}

function cambiarColorApp(callback) {
  var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));

  if (datos_login.hasOwnProperty("colorFranquicia")) {
    var color = "#" + datos_login.colorFranquicia;
    var color2 = oscurecerColor(color, 50);

    $.ajax({
      url: "css/cambioColor.css",
      success: function (data) {
        data = data
          .replace(/\__COLOR__/g, color)
          .replace(/\__COLOROSC__/g, color2);

        $("<style></style>").appendTo("head").html(data);
        callback();
      },
    });
  } else {
    callback();
  }
}

function oscurecerColor(color, cant) {
  //voy a extraer las tres partes del color
  var rojo = color.substr(1, 2);
  var verd = color.substr(3, 2);
  var azul = color.substr(5, 2);

  //voy a convertir a enteros los string, que tengo en hexadecimal
  var introjo = parseInt(rojo, 16);
  var intverd = parseInt(verd, 16);
  var intazul = parseInt(azul, 16);

  //ahora verifico que no quede como negativo y resto
  if (introjo - cant >= 0) introjo = introjo - cant;
  if (intverd - cant >= 0) intverd = intverd - cant;
  if (intazul - cant >= 0) intazul = intazul - cant;

  //voy a convertir a hexadecimal, lo que tengo en enteros
  rojo = introjo.toString(16);
  verd = intverd.toString(16);
  azul = intazul.toString(16);

  //voy a validar que los string hexadecimales tengan dos caracteres
  if (rojo.length < 2) rojo = "0" + rojo;
  if (verd.length < 2) verd = "0" + verd;
  if (azul.length < 2) azul = "0" + azul;

  //voy a construir el color hexadecimal
  var oscuridad = "#" + rojo + verd + azul;

  //la función devuelve el valor del color hexadecimal resultante
  return oscuridad;
}

function cambiarColorImagen() {
  var datos_login = JSON.parse(window.localStorage.getItem("datos_login"));

  if (datos_login && datos_login.hasOwnProperty("colorFranquicia")) {
    $(".imagen_bw").each(function () {
      var src = $(this).attr("src");

      if (src.indexOf("_bw.") === -1) {
        var n = src.lastIndexOf(".");
        src = src.substring(0, n) + "_bw." + src.substring(n + 1);

        $(this).attr("src", src);
      }
    });
  }
}

function abrirDocumento(ruta) {
  window.open(ruta, "_system", "location=no");
}
/** FIN FUNCIONES GENERALES **/

// Mostrar/Ocultar el menu secundario desplazando el dedo en la pantalla
$(document).on("pageinit", "#pagina_principal", function () {
  $(document).on("swipeleft swiperight", "#pagina_principal", function (e) {
    if ($.mobile.activePage.jqmData("panel") !== "open") {
      if ($("#cerrar_menu_secundario").length) {
        if (e.type === "swipeleft") {
          $("#menu_secundario").panel("open");
        } else if (e.type === "swiperight") {
          $("#menu_secundario").panel("close");
        }
      }
    }
  });

  $("#menu_secundario").on("panelbeforeopen", function (event, ui) {
    cambiarColorImagen();
  });
});

// Iniciar la app
app.initialize();
