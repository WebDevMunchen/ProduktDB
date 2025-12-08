import { useContext, useState } from "react";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthProvider";
import formatDate from "../utils/formatDate";
import axiosClient from "../utils/axiosClient";
import { toast } from "react-toastify";

export default function PhotoReports() {
  const { allProducts, setAllProducts } = useContext(AuthContext);

  const [openId, setOpenId] = useState(null);

  const handleStatusUpdate = (productId, newStatus) => {
    axiosClient
      .put(`/products/updateStatus/${productId}`, {
        currentStatus: newStatus,
      })
      .then(() => {
        return axiosClient.get("/products/getAllProducts");
      })
      .then((response) => {
        setAllProducts(response.data);
        toast.success("Status geändert!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const statusColors = {
    neu: "text-blue-700",
    erledigt: "text-green-700",
    irrelevant: "text-purple-700",
    "in Arbeit": "text-orange-700",
  };

  const statusOrder = {
    neu: 1,
    "in Arbeit": 2,
    irrelevant: 3,
    erledigt: 4,
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full min-h-[calc(100vh-65px)] max-h-[calc(100vh-65px)] overflow-y-scroll p-4 bg-gray-200">
        {!allProducts ? (
          <div className="py-3 px-4 mt-5 flex flex-row gap-2 justify-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-.5s]"></div>
          </div>
        ) : allProducts.filter((product) => product.imageReported).length ===
          0 ? (
          <div className="flex justify-center mt-12 font-semibold text-xl">
            <div className="flex flex-col items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={48}
                height={48}
                viewBox="0 0 1024 1024"
              >
                <path
                  fill="currentColor"
                  d="m576 736l-32-.001v-286c0-.336-.096-.656-.096-1.008s.096-.655.096-.991c0-17.664-14.336-32-32-32h-64c-17.664 0-32 14.336-32 32s14.336 32 32 32h32v256h-32c-17.664 0-32 14.336-32 32s14.336 32 32 32h128c17.664 0 32-14.336 32-32s-14.336-32-32-32m-64-384.001c35.344 0 64-28.656 64-64s-28.656-64-64-64s-64 28.656-64 64s28.656 64 64 64m0-352c-282.768 0-512 229.232-512 512c0 282.784 229.232 512 512 512c282.784 0 512-229.216 512-512c0-282.768-229.216-512-512-512m0 961.008c-247.024 0-448-201.984-448-449.01c0-247.024 200.976-448 448-448s448 200.977 448 448s-200.976 449.01-448 449.01"
                ></path>
              </svg>
              <p>Derzeit liegen keine Meldungen über fehlende Bilder vor</p>
            </div>
          </div>
        ) : (
          allProducts
            .filter((product) => product.imageReported)
            .sort((a, b) => {
              const statusA =
                a.currentStatus?.trim().toLowerCase() || "erledigt";
              const statusB =
                b.currentStatus?.trim().toLowerCase() || "erledigt";

              return (statusOrder[statusA] || 5) - (statusOrder[statusB] || 5);
            })
            .map((product) => (
              <div
                key={product._id}
                className={`collapse bg-slate-100 border border-slate-300 rounded-md mb-2 ${
                  openId === product._id ? "collapse-open" : ""
                }`}
                onClick={() =>
                  setOpenId(openId === product._id ? null : product._id)
                }
              >
                <div className="flex justify-between collapse-title text-gray-700 font-semibold hover:bg-[rgb(252,217,185)] transition-colors px-4 py-2">
                   <p className="font-semibold text-lg">Artikelnummer: <span className="font-bold">{product.productNumber}</span></p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    className={`fill-current ${
                      statusColors[product.currentStatus]
                    }`}
                  >
                    <path d="M12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709"></path>
                  </svg>
                </div>

                <div className="collapse-content text-slate-600 px-4 flex flex-col gap-2">
                  <div className="bg-white rounded-md p-2 mt-4 border border-slate-300 w-full">
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <p className="font-semibold text-gray-700">
                          <span className="font-bold text-lg">Am:</span> {formatDate(product.reportedAt)}
                        </p>
                        <p className="font-semibold text-gray-700">
                          <span className="font-bold text-lg">Verfasser:</span>{" "}
                          {product.reportedBy +
                            " " +
                            `(${product.reportersId})`}
                        </p>
                        <p className="font-semibold text-gray-700">
                          <span className="font-bold text-lg">Standort:</span> {product.reportersLocation}
                        </p>
                        <p className="font-semibold text-gray-700">
                          <span className="font-bold text-lg">Abteilung:</span>{" "}
                          {product.reportersDepartment}
                        </p>
                      </div>

                      <div className="flex flex-col mt-2 pr-8">
                        <select
                          className={`border-[1px] rounded-md w-[150px] px-2 py-1 appearance-none text-center font-semibold tracking-wide hover:cursor-pointer ${
                            product.currentStatus === "neu"
                              ? "text-blue-700 border-blue-300 bg-blue-50"
                              : product.currentStatus === "erledigt"
                              ? "text-green-700 border-green-300 bg-green-50"
                              : product.currentStatus === "in Arbeit"
                              ? "text-orange-700 border-orange-300 bg-orange-50"
                              : "text-purple-700 border-purple-300 bg-purple-50"
                          }`}
                          onClick={(e) => e.stopPropagation()}
                          value={product.currentStatus}
                          onChange={(e) =>
                            handleStatusUpdate(product._id, e.target.value)
                          }
                        >
                          <option value={"neu"}>Neu</option>
                          <option value={"erledigt"}>Erledigt</option>
                          <option value={"irrelevant"}>Irrelevant</option>
                          <option value={"in Arbeit"}>In Arbeit</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
