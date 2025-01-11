import { useAuth } from '@/hooks/useAuth';
import { withAuth } from '@/components/auth/withAuth';
import { useProfile } from '@/hooks/useProfile';

function DashboardPage() {
    const { user, logout } = useAuth();
    const { updateProfile, isLoading } = useProfile();

    const handleUpdateProfile = async () => {
        try {
            await updateProfile({
                first_name: 'Updated',
                last_name: 'Name'
            });
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold">Dashboard</h1>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-700 mr-4">
                                Welcome, {user?.user_metadata.first_name || user?.email}
                            </span>
                            <button
                                onClick={() => logout()}
                                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium mb-4">Profile Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <div className="mt-1 text-sm text-gray-900">{user?.email}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <div className="mt-1 text-sm text-gray-900">
                                    {user?.user_metadata.first_name} {user?.user_metadata.last_name}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Roles</label>
                                <div className="mt-1 text-sm text-gray-900">
                                    {user?.user_metadata.roles.join(', ')}
                                </div>
                            </div>
                            <div>
                                <button
                                    onClick={handleUpdateProfile}
                                    disabled={isLoading}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {isLoading ? 'Updating...' : 'Update Profile'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Protect this page with authentication
export default withAuth(DashboardPage, {
    requiredRoles: ['user'],
    requireAuth: true
}); 