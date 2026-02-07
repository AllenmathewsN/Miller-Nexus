'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="py-16">
      <div className="container-max text-center">
        <h2 className="text-2xl font-semibold">Something went wrong!</h2>
        <button
          className="btn-primary mt-4"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </div>
  )
}