import { CgSpinner } from "react-icons/cg";

const AuthCallbackPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="space-y-6 rounded-xl bg-white p-8 text-center shadow-lg">
          <div className="flex justify-center">
            <CgSpinner className="h-12 w-12 animate-spin text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Authenticating...
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Please wait while we connect to your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
