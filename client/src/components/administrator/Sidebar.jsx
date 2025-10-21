import { NavLink } from "react-router-dom";
import { sidebarLink } from "../../styles/sidebarLink";

export default function Sidebar() {
  return (
    <div className="min-w-[200px] max-w-[150px] max-h-[calc(100vh-65px)] bg-gray-800">
      <div className="flex flex-col items-center justify-center my-8 mx-2">
        <NavLink className={sidebarLink} to="/benutzer">
          Benutzer
        </NavLink>
        <NavLink className={sidebarLink} to={"/foto-meldungen"}>
          Fotomeldungen
        </NavLink>
        <NavLink className={sidebarLink} to={"/artikel-meldungen"}>
          Artikelmeldungen
        </NavLink>
      </div>
    </div>
  );
}
