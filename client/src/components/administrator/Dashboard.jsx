import ProductSearch from "../ProductSearch";
import Sidebar from "./Sidebar";

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full min-h-[calc(100vh-65px)] max-h-[calc(100vh-65px)] overflow-y-scroll">
        <ProductSearch />
      </div>
    </div>
  );
}
