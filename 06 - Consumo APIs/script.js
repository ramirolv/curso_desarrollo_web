const contenedor = document.getElementById("container");
const boton     = document.getElementById("miBoton");

boton.addEventListener('click', async () => {
  // Limpiar galería antes de cargar
  contenedor.innerHTML = '';

  try {
    const response = await fetch('https://api.thecatapi.com/v1/images/search?limit=12');
    const data     = await response.json();

    data.forEach(({ url }) => {
      // Crear tarjeta
      const tarjeta = document.createElement('div');
      tarjeta.classList.add('gallery-item');

      // Imagen
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Gatito adorable';
      tarjeta.appendChild(img);

      // Añadir al contenedor
      contenedor.appendChild(tarjeta);
    });
  } catch (error) {
    console.error('Error al cargar las imágenes:', error);
  }
});
