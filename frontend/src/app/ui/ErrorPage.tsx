import { useRouteError, isRouteErrorResponse } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  let errorMessage: string;
  let errorStatus: number | undefined;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = "An unknown error occurred";
  }

  return (
    <div
      id="error-page"
      className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gray-50 text-center"
    >
      <h1 className="text-4xl font-bold text-red-500">Oops!</h1>
      <p className="text-lg text-gray-700">
        Sorry, an unexpected error has occurred.
      </p>
      <p className="text-md rounded-md bg-gray-100 p-3 font-mono text-gray-500">
        <i>
          {errorStatus && `${errorStatus}: `}
          {errorMessage}
        </i>
      </p>
    </div>
  );
};

export default ErrorPage;
