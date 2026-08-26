import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import ProductDetailsPage from './components/ProductDetailsPage.vue'
import ProductListingPage from './components/ProductListingPage.vue'

const routes = [
  {
    path: '/category/:categoryId',
    component: ProductListingPage,
    props: (route: { params: { categoryId?: string }, query: { subCategoryId?: string } }) => ({
      activeCategoryId: route.params.categoryId ?? null,
      activeSubCategoryId: route.query.subCategoryId ?? null,
    }),
  },
  {
    path: '/product/:productId',
    component: ProductDetailsPage,
    props: (route: { params: { productId?: string, categoryId?: string, subCategoryId?: string } }) => ({
      productId: route.params.productId ?? null,
      categoryId: route.params.categoryId ?? null,
      subCategoryId: route.params.subCategoryId ?? null,
    }),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/category/all',
  },
]

export function createAppRouter() {
  return createRouter({
    history: typeof window === 'undefined' ? createMemoryHistory() : createWebHistory(),
    routes,
  })
}
