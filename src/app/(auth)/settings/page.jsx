"use client";
import React from "react";
import { useAuthContext } from "@/context/auth-provider";
import LoadingScreen from "@/components/shared/Loader";
import { useRouter } from "next/navigation";

export default function Page() {
  const { isUserLoggedIn, isLoading, isAdjuster, isAdmin, isSuperAdmin, currentUser } =
    useAuthContext();
    const router = useRouter();
console.log(currentUser);
const registrationDate = "2024-05-29T10:17:01.547+00:00";

// Function to format the date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    
    return date.toLocaleDateString('en-US', options);
  };

  if (!isUserLoggedIn) {
    router.push("/login");
  } else {
    return !isLoading ? (
      <div className="mt-5">
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Account Information */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-1 text-center">
                  Account Information
                </h3>
                <p className="text-gray-600 mb-6 text-center">Edit your profile quickly</p>
                <div className="flex items-center mb-4 gap-4 justify-between">
                  <svg
                    stroke="currentColor"
                    className="w-16 h-16"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"></path>
                  </svg>
                  <div className="text-gray-600 text-sm">
                  <span className="font-semibold">Registered on:<br/> </span>{formatDate(registrationDate)}
                </div>
                  {/* <div className="ml-4">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    Upload
                  </button>
                </div> */}
                </div>
                <form>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700">Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg"
                        value={currentUser.name}
                        name="name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">
                        Email Address
                      </label>
                      <div className="w-full px-4 py-2 border rounded-lg">
                        {currentUser.email}
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700">Phone</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2 border rounded-lg"
                        value={currentUser.phone}
                        name="phone"
                      />
                    </div>
                    <div>
                      <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Update Now
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Password Section */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Change Password</h3>
                <form>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">
                        Re-type New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <LoadingScreen showLabel={true} label="Checking user status" />
    );
  }
}
