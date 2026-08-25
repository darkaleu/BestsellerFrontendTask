<script setup lang="ts">
  import { computed } from 'vue'
  import { useProducts } from '../composables/useProducts'

  const props = defineProps<{
    activeCategoryId: string | null,
    activeSubCategoryId: string | null
  }>()

  const { products, isLoading, error } = useProducts()

  const filteredProducts = computed(() => {
    const categoryId = props.activeSubCategoryId || props.activeCategoryId

    if (!categoryId) {
      return []
    }

    return products.value.filter((product) => product.categories.includes(categoryId))
  })
</script>

<template>
  <main class="product-listing">
    <p v-if="isLoading" class="empty-state">Loading products...</p>
    <p v-else-if="error" class="empty-state">{{ error }}</p>
    <p v-else-if="filteredProducts.length === 0" class="empty-state">
      No products found.
    </p>
    <div v-else class="product-grid">
      <article v-for="product in filteredProducts" :key="product.id" class="product-card">
        <img :src="product.images[0]" :alt="product.name.en || product.name.dk || product.brand" />
        <div class="product-card__details">
          <p class="product-card__brand">{{ product.brand }}</p>
          <h2>{{ product.name.en || product.name.dk }}</h2>
          <p class="product-card__price">{{ product.price.toFixed(2) }}</p>
        </div>
      </article>
    </div>
  </main>
</template>

<style lang="css" scoped>
  .product-listing {
    flex: 1;
    min-width: 0;
    padding: 16px 0;
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }

  .product-card {
    overflow: hidden;
    border: 1px solid #e2e2e2;
    background: #fff;
  }

  .product-card img {
    display: block;
    width: 100%;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    background: #f3f3f3;
  }

  .product-card__details {
    padding: 12px;
  }

  .product-card__brand,
  .product-card__price {
    margin: 0;
  }

  .product-card__brand {
    color: #666;
    font-size: 0.875rem;
  }

  .product-card h2 {
    margin: 4px 0 12px;
    font-size: 1rem;
    font-weight: 500;
  }

  .product-card__price {
    font-weight: 700;
  }

  .empty-state {
    padding: 16px;
  }
</style>