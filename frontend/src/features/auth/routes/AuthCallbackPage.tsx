import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";
import { MdErrorOutline } from "react-icons/md";
import { useAuth } from "../../../hooks/useAuth";

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      login(token);
      navigate("/");
    } else if (!error) {
      console.error("somethings went wrong!");
      navigate("/login");
    }
  }, [login, navigate, searchParams]);

  const errorParam = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (errorParam) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="space-y-6 rounded-xl bg-white p-8 text-center shadow-lg">
            <div className="flex justify-center">
              <MdErrorOutline className="h-12 w-12 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Authentication Failed
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {(errorDescription || "An unknown error occurred.").replace(
                  /\\n/g,
                  " "
                )}
              </p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

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
