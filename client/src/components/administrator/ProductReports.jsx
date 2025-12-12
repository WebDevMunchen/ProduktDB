import { useContext } from "react";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthProvider";
import formatDate from "../utils/formatDate";
import { useState } from "react";
import axiosClient from "../utils/axiosClient";
import { toast } from "react-toastify";

export default function ProductReports() {
  const { allMissingProductReports, setAllMissingProductReports } =
    useContext(AuthContext);

  console.log(allMissingProductReports);

  const [openId, setOpenId] = useState(null);

  const handleStatusUpdate = (reportId, newStatus) => {
    axiosClient
      .put(`/productReports/updateStatus/${reportId}`, {
        currentStatus: newStatus,
      })
      .then(() => {
        return axiosClient.get("/productReports/getAllProductReports");
      })
      .then((response) => {
        setAllMissingProductReports(response.data);
        toast.success("Status geändert!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const groupedReports = allMissingProductReports
    ? allMissingProductReports.reduce((acc, report) => {
        const { productNumber } = report;
        if (!acc[productNumber]) acc[productNumber] = [];
        acc[productNumber].push(report);
        return acc;
      }, {})
    : {};

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full min-h-[calc(100vh-65px)] max-h-[calc(100vh-65px)] overflow-y-scroll p-4 bg-gray-200">
        {!allMissingProductReports ? (
          <div className="py-3 px-4 mt-5 flex flex-row gap-2 justify-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-.5s]"></div>
          </div>
        ) : allMissingProductReports.length === 0 ? (
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
              <p>Derzeit liegen keine Meldungen über die Artikel vor</p>
            </div>
          </div>
        ) : (
          Object.entries(groupedReports).map(([productNumber, reports]) => (
            <div
              key={productNumber}
              className={`collapse bg-slate-100 border border-slate-300 rounded-md mb-2 ${
                openId === productNumber ? "collapse-open" : ""
              }`}
              onClick={() =>
                setOpenId(openId === productNumber ? null : productNumber)
              }
            >
              <div className="flex justify-between collapse-title text-gray-700 font-semibold hover:bg-[rgb(252,217,185)] transition-colors px-4 py-2">
                <p className="font-semibold text-lg">
                  Artikelnummer:{" "}
                  <span className="font-bold">{productNumber}</span>
                </p>
                <p>
                  {reports.length}{" "}
                  {reports.length > 1 ? "Meldungen" : "Meldung"}, davon{" "}
                  {
                    reports.filter(
                      (r) =>
                        r.currentStatus === "neu" ||
                        r.currentStatus === "in Arbeit"
                    ).length
                  }{" "}
                  noch offen
                </p>
              </div>

              <div className="collapse-content text-slate-600 px-4 flex flex-col gap-2">
                {reports.map((report) => (
                  <div
                    key={report._id}
                    className="bg-white rounded-md p-2 mt-4 border border-slate-300 w-full"
                  >
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <p className="font-semibold text-gray-700">
                          <span className="font-bold text-lg">Datum:</span>{" "}
                          {formatDate(report.reportedAt)}
                        </p>
                        <p>
                          <p className="font-semibold text-gray-700">
                            <span className="font-bold text-lg">
                              Verfasser:
                            </span>{" "}
                            {report.reportedBy +
                              " " +
                              `(${report.reportersId})`}
                          </p>
                        </p>
                        <p>
                          <p className="font-semibold text-gray-700">
                            <span className="font-bold text-lg">Standort:</span>{" "}
                            {report.reportersLocation}
                          </p>
                        </p>
                        <p className="font-semibold text-gray-700">
                          <span className="font-bold text-lg">Abteilung:</span>{" "}
                          {report.reportersDepartment}
                        </p>
                      </div>

                      <div className="flex flex-col items-center justify-center pr-8 pt-2 gap-6">
                        <div className="flex flex-col">
                          <p className="text-center">
                            <span className="font-bold text-lg">Art:</span>
                          </p>
                          <p className="font-semibold text-gray-700">
                            {report.reportType}
                          </p>
                        </div>

                        <select
                          className={`mb-2 border-[1px] rounded-md w-[150px] px-2 py-1 appearance-none text-center font-semibold tracking-wide hover:cursor-pointer ${
                            report.currentStatus === "neu"
                              ? "text-blue-700 border-blue-300 bg-blue-50"
                              : report.currentStatus === "erledigt"
                              ? "text-green-700 border-green-300 bg-green-50"
                              : report.currentStatus === "in Arbeit"
                              ? "text-orange-700 border-orange-300 bg-orange-50"
                              : "text-purple-700 border-purple-300 bg-purple-50"
                          }`}
                          onClick={(e) => e.stopPropagation()}
                          value={report.currentStatus}
                          onChange={(e) =>
                            handleStatusUpdate(report._id, e.target.value)
                          }
                        >
                          <option value={"neu"}>Neu</option>
                          <option value={"erledigt"}>Erledigt</option>
                          <option value={"irrelevant"}>Irrelevant</option>
                          <option value={"in Arbeit"}>In Arbeit</option>
                        </select>
                      </div>
                    </div>
                    {report.message && (
                      <div className="mt-4 mb-2">
                        <hr />

                        <p className="font-semibold text-gray-700 mt-4">
                          <span className="font-bold text-lg">Nachricht:</span>{" "}
                          {report.message}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
