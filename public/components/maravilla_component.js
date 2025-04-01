async function createMaravillaContainer(maravilla) {
  const container = document.createElement("div");

  const prevision = await obtenerPronosticoActual(
    maravilla.geo.latitude,
    maravilla.geo.longitude
  );

const template = `
        <div class="container my-5">
                        <!-- Título y descripción -->
                        <div class="row justify-content-center">
                                        <div class="col-lg-10 text-center">
                                                        <h2 class="mb-3" id="nombreMaravilla">
                                                                        ${maravilla.name}
                                                                        <i id="lector-ciegos" 
                                                                                 style="cursor: pointer;" 
                                                                                 onmouseover="this.style.color='#007bff'" 
                                                                                 onmouseout="this.style.color='inherit'" 
                                                                                 onClick="leerEnVozAlta(document.querySelector('#descripcion').innerText)" 
                                                                                 class="fas fa-volume-up me-4">
                                                                        </i>
                                                        </h2>
                                                        
                                                        <p id="descripcion" class="lead" style="font-size: 0.73rem;">${maravilla.description}</p>
                                        </div>
                        </div>
                        
                        <!-- Carrusel de imágenes -->
                        <div class="row justify-content-center my-5">
                                        <div class="col-lg-8">
                                                        <div class="active-works-carousel">
                                                                        ${Array.isArray(maravilla.image) ? maravilla.image.map(
                                                                                        (img, index) => `
                                                                                                                        <div class="item">
                                                                                                                                        <img class="img-fluid rounded shadow-sm" src="${img}" alt="${maravilla.name} - Imagen ${index + 1}" />
                                                                                                                                        <div class="caption text-center mt-3">
                                                                                                                                                        <h6 class="text-uppercase">
                                                                                                                                                                        <i class="fas fa-image me-1"></i>Foto ${index + 1}
                                                                                                                                                        </h6>
                                                                                                                                                        <p class="small">Imagen ${index + 1} de ${maravilla.name}</p>
                                                                                                                                        </div>
                                                                                                                        </div>
                                                                                                        `
                                                                                ).join("") : ""}
                                                        </div>
                                        </div>
                        </div>
                        
                        <!-- Información y Mapa -->
                        <div class="row">
                                        <!-- Clima actual -->
                                        <div class="col-lg-4 mb-4">
                                                        <div class="card border-0 shadow-sm">
                                                                        <div class="card-body">
                                                                                        <h3 class="mb-4">
                                                                                                        <i class="fas fa-cloud-sun me-2"></i>Clima actual
                                                                                        </h3>
                                                                                        <p><i class="fas fa-thermometer-half me-2"></i><strong>Temperatura:</strong> ${prevision.temperature}°C</p>
                                                                                        <p><i class="fas fa-cloud me-2"></i><strong>Estado:</strong> ${prevision.weather}</p>
                                                                                        <p><i class="fas fa-wind me-2"></i><strong>Viento:</strong> ${prevision.windspeed} km/h, ${prevision.winddirection}°</p>
                                                                        </div>
                                                        </div>
                                        </div>
                                        
                                        <!-- Info Adicional y Mapa -->
                                        <div class="col-lg-8">
                                                        <div class="card border-0 shadow-sm mb-4">
                                                                        <div class="card-body">
                                                                                        ${maravilla.telephone !== "None"
                                                                                                ? `<p><i class="fas fa-phone me-2"></i><strong>Teléfono:</strong> <a href="tel:${maravilla.telephone}">${maravilla.telephone}</a></p>`
                                                                                                : ""
                                                                                        }
                                                                                        <p><i class="fas fa-map-marker-alt me-2"></i><strong>Dirección:</strong> ${maravilla.address.streetAddress}, ${maravilla.address.postalCode} ${maravilla.address.addressLocality}</p>
                                                                                        <p><i class="fas fa-universal-access me-2"></i><strong>Acceso público:</strong> ${maravilla.publicAccess ? "Sí" : "No"}</p>
                                                                                        <p><i class="fas fa-ticket-alt me-2"></i><strong>Entrada gratuita:</strong> ${maravilla.isAccessibleForFree ? "Sí" : "No"}</p>
                                                                                        ${maravilla.url
                                                                                                ? `<p><i class="fas fa-globe me-2"></i><strong>Sitio web:</strong> <a href="${maravilla.url}" target="_blank">${maravilla.url}</a></p>`
                                                                                                : ""
                                                                                        }
                                                                                        
                                                                                        <!-- Horarios -->
                                                                                        ${Array.isArray(maravilla.openingHoursSpecification)
                                                                                                ? `
                                                                                                                                        <div class="horarios mt-4">
                                                                                                                                                        <h4 class="mb-3">
                                                                                                                                                                        <i class="fas fa-clock me-2"></i>Horarios
                                                                                                                                                        </h4>
                                                                                                                                                        ${maravilla.openingHoursSpecification
                                                                                                                                                                .map(
                                                                                                                                                                        (horario) => `
                                                                                                                                                                                                        <p>
                                                                                                                                                                                                                        <i class="far fa-calendar-alt me-1"></i>
                                                                                                                                                                                                                        ${Array.isArray(horario.dayOfWeek)
                                                                                                                                                                                                                                ? horario.dayOfWeek.join(", ")
                                                                                                                                                                                                                                : horario.dayOfWeek
                                                                                                                                                                                                                        }: ${horario.opens} - ${horario.closes}
                                                                                                                                                                                                                        ${horario.validFrom
                                                                                                                                                                                                                                ? `(Válido desde ${horario.validFrom} hasta ${horario.validThrough})`
                                                                                                                                                                                                                                : ""
                                                                                                                                                                                                                        }
                                                                                                                                                                                                        </p>
                                                                                                                                                                                        `
                                                                                                                                                                )
                                                                                                                                                                .join("")}
                                                                                                                                        </div>
                                                                                                                        `
                                                                                                : `
                                                                                                                                        <p class="mt-4">
                                                                                                                                                        <i class="fas fa-clock me-2"></i><strong>Horario:</strong> ${maravilla.openingHoursSpecification.opens} - ${maravilla.openingHoursSpecification.closes}
                                                                                                                                        </p>
                                                                                                                        `
                                                                                        }
                                                                        </div>
                                                        </div>
                                                        
                                                        <!-- Mapa -->
                                                        <div class="card border-0 shadow-sm">
                                                                        <div class="card-body p-0">
                                                                                        <div id="map" style="width: 100%; height: 400px;" class="rounded"></div>
                                                                        </div>
                                                        </div>
                                        </div>
                        </div>
        </div>
`;

  container.innerHTML = template;

  setTimeout(() => {
    initializeOwlCarousel();
  }, 100);

  await crearMapa(
    container.querySelector("#map"),
    maravilla.geo.latitude,
    maravilla.geo.longitude,
    maravilla.name,
    false
  );

  return container;
}
