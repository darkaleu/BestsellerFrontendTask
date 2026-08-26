<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { RouterLink } from 'vue-router'
  import SideBar from './SideBar.vue'
  import { useProducts } from '../composables/useProducts'

  const props = defineProps<{
    activeCategoryId: string | null,
    activeSubCategoryId: string | null
  }>()

  const activeSubCategoryId = ref(props.activeSubCategoryId)
  const priceSort = ref<'default' | 'asc' | 'desc'>('default')
  const { products, isLoading, error } = useProducts()

  const filteredProducts = computed(() => {
    const categoryId = activeSubCategoryId.value === null ? props.activeCategoryId : activeSubCategoryId.value
    
    if (!categoryId) {
      return []
    }

    return products.value.filter((product) => product.categories.includes(categoryId))
  })

  const sortedProducts = computed(() => {
    if (priceSort.value === 'default') {
      return filteredProducts.value
    }

    return [...filteredProducts.value].sort((firstProduct, secondProduct) => {
      return priceSort.value === 'asc'
        ? firstProduct.price - secondProduct.price
        : secondProduct.price - firstProduct.price
    })
  })

</script>

<template>
  <main class="product-listing">
    <SideBar
      :activeCategoryId="props.activeCategoryId"
      @active-sub-category-id-changed="activeSubCategoryId = $event || null"
    />
    <div class="product-listing__content">
      <p v-if="isLoading" class="product-listing__empty-state">Loading products...</p>
      <p v-else-if="error" class="product-listing__empty-state">{{ error }}</p>
      <p v-else-if="filteredProducts.length === 0" class="product-listing__empty-state">
        No products found.
      </p>
      <template v-else > 
        <div class="product-listing__sort">
          <label for="price-sort">Sort by price:</label>
          <select id="price-sort" v-model="priceSort">
            <option value="default">Default</option>
            <option value="asc">Low to high</option>
            <option value="desc">High to low</option>
          </select>
        </div>
        <div class="product-listing__grid">
          <article v-for="product in sortedProducts" :key="product.id" class="product-listing__card">
            <RouterLink
              :to="{
                path: `/product/${product.id}`,
                query: {
                  categoryId: props.activeCategoryId ?? undefined,
                  subCategoryId: activeSubCategoryId ?? undefined,
                },
              }"
              class="product-listing__card-link">
              <img :src="product.images && product.images.length > 0 ? product.images[0] : ''" :alt="product.name.en || product.name.dk || product.brand" />
              <div class="product-listing__card-details">
                <p class="product-listing__card-brand">{{ product.brand }}</p>
                <h2 class="product-listing__card-name">{{ product.name.en || product.name.dk }}</h2>
                <p class="product-listing__card-price">{{ product.price.toFixed(2) }} DKK</p>
              </div>
            </RouterLink>
          </article>
        </div>
      </template>
    </div>
  </main>
</template>

<style lang="css" scoped>
  .product-listing {
    display: flex;
    flex: 1;
    min-width: 0;
    padding: 16px 0;
  }

  .product-listing__content {
    flex: 1;
    min-width: 0;
    padding-left: 16px;
  }

  .product-listing__sort {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }

  .product-listing__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
    padding: 16px 0;
  }

  .product-listing__card {
    overflow: hidden;
    border: 1px solid #e2e2e2;
    background: #fff;
  }

  .product-listing__card img {
    display: block;
    width: 100%;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    background: #f3f3f3;
  }

  .product-listing__card .product-listing__card-details {
    padding: 12px;
  }

  .product-listing__card-brand,
  .product-listing__card-price {
    margin: 0;
  }

  .product-listing__card-brand {
    color: #666;
    font-size: 0.875rem;
  }

  .product-listing__card h2 {
    margin: 4px 0 12px;
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
  }

  .product-listing__card-price {
    font-weight: 700;
  }

  .product-listing__card-link {
    text-decoration: none;
    color: inherit;
  }

  .product-listing__empty-state {
    padding: 16px;
  }
</style>