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

  const [openId, setOpenId] = useState(null);

  const handleStatusUpdate = (reportId, newStatus) => {
    axiosClient
      .put(`/missingProduct/updateStatus/${reportId}`, {
        currentStatus: newStatus,
      })
      .then(() => {
        return axiosClient.get("/missingProduct/getAllMissingProductReports");
      })
      .then((response) => {
        setAllMissingProductReports(response.data);
        toast.success("Status geändert!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log(allMissingProductReports);

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
          <>Loading...</>
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
                <p>Artikelnummer: {productNumber}</p>
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
                        <p>
                          <strong>Verfasser:</strong> {report.reportedBy}
                        </p>
                        <p>
                          <strong>Datum:</strong>{" "}
                          {formatDate(report.reportedAt)}
                        </p>
                      </div>

                      <div className="flex flex-col items-center justify-center pr-8">
                        <select
                          className={`border-[1px] rounded-md w-[150px] px-2 py-1 appearance-none text-center font-semibold tracking-wide hover:cursor-pointer ${
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
