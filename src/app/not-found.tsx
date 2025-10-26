/**
 * 404 Not Found Page
 *
 * Custom 404 error page
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center space-y-6">
        <div className="text-8xl">🔍</div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-600">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/study">Start Studying</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// TODO: Add search functionality
// TODO: Add recent pages suggestion
