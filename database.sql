CREATE DATABASE IF NOT EXISTS portafolio_andy;
USE portafolio_andy;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(50) NOT NULL UNIQUE,
  clave VARCHAR(255) NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  rol VARCHAR(30) NOT NULL DEFAULT 'admin',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  descripcion TEXT
);

CREATE TABLE actividades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  curso_id INT NOT NULL,
  unidad INT NOT NULL,
  semana INT NOT NULL,
  titulo VARCHAR(180) NOT NULL,
  descripcion TEXT NOT NULL,
  enlace VARCHAR(255),
  fecha DATE NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

CREATE TABLE archivos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  actividad_id INT NOT NULL,
  nombre_archivo VARCHAR(180) NOT NULL,
  tipo_archivo VARCHAR(80),
  ruta_archivo VARCHAR(255) NOT NULL,
  subido_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (actividad_id) REFERENCES actividades(id) ON DELETE CASCADE
);

INSERT INTO usuarios (usuario, clave, nombre, rol)
VALUES ('admin', '12345', 'Estrada Ramos Andy', 'admin');

INSERT INTO cursos (nombre, descripcion)
VALUES
('Algoritmos', 'Curso orientado al desarrollo de lógica, estructuras y solución de problemas.'),
('Aplicaciones', 'Curso orientado al desarrollo de interfaces, aplicaciones web y evidencias digitales.');
