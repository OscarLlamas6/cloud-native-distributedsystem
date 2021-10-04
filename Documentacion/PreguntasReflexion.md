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

- [Preguntas](#preguntas)
    - [Pregunta 1](#pregunta-1)
    - [Pregunta 2](#pregunta-2)
    - [Pregunta 3](#pregunta-3)
    - [Pregunta 4](#pregunta-4)
    - [Pregunta 5](#pregunta-5)
    - [Pregunta 6](#pregunta-6)

---

# Preguntas

## Pregunta 1

<div style="text-align: justify"><b> ¿Qué generador de tráfico (Load Tester) es más rápido? ¿Qué diferencias hay entre las implementaciones de los generadores de tráfico?</b> </div>
&nbsp;
<div style="text-align: justify"> La implementación de cada uno de los Load Testers utilizados en este proyecto (Golang, Python y Locust) fue distinta. En el caso de los generadores de tráfico con Golang y Python se utilizaron librerias nativas de cada lenguaje para desarrollar el Load Tester; Locust, a diferencia de los dos anteriores, al ser una libreria ya definida ofrece más bondades a la hora de realizar y configurar un generador de tráfico, como por ejemplo un dashboard con gráficas e información detallada durante el proceso de load testing.</div>
&nbsp;
<p align="center" >
  <img src="https://i.ibb.co/71B2vB1/image.png" width="450" height="250" />
</p>
<div style="text-align: center"> Ejemplo de gráfica proporcionada por la libreria Locust.</div>
&nbsp;
<div style="text-align: justify"> Con un testeo de 20 de datos insertados, el generador más rápido resultó ser el de Golang el cual realizó las 20 peticiones en 36 segundos.. A continuación se muestran los diferentes resultados de cada Load Tester. </div>

&nbsp;

- Load Tester Golang: 20 peticiones en 36 segundos.
<p align="center" >
  <img src="https://i.ibb.co/m0YkDDv/image.png" width="450" height="250" />
</p>
&nbsp;

- Load Tester Python: 20 peticiones en 37 segundos.
<p align="center" >
  <img src="https://i.ibb.co/rdpSYk9/image.png" width="450" height="250" />
</p>
&nbsp;

- Load Tester Locust: 20 peticiones en 41 segundos.
<p align="center" >
  <img src="https://i.ibb.co/9GG2bnm/image.png" width="450" height="250" />
</p>
&nbsp;


## Pregunta 2

<div style="text-align: justify"><b> ¿Qué lenguaje de programación utilizado para las APIs fue más óptimo con relación al tiempo de respuesta entre peticiones? ¿Qué lenguaje tuvo el performance menos óptimo?</b></div>
&nbsp;
<div style="text-align: justify"> Para responder esta pregunta, se realizaron peticiones con cada API (Golang, Python y Rust) en la misma máquina (VM con Docker instalado en Centos). Los resultados fueron los siguientes: </div>
&nbsp;

- API Golang: 1,435 milisegundos
<p align="center" >
  <img src="https://i.ibb.co/dMBs21M/image.png" width="750" height="400" />
</p>
&nbsp;
&nbsp;

- API Python: 1,591 milisegundos
<p align="center" >
  <img src="https://i.ibb.co/xFn83Fr/image.png" width="750" height="400" />
</p>
&nbsp;
&nbsp;

- API Rust: 3.09 segundos
<p align="center" >
  <img src="https://i.ibb.co/Q9Qs9XY/image.png" width="750" height="400" />
</p>
&nbsp;

<div style="text-align: justify"> En conclusión la API con mejor desempeño fue la de Golang con un tiempo de 1,435 milisegundos y por el contrario la que tuvo el peor desempeño fue la API de Rust con un tiempo de 3.09 segundos, más del doble que la API de Golang. </div>
&nbsp;

## Pregunta 3

<div style="text-align: justify"><b> ¿Cuál de los servicios de Google Cloud Platform fue de mejor para la implementación de las APIs? ¿Cuál 
fue el peor? ¿Por qué?</b></div>
&nbsp;
<div style="text-align: justify"> Para responder esta pregunta, se tomó como base la API de Golang, la cual fue la que tuvo mejor desempeño en comparación con Python y Rust. Se hicieron peticiones con la misma API implementada con los distintos servicios de Google Cloud Platform (VM, Cloud Functions y Cloud Run). Los resultados son los siguientes: </div>
&nbsp;

- API Golang en VM con Docker en Centos: 1,435 milisegundos
<p align="center" >
  <img src="https://i.ibb.co/dMBs21M/image.png" width="750" height="400" />
</p>
&nbsp;

- API Golang en VM con Debian: 1,375 milisegundos
<p align="center" >
  <img src="https://i.ibb.co/fG3Dfqy/image.png" width="750" height="400" />
</p>
<div style="text-align: center">  </div>
&nbsp;

- API Golang en VM con ContainerD en Ubuntu: 1,369 milisegundos
<p align="center" >
  <img src="https://i.ibb.co/kGtmq82/image.png" width="750" height="400" />
</p>
<div style="text-align: center">  </div>
&nbsp;

- API Golang en Google Cloud Run: 1,520 milisegundos
<p align="center" >
  <img src="https://i.ibb.co/dfTwVD1/image.png" width="750" height="400" />
</p>
<div style="text-align: center">  </div>
&nbsp;

- API Golang en Google Cloud Functions: 2.39 segundos
<p align="center" >
  <img src="https://i.ibb.co/4tbJ8Fg/image.png" width="750" height="400" />
</p>
<div style="text-align: center">  </div>
&nbsp;

<div style="text-align: justify"> En conclusión, basandonos en los resultados del tiempo de respuesta de una API de Golang implementada en los diversos servicios de Google Cloud Platform, el que tuvo mejor desempeño mejor fue el de Compute Engine: Virtual Machine. Por otro lado el servicio FaaS, Google Cloud Functions, tuvo el peor desempeño de todos ya que el mismo trabajo le llevo aproximadamente el doble del tiempo que la API de Golang con ContainerD en Ubuntu.</div>
&nbsp;

## Pregunta 4

<div style="text-align: justify"><b> ¿Considera que es mejor utilizar Containerd o Docker y por qué?</b></div>
&nbsp;
<div style="text-align: justify"> Basándonos en los resultados de la pregunta anterior, la implementación con ContainerD realizó la misma tarea en un menor tiempo a comparación de Docker. Sin embargo considerando varios factores como por ejemplo, el cambio de SO, la varianza que existe en el tiempo de respuesta, etc., consideramos que Docker sigue siendo una mejor alternativa a la hora de buscar una implementación con una buena relación "desempeño"-"facilidad de uso". En conclusión en cuanto a performance ContainerD demostró poder ser más rápido que Docker, sin embargo la amplia documentación y facilidad de uso hace a Docker una mejor apuesta.</div>
&nbsp;

## Pregunta 5

<div style="text-align: justify"><b> ¿Qué base de datos tuvo la menor latencia entre respuestas y soportó más carga en un determinado momento? ¿Cuál de las dos recomendaría para un proyecto de esta índole?</b></div>
&nbsp;
<div style="text-align: justify"> A continuación se muestran gráficas del proceso de trabajo realizado por ambas bases de datos utilizadas, CloudSQL y CosmosDb, en donde podemos observar que ambas BDs realizaron el trabajo sin ningun problema.</div>
&nbsp;

- MySQL version 8 en Google Cloud SQL
<p align="center" >
  <img src="https://i.ibb.co/72KMpF3/image.png" width="675" height="250" />
</p>
<div style="text-align: center">  </div>
&nbsp;

- API de MongoDB en Microsoft Azure CosmosDB
<p align="center" >
  <img src="https://i.ibb.co/TYDFqcc/image.png" width="500" height="250" />
</p>
<div style="text-align: center">  </div>
&nbsp;

<div style="text-align: justify"> En conclusión ambas bases de datos tienen un performance similar, cumpliendo con la demanda del proyecto. En cuanto a la interrogante de cuál DB usar en un proyecto como este consideramos que al ser solo tweets los que se necesitan almacenar una base de datos no relacional funciona perfectamente por lo tanto en este caso apostariamos por la CosmosDB y su API de MongoDB.</div>
&nbsp;

## Pregunta 6

<div style="text-align: justify"><b> ¿Considera de utilidad la utilización de Prometheus y Grafana para crear dashboards? ¿Por qué?
</b></div>
&nbsp;
<div style="text-align: justify"> Si, debido a que grafana provee un interfaz amigable e intuitiva, además, de que la configuración para generar los dashboard es sencilla, y al integrarlo junto con prometheus permite que agregar una fuente de datos sea eficiente y los datos se puedan obtener en tiempo real.
</div>
&nbsp;

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

