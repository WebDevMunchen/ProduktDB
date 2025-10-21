import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "./utils/axiosClient";
import { toast } from "react-toastify";

export default function MissingProduct() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    axiosClient
      .post("/missingProduct/reportmissingProduct", data)
      .then(() => {
        toast.success("Artikel gemeldet!");
      })
      .catch((error) => {
        toast.error("Meldung fehlgeschlagen!");
      });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Fehlendes Artikel melden
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="font-medium mb-1">Dein Name</label>
          <input
            type="text"
            {...register("reportedBy", { required: "Name ist erforderlich" })}
            className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.reportedBy ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Gib deinen Namen ein"
          />
          {errors.reportedBy && (
            <span className="text-red-500 text-sm mt-1">
              {errors.reportedBy.message}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1">Artikelnummer</label>
          <input
            type="text"
            {...register("productNumber", {
              required: "Artikelnummer ist erforderlich",
            })}
            className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.articleNumber ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Gib die Artikelnummer ein"
          />
          {errors.articleNumber && (
            <span className="text-red-500 text-sm mt-1">
              {errors.articleNumber.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-2 py-2 rounded-md text-white font-semibold transition ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-400"
          }`}
        >
          {isSubmitting ? "Senden..." : "Fehlendes Artikel melden"}
        </button>
      </form>
    </div>
  );
}
