import { NavLink } from "react-router-dom";

export default function UserCard({ user }) {
  return (
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div>
            <div className="text-sm font-medium text-gray-900">
              {user.firstName + " " + user.lastName}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.userId}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.location}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.department}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.role}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
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
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
        <NavLink className="text-indigo-600 hover:text-indigo-900 mr-3">
          Bearbeiten
        </NavLink>
        <button className="text-red-600 hover:text-red-900">Löschen</button>
      </td>
    </>
  );
}
