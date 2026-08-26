<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProducts } from '../composables/useProducts'

const props = defineProps<{
	productId: string | null
}>()

const { products, isLoading, error } = useProducts()
const route = useRoute()

const categoryId = computed(() => String(route.query.categoryId ?? ''))
const subCategoryId = computed(() => {
	const value = route.query.subCategoryId
	return typeof value === 'string' && value.length > 0 ? value : undefined
})

const product = computed(() => products.value.find((item) => String(item.id) === props.productId))
</script>

<template>
	<main class="product-details">
		<p v-if="isLoading">Loading product...</p>
		<p v-else-if="error">{{ error }}</p>
		<p v-else-if="!product">Product not found.</p>
		<template v-else>
            <div class="product-details__breadcrumbs">
				<router-link
					:to="{
						path: `/category/${categoryId}`,
						query: { subCategoryId },
					}"
					class="product-details__breadcrumb-link"
				>
                    Back to Products
                </router-link>
            </div>
            <div class="product-details__image-container" v-if="product.images.length > 0">
                <img class="product-details__image"
                    v-for="(image, index) in product.images"
                    :key="index"
                    :src="image"
                    :alt="product.name.en || product.name.dk || product.brand"
                />
			</div>
			<p class="product-details__brand">{{ product.brand }}</p>
			<h1 class="product-details__name">{{ product.name.en || product.name.dk }}</h1>
            <p class="product-details__color">Color: {{ product.color }}</p>
            <div class="product-details__size-container" v-if="product.size.length > 0">
                <label for="size-select">Size:</label>
                <select id="size-select" class="product-details__size">
                    <option v-for="size in product.size" :key="size" :value="size">{{ size }}</option>
                </select>
            </div>
			<p class="product-details__price">{{ product.price.toFixed(2) }} DKK</p>
		</template>
	</main>
</template>

<style lang="css" scoped>
    .product-details {
        padding: 16px;
    }

    .product-details__brand {
        color: #666;
        font-size: 12px;
    }

    .product-details__name {
        font-size: 14px;
        font-weight: 700;
        margin: 8px 0;
    }

    .product-details__price {
        font-size: 16px;
        margin: 8px 0;
    }

    .product-details__color {
        font-size: 14px;
    }

    .product-details__size-container {
        display: flex;
        gap: 8px;
        font-size: 14px;
    }

    .product-details__image-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 16px;
    }

	.product-details__image {
		max-width: 200px;
		height: auto;
	}

    .product-details__breadcrumbs {
        margin-bottom: 16px;
    }

    .product-details__breadcrumb-link {
        text-decoration: none;
        color: #1b1b1b;
        font-size: 14px;
    }
</style>