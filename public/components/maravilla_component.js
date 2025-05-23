async function obtenerExcursionesCercanas(latitud, longitud, maxResults = 5) {
        const response = await fetch(
                `https://www.explorarmallorca.com/json/excursiones.json`
        );
        const data = await response.json();

        // Haversine formula para calcular distancia en km
        const toRad = angle => (angle * Math.PI) / 180;
        function haversine(lat1, lon1, lat2, lon2) {
                const R = 6371; // radio de la tierra en km
                const dLat = toRad(lat2 - lat1);
                const dLon = toRad(lon2 - lon1);
                const a =
                        Math.sin(dLat / 2) ** 2 +
                        Math.cos(toRad(lat1)) *
                                Math.cos(toRad(lat2)) *
                                Math.sin(dLon / 2) ** 2;
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return R * c;
        }

        // Extraer lista de lugares
        const lugares = Array.isArray(data.itemListElement)
                ? data.itemListElement
                : data;

        // Calcular distancia de cada sitio al punto dado
        const resultados = lugares
                .map(item => {
                        const geo = item.containedInPlace.geo;
                        const lat = parseFloat(geo.latitude);
                        const lon = parseFloat(geo.longitude);
                        const dist = haversine(latitud, longitud, lat, lon);
                        return {
                                id: item["@identifier"],
                                name: item.name,
                                latitude: lat,
                                longitude: lon,
                                distance: dist
                        };
                })
                .sort((a, b) => a.distance - b.distance) // ordenar ascendente
                .slice(0, maxResults);                 // tomar los más cercanos

        return resultados;
}

async function obtenerRestaurantesyComidasCercanas() {

        const response = await fetch(
                `/JSONs/receptesBonMenjar.json`
        );
        const data = await response.json();

        // Dentro de obtenerRestaurantesyComidasCercanas()
        const graph = data['@graph']
        if (!Array.isArray(graph) || !graph.length) return []

        // El JSON que recibes tiene un solo elemento en @graph, cuyo valor es un objeto con claves "recipe-1", "recipe-2", …
        const recetasObj = graph[0]

        // Convertimos ese objeto en un array más manejable
        const recetas = Object.entries(recetasObj).map(([key, r]) => ({
                id: key,
                name: r.name,
                image: r.image,
                description: r.description,
                category: r.recipeCategory,
                cuisine: r.recipeCuisine,
                totalTime: r.totalTime,
                yield: r.recipeYield,
                ingredients: Array.isArray(r.recipeIngredient) ? r.recipeIngredient : [],
                instructions: Array.isArray(r.recipeInstructions)
                        ? r.recipeInstructions.map(step => step.text)
                        : [],
                nutrition: r.nutrition || {},
                restaurants: (Array.isArray(r.subjectOf) ? r.subjectOf : [r.subjectOf]).map(rest => ({
                        name: rest.name,
                        address: `${rest.address.streetAddress}, ${rest.address.addressLocality}`,
                        coords: {
                                lat: rest.geo.latitude,
                                lon: rest.geo.longitude
                        }
                }))
        }))

        return recetas
        
}

async function createMaravillaContainer(maravilla) {
        const container = document.createElement("div");

        

        const prevision = await obtenerPronosticoActual(
                maravilla.geo.latitude,
                maravilla.geo.longitude,
        );

        const excursionesCercanas = await obtenerExcursionesCercanas(
                maravilla.geo.latitude,
                maravilla.geo.longitude,
                5,
        );

        const restaurantesCercanos = await obtenerRestaurantesyComidasCercanas();


        // ---- al principio de tu fichero ----
        function renderHeader({ name, description }) {
                return `
                        <div class="row justify-content-center">
                                <div class="col-lg-10 text-center">
                                        <h2 class="mb-3">
                                                ${name}
                                                <div id="lector-container"></div>
                                        </h2>
                                        <p id="descripcion" class="lead" style="font-size:0.73rem;">
                                                ${description}
                                        </p>
                                </div>
                        </div>
                        <div id="estrellas" class="center"></div>
                `;
        }

        function renderCarousel(images = [], name) {
                // Asegurar que siempre sea un array
                if (!Array.isArray(images)) {
                        images = images ? [images] : [];
                }
                if (!images.length) return '';
                return `
                        <div class="row justify-content-center my-5">
                                <div class="col-lg-8">
                                        <div class="active-works-carousel">
                                                ${images
                                                        .map(
                                                                (img, i) => `                                                <div class="item">
                                                                <img
                                                                        class="img-fluid rounded shadow-sm"
                                                                        src="${img}"
                                                                        alt="${name} - Imagen ${i + 1}"
                                                                        loading="lazy"
                                                                        width="800"
                                                                        height="600"
                                                                />
                                                                <div class="caption text-center mt-3">
                                                                        <h6 class="text-uppercase">
                                                                                <i class="fas fa-image me-1" aria-hidden="true"></i>Foto ${i + 1}
                                                                        </h6>
                                                                        <p class="small">Imagen ${i + 1} de ${name}</p>
                                                                </div>
                                                        </div>
                                                `
                                                        )
                                                        .join('')}
                                        </div>
                                </div>
                        </div>
                `;
        }

        function renderWeatherSection({ temperature, weather, windspeed, winddirection }) {
                return `
                        <div class="card border-0 shadow-sm mb-4">
                                <div class="card-body">
                                        <h3><i class="fas fa-cloud-sun me-2"></i>Clima actual</h3>
                                        <hr>
                                        <p><i class="fas fa-thermometer-half me-2"></i><strong>Temperatura:</strong> ${temperature}°C</p>
                                        <p><i class="fas fa-cloud me-2"></i><strong>Estado:</strong> ${weather}</p>
                                        <p><i class="fas fa-wind me-2"></i><strong>Viento:</strong> ${windspeed} km/h, ${winddirection}°</p>
                                </div>
                        </div>
                `;
        }

        function renderExcursionsSection(excursiones = []) {
                const items = excursiones
                        .map(
                                ex => `
                        <p>
                                <i class="fas fa-map-marker-alt me-2"></i>
                                <strong>${ex.name}</strong> – ${ex.distance.toFixed(2)} km
                        </p>
                `
                        )
                        .join('');
                return `
                        <div class="card border-0 shadow-sm mb-4">
                                <div class="card-body">
                                        <h3><i class="fas fa-route me-2"></i>Excursiones cercanas</h3>
                                        <hr>
                                        ${items || '<p>No hay excursiones cercanas disponibles.</p>'}
                                </div>
                        </div>
                `;
        }

        function renderInfoSection(m) {
                return `
                        <div class="card border-0 shadow-sm mb-4">
                                <div class="card-body">
                                        ${m.telephone !== 'None'
                                                ? `<p><i class="fas fa-phone me-2"></i><strong>Teléfono:</strong> <a href="tel:${m.telephone}">${m.telephone}</a></p>`
                                                : ''}
                                        <p><i class="fas fa-map-marker-alt me-2"></i>
                                                 <strong>Dirección:</strong>
                                                 ${m.address.streetAddress}, ${m.address.postalCode} ${m.address.addressLocality}
                                        </p>
                                        <p><i class="fas fa-universal-access me-2"></i>
                                                 <strong>Acceso público:</strong> ${m.publicAccess ? 'Sí' : 'No'}
                                        </p>
                                        <p><i class="fas fa-ticket-alt me-2"></i>
                                                 <strong>Entrada gratuita:</strong> ${m.isAccessibleForFree ? 'Sí' : 'No'}
                                        </p>
                                        ${m.url
                                                ? `<p><i class="fas fa-globe me-2"></i><strong>Sitio web:</strong>
                                                                 <a href="${m.url}" target="_blank">${m.url}</a>
                                                         </p>`
                                                : ''}
                                </div>
                        </div>
                `;
        }

        function renderScheduleSection(spec) {
                if (Array.isArray(spec)) {
                        return `
                                <div class="card border-0 shadow-sm mb-4">
                                        <div class="card-body">
                                                <h4><i class="fas fa-clock me-2"></i>Horarios</h4>
                                                <hr>
                                                ${spec
                                                        .map(
                                                                s => `
                                                        <p>
                                                                <i class="far fa-calendar-alt me-1"></i>
                                                                ${Array.isArray(s.dayOfWeek) ? s.dayOfWeek.join(', ') : s.dayOfWeek}:
                                                                ${s.opens} - ${s.closes}
                                                                ${s.validFrom ? `(Válido ${s.validFrom} a ${s.validThrough})` : ''}
                                                        </p>
                                                `
                                                        )
                                                        .join('')}
                                        </div>
                                </div>
                        `;
                } else if (spec.opens && spec.closes) {
                        return `
                                <div class="card border-0 shadow-sm mb-4">
                                        <div class="card-body">
                                                <p>
                                                        <i class="fas fa-clock me-2"></i>
                                                        <strong>Horario:</strong> ${spec.opens} - ${spec.closes}
                                                </p>
                                        </div>
                                </div>
                        `;
                }
                return '';
        }


        function haversine(lat1, lon1, lat2, lon2) {
                const R = 6371; // radio de la tierra en km
                const dLat = (lat2 - lat1) * (Math.PI / 180);
                const dLon = (lon2 - lon1) * (Math.PI / 180);
                const a =
                        Math.sin(dLat / 2) ** 2 +
                        Math.cos(lat1 * (Math.PI / 180)) *
                                Math.cos(lat2 * (Math.PI / 180)) *
                                Math.sin(dLon / 2) ** 2;
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return R * c;
        }

        // dentro de createMaravillaContainer, reemplaza $SELECTION_PLACEHOLDER$ por esto:

        function renderRestaurantsSection(restaurantes = [], origen) {
                if (!Array.isArray(restaurantes) || !restaurantes.length) {
                        return `
                        <div class="card border-0 shadow-sm mb-4">
                                <div class="card-body">
                                        <h3><i class="fas fa-utensils me-2"></i>Restaurantes cercanos</h3>
                                        <hr>
                                        <p>No hay restaurantes cercanos disponibles.</p>
                                </div>
                        </div>
                        `;
                }

                // Eliminar duplicados
                const uniqueRestaurantes = Array.from(
                        new Set(
                                restaurantes.map(r => r.restaurants.map(rest => rest.name)).flat()
                        )
                ).map(name => {
                        return restaurantes.find(r =>
                                r.restaurants.some(rest => rest.name === name)
                        );
                });


                const items = uniqueRestaurantes
                        .map(rec => {
                                // Para cada receta, obtenemos los restaurantes
                                // y calculamos la distancia a la ubicación de origen
                                // (latitud y longitud)
                                // y luego generamos el HTML para cada restaurante
                                // usando haversine para calcular la distancia
                                // entre el origen y el restaurante.
                                // Nota: asumiendo que rec.restaurants es un array
                        // cada receta puede tener varios restaurantes:
                        return rec.restaurants.map(r => {
                                const dist = haversine(
                                        origen.lat,
                                        origen.lon,
                                        parseFloat(r.coords.lat),
                                        parseFloat(r.coords.lon)
                                );
                                return `
                                        <p>
                                                <i class="fas fa-utensils me-2"></i>
                                                <strong>${r.name}</strong> - ${dist.toFixed(2)} km
                                        </p>
                                `;
                        }).join('');
                }).join('');

                return `
                        <div class="card border-0 shadow-sm mb-4">
                                <div class="card-body">
                                        <h3><i class="fas fa-utensils me-2"></i>Restaurantes cercanos</h3>
                                        <hr>
                                        ${items}
                                </div>
                        </div>
                `;
        }

                // ---- reemplaza tu $SELECTION_PLACEHOLDER$ por esto ----
                const jsonLd = JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "TouristAttraction",
                        "name": maravilla.name,
                        "description": maravilla.description,
                        "image": maravilla.image,
                        "geo": {
                                "@type": "GeoCoordinates",
                                "latitude": maravilla.geo.latitude,
                                "longitude": maravilla.geo.longitude
                        },
                        "address": {
                                "@type": "PostalAddress",
                                "streetAddress": maravilla.address.streetAddress,
                                "addressLocality": maravilla.address.addressLocality,
                                "postalCode": maravilla.address.postalCode,
                                "addressCountry": "ES"
                        },
                        "telephone": maravilla.telephone !== 'None' ? maravilla.telephone : undefined,
                        "url": maravilla.url,
                        "publicAccess": maravilla.publicAccess,
                        "isAccessibleForFree": maravilla.isAccessibleForFree,
                        "openingHoursSpecification": maravilla.openingHoursSpecification,
                        "aggregateRating": maravilla.aggregateRating
                }, null, 2);

                const html = `
                        <div class="container my-5">
                                ${renderHeader(maravilla)}
                                ${renderCarousel(maravilla.image, maravilla.name)}
                                <script type="application/ld+json">
                                        ${jsonLd}
                                </script>
                                <div class="row">
                                        <div class="col-lg-4">
                                                ${renderWeatherSection(prevision)}
                                                ${renderExcursionsSection(excursionesCercanas)}
                                                ${renderRestaurantsSection(restaurantesCercanos, {
                                                        lat: maravilla.geo.latitude,
                                                        lon: maravilla.geo.longitude
                                                })}
                                        </div>                                <div class="col-lg-8">
                                                ${renderInfoSection(maravilla)}
                                                ${renderScheduleSection(maravilla.openingHoursSpecification)}
                                                <div class="card border-0 shadow-sm lazy-load-map">
                                                        <div class="card-body p-0">
                                                                <div class="map-container rounded" style="width:100%;height:400px;" data-lat="${maravilla.geo.latitude}" data-lon="${maravilla.geo.longitude}" data-name="${maravilla.name}"></div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                `;

                container.innerHTML = html;

        

        // Obtenemos el contenedor estrellas
        const contenedorEstrellas = container.querySelector("#estrellas");
        // Creamos las estrellas y las añadimos al contenedor
        mostrarEstrellas(maravilla.aggregateRating.ratingValue, contenedorEstrellas);        // La carga del mapa ahora se maneja mediante lazy-loading
        // El mapa se cargará cuando el usuario lo vea en pantalla

        // Respaldo: Si el lazy loading falla, intentamos cargar el mapa directamente después de un tiempo
        setTimeout(() => {
            const mapContainer = container.querySelector('.map-container');
            if (mapContainer && !mapContainer.hasChildNodes()) {
                // Si el contenedor del mapa está vacío después de un tiempo, cargamos el mapa directamente
                crearMapa(mapContainer, maravilla.geo.latitude, maravilla.geo.longitude, maravilla.name, true);
            }
        }, 2000);

        // Obtenemos el contenedor de lector
        const lectorContainer = container.querySelector("#lector-container");
        // Creamos el componente lector y lo añadimos al contenedor
        createLectorComponent(maravilla.description, lectorContainer);

        setTimeout(() => {
                initializeOwlCarousel();
        }, 100);

        return container;
}
