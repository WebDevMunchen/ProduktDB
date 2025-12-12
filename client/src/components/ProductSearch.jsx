import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthProvider";
import logo from "../assets/rent_group_logo.jpg";
import axiosClient from "./utils/axiosClient";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
export default function ProductSearch() {
  const { setProductId, product, allProducts, productId } =
    useContext(AuthContext);

  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [product]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === "") {
      setSuggestions([]);
      return;
    }

    const filtered = allProducts
      ?.filter((p) => p.productNumber?.toString().startsWith(value))
      .map((p) => p.productNumber);

    setSuggestions(filtered || []);
  };

  const handleSelect = (number) => {
    setProductId(number);
    setInputValue(number);
    setSuggestions([]);
  };

  const handleReport = () => {
    setIsLoading(true);
    axiosClient
      .post(`products/reportMissingPhoto/${productId}`)
      .then(() => {
        toast.success("Übermittelt!");
      })
      .catch((error) => {
        toast.error("Fehlgeschlagen!");
      })
      .finally(() => {
        setIsLoading(false);
        setProductId("");
      });
  };

  const handleFocus = () => {
    setInputValue("");
    setProductId(0);
    setSuggestions([]);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    await axiosClient
      .post(`/productReports/reportIssue/${productId}`, {
        ...data,
        productNumber: productId,
      })
      .then(() => {
        toast.success("Übermittelt!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Fehlgeschlagen!");
      });
  };

  return (
    <div className="px-4 mx-auto my-10 font-sans md:min-w-[750px] md:max-w-[750px]">
      <div className="w-full">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder="Gib die Artikelnummer ein"
          className="w-full text-center py-2 text-lg border border-gray-300 rounded-t-xl shadow-sm focus:ring-1 outline-none md:min-w-[750px] md:max-w-[750px] "
        />

        {suggestions.length > 0 && (
          <ul className="mt-1 text-center border border-gray-200 rounded-b-xl shadow-md bg-white divide-y max-h-48 overflow-y-auto z-50 md:min-w-[750px] md:max-w-[750px]">
            {suggestions.map((num) => (
              <li
                key={num}
                className="py-2 hover:bg-blue-50 cursor-pointer transition"
                onClick={() => handleSelect(num)}
              >
                {num}
              </li>
            ))}
          </ul>
        )}
      </div>

      {!product ? (
        <div className="min-h-[60vh] w-full flex justify-center items-center border-l border-r border-b border-gray-300 rounded-b-xl md:min-w-[750px] md:max-w-[750px]">
          <img src={logo} alt="rent group logo" className="w-[60%] h-[50%]" />
        </div>
      ) : (
        <div className="p-4 border-l border-r border-b border-gray-300 rounded-b-xl shadow-lg bg-white text-center md:min-w-[750px] md:max-w-[750px]">
          <div className="flex justify-between">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={36}
              height={36}
              viewBox="0 0 24 24"
              className="invisible"
            >
              <path
                fill="#dda528"
                fillRule="evenodd"
                d="m21.268 21.053l-18.536.001a1 1 0 0 1-.866-1.5L11.132 3.5a1 1 0 0 1 1.732 0l9.27 16.053a1 1 0 0 1-.866 1.5M11.248 9.545l.116 5.666h1.272l.117-5.666zm.75 8.572c.48 0 .855-.369.855-.832s-.375-.826-.856-.826a.83.83 0 0 0-.85.826c0 .463.375.832.85.832z"
              ></path>
            </svg>
            <p className="text-3xl font-semibold text-gray-900 tracking-wider p-3">
              {product.productNumber}
            </p>
            <button
              onClick={() => document.getElementById("reportModal").showModal()}
              className="p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={36}
                height={36}
                viewBox="0 0 24 24"
              >
                <path
                  fill="#dda528"
                  fillRule="evenodd"
                  d="m21.268 21.053l-18.536.001a1 1 0 0 1-.866-1.5L11.132 3.5a1 1 0 0 1 1.732 0l9.27 16.053a1 1 0 0 1-.866 1.5M11.248 9.545l.116 5.666h1.272l.117-5.666zm.75 8.572c.48 0 .855-.369.855-.832s-.375-.826-.856-.826a.83.83 0 0 0-.85.826c0 .463.375.832.85.832z"
                ></path>
              </svg>
            </button>

            <dialog id="reportModal" className="modal">
              <div className="w-full flex justify-center modal-action md:min-w-[550px]">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="modal-box flex flex-col gap-4"
                >
                  <h3 className="font-bold text-lg">
                    Problem mit dem Artikel melden
                  </h3>

                  <textarea
                    placeholder="Beschreibe das Problem bzw. den Fehler mit dem Artikel"
                    {...register("message", { required: true })}
                    className="textarea textarea-bordered w-full"
                  />

                  <div className="modal-action">
                    <button
                      type="submit"
                      className="btn tracking-wider bg-green-700 text-white hover:bg-green-600"
                      onClick={() =>
                        document.getElementById("reportModal").close()
                      }
                    >
                      Übermitteln
                    </button>
                    <button
                      onClick={() =>
                        document.getElementById("reportModal").close()
                      }
                      type="button"
                      className="btn tracking-wider hover:bg-red-600 hover:text-white"
                    >
                      Abbrechen
                    </button>
                  </div>
                </form>
              </div>
            </dialog>
          </div>
          <p className="text-xl font-semibold text-gray-800 mt-2 md:px-16">
            {product.title}
          </p>
          {!imageError && product.image ? (
            <img
              src={`${product.image}?v=${Date.now()}`}
              alt={`Product ${product.productNumber}`}
              className="mx-auto w-[70%] object-contain rounded-md"
              onError={() => setImageError(true)}
            />
          ) : product.imageReported ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <p className="text-red-500">
                Das fehlende Bild wurde bereits gemeldet und wird so bald wie
                möglich aktualisiert!
              </p>
            </div>
          ) : (
            <>
              <p className="mt-2 py-12 text-xl">
                Aktuell gibt es kein Bild für diesen Artikel!
              </p>
              <button
                onClick={handleReport}
                disabled={isLoading}
                className={`mt-4 mb-8 px-4 py-2 text-white text-lg rounded-md transition ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {isLoading ? "Bitte warten" : "Fehlendes Bild melden"}
              </button>
            </>
          )}
          {product.notes && (
            <p className="mt-2 text-red-500 italic md:px-16">{product.notes}</p>
          )}

          {product.relatedProduct?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Verwandte Produkte
              </h3>
              <div
                className={`flex gap-4 ${
                  product.relatedProduct.length === 1
                    ? "justify-center overflow-visible"
                    : product.relatedProduct.length === 2 ||
                      product.relatedProduct.length === 3
                    ? "justify-start overflow-x-auto md:justify-center md:overflow-visible"
                    : product.relatedProduct.length === 3
                    ? "justify-start overflow-x-auto md:justify-center md:overflow-visible"
                    : "justify-start overflow-x-auto"
                }`}
              >
                {product.relatedProduct.map((rp) => (
                  <div
                    key={rp._id}
                    className="inline-flex flex-col min-w-[200px] p-2 border rounded-xl shadow-sm hover:shadow-md cursor-pointer"
                    onClick={() => {
                      setProductId(rp.productNumber);
                      setInputValue(rp.productNumber);
                    }}
                  >
                    {rp.internProduct === true ? (
                      <div
                        className="tooltip flex justify-end z-[9999] tooltip-bottom"
                        data-tip="Bitte beachten, dass es sich hierbei um eine interne Artikelnummer & Artikelbezeichnung handelt, die nicht in AGP vorhanden sind!"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={32}
                          height={32}
                          viewBox="0 0 24 24"
                          className="text-red-500"
                        >
                          <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12m8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836l.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836l-.042.02a.75.75 0 1 1-.671-1.34zM12 9a.75.75 0 1 0 0-1.5a.75.75 0 0 0 0 1.5"
                            clipRule="evenodd"
                            strokeWidth={0.6}
                            stroke="currentColor"
                          ></path>
                        </svg>
                      </div>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        className="invisible"
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12m8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836l.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836l-.042.02a.75.75 0 1 1-.671-1.34zM12 9a.75.75 0 1 0 0-1.5a.75.75 0 0 0 0 1.5"
                          clipRule="evenodd"
                          strokeWidth={0.6}
                          stroke="currentColor"
                        ></path>
                      </svg>
                    )}
                    <img
                      src={`${rp.image}?v=${Date.now()}`}
                      alt={`Related Product ${rp.productNumber}`}
                      className="w-full h-32 object-contain rounded-md mb-2"
                    />
                    <p
                      className={`text-md font-medium text-gray-700 mt-2 ${
                        rp.internProduct === true
                          ? "text-red-500"
                          : "text-gray-900"
                      }`}
                    >
                      {rp.internProduct === true
                        ? "IA - " + rp.productNumber
                        : rp.productNumber}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
