export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          {/* Main Image Pulse */}
          <div className="w-full lg:w-1/2 aspect-[4/5] rounded-2xl bg-surface animate-pulse border border-border" />

          {/* Product Info Pulse */}
          <div className="w-full lg:w-1/2 space-y-8 py-4">
            <div className="space-y-4">
              <div className="h-4 w-32 bg-surface animate-pulse rounded" />
              <div className="h-12 w-full bg-surface animate-pulse rounded" />
              <div className="h-6 w-48 bg-surface animate-pulse rounded" />
            </div>

            <div className="h-24 w-full bg-surface animate-pulse rounded" />
            
            <div className="space-y-4">
              <div className="h-8 w-full bg-surface animate-pulse rounded" />
              <div className="h-16 w-full bg-surface animate-pulse rounded" />
            </div>

            <div className="flex gap-4">
              <div className="h-16 flex-[3] bg-surface animate-pulse rounded-xl" />
              <div className="h-16 flex-1 bg-surface animate-pulse rounded-xl" />
              <div className="h-16 flex-1 bg-surface animate-pulse rounded-xl" />
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center">
          <div className="animate-pulse text-primary font-cinzel tracking-widest text-sm uppercase">MANIFESTING ARTIFACT...</div>
        </div>
      </div>
    </div>
  );
}
