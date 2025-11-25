import { toast } from "react-toastify";
import axiosClient from "../utils/axiosClient";
import Sidebar from "./Sidebar";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

export default function ProductUpdate() {
  const { allProducts } = useContext(AuthContext);

  const location = useLocation();
  const { product } = location.state || {};

  const navigate = useNavigate();

  const [urlPreview, setUrlPreview] = useState(
    `https://res.cloudinary.com/dtrymbvrp/image/upload/${product?.productNumber}.jpg`
  );

  const [visible, setVisible] = useState(product?.relatedProduct?.length > 0);
  const [suggestions, setSuggestions] = useState([]);
  const [relatedProductsArray, setRelatedProductsArray] = useState([]);
  const [relatedProductPreview, setRelatedProductPreview] = useState(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {}, [urlPreview]);

  useEffect(() => {
    if (product?.relatedProduct?.length) {
      const ids = product.relatedProduct.map((p) => p._id);
      setRelatedProductsArray(ids);
    }

    if (product?.relatedProduct?.length !== 0) {
      setVisible(true);
    }
  }, [product]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      image: `https://res.cloudinary.com/dtrymbvrp/image/upload/${product?.productNumber}.jpg`,
      relatedProduct: relatedProductsArray,
      internProduct: product.internProduct,
    },
  });

  const handleDefaultUrl = (e) => {
    const productNumber = e.target.value.trim();

    const defaultUrl = productNumber
      ? `https://res.cloudinary.com/dtrymbvrp/image/upload/${productNumber}.jpg`
      : "https://res.cloudinary.com/dtrymbvrp/image/upload/";

    setUrlPreview(defaultUrl);

    setValue("image", defaultUrl, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === "") {
      setSuggestions([]);
      return;
    }

    const filtered = allProducts?.filter((p) =>
      p.productNumber.toString().startsWith(value)
    );

    setSuggestions(filtered || []);
  };

  const handleProductHover = async (id) => {
    try {
      const response = await axiosClient.get(
        `/products/getProductPreview/${id}`
      );
      setRelatedProductPreview(response.data);
    } catch (error) {
      console.error("Error fetching preview:", error);
    }
  };

  const onSubmit = (data) => {
    data.relatedProduct = relatedProductsArray;

    axiosClient
      .put(`/products/updateProduct/${product._id}`, data)
      .then((response) => {
        toast.success("Artikel angepasst!");
        navigate("/admin/artikel");
      })
      .catch((error) => {
        toast.error("Something went wrong!");
        console.log(error);
      })
      .finally(() => {
        console.log(relatedProductsArray);
      });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full min-h-[calc(100vh-65px)] max-h-[calc(100vh-65px)] overflow-y-scroll p-4 bg-gray-200">
        <div className="flex justify-center p-4">
          <div className="mx-auto w-full max-w-[650px] bg-white p-6 rounded-md shadow-md">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3">
                  <div className="mb-5">
                    <label
                      htmlFor="title"
                      className="mb-3 block text-base font-medium text-[#07074D]"
                    >
                      Artikelbezeichnung
                    </label>
                    <input
                      {...register("title", { required: true })}
                      defaultValue={product.title}
                      type="text"
                      id="title"
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      placeholder="Artikelbezeichnung eingeben..."
                    />
                  </div>
                </div>
              </div>

              <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3 sm:w-1/2">
                  <div className="mb-5">
                    <label
                      htmlFor="productNumber"
                      className="mb-3 block text-base font-medium text-[#07074D]"
                    >
                      Artikelnummer
                    </label>
                    <input
                      {...register("productNumber", { required: true })}
                      onChange={handleDefaultUrl}
                      defaultValue={product.productNumber}
                      type="text"
                      id="productNumber"
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      placeholder="Sollte nur Zahlen enthalten"
                    />
                  </div>
                </div>
                <div className="w-1/2 px-3">
                  <div className="mb-5">
                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="internProduct"
                        className="block text-base font-medium text-[#07074D]"
                      >
                        Interner Artikel?
                      </label>

                      <input
                        type="checkbox"
                        id="internProduct"
                        {...register("internProduct")}
                        className="checkbox checkbox-neutral w-8 h-8 mt-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3">
                  <div className="mb-5">
                    <div className="flex flex-col">
                      <label
                        htmlFor="image"
                        className="block text-base font-medium text-[#07074D]"
                      >
                        Vorschau des Bildlinks
                      </label>
                      <p className="mb-3 text-sm font-medium">
                        {"(Wird automatisch generiert)"}
                      </p>
                    </div>

                    <input
                      {...register("image", { required: true })}
                      type="text"
                      id="image"
                      readOnly
                      value={urlPreview}
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      placeholder={urlPreview}
                    />
                  </div>
                </div>
              </div>

              <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3">
                  <div className="mb-5">
                    <div className="flex gap-3">
                      <label
                        htmlFor="image"
                        className="block text-base font-medium text-[#07074D]"
                      >
                        Aktivieren, wenn dieser Artikel verwandte Artikel hat:
                      </label>
                      <input
                        type="checkbox"
                        checked={visible}
                        onChange={() => setVisible(!visible)}
                        className="checkbox checkbox-neutral"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3">
                  <div className="mb-5">
                    <div className="flex flex-col">
                      <label
                        htmlFor="notes"
                        className="block text-base font-medium text-[#07074D]"
                      >
                        Notizen
                      </label>
                      <p className="mb-3 text-sm font-medium">
                        {"(Kein Pflichtfeld)"}
                      </p>
                    </div>

                    <textarea
                      {...register("notes")}
                      defaultValue={product.notes}
                      rows={3}
                      id="notes"
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      placeholder="Dieses Feld leer kann leer gelassen werden, wenn der Artikel keine zusätzlichen Informationen benötigt"
                    />
                  </div>
                </div>
              </div>

              {visible && (
                <div className="-mx-3 flex flex-wrap">
                  <div className="w-full px-3 mb-5">
                    <div>
                      <label
                        htmlFor="relatedProduct"
                        className="mb-3 block text-base font-medium text-[#07074D]"
                      >
                        Verwandte Produkte
                      </label>
                      <input
                        {...register("relatedProduct")}
                        value={inputValue}
                        onChange={handleChange}
                        type="text"
                        id="relatedProduct"
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        placeholder="Artikelnummer eingeben..."
                      />
                    </div>
                    {suggestions.length > 0 && (
                      <ul className="text-center border border-gray-200 rounded-b-xl shadow-md bg-white max-h-48 overflow-y-auto z-50">
                        {suggestions.map((product) => (
                          <li
                            key={product._id}
                            className="py-2 hover:bg-blue-50 cursor-pointer transition"
                            onClick={() => {
                              setRelatedProductsArray([
                                ...relatedProductsArray,
                                product._id,
                              ]);
                              setSuggestions([]);
                              setInputValue("");
                            }}
                          >
                            {product.productNumber}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {relatedProductsArray.map((id) => {
                      const product = allProducts.find((p) => p._id === id);
                      return (
                        <span
                          key={id}
                          className="relative bg-gray-200 px-4 py-1 rounded-full text-lg font-semibold tracking-wider flex items-center gap-1 group"
                          onMouseEnter={() => handleProductHover(id)}
                          onMouseLeave={() => setRelatedProductPreview(null)}
                        >
                          {product?.productNumber}
                          <button
                            type="button"
                            onClick={() =>
                              setRelatedProductsArray((prev) =>
                                prev.filter((pid) => pid !== id)
                              )
                            }
                            className="text-red-500"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={20}
                              height={20}
                              viewBox="0 0 32 32"
                              className="text-red-500 hover:text-red-700"
                            >
                              <path
                                fill="currentColor"
                                d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m5.4 21L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z"
                              ></path>
                            </svg>
                          </button>

                          {relatedProductPreview?._id === id && (
                            <div className="absolute bottom-full mt-2 left-1/2 -translate-x-1/2 bg-white border rounded-lg shadow-lg p-2 w-48 z-50">
                              <p className="text-sm text-center mb-2 font-medium mt-1">
                                {relatedProductPreview.title}
                              </p>
                              <img
                                src={`${
                                  relatedProductPreview.image
                                }?v=${Date.now()}`}
                                alt={relatedProductPreview.title}
                                className="w-full h-32 object-cover rounded"
                              />
                            </div>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="flex justify-center gap-3 mt-5">
                <button
                  type="submit"
                  className="hover:bg-gray-800 hover:shadow-form w-fit rounded-md bg-gray-600 py-2 px-8 text-center text-base font-semibold text-white outline-none transition-colors duration-300 ease-in-out"
                >
                  Bestätigen
                </button>

                <NavLink
                  to={"/admin/artikel"}
                  className="hover:bg-red-800 hover:shadow-form w-fit rounded-md bg-red-600 py-2 px-8 text-center text-base font-semibold text-white outline-none transition-colors duration-300 ease-in-out"
                >
                  Abbrechen
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
