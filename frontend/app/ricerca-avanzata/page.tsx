import { getCategories, getStatuses } from "@/lib/api"
import AdvancedSearchForm from "@/app/components/AdvancedSearchForm"

export const dynamic = 'force-dynamic'

export default async function AdvancedSearchPage() {
  
  const [categoriesRes, statusesRes] = await Promise.allSettled([
    getCategories(),
    getStatuses()
  ])

  const categories = categoriesRes.status === 'fulfilled' ? categoriesRes.value.data : []
  const statuses = statusesRes.status === 'fulfilled' ? statusesRes.value.data : []

  return (
    <AdvancedSearchForm 
      categories={categories} 
      statuses={statuses} 
    />
  )
}