import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/state/slices/authSlice';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class AuthErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error('Auth Error:', error, errorInfo);
    }

    private handleLogout = async () => {
        const dispatch = useDispatch();
        const router = useRouter();

        try {
            await dispatch(logoutUser());
            router.push('/auth/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    private handleRetry = () => {
        this.setState({
            hasError: false,
            error: null
        });
    };

    render() {
        if (this.state.hasError) {
            const isAuthError = this.state.error?.message.toLowerCase().includes('auth');
            
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full space-y-8 p-8">
                        <div>
                            <h2 className="text-center text-3xl font-extrabold text-gray-900">
                                {isAuthError ? 'Authentication Error' : 'Something went wrong'}
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                {this.state.error?.message}
                            </p>
                        </div>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={this.handleRetry}
                                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Try Again
                            </button>
                            {isAuthError && (
                                <button
                                    onClick={this.handleLogout}
                                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
                                >
                                    Log Out
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
} 