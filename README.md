# ACME-Explorer
Proyecto Acme Explorer de la asignatura Arquitecturas para Software como Servicio

### Estructura de carpetas del Servidor
```sh 
+--- api/ 
| +--- controllers/
| | └── ActorController.js	   // Logística de la api con el documento Actor
| +--- models/                 // Contiene los documentos y esquemas de la BD de MongoDB
| | └── ActorModel.js     // Modelo de actor
| +--- routes/                 // Endpoints
| | └── actorRoutes.js		   // Endpoints de Actor
| └── app.js			       // Inicialicación del server de API y de MongoDB
|--- .gitignore             // En este fichero se especifica las carpetas o ficheros que no queremos subir al repositorio de git
|-- package-lock.json
|-- package.json
|-- README.md
```