import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

export default function ForbiddenPage() {
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8">
                <div>
                    <h1 className="text-center text-4xl font-extrabold text-gray-900">
                        403 - Access Forbidden
                    </h1>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {user
                            ? "You don't have permission to access this page."
                            : "Please log in to access this page."}
                    </p>
                </div>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
                    >
                        Home
                    </button>
                </div>
            </div>
        </div>
    );
} 