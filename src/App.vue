<script setup lang="ts">
import { ref } from 'vue';
import NavBar from './components/NavBar.vue'
import { RouterView } from 'vue-router';

const activeCategoryId = ref<string | null>(null);
</script>

<template>
	<NavBar @active-category-id-changed="activeCategoryId = $event" />
	<section>
		<RouterView :activeCategoryId="activeCategoryId" />
	</section>
</template>

	
