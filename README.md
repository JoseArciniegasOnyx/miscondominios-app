## Inicialización aplicación de Mis Condominios

Tener en cuenta los siguientes requisitos:

- Versión de Cordova la más actual.
- Versión de Android 8.0.0 - Android 8.0 (Oreo)
- Versión de Android Studio la mas actual
- Instalar la versión JDK 8
- Instalar Gradle en la versión 7.4.2

Para descargar las versiones legacy de Gradle ingresar al siguiente link:
[Gradle](https://services.gradle.org/distributions/ "Gradle")

Para la versión JDK8 si no se encuentra un link de descarga activo, se recomienda registrarse como usuario de Oracle para poder descargarla

Las versiones del SDK para Android 8.0.0 se instalan directamente en el Android Studio es la pestaña **Tools > SDK Manager > Languages & Frameworks > SDK Platforms** y buscar **Android 8.0 (Oreo)**

Para inicializar correctamente la aplicación se requieren los siguientes plugins (utilizar los comandos en la terminal a continuación):

- cordova plugin add cordova-plugin-console
- cordova plugin add cordova-plugin-dialogs
- cordova plugin add https://github.com/whiteoctober/cordova-plugin-app-version.git
- cordova plugin add https://github.com/leecrossley/cordova-plugin-transport-security.git
- cordova plugin add cordova-plugin-inappbrowser
- cordova plugin add cordova-plugin-whitelist

Una vez agregados los plugins agregar las plataformas correspondientes (Android):

- cordova platform add android

Una vez agregados los plugins y plataformas comprobar si se tienen instalados los PATH en las variables de entorno en caso tal de que Android Studio no lo halla hecho automaticamente, si es este caso dirigirle a **Variables de Entorno si estás en Windows**

**Variables de entorno:**

**Variable de entorno:** JAVA_HOME
**Valor de JAVA_HOME:** Dirección de la ruta donde está instalado el JDK 8 de Java (Ejemplo: C:\Program Files\Java\jdk1.8.0_202)

**Variable de entorno:** ANDROID_SDK_ROOT
**Valor de ANDROID_SDK_ROOT:** Dirección de la instalación del SDK de Android 8.0 (Oreo) (Ejemplo: C:\Users\dev\AppData\Local\Android\Sdk)

Finalmente agregar en la variable **"Path"** las direcciones de instalación del SDK platform-tools, platforms y build-tools junto con la ruta de instalación de Gradle 7.4.2

**Una vez se halla instalado cada uno de los pasos anteriores ejecutar el comando en la terminal apuntando al directorio raiz de la aplicación "cordova build android"sin las comillas, si se ejecuta el comando "cordova build"solamente generará error si no se está en una maquina IOS**

Para probar la aplicación directamente en un emulador se recomienda hacerlo en Android Studio directamente importando la carpeta del proyecto y instalando un emulador que el mismo Android Studio recomienda para la versión 8.0 (Oreo)

Para IOS/MacOS

cd "C:\Program Files\Oracle\VirtualBox\"
VBoxManage.exe modifyvm "nombre maquina virtual" –-cpuidset 00000001 000106e5 00100800 0098e3fd bfebfbff
VBoxManage setextradata "nombre maquina virtua" VBoxInternal/Devices/efi/0/Config/DmiSystemProduct “MacBookPro15,1”
VBoxManage setextradata "nombre maquina virtua" "VBoxInternal/Devices/efi/0/Config/DmiBoardProduct" "Mac-551B86E5744E2388"
VBoxManage setextradata "nombre maquina virtua" "VBoxInternal/Devices/smc/0/Config/DeviceKey" "ourhardworkbythesewordsguardedpleasedontsteal(c)AppleComputerInc"
VBoxManage setextradata "nombre maquina virtua" "VBoxInternal/Devices/smc/0/Config/GetKeyFromRealSMC" 1