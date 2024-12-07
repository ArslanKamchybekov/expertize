export default function UserProfileLayout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-12">
            <div className="w-full max-w-4xl p-8 bg-themeBlack rounded-lg shadow-lg">
                {children}
            </div>
        </div>
    );
}
