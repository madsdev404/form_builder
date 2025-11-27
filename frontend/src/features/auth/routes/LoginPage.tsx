import { SiAirtable } from "react-icons/si";

const LoginPage = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="space-y-6 rounded-xl bg-white p-8 text-center shadow-lg">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Form Builder
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          <a
            href={`${backendUrl}/api/auth/airtable`}
            className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-3 text-base font-semibold text-gray-700 shadow-sm transition-all duration-150 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <SiAirtable className="h-5 w-5 text-[#18BFFF]" />
            Sign in with Airtable
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
