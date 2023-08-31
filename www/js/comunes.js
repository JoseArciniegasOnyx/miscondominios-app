function Comunes() {

}

Comunes.prototype.alertError = function(msg) {
  navigator.notification.alert(
    msg,
    null,
    'ERROR'
  );
};

Comunes.prototype.alertInfo = function(msg) {
  navigator.notification.alert(
    msg,
    null,
    'INFORMACIÓN'
  );
};

Comunes.prototype.alertConfirm = function(msg, fn) {
  navigator.notification.confirm(
    msg,
    fn,
    'CONFIRMACIÓN', [txt_si, txt_no]
  );
};

Comunes.prototype.cargando = function(tipo) {
  tipo = (tipo || 0);

  if (tipo == 1) {
    $('#cargando_mini').show();
  } else {
    $.mobile.loading("show", {
      text: 'Cargando',
      textVisible: true,
      theme: 'a',
      textonly: false
    });
  }

};

Comunes.prototype.cargado = function(tipo) {
  if (tipo == 1) {
    $('#cargando_mini').hide();
  } else {
    $.mobile.loading("hide");
  }
};

Comunes.prototype.dump = function(obj, pantalla) {
  pantalla = pantalla ? pantalla : false;
  var out = '';
  for (var i in obj) {
    out += i + ": " + obj[i] + "\n";
  }

  alert(out);

  if (pantalla) {
    var pre = document.createElement('pre');
    pre.innerHTML = out;
    document.body.appendChild(pre)
  }
};

/**
 * The console displays the object and all its properties.
 * @param object the object to log.
 * @param objectName the name used to log the object.
 */
Comunes.prototype.logDump = function(object, objectName) {
  var out = 'Descripción del objeto ' + objectName + ':\n';
  for (var i in object) {
    out += objectName + '.' + i + ' : ' + object[i] + '\n'
  }

  console.log(out);
};

Comunes.prototype.formato_fecha = function(fecha, hora) {
  var res = '';
  (hora) ? hora = hora: hora = false;

  if (!Util.isEmpty(fecha)) {
    if (Util.isAppleDevice()) {
      var dateParts = fecha.substring(0,10).split('-');
      var timePart = fecha.substr(11);
      fecha = dateParts[1] + '/' + dateParts[2] + '/' + dateParts[0] + ' ' + timePart;
    }

    var f = new Date(fecha);
    var d = f.getDate();
    var m = f.getMonth() + 1;
    var y = f.getFullYear();
    var t = f.toLocaleTimeString();

    if (Number(d) < 10) d = '0' + d;
    if (Number(m) < 10) m = '0' + m;

    var res = d + '-' + m + '-' + y;
    if (hora){
      if(Util.isAppleDevice){
        t = t.substring(0,8);
      }
      res += ' ' + t;
    }
  }

  return res;
};

Comunes.prototype.formato_fecha_bbdd = function(fecha, hora) {
  var res = '';
  (hora) ? hora = hora: hora = false;

  if (!Util.isEmpty(fecha)) {
    var f = new Date(fecha);
    var d = f.getDate();
    var m = f.getMonth() + 1;
    var y = f.getFullYear();
    var t = f.toLocaleTimeString();

    if (Number(d) < 10) d = '0' + d;
    if (Number(m) < 10) m = '0' + m;

    var res = y + '-' + m + '-' + d;
    if (hora)
      res += ' ' + t;
  }

  return res;
};

Comunes.prototype.nl2br = function(txt) {
  if (txt)
    return txt.replace(/\n/g, "<br />");
  return txt;
};

Comunes.prototype.fmod = function(a, b) {
  return a % b;
};

Comunes.prototype.strtotime = function(fecha) {
  var d = new Date(fecha);
  var t = d.getTime();

  if (isNaN(t))
    return -1;

  return t;
};

Comunes.prototype.logResponseError = function(jqXHR, textStatus, errorThrown, error) {
  if (debug == 1) {
    console.log('LINE: ' + this.getLineNumberError(error));
    if (jqXHR) {
      console.log('STATUS: ' + jqXHR.status);
      //console.log(jqXHR.responseText);
    }
    console.log('TIPO: ' + textStatus);
    console.log('MENSAJE: ' + errorThrown);
  }
};

Comunes.prototype.log = function(msg) {
  if (debug == 1) {
    console.log('[DEBUG TRACE]: ' + msg);
  }
};

Comunes.prototype.getLineNumberError = function(error) {
  var tmp = (error.stack.split("\n"))[1].split(':');
  var file = tmp[tmp.length - 3].substr(tmp[tmp.length - 3].lastIndexOf("/") + 1);

  return tmp[tmp.length - 2] + ' (' + file + ')';
};

Comunes.prototype.getConfValueByKey = function(confs, key) {
  var res = null;

  for (var i in confs) {
    if (confs[i].key === key) {
      res = confs[i];
    }
  }

  return res;
};

Comunes.prototype.datePicker = function(event) {
  if (!Modernizr.inputtypes.date) {
    event.stopPropagation();
    var currentField = $(event.target);

    var myNewDate = Date.parse(currentField.attr('data-fecha')) || Date.parse(currentField.val()) || new Date();
    if (typeof myNewDate === "number") {
      myNewDate = new Date(myNewDate);
    }

    window.plugins.datePicker.show({
      date: myNewDate,
      mode: 'date'
    }, function(returnDate) {
      if (isNaN(Date.parse(returnDate)) === false) {
        var newDate = new Date(returnDate);
        currentField.val(Util.formato_fecha(newDate));
        currentField.attr('data-fecha', Util.formato_fecha_bbdd(newDate));
      }

      currentField.blur();
    });
  }
};

Comunes.prototype.timePicker = function(event) {
  //if (!Modernizr.inputtypes.time) {
  event.stopPropagation();
  var currentField = $(event.target);
  var time = currentField.val();
  var myNewTime = new Date();

  if (time) {
    myNewTime.setHours(time.substr(0, 2));
    myNewTime.setMinutes(time.substr(3, 2));
  }
  datePicker.show({
    date: myNewTime,
    mode: 'time'
  }, function(returnDate) {
    if (isNaN(Date.parse(returnDate)) === false) {
      var newDate = new Date(returnDate);
      currentField.val(newDate.toLocaleTimeString().substr(0, 5));
    }

    currentField.blur();
  });
  //}
};

Comunes.prototype.isEmpty = function(value) {
  return (value === null || value === 'null' || value === undefined || value === 'undefined' || typeof value === 'undefined' || value.length === 0);
};

Comunes.prototype.calcularPorcentajePB = function(total, actual) {
  return (actual * 100) / total;
};

Comunes.prototype.getValueByKey = function(list, key, def) {
  var value = (def || false);

  for (var i = 0, len = list.length; i < len; i++) {
    if (list[i]['key'] === key) {
      return list[i]['value'];
    }
  }

  return value;
};

Comunes.prototype.resumenTexto = function(texto, limit, start) {
  texto = texto ? texto : '';
  limit = (limit || 100);
  start = (start || 0);

  return texto.slice(start, limit);
};

Comunes.prototype.construirDir = function(direccion) {
  var dir = [];
  if (direccion.direccion) dir.push(direccion.direccion);
  if (direccion.poblacion) dir.push(direccion.poblacion);
  if (direccion.pais) dir.push(direccion.pais);

  return dir.join(',');
};

Comunes.prototype.iniciarGaleria = function(obj) {
  if (obj.length) {
    obj.photoSwipe({
      getToolbar: function() {
        var toolbar = '<div class="ps-toolbar-close"><div class="ps-toolbar-content">x</div></div>';
        toolbar += '<div class="ps-toolbar-previous"><div class="ps-toolbar-content"><</div></div>';
        toolbar += '<div class="ps-toolbar-next"><div class="ps-toolbar-content">></div></div>';

        return toolbar;
      }
    });
  }
};

Comunes.prototype.getKeyValueObjectsArray = function(objs, key, str) {
  var keys = [];
  str = str ? str : false;

  for (var i in objs) {
    var obj = objs[i];
    if (obj.hasOwnProperty(key)) {
      if (str) keys.push(Util.isEmpty(obj[key]) ? obj[key] : obj[key].toString());
      else keys.push(obj[key]);
    }
  }

  return keys;
};

Comunes.prototype.recorrerObjetos = function(datos, n, fnObject, fnSuccess) {
  if (datos.length) {
    var ele = datos[n++];

    fnObject(ele, function() {
      if (n === datos.length) {
        fnSuccess();
      } else {
        Util.recorrerObjetos(datos, n, fnObject, fnSuccess);
      }
    });

  } else {
    fnSuccess();
  }
};

Comunes.prototype.arrayToObject = function(list, key, str) {
  var objs = {};
  str = str ? str : false;

  for (var i in list) {
    var obj = list[i];
    if (obj.hasOwnProperty(key)) {
      if (str) objs[obj[key].toString()] = obj;
      else objs[obj[key]] = obj;
    }
  }

  return objs;
};

Comunes.prototype.generateKey = function(str) {
  var key = new Date().getTime();

  if (str) key = key.toString();

  return key;
};

Comunes.prototype.camelCaser = function(str) {
  // Where [-_ .] is the seperator, you can add say '@' too
  // + is to handle repetition of seperator           
  // ? is to take care of preceeding token 
  // match nov(ember)? matches nov and november
  var camelCased = str.replace(/[-_ .]+(.)?/g, function(match, p) {
    if (p) {
      return p.toUpperCase();
    }
    return '';
  }).replace(/[^\w]/gi, ''); //strip unwanted characters   

  return camelCased[0].toUpperCase() + camelCased.slice(1);;
};

Comunes.prototype.formDataConvert = function(formData) {
  var self = this,
    json = {},
    push_counters = {},
    patterns = {
      "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
      "key": /[a-zA-Z0-9_]+|(?=\[\])/g,
      "push": /^$/,
      "fixed": /^\d+$/,
      "named": /^[a-zA-Z0-9_]+$/
    };

  this.build = function(base, key, value) {
    base[key] = value;
    return base;
  };

  this.push_counter = function(key) {
    if (push_counters[key] === undefined) {
      push_counters[key] = 0;
    }
    return push_counters[key]++;
  };

  $.each(formData, function() {
    // skip invalid keys
    if (!patterns.validate.test(this.name)) {
      return;
    }

    var k,
      keys = this.name.match(patterns.key),
      merge = this.value,
      reverse_key = this.name;

    while ((k = keys.pop()) !== undefined) {
      // adjust reverse_key
      reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');
      // push
      if (k.match(patterns.push)) {
        merge = self.build([], self.push_counter(reverse_key), merge);
      }
      // fixed
      else if (k.match(patterns.fixed)) {
        merge = self.build({}, k, merge);
      }
      // named
      else if (k.match(patterns.named)) {
        merge = self.build({}, k, merge);
      }
    }

    json = $.extend(true, json, merge);
  });

  return json;
};

Comunes.prototype.autocompletar = function() {
  $("#autocomplete").on("listviewbeforefilter", function(e, data) {
    var $ul = $(this),
      $input = $(data.input),
      value = $input.val(),
      fn = $ul.attr('data-fn');
    $ul.html("");
    if (value && value.length > 1) {
      $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
      $ul.listview("refresh");
      window[fn]($input.val(), function(response) {
        $ul.html(response);
        $ul.listview("refresh");
        $ul.trigger("updatelayout");
      });
    }
  });
};

Comunes.prototype.getHorasMinutos = function(val, tipo) {
  var horas = 0,
    mins = '00';
  var tmp = val.toString().split('.');

  if (tmp.length) horas = tmp[0];
  if (tmp.length > 1) {
    tmp[1] = Number('0.' + tmp[1]);
    mins = 60 * tmp[1];
    mins = Math.round(mins);
    if (Number(mins) < 10) mins = '0' + mins;
  }

  if (tipo === 'h') return horas;
  if (tipo === 'm') return mins;
  return horas + ':' + mins;
};

Comunes.prototype.direccionWeb = function(link) {
  if (link) {
    if (link.indexOf('http://') === -1 && link.indexOf('https://') === -1) {
      return 'http://' + link;
    } else {
      return link;
    }
  } else {
    return '#';
  }
};

Comunes.prototype.globalAjaxError = function(jqXHR, textStatus, errorThrown, error) {
  Util.logResponseError(jqXHR, textStatus, errorThrown, error);
  Util.cargado();
  Util.alertError(txt_error_general);
};

Comunes.prototype.mostrarSaldo = function(importe){
  var dl = JSON.parse(window.localStorage.getItem("datos_login"));
  var miles = ',';

  if(dl.separador != '.'){
    miles = '.';
  }

  importe = $.number( importe, 2, dl.separador, miles );

  if(dl.colocar_detras){
    importe += dl.simbolo_moneda;
  }else{
    importe = dl.simbolo_moneda + ' ' + importe;
  }

  return importe;
};

Comunes.prototype.pad = function(str, max) {
  str = str.toString();

  return str.length < max ? Util.pad("0" + str, max) : str;
};

Comunes.prototype.isAppleDevice = function() {
  if (navigator.userAgent.match(/(iPhone|iPod|iPad)/) != null) {
    return true;
  }

  return false;
};

Comunes.prototype.setLocalStorage = function(key, value){
  Util.log('SETSTORAGE: ' + key + ' | ' + value);
  
  window.localStorage.setItem(key, value);
};

Comunes.prototype.getLocalStorage = function(key, def_value){
  var value = window.localStorage.getItem(key);

  if(value === null && def_value !== undefined){
    value = def_value;
  }

  Util.log('GETSTORAGE: ' + key + ' | ' + value);

  return value;
};

var Util = new Comunes();