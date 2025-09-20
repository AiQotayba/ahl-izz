'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  LogOut,
  Home,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [loading, isAuthenticated, pathname, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div
        className="min-h-screen islamic-pattern flex items-center justify-center"
        style={{
          backgroundImage: 'url(/images/bg2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="text-center bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-donation-teal/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-donation-teal mx-auto"></div>
          <p className="mt-4 text-donation-darkTeal font-somar">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Don't render layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const navigation = [
    {
      name: 'مركز التحكم',
      href: '/admin',
      icon: LayoutDashboard,
      current: pathname === '/admin',
    },
    {
      name: 'مركز التبرعات',
      href: '/admin/pledges',
      icon: DollarSign,
      current: pathname === '/admin/pledges',
    },
    // {
    //   name: 'مركز المستخدمين',
    //   href: '/admin/users',
    //   icon: Users,
    //   current: pathname === '/admin/users',
    // },
  ];

  return (
    <div
      className="min-h-screen islamic-pattern"
      style={{
        backgroundImage: 'url(/images/bg2.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      dir="rtl"
    >
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 hidden lg:block bg-white/95 backdrop-blur-sm shadow-lg border-r border-donation-teal/20">
          <div className="p-6 border-b border-donation-teal/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 ml-2 h-10 bg-gradient-to-br from-donation-teal to-donation-darkTeal rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-donation-darkTeal font-somar">لوحة التحكم  </h2>
                <p className="text-sm text-donation-teal font-somar">حملة أهُل العز لايُنسون</p>
              </div>
            </div>
          </div>

          <nav className="mt-6 px-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl mb-2 transition-all duration-200 font-somar ${item.current
                    ? 'bg-gradient-to-r from-donation-teal/10 to-donation-gold/10 text-donation-darkTeal border-r-4 border-donation-teal shadow-md'
                    : 'text-donation-darkTeal hover:bg-gradient-to-r hover:from-donation-teal/5 hover:to-donation-gold/5 hover:text-donation-teal hover:shadow-sm'
                    }`}
                >
                  <Icon className="w-5 h-5 ml-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-donation-teal/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-donation-gold to-donation-teal rounded-full flex items-center justify-center shadow-md">
                  <span className="text-sm font-bold text-white font-somar">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-donation-darkTeal font-somar">مدير النظام</p>
                  <p className="text-xs text-donation-teal font-somar">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                href="/"
                className="flex items-center px-3 py-2 text-sm font-medium text-donation-darkTeal hover:bg-gradient-to-r hover:from-donation-teal/5 hover:to-donation-gold/5 rounded-lg transition-all duration-200 font-somar"
              >
                <Home className="w-4 h-4 ml-3" />
                الموقع العام للمتبرعين
              </Link>

              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-donation-darkTeal hover:bg-gradient-to-r hover:from-donation-teal/5 hover:to-donation-gold/5 font-somar"
              >
                <LogOut className="w-4 h-4 ml-3" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-auto bg-white/80 backdrop-blur-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

