import { NavLink } from "react-router-dom";
import {
  activeLink,
  baseLink,
  hoverLink,
  inactiveLink,
} from "../../styles/sidebarLink";

export default function Sidebar() {
  return (
    <div className="min-w-[200px] max-w-[200px] max-h-[calc(100vh-65px)] bg-gray-800">
      <div className="flex flex-col items-center justify-center my-8 mx-2">
        <NavLink
          to="/admin/benutzer"
          className={({ isActive }) =>
            `${baseLink} ${hoverLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          Benutzer
        </NavLink>
        <NavLink
          to="/admin/artikel"
          className={({ isActive }) =>
            `${baseLink} ${hoverLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          Artikel
        </NavLink>
        <NavLink
          to="/admin/foto-meldungen"
          className={({ isActive }) =>
            `${baseLink} ${hoverLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          Fotomeldungen
        </NavLink>

        <NavLink
          to="/admin/artikel-meldungen"
          className={({ isActive }) =>
            `${baseLink} ${hoverLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          Artikelmeldungen
        </NavLink>
      </div>
    </div>
  );
}
