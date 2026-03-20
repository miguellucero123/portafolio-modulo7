<template>
  <div class="favoritos-view">
    <div class="container">
      <header class="page-header">
        <h1 class="page-title">
          <Heart :size="40" class="header-icon" /> Mis lugares favoritos
        </h1>
        <p class="page-description">
          Puntos guardados en tu cuenta. Añade o quita favoritos desde las tarjetas o el detalle de cada lugar.
        </p>
      </header>

      <div v-if="favoriteIds.length === 0" class="empty glass-card">
        <HeartOff :size="56" />
        <h2>Aún no tienes favoritos</h2>
        <p>Explora el inicio y marca los lugares que más te interesen.</p>
        <router-link to="/" class="btn-link">Ir al inicio</router-link>
      </div>

      <section v-else class="places-grid">
        <PlaceCard
          v-for="lugar in lugaresFavoritos"
          :key="lugar.id"
          :lugar="lugar"
          :temp-unit="tempUnit"
          :show-favorite="true"
        />
      </section>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { mapGetters, mapState } from 'vuex';
import PlaceCard from '@components/PlaceCard.vue';
import { Heart, HeartOff } from 'lucide-vue-next';
import { useWeather } from '@composables/useWeather.js';

export default {
  name: 'FavoritosView',
  components: {
    PlaceCard,
    Heart,
    HeartOff
  },
  setup() {
    const { lugares, fetchWeather } = useWeather();
    onMounted(() => {
      fetchWeather();
    });
    return { lugares };
  },
  computed: {
    ...mapGetters(['favoriteIds']),
    ...mapState({
      tempUnit: (s) => s.preferences.tempUnit
    }),
    favoriteIdSet() {
      return new Set(this.favoriteIds.map(Number));
    },
    lugaresFavoritos() {
      return this.lugares.filter((l) => this.favoriteIdSet.has(l.id));
    }
  }
};
</script>

<style scoped>
.favoritos-view {
  min-height: 60vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.header-icon {
  color: #fda4af;
}

.page-description {
  color: rgba(255, 255, 255, 0.95);
  max-width: 640px;
  margin: 0.75rem auto 0;
  line-height: 1.5;
}

.empty {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 16px;
  color: #64748b;
}

.empty h2 {
  color: #334155;
  margin: 1rem 0 0.5rem;
}

.btn-link {
  display: inline-block;
  margin-top: 1.25rem;
  padding: 0.65rem 1.25rem;
  background: #667eea;
  color: white;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
}

.places-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}
</style>
