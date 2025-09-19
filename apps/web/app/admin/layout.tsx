import { redirect } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This would typically check for authentication
  // For now, we'll redirect to login if not authenticated
  // In a real app, you'd check for JWT token or session
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          </div>
          <nav className="mt-6">
            <a
              href="/admin"
              className="block px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              Dashboard
            </a>
            <a
              href="/admin/pledges"
              className="block px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              Pledges
            </a>
            <a
              href="/admin/users"
              className="block px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              Users
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

