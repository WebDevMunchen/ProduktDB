import { useState } from "react";
import axiosClient from "../utils/axiosClient";
import { toast } from "react-toastify";

export default function UserCard({ user }) {
  const [isLoading, setIsloading] = useState(false);

  const handleResendActiviationLink = () => {
    setIsloading(true);
    axiosClient
      .post(`/user/sendActivation/${user._id}`)
      .then(() => {
        toast.success("E-Mail gesendet!");
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsloading(false);
      });
  };

  return (
    <>
      <td className="pl-6 py-3 whitespace-nowrap">
        <a href={`/admin/benutzer/bearbeiten/${user._id}`}>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {user.firstName + " " + user.lastName}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </a>
      </td>
      <td className=" py-3 whitespace-nowrap">
        <a href={`/admin/benutzer/bearbeiten/${user._id}`}>
          <div className="text-sm text-gray-900">{user.userId}</div>
        </a>
      </td>
      <td className=" py-3 whitespace-nowrap">
        <a href={`/admin/benutzer/bearbeiten/${user._id}`}>
          <div className="text-sm text-gray-900">{user.location}</div>
        </a>
      </td>
      <td className=" py-3 whitespace-nowrap">
        <a href={`/admin/benutzer/bearbeiten/${user._id}`}>
          <div className="text-sm text-gray-900">{user.department}</div>
        </a>
      </td>
      <td className=" py-3 whitespace-nowrap">
        <a href={`/admin/benutzer/bearbeiten/${user._id}`}>
          <div className="text-sm text-gray-900">{user.role}</div>
        </a>
      </td>
      <td className="py-3 whitespace-nowrap ">
        <a href={`/admin/benutzer/bearbeiten/${user._id}`}>
          <span
            className={`px-4 py-1 inline-flex text-sm leading-5 font-medium rounded-full tracking-wide ${
              user.status === "aktiv"
                ? "bg-green-100 text-green-700"
                : user.status === "gesperrt"
                ? "bg-red-100 text-red-700"
                : user.status === "ausstehend"
                ? "bg-blue-100 text-blue-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {user.status}
          </span>
        </a>
      </td>
      <td className="py-3 whitespace-nowrap">
        {user.status === "ausstehend" ? (
          isLoading ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={36}
              height={36}
              viewBox="0 0 24 24"
              className="text-blue-700"
            >
              <path
                fill="currentColor"
                d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"
              >
                <animateTransform
                  attributeName="transform"
                  dur="0.788s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="0 12 12;360 12 12"
                ></animateTransform>
              </path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={36}
              height={36}
              viewBox="0 0 48 48"
              onClick={handleResendActiviationLink}
              className="transition-transform duration-300 transform hover:scale-125 cursor-pointer"
            >
              <g
                fill="none"
                stroke="#5eb6f0ff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.7}
              >
                <path d="M44 24V9H24H4V24V39H24"></path>
                <path d="M44 34L30 34"></path>
                <path d="M39 29L44 34L39 39"></path>
                <path d="M4 9L24 24L44 9"></path>
              </g>
            </svg>
          )
        ) : (
          <span className="hidden">Placeholder</span>
        )}
      </td>
    </>
  );
}
