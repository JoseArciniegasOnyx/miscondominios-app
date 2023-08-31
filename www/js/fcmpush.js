var fcmpush = {
  options: {
    senderID: "589185645771", /* Google developers project number */
    registerUrl: ruta_app + "api/registroFcmPush", /* Your gcm-rest registration endpoint */
    unRegisterUrl: ruta_app + "api/cancelarRegistroFcmPush"
  },
  initialize: function() {
    var notificacion = Number(Util.getLocalStorage('notificacion', 0));
    if(notificacion === 1){
      fcmpush.register();
    }else{
      if(localStorage.getItem("notificacion") === null){
        Util.alertConfirm('¿Desea recibir notificaciones de MisCondominios?', function(buttonIndex){
          if(buttonIndex == 1){
            Util.setLocalStorage('notificacion', 1);
            fcmpush.register();
          }else{
            Util.setLocalStorage('notificacion', 0);
            fcmpush.unregister();
          }
        });  
      }    
    }
  },
  register: function() {
    if (device.platform === 'android' || device.platform === 'Android') {
      window.FirebasePlugin.getToken(function(token) {
        var dl = JSON.parse(window.localStorage.getItem("datos_login"));
        //alert(ruta_app+'--'+token+'--'+dl.empleado_id);
        $.ajax({
          type: "POST",
          url: ruta_app + "api/registroFcmPush", 
          data: {
            "registrationId": token,
            "id_empleado": dl.usuario_id
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function() {
            Util.log('READY FOR NOTIFICATIONS');
          },
          error: function(e) {
            Util.log("Unable to register " + JSON.stringify(e));
          }
        });
      }, function(error) {
          console.error(error);
      });
      window.FirebasePlugin.onNotificationOpen(function(notification) {
          Util.alertInfo(notification.body);
      }, function(error) {
          console.error(error);
      });
    } else {
      Util.log('Your device platform is not Android!!!');
    }
  },
  unregister: function(){
    window.FirebasePlugin.unregister(function(result){
      Util.log('Status: ' + result);
      var dl = JSON.parse(window.localStorage.getItem("datos_login"));
      $.ajax({
        type: "POST",
        url: ruta_app + "api/registroFcmPush", 
        data: {
          "id_empleado": dl.usuario_id
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function() {
          Util.log('READY FOR NOTIFICATIONS');
        },
        error: function(e) {
          Util.log("Unable to register " + JSON.stringify(e));
        }
      });
    }, function(result){
      Util.log('Error handler ' + result);
    });
  }
};