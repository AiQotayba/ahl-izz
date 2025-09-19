'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
import {
    Search,
    Plus,
    Shield,
    Mail,
    Calendar,
    UserPlus,
    Settings
} from 'lucide-react';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    lastLogin?: string;
}

// Simple Badge component
const Badge = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${className}`}>
    {children}
  </span>
);

export default function UsersManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddUser, setShowAddUser] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // Mock data for now - replace with actual API call
            const mockUsers: User[] = [
                {
                    _id: '1',
                    name: 'مدير النظام',
                    email: 'admin@admin.com',
                    role: 'admin',
                    createdAt: '2024-01-01T00:00:00Z',
                    lastLogin: '2024-01-15T10:30:00Z'
                }
            ];
            setUsers(mockUsers);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Mock user creation - replace with actual API call
            const user: User = {
                _id: Date.now().toString(),
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                createdAt: new Date().toISOString()
            };

            setUsers([...users, user]);
            setNewUser({ name: '', email: '', password: '', role: 'admin' });
            setShowAddUser(false);
        } catch (error) {
            console.error('Failed to add user:', error);
        }
    };

    const getRoleBadge = (role: string) => {
        const roleConfig = {
            admin: { color: 'bg-blue-100 text-blue-800', text: 'مدير' },
            moderator: { color: 'bg-green-100 text-green-800', text: 'مشرف' },
            user: { color: 'bg-gray-100 text-gray-800', text: 'مستخدم' },
        };

        const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;

        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                <Shield className="w-3 h-3" />
                {config.text}
            </Badge>
        );
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">إدارة المستخدمين</h1>
                    <p className="text-gray-600">عرض وإدارة مستخدمي النظام</p>
                </div>
                <Button onClick={() => setShowAddUser(true)}>
                    <UserPlus className="w-4 h-4 ml-2" />
                    إضافة مستخدم
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
                                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                            </div>
                            <Shield className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">المديرين</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {users.filter(u => u.role === 'admin').length}
                                </p>
                            </div>
                            <Shield className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">المشرفين</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {users.filter(u => u.role === 'moderator').length}
                                </p>
                            </div>
                            <Settings className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="البحث في المستخدمين..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Users List */}
            <Card>
                <CardHeader>
                    <CardTitle>قائمة المستخدمين</CardTitle>
                    <CardDescription>
                        عرض {filteredUsers.length} من أصل {users.length} مستخدم
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredUsers.map((user) => (
                            <div
                                key={user._id}
                                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-lg font-medium text-blue-600">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="font-medium text-gray-900">{user.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">{user.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            {getRoleBadge(user.role)}
                                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                                <Calendar className="w-3 h-3" />
                                                <span>
                                                    انضم في {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                                                </span>
                                            </div>
                                            {user.lastLogin && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    آخر دخول: {new Date(user.lastLogin).toLocaleDateString('ar-SA')}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm">
                                                <Settings className="w-4 h-4 ml-1" />
                                                تعديل
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredUsers.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                لا توجد مستخدمين تطابق المعايير المحددة
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Add User Modal */}
            {showAddUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>إضافة مستخدم جديد</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowAddUser(false)}
                                className="absolute top-4 left-4"
                            >
                                ✕
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddUser} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">الاسم</label>
                                    <Input
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                        placeholder="اسم المستخدم"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                                    <Input
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        placeholder="user@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">كلمة المرور</label>
                                    <Input
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">الدور</label>
                                    <select
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="admin">مدير</option>
                                        <option value="moderator">مشرف</option>
                                        <option value="user">مستخدم</option>
                                    </select>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button type="submit" className="flex-1">
                                        <UserPlus className="w-4 h-4 ml-1" />
                                        إضافة المستخدم
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowAddUser(false)}
                                        className="flex-1"
                                    >
                                        إلغاء
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
