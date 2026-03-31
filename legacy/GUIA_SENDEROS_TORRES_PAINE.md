# Guía: Cómo Obtener y Usar Senderos Reales de Torres del Paine

Esta guía explica cómo obtener datos GPS reales de los senderos del Parque Nacional Torres del Paine y cómo integrarlos en tu aplicación.

---

## 1. Fuentes de Datos de Senderos

### A. OpenStreetMap (OSM) - GRATIS y RECOMENDADO ⭐

**¿Qué es?**  
OpenStreetMap es un proyecto colaborativo que crea mapas libres y editables del mundo. Incluye datos detallados de senderos de Torres del Paine.

**Cómo obtener los datos:**

1. **Overpass Turbo** (Herramienta web para consultar OSM):
   - URL: https://overpass-turbo.eu/
   - Consulta para Torres del Paine:
   ```xml
   <osm-script>
     <query type="relation">
       <has-kv k="name" v="Torres del Paine"/>
     </query>
     <union>
       <item/>
       <recurse type="down"/>
     </union>
     <print/>
   </osm-script>
   ```
   
   O mejor aún, consulta por rutas de senderos:
   ```xml
   <osm-script>
     <query type="way">
       <has-kv k="route" v="hiking"/>
       <bbox-query s="-51.3" w="-73.4" n="-50.7" e="-72.8"/>
     </query>
     <print/>
   </osm-script>
   ```

2. **Exportar a GeoJSON:**
   - En Overpass Turbo, haz click en "Export"
   - Selecciona "GeoJSON"
   - Guarda el archivo como `torres-paine-trails.geojson`

### B. AllTrails - GPS Tracks

**URL:** https://www.alltrails.com/parks/chile/torres-del-paine-national-park

**Cómo obtener:**
1. Busca "Torres del Paine Circuit W" o "Torres del Paine Circuit O"
2. Descarga el track GPX (requiere cuenta)
3. Convierte GPX a GeoJSON usando herramientas online

**Herramienta de conversión:** https://mygeodata.cloud/converter/gpx-to-geojson

### C. Wikiloc - Tracks de Usuarios

**URL:** https://es.wikiloc.com/rutas/senderismo/torres-del-paine

**Ventajas:**
- Muchos tracks de usuarios reales
- Incluyen elevación y tiempo
- Puedes descargar GPX

**Cómo obtener:**
1. Busca "Torres del Paine Circuit"
2. Selecciona un track con buenas reviews
3. Descarga GPX (requiere cuenta gratuita)

### D. Mapas Oficiales CONAF

**Contacto:** Corporación Nacional Forestal (Chile)  
**Email:** parquenacional.torresdelpaine@conaf.cl

**Ventajas:**
- Datos oficiales
- Más precisos

**Desventajas:**
- Puede requerir solicitud formal
- Puede tener restricciones de uso

### E. Gaia GPS / CalTopo

**URLs:**
- Gaia GPS: https://www.gaiagps.com/
- CalTopo: https://caltopo.com/

**Cómo obtener:**
1. Registrate (cuenta gratuita disponible)
2. Busca Torres del Paine
3. Descarga tracks como GPX o GeoJSON

---

## 2. Formatos de Datos

### GPX (GPS Exchange Format)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<gpx>
  <trk>
    <name>Circuito W</name>
    <trkseg>
      <trkpt lat="-51.0" lon="-73.23">
        <ele>200</ele>
      </trkpt>
      <!-- más puntos -->
    </trkseg>
  </trk>
</gpx>
```

### GeoJSON (Recomendado para web)
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-73.23, -51.0],
          [-73.12, -50.955]
        ]
      },
      "properties": {
        "name": "Circuito W",
        "circuit": "W"
      }
    }
  ]
}
```

---

## 3. Integración en tu Aplicación

### Opción A: Cargar GeoJSON desde archivo local

1. **Crea un archivo de datos:**
   - Crea `js/data/torres-trails.geojson`
   - Pon los datos GeoJSON ahí

2. **Carga en tu aplicación:**
   ```javascript
   // En app.js, función initializeTorresMap()
   async function loadTorresTrails() {
       try {
           const response = await fetch('js/data/torres-trails.geojson');
           const geojson = await response.json();
           
           // Convertir GeoJSON a polylines de Leaflet
           L.geoJSON(geojson, {
               style: function(feature) {
                   const circuit = feature.properties.circuit || 'W';
                   return {
                       color: circuit === 'W' ? '#ff9800' : '#ffc107',
                       weight: 6,
                       opacity: 0.85
                   };
               },
               onEachFeature: function(feature, layer) {
                   layer.bindPopup(feature.properties.name || 'Sendero');
               }
           }).addTo(torresMap);
       } catch (error) {
           console.error('Error cargando senderos:', error);
       }
   }
   ```

### Opción B: Usar datos de OpenStreetMap directamente

```javascript
// Cargar desde Overpass API
async function loadTrailsFromOSM() {
    const bbox = '-51.3,-73.4,-50.7,-72.8'; // Bounding box de Torres del Paine
    const query = `
        [out:json][timeout:25];
        (
          way["route"="hiking"]["name"~"Torres|Paine|Circuito"](bbox:${bbox});
          relation["route"="hiking"]["name"~"Torres|Paine|Circuito"](bbox:${bbox});
        );
        out geom;
    `;
    
    try {
        const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        // Convertir a formato Leaflet
        data.elements.forEach(element => {
            if (element.type === 'way' && element.geometry) {
                const coords = element.geometry.map(p => [p.lat, p.lon]);
                L.polyline(coords, {
                    color: '#ff9800',
                    weight: 6
                }).addTo(torresMap);
            }
        });
    } catch (error) {
        console.error('Error cargando desde OSM:', error);
    }
}
```

### Opción C: Convertir GPX a coordenadas JavaScript

Si obtienes un archivo GPX, puedes usar una librería para parsearlo:

```html
<!-- En index.html -->
<script src="https://cdn.jsdelivr.net/npm/@mapbox/togeojson@0.16.0/togeojson.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/togeojson@0.16.5/index.js"></script>
```

```javascript
async function loadGPXTrail(gpxUrl) {
    const response = await fetch(gpxUrl);
    const gpxText = await response.text();
    const parser = new DOMParser();
    const gpxDoc = parser.parseFromString(gpxText, 'text/xml');
    
    // Convertir GPX a GeoJSON
    const geojson = toGeoJSON.gpx(gpxDoc);
    
    // Agregar al mapa
    L.geoJSON(geojson).addTo(torresMap);
}
```

---

## 4. Herramientas Útiles

### Para obtener datos:
- **Overpass Turbo:** https://overpass-turbo.eu/ (consultas OSM)
- **OSM Inspector:** https://tools.geofabrik.de/osmi/ (visualizar datos OSM)
- **AllTrails:** https://www.alltrails.com/ (descargar tracks)
- **Wikiloc:** https://es.wikiloc.com/ (tracks de usuarios)

### Para convertir formatos:
- **MyGeoData Converter:** https://mygeodata.cloud/converter/
- **Ogre:** https://ogre.adc4gis.com/ (conversor online)
- **GPSBabel:** https://www.gpsbabel.org/ (herramienta de línea de comandos)

### Para editar datos:
- **QGIS:** https://qgis.org/ (software GIS gratuito)
- **JOSM:** https://josm.openstreetmap.de/ (editor OSM)
- **geojson.io:** https://geojson.io/ (editor GeoJSON online)

---

## 5. Ejemplo Completo de Integración

Te puedo ayudar a crear un archivo `js/data/torres-trails.geojson` con las rutas reales. Solo necesitas:

1. Obtener los datos (recomiendo Overpass Turbo)
2. Guardarlos como GeoJSON
3. Luego te ayudo a integrarlos

**¿Quieres que te ayude a:**
- Crear una función para cargar GeoJSON?
- Convertir datos GPX a formato JavaScript?
- Integrar carga automática desde OpenStreetMap?

---

## 6. Recomendaciones

1. **Usa OpenStreetMap** - Es gratuito, actualizado y tiene buena cobertura
2. **Valida los datos** - Compara con mapas oficiales del parque
3. **Actualiza periódicamente** - Los senderos pueden cambiar
4. **Respetar la topografía** - Los senderos siguen valles y áreas transitables
5. **Considera la elevación** - Los datos GPX incluyen altura, útil para visualización

---

## Próximos Pasos

1. Ve a https://overpass-turbo.eu/
2. Crea una consulta para senderos de Torres del Paine
3. Exporta como GeoJSON
4. Guárdalo en tu proyecto
5. Integra la función de carga (te puedo ayudar con esto)

¿Quieres que implemente la carga de senderos reales en tu aplicación ahora?
