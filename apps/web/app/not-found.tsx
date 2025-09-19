import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
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
      <div className="max-w-md w-full mx-auto text-center">
        <Card className="w-full mx-auto bg-white backdrop-blur-sm border-0 shadow-2xl ring-1 ring-black/5">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-6 h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center shadow-lg">
              <Search className="h-10 w-10 text-gray-600" />
            </div>
            <CardTitle className="text-3xl text-gray-800 font-bold mb-3">404</CardTitle>
            <CardDescription className="text-gray-700 text-lg leading-relaxed">
              الصفحة التي تبحث عنها غير موجودة.
            </CardDescription>
          </CardHeader>
          <CardContent className=" gap-4 flex flex-row *:w-full items-center justify-center">
            <Link href="/" className="block">
              <Button className="w-full bg-gradient-to-r from-[#1E7B6B] to-[#2F4F4F] hover:from-[#2F4F4F] hover:to-[#1E7B6B] text-white font-bold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <Home className="ml-2 h-5 w-5" />
                الرئيسية
              </Button>
            </Link>
            <Link href="/donate" prefetch={true}>
              <Button
                variant="outline"
                className="w-full border-2 border-[#1E7B6B] text-[#1E7B6B] hover:bg-[#1E7B6B] hover:text-white font-semibold py-3 text-lg transition-all duration-300"
              >
                تقديم تبرع
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
