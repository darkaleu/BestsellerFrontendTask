import { onMounted, ref } from 'vue'
import { fetchRootCategories, type Category } from '../services/categoryService'

export function useCategories() {
  const categories = ref<Category[]>([])
  const isLoading = ref(true)
  const error = ref('')

  onMounted(async () => {
    try {
      categories.value = await fetchRootCategories()
    } catch {
      error.value = 'Unable to load categories.'
    } finally {
      isLoading.value = false
    }
  })

  return { categories, isLoading, error }
}
