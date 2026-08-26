<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { fetchSubCategories, type Category } from '../services/categoryService'

const props = defineProps<{
    activeCategoryId: string | null
}>()

const emit = defineEmits<{
    activeSubCategoryIdChanged: [categoryId: string]
}>()

const categories = ref<Category[]>([])
const isLoading = ref(false)
const error = ref('')
const router = useRouter()

const activeSubCategoryId = ref<string | null>(null);

const setActiveSubCategory = (categoryId: string) => {
    activeSubCategoryId.value = categoryId
    router.push({
        query: {
            ...router.currentRoute.value.query,
            categoryId: props.activeCategoryId ?? undefined,
            subCategoryId: categoryId,
        },
    })
    emit('activeSubCategoryIdChanged', categoryId)
}

const clearActiveSubCategory = () => {
    activeSubCategoryId.value = null
    router.push({
        query: {
            ...router.currentRoute.value.query,
            categoryId: undefined,
            subCategoryId: undefined,
        },
    })
    emit('activeSubCategoryIdChanged', '')
}

watch(
    () => props.activeCategoryId,
    async (parentCategoryId) => {
        categories.value = []
        error.value = ''

        if (!parentCategoryId) {
            return
        }

        isLoading.value = true
        try {
            categories.value = await fetchSubCategories(parentCategoryId)
        } catch {
            error.value = 'Unable to load subcategories.'
        } finally {
            isLoading.value = false
        }
    },
    { immediate: true },
)

onMounted(() => {
    const subCategoryIdFromUrl = router.currentRoute.value.query.subCategoryId
    if (typeof subCategoryIdFromUrl === 'string') {
        activeSubCategoryId.value = subCategoryIdFromUrl
        emit('activeSubCategoryIdChanged', subCategoryIdFromUrl)
    }
})

</script>

<template>
    <p v-if="isLoading">Loading subcategories...</p>
    <p v-else-if="error">{{ error }}</p>
    <aside class="sidebar" v-else-if="categories.length > 0">
        <p class="sidebar-header" @click="clearActiveSubCategory()">
            {{ props.activeCategoryId }}
        </p>
        <ul>
            <li v-for="category in categories" 
                :key="category.id" 
                class="sidebar-item" 
                @click="setActiveSubCategory(category.id)"
                :class="[{ 'sidebar-item-active':activeSubCategoryId === category.id }, { 'sidebar-item__subcategory': category.level === 4 }]">
               {{ category.name.en }}
            </li>
        </ul>
    </aside>
</template>

<style lang="css" scoped>
    .sidebar {
        border-right: 1px solid #ccc;
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        width: 320px;
        margin-top: 16px;
        margin-bottom: 16px;
    }

    .sidebar ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .sidebar-header {
        font-weight: bold;
        margin-bottom: 16px;
        text-transform: capitalize;
        border-bottom: 1px solid #ccc;
        padding-bottom: 4px;
        width: 100%;
        cursor: pointer;
    }

    .sidebar-item {
        color: #505050;
        cursor: pointer;
    }

    .sidebar-item:hover {
        font-weight: bold;
    }

    .sidebar-item-active {
        font-weight: bold;
        color: #1b1b1b;
    }

    .sidebar-item__subcategory {
        padding-left: 16px;
    }
</style>