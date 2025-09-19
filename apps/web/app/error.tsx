'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen overflow-hidden p-6 relative m-auto"
      style={{
        backgroundImage: 'url(/bg2.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      dir="rtl"
    >
      <div className="max-w-2xl mx-auto text-center">
        <Card className="w-full max-w-md mx-auto bg-white/98 backdrop-blur-sm border-0 shadow-2xl ring-1 ring-black/5">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-6 h-20 w-20 bg-red-100 rounded-full flex items-center justify-center shadow-lg">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle className="text-3xl text-red-600 font-bold mb-3">حدث خطأ!</CardTitle>
            <CardDescription className="text-gray-700 text-lg leading-relaxed">
              عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={reset}
              className="w-full bg-gradient-to-r from-[#1E7B6B] to-[#2F4F4F] hover:from-[#2F4F4F] hover:to-[#1E7B6B] text-white font-bold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <RefreshCw className="ml-2 h-5 w-5" />
              المحاولة مرة أخرى
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-2 border-[#1E7B6B] text-[#1E7B6B] hover:bg-[#1E7B6B] hover:text-white font-semibold py-3 text-lg transition-all duration-300"
              onClick={() => window.location.href = '/'}
            >
              العودة للصفحة الرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
