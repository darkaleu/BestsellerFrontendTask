import data from '../../data.json'

export interface Category {
  id: string
  parent_category_id: string
  level: number
  name: {
    en: string
    dk: string
  }
  categories?: Category[]
}

interface CategoryData {
  categories: {
    categories: Category[]
  }
}

function flattenCategories(category: Category): Category[] {
  return [
    category,
    ...(category.categories?.flatMap(flattenCategories) ?? []),
  ]
}

function getCategoryTree(): Category[] {
  const rootCategories = (data as CategoryData).categories.categories
  return rootCategories.flatMap(flattenCategories)
}

function getDescendantCategories(categories: Category[], parentCategoryId: string): Category[] {
  const children = categories.filter((category) => category.parent_category_id === parentCategoryId)

  return children.flatMap((category) => [
    category,
    ...getDescendantCategories(categories, category.id),
  ])
}

export async function fetchRootCategories(): Promise<Category[]> {
  const categoryTree = getCategoryTree()

  // Keep this asynchronous to mirror a future API request.
  await Promise.resolve()

  return categoryTree.filter(
    (category) =>
      category.id === 'kids' || category.parent_category_id === 'adults',
  )
}

export async function fetchSubCategories(parentCategoryId?: string): Promise<Category[]> {
  const categoryTree = getCategoryTree()

  // Keep this asynchronous to mirror a future API request.
  await Promise.resolve()

  if (!parentCategoryId) {
    return categoryTree.filter((category) => category.parent_category_id !== 'root')
  }

  return getDescendantCategories(categoryTree, parentCategoryId)
}
