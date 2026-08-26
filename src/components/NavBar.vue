<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCategories } from '../composables/useCategories'

const { categories, isLoading, error } = useCategories()
const activeCategoryId = ref<string | null>(null)
const emit = defineEmits<{
  activeCategoryIdChanged: [categoryId: string]
}>()

const setActiveCategory = (categoryId: string) => {
  activeCategoryId.value = categoryId
  emit('activeCategoryIdChanged', categoryId)
}

onMounted(() => {
  const categoryId = window.location.pathname.match(/^\/category\/([^/]+)/)?.[1]
  if (categoryId) {
    activeCategoryId.value = categoryId
    emit('activeCategoryIdChanged', categoryId)
  }
})

</script>

<template>
  <nav aria-label="Main navigation" class="navbar">
    <p v-if="isLoading">Loading categories...</p>
    <p v-else-if="error">{{ error }}</p>
    <template v-else>
      <template v-for="category in categories" :key="category.id">
        <a class="navbar-item" 
          :class="{ 'navbar-item--active': activeCategoryId === category.id }" 
          :href="`/category/${category.id}`" 
          @click="setActiveCategory(category.id)">{{ category.name.en }}</a>
      </template>
    </template>
  </nav>
</template>

<style lang="css" scoped>
    .navbar {
        border-bottom: 1px solid #ccc;
        padding: 16px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        gap: 16px;
    }

    .navbar-item {
        text-decoration: none;
        color: #505050;
    }

    .navbar-item--active {
        font-weight: bold;
        color: #1b1b1b;
    }

</style>
