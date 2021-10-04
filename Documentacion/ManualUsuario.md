# Manual de usuario

## Cloud-Native Distributed System

## Información General
- Curso: Sistemas Operativos 1
- Segundo Semestre 2021
- Lenguajes: JavaScript, Python, Golang, Rust, C.
- Grupo 18

&nbsp;
---
## Integrantes

|Carné | Nombre |
|:----:|:----:|
|201602625| Oscar Alfredo Llamas Lemus|
|201709309| Jose Alejandro Santizo Cotto|
|201801628| Sergio Alexander Echigoyen Gómez|

# Contenido 

- [Descripción](#descripción)
- [Grafana](#grafana)
- [Funcionalidad](#funcionalidad)

# Descripción

El sistema será totalmente en la nube, utilizando diferentes servicios de Google Cloud Platform y una base de 
datos de Cosmos DB en Microsoft Azure. Contará con una carga masiva de datos a partir de diferentes 
generadores de tráfico, la información a mandar será detallada más adelante. Además de este sistema, se 
contará con un modo “Administrador” en el cual se podrán visualizar gráficas y métricas relevantes de las 
noticias, y de la información de la RAM y procesos de las máquinas virtuales que se tendrán en la nube.

&nbsp;
---

## Diagrama general del sistema
&nbsp;

![Casos de uso](https://i.ibb.co/zX5r7zM/sopes.jpg)

# Grafana


<div style="text-align: justify"> Grafana provee un interfaz amigable e intuitiva, además, de que la configuración para generar los dashboard es sencilla, y al integrarlo junto con prometheus permite que agregar una fuente de datos sea eficiente y los datos se puedan obtener en tiempo real.
</div>

- Panel de Prometheus
<p align="center" >
  <img src="https://i.ibb.co/89yN8zy/image.png" width="500" height="250" />
</p>
<div style="text-align: center">  </div>
&nbsp;

- Dashboard con Grafana
<p align="center" >
  <img src="https://i.ibb.co/zsLL1Gd/image.png" width="500" height="250" />
</p>
<div style="text-align: center">  </div>
&nbsp;

# Funcionalidad

- Vista de tweet en aplicación web.
<p align="center" >
  <img src="https://i.ibb.co/yNyK7sJ/image.png" width="500" height="250" />
</p>
<div style="text-align: center">  </div>
&nbsp;

- Vista de reportes en aplicación web.
<p align="center" >
  <img src="https://i.ibb.co/gZZ6JYX/image.png" width="500" height="250" />
</p>
<div style="text-align: center">  </div>
&nbsp;