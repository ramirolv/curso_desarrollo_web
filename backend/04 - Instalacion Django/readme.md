# pip (Manejador de paquetes)
# venv (Entorno virtual de python)

# Crear entorno de python
python3 -m venv ".venv" # Linux y MacOS
py -m venv ".venv" # Windows

# Activar entorno
source .venv/bin/activate # Linux y MacOS
.venv\Script\activate # Windows

# Instalamos Django
pip install django

# Crear proyecto
django-admin startproject "miProyecto"

# Crear aplicación
django-admin startapp "app1"

# Ejecutar una aplicación django
python3 manage.py runserver # Linux y MacOS
py manage.py runserver # Windows

# Configurar settings.py
## Configuración de lenguaje y región
## Configuración de bases de datos
## Configuración de aplicaciones
## Otras configuraciones

# Configurar el nombre de las app.py

# Configurar las rutas del proyecto y las aplicaciones

# Agregamos Vistas

# Agregamos Templates

# Agregamos rutas