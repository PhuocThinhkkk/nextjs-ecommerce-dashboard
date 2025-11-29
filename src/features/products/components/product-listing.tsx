import { searchParamsCache } from '@/lib/searchparams';
import { ProductTable } from './product-tables';
import {
  getProductsByFilter,
  getTotalProductsNumber
} from '@/services/product';
import { PageTableFilterData } from '@/types/data-table';

type ProductListingPage = {};

export default async function ProductListingPage({}: ProductListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageSize = searchParamsCache.get('perPage');
  const categories = searchParamsCache.get('category');

  const filters = {
    page,
    pageSize,
    ...(search && { search }),
    ...(categories && { categories: categories })
  };

  const [data, totalProducts] = await Promise.all([
    getProductsByFilter({ page: page, pageSize: pageSize }),
    getTotalProductsNumber()
  ]);

  const pageData: PageTableFilterData = {
    page,
    pageSize,
    ...(search && { search }),
    ...(categories && { categories: categories }),
    total: totalProducts
  };

  return (
    <ProductTable data={data} totalItems={totalProducts} pageData={pageData} />
  );
}
