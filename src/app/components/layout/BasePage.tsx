import { ReactNode } from 'react';
import Navbar from '../ui/Navbar';

type Props = {
    children: ReactNode;
    title?: string;
};

export default function BasePage({ children, title }: Props) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
            <main className="flex-1 p-6">{children}</main>
            <Navbar />
            <footer className="bg-white shadow-inner p-4 text-center text-sm">
                &copy; 2025 My App
            </footer>
        </div>
    );
}
