# Manual técnico

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

- [Descripción general](#descripción-general) 
- [Herramientas utilizadas](#herramientas-utilizadas)    
    - [Bases de datos](#bases-de-datos)
        - [Modelo de bases de datos](#modelo-de-bases-de-datos)
        - [Azure CosmosDB](#azure-cosmosdb)
        - [Google CloudSQL](#google-cloudsql)
    - [Lenguajes utilizados](#lenguajes-utilizados)
        - [Python](#python)
        - [Golang](#go) 
        - [Rust](#rust) 
        - [C](#c)
        - [Javascript](#javascript)      
    - [Google Cloud Platform](#google-cloud-platform)
        - [Cloud Functions](#cloud-functions)
        - [Cloud Run](#cloud-run)
        - [Virtual Machines](#virtual-machines)
        - [App Engine](#app-engine)
        - [Pub-Sub](#pub-sub)   
        - [Load Balancer](#load-balancer)
    - [Load Tester](#load-tester)
        - [Locust](#locust) 
    - [Docker](#docker)
    - [Docker Compose](#docker-compose)
    - [Containerd](#containerd)
    - [Prometheus](#prometheus) 
    - [Grafana](#grafana)
    - [React](#react)
    - [Sockets-io](#sockets-io) 
- [Preguntas](#preguntas)
- [Screenshots](#screenshots)

&nbsp;
---
# Descripción general

<div style="text-align: justify"> • El sistema será totalmente en la nube, utilizando diferentes servicios de Google Cloud Platform y una base de datos de Cosmos DB en Microsoft Azure. Contará con una carga masiva de datos a partir de diferentes generadores de tráfico, la información a mandar será detallada más adelante. Además de este sistema, se contará con un modo “Administrador” en el cual se podrán visualizar gráficas y métricas relevantes de las noticias, y de la información de la RAM y procesos de las máquinas virtuales que se tendrán en la nube.  </div>

&nbsp;
---

# Herramientas utilizadas
<div style="text-align: justify"> A continuación se detallará las tecnologias y herramientas utilizadas.  </div>

---

## Bases de datos
&nbsp;
• Para almacenar la información de cada tweet publicado se implementaron dos bases de dados cloud.    


###  Modelo de bases de datos

<div style="text-align: justify"> • Considerando que lo único que se necesita almacenar es la información de un tweet individual se utilizó una sola tabla/colección en ambas bases de datos, la estructura de la tabla es la siguiente: </div>
&nbsp;
<p align="center" >
  <img src="https://i.ibb.co/GJMnrMx/tabla.jpg" width="490" height="225" />
</p>
&nbsp;

###  Azure CosmosDB
&nbsp;
• La primera base de datos utilizadas con el servicio de Cosmos DB de Microsoft Azure, el cual provee una API de MongoDB.
&nbsp;
<p align="center" >
  <img src="https://i.ibb.co/whh8Y9g/cosmosdb.jpg" width="350" height="140" />
</p>
&nbsp;

###  Google CloudSQL
&nbsp;
• Para la segunda base de datos se utilizó el servicio de GCP "Cloud SQL" implementando una instancia de MySQL en su versión 8.0
&nbsp;
<p align="center" >
  <img src="https://i.ibb.co/BrXxxBQ/cloudsql.jpg" width="375" height="375" />
</p>
&nbsp;

## Lenguajes utilizados
<div style="text-align: justify"> Para la implementación de las distintas tecnologias utilizadas en el proyecto se hizo uso de varios lenguajes de programación los cuales tuvieron uno o varios propósitos específicos. </div>
&nbsp;

### Python

<div style="text-align: justify"> Uno de los lenguajes más versatiles y utilizados hoy en día es python, el cual fue utilizado en este proyecto para distintos propósitos los cuales fueron: implementación de un Load Tester, una REST API con conexión a CosmosDB & CloudSQL, una Cloud Function y un publisher para Google Pub/Sub.</div>
&nbsp;
<p align="center" >
  <img src="https://i.ibb.co/H7nDQPJ/python.jpg" width="325" height="170" />
</p>
&nbsp;

### Go

<div style="text-align: justify"> Golang "Go" es un lenguaje de programación creado por Rober Griesemer, Rob Pike y Ken Thompson, desarrolladores de Google. Desarrollado con el propósito de adaptarse a las nuevas circunstancias tecnológicas, para sustituir aquellos viejos lenguajes de programación como C, que a pesar de ser de los lenguajes más rápidos, también es uno de los más antiguos y por lo que muchos de los paradigmas para los que fue diseñado, ya están obsoletos. En este proyecto fue utilizado en este proyecto para distintos propósitos los cuales fueron: implementación de un Load Tester, una REST API con conexión a CosmosDB & CloudSQL,una Cloud Function y un publisher para Google Pub/Sub.</div>
&nbsp;
<p align="center" >
  <img src="https://i.ibb.co/khDvtK7/golang-Programing.jpg" width="325" height="170" />
</p>
&nbsp;

### Rust

<div style="text-align: justify"> Rust es un lenguaje de programación moderno que se centra en la seguridad y el rendimiento de los subprocesos. A diferencia de muchos lenguajes de programación de nivel superior, no hay una recolección de basura ni una máquina virtual en Rust. En cambio, Rust aborda problemas conocidos de lenguajes de programación de bajo nivel establecidos desde hace mucho tiempo, como C o C ++. Al mismo tiempo, es conocido por su pronunciada curva de aprendizaje, lo que hace que muchos desarrolladores eviten profundizar en Rust. En este proyecto fue utilizado para distintos propósitos los cuales fueron: implementación de una REST API con conexión a CosmosDB & CloudSQL y un publisher para Google Pub/Sub.</div>
&nbsp;
<p align="center" >
  <img src="https://i.ibb.co/FD23FJz/rust.png" width="325" height="170" />
</p>
&nbsp;

### C

<div style="text-align: justify"> C es un lenguaje de nivel medio. Es el lenguaje de los compiladores, intérpretes, editores, sistemas operativos y programación embebida, el cual fue utilizado en este proyecto la implementación de módulos kernel.</div>
&nbsp;
<p align="center" >
  <img src="https://i.ibb.co/8cbRGWs/c-language.jpg" width="325" height="170" />
</p>
&nbsp;

### Javascript
<div style="text-align: justify"> Tradicionalmente JavaScript ha sido empleado para crear efectos y animaciones en la web. Sin embargo, con el paso del tiempo, ha vivido un gran desarrollo y sus funcionalidades se han ampliado enormemente Actualmente el uso más común de JavaScript es la programación de respuestas a eventos en un sitio web. En este proyecto fue utilizado para desarrollar una aplicación web con React.</div>
&nbsp;
<p align="center" >
  <img src="https://i.ibb.co/02GS2zX/js.jpg" width="325" height="170" />
</p>
&nbsp;

## Google Cloud Platform
<div style="text-align: justify"> Uno de los propósitos principales de este proyecto fue el de explorar e implementar diferentes servicios ofrecidos por Google, los cuales se detallan a continuación.</div>

---
### Cloud Functions

<div style="text-align: justify"> Cloud Functions es la solución FaaS (Functions as a service) de Google Cloud Platform. Lo bueno de este servicios es que pagarás únicamente por lo que utilices, es decir el tiempo que tu código se esté ejecutando, de manera que es ideal para soluciones pequeñas.  </div>
&nbsp;
<p align="center" >
  <img src="https://i.ibb.co/rZGHXtt/1cc70-ogp-cloud-functionsl-2.png" width="325" height="170" />
</p>
&nbsp;

### Cloud Run

<div style="text-align: justify"> Cloud Run es una plataforma de procesamiento administrada que le permite ejecutar contenedores sin estado que se pueden invocar a través de solicitudes HTTP. Cloud Run es una plataforma sin servidores. Dado que quita la complejidad de la administración de infraestructura, usted puede enfocarse en lo que más importa: compilar aplicaciones extraordinarias. </div>
&nbsp;
<p align="center" >
  <img src="https://i.ibb.co/8xRPdQW/cloud-run.jpg" width="325" height="170" />
</p>
&nbsp;

### Virtual Machines

<div style="text-align: justify"> Google Compute engine es un servicio de procesamiento seguro y personalizable que te permite crear y ejecutar máquinas virtuales en la infraestructura de Google. </div>
&nbsp;
<p align="center" >
  <img src="https://i.ibb.co/LPTBmT6/googlevm.jpg" width="325" height="170" />
</p>
&nbsp;

### App Engine

<div style="text-align: justify"> Google App Engine es una plataforma sin servidores y completamente administrada para desarrollar y alojar aplicaciones web a gran escala. </div>
&nbsp;
<p align="center" >
  <img src="https://i.ibb.co/3sP467H/appengine.jpg" width="325" height="170" />
</p>
&nbsp;

### Pub-Sub

<div style="text-align: justify"> Google Pub/Sub Pub/Sub permite crear sistemas de consumidores y productores de eventos, llamados publicadores y suscriptores </div>
&nbsp;
<p align="center" >
  <img src="https://i.ibb.co/0yj1bTw/googlepubsub.jpg" width="325" height="170" />
</p>
&nbsp;

### Load Balancer

<div style="text-align: justify"> Con Google Cloud Load Balancing se distribuyen los recursos informáticos con balanceo de cargas en una o varias regiones y cumple con de alta disponibilidad. Esta herramienta permite que la palicacion que administremos esté siempre disponible, y sea capaz de servir todas las peticiones a la máxima velocidad posible. </div>
&nbsp;
<p align="center" >
  <img src="https://i.ibb.co/wphWf8v/loadbalancer.jpg" width="400" height="290" />
</p>
&nbsp;

## Load Tester

### Locust

## Docker

## Docker compose

## Containerd

## Prometheus

## Grafana

## React

## Sockets-io

# Preguntas

# Screenshhots