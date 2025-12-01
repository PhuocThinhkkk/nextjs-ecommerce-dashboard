import { getProductsWithTotalOrders } from '@/services/product';
import Image from 'next/image';

export async function TopProductsRanking() {
  const products = await getProductsWithTotalOrders();
  // Sort and get top 3
  const sorted = [...products].sort((a, b) => b.orders - a.orders).slice(0, 3);

  // Arrange in podium order: [2nd, 1st, 3rd]
  const podium = [sorted[1], sorted[0], sorted[2]];
  const positions = [1, 0, 2]; // position indices (2nd place, 1st place, 3rd place)

  const getMedalColor = (position: number) => {
    switch (position) {
      case 0:
        return 'text-yellow-500';
      case 1:
        return 'text-gray-400';
      case 2:
        return 'text-orange-600';
      default:
        return 'text-gray-400';
    }
  };

  const getMedalLabel = (position: number) => {
    switch (position) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return '';
    }
  };

  return (
    <div className='max-h-150 w-full'>
      <div className='items-flex-end flex justify-center gap-4 md:gap-6'>
        {podium.map((product, idx) => {
          const posIndex = positions[idx];
          const isFirst = idx === 1;

          return (
            <div
              key={idx}
              className={`flex flex-col items-center ${isFirst ? 'order-2' : idx === 0 ? 'order-1' : 'order-3'}`}
            >
              {/* Product Image */}
              <div
                className={`border-border relative mb-3 overflow-hidden rounded-lg border-2 ${isFirst ? 'h-32 w-32 md:h-40 md:w-40' : 'h-24 w-24 md:h-28 md:w-28'}`}
              >
                <Image
                  src={product.photo_url || '/placeholder.svg'}
                  alt={product.name}
                  fill
                  className='object-cover'
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-b from-transparent to-black/20`}
                />
              </div>

              {/* Podium Card */}
              <div
                className={`border-border w-full rounded-t-lg border-2 border-b-0 transition-all ${
                  isFirst
                    ? 'bg-yellow-50 p-4 md:p-6 dark:bg-yellow-950/20'
                    : 'bg-gray-50 p-3 md:p-4 dark:bg-gray-900/20'
                }`}
              >
                {/* Medal and Rank */}
                <div className='mb-2 text-center'>
                  <span className='text-2xl md:text-3xl'>
                    {getMedalLabel(posIndex)}
                  </span>
                  <p
                    className={`font-bold ${isFirst ? 'text-lg md:text-xl' : 'text-sm md:text-base'}`}
                  >
                    #{posIndex + 1}
                  </p>
                </div>

                {/* Product Name */}
                <h3
                  className={`text-foreground truncate text-center font-semibold ${isFirst ? 'text-base md:text-lg' : 'text-sm'}`}
                >
                  {product.name}
                </h3>
              </div>

              {/* Podium Base with Orders Count */}
              <div
                className={`border-border text-primary-foreground w-full rounded-b-lg border-2 border-t-0 text-center font-bold transition-all ${
                  isFirst
                    ? 'bg-primary p-3 text-base md:p-4 md:text-lg'
                    : 'bg-primary/70 p-2 text-sm md:p-3'
                }`}
              >
                {product.orders} orders
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TopProductsRankingSkeleton() {
  return (
    <div className='w-full'>
      <div className='items-flex-end flex justify-center gap-4 md:gap-6'>
        {[1, 0, 2].map((idx) => {
          const isFirst = idx === 1;

          return (
            <div
              key={idx}
              className={`flex flex-col items-center ${isFirst ? 'order-2' : idx === 0 ? 'order-1' : 'order-3'}`}
            >
              {/* Skeleton Image */}
              <div
                className={`bg-muted mb-3 animate-pulse rounded-lg ${
                  isFirst
                    ? 'h-32 w-32 md:h-40 md:w-40'
                    : 'h-24 w-24 md:h-28 md:w-28'
                }`}
              />

              {/* Skeleton Podium Card */}
              <div
                className={`border-border bg-muted w-full animate-pulse rounded-t-lg border-2 border-b-0 transition-all ${
                  isFirst ? 'p-4 md:p-6' : 'p-3 md:p-4'
                }`}
              >
                <div className='mb-2 text-center'>
                  <div
                    className={`bg-muted-foreground/20 mx-auto mb-2 h-6 rounded ${isFirst ? 'w-12' : 'w-10'}`}
                  />
                  <div
                    className={`bg-muted-foreground/20 mx-auto h-5 rounded ${isFirst ? 'w-16' : 'w-12'}`}
                  />
                </div>

                <div
                  className={`bg-muted-foreground/20 h-4 rounded ${isFirst ? 'w-32' : 'w-24'} mx-auto`}
                />
              </div>

              {/* Skeleton Podium Base */}
              <div
                className={`border-border bg-muted w-full animate-pulse rounded-b-lg border-2 border-t-0 transition-all ${
                  isFirst ? 'p-3 md:p-4' : 'p-2 md:p-3'
                }`}
              >
                <div
                  className={`bg-muted-foreground/20 h-5 rounded ${isFirst ? 'w-20' : 'w-16'} mx-auto`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
