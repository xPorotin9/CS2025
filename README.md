# Sistema de Matrículas de Alumnos API

API backend desarrollada con Express y PostgreSQL para la gestión completa de matrículas de alumnos en un entorno educativo.

## Descripción

Este sistema proporciona una API RESTful para la gestión completa de matrículas de alumnos, incluyendo administración de facultades, escuelas, planes de estudio, cursos, docentes, alumnos, periodos académicos, secciones, horarios, matrículas y pagos.

## Características

- Autenticación con JWT (JSON Web Tokens)
- Operaciones CRUD para 15 entidades relacionadas
- Validaciones de datos y relaciones entre entidades
- Transacciones para garantizar la integridad de los datos
- Documentación interactiva con Swagger (OpenAPI 3.0)
- Colección de Postman para pruebas

## Requisitos

- Node.js (v14.x o superior)
- PostgreSQL (v12.x o superior)
- npm o yarn

## Instalación

1. **Clonar el repositorio**

```bash
git clone git clone https://github.com/JhosepLS/CS2025.git
cd Matriculas
```

2. **Instalar dependencias**

```bash
npm install

npm install --save-dev swagger-autogen
```

3. **Configuración de base de datos**

Asegúrate de tener PostgreSQL instalado y corriendo. Luego, crea la base de datos:

```bash
# Usando pgAdmin:
# 1. Abrir pgAdmin
# 2. Conectarse al servidor PostgreSQL
# 3. Clic derecho en Databases -> Create -> Database
# 4. Nombre: matriculas_db
# 5. Guardar
```

4. **Configurar variables de entorno**

El archivo `.env` ya está incluido en el repositorio para facilitar la configuración inicial. Sin embargo, es recomendable cambiar las credenciales si se utiliza en un entorno de producción.

```
PORT=3000
DB_HOST=localhost
DB_USER=postgres    # Cambia esto por tu usuario de PostgreSQL
DB_PASSWORD=admin    # Cambia esto por tu contraseña de PostgreSQL
DB_NAME=matriculas_db
DB_PORT=5432
JWT_SECRET=alt0yeyo    # Cambia esto en producción
```

## Configuración

### Inicializar la base de datos con datos de prueba

```bash
npm run init-db
```

Si encuentras un error con la autenticación de PostgreSQL, sigue estos pasos:

1. Crea un usuario 'admin' en PostgreSQL:
   - Abre pgAdmin y conéctate como usuario postgres
   - Navega a Login/Group Roles, clic derecho -> Create -> Login/Group Role
   - Nombre: admin
   - Pestaña Definition: Contraseña: admin
   - Pestaña Privileges: Activa "Can login?" y "Superuser?"
   - Guardar

2. Alternativamente, puedes modificar el archivo .env para usar tu usuario existente:

```
DB_USER=tu_usuario_existente
DB_PASSWORD=tu_contraseña
```
## Ejecución

### Iniciar el servidor en modo desarrollo

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3000` por defecto.

## Documentación de la API

### Generar documentación Swagger

```bash
npm run swagger-autogen
```

### Acceder a la documentación

Una vez que el servidor esté en ejecución, puedes acceder a la documentación Swagger en:

```
http://localhost:3000/api-docs
```

## Pruebas

### Generar colección Postman

Para generar la colección de Postman con todas las peticiones necesarias para probar la API:

```bash
node src/utils/generatePostmanCollection.js
```

Esto generará un archivo `matriculas_api_collection.json` en la carpeta `src/utils/` que puedes importar en Postman.

### Importar colección en Postman

1. Abrir Postman
2. Hacer clic en "Import" en la esquina superior izquierda
3. Arrastrar el archivo generado o hacer clic en "Upload Files" y seleccionarlo
4. Hacer clic en "Import"

### Configurar ambiente en Postman

1. Hacer clic en "Environments" en el panel lateral izquierdo
2. Hacer clic en "+" para crear un nuevo ambiente
3. Nombrar el ambiente (por ejemplo, "Matrículas API")
4. Añadir la variable `base_url` con el valor `http://localhost:3000/api`
5. Guardar el ambiente
6. Seleccionar el ambiente que acabas de crear en el desplegable superior derecho de Postman

### Flujo de pruebas

La colección incluye una carpeta "16. Flujo Completo" que contiene un conjunto de peticiones organizadas para probar el sistema de principio a fin, siguiendo este flujo:

1. Configuración inicial (facultades, escuelas, planes, cursos)
2. Configuración de periodo académico
3. Gestión de usuarios (docentes, alumnos)
4. Configuración de clases (secciones, horarios)
5. Proceso de matrícula
6. Reportes y consultas