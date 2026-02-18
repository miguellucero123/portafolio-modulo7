/**
 * Trail Loader - Utilidad para cargar senderos reales de Torres del Paine
 * Soporta GeoJSON y carga desde OpenStreetMap
 */

/**
 * Cargar senderos desde un archivo GeoJSON local
 * @param {Map} map - Instancia de Leaflet map
 * @param {string} geojsonPath - Ruta al archivo GeoJSON
 * @returns {Promise<L.LayerGroup>} Grupo de capas con los senderos
 */
async function loadTrailsFromGeoJSON(map, geojsonPath) {
    try {
        const response = await fetch(geojsonPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const geojson = await response.json();
        
        // Crear grupo de capas para los senderos
        const trailGroup = L.layerGroup();
        
        // Procesar cada feature del GeoJSON
        geojson.features.forEach(feature => {
            if (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString') {
                const circuit = feature.properties.circuit || feature.properties.name || 'Unknown';
                const isCircuitoW = circuit.toLowerCase().includes('w') || 
                                   circuit.toLowerCase().includes('circuit w');
                const isCircuitoO = circuit.toLowerCase().includes('o') || 
                                   circuit.toLowerCase().includes('circuit o');
                
                // Estilo según el circuito
                const style = {
                    color: isCircuitoW ? '#ff9800' : isCircuitoO ? '#ffc107' : '#2196f3',
                    weight: 6,
                    opacity: 0.85,
                    smoothFactor: 0.3,
                    lineCap: 'round',
                    lineJoin: 'round'
                };
                
                // Crear polyline
                const polyline = L.geoJSON(feature, {
                    style: style,
                    onEachFeature: function(feature, layer) {
                        // Popup con información
                        const name = feature.properties.name || circuit;
                        const description = feature.properties.description || '';
                        layer.bindPopup(`
                            <div style="text-align: center; padding: 8px;">
                                <strong><i class="fas fa-route"></i> ${name}</strong><br>
                                ${description ? `<small>${description}</small><br>` : ''}
                                <small style="color: #666;">
                                    <i class="fas fa-mountain"></i> Sendero real del parque
                                </small>
                            </div>
                        `);
                    }
                });
                
                trailGroup.addLayer(polyline);
            }
        });
        
        trailGroup.addTo(map);
        console.log(`✅ Senderos cargados: ${trailGroup.getLayers().length} rutas`);
        return trailGroup;
        
    } catch (error) {
        console.error('❌ Error cargando senderos desde GeoJSON:', error);
        throw error;
    }
}

/**
 * Cargar senderos directamente desde OpenStreetMap Overpass API
 * @param {Map} map - Instancia de Leaflet map
 * @param {Object} bbox - Bounding box {south, west, north, east}
 * @returns {Promise<L.LayerGroup>} Grupo de capas con los senderos
 */
async function loadTrailsFromOSM(map, bbox = {
    south: -51.3,
    west: -73.4,
    north: -50.7,
    east: -72.8
}) {
    const query = `
        [out:json][timeout:25];
        (
          way["route"="hiking"]["name"~"Torres|Paine|Circuito|Circuit|W|O",i](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
          relation["route"="hiking"]["name"~"Torres|Paine|Circuito|Circuit|W|O",i](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
        );
        out geom;
    `;
    
    try {
        const response = await fetch(
            `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const trailGroup = L.layerGroup();
        
        data.elements.forEach(element => {
            if (element.type === 'way' && element.geometry) {
                const name = element.tags?.name || 'Sendero';
                const isCircuitoW = name.toLowerCase().includes('w') || 
                                   name.toLowerCase().includes('circuit w');
                const isCircuitoO = name.toLowerCase().includes('o') || 
                                   name.toLowerCase().includes('circuit o');
                
                // Convertir coordenadas OSM [lon, lat] a Leaflet [lat, lon]
                const coords = element.geometry.map(p => [p.lat, p.lon]);
                
                const style = {
                    color: isCircuitoW ? '#ff9800' : isCircuitoO ? '#ffc107' : '#2196f3',
                    weight: 6,
                    opacity: 0.85,
                    smoothFactor: 0.3
                };
                
                const polyline = L.polyline(coords, style);
                polyline.bindPopup(`<strong><i class="fas fa-route"></i> ${name}</strong>`);
                trailGroup.addLayer(polyline);
            }
        });
        
        trailGroup.addTo(map);
        console.log(`✅ Senderos cargados desde OSM: ${trailGroup.getLayers().length} rutas`);
        return trailGroup;
        
    } catch (error) {
        console.error('❌ Error cargando senderos desde OSM:', error);
        throw error;
    }
}

/**
 * Convertir archivo GPX a GeoJSON y cargarlo
 * Requiere: @mapbox/togeojson
 * @param {Map} map - Instancia de Leaflet map
 * @param {string} gpxPath - Ruta al archivo GPX
 * @param {Object} options - Opciones {circuit: 'W'|'O', color: '#hex', name: 'Nombre'}
 * @returns {Promise<L.Polyline|L.LayerGroup>} Polylines o grupo de capas con los senderos
 */
async function loadTrailsFromGPX(map, gpxPath, options = {}) {
    // Verificar si toGeoJSON está disponible
    if (typeof toGeoJSON === 'undefined') {
        console.error('❌ toGeoJSON no está disponible. Incluye la librería:');
        console.error('<script src="https://cdn.jsdelivr.net/npm/@mapbox/togeojson@0.16.0/togeojson.min.js"></script>');
        throw new Error('toGeoJSON library required');
    }
    
    try {
        const response = await fetch(gpxPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const gpxText = await response.text();
        
        // Parsear GPX
        const parser = new DOMParser();
        const gpxDoc = parser.parseFromString(gpxText, 'text/xml');
        
        // Verificar errores de parsing
        const parseError = gpxDoc.querySelector('parsererror');
        if (parseError) {
            throw new Error('Error parseando GPX: ' + parseError.textContent);
        }
        
        // Convertir a GeoJSON
        const geojson = toGeoJSON.gpx(gpxDoc);
        
        // Determinar circuito y estilo
        const circuit = options.circuit || 
                       (gpxPath.toLowerCase().includes('circuito-o') || gpxPath.toLowerCase().includes('circuit-o') ? 'O' : 
                        gpxPath.toLowerCase().includes('circuito-w') || gpxPath.toLowerCase().includes('circuit-w') ? 'W' : 
                        'Unknown');
        
        const isCircuitoW = circuit === 'W';
        const isCircuitoO = circuit === 'O';
        
        const defaultColor = isCircuitoW ? '#ff9800' : isCircuitoO ? '#ffc107' : '#2196f3';
        const color = options.color || defaultColor;
        const name = options.name || geojson.features[0]?.properties?.name || `Circuito ${circuit}`;
        
        // Crear grupo de capas
        const trailGroup = L.layerGroup();
        
        // Procesar cada feature del GeoJSON
        geojson.features.forEach((feature, index) => {
            if (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString') {
                const style = {
                    color: color,
                    weight: 6,
                    opacity: 0.85,
                    smoothFactor: 0.3,
                    lineCap: 'round',
                    lineJoin: 'round'
                };
                
                const layer = L.geoJSON(feature, {
                    style: style,
                    onEachFeature: function(feature, layer) {
                        const trackName = feature.properties.name || name;
                        const description = feature.properties.desc || feature.properties.description || '';
                        layer.bindPopup(`
                            <div style="text-align: center; padding: 8px;">
                                <strong><i class="fas fa-route"></i> ${trackName}</strong><br>
                                ${description ? `<small>${description}</small><br>` : ''}
                                <small style="color: #666;">
                                    <i class="fas fa-map-marked-alt"></i> Sendero GPS real del parque
                                </small>
                            </div>
                        `);
                    }
                });
                
                trailGroup.addLayer(layer);
            }
        });
        
        trailGroup.addTo(map);
        console.log(`✅ Sendero GPX cargado: ${name} (${trailGroup.getLayers().length} segmentos)`);
        return trailGroup;
        
    } catch (error) {
        console.error('❌ Error cargando senderos desde GPX:', error);
        throw error;
    }
}

/**
 * Cargar los senderos GPX de Torres del Paine (W y O)
 * Carga ambos circuitos automáticamente
 * @param {Map} map - Instancia de Leaflet map
 * @returns {Promise<Object>} Objeto con las referencias a los grupos de capas
 */
async function loadTorresPaineGPXTrails(map) {
    console.log('🗺️ Cargando senderos GPX de Torres del Paine...');
    
    const trails = {
        circuitoW: null,
        circuitoO: null,
        allTrails: L.layerGroup()
    };
    
    try {
        // Cargar Circuito W
        const gpxWPath = 'torres-del-paine-circuito-w-gpx.gpx';
        try {
            trails.circuitoW = await loadTrailsFromGPX(map, gpxWPath, {
                circuit: 'W',
                name: 'Circuito W - Torres del Paine',
                color: '#ff9800'
            });
            trails.allTrails.addLayer(trails.circuitoW);
            console.log('✅ Circuito W cargado desde GPX');
        } catch (err) {
            console.warn('⚠️ No se pudo cargar Circuito W:', err.message);
            // Intentar con nombre alternativo
            try {
                trails.circuitoW = await loadTrailsFromGPX(map, 'pn-torres-del-paine-circuito-w.gpx', {
                    circuit: 'W',
                    name: 'Circuito W - Torres del Paine',
                    color: '#ff9800'
                });
                trails.allTrails.addLayer(trails.circuitoW);
                console.log('✅ Circuito W cargado (nombre alternativo)');
            } catch (err2) {
                console.warn('⚠️ No se encontró archivo GPX del Circuito W');
            }
        }
        
        // Cargar Circuito O
        const gpxOPath = 'pn-torres-del-paine-circuito-o.gpx';
        try {
            trails.circuitoO = await loadTrailsFromGPX(map, gpxOPath, {
                circuit: 'O',
                name: 'Circuito O - Torres del Paine',
                color: '#ffc107'
            });
            trails.allTrails.addLayer(trails.circuitoO);
            console.log('✅ Circuito O cargado desde GPX');
        } catch (err) {
            console.warn('⚠️ No se pudo cargar Circuito O:', err.message);
        }
        
        console.log(`✅ Total senderos GPX cargados: ${trails.allTrails.getLayers().length} rutas`);
        return trails;
        
    } catch (error) {
        console.error('❌ Error cargando senderos GPX:', error);
        throw error;
    }
}

// Exportar funciones (si usas módulos)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadTrailsFromGeoJSON,
        loadTrailsFromOSM,
        loadTrailsFromGPX,
        loadTorresPaineGPXTrails
    };
}
