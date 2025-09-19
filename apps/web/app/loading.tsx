import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen overflow-hidden p-6 relative m-auto"
      style={{
        backgroundImage: 'url(/images/bg2.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Logo Skeleton */}
        <div className="flex justify-start mb-8">
          <Skeleton className="h-16 w-48 rounded-lg" />
        </div>

        {/* Content Skeleton */}
        <div className="flex flex-row items-center justify-center mx-10 w-full">
          <div className="max-w-7xl mx-auto">
            {/* Top Donations Skeleton */}
            <div className="mb-8">
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>

            {/* Stats Row Skeleton */}
            <div className="flex flex-row gap-8 mb-8 max-w-[797px]">
              <div className="flex justify-center">
                <Skeleton className="h-24 w-48 rounded-lg" />
              </div>
              <div className="flex justify-center">
                <Skeleton className="h-24 w-48 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Live Donations Skeleton */}
          <div className="max-w-7xl mx-auto px-6 flex items-center">
            <div className="flex justify-center">
              <Skeleton className="h-96 w-80 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
