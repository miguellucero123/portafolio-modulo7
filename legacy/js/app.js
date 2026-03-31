/**
 * ClimaTorre - Torres del Paine Weather App
 * Main Application Logic
 * Module 5 - Portafolio (POO + ES6+)
 * Refactorizado para usar Programación Orientada a Objetos
 */

// Inicializar clases principales con ES6+
const apiClient = new ApiClient();
const weatherApp = new WeatherApp(apiClient);

// Variables de mapa
let map = null;
let mapInitialized = false;
let windLayer = null; // Capa de viento
let windLayerEnabled = false; // Estado de la capa de viento
const TORRES_DEL_PAINE = [-51.0000, -73.2300];

// Variables de gráficos
let forecastChart = null;
let currentStatsCity = null;

// Variables del mapa detallado de Torres del Paine
let torresMap = null;
let torresMapInitialized = false;
let torresWeatherData = [];

// Variable para el modelo meteorológico seleccionado
let modeloSeleccionado = 'auto'; // 'auto', 'ecmwf_ifs025', 'gfs_graphcast025', 'icon_global'

/**
 * Inicializar aplicación cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', async function () {
    console.log('ClimaTorre App inicializado (Módulo 5 - POO + ES6+)');

    // Cargar configuración de ciudades
    if (typeof CIUDADES_CONFIG !== 'undefined') {
        weatherApp.cargarLugares(CIUDADES_CONFIG);
    }

    // Cargar datos de clima desde la API
    try {
        await weatherApp.cargarDatosClima();
    } catch (error) {
        console.error('Error inicializando datos:', error);
        mostrarMensajeError('Error al cargar datos meteorológicos. Intenta recargar la página.');
    }

    // Escuchar actualizaciones de datos
    window.addEventListener('weatherUpdated', (e) => {
        updateUI(e.detail.timestamp);
    });

    // Render inicial
    const ultimaActualizacion = weatherApp.obtenerUltimaActualizacion();
    if (ultimaActualizacion) {
        updateUI(ultimaActualizacion);
    }

    setupNavigation();

    // Configurar selector de modelos
    setupModelSelector();

    // Configurar actualización automática cada 4 horas
    setupAutoUpdate();
});

/**
 * Configurar selector de modelos meteorológicos
 */
function setupModelSelector() {
    const modelButtons = document.querySelectorAll('#modelSelector .model-btn');

    modelButtons.forEach(button => {
        button.addEventListener('click', async function () {
            const model = this.getAttribute('data-model');

            if (model === modeloSeleccionado) {
                return; // Ya está seleccionado
            }

            modeloSeleccionado = model;
            console.log(`🔄 Cambiando a modelo: ${model}`);

            // Actualizar UI de botones
            modelButtons.forEach(btn => {
                btn.classList.remove('active');
                const input = btn.querySelector('input[type="radio"]');
                if (input) input.checked = false;
            });
            this.classList.add('active');
            const input = this.querySelector('input[type="radio"]');
            if (input) input.checked = true;

            // Mostrar indicador de carga
            const loadingIndicator = document.getElementById('modelLoadingIndicator');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'block';
            }

            try {
                // Cargar datos con el nuevo modelo
                await cargarDatosConModelo(model);

                // Actualizar UI
                updateUI(new Date());

                // Ocultar indicador de carga
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                }

                mostrarMensajeExito(`Modelo ${obtenerNombreModelo(model)} cargado correctamente`);
            } catch (error) {
                console.error('Error cargando modelo:', error);
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                }
                mostrarMensajeError('Error al cargar el modelo seleccionado. Intenta de nuevo.');
            }
        });
    });
}

/**
 * Obtener nombre legible del modelo
 */
function obtenerNombreModelo(model) {
    const nombres = {
        'auto': 'Automático (GFS)',
        'ecmwf_ifs025': 'ECMWF IFS',
        'gfs_graphcast025': 'GFS GraphCast',
        'icon_global': 'ICON Global'
    };
    return nombres[model] || model;
}

/**
 * Configurar selector de modelos meteorológicos para Torres del Paine
 */
function setupModelSelectorTorres() {
    const modelButtons = document.querySelectorAll('#modelSelectorTorres .model-btn');

    if (modelButtons.length === 0) {
        console.warn('⚠️ No se encontraron botones de selector de modelos en Torres del Paine');
        return;
    }

    // Actualizar indicador con modelo actual
    const modelIndicator = document.getElementById('modelIndicatorTorres');
    if (modelIndicator) {
        modelIndicator.innerHTML = `<i class="fas fa-layer-group"></i> Modelo activo: <strong>${obtenerNombreModelo(modeloSeleccionado)}</strong>`;
    }

    // Seleccionar el botón correspondiente al modelo actual
    modelButtons.forEach(btn => {
        const input = btn.querySelector('input[type="radio"]');
        if (input && input.value === modeloSeleccionado) {
            btn.classList.add('active');
            if (input) input.checked = true;
        } else {
            btn.classList.remove('active');
            if (input) input.checked = false;
        }
    });

    modelButtons.forEach(button => {
        button.addEventListener('click', async function () {
            const model = this.getAttribute('data-model');

            if (model === modeloSeleccionado) {
                return; // Ya está seleccionado
            }

            modeloSeleccionado = model;
            console.log(`🔄 Cambiando a modelo en Torres del Paine: ${model}`);

            // Actualizar UI de botones
            const allButtons = document.querySelectorAll('#modelSelectorTorres .model-btn');
            allButtons.forEach(btn => {
                btn.classList.remove('active');
                const input = btn.querySelector('input[type="radio"]');
                if (input) input.checked = false;
            });
            this.classList.add('active');
            const input = this.querySelector('input[type="radio"]');
            if (input) input.checked = true;

            // Actualizar indicador
            if (modelIndicator) {
                modelIndicator.innerHTML = `<i class="fas fa-layer-group"></i> Modelo activo: <strong>${obtenerNombreModelo(model)}</strong>`;
            }

            // Mostrar indicador de carga
            const loadingIndicator = document.getElementById('modelLoadingIndicatorTorres');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'block';
            }

            try {
                // Cargar datos con el nuevo modelo
                await cargarDatosConModelo(model);

                // Actualizar mapa y widgets de Torres del Paine
                if (torresMapInitialized && torresMap) {
                    renderTorresWeatherPoints();
                }
                updateTorresWidget();

                // Ocultar indicador de carga
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                }

                mostrarMensajeExito(`Modelo ${obtenerNombreModelo(model)} cargado correctamente`);
            } catch (error) {
                console.error('Error cargando modelo:', error);
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                }
                mostrarMensajeError('Error al cargar el modelo seleccionado. Intenta de nuevo.');
            }
        });
    });
}

/**
 * Cargar datos con el modelo seleccionado
 */
async function cargarDatosConModelo(model) {
    console.log(`🔄 Cargando datos con modelo: ${model}`);

    // Actualizar cada lugar con el nuevo modelo
    const lugares = weatherApp.obtenerTodosLosLugares();

    for (const nombreLugar of lugares) {
        // Buscar el lugar en weatherApp.lugares
        const lugar = weatherApp.lugares.find(l => l.nombre === nombreLugar);
        if (!lugar) {
            console.warn(`⚠️ No se encontró lugar: ${nombreLugar}`);
            continue;
        }

        try {
            let options = {
                includeHourly: true,
                includeModels: false,
                pastDays: 0,
                forceRefresh: true
            };

            if (model !== 'auto') {
                // Usar modelo específico
                options.model = model;
                options.includeModels = true;
            }

            const datos = await apiClient.obtenerDatosClima(
                nombreLugar,
                lugar.coords,
                options
            );

            if (datos) {
                weatherApp.datosClima[nombreLugar] = datos;
            }

            // Delay entre peticiones para evitar rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error(`❌ Error cargando ${nombreLugar} con modelo ${model}:`, error);
        }
    }

    // Actualizar timestamp de última actualización
    if (!weatherApp.lastUpdate) {
        weatherApp.lastUpdate = new Date();
    } else {
        weatherApp.lastUpdate = new Date();
    }

    // Disparar evento de actualización manualmente
    window.dispatchEvent(new CustomEvent('weatherUpdated', {
        detail: { timestamp: weatherApp.lastUpdate }
    }));
}

/**
 * Configurar actualización automática cada 4 horas
 */
function setupAutoUpdate() {
    const intervalo4Horas = 4 * 60 * 60 * 1000; // 4 horas en milisegundos

    // Actualizar inmediatamente si han pasado más de 4 horas desde la última actualización
    const ultimaActualizacion = weatherApp.obtenerUltimaActualizacion();
    if (ultimaActualizacion) {
        const tiempoTranscurrido = Date.now() - ultimaActualizacion.getTime();
        if (tiempoTranscurrido >= intervalo4Horas) {
            console.log('🔄 Han pasado más de 4 horas, actualizando datos ahora...');
            weatherApp.actualizarDatos().catch(err => console.error('Error en actualización automática:', err));
        }
    }

    // Configurar intervalo para actualizar cada 4 horas
    setInterval(async () => {
        console.log('🔄 Actualización automática cada 4 horas iniciada...');
        try {
            await weatherApp.actualizarDatos();
            console.log('✅ Actualización automática completada');
            mostrarMensajeExito('Datos meteorológicos actualizados automáticamente');
        } catch (error) {
            console.error('❌ Error en actualización automática:', error);
        }
    }, intervalo4Horas);

    console.log(`⏰ Actualización automática configurada cada 4 horas`);
}

/**
 * Actualizar todos los elementos de la UI con datos frescos
 * @param {Date} timestamp - Timestamp de la última actualización
 */
function updateUI(timestamp) {
    renderWeatherCards();
    updateTorresWidget();
    updateLastUpdatedInfo(timestamp);

    // Actualizar mapa si está inicializado
    if (mapInitialized && map) {
        updateMapMarkers();
        if (windLayerEnabled) {
            updateWindLayer();
        }
    }

    // Actualizar gráficos si la vista de estadísticas está activa
    const statsSection = document.getElementById('stats');
    if (statsSection.style.display === 'block') {
        renderAlerts().catch(err => console.error('Error actualizando alertas:', err));
        if (currentStatsCity) {
            renderForecastChart(currentStatsCity);
        } else {
            renderCityTabs(); // Inicializar tabs si no están ya creados
        }
    }
}

/**
 * Renderizar tarjetas de clima dinámicamente
 * Muestra las ciudades de la región (datos de API)
 * Implementa patrón del Módulo 2: addEventListener para navegación
 * Usa la nueva clase WeatherApp
 */
function renderWeatherCards() {
    const gridContainer = document.querySelector('.row.g-4');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';

    // Mostrar indicador del modelo activo (si existe el contenedor)
    const modelIndicator = document.getElementById('modelIndicator');
    if (modelIndicator) {
        modelIndicator.innerHTML = `<i class="fas fa-layer-group"></i> Modelo activo: <strong>${obtenerNombreModelo(modeloSeleccionado)}</strong>`;
    }

    const ciudades = weatherApp.obtenerTodosLosLugares();

    ciudades.forEach(cityName => {
        const data = weatherApp.obtenerDatosClima(cityName);
        if (!data) return;

        const current = data.current;
        const weatherCode = current.weather_code;
        const temp = Math.round(current.temperature_2m);
        const desc = weatherApp.obtenerDescripcionClima(weatherCode);
        const iconClass = weatherApp.obtenerIconoClima(weatherCode);
        const modifier = weatherApp.obtenerModificadorClima(weatherCode);

        const cardHtml = `
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                <article class="place-card place-card--${modifier}" data-city="${cityName}">
                    <div class="place-card__header">
                        <h2 class="place-card__name">${cityName}</h2>
                        <span class="place-card__distance">${data.city.distance} km</span>
                    </div>
                    <div class="place-card__body">
                        <div class="place-card__icon">
                            <i class="fas ${iconClass}"></i>
                        </div>
                        <div class="place-card__temp">${temp}°C</div>
                        <div class="place-card__description">${desc}</div>
                        <span class="place-card__badge">Ver detalle →</span>
                    </div>
                </article>
            </div>
        `;

        gridContainer.insertAdjacentHTML('beforeend', cardHtml);
    });

    // Implementar navegación con addEventListener (Requisito Módulo 2)
    setupCardNavigation();
}

/**
 * Configurar navegación desde cards usando addEventListener
 * Cumple con requisito del Módulo 2: Ejemplo de uso de JS 1
 */
function setupCardNavigation() {
    const cardLinks = document.querySelectorAll('.place-card[data-city]');

    cardLinks.forEach(function (card) {
        card.addEventListener('click', function () {
            const cityName = this.getAttribute('data-city');
            if (cityName) {
                showDetail(cityName);
            }
        });
    });
}

/**
 * Actualizar el widget específico de Torres del Paine
 */
function updateTorresWidget() {
    const torresData = weatherApp.obtenerDatosClima('Torres del Paine - Glaciar Grey');
    if (torresData) {
        const temp = Math.round(torresData.current.temperature_2m);
        const tempWidget = document.getElementById('torres-temp-widget');
        if (tempWidget) {
            tempWidget.innerText = temp + '°C';
        }
    }
}

/**
 * Update the "Last Updated" banner
 */
/**
 * Actualizar información de última actualización con botón de refresh
 */
function updateLastUpdatedInfo(date) {
    const infoElement = document.querySelector('.update-info');
    if (!infoElement) return;

    if (date) {
        const fecha = new Date(date);
        const ahora = new Date();
        const diferenciaMinutos = Math.floor((ahora - fecha) / (1000 * 60));

        let textoTiempo;
        if (diferenciaMinutos < 1) {
            textoTiempo = 'hace menos de 1 minuto';
        } else if (diferenciaMinutos < 60) {
            textoTiempo = `hace ${diferenciaMinutos} minutos`;
        } else {
            const horas = Math.floor(diferenciaMinutos / 60);
            textoTiempo = `hace ${horas} hora${horas > 1 ? 's' : ''}`;
        }

        const formattedDate = fecha.toLocaleString('es-CL');
        infoElement.innerHTML = `
            <i class="fas fa-sync"></i> Actualizado: ${formattedDate} (${textoTiempo})
            <button id="btnRefreshWeather" class="btn btn-sm btn-outline-light ml-2" title="Actualizar datos meteorológicos">
                <i class="fas fa-sync-alt"></i> Actualizar
            </button>
        `;

        // Agregar event listener al botón de actualización
        const btnRefresh = document.getElementById('btnRefreshWeather');
        if (btnRefresh) {
            btnRefresh.addEventListener('click', async function () {
                btnRefresh.disabled = true;
                btnRefresh.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';

                try {
                    await weatherApp.actualizarDatos();
                    mostrarMensajeExito('Datos meteorológicos actualizados correctamente');
                } catch (error) {
                    console.error('Error actualizando datos:', error);
                    mostrarMensajeError('Error al actualizar datos. Por favor, intenta de nuevo.');
                } finally {
                    btnRefresh.disabled = false;
                    btnRefresh.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar';
                }
            });
        }
    }
}

/**
 * Mostrar mensaje de éxito
 */
function mostrarMensajeExito(mensaje) {
    // Buscar o crear contenedor de mensajes
    let mensajeContainer = document.getElementById('mensajeToast');
    if (!mensajeContainer) {
        mensajeContainer = document.createElement('div');
        mensajeContainer.id = 'mensajeToast';
        mensajeContainer.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
        mensajeContainer.style.zIndex = '9999';
        mensajeContainer.style.display = 'none';
        document.body.appendChild(mensajeContainer);
    }

    mensajeContainer.textContent = mensaje;
    mensajeContainer.style.display = 'block';
    mensajeContainer.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';

    setTimeout(() => {
        mensajeContainer.style.display = 'none';
    }, 3000);
}

/**
 * Setup navigation events
 * Implementa patrón del Módulo 2: Modificando clases dependiendo de la ubicación
 */
function setupNavigation() {
    // Navegación con anclas
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Modificar clases de navegación según ubicación (Requisito Módulo 2: Ejemplo de uso de JS 2)
    updateActiveNavLinks();
}

/**
 * Actualizar clases activas de navegación según la vista actual
 * Cumple con requisito del Módulo 2: Ejemplo de uso de JS 2
 */
function updateActiveNavLinks() {
    const links = document.querySelectorAll('.nav-link');
    const currentView = getCurrentView();

    links.forEach(function (link) {
        const navType = link.getAttribute('data-nav');

        if (currentView === 'home' && navType === 'home') {
            link.classList.add('active');
        } else if (currentView === 'stats' && navType === 'stats') {
            link.classList.add('active');
        } else if (currentView === 'torres' && navType === 'torres') {
            link.classList.add('active');
        } else if (currentView === 'map' && navType === 'map') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Obtener la vista actual activa
 */
function getCurrentView() {
    const home = document.getElementById('home');
    const stats = document.getElementById('stats');
    const torres = document.getElementById('torres-paine');
    const detail = document.getElementById('detail');

    if (home && home.style.display !== 'none') return 'home';
    if (stats && stats.style.display === 'block') return 'stats';
    if (torres && torres.style.display === 'block') return 'torres';
    if (detail && detail.style.display === 'block') return 'detail';
    return 'home';
}

/**
 * Scroll to map section
 */
function scrollToMap() {
    goHome();
    setTimeout(() => {
        document.getElementById('mapa').scrollIntoView({ behavior: 'smooth' });
        const container = document.getElementById('mapContainer');
        if (!container.classList.contains('show')) {
            toggleMap();
        }
    }, 100);
}

/**
 * Toggle map visibility
 */
function toggleMap() {
    const container = document.getElementById('mapContainer');
    const toggle = document.querySelector('.map-toggle');
    const isShown = container.classList.contains('show');

    if (isShown) {
        container.classList.remove('show');
        toggle.classList.remove('collapsed');
    } else {
        container.classList.add('show');
        toggle.classList.add('collapsed');
        if (!mapInitialized) {
            initializeMap();
            mapInitialized = true;
        }
    }
}

/**
 * Initialize Leaflet map con capa de viento
 */
function initializeMap() {
    map = L.map('mapContainer').setView(TORRES_DEL_PAINE, 7);

    // Capa base del mapa
    const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Inicializar capa de viento (vacía por ahora)
    windLayer = L.layerGroup().addTo(map);

    // Crear control de capas
    const baseMaps = {
        "Mapa Base": baseLayer
    };

    const overlayMaps = {
        "Capa de Viento": windLayer
    };

    L.control.layers(baseMaps, overlayMaps, {
        position: 'topright',
        collapsed: true
    }).addTo(map);

    // Agregar botón personalizado para activar/desactivar viento
    const windControl = L.control({ position: 'topright' });
    windControl.onAdd = function () {
        const div = L.DomUtil.create('div', 'wind-control');
        div.innerHTML = `
            <button id="toggleWindLayer" class="btn btn-sm btn-primary" style="
                background: linear-gradient(135deg, #1976d2, #00bcd4);
                border: none;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: all 0.3s;
            ">
                <i class="fas fa-wind"></i> Viento
            </button>
        `;

        L.DomEvent.disableClickPropagation(div);

        // Agregar evento de clic
        const button = div.querySelector('#toggleWindLayer');
        button.addEventListener('click', function () {
            toggleWindLayer();
        });

        return div;
    };
    windControl.addTo(map);

    // Agregar leyenda de viento
    const windLegend = L.control({ position: 'bottomright' });
    windLegend.onAdd = function () {
        const div = L.DomUtil.create('div', 'wind-legend');
        div.style.display = 'none'; // Oculto por defecto
        div.id = 'windLegend';
        div.innerHTML = `
            <h5><i class="fas fa-wind"></i> Velocidad del Viento</h5>
            <div class="wind-legend-item">
                <span style="background: #4caf50;"></span>
                <span>Suave (0-15 km/h)</span>
            </div>
            <div class="wind-legend-item">
                <span style="background: #ffc107;"></span>
                <span>Moderado (15-25 km/h)</span>
            </div>
            <div class="wind-legend-item">
                <span style="background: #ff9800;"></span>
                <span>Fuerte (25-40 km/h)</span>
            </div>
            <div class="wind-legend-item">
                <span style="background: #f44336;"></span>
                <span>Muy Fuerte (>40 km/h)</span>
            </div>
        `;
        return div;
    };
    windLegend.addTo(map);

    updateMapMarkers();
    updateWindLayer();

    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}

/**
 * Activar/desactivar capa de viento
 */
function toggleWindLayer() {
    windLayerEnabled = !windLayerEnabled;
    const button = document.querySelector('#toggleWindLayer');
    const legend = document.getElementById('windLegend');

    if (windLayerEnabled) {
        windLayer.addTo(map);
        button.style.background = 'linear-gradient(135deg, #4caf50, #8bc34a)';
        button.innerHTML = '<i class="fas fa-wind"></i> Viento ON';
        if (legend) legend.style.display = 'block';
        updateWindLayer();
    } else {
        windLayer.removeFrom(map);
        button.style.background = 'linear-gradient(135deg, #1976d2, #00bcd4)';
        button.innerHTML = '<i class="fas fa-wind"></i> Viento';
        if (legend) legend.style.display = 'none';
        windLayer.clearLayers();
    }
}

/**
 * Actualizar capa de viento con datos de las ciudades
 */
function updateWindLayer() {
    if (!windLayer || !windLayerEnabled) return;

    windLayer.clearLayers();

    const ciudades = weatherApp.obtenerTodosLosLugares();

    ciudades.forEach(cityName => {
        const data = weatherApp.obtenerDatosClima(cityName);
        if (data && data.city && data.current) {
            const lat = data.city.lat;
            const lon = data.city.lon;
            const windSpeed = data.current.wind_speed_10m || 0;
            const windDir = data.current.wind_direction_10m || 0;

            // Solo mostrar viento si la velocidad es > 0
            if (windSpeed > 0) {
                addWindArrow(lat, lon, windSpeed, windDir, cityName);
            }
        }
    });
}

/**
 * Agregar flecha de viento al mapa
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @param {number} speed - Velocidad del viento (km/h)
 * @param {number} direction - Dirección del viento (grados)
 * @param {string} cityName - Nombre de la ciudad
 */
function addWindArrow(lat, lon, speed, direction, cityName) {
    // Convertir dirección de grados a radianes (Leaflet usa -180 a 180, pero la API da 0-360)
    const angle = (direction - 90) * (Math.PI / 180); // Ajustar para que 0° = Norte

    // Longitud de la flecha basada en la velocidad del viento
    const arrowLength = Math.min(speed * 0.01, 0.5); // Escalar apropiadamente

    // Calcular punto final de la flecha
    const endLat = lat + arrowLength * Math.cos(angle);
    const endLon = lon + arrowLength * Math.sin(angle);

    // Color basado en la velocidad del viento
    let color = '#4caf50'; // Verde para viento suave
    if (speed > 40) color = '#f44336'; // Rojo para viento fuerte
    else if (speed > 25) color = '#ff9800'; // Naranja para viento moderado
    else if (speed > 15) color = '#ffc107'; // Amarillo para viento medio

    // Crear línea de viento con flecha
    const windLine = L.polyline(
        [[lat, lon], [endLat, endLon]],
        {
            color: color,
            weight: Math.min(speed / 5, 8), // Grosor basado en velocidad
            opacity: 0.8,
            lineCap: 'round'
        }
    ).addTo(windLayer);

    // Agregar marcador circular en el inicio con información
    const windMarker = L.circleMarker([lat, lon], {
        radius: 4,
        fillColor: color,
        color: '#fff',
        weight: 2,
        fillOpacity: 0.7
    }).addTo(windLayer);

    // Tooltip con información del viento
    const windDirText = weatherApp.obtenerDireccionViento(direction);
    windMarker.bindTooltip(`
        <div style="text-align: center; font-size: 0.85rem;">
            <strong>${cityName}</strong><br>
            <i class="fas fa-wind" style="color: ${color};"></i> ${Math.round(speed)} km/h<br>
            <small>${windDirText}</small>
        </div>
    `, {
        permanent: false,
        direction: 'top',
        offset: [0, -10]
    });

    // Agregar flecha al final de la línea usando SVG para mejor rotación
    const arrowSize = 8;
    const arrowAngle = direction * (Math.PI / 180);

    const arrowHead = L.marker([endLat, endLon], {
        icon: L.divIcon({
            className: 'wind-arrow-head',
            html: `
                <svg width="${arrowSize * 2}" height="${arrowSize * 2}" style="transform: rotate(${direction}deg);">
                    <path d="M ${arrowSize} 0 L ${arrowSize * 2} ${arrowSize * 2} L ${arrowSize} ${arrowSize * 1.5} Z" 
                          fill="${color}" 
                          stroke="white" 
                          stroke-width="1"/>
                </svg>
            `,
            iconSize: [arrowSize * 2, arrowSize * 2],
            iconAnchor: [arrowSize, arrowSize]
        })
    }).addTo(windLayer);
}

/**
 * Actualizar marcadores del mapa con datos actuales
 */
function updateMapMarkers() {
    map.eachLayer((layer) => {
        if (layer instanceof L.CircleMarker) {
            map.removeLayer(layer);
        }
    });

    L.circleMarker(TORRES_DEL_PAINE, {
        radius: 12,
        fillColor: '#00bcd4',
        color: '#0d47a1',
        weight: 3,
        fillOpacity: 0.8
    }).addTo(map).bindPopup('🏔️ Torres del Paine (Glaciar Grey)');

    const ciudades = weatherApp.obtenerTodosLosLugares();
    ciudades.forEach(cityName => {
        const data = weatherApp.obtenerDatosClima(cityName);
        if (data && data.city) {
            const lat = data.city.lat;
            const lon = data.city.lon;
            const temp = Math.round(data.current.temperature_2m);

            let color;
            if (temp < 5) color = '#0d47a1';
            else if (temp < 10) color = '#1976d2';
            else if (temp < 15) color = '#00bcd4';
            else if (temp < 20) color = '#4caf50';
            else color = '#ff9800';

            L.circleMarker([lat, lon], {
                radius: 10,
                fillColor: color,
                color: '#fff',
                weight: 2,
                fillOpacity: 0.8
            }).addTo(map).bindPopup(`${cityName} - ${temp}°C`);
        }
    });
}

/**
 * Go back to home view
 */
function goHome() {
    document.getElementById('home').style.display = 'block';
    document.getElementById('detail').style.display = 'none';
    document.getElementById('stats').style.display = 'none';
    document.getElementById('torres-paine').style.display = 'none';

    // Actualizar clases activas usando el patrón del Módulo 2
    updateActiveNavLinks();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Show Statistics View
 */
async function showStats() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('detail').style.display = 'none';
    document.getElementById('stats').style.display = 'block';
    document.getElementById('torres-paine').style.display = 'none';

    // Actualizar clases activas usando el patrón del Módulo 2
    updateActiveNavLinks();

    await renderAlerts();
    renderCityTabs();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Renderizar tabs de ciudades para estadísticas
 */
function renderCityTabs() {
    const ciudades = weatherApp.obtenerTodosLosLugares();
    const tabsContainer = document.getElementById('cityTabs');

    if (!tabsContainer) return;

    let html = '';
    ciudades.forEach((city, index) => {
        const isActive = index === 0 ? 'active' : '';
        // Acortar nombre para el tab si es muy largo
        const shortName = city.replace('Torres del Paine - ', '').replace('Glaciar ', '');

        html += `
            <li class="nav-item">
                <a class="nav-link ${isActive}" href="#" data-city="${city}">
                    ${shortName}
                </a>
            </li>
        `;
    });

    tabsContainer.innerHTML = html;

    // Configurar event listeners para tabs de ciudades
    setupCityTabsListeners();

    // Seleccionar primera ciudad por defecto
    if (ciudades.length > 0) {
        selectCityStats(ciudades[0]);
    }
}

/**
 * Setup event listeners for city tabs
 * Cumple con Módulo 2: uso de addEventListener
 */
function setupCityTabsListeners() {
    const cityTabs = document.querySelectorAll('#cityTabs a[data-city]');
    cityTabs.forEach(tab => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            const city = this.getAttribute('data-city');
            selectCityStats(city, this);
        });
    });
}

/**
 * Select a city to show stats for
 */
function selectCityStats(city, element) {
    currentStatsCity = city;

    // Update active tab styling
    if (element) {
        document.querySelectorAll('#cityTabs .nav-link').forEach(link => link.classList.remove('active'));
        element.classList.add('active');
    }

    // Update Chart Title
    document.getElementById('chartTitle').innerText = `${city}: Pronóstico 7 Días`;

    renderForecastChart(city);
    renderCityDetailedStats(city);
}

/**
 * Renderizar tarjetas de estadísticas detalladas para una ciudad
 */
function renderCityDetailedStats(city) {
    const container = document.getElementById('cityStatsContainer');
    if (!container) return;

    const estadisticas = weatherApp.calcularEstadisticas(city);
    if (!estadisticas) {
        container.innerHTML = '';
        return;
    }

    let html = `
        <div class="row g-3">
            <div class="col-12 col-md-4">
                <div class="card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; padding: 1.25rem; text-align: center; height: 100%;">
                    <h4 style="font-size: 0.85rem; opacity: 0.8; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px;">Temperatura Promedio</h4>
                    <div style="font-size: 2.2rem; font-weight: bold;">${estadisticas.tempPromedio}°C</div>
                    <div style="font-size: 0.8rem; opacity: 0.9; margin-top: 0.5rem;">
                        <i class="fas fa-temperature-low"></i> Máx: ${estadisticas.tempMaxima}°C | Mín: ${estadisticas.tempMinima}°C
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-4">
                <div class="card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border-radius: 12px; padding: 1.25rem; text-align: center; height: 100%;">
                    <h4 style="font-size: 0.85rem; opacity: 0.8; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px;">Sensación Térmica</h4>
                    <div style="font-size: 2.2rem; font-weight: bold;">${estadisticas.sensacionPromedio}°C</div>
                    <p style="font-size: 0.8rem; opacity: 0.9; margin-top: 0.5rem;">Promedio de sensación real percibida</p>
                </div>
            </div>
            <div class="col-12 col-md-4">
                <div class="card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border-radius: 12px; padding: 1.25rem; text-align: center; height: 100%;">
                    <h4 style="font-size: 0.85rem; opacity: 0.8; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px;">Precipitaciones</h4>
                    <div style="font-size: 2.2rem; font-weight: bold;">${estadisticas.picoPrecipitacion} mm</div>
                    <div style="font-size: 0.8rem; opacity: 0.9; margin-top: 0.5rem;">
                        Prob. Máxima: ${estadisticas.probabilidadMaxima}%
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-3 mt-3">
            <div class="col-12 col-md-6">
                <div class="card p-3" style="border-radius: 12px; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.05); background: white;">
                    <h5 class="mb-3" style="color: #1a2a6c; font-weight: bold;"><i class="fas fa-cloud-showers-heavy"></i> Detalle Hídrico (Semanal)</h5>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span>Total Lluvia</span>
                        <span class="badge badge-primary badge-pill" style="font-size: 1rem;">${estadisticas.totalLluvia} mm</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span>Total Nieve</span>
                        <span class="badge badge-info badge-pill" style="font-size: 1rem;">${estadisticas.totalNieve} cm</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <span>Pico Diario</span>
                        <span class="badge badge-warning badge-pill" style="font-size: 1rem;">${estadisticas.picoPrecipitacion} mm</span>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="card p-3" style="border-radius: 12px; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.05); background: white;">
                    <h5 class="mb-3" style="color: #1a2a6c; font-weight: bold;"><i class="fas fa-calendar-check"></i> Mix de Días</h5>
                    <div class="row">
    `;

    Object.entries(estadisticas.diasPorEstado).forEach(([tipo, cantidad]) => {
        if (cantidad > 0) {
            html += `
                <div class="col-6 mb-2">
                    <div style="padding: 10px; border-radius: 8px; background: #f8f9fa; text-align: center;">
                        <strong style="color: #764ba2; font-size: 1.2rem;">${cantidad}</strong>
                        <div style="font-size: 0.75rem; color: #666;">${tipo}</div>
                    </div>
                </div>
            `;
        }
    });

    html += `
                    </div>
                </div>
            </div>
        </div>

        ${estadisticas.resumen ? `
        <div class="alert mt-4" style="border-radius: 12px; background: #e3f2fd; border: none; border-left: 5px solid #2196f3; padding: 1.5rem;">
            <h5 style="color: #0d47a1; font-weight: bold;"><i class="fas fa-robot"></i> Análisis del Generador</h5>
            <p class="mb-0" style="font-size: 1.05rem;">${estadisticas.resumen}</p>
        </div>
        ` : ''}
    `;

    container.innerHTML = html;
}

/**
 * Renderizar gráfico de pronóstico (Máx/Mín) para una ciudad específica
 */
function renderForecastChart(city) {
    const data = weatherApp.obtenerDatosClima(city);
    if (!data || !data.daily) {
        console.error(`❌ No hay datos diarios para ${city}`);
        return;
    }

    const daily = data.daily;
    if (!daily.time || daily.time.length === 0) {
        console.error(`❌ No hay datos de tiempo en daily para ${city}`);
        return;
    }

    // Filtrar solo días futuros para el gráfico
    const ahora = new Date();
    ahora.setHours(0, 0, 0, 0);

    const labels = [];
    const tempsMax = [];
    const tempsMin = [];

    daily.time.forEach((t, index) => {
        const date = new Date(t);
        date.setHours(0, 0, 0, 0);

        // Solo incluir días futuros
        if (date > ahora) {
            labels.push(date.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric' }));
            tempsMax.push(daily.temperature_2m_max?.[index] || 0);
            tempsMin.push(daily.temperature_2m_min?.[index] || 0);
        }
    });

    if (labels.length === 0) {
        console.error(`❌ No hay días futuros para mostrar en el gráfico de ${city}`);
        return;
    }

    const ctxElement = document.getElementById('forecastChart');
    if (!ctxElement) {
        console.error('❌ No se encontró el elemento canvas #forecastChart');
        return;
    }

    const ctx = ctxElement.getContext('2d');
    if (!ctx) {
        console.error('❌ No se pudo obtener el contexto 2D del canvas');
        return;
    }

    if (forecastChart) {
        forecastChart.destroy();
    }

    console.log(`📊 Generando gráfico para ${city} con ${labels.length} días`);

    forecastChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Máxima (°C)',
                    data: tempsMax,
                    borderColor: '#ff9800', // Orange
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#ff9800',
                    fill: false
                },
                {
                    label: 'Mínima (°C)',
                    data: tempsMin,
                    borderColor: '#03a9f4', // Light Blue
                    backgroundColor: 'rgba(3, 169, 244, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#03a9f4',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 20,
                    bottom: 30, // Increased bottom padding for X-axis labels
                    left: 10,
                    right: 10
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 12, family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif" }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleFont: { size: 14 },
                    bodyFont: { size: 13 },
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: true
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: '#e0e0e0',
                        drawBorder: false
                    },
                    ticks: {
                        font: { size: 12 },
                        padding: 10,
                        callback: function (value) { return value + '°C'; }
                    },
                    border: { display: false }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { size: 12 },
                        maxRotation: 0,
                        padding: 10 // Padding for X-axis labels
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

/**
 * Renderizar alertas activas en la vista de estadísticas
 */
/**
 * Renderizar alertas por día y por lugar de los circuitos W y O
 * Usa análisis inteligente para generar alertas detalladas
 */
async function renderAlerts() {
    const container = document.getElementById('alertsContainer');
    if (!container) return;

    container.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Generando alertas por día y sector...</div>';

    try {
        // Obtener alertas por día y por sector de circuitos W y O
        const alertasPorDia = await weatherApp.obtenerAlertasPorDiaYLugar();

        if (!alertasPorDia || alertasPorDia.length === 0) {
            container.innerHTML = `
            <div class="alert alert-success text-center">
                    <i class="fas fa-check-circle"></i> No hay alertas meteorológicas activas para los circuitos W y O.
            </div>
        `;
            return;
        }

        let html = `
            <h4 class="mb-3">
                <i class="fas fa-mountain"></i> Alertas Meteorológicas - Circuitos W y O
            </h4>
            <p class="text-muted mb-3">
                <small>Alertas detalladas por día y por sector para excursionistas</small>
            </p>
        `;

        // Agrupar alertas por día
        alertasPorDia.forEach((diaData, diaIndex) => {
            if (diaData.alertas.length === 0) return;

            // Agrupar alertas por circuito
            const alertasW = diaData.alertas.filter(a => a.circuito === 'W');
            const alertasO = diaData.alertas.filter(a => a.circuito === 'O');

            html += `
                <div class="card mb-4" style="border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <div class="card-header" style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; border-radius: 10px 10px 0 0;">
                        <h5 class="mb-0">
                            <i class="fas fa-calendar-day"></i> ${diaData.dia} - ${diaData.fecha}
                        </h5>
                </div>
                    <div class="card-body p-3">
            `;

            // Circuito W
            if (alertasW.length > 0) {
                html += `
                    <div class="mb-3">
                        <h6 class="text-orange mb-2">
                            <i class="fas fa-route"></i> Circuito W
                        </h6>
                        <div class="row">
                `;

                // Agrupar por sector
                const sectoresW = {};
                alertasW.forEach(alerta => {
                    if (!sectoresW[alerta.sector]) {
                        sectoresW[alerta.sector] = [];
                    }
                    sectoresW[alerta.sector].push(alerta);
                });

                Object.entries(sectoresW).forEach(([sector, alertasSector]) => {
                    const primeraAlerta = alertasSector[0];
                    html += `
                        <div class="col-md-6 mb-3">
                            <div class="card" style="border-left: 4px solid #ff9800;">
                                <div class="card-body p-2">
                                    <h6 class="mb-2">
                                        <i class="fas ${primeraAlerta.icono}"></i> ${sector}
                                    </h6>
                                    ${alertasSector.map(alerta => {
                        const nivelClass = alerta.nivel === 'danger' ? 'danger' :
                            alerta.nivel === 'warning' ? 'warning' : 'info';
                        return `
                                            <div class="alert alert-${nivelClass} mb-2 p-2" style="font-size: 0.9rem;">
                                                <strong>${alerta.titulo}</strong><br>
                                                <small>${alerta.mensaje}</small><br>
                                                ${alerta.recomendaciones ? `
                                                    <small class="d-block mt-1">
                                                        <strong>💡</strong> ${alerta.recomendaciones}
                                                    </small>
                                                ` : ''}
                                                <div class="mt-2" style="font-size: 0.85rem; color: #666;">
                                                    <i class="fas fa-thermometer-half"></i> ${alerta.tempMax}°/${alerta.tempMin}°C
                                                    ${alerta.vientoMax > 0 ? ` | <i class="fas fa-wind"></i> ${alerta.vientoMax} km/h` : ''}
                                                    ${alerta.precipitacion > 0 ? ` | <i class="fas fa-cloud-rain"></i> ${alerta.precipitacion.toFixed(1)}mm` : ''}
                                                </div>
                                            </div>
                                        `;
                    }).join('')}
                                </div>
                            </div>
            </div>
        `;
                });

                html += `</div></div>`;
            }

            // Circuito O
            if (alertasO.length > 0) {
                html += `
                    <div class="mb-3">
                        <h6 class="text-warning mb-2">
                            <i class="fas fa-route"></i> Circuito O
                        </h6>
                        <div class="row">
                `;

                // Agrupar por sector
                const sectoresO = {};
                alertasO.forEach(alerta => {
                    if (!sectoresO[alerta.sector]) {
                        sectoresO[alerta.sector] = [];
                    }
                    sectoresO[alerta.sector].push(alerta);
                });

                Object.entries(sectoresO).forEach(([sector, alertasSector]) => {
                    const primeraAlerta = alertasSector[0];
                    html += `
                        <div class="col-md-6 mb-3">
                            <div class="card" style="border-left: 4px solid #ffc107;">
                                <div class="card-body p-2">
                                    <h6 class="mb-2">
                                        <i class="fas ${primeraAlerta.icono}"></i> ${sector}
                                    </h6>
                                    ${alertasSector.map(alerta => {
                        const nivelClass = alerta.nivel === 'danger' ? 'danger' :
                            alerta.nivel === 'warning' ? 'warning' : 'info';
                        return `
                                            <div class="alert alert-${nivelClass} mb-2 p-2" style="font-size: 0.9rem;">
                                                <strong>${alerta.titulo}</strong><br>
                                                <small>${alerta.mensaje}</small><br>
                                                ${alerta.recomendaciones ? `
                                                    <small class="d-block mt-1">
                                                        <strong>💡</strong> ${alerta.recomendaciones}
                                                    </small>
                                                ` : ''}
                                                <div class="mt-2" style="font-size: 0.85rem; color: #666;">
                                                    <i class="fas fa-thermometer-half"></i> ${alerta.tempMax}°/${alerta.tempMin}°C
                                                    ${alerta.vientoMax > 0 ? ` | <i class="fas fa-wind"></i> ${alerta.vientoMax} km/h` : ''}
                                                    ${alerta.precipitacion > 0 ? ` | <i class="fas fa-cloud-rain"></i> ${alerta.precipitacion.toFixed(1)}mm` : ''}
                                                </div>
                                            </div>
                                        `;
                    }).join('')}
                                </div>
                            </div>
                        </div>
                    `;
                });

                html += `</div></div>`;
            }

            html += `</div></div>`;
        });

        container.innerHTML = html;
    } catch (error) {
        console.error('Error generando alertas por día y sector:', error);
        container.innerHTML = `
            <div class="alert alert-danger text-center">
                <i class="fas fa-exclamation-triangle"></i> Error generando alertas. Por favor, intenta de nuevo.
            </div>
        `;
    }
}

/**
 * Mostrar vista de detalle para una ciudad (datos de API)
 * Incluye: pronóstico semanal, estadísticas y alertas de clima
 * Solo genera alertas para Torres del Paine usando LLM
 */
async function showDetail(city) {
    const data = weatherApp.obtenerDatosClima(city);
    if (!data) {
        mostrarMensajeError(`No se encontraron datos para ${city}`);
        return;
    }

    const current = data.current;
    const daily = data.daily;
    const desc = weatherApp.obtenerDescripcionClima(current.weather_code);

    // Log de datos actuales para verificación
    console.log(`📊 Datos actuales para ${city}:`, {
        temperatura: current.temperature_2m,
        temperaturaRedondeada: Math.round(current.temperature_2m),
        humedad: current.relative_humidity_2m,
        viento: current.wind_speed_10m,
        vientoRedondeado: Math.round(current.wind_speed_10m),
        direccionViento: current.wind_direction_10m,
        codigoClima: current.weather_code,
        descripcion: desc,
        timestamp: current.time
    });

    // Calcular estadísticas desde datos de la API
    const estadisticas = weatherApp.calcularEstadisticas(city);

    if (estadisticas) {
        console.log(`📊 Estadísticas para ${city}:`, estadisticas);
    }

    // Obtener alertas de clima (solo para Torres del Paine)
    const alertas = city === 'Torres del Paine - Glaciar Grey'
        ? await weatherApp.obtenerAlertas(city)
        : [];

    // Construir HTML usando template literals
    let html = `
        <div class="detail-header">
            <h2><i class="fas fa-location-dot"></i> ${city}</h2>
            <p class="text-center text-muted">${desc}</p>
            <div class="alert alert-info" style="font-size: 0.85rem; margin-bottom: 1rem;">
                <i class="fas fa-info-circle"></i> 
                <strong>Fuente:</strong> Open-Meteo API | 
                <strong>Actualizado:</strong> ${new Date(data.updated || data.fetchedAt).toLocaleString('es-CL')} |
                <strong>Coordenadas:</strong> ${data.city.lat.toFixed(4)}, ${data.city.lon.toFixed(4)}
            </div>
            <div class="weather-details">
                <div class="detail-item">
                    <div class="detail-item__label">Temperatura</div>
                    <div class="detail-item__value">${Math.round(current.temperature_2m)}°C</div>
                    <small class="text-muted">Sensación: ${Math.round(current.apparent_temperature || current.temperature_2m)}°C</small>
                </div>
                <div class="detail-item">
                    <div class="detail-item__label">Humedad</div>
                    <div class="detail-item__value">${current.relative_humidity_2m}%</div>
                </div>
                <div class="detail-item">
                    <div class="detail-item__label">Viento</div>
                    <div class="detail-item__value">${Math.round(current.wind_speed_10m)} km/h</div>
                    <small class="text-muted">${weatherApp.obtenerDireccionViento(current.wind_direction_10m)}</small>
                </div>
                <div class="detail-item">
                    <div class="detail-item__label">Lluvia Prox.</div>
                    <div class="detail-item__value">${(daily.precipitation_sum?.[0] || 0).toFixed(1)}mm</div>
                    <small class="text-muted">Prob: ${daily.precipitation_probability_max?.[0] || 0}%</small>
                </div>
            </div>
        </div>
    `;

    // Sección de Alertas de Clima
    if (alertas && alertas.length > 0) {
        html += `
        <div class="forecast-section">
            <h3 class="forecast-title">
                    <i class="fas fa-exclamation-triangle"></i> Alertas Inteligentes (Análisis IA local)
                </h3>
                <div id="weatherAlertsDetail">
                    ${weatherApp.weatherAlerts.renderizarAlertas(alertas)}
                </div>
            </div>
        `;
    }

    // Pronóstico Semanal - Solo días futuros
    html += `
        <div class="forecast-section">
            <h3 class="forecast-title">
                <i class="fas fa-calendar-week"></i> Pronóstico Semanal (Próximos días)
            </h3>
            <div class="row g-3">
    `;

    // Filtrar solo días futuros (pronóstico real, no histórico)
    const ahora = new Date();
    ahora.setHours(0, 0, 0, 0);

    let diasMostrados = 0;
    for (let i = 0; i < daily.time.length; i++) {
        const date = new Date(daily.time[i]);
        date.setHours(0, 0, 0, 0);

        // Solo mostrar días futuros (mañana en adelante)
        if (date <= ahora) {
            continue; // Saltar días pasados o el día actual
        }

        const dateStr = date.toLocaleDateString('es-CL', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        const dayCode = daily.weather_code[i];
        const dayIcon = weatherApp.obtenerIconoClima(dayCode);
        const precip = (daily.precipitation_sum?.[i] || 0);

        html += `
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div class="forecast-card" onclick="showDayDetail('${city}', ${diasMostrados})">
                    <div class="forecast-card__day">${dateStr}</div>
                    <div style="font-size: 1.5rem; color: var(--secondary); margin: 0.5rem 0;">
                        <i class="fas ${dayIcon}"></i>
                    </div>
                    <div class="forecast-card__temps">
                        <strong>${Math.round(daily.temperature_2m_max[i])}°C</strong> / 
                        ${Math.round(daily.temperature_2m_min[i])}°C
                    </div>
                    <div class="forecast-card__info">
                        <div>
                            <small>Lluvia</small>
                            <div class="forecast-card__info-value">${precip.toFixed(1)}mm</div>
                        </div>
                        <div>
                            <small>Viento</small>
                            <div class="forecast-card__info-value">${Math.round(daily.wind_speed_10m_max[i] || 0)}km/h</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        diasMostrados++;
    }

    html += `
            </div>
        </div>
    `;

    // Sección de Estadísticas de la Semana
    if (estadisticas) {
        html += `
            <div class="forecast-section" style="margin-top: 2rem;">
                <h3 class="forecast-title">
                    <i class="fas fa-chart-bar"></i> Estadísticas de la Semana
                </h3>
                <div class="row g-3">
                    <div class="col-12 col-md-3">
                        <div class="card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; padding: 1.25rem; text-align: center;">
                            <h4 style="font-size: 0.8rem; opacity: 0.9; margin-bottom: 0.5rem; text-transform: uppercase;">Promedio Real</h4>
                            <div style="font-size: 1.8rem; font-weight: bold;">${estadisticas.tempPromedio}°C</div>
                        </div>
                    </div>
                    <div class="col-12 col-md-3">
                        <div class="card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border-radius: 12px; padding: 1.25rem; text-align: center;">
                            <h4 style="font-size: 0.8rem; opacity: 0.9; margin-bottom: 0.5rem; text-transform: uppercase;">Sensación Térmica</h4>
                            <div style="font-size: 1.8rem; font-weight: bold;">${estadisticas.sensacionPromedio}°C</div>
                        </div>
                    </div>
                    <div class="col-12 col-md-3">
                        <div class="card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border-radius: 12px; padding: 1.25rem; text-align: center;">
                            <h4 style="font-size: 0.8rem; opacity: 0.9; margin-bottom: 0.5rem; text-transform: uppercase;">Total Lluvia</h4>
                            <div style="font-size: 1.8rem; font-weight: bold;">${estadisticas.totalLluvia} mm</div>
                        </div>
                    </div>
                    <div class="col-12 col-md-3">
                        <div class="card" style="background: linear-gradient(135deg, #13f1fc 0%, #0470dc 100%); color: white; border-radius: 12px; padding: 1.25rem; text-align: center;">
                            <h4 style="font-size: 0.8rem; opacity: 0.9; margin-bottom: 0.5rem; text-transform: uppercase;">Total Nieve</h4>
                            <div style="font-size: 1.8rem; font-weight: bold;">${estadisticas.totalNieve} cm</div>
                        </div>
                    </div>
                </div>

                <div class="row g-3 mt-3">
                    <div class="col-12">
                        <div class="card" style="background: #f8f9fa; border-radius: 12px; padding: 1.5rem;">
                            <h4 style="margin-bottom: 1rem; color: #333;">
                                <i class="fas fa-calendar-check"></i> Días por Tipo de Clima
                            </h4>
                            <div class="row">
        `;

        // Mostrar contador de días por tipo de clima
        Object.keys(estadisticas.diasPorEstado).forEach(tipo => {
            const cantidad = estadisticas.diasPorEstado[tipo];
            if (cantidad > 0) {
                html += `
                    <div class="col-6 col-md-3 mb-2">
                        <div style="background: white; padding: 1rem; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <div style="font-size: 1.5rem; font-weight: bold; color: #667eea;">${cantidad}</div>
                            <div style="font-size: 0.85rem; color: #666; margin-top: 0.25rem;">${tipo}</div>
                        </div>
                    </div>
                `;
            }
        });

        html += `
                            </div>
                        </div>
                    </div>
                </div>

                ${estadisticas.resumen ? `
                <div class="row mt-3">
                    <div class="col-12">
                        <div class="alert alert-info" style="border-radius: 12px; padding: 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;">
                            <h4 style="margin-bottom: 0.5rem;">
                                <i class="fas fa-info-circle"></i> Resumen Semanal
                            </h4>
                            <p style="font-size: 1.1rem; margin: 0;">${estadisticas.resumen}</p>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }

    // Sección de Datos Horarios (si están disponibles)
    if (data.hourly && data.hourly.time && data.hourly.time.length > 0) {
        html += `
            <div class="forecast-section" style="margin-top: 2rem;">
                <h3 class="forecast-title">
                    <i class="fas fa-clock"></i> Pronóstico Horario (Próximas 24 horas)
                </h3>
                <div class="chart-container" style="height: 300px; margin-bottom: 1rem;">
                    <canvas id="hourlyChart_${city.replace(/\s+/g, '_')}"></canvas>
                </div>
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i> 
                    <small>Grafíco que muestra la temperatura y precipitación prevista para las próximas 24 horas</small>
                </div>
            </div>
        `;
    }

    // Sección de Comparación de Modelos (si están disponibles)
    if (data.models && data.models.length > 0) {
        const comparacion = weatherApp.compararModelosMeteorologicos(city);
        if (comparacion) {
            html += `
                <div class="forecast-section" style="margin-top: 2rem;">
                    <h3 class="forecast-title">
                        <i class="fas fa-layer-group"></i> Comparación de Modelos Meteorológicos
                    </h3>
                    <div class="row g-3">
            `;

            data.models.forEach(modelo => {
                const promedios = comparacion.promedios[modelo.model] || {};
                html += `
                    <div class="col-12 col-md-4">
                        <div class="card" style="border-radius: 12px; padding: 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                            <h5 style="margin-bottom: 1rem; font-size: 1rem;">
                                <i class="fas fa-chart-line"></i> ${modelo.model.toUpperCase()}
                            </h5>
                            <div style="font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem;">
                                ${promedios.temperatura ? Math.round(promedios.temperatura) : '--'}°C
                            </div>
                            <div style="opacity: 0.9; font-size: 0.9rem;">
                                <div>Humedad: ${promedios.humedad ? Math.round(promedios.humedad) : '--'}%</div>
                                <div>Viento: ${promedios.viento ? Math.round(promedios.viento) : '--'} km/h</div>
                            </div>
                        </div>
                    </div>
                `;
            });

            if (comparacion.diferencias.length > 0) {
                html += `
                    <div class="col-12 mt-3">
                        <div class="alert alert-warning">
                            <h5><i class="fas fa-exclamation-triangle"></i> Diferencias Significativas Entre Modelos</h5>
                            <ul class="mb-0">
                `;
                comparacion.diferencias.forEach(diff => {
                    html += `
                        <li><strong>${diff.modelo1}</strong> vs <strong>${diff.modelo2}</strong>: 
                        ${diff.diferenciaTemperatura}°C de diferencia</li>
                    `;
                });
                html += `
                            </ul>
                        </div>
                    </div>
                `;
            }

            html += `
                    </div>
                </div>
            `;
        }
    }

    // Sección de Datos Históricos (tendencia)
    if (data.daily && data.daily.time && data.daily.time.length > 7) {
        // Dividir en histórico y pronóstico
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        let indiceHoy = -1;
        for (let i = 0; i < data.daily.time.length; i++) {
            const fecha = new Date(data.daily.time[i]);
            fecha.setHours(0, 0, 0, 0);
            if (fecha >= hoy) {
                indiceHoy = i;
                break;
            }
        }

        if (indiceHoy > 0) {
            const diasHistoricos = indiceHoy;
            const tempPromedioHistorica = data.daily.temperature_2m_max
                .slice(0, indiceHoy)
                .reduce((sum, temp) => sum + temp, 0) / diasHistoricos;

            html += `
                <div class="forecast-section" style="margin-top: 2rem;">
                    <h3 class="forecast-title">
                        <i class="fas fa-history"></i> Tendencia Histórica
                    </h3>
                    <div class="row g-3">
                        <div class="col-12 col-md-6">
                            <div class="card" style="border-radius: 12px; padding: 1.5rem; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white;">
                                <h4 style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 0.5rem;">
                                    <i class="fas fa-thermometer-half"></i> Últimos ${diasHistoricos} días
                                </h4>
                                <div style="font-size: 2.5rem; font-weight: bold;">
                                    ${Math.round(tempPromedioHistorica)}°C
                                </div>
                                <div style="opacity: 0.9; font-size: 0.9rem; margin-top: 0.5rem;">
                                    Temperatura promedio histórica
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="card" style="border-radius: 12px; padding: 1.5rem; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white;">
                                <h4 style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 0.5rem;">
                                    <i class="fas fa-calendar-alt"></i> Pronóstico
                                </h4>
                                <div style="font-size: 2.5rem; font-weight: bold;">
                                    ${data.daily.time.length - indiceHoy} días
                                </div>
                                <div style="opacity: 0.9; font-size: 0.9rem; margin-top: 0.5rem;">
                                    Días de pronóstico disponibles
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="chart-container mt-3" style="height: 250px;">
                        <canvas id="historicalChart_${city.replace(/\s+/g, '_')}"></canvas>
                    </div>
                </div>
            `;
        }
    }

    html += `<div id="dayDetail"></div>`;

    document.getElementById('detailContent').innerHTML = html;
    document.getElementById('home').style.display = 'none';
    document.getElementById('stats').style.display = 'none';
    document.getElementById('detail').style.display = 'block';

    // Renderizar gráficos después de insertar el HTML
    setTimeout(() => {
        console.log(`🔄 Intentando renderizar gráficos para ${city}...`);
        if (data.hourly && data.hourly.time && data.hourly.time.length > 0) {
            console.log(`📊 Datos horarios disponibles: ${data.hourly.time.length} horas`);
            renderHourlyChart(city, data);
        } else {
            console.warn(`⚠️ No hay datos horarios para ${city}`);
        }
        if (data.daily && data.daily.time && data.daily.time.length > 7) {
            console.log(`📊 Datos históricos disponibles: ${data.daily.time.length} días`);
            renderHistoricalChart(city, data);
        } else {
            console.warn(`⚠️ No hay suficientes datos históricos para ${city}`);
        }
    }, 200); // Aumentado a 200ms para asegurar que el DOM esté listo

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Mostrar mensaje de error en la interfaz
 * @param {string} mensaje - Mensaje de error
 */
function mostrarMensajeError(mensaje) {
    const container = document.getElementById('detailContent') || document.querySelector('.container-lg');
    if (container) {
        container.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-circle"></i> ${mensaje}
            </div>
        `;
    }
}

/**
 * Renderizar gráfico de datos horarios (próximas 24 horas)
 * @param {string} city - Nombre de la ciudad
 * @param {Object} data - Datos de clima con hourly
 */
function renderHourlyChart(city, data) {
    console.log(`🔍 renderHourlyChart llamado para ${city}`);
    console.log(`📦 Datos recibidos:`, { hasHourly: !!data?.hourly, hourlyLength: data?.hourly?.time?.length });

    const canvasId = `hourlyChart_${city.replace(/\s+/g, '_')}`;
    console.log(`🔍 Buscando canvas con ID: ${canvasId}`);

    const canvasElement = document.getElementById(canvasId);
    if (!canvasElement) {
        console.error(`❌ No se encontró el elemento canvas #${canvasId}. Elementos disponibles:`,
            Array.from(document.querySelectorAll('canvas')).map(c => c.id));
        return;
    }

    console.log(`✅ Canvas encontrado:`, canvasElement);

    // Verificar que data.hourly existe y tiene datos
    if (!data || !data.hourly || !data.hourly.time || data.hourly.time.length === 0) {
        console.error(`❌ No hay datos horarios válidos para ${city}`, data?.hourly);
        canvasElement.parentElement.innerHTML = '<div class="alert alert-info">No hay datos horarios disponibles para las próximas 24 horas.</div>';
        return;
    }

    console.log(`✅ Datos horarios disponibles: ${data.hourly.time.length} horas`);

    // Obtener hora actual en la zona horaria de Santiago
    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minutoActual = ahora.getMinutes();

    // Los datos horarios de la API ya vienen en 'America/Santiago' 
    // y comienzan desde la hora actual (próxima hora completa)
    // Tomar las próximas 24 horas directamente desde el inicio
    const horas24 = data.hourly.time.slice(0, 24);

    if (horas24.length === 0) {
        console.error(`❌ No hay datos horarios suficientes`);
        canvasElement.parentElement.innerHTML = '<div class="alert alert-info">No hay datos horarios disponibles.</div>';
        return;
    }

    console.log(`📊 Usando ${horas24.length} horas de pronóstico horario`);

    // Crear labels y datos para las próximas 24 horas
    const labels = [];
    const temperaturas = [];
    const precipitacion = [];

    for (let i = 0; i < horas24.length; i++) {
        const timestamp = horas24[i];
        const fechaHora = new Date(timestamp);

        // Formatear hora para mostrar
        const hora = fechaHora.getHours();
        const minuto = fechaHora.getMinutes();
        const horaFormateada = `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;

        labels.push(horaFormateada);

        // Obtener temperatura y precipitación del índice correspondiente
        const temp = data.hourly.temperature_2m?.[i];
        const prec = data.hourly.precipitation?.[i];

        temperaturas.push(temp ? Math.round(temp) : 0);
        precipitacion.push(prec && prec > 0 ? parseFloat(prec.toFixed(1)) : 0);
    }

    console.log(`📊 Datos horarios procesados:`, {
        horaActualLocal: `${String(horaActual).padStart(2, '0')}:${String(minutoActual).padStart(2, '0')}`,
        primeraHoraPronostico: labels[0] || 'N/A',
        ultimaHoraPronostico: labels[labels.length - 1] || 'N/A',
        totalHoras: labels.length,
        temperaturaActual: temperaturas[0] || 'N/A',
        temperaturasMuestra: temperaturas.slice(0, 5),
        horasConPrecipitacion: precipitacion.filter(p => p > 0).length
    });

    if (labels.length === 0 || temperaturas.length === 0) {
        console.error(`❌ No se generaron datos válidos para el gráfico`);
        canvasElement.parentElement.innerHTML = '<div class="alert alert-info">No se pudieron procesar los datos horarios.</div>';
        return;
    }


    // Destruir gráfico anterior si existe
    const chartKey = `hourlyChart_${city.replace(/\s+/g, '_')}`;
    if (window[chartKey] && typeof window[chartKey].destroy === 'function') {
        window[chartKey].destroy();
        delete window[chartKey];
    }

    // Obtener contexto 2D del canvas
    const ctx = canvasElement.getContext('2d');
    if (!ctx) {
        console.error(`❌ No se pudo obtener el contexto 2D del canvas #${canvasId}`);
        return;
    }

    console.log(`✅ Creando gráfico horario para ${city}: ${labels.length} horas, ${temperaturas.length} temperaturas, ${precipitacion.length} precipitaciones`);

    window[chartKey] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Temperatura (°C)',
                    data: temperaturas,
                    borderColor: '#ff9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    yAxisID: 'y',
                    fill: false,
                    pointRadius: 2
                },
                {
                    label: 'Precipitación (mm)',
                    data: precipitacion,
                    borderColor: '#2196f3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    yAxisID: 'y1',
                    fill: false,
                    pointRadius: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Temperatura (°C)',
                        color: '#ff9800'
                    },
                    ticks: {
                        callback: function (value) {
                            return value + '°C';
                        }
                    },
                    grid: {
                        drawOnChartArea: true
                    }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Precipitación (mm)',
                        color: '#2196f3'
                    },
                    ticks: {
                        callback: function (value) {
                            return value + 'mm';
                        }
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

/**
 * Renderizar gráfico de datos históricos vs pronóstico
 * @param {string} city - Nombre de la ciudad
 * @param {Object} data - Datos de clima con daily
 */
function renderHistoricalChart(city, data) {
    const canvasId = `historicalChart_${city.replace(/\s+/g, '_')}`;
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    let indiceHoy = -1;
    for (let i = 0; i < data.daily.time.length; i++) {
        const fecha = new Date(data.daily.time[i]);
        fecha.setHours(0, 0, 0, 0);
        if (fecha >= hoy) {
            indiceHoy = i;
            break;
        }
    }

    if (indiceHoy <= 0) return;

    const labels = data.daily.time.map(t => {
        const date = new Date(t);
        return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
    });

    const tempMax = data.daily.temperature_2m_max.map(t => Math.round(t));
    const tempMin = data.daily.temperature_2m_min.map(t => Math.round(t));

    // Destruir gráfico anterior si existe
    const chartKey = `historicalChart_${city.replace(/\s+/g, '_')}`;
    if (window[chartKey] && typeof window[chartKey].destroy === 'function') {
        window[chartKey].destroy();
        delete window[chartKey];
    }

    window[chartKey] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Temperatura Máxima',
                    data: tempMax,
                    borderColor: '#f5576c',
                    backgroundColor: 'rgba(245, 87, 108, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 3
                },
                {
                    label: 'Temperatura Mínima',
                    data: tempMin,
                    borderColor: '#4facfe',
                    backgroundColor: 'rgba(79, 172, 254, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Temperatura (°C)'
                    },
                    ticks: {
                        callback: function (value) {
                            return value + '°C';
                        }
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });

    // Dibujar línea vertical para marcar "hoy"
    const chartInstance = window[chartKey];
    if (chartInstance && chartInstance.chart && indiceHoy >= 0) {
        const originalDraw = chartInstance.draw;
        chartInstance.draw = function () {
            originalDraw.apply(this, arguments);
            const meta = this.getDatasetMeta(0);
            if (meta && meta.data[indiceHoy]) {
                const xPos = meta.data[indiceHoy].x;
                const ctx = this.ctx;
                ctx.save();
                ctx.strokeStyle = 'rgba(255, 99, 132, 0.6)';
                ctx.lineWidth = 2;
                ctx.setLineDash([10, 5]);
                ctx.beginPath();
                ctx.moveTo(xPos, this.chartArea.top);
                ctx.lineTo(xPos, this.chartArea.bottom);
                ctx.stroke();
                ctx.restore();
            }
        };
    }
}

/**
 * Show detail view for a lugar (static data - Módulo 4)
 */
function showLugarDetail(lugarId) {
    const lugar = buscarLugar(lugarId);
    if (!lugar) return;

    const estadisticas = calcularEstadisticas(lugar);
    if (!estadisticas) return;

    // Obtener icono según estado actual
    const estado = lugar.estadoActual.toLowerCase();
    let iconClass = 'fa-cloud';
    if (estado.includes('soleado')) iconClass = 'fa-sun';
    else if (estado.includes('lluvioso')) iconClass = 'fa-cloud-rain';

    let html = `
        <div class="detail-header">
            <h2><i class="fas fa-mountain"></i> ${lugar.nombre}</h2>
            <p class="text-center text-muted">Circuito ${lugar.circuito} - Torres del Paine</p>
            <div class="weather-details">
                <div class="detail-item">
                    <div class="detail-item__label">Temperatura Actual</div>
                    <div class="detail-item__value">${lugar.tempActual}°C</div>
                </div>
                <div class="detail-item">
                    <div class="detail-item__label">Estado</div>
                    <div class="detail-item__value">${lugar.estadoActual}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-item__label">Circuito</div>
                    <div class="detail-item__value">${lugar.circuito}</div>
                </div>
            </div>
        </div>
        
        <div class="forecast-section">
            <h3 class="forecast-title">
                <i class="fas fa-calendar-week"></i> Pronóstico Semanal
            </h3>
            <div class="row g-3">
    `;

    // Mostrar pronóstico semanal
    lugar.pronosticoSemanal.forEach((dia, index) => {
        let diaIconClass = 'fa-cloud';
        if (dia.estado.toLowerCase().includes('soleado')) diaIconClass = 'fa-sun';
        else if (dia.estado.toLowerCase().includes('lluvioso')) diaIconClass = 'fa-cloud-rain';

        html += `
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div class="forecast-card">
                    <div class="forecast-card__day">${dia.dia}</div>
                    <div style="font-size: 1.5rem; color: var(--secondary); margin: 0.5rem 0;">
                        <i class="fas ${diaIconClass}"></i>
                    </div>
                    <div class="forecast-card__temps">
                        <strong>${dia.max}°C</strong> / ${dia.min}°C
                    </div>
                    <div class="forecast-card__info">
                        <div style="text-align: center; width: 100%;">
                            <small>Estado</small>
                            <div class="forecast-card__info-value">${dia.estado}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>

        <div class="forecast-section" style="margin-top: 2rem;">
            <h3 class="forecast-title">
                <i class="fas fa-chart-bar"></i> Estadísticas de la Semana
            </h3>
            <div class="row g-3">
                <div class="col-12 col-md-4">
                    <div class="card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; padding: 1.5rem; text-align: center;">
                        <h4 style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 0.5rem;">Temperatura Mínima</h4>
                        <div style="font-size: 2.5rem; font-weight: bold;">${estadisticas.tempMinima}°C</div>
                    </div>
                </div>
                <div class="col-12 col-md-4">
                    <div class="card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border-radius: 12px; padding: 1.5rem; text-align: center;">
                        <h4 style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 0.5rem;">Temperatura Máxima</h4>
                        <div style="font-size: 2.5rem; font-weight: bold;">${estadisticas.tempMaxima}°C</div>
                    </div>
                </div>
                <div class="col-12 col-md-4">
                    <div class="card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border-radius: 12px; padding: 1.5rem; text-align: center;">
                        <h4 style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 0.5rem;">Temperatura Promedio</h4>
                        <div style="font-size: 2.5rem; font-weight: bold;">${estadisticas.tempPromedio}°C</div>
                    </div>
                </div>
            </div>

            <div class="row g-3 mt-3">
                <div class="col-12">
                    <div class="card" style="background: #f8f9fa; border-radius: 12px; padding: 1.5rem;">
                        <h4 style="margin-bottom: 1rem; color: #333;">
                            <i class="fas fa-calendar-check"></i> Días por Tipo de Clima
                        </h4>
                        <div class="row">
    `;

    // Mostrar contador de días por estado
    Object.keys(estadisticas.diasPorEstado).forEach(estado => {
        const cantidad = estadisticas.diasPorEstado[estado];
        html += `
            <div class="col-6 col-md-3 mb-2">
                <div style="background: white; padding: 1rem; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="font-size: 1.5rem; font-weight: bold; color: #667eea;">${cantidad}</div>
                    <div style="font-size: 0.85rem; color: #666; margin-top: 0.25rem;">${estado}</div>
                </div>
            </div>
        `;
    });

    html += `
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mt-3">
                <div class="col-12">
                    <div class="alert alert-info" style="border-radius: 12px; padding: 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;">
                        <h4 style="margin-bottom: 0.5rem;">
                            <i class="fas fa-info-circle"></i> Resumen Semanal
                        </h4>
                        <p style="font-size: 1.1rem; margin: 0;">${estadisticas.resumen}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('detailContent').innerHTML = html;
    document.getElementById('home').style.display = 'none';
    document.getElementById('stats').style.display = 'none';
    document.getElementById('detail').style.display = 'block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Mostrar información detallada para un día específico
 */
function showDayDetail(city, dayIndex) {
    const data = weatherApp.obtenerDatosClima(city);
    if (!data) return;

    const daily = data.daily;
    const max = Math.round(daily.temperature_2m_max[dayIndex]);
    const min = Math.round(daily.temperature_2m_min[dayIndex]);
    const rain = daily.precipitation_sum[dayIndex];
    const wind = Math.round(daily.wind_speed_10m_max[dayIndex]);
    const code = daily.weather_code[dayIndex];
    const desc = weatherApp.obtenerDescripcionClima(code);

    const date = new Date(daily.time[dayIndex]);
    const dayDate = date.toLocaleDateString('es-CL', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    const html = `
        <div class="day-detail show">
            <h3><i class="fas fa-calendar-day"></i> Detalle: ${dayDate}</h3>
            <p style="color: #666; font-size: 1.1rem; text-align: center; margin-bottom: 2rem;">${desc}</p>
            <div class="day-detail__grid">
                <div class="detail-item">
                    <div class="detail-item__label">Máxima</div>
                    <div class="detail-item__value">${max}°C</div>
                </div>
                <div class="detail-item">
                    <div class="detail-item__label">Mínima</div>
                    <div class="detail-item__value">${min}°C</div>
                </div>
                <div class="detail-item">
                    <div class="detail-item__label">Precipitación</div>
                    <div class="detail-item__value">${rain.toFixed(1)} mm</div>
                </div>
                <div class="detail-item">
                    <div class="detail-item__label">Viento Máximo</div>
                    <div class="detail-item__value">${wind} km/h</div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('dayDetail').innerHTML = html;
    document.getElementById('dayDetail').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

/**
 * Show Torres del Paine Detailed View
 */
async function showTorresDetail() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('detail').style.display = 'none';
    document.getElementById('stats').style.display = 'none';
    document.getElementById('torres-paine').style.display = 'block';

    // Actualizar clases activas usando el patrón del Módulo 2
    updateActiveNavLinks();

    // Configurar selector de modelos para Torres del Paine
    setupModelSelectorTorres();

    // Initialize map if not already done
    if (!torresMapInitialized) {
        // Esperar un momento para que el contenedor sea visible antes de inicializar
        setTimeout(async () => {
            await initializeTorresMap();
            torresMapInitialized = true;

            // Asegurar que el tamaño del mapa sea correcto
            setTimeout(() => {
                if (torresMap) {
                    torresMap.invalidateSize();
                }
            }, 200);
        }, 100);
    } else {
        // Si ya está inicializado, solo invalidar tamaño
        setTimeout(() => {
            if (torresMap) {
                torresMap.invalidateSize();
            }
        }, 200);
    }

    // Fetch and render weather data for Torres points
    await renderTorresWeatherPoints();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Inicializar mapa detallado de Torres del Paine
 * Usa mapa topográfico para mejor visualización de montañas y relieve
 * Incluye rutas de circuitos W y O, sectores y puntos de interés
 */
async function initializeTorresMap() {
    console.log('🗺️ Inicializando mapa de Torres del Paine...');

    const container = document.getElementById('torresMapContainer');
    if (!container) {
        console.error('❌ Contenedor del mapa no encontrado');
        return;
    }

    torresMap = L.map('torresMapContainer').setView([-50.95, -73.05], 11);

    // Usar mapa topográfico para mejor visualización de montañas
    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
    }).addTo(torresMap);

    console.log('✅ Mapa base cargado');

    // Cargar senderos reales desde archivos GPX (si están disponibles)
    // Esto reemplazará las rutas aproximadas con datos GPS reales
    try {
        if (typeof loadTorresPaineGPXTrails !== 'undefined') {
            const gpxTrails = await loadTorresPaineGPXTrails(torresMap);
            console.log('✅ Senderos GPX reales cargados');

            // Guardar referencias para control de visibilidad
            if (!window.torresMapLayerGroups) {
                window.torresMapLayerGroups = {
                    circuitos: L.layerGroup(),
                    sectoresW: L.layerGroup(),
                    sectoresO: L.layerGroup(),
                    puntosDestacados: L.layerGroup(),
                    puntosFoto: L.layerGroup(),
                    parkPolygon: null,
                    circuitoW: null,
                    circuitoO: null,
                    rutaConexion: null
                };
            }

            // Actualizar referencias con senderos GPX reales
            if (gpxTrails.circuitoW) {
                window.torresMapLayerGroups.circuitoW = gpxTrails.circuitoW;
            }
            if (gpxTrails.circuitoO) {
                window.torresMapLayerGroups.circuitoO = gpxTrails.circuitoO;
            }
        } else {
            console.warn('⚠️ loadTorresPaineGPXTrails no disponible, usando rutas aproximadas');
            dibujarRutasCircuitos();
        }
    } catch (error) {
        console.warn('⚠️ No se pudieron cargar senderos GPX, usando rutas aproximadas:', error);
        // Fallback: dibujar rutas aproximadas si no se pueden cargar los GPX
        dibujarRutasCircuitos();
    }

    // Agregar sectores y puntos de interés
    agregarSectoresYInteres();

    console.log('✅ Mapa de Torres del Paine inicializado completamente');

    // Agregar polígono aproximado del área del Parque Nacional Torres del Paine
    // Coordenadas aproximadas que delimitan el parque
    const areaTorresDelPaine = [
        [-50.75, -73.35],  // Noroeste
        [-50.75, -72.80],  // Noreste
        [-51.25, -72.80],  // Sureste
        [-51.25, -73.35],  // Suroeste
        [-50.75, -73.35]   // Cerrar polígono
    ];

    // Polígono semi-transparente con color que identifica la zona
    // Guardar referencia para control de visibilidad
    window.torresParkPolygon = L.polygon(areaTorresDelPaine, {
        color: '#4a90e2',      // Azul que identifica el parque
        fillColor: '#4a90e2',  // Color de relleno
        fillOpacity: 0.15,     // Opacidad baja para ver el mapa debajo
        weight: 3,
        dashArray: '10, 5',    // Línea punteada
        opacity: 0.8
    }).addTo(torresMap).bindPopup(`
        <div style="text-align: center;">
            <strong><i class="fas fa-mountain"></i> Parque Nacional Torres del Paine</strong><br>
            <small>Zona delimitada - Patagonia Chilena</small>
        </div>
    `);

    // Agregar marcador central con etiqueta del parque
    L.marker([-50.95, -73.05], {
        icon: L.divIcon({
            className: 'torres-park-label',
            html: '<div style="background: rgba(74, 144, 226, 0.95); color: white; padding: 8px 15px; border-radius: 8px; font-weight: bold; font-size: 1.1rem; border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.4); text-shadow: 1px 1px 2px rgba(0,0,0,0.3);"><i class="fas fa-mountain"></i> Parque Nacional Torres del Paine</div>',
            iconSize: [280, 40],
            iconAnchor: [140, 20]
        })
    }).addTo(torresMap);

    // Agregar leyenda al mapa (ajustada para no sobrepasar) - INTERACTIVA
    const leyenda = L.control({ position: 'bottomright' });
    leyenda.onAdd = function () {
        const div = L.DomUtil.create('div', 'torres-map-legend');
        // Evitar que sobrepase el mapa
        div.style.maxHeight = 'calc(100vh - 300px)';
        div.style.overflowY = 'auto';
        div.innerHTML = `
            <h5><i class="fas fa-info-circle"></i> Leyenda del Mapa</h5>
            <div class="torres-map-legend-item clickable-legend-item" data-type="park" style="cursor: pointer; padding: 5px; border-radius: 5px; transition: background 0.2s;">
                <span class="legend-park-area" style="width: 28px; height: 28px; border-radius: 6px;"></span>
                <span>Área del Parque Nacional</span>
                <button class="btn btn-sm btn-outline-primary legend-action-btn" style="display: none; margin-left: auto; padding: 2px 8px; font-size: 0.75rem;">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #ddd;">
                <strong style="font-size: 1.1rem; color: #1e3c72;">Circuitos de Trekking:</strong>
            </div>
            <div class="torres-map-legend-item clickable-legend-item" data-type="circuito-w" style="cursor: pointer; padding: 5px; border-radius: 5px; transition: background 0.2s;">
                <span style="background: #ff9800; width: 40px; height: 6px; display: inline-block; border-radius: 3px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></span>
                <span>Circuito W (4-5 días)</span>
                <button class="btn btn-sm btn-outline-primary legend-action-btn" style="display: none; margin-left: auto; padding: 2px 8px; font-size: 0.75rem;">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
            <div class="torres-map-legend-item clickable-legend-item" data-type="circuito-o" style="cursor: pointer; padding: 5px; border-radius: 5px; transition: background 0.2s;">
                <span style="background: #ffc107; width: 40px; height: 6px; display: inline-block; border-radius: 3px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></span>
                <span>Circuito O (7-10 días)</span>
                <button class="btn btn-sm btn-outline-primary legend-action-btn" style="display: none; margin-left: auto; padding: 2px 8px; font-size: 0.75rem;">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
            <div class="torres-map-legend-item clickable-legend-item" data-type="ruta-conexion" style="cursor: pointer; padding: 5px; border-radius: 5px; transition: background 0.2s;">
                <span style="background: #2196f3; width: 40px; height: 6px; display: inline-block; border-radius: 3px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></span>
                <span>Ruta de conexión</span>
                <button class="btn btn-sm btn-outline-primary legend-action-btn" style="display: none; margin-left: auto; padding: 2px 8px; font-size: 0.75rem;">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #ddd;">
                <strong style="font-size: 1.1rem; color: #1e3c72;">Puntos de Interés:</strong>
            </div>
            <div class="torres-map-legend-item clickable-legend-item" data-type="sectores-w" style="cursor: pointer; padding: 5px; border-radius: 5px; transition: background 0.2s;">
                <span style="background: #ff9800; border-radius: 50%; width: 28px; height: 28px; display: inline-block; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></span>
                <span>Sectores Circuito W</span>
                <button class="btn btn-sm btn-outline-primary legend-action-btn" style="display: none; margin-left: auto; padding: 2px 8px; font-size: 0.75rem;">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
            <div class="torres-map-legend-item clickable-legend-item" data-type="sectores-o" style="cursor: pointer; padding: 5px; border-radius: 5px; transition: background 0.2s;">
                <span style="background: #ffc107; border-radius: 50%; width: 28px; height: 28px; display: inline-block; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></span>
                <span>Sectores Circuito O</span>
                <button class="btn btn-sm btn-outline-primary legend-action-btn" style="display: none; margin-left: auto; padding: 2px 8px; font-size: 0.75rem;">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
            <div class="torres-map-legend-item clickable-legend-item" data-type="puntos-destacados" style="cursor: pointer; padding: 5px; border-radius: 5px; transition: background 0.2s;">
                <span style="background: #ffd700; border-radius: 50%; width: 32px; height: 32px; display: inline-block; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.4);"></span>
                <span>Puntos destacados</span>
                <button class="btn btn-sm btn-outline-primary legend-action-btn" style="display: none; margin-left: auto; padding: 2px 8px; font-size: 0.75rem;">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
            <div class="torres-map-legend-item clickable-legend-item" data-type="puntos-foto" style="cursor: pointer; padding: 5px; border-radius: 5px; transition: background 0.2s;">
                <span style="background: #4caf50; border-radius: 50%; width: 28px; height: 28px; display: inline-block; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                    <i class="fas fa-camera" style="color: white; font-size: 14px; display: flex; align-items: center; justify-content: center; height: 100%;"></i>
                </span>
                <span>Puntos de vista fotográfico</span>
                <button class="btn btn-sm btn-outline-primary legend-action-btn" style="display: none; margin-left: auto; padding: 2px 8px; font-size: 0.75rem;">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
            <div style="margin-top: 10px; padding-top: 10px; border-top: 2px solid #ddd;">
                <small class="text-muted" style="font-size: 0.75rem;">
                    <i class="fas fa-hand-pointer"></i> Haz click en un elemento para crear botones de acción
                </small>
            </div>
        `;

        // Agregar eventos de click a cada elemento clickeable
        L.DomEvent.disableClickPropagation(div);

        const clickableItems = div.querySelectorAll('.clickable-legend-item');
        clickableItems.forEach(item => {
            // Efecto hover
            item.addEventListener('mouseenter', function () {
                this.style.background = 'rgba(30, 60, 114, 0.1)';
                const btn = this.querySelector('.legend-action-btn');
                if (btn) btn.style.display = 'block';
            });

            item.addEventListener('mouseleave', function () {
                this.style.background = '';
                const btn = this.querySelector('.legend-action-btn');
                if (btn && !btn.classList.contains('active')) {
                    btn.style.display = 'none';
                }
            });

            // Click para crear/activar botones
            item.addEventListener('click', function (e) {
                e.stopPropagation();
                const type = this.getAttribute('data-type');
                toggleLegendItemActions(type, this);
            });

            // Prevenir click en el botón de propagar
            const btn = item.querySelector('.legend-action-btn');
            if (btn) {
                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const type = item.getAttribute('data-type');
                    toggleLegendItemActions(type, item);
                });
            }
        });

        return div;
    };
    leyenda.addTo(torresMap);

    // Agregar overlay de color sutil para identificar la zona de montañas
    // Capa de color semi-transparente sobre el área montañosa
    const areaMontañosa = [
        [-50.80, -73.30],
        [-50.80, -72.85],
        [-51.20, -72.85],
        [-51.20, -73.30],
        [-50.80, -73.30]
    ];

    L.polygon(areaMontañosa, {
        color: '#5a7fa0',
        fillColor: '#5a7fa0',
        fillOpacity: 0.08,
        weight: 2,
        opacity: 0.5
    }).addTo(torresMap);

    setTimeout(() => {
        torresMap.invalidateSize();
    }, 100);

    // Inicializar capas para control de visibilidad
    if (!window.torresMapLayers) {
        window.torresMapLayers = {
            park: true,
            circuitoW: true,
            circuitoO: true,
            rutaConexion: true,
            sectoresW: true,
            sectoresO: true,
            puntosDestacados: true,
            puntosFoto: true
        };
    }
}

/**
 * Toggle acciones de elementos de la leyenda
 * Crea botones de acción cuando se hace click en un elemento
 */
function toggleLegendItemActions(type, itemElement) {
    if (!itemElement) return;

    const btn = itemElement.querySelector('.legend-action-btn');
    if (!btn) return;

    // Si ya hay botones creados, mostrarlos/ocultarlos
    let actionButtons = itemElement.querySelector('.legend-action-buttons');

    if (actionButtons && actionButtons.style.display !== 'none') {
        // Ocultar botones existentes
        actionButtons.style.display = 'none';
        btn.classList.remove('active');
        btn.innerHTML = '<i class="fas fa-eye"></i>';
    } else {
        // Crear o mostrar botones de acción
        if (!actionButtons) {
            actionButtons = document.createElement('div');
            actionButtons.className = 'legend-action-buttons';
            actionButtons.style.cssText = 'margin-top: 8px; padding-top: 8px; border-top: 1px solid #ddd; display: flex; gap: 5px; flex-wrap: wrap;';
            itemElement.appendChild(actionButtons);
        }

        // Crear botones según el tipo
        actionButtons.innerHTML = '';

        const buttons = getActionButtonsForType(type);
        buttons.forEach(buttonConfig => {
            const actionBtn = document.createElement('button');
            actionBtn.className = `btn btn-sm ${buttonConfig.class}`;
            actionBtn.innerHTML = `<i class="${buttonConfig.icon}"></i> ${buttonConfig.text}`;
            actionBtn.style.cssText = 'padding: 4px 10px; font-size: 0.8rem; flex: 1 1 auto;';
            actionBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                buttonConfig.action(type, itemElement);
            });
            actionButtons.appendChild(actionBtn);
        });

        actionButtons.style.display = 'flex';
        btn.classList.add('active');
        btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    }
}

/**
 * Obtener botones de acción según el tipo de elemento de la leyenda
 */
function getActionButtonsForType(type) {
    const commonButtons = [
        {
            class: 'btn-outline-success',
            icon: 'fas fa-search-plus',
            text: 'Enfocar',
            action: (t, el) => {
                focusOnLegendItem(t);
                mostrarMensajeExito(`Enfocando en ${getLegendItemName(t)}`);
            }
        },
        {
            class: 'btn-outline-info',
            icon: 'fas fa-info-circle',
            text: 'Info',
            action: (t, el) => {
                showLegendItemInfo(t);
            }
        }
    ];

    const typeSpecificButtons = {
        'park': [
            {
                class: 'btn-outline-primary',
                icon: 'fas fa-toggle-on',
                text: 'Mostrar/Ocultar',
                action: (t, el) => {
                    toggleLayerVisibility('park');
                    mostrarMensajeExito('Área del parque ' + (window.torresMapLayers.park ? 'visible' : 'oculta'));
                }
            }
        ],
        'circuito-w': [
            {
                class: 'btn-outline-primary',
                icon: 'fas fa-toggle-on',
                text: 'Mostrar/Ocultar',
                action: (t, el) => {
                    toggleLayerVisibility('circuitoW');
                    mostrarMensajeExito('Circuito W ' + (window.torresMapLayers.circuitoW ? 'visible' : 'oculta'));
                }
            },
            {
                class: 'btn-outline-warning',
                icon: 'fas fa-route',
                text: 'Solo W',
                action: (t, el) => {
                    showOnlyCircuit('W');
                }
            }
        ],
        'circuito-o': [
            {
                class: 'btn-outline-primary',
                icon: 'fas fa-toggle-on',
                text: 'Mostrar/Ocultar',
                action: (t, el) => {
                    toggleLayerVisibility('circuitoO');
                    mostrarMensajeExito('Circuito O ' + (window.torresMapLayers.circuitoO ? 'visible' : 'oculta'));
                }
            },
            {
                class: 'btn-outline-warning',
                icon: 'fas fa-route',
                text: 'Solo O',
                action: (t, el) => {
                    showOnlyCircuit('O');
                }
            }
        ],
        'sectores-w': [
            {
                class: 'btn-outline-primary',
                icon: 'fas fa-filter',
                text: 'Filtrar',
                action: (t, el) => {
                    filterMarkersByType('sectoresW');
                }
            }
        ],
        'sectores-o': [
            {
                class: 'btn-outline-primary',
                icon: 'fas fa-filter',
                text: 'Filtrar',
                action: (t, el) => {
                    filterMarkersByType('sectoresO');
                }
            }
        ],
        'puntos-destacados': [
            {
                class: 'btn-outline-primary',
                icon: 'fas fa-filter',
                text: 'Filtrar',
                action: (t, el) => {
                    filterMarkersByType('puntosDestacados');
                }
            }
        ],
        'puntos-foto': [
            {
                class: 'btn-outline-primary',
                icon: 'fas fa-filter',
                text: 'Filtrar',
                action: (t, el) => {
                    filterMarkersByType('puntosFoto');
                }
            }
        ]
    };

    return [...commonButtons, ...(typeSpecificButtons[type] || [])];
}

/**
 * Funciones de acción para los botones
 */
function getLegendItemName(type) {
    const names = {
        'park': 'Área del Parque Nacional',
        'circuito-w': 'Circuito W',
        'circuito-o': 'Circuito O',
        'ruta-conexion': 'Ruta de conexión',
        'sectores-w': 'Sectores Circuito W',
        'sectores-o': 'Sectores Circuito O',
        'puntos-destacados': 'Puntos destacados',
        'puntos-foto': 'Puntos de vista fotográfico'
    };
    return names[type] || type;
}

function focusOnLegendItem(type) {
    if (!torresMap) return;

    // Definir bounds según el tipo
    const bounds = {
        'park': [[-50.75, -73.35], [-51.25, -72.80]],
        'circuito-w': [[-50.95, -73.25], [-51.05, -73.05]],
        'circuito-o': [[-50.90, -73.30], [-51.15, -72.90]],
        'sectores-w': [[-50.95, -73.25], [-51.05, -73.05]],
        'sectores-o': [[-50.90, -73.30], [-51.15, -72.90]]
    };

    if (bounds[type]) {
        torresMap.fitBounds(bounds[type], { padding: [50, 50] });
    }
}

function showLegendItemInfo(type) {
    const info = {
        'park': 'El Parque Nacional Torres del Paine es una de las áreas protegidas más importantes de Chile, declarado Reserva de la Biosfera por la UNESCO.',
        'circuito-w': 'El Circuito W es el trekking más popular del parque, con una duración de 4-5 días. Recorre los principales atractivos: Torres, Valle del Francés y Glaciar Grey.',
        'circuito-o': 'El Circuito O es el trekking completo alrededor de las Torres, con una duración de 7-10 días. Incluye el Circuito W y se extiende hacia el norte.',
        'sectores-w': 'Sectores principales del Circuito W: Grey, Paine Grande, Francés, y Torres.',
        'sectores-o': 'Sectores principales del Circuito O: incluye todos los del W más Dickson, Los Perros, y Paso John Gardner.'
    };

    const message = info[type] || `Información sobre ${getLegendItemName(type)}`;
    alert(message);
}

function toggleLayerVisibility(layerType) {
    if (!window.torresMapLayers) return;

    window.torresMapLayers[layerType] = !window.torresMapLayers[layerType];

    // Implementar lógica para mostrar/ocultar capas en el mapa
    // Esto requeriría guardar referencias a las capas cuando se crean
    console.log(`Toggle layer ${layerType}: ${window.torresMapLayers[layerType]}`);
}

function showOnlyCircuit(circuit) {
    if (!torresMap) return;

    // Mostrar solo el circuito especificado
    mostrarMensajeExito(`Mostrando solo Circuito ${circuit}`);
    console.log(`Mostrar solo Circuito ${circuit}`);
}

function filterMarkersByType(type) {
    if (!torresMap) return;

    // Filtrar marcadores por tipo
    mostrarMensajeExito(`Filtrando ${getLegendItemName(type)}`);
    console.log(`Filtrar marcadores: ${type}`);
}

/**
 * Dibujar rutas de los circuitos W y O en el mapa
 */
function dibujarRutasCircuitos() {
    if (!torresMap) {
        console.error('❌ No se puede dibujar rutas: torresMap no está inicializado');
        return;
    }
    console.log('✅ Dibujando rutas de circuitos...');

    // Definir rutas más precisas basadas en coordenadas reales del parque
    // Ajustadas a la topografía real: siguen valles, evitan lagos/glaciares, pasan por senderos reales

    // Circuito W - forma de W más precisa siguiendo topografía real
    // Oeste a Este, siguiendo valles y senderos marcados
    const rutaCircuitoW = [
        [-51.0, -73.23],       // Refugio Grey (lago Grey, extremo oeste)
        [-50.98, -73.20],        // Borde sur del lago Grey (siguiendo costa)
        [-50.97, -73.17],        // Acercándose al Paine Grande (valle)
        [-50.955, -73.14],       // Aproximación Paine Grande por valle
        [-50.9500, -73.1167],    // Refugio Paine Grande (lago Pehoé) - Sector W
        [-50.952, -73.10],       // Salida Paine Grande hacia valle
        [-50.9583, -73.0667],    // Campamento Italiano (entrada Valle Francés)
        [-50.965, -73.08],       // Ascenso por Valle Francés (borde valle)
        [-50.9667, -73.0833],    // Mirador Valle Francés (centro valle)
        [-50.962, -73.075],      // Salida Valle Francés (siguiendo valle)
        [-50.955, -73.05],       // Aproximación a Cuernos (valle entre montañas)
        [-50.948, -73.03],       // Borde este de Los Cuernos (valle)
        [-50.938, -73.02],       // Sector Cuernos - mirador (valle)
        [-50.942, -73.01],       // Aproximación a Torres (valle ascendente)
        [-50.943, -72.99],       // Subida a Base Torres (valle)
        [-50.9417, -72.9667],    // Base Torres / Sector Chileno (valle alto)
        [-50.942, -72.96],       // Descenso desde Torres (valle)
        [-50.9417, -72.95]       // Hotel Las Torres / Sector Central (valle, extremo este)
    ];

    // Circuito O - circuito completo siguiendo topografía real
    // Rodea el macizo Paine siguiendo valles y pasos de montaña
    const rutaCircuitoO = [
        // Este a Norte (parte superior del circuito)
        [-50.9417, -72.95],      // Hotel Las Torres / Sector Central (inicio este)
        [-50.940, -72.94],       // Valle hacia Serón (noreste, siguiendo río)
        [-50.938, -72.93],       // Aproximación Serón (valle)
        [-50.935, -72.92],       // Sector Serón (valle, noreste)
        [-50.92, -72.94],        // Continuación valle hacia norte
        [-50.90, -72.96],        // Aproximación Dickson (valle del río)
        [-50.88, -72.98],        // Sector Dickson (valle, norte)
        [-50.86, -73.00],        // Continuación hacia Perros (valle)
        [-50.84, -73.03],        // Aproximación Perros (valle ascendente)
        [-50.82, -73.06],        // Sector Perros (valle alto, noroeste)
        [-50.815, -73.08],       // Aproximación Paso Gardner (ascenso)
        [-50.81, -73.10],        // Paso John Gardner (paso de montaña)
        [-50.82, -73.13],        // Descenso desde paso (valle oeste)
        [-50.85, -73.16],        // Valle hacia Grey (siguiendo glaciar)
        [-50.90, -73.19],        // Aproximación Grey (valle)
        [-50.95, -73.21],        // Aproximación refugio Grey (valle)
        [-51.0, -73.23],         // Refugio Grey (lago Grey, oeste)

        // Oeste a Este (comparte ruta con Circuito W)
        [-50.98, -73.20],        // Borde sur lago Grey
        [-50.97, -73.17],        // Valle hacia Paine Grande
        [-50.955, -73.14],       // Aproximación Paine Grande
        [-50.9500, -73.1167],    // Refugio Paine Grande (Sector W)
        [-50.952, -73.10],       // Valle salida Paine Grande
        [-50.9583, -73.0667],    // Campamento Italiano
        [-50.965, -73.08],       // Valle Francés (ascenso)
        [-50.9667, -73.0833],    // Mirador Valle Francés
        [-50.962, -73.075],      // Valle Francés (salida)
        [-50.955, -73.05],       // Valle hacia Cuernos
        [-50.948, -73.03],       // Borde Cuernos
        [-50.938, -73.02],       // Sector Cuernos
        [-50.942, -73.01],       // Valle hacia Torres
        [-50.943, -72.99],       // Subida Torres
        [-50.9417, -72.9667],    // Base Torres / Sector Chileno
        [-50.942, -72.96],       // Valle descenso Torres
        [-50.9417, -72.95]       // Hotel Las Torres (cierre circuito)
    ];

    // Ruta azul - conexión directa Hotel Las Torres - Sector Chileno
    // Ajustada para seguir el sendero real (valle ascendente)
    const rutaAzul = [
        [-50.9417, -72.95],    // Hotel Las Torres (valle bajo)
        [-50.942, -72.955],    // Inicio subida (valle)
        [-50.942, -72.96],     // Parte media del valle
        [-50.9417, -72.9667]   // Sector Chileno / Base Torres (valle alto)
    ];

    // Inicializar grupos de capas para control de visibilidad
    if (!window.torresMapLayerGroups) {
        window.torresMapLayerGroups = {
            circuitos: L.layerGroup(),
            sectoresW: L.layerGroup(),
            sectoresO: L.layerGroup(),
            puntosDestacados: L.layerGroup(),
            puntosFoto: L.layerGroup(),
            parkPolygon: null,
            circuitoW: null,
            circuitoO: null,
            rutaConexion: null
        };
    }

    // Dibujar Circuito W (naranja) - ajustado topográficamente
    // Guardar referencia para control de visibilidad
    // Usar smoothFactor más bajo para seguir mejor la topografía
    window.torresMapLayerGroups.circuitoW = L.polyline(rutaCircuitoW, {
        color: '#ff9800',
        weight: 6,
        opacity: 0.85,
        smoothFactor: 0.3,  // Menor suavizado para seguir mejor la topografía
        lineCap: 'round',
        lineJoin: 'round'
    }).addTo(torresMap).bindPopup(`
        <div style="text-align: center; padding: 8px;">
            <strong><i class="fas fa-route"></i> Circuito W</strong><br>
            <small>Ruta en forma de W - Duración: 4-5 días</small><br>
            <small style="color: #666;"><i class="fas fa-mountain"></i> Sigue senderos reales y topografía</small>
        </div>
    `);
    window.torresMapLayerGroups.circuitos.addLayer(window.torresMapLayerGroups.circuitoW);

    // Dibujar Circuito O (amarillo) - ajustado topográficamente
    // Guardar referencia para control de visibilidad
    // Usar smoothFactor más bajo para seguir mejor la topografía
    window.torresMapLayerGroups.circuitoO = L.polyline(rutaCircuitoO, {
        color: '#ffc107',
        weight: 6,
        opacity: 0.85,
        smoothFactor: 0.3,  // Menor suavizado para seguir mejor la topografía
        lineCap: 'round',
        lineJoin: 'round'
    }).addTo(torresMap).bindPopup(`
        <div style="text-align: center; padding: 8px;">
            <strong><i class="fas fa-route"></i> Circuito O</strong><br>
            <small>Circuito completo - Duración: 7-10 días</small><br>
            <small style="color: #666;"><i class="fas fa-mountain"></i> Sigue senderos reales y topografía</small>
        </div>
    `);
    window.torresMapLayerGroups.circuitos.addLayer(window.torresMapLayerGroups.circuitoO);

    // Dibujar ruta azul (conexión) - ruta ajustada topográficamente
    // Guardar referencia para control de visibilidad
    window.torresMapLayerGroups.rutaConexion = L.polyline(rutaAzul, {
        color: '#2196f3',
        weight: 5,
        opacity: 0.75,
        smoothFactor: 0.3,  // Menor suavizado para seguir mejor la topografía
        dashArray: '10, 5',
        lineCap: 'round',
        lineJoin: 'round'
    }).addTo(torresMap).bindPopup(`
        <div style="text-align: center; padding: 8px;">
            <strong><i class="fas fa-route"></i> Ruta de Conexión</strong><br>
            <small>Acceso directo Hotel Las Torres - Sector Chileno</small><br>
            <small style="color: #666;"><i class="fas fa-mountain"></i> Sigue valle ascendente</small>
        </div>
    `);
    window.torresMapLayerGroups.circuitos.addLayer(window.torresMapLayerGroups.rutaConexion);
}

/**
 * Agregar sectores y puntos de interés al mapa
 */
function agregarSectoresYInteres() {
    if (!torresMap) {
        console.error('❌ No se pueden agregar sectores: torresMap no está inicializado');
        return;
    }
    console.log('✅ Agregando sectores y puntos de interés...');

    // Definir sectores
    const sectores = {
        // Circuito W
        "Sector Grey": { lat: -51.0, lon: -73.23, circuito: "W", icon: "fa-snowflake", servicios: ["bed", "tent", "wifi", "shower"] },
        "Sector Paine Grande": { lat: -50.9500, lon: -73.1167, circuito: "W", icon: "fa-house", servicios: ["bed", "tent", "wifi", "shower"] },
        "Sector Francés": { lat: -50.9667, lon: -73.0833, circuito: "W", icon: "fa-tree", servicios: ["bed", "tent", "wifi", "shower"] },
        "Sector Cuernos": { lat: -50.9333, lon: -73.0167, circuito: "W", icon: "fa-mountain", servicios: ["bed", "tent", "wifi", "shower"] },
        "Sector Chileno": { lat: -50.9417, lon: -72.9667, circuito: "W", icon: "fa-campground", servicios: ["bed", "tent", "wifi", "shower"] },
        "Sector Central": { lat: -50.9417, lon: -72.95, circuito: "W", icon: "fa-building", servicios: ["bed", "tent", "wifi", "shower"] },
        // Circuito O
        "Sector Serón": { lat: -50.88, lon: -72.92, circuito: "O", icon: "fa-campground", servicios: ["bed", "tent", "wifi", "shower"] },
        "Sector Dickson": { lat: -50.85, lon: -73.05, circuito: "O", icon: "fa-campground", servicios: ["bed", "tent"] },
        "Sector Perros": { lat: -50.82, lon: -73.12, circuito: "O", icon: "fa-campground", servicios: ["tent"] }
    };

    // Puntos de interés especiales - coordenadas ajustadas
    const puntosInteres = {
        "Hotel Las Torres": { lat: -50.942, lon: -72.95, icon: "fa-hotel", servicios: ["bed", "food", "wifi", "person", "shower"], destacado: true },
        "Centro de Bienvenida": { lat: -50.94, lon: -72.945, icon: "fa-info-circle", servicios: ["bus", "wifi", "shower"] },
        "Las Torres": { lat: -50.945, lon: -72.975, icon: "fa-mountain", destacado: true, esVista: true }
    };

    // Puntos de vista fotográficos
    const puntosVista = [
        { lat: -50.945, lon: -72.98, nombre: "Vista Las Torres" },
        { lat: -50.96, lon: -73.08, nombre: "Mirador Valle Francés" },
        { lat: -50.93, lon: -73.02, nombre: "Vista Los Cuernos" },
        { lat: -50.95, lon: -73.11, nombre: "Vista Lago Pehoé" },
        { lat: -51.0, lon: -73.23, nombre: "Vista Glaciar Grey" }
    ];

    // Inicializar arrays de marcadores si no existen
    if (!window.torresStaticMarkers) {
        window.torresStaticMarkers = {
            sectoresW: [],
            sectoresO: [],
            puntosDestacados: [],
            puntosFoto: []
        };
    }

    // Agregar sectores
    Object.entries(sectores).forEach(([nombre, sector]) => {
        const color = sector.circuito === "W" ? "#ff9800" : "#ffc107";

        const marker = L.marker([sector.lat, sector.lon], {
            icon: L.divIcon({
                className: 'sector-marker',
                html: `
                    <div style="
                        background: ${color};
                        color: white;
                        border-radius: 50%;
                        width: 30px;
                        height: 30px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border: 3px solid white;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                        font-size: 14px;
                    ">
                        <i class="fas ${sector.icon}"></i>
                    </div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        });

        // Guardar referencia según el circuito
        if (sector.circuito === "W") {
            window.torresStaticMarkers.sectoresW.push(marker);
            window.torresMapLayerGroups.sectoresW.addLayer(marker);
        } else {
            window.torresStaticMarkers.sectoresO.push(marker);
            window.torresMapLayerGroups.sectoresO.addLayer(marker);
        }

        marker.addTo(torresMap);

        // Crear HTML de servicios
        const serviciosHTML = sector.servicios.map(serv => {
            const iconos = {
                bed: "fa-bed",
                tent: "fa-campground",
                wifi: "fa-wifi",
                shower: "fa-shower",
                food: "fa-utensils",
                person: "fa-user",
                bus: "fa-bus"
            };
            return `<i class="fas ${iconos[serv] || 'fa-circle'}"></i>`;
        }).join(' ');

        marker.bindPopup(`
            <div style="min-width: 200px;">
                <h5 style="margin: 0 0 10px 0; color: ${color};">
                    <i class="fas ${sector.icon}"></i> ${nombre}
                </h5>
                <p style="margin: 5px 0; font-size: 0.9rem;">
                    <strong>Circuito:</strong> ${sector.circuito}
                </p>
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd;">
                    <strong>Servicios:</strong><br>
                    <div style="font-size: 1.2rem; color: #666; margin-top: 5px;">
                        ${serviciosHTML}
                    </div>
                </div>
            </div>
        `);
    });

    // Agregar puntos de interés destacados
    Object.entries(puntosInteres).forEach(([nombre, punto]) => {
        const color = punto.destacado ? "#ffd700" : "#2196f3";
        const size = punto.destacado ? 40 : 30;

        const marker = L.marker([punto.lat, punto.lon], {
            icon: L.divIcon({
                className: 'interest-marker',
                html: `
                    <div style="
                        background: ${color};
                        color: white;
                        border-radius: 50%;
                        width: ${size}px;
                        height: ${size}px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border: 3px solid white;
                        box-shadow: 0 3px 8px rgba(0,0,0,0.4);
                        font-size: ${punto.destacado ? '18px' : '14px'};
                    ">
                        <i class="fas ${punto.icon}"></i>
                    </div>
                `,
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2]
            })
        });

        // Guardar referencia según el tipo
        if (punto.destacado) {
            window.torresStaticMarkers.puntosDestacados.push(marker);
            window.torresMapLayerGroups.puntosDestacados.addLayer(marker);
        }
        if (punto.esVista) {
            window.torresStaticMarkers.puntosFoto.push(marker);
            window.torresMapLayerGroups.puntosFoto.addLayer(marker);
        }

        marker.addTo(torresMap);

        const serviciosHTML = punto.servicios ? punto.servicios.map(serv => {
            const iconos = {
                bed: "fa-bed",
                tent: "fa-campground",
                wifi: "fa-wifi",
                shower: "fa-shower",
                food: "fa-utensils",
                person: "fa-user",
                bus: "fa-bus"
            };
            return `<i class="fas ${iconos[serv] || 'fa-circle'}"></i>`;
        }).join(' ') : '';

        marker.bindPopup(`
            <div style="min-width: 220px;">
                <h4 style="margin: 0 0 10px 0; color: ${color};">
                    <i class="fas ${punto.icon}"></i> ${nombre}
                </h4>
                ${punto.servicios ? `
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd;">
                    <strong>Servicios:</strong><br>
                    <div style="font-size: 1.2rem; color: #666; margin-top: 5px;">
                        ${serviciosHTML}
                    </div>
                </div>
                ` : ''}
            </div>
        `);
    });

    // Agregar puntos de vista fotográficos (cámaras verdes)
    puntosVista.forEach(punto => {
        const marker = L.marker([punto.lat, punto.lon], {
            icon: L.divIcon({
                className: 'viewpoint-marker',
                html: `
                    <div style="
                        background: #4caf50;
                        color: white;
                        border-radius: 50%;
                        width: 25px;
                        height: 25px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border: 2px solid white;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                        font-size: 12px;
                    ">
                        <i class="fas fa-camera"></i>
                    </div>
                `,
                iconSize: [25, 25],
                iconAnchor: [12.5, 12.5]
            })
        });

        // Guardar referencia
        window.torresStaticMarkers.puntosFoto.push(marker);
        window.torresMapLayerGroups.puntosFoto.addLayer(marker);

        marker.addTo(torresMap).bindPopup(`
            <div style="text-align: center;">
                <i class="fas fa-camera" style="color: #4caf50; font-size: 1.5rem;"></i><br>
                <strong>${punto.nombre}</strong><br>
                <small>Punto de vista fotográfico</small>
            </div>
        `);
    });
}

/**
 * Render weather points for Torres del Paine
 * Muestra los lugares estáticos de circuitos W y O con estadísticas
 */
async function renderTorresWeatherPoints() {
    const container = document.getElementById('torresWeatherPoints');
    container.innerHTML = '<div class="col-12 text-center"><i class="fas fa-spinner fa-spin fa-2x"></i><p>Cargando datos meteorológicos...</p></div>';

    try {
        // Usar datos estáticos de lugares de Torres del Paine
        if (!lugares || lugares.length === 0) {
            container.innerHTML = '<div class="col-12"><div class="alert alert-warning">No se encontraron lugares de Torres del Paine.</div></div>';
            return;
        }

        // Clear loading message
        container.innerHTML = '';

        // NO eliminar todos los marcadores - solo limpiar marcadores meteorológicos antiguos
        // Los marcadores de sectores, rutas y puntos de interés deben mantenerse
        // Solo eliminar marcadores meteorológicos que tengan clase específica
        if (torresMap && window.torresWeatherMarkers) {
            window.torresWeatherMarkers.forEach(marker => {
                if (torresMap.hasLayer(marker)) {
                    torresMap.removeLayer(marker);
                }
            });
        }
        window.torresWeatherMarkers = []; // Resetear array de marcadores

        // Render cada lugar de Torres del Paine con sus estadísticas
        lugares.forEach(lugar => {
            renderTorresLugarCard(lugar, container);
            const marker = addTorresLugarMarker(lugar);
            if (marker) {
                window.torresWeatherMarkers.push(marker);
            }
        });

        // Configurar navegación para cards de Torres del Paine (patrón Módulo 2)
        setupTorresCardNavigation();

        // Render freezing level chart con datos estáticos
        renderFreezingLevelChart();

    } catch (error) {
        console.error('Error rendering Torres weather points:', error);
        container.innerHTML = '<div class="col-12"><div class="alert alert-danger">Error al cargar los datos.</div></div>';
    }
}

/**
 * Render a weather card for a Torres lugar (datos estáticos con estadísticas)
 * Usa el mismo estilo que las cards de ciudades (place-card)
 */
function renderTorresLugarCard(lugar, container) {
    const estadisticas = calcularEstadisticas(lugar);
    if (!estadisticas) return;

    const estado = lugar.estadoActual.toLowerCase();
    let modifier = 'cloudy';
    let iconClass = 'fa-cloud';

    if (estado.includes('soleado')) {
        modifier = 'sunny';
        iconClass = 'fa-sun';
    } else if (estado.includes('lluvioso')) {
        modifier = 'rainy';
        iconClass = 'fa-cloud-rain';
    } else if (estado.includes('nublado')) {
        modifier = 'cloudy';
        iconClass = 'fa-cloud';
    }

    // Calcular variables meteorológicas para excursionistas
    const viento = lugar.viento || 20;
    const direccionViento = lugar.direccionViento || 180;
    const humedad = lugar.humedad || 70;
    const altitud = lugar.altitud || 500;

    // Calcular sensación térmica
    const sensacionTermica = typeof calcularSensacionTermica === 'function'
        ? calcularSensacionTermica(lugar.tempActual, viento)
        : lugar.tempActual;

    // Calcular índice UV
    const indiceUV = typeof calcularIndiceUV === 'function'
        ? calcularIndiceUV(lugar.estadoActual, lugar.tempActual)
        : 3;
    const infoUV = typeof obtenerDescripcionUV === 'function'
        ? obtenerDescripcionUV(indiceUV)
        : { nivel: 'Moderado', color: '#ffc107' };

    // Evaluar viento
    const infoViento = typeof evaluarViento === 'function'
        ? evaluarViento(viento)
        : { nivel: 'Moderado', icon: 'fa-wind', color: '#ffc107' };

    // Evaluar visibilidad
    const infoVisibilidad = typeof evaluarVisibilidad === 'function'
        ? evaluarVisibilidad(lugar.estadoActual, humedad)
        : { valor: 'Moderada', icon: 'fa-eye', color: '#ff9800', km: '5-15 km' };

    // Probabilidad de precipitación
    const probPrecipitacion = typeof calcularProbabilidadPrecipitacion === 'function'
        ? calcularProbabilidadPrecipitacion(lugar.estadoActual)
        : 30;

    // Dirección del viento
    const dirViento = typeof obtenerDireccionViento === 'function'
        ? obtenerDireccionViento(direccionViento)
        : 'S';

    const cardHtml = `
        <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
            <article class="place-card place-card--${modifier} torres-lugar-card" data-lugar-id="${lugar.id}">
                <div class="place-card__header">
                    <h2 class="place-card__name">${lugar.nombre}</h2>
                    <span class="place-card__distance">Circuito ${lugar.circuito}</span>
                </div>
                <div class="place-card__body">
                    <div class="place-card__icon">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <div class="place-card__temp">${lugar.tempActual}°C</div>
                    <div class="place-card__description">${lugar.estadoActual}</div>
                    
                    <!-- Variables para excursionistas -->
                    <div class="place-card__excursionista">
                        <div class="place-card__excursionista-row">
                            <div class="place-card__excursionista-item">
                                <i class="fas fa-thermometer-half" style="color: #ff6b6b;"></i>
                                <span class="place-card__excursionista-label">Sensación:</span>
                                <span class="place-card__excursionista-value">${sensacionTermica}°C</span>
                            </div>
                            <div class="place-card__excursionista-item">
                                <i class="fas ${infoViento.icon}" style="color: ${infoViento.color};"></i>
                                <span class="place-card__excursionista-label">Viento:</span>
                                <span class="place-card__excursionista-value">${viento} km/h ${dirViento}</span>
                            </div>
                        </div>
                        <div class="place-card__excursionista-row">
                            <div class="place-card__excursionista-item">
                                <i class="fas ${infoVisibilidad.icon}" style="color: ${infoVisibilidad.color};"></i>
                                <span class="place-card__excursionista-label">Visibilidad:</span>
                                <span class="place-card__excursionista-value">${infoVisibilidad.km}</span>
                            </div>
                            <div class="place-card__excursionista-item">
                                <i class="fas fa-sun" style="color: ${infoUV.color};"></i>
                                <span class="place-card__excursionista-label">UV:</span>
                                <span class="place-card__excursionista-value">${indiceUV} (${infoUV.nivel})</span>
                            </div>
                        </div>
                        <div class="place-card__excursionista-row">
                            <div class="place-card__excursionista-item">
                                <i class="fas fa-tint" style="color: #4fc3f7;"></i>
                                <span class="place-card__excursionista-label">Humedad:</span>
                                <span class="place-card__excursionista-value">${humedad}%</span>
                            </div>
                            <div class="place-card__excursionista-item">
                                <i class="fas fa-cloud-rain" style="color: #64b5f6;"></i>
                                <span class="place-card__excursionista-label">Prob. Lluvia:</span>
                                <span class="place-card__excursionista-value">${probPrecipitacion}%</span>
                            </div>
                        </div>
                    </div>

                    <div class="place-card__stats">
                        <div class="place-card__stats-row">Mín: ${estadisticas.tempMinima}°C | Máx: ${estadisticas.tempMaxima}°C</div>
                        <div class="place-card__stats-row">Promedio: ${estadisticas.tempPromedio}°C</div>
                    </div>
                    <span class="place-card__badge">Ver detalle →</span>
                </div>
            </article>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', cardHtml);
}

/**
 * Render a weather card for a Torres point (API data - mantiene compatibilidad)
 */
function renderTorresWeatherCard(pointData, container) {
    const current = pointData.current;
    const temp = Math.round(current.temperature_2m);
    const feelsLike = Math.round(current.apparent_temperature);
    const humidity = current.relative_humidity_2m;
    const windSpeed = Math.round(current.wind_speed_10m);
    const windDir = weatherApp.obtenerDireccionViento(current.wind_direction_10m);
    const precipitation = current.precipitation;
    const weatherDesc = weatherApp.obtenerDescripcionClima(current.weather_code);
    const weatherIcon = weatherApp.obtenerIconoClima(current.weather_code);

    const cardHtml = `
        <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="card h-100" style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <div class="card-body">
                    <h5 class="card-title" style="border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 10px; margin-bottom: 15px;">
                        <i class="fas ${pointData.icon}"></i> ${pointData.point}
                    </h5>
                    <p class="text-muted" style="font-size: 0.85rem; color: rgba(255,255,255,0.7) !important;">
                        ${pointData.description}
                    </p>
                    <div class="text-center my-3">
                        <i class="fas ${weatherIcon}" style="font-size: 3rem; color: #ffd700;"></i>
                        <div style="font-size: 2.5rem; font-weight: bold; margin-top: 10px;">${temp}°C</div>
                        <div style="font-size: 0.9rem; opacity: 0.8;">${weatherDesc}</div>
                    </div>
                    <div class="row text-center" style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px; margin-top: 15px;">
                        <div class="col-6 mb-2">
                            <small style="opacity: 0.8;">Sensación</small>
                            <div style="font-weight: bold;">${feelsLike}°C</div>
                        </div>
                        <div class="col-6 mb-2">
                            <small style="opacity: 0.8;">Humedad</small>
                            <div style="font-weight: bold;">${humidity}%</div>
                        </div>
                        <div class="col-6">
                            <small style="opacity: 0.8;">Viento</small>
                            <div style="font-weight: bold;">${windSpeed} km/h ${windDir}</div>
                        </div>
                        <div class="col-6">
                            <small style="opacity: 0.8;">Precipitación</small>
                            <div style="font-weight: bold;">${precipitation} mm</div>
                        </div>
                    </div>
                    <div class="mt-3" style="background: rgba(0,0,0,0.2); padding: 8px; border-radius: 8px; text-align: center;">
                        <small><i class="fas fa-route"></i> Circuito ${pointData.circuit}</small>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', cardHtml);
}

/**
 * Add marker to Torres map for lugar estático con información expandida
 */
function addTorresLugarMarker(lugar) {
    if (!torresMap) return;

    // Coordenadas aproximadas para cada lugar (puedes ajustarlas)
    const coordenadas = {
        1: [-50.9417, -72.9667], // Base Torres
        2: [-51.0, -73.23],      // Glaciar Grey
        3: [-50.9667, -73.0833], // Valle del Francés
        4: [-50.9500, -73.1167], // Refugio Paine Grande
        5: [-50.9583, -73.0667]   // Campamento Italiano
    };

    const coords = coordenadas[lugar.id] || [-50.95, -73.05];
    const temp = lugar.tempActual;
    const estadisticas = calcularEstadisticas(lugar);

    // Color based on temperature
    let color;
    if (temp < 0) color = '#0d47a1';
    else if (temp < 5) color = '#1976d2';
    else if (temp < 10) color = '#00bcd4';
    else if (temp < 15) color = '#4caf50';
    else color = '#ff9800';

    // Determinar icono según estado
    let iconClass = 'fa-mountain';
    if (lugar.estadoActual.toLowerCase().includes('soleado')) iconClass = 'fa-sun';
    else if (lugar.estadoActual.toLowerCase().includes('lluvioso')) iconClass = 'fa-cloud-rain';
    else if (lugar.estadoActual.toLowerCase().includes('nublado')) iconClass = 'fa-cloud';

    const marker = L.circleMarker(coords, {
        radius: 10,
        fillColor: color,
        color: '#fff',
        weight: 3,
        fillOpacity: 0.9
    }).addTo(torresMap);

    // Calcular sensación térmica y otras variables
    const viento = lugar.viento || 20;
    const humedad = lugar.humedad || 70;
    const sensacionTermica = typeof calcularSensacionTermica === 'function'
        ? calcularSensacionTermica(temp, viento)
        : temp;

    // Obtener pronóstico semanal
    let pronosticoHTML = '';
    if (lugar.pronosticoSemanal && lugar.pronosticoSemanal.length > 0) {
        const proximosDias = lugar.pronosticoSemanal.slice(0, 3);
        pronosticoHTML = `
            <div style="border-top: 2px solid #e0e0e0; padding-top: 12px; margin-top: 10px;">
                <div style="font-weight: bold; color: #1e3c72; margin-bottom: 8px; font-size: 0.9rem;">
                    <i class="fas fa-calendar-alt"></i> Próximos días:
        </div>
                <div style="display: flex; justify-content: space-around; gap: 8px;">
                    ${proximosDias.map(dia => {
            const diaIcon = dia.estado.toLowerCase().includes('soleado') ? 'fa-sun' :
                dia.estado.toLowerCase().includes('lluvioso') ? 'fa-cloud-rain' : 'fa-cloud';
            return `
                            <div style="text-align: center; flex: 1; padding: 8px; background: #f9f9f9; border-radius: 6px;">
                                <div style="font-size: 0.8rem; color: #666; margin-bottom: 4px;">${dia.dia}</div>
                                <i class="fas ${diaIcon}" style="color: #ff9800; font-size: 1.2rem; margin: 4px 0;"></i>
                                <div style="font-size: 0.85rem; color: #333;">
                                    <div style="font-weight: bold;">${dia.tempMax}°</div>
                                    <div style="font-size: 0.75rem; color: #999;">${dia.tempMin}°</div>
                                </div>
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;
    }

    // Crear popup expandido
    const popupContent = `
        <div style="min-width: 280px; max-width: 320px; font-family: 'Segoe UI', sans-serif;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 15px; border-radius: 8px 8px 0 0; margin: -10px -10px 10px -10px;">
                <h4 style="margin: 0; font-size: 1.1rem; text-align: center;">
                    <i class="fas ${iconClass}"></i> ${lugar.nombre}
                </h4>
                <p style="margin: 5px 0 0 0; font-size: 0.85rem; opacity: 0.9; text-align: center;">
                    ${lugar.estadoActual} - Circuito ${lugar.circuito}
                </p>
            </div>

            <!-- Temperatura Principal -->
            <div style="text-align: center; padding: 15px 0; border-bottom: 2px solid #e0e0e0;">
                <i class="fas ${iconClass}" style="font-size: 2.5rem; color: #ffd700; margin-bottom: 8px;"></i>
                <div style="font-size: 2.2rem; font-weight: bold; color: #1e3c72;">${temp}°C</div>
                <div style="font-size: 0.9rem; color: #666; margin-top: 5px;">${lugar.estadoActual}</div>
                <div style="font-size: 0.85rem; color: #999; margin-top: 3px;">
                    Sensación: ${sensacionTermica}°C
                </div>
            </div>

            <!-- Información Meteorológica Detallada -->
            <div style="padding: 12px 0;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9rem;">
                    <div style="text-align: center; padding: 8px; background: #f5f5f5; border-radius: 6px;">
                        <i class="fas fa-tint" style="color: #4fc3f7; font-size: 1.2rem;"></i>
                        <div style="font-weight: bold; margin-top: 4px; color: #333;">Humedad</div>
                        <div style="color: #666; font-size: 0.95rem;">${humedad}%</div>
                    </div>
                    <div style="text-align: center; padding: 8px; background: #f5f5f5; border-radius: 6px;">
                        <i class="fas fa-wind" style="color: #64b5f6; font-size: 1.2rem;"></i>
                        <div style="font-weight: bold; margin-top: 4px; color: #333;">Viento</div>
                        <div style="color: #666; font-size: 0.95rem;">${viento} km/h</div>
                    </div>
                    ${lugar.altitud ? `
                    <div style="text-align: center; padding: 8px; background: #f5f5f5; border-radius: 6px;">
                        <i class="fas fa-mountain" style="color: #8bc34a; font-size: 1.2rem;"></i>
                        <div style="font-weight: bold; margin-top: 4px; color: #333;">Altitud</div>
                        <div style="color: #666; font-size: 0.95rem;">${lugar.altitud} m</div>
                    </div>
                    ` : ''}
                    <div style="text-align: center; padding: 8px; background: #f5f5f5; border-radius: 6px;">
                        <i class="fas fa-route" style="color: #ff9800; font-size: 1.2rem;"></i>
                        <div style="font-weight: bold; margin-top: 4px; color: #333;">Circuito</div>
                        <div style="color: #666; font-size: 0.95rem;">${lugar.circuito}</div>
                    </div>
                </div>
            </div>

            ${estadisticas ? `
            <!-- Estadísticas Semanales -->
            <div style="border-top: 2px solid #e0e0e0; padding-top: 12px; margin-top: 10px;">
                <div style="font-weight: bold; color: #1e3c72; margin-bottom: 8px; font-size: 0.9rem;">
                    <i class="fas fa-chart-bar"></i> Estadísticas semanales:
                </div>
                <div style="display: flex; justify-content: space-around; text-align: center; font-size: 0.85rem;">
                    <div style="flex: 1;">
                        <div style="color: #666;">Mín</div>
                        <div style="font-weight: bold; color: #1976d2;">${estadisticas.tempMinima}°C</div>
                    </div>
                    <div style="flex: 1;">
                        <div style="color: #666;">Promedio</div>
                        <div style="font-weight: bold; color: #333;">${estadisticas.tempPromedio}°C</div>
                    </div>
                    <div style="flex: 1;">
                        <div style="color: #666;">Máx</div>
                        <div style="font-weight: bold; color: #f5576c;">${estadisticas.tempMaxima}°C</div>
                    </div>
                </div>
            </div>
            ` : ''}

            ${pronosticoHTML}

            <!-- Coordenadas -->
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e0e0e0; text-align: center;">
                <small style="color: #999; font-size: 0.75rem;">
                    <i class="fas fa-map-marker-alt"></i> ${coords[0].toFixed(4)}°S, ${Math.abs(coords[1]).toFixed(4)}°W
                </small>
            </div>
        </div>
    `;

    marker.bindPopup(popupContent, {
        maxWidth: 350,
        className: 'torres-marker-popup'
    });

    // Agregar evento de clic
    marker.on('click', function () {
        marker.openPopup();
    });

    return marker; // Devolver el marcador para poder gestionarlo después
}

/**
 * Add marker to Torres map (API data - mantiene compatibilidad)
 */
function addTorresMapMarker(pointData) {
    if (!torresMap) return;

    const temp = Math.round(pointData.current.temperature_2m);
    const lat = pointData.coords.lat;
    const lon = pointData.coords.lon;

    // Color based on temperature
    let color;
    if (temp < 0) color = '#0d47a1';
    else if (temp < 5) color = '#1976d2';
    else if (temp < 10) color = '#00bcd4';
    else if (temp < 15) color = '#4caf50';
    else color = '#ff9800';

    const marker = L.circleMarker([lat, lon], {
        radius: 10,
        fillColor: color,
        color: '#fff',
        weight: 3,
        fillOpacity: 0.9
    }).addTo(torresMap);

    // Extraer más información meteorológica
    const current = pointData.current || {};
    const feelsLike = Math.round(current.apparent_temperature || temp);
    const humidity = current.relative_humidity_2m || 'N/A';
    const windSpeed = Math.round(current.wind_speed_10m || 0);
    const windDir = current.wind_direction_10m !== undefined
        ? weatherApp.obtenerDireccionViento(current.wind_direction_10m)
        : 'N/A';
    const precipitation = (current.precipitation || 0).toFixed(1);
    const weatherDesc = weatherApp.obtenerDescripcionClima(current.weather_code || 0);
    const weatherIcon = weatherApp.obtenerIconoClima(current.weather_code || 0);

    // Obtener pronóstico para los próximos días si está disponible
    const daily = pointData.daily || {};
    const nextDays = [];
    if (daily.time && daily.time.length > 0) {
        for (let i = 0; i < Math.min(3, daily.time.length); i++) {
            const date = new Date(daily.time[i]);
            const tempMax = Math.round(daily.temperature_2m_max?.[i] || temp);
            const tempMin = Math.round(daily.temperature_2m_min?.[i] || temp);
            const dayCode = daily.weather_code?.[i] || 0;
            const dayIcon = weatherApp.obtenerIconoClima(dayCode);

            nextDays.push({
                date: date.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric' }),
                tempMax,
                tempMin,
                icon: dayIcon
            });
        }
    }

    // Crear popup expandido con más información
    const popupContent = `
        <div style="min-width: 280px; max-width: 320px; font-family: 'Segoe UI', sans-serif;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 15px; border-radius: 8px 8px 0 0; margin: -10px -10px 10px -10px;">
                <h4 style="margin: 0; font-size: 1.1rem; text-align: center;">
                    <i class="fas ${pointData.icon}"></i> ${pointData.point}
                </h4>
                <p style="margin: 5px 0 0 0; font-size: 0.85rem; opacity: 0.9; text-align: center;">
                    ${pointData.description}
                </p>
        </div>

            <!-- Temperatura Principal -->
            <div style="text-align: center; padding: 15px 0; border-bottom: 2px solid #e0e0e0;">
                <i class="fas ${weatherIcon}" style="font-size: 2.5rem; color: #ffd700; margin-bottom: 8px;"></i>
                <div style="font-size: 2.2rem; font-weight: bold; color: #1e3c72;">${temp}°C</div>
                <div style="font-size: 0.9rem; color: #666; margin-top: 5px;">${weatherDesc}</div>
                <div style="font-size: 0.85rem; color: #999; margin-top: 3px;">
                    Sensación: ${feelsLike}°C
                </div>
            </div>

            <!-- Información Meteorológica Detallada -->
            <div style="padding: 12px 0;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9rem;">
                    <div style="text-align: center; padding: 8px; background: #f5f5f5; border-radius: 6px;">
                        <i class="fas fa-tint" style="color: #4fc3f7; font-size: 1.2rem;"></i>
                        <div style="font-weight: bold; margin-top: 4px; color: #333;">Humedad</div>
                        <div style="color: #666; font-size: 0.95rem;">${humidity}%</div>
                    </div>
                    <div style="text-align: center; padding: 8px; background: #f5f5f5; border-radius: 6px;">
                        <i class="fas fa-wind" style="color: #64b5f6; font-size: 1.2rem;"></i>
                        <div style="font-weight: bold; margin-top: 4px; color: #333;">Viento</div>
                        <div style="color: #666; font-size: 0.95rem;">${windSpeed} km/h</div>
                        <div style="color: #999; font-size: 0.8rem;">${windDir}</div>
                    </div>
                    <div style="text-align: center; padding: 8px; background: #f5f5f5; border-radius: 6px;">
                        <i class="fas fa-cloud-rain" style="color: #2196f3; font-size: 1.2rem;"></i>
                        <div style="font-weight: bold; margin-top: 4px; color: #333;">Precipitación</div>
                        <div style="color: #666; font-size: 0.95rem;">${precipitation} mm</div>
                    </div>
                    <div style="text-align: center; padding: 8px; background: #f5f5f5; border-radius: 6px;">
                        <i class="fas fa-route" style="color: #ff9800; font-size: 1.2rem;"></i>
                        <div style="font-weight: bold; margin-top: 4px; color: #333;">Circuito</div>
                        <div style="color: #666; font-size: 0.95rem;">${pointData.circuit || 'W'}</div>
                    </div>
                </div>
            </div>

            <!-- Pronóstico Próximos Días -->
            ${nextDays.length > 0 ? `
            <div style="border-top: 2px solid #e0e0e0; padding-top: 12px; margin-top: 10px;">
                <div style="font-weight: bold; color: #1e3c72; margin-bottom: 8px; font-size: 0.9rem;">
                    <i class="fas fa-calendar-alt"></i> Próximos días:
                </div>
                <div style="display: flex; justify-content: space-around; gap: 8px;">
                    ${nextDays.map(day => `
                        <div style="text-align: center; flex: 1; padding: 8px; background: #f9f9f9; border-radius: 6px;">
                            <div style="font-size: 0.8rem; color: #666; margin-bottom: 4px;">${day.date}</div>
                            <i class="fas ${day.icon}" style="color: #ff9800; font-size: 1.2rem; margin: 4px 0;"></i>
                            <div style="font-size: 0.85rem; color: #333;">
                                <div style="font-weight: bold;">${day.tempMax}°</div>
                                <div style="font-size: 0.75rem; color: #999;">${day.tempMin}°</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <!-- Coordenadas -->
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e0e0e0; text-align: center;">
                <small style="color: #999; font-size: 0.75rem;">
                    <i class="fas fa-map-marker-alt"></i> ${lat.toFixed(4)}°S, ${Math.abs(lon).toFixed(4)}°W
                </small>
            </div>
        </div>
    `;

    marker.bindPopup(popupContent, {
        maxWidth: 350,
        className: 'torres-marker-popup'
    });

    // Agregar evento para hacer el popup más grande al hacer clic
    marker.on('click', function () {
        marker.openPopup();
    });
}

/**
 * Configurar navegación desde cards de Torres del Paine usando addEventListener
 * Cumple con requisito del Módulo 2: Ejemplo de uso de JS 1
 */
function setupTorresCardNavigation() {
    const torresCards = document.querySelectorAll('.torres-lugar-card');

    torresCards.forEach(function (card) {
        card.addEventListener('click', function () {
            const lugarId = parseInt(this.getAttribute('data-lugar-id'));
            if (lugarId) {
                showLugarDetail(lugarId);
            }
        });
    });
}

/**
 * Render Freezing Level Chart with mountain silhouette
 * Ahora usa datos dinámicos de la API en lugar de valores fijos
 */
function renderFreezingLevelChart() {
    const ctx = document.getElementById('freezingLevelChart');
    if (!ctx) {
        console.warn('Canvas freezingLevelChart no encontrado');
        return;
    }

    // Destruir gráfico anterior si existe
    if (window.freezingLevelChartInstance) {
        window.freezingLevelChartInstance.destroy();
    }

    // Obtener datos dinámicos de la API para Torres del Paine
    let avgTemp = 8; // Valor por defecto
    let freezingLevel = 1200; // Valor por defecto
    let tempVariation = []; // Para mostrar variación en el pronóstico

    const torresData = weatherApp.obtenerDatosClima('Torres del Paine - Glaciar Grey');

    if (torresData && torresData.current) {
        // Usar temperatura actual de la API
        avgTemp = torresData.current.temperature_2m;

        // Calcular nivel de congelación actual
        const baseAltitude = 100;
        freezingLevel = weatherApp.calcularNivelCongelacion(avgTemp, baseAltitude);

        // Calcular variación del nivel de congelación para los próximos 7 días
        if (torresData.daily && torresData.daily.temperature_2m_max) {
            const tempsPromedio = torresData.daily.temperature_2m_max.map((max, i) => {
                const min = torresData.daily.temperature_2m_min[i];
                return (max + min) / 2; // Temperatura promedio del día
            });

            tempVariation = tempsPromedio.map(temp => {
                return weatherApp.calcularNivelCongelacion(temp, baseAltitude);
            });
        }
    } else {
        // Fallback: usar datos estáticos si no hay datos de API
        if (lugares && lugares.length > 0) {
            const sumaTemps = lugares.reduce((sum, lugar) => sum + lugar.tempActual, 0);
            avgTemp = sumaTemps / lugares.length;
            const baseAltitude = 100;
            freezingLevel = weatherApp.calcularNivelCongelacion(avgTemp, baseAltitude);
        }
    }

    // Altitud base para Torres del Paine
    const baseAltitude = 100;

    // Mountain peaks in Torres del Paine (approximate heights in meters)
    const mountains = [
        { name: 'Paine Grande', height: 2884 },
        { name: 'Torres del Paine', height: 2850 },
        { name: 'Los Cuernos', height: 2600 },
        { name: 'Almirante Nieto', height: 2670 },
        { name: 'Fortaleza', height: 2800 }
    ];

    // Create mountain silhouette data
    const mountainData = [];
    const labels = [];

    // Generate mountain profile
    for (let i = 0; i <= 100; i++) {
        const x = i;
        labels.push(x);

        // Create a mountain-like curve using sine waves
        const height =
            Math.sin(x * 0.15) * 800 +
            Math.sin(x * 0.08) * 600 +
            Math.sin(x * 0.25) * 400 +
            1500;

        mountainData.push(Math.max(baseAltitude, height));
    }

    // Preparar datasets del gráfico
    const datasets = [
        {
            label: 'Perfil de Montaña',
            data: mountainData,
            backgroundColor: 'rgba(139, 115, 85, 0.7)',
            borderColor: 'rgba(101, 67, 33, 1)',
            borderWidth: 2,
            fill: 'origin',
            pointRadius: 0,
            tension: 0.4
        },
        {
            label: `Isoterma 0°C Actual (${freezingLevel}m)`,
            data: Array(labels.length).fill(freezingLevel),
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.2)',
            borderWidth: 4,
            borderDash: [10, 5],
            fill: {
                target: 'origin',
                above: 'rgba(220, 53, 69, 0.1)'
            },
            pointRadius: 0,
            order: 0,
            tension: 0
        }
    ];

    // Si hay datos de pronóstico, agregar línea de variación promedio
    if (tempVariation && tempVariation.length > 0) {
        const avgFreezingLevel = tempVariation.reduce((sum, val) => sum + val, 0) / tempVariation.length;
        datasets.push({
            label: `Isoterma 0°C Pronóstico Promedio (${Math.round(avgFreezingLevel)}m)`,
            data: Array(labels.length).fill(avgFreezingLevel),
            borderColor: '#ff9800',
            backgroundColor: 'rgba(255, 152, 0, 0.1)',
            borderWidth: 3,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            order: 1,
            tension: 0
        });
    }

    // Guardar instancia del gráfico para poder destruirlo después
    window.freezingLevelChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: { size: 12, weight: 'bold' },
                        color: '#333',
                        usePointStyle: true
                    }
                },
                tooltip: {
                    enabled: false
                },
                title: {
                    display: true,
                    text: torresData
                        ? `🌡️ Temperatura actual: ${Math.round(avgTemp)}°C | Isoterma 0°C a ${freezingLevel}m (Datos en tiempo real)`
                        : `🌡️ Temperatura: ${Math.round(avgTemp)}°C | Isoterma 0°C a ${freezingLevel}m`,
                    font: { size: 14, weight: 'bold' },
                    color: '#1e3c72'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 3000,
                    title: {
                        display: true,
                        text: 'Altura (metros)',
                        font: { size: 12, weight: 'bold' },
                        color: '#333'
                    },
                    ticks: {
                        callback: function (value) {
                            return value + 'm';
                        },
                        font: { size: 11 },
                        color: '#333',
                        stepSize: 500
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawOnChartArea: true
                    }
                },
                x: {
                    display: false,
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * Enhanced render of Torres weather card with wind chill alert
 */
function renderTorresWeatherCard(pointData, container) {
    const current = pointData.current;
    const temp = Math.round(current.temperature_2m);
    const feelsLike = Math.round(current.apparent_temperature);
    const humidity = current.relative_humidity_2m;
    const windSpeed = Math.round(current.wind_speed_10m);
    const windDir = weatherApp.obtenerDireccionViento(current.wind_direction_10m);
    const precipitation = current.precipitation;
    const weatherDesc = weatherApp.obtenerDescripcionClima(current.weather_code);
    const weatherIcon = weatherApp.obtenerIconoClima(current.weather_code);

    // Obtener severidad del viento frío
    const windChillInfo = weatherApp.obtenerSeveridadVientoFrio(feelsLike, temp);

    // Determine if we should show wind chill alert
    const showWindChillAlert = windChillInfo.level !== 'none';

    const cardHtml = `
        <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="card h-100" style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <div class="card-body">
                    <h5 class="card-title" style="border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 10px; margin-bottom: 15px;">
                        <i class="fas ${pointData.icon}"></i> ${pointData.point}
                    </h5>
                    <p class="text-muted" style="font-size: 0.85rem; color: rgba(255,255,255,0.7) !important;">
                        ${pointData.description}
                    </p>
                    
                    ${showWindChillAlert ? `
                    <div class="alert alert-${windChillInfo.clase} mb-3" style="padding: 8px; font-size: 0.85rem; border-radius: 8px;">
                        <i class="fas ${windChillInfo.icono}"></i> <strong>${windChillInfo.mensaje}</strong>
                    </div>
                    ` : ''}
                    
                    <div class="text-center my-3">
                        <i class="fas ${weatherIcon}" style="font-size: 3rem; color: #ffd700;"></i>
                        <div style="font-size: 2.5rem; font-weight: bold; margin-top: 10px;">${temp}°C</div>
                        <div style="font-size: 0.9rem; opacity: 0.8;">${weatherDesc}</div>
                    </div>
                    
                    <div class="row text-center" style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px; margin-top: 15px;">
                        <div class="col-6 mb-2">
                            <small style="opacity: 0.8;">Sensación Térmica</small>
                            <div style="font-weight: bold; font-size: 1.3rem; color: ${feelsLike < temp - 5 ? '#ff6b6b' : '#4ecdc4'};">
                                ${feelsLike}°C
                            </div>
                            ${temp !== feelsLike ? `<small style="opacity: 0.7;">(${temp > feelsLike ? '-' : '+'}${Math.abs(temp - feelsLike)}°C)</small>` : ''}
                        </div>
                        <div class="col-6 mb-2">
                            <small style="opacity: 0.8;">Humedad</small>
                            <div style="font-weight: bold;">${humidity}%</div>
                        </div>
                        <div class="col-6">
                            <small style="opacity: 0.8;">Viento</small>
                            <div style="font-weight: bold;">${windSpeed} km/h ${windDir}</div>
                        </div>
                        <div class="col-6">
                            <small style="opacity: 0.8;">Precipitación</small>
                            <div style="font-weight: bold;">${precipitation} mm</div>
                        </div>
                    </div>
                    <div class="mt-3" style="background: rgba(0,0,0,0.2); padding: 8px; border-radius: 8px; text-align: center;">
                        <small><i class="fas fa-route"></i> Circuito ${pointData.circuit}</small>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', cardHtml);
}
