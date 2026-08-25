<script setup lang="ts">
import { ref } from 'vue';
import NavBar from './components/NavBar.vue'
import SideBar from './components/SideBar.vue';
import ProductListingPage from './components/ProductListingPage.vue';

const activeCategoryId = ref<string | null>(null);
const activeSubCategory = ref<string | null>(null);



</script>

<template>
	<NavBar @active-category-id-changed="activeCategoryId = $event" />
	<section class="app_content-container">
		<SideBar :activeCategoryId="activeCategoryId" @active-sub-category-id-changed="activeSubCategory = $event" />
		<ProductListingPage :activeCategoryId="activeCategoryId" :activeSubCategoryId="activeSubCategory" />
	</section>
</template>

<style lang="css" scoped>
	.app_content-container {
		display: flex;
		gap: 16px;
	}
</style>
	
