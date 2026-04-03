# COMBO-UI Editor

![alt text](https://vida.guillermovalentin.es/combo/comboui.svg)
#
### COMBO-UI se compone de un editor de componentes UI y varios paquetes npm que permiten utilizar los diseños de temas en tu App frontend y ver los cambios   en tiempo real.

1. Creas el tema en el editor.
2. Instalas COMBO-UI en tu app como paquete npm.
3. Creas la páginas de tu App.
4. Cambia el diseño del tema mientras ves los cambios en tu propia app.

## Descarga del editor

[Releases](https://github.com/masweb/combo-ui-editor/releases/)


### Previsualización de cambios en vivo

COMBO-UI puede conectar el editor donde tenga instalado su paquete combo-ui-xxx, activando la edición en vivo puede ver el  resultado de sus cambios directamenter en la App cliente.

### Alto nivel de personalización

COMBO-UI permite un alto nivel de personalización en todos los componentes, desde Typhopgraphy se puede controlar la tipografía de todos los componentes, pero también se puede elegir tipografías diferentes a nivel de componente o de formulario.

### Preparado para temas con muchísimas variantes

COMBO-UI permite crear temas con un número indefinido de variantes por componente, la App está diseñada para no cargar en memoria todos los componentes con sus variantes al mismo tiempo, solo carga en memoria las varinates del componente que estamos editando en el momento.

### Persistencia

COMBO-UI tiene autosave de manera fija, todos los cambios que realice persisten en memoria mediante el uso de IndexDB.

### Dark mode

Por defecto todos los temas tienen soporte para Dark Mode, en los paquete dispone de un ThemeToggler que puede usar y personalizar a su gusto, además el Dark/Light mode es compatible con el sistema de VueUSe y Tailwind.


### Librería BASSCSS y Reset

[BASSCSS](https://basscss.com/)

Por defecto todos los temas tienen instalada esta librería de utilidades css con las que puede diseñar sus plantillas de una manera más rápida, también integra un reset para óptimizción de los estilos.
