"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiAlertTriangle } from "react-icons/fi";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "Access denied. You do not have permission to sign in.";
      case "Verification":
        return "The verification token has expired or has already been used.";
      case "Default":
      default:
        return "An error occurred during authentication. Please try again.";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <FiAlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-gray-600">
            {getErrorMessage(error)}
          </p>
        </div>

        <div className="text-center">
          <Link
            href="/signin"
            className="btn-primary inline-block"
          >
            Try Signing In Again
          </Link>
        </div>

        <div className="text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-500">
            Go back to home
          </Link>
        </div>
      </div>
    </div>
  );
}