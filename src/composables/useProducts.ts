import { onMounted, ref } from 'vue'
import { fetchProducts, type Product } from '../services/productService'

export function useProducts() {
	const products = ref<Product[]>([])
	const isLoading = ref(true)
	const error = ref('')

	onMounted(async () => {
		try {
			products.value = await fetchProducts()
		} catch {
			error.value = 'Unable to load products.'
		} finally {
			isLoading.value = false
		}
	})

	return { products, isLoading, error }
}
