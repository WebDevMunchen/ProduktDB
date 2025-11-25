import { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import { toast } from "react-toastify";
import keinBildVorhanden from "../../assets/keinBildVorhanden.jpg";

export default function ProductCard({ product }) {
  const [showPreview, setShowPreview] = useState(false);
  const [hover, setHover] = useState(false);

  const deleteRef = useRef(null);

  const handleDelete = () => {
    axiosClient
      .delete(`/products/deleteProduct/${product._id}`)
      .then(() => {
        toast.success("Artikel gelöscht!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <tr className="border-b relative">
        <td className="px-2 py-2 flex items-center gap-4">
          <img
                          src={`${product.image}?v=${Date.now()}`}

            alt={product.title}
            className="w-24 h-24 rounded-md cursor-pointer"
            onClick={() => setShowPreview(true)}
            onError={(e) => {
              e.target.src = keinBildVorhanden;
            }}
          />

          <div>
            <p className="text-gray-800 font-medium text-lg">{product.title}</p>
            <span className="text-emerald-600 font-semibold tracking-wider">
              {product.productNumber}
            </span>
          </div>
        </td>

        {product.notes ? (
          <td className="px-6 py-4 text-center">Ja</td>
        ) : (
          <td className="px-6 py-4 text-center">Nein</td>
        )}

        {product.relatedProduct.length > 0 ? (
          <td className="px-6 py-4 text-center relative">
            <button
              onMouseEnter={() => setHover(true)}
              className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 
               hover:bg-blue-200 hover:text-blue-700 rounded-full transition duration-150 ease-in-out cursor-help"
            >
              {product.relatedProduct.length}
            </button>

            {hover && (
              <div
                onMouseLeave={() => setHover(false)}
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-96 
             bg-white border border-gray-200 rounded-xl shadow-lg overflow-x-auto p-3"
              >
                <div
                  className={
                    product.relatedProduct.length <= 2
                      ? `flex justify-center flex-nowrap space-x-3`
                      : "flex flex-nowrap space-x-3"
                  }
                >
                  {product.relatedProduct.map((rp) => (
                    <div
                      key={rp._id}
                      className="flex flex-col items-center text-center flex-shrink-0"
                    >
                      <img
                                      src={`${rp.image}?v=${Date.now()}`}

                        alt={rp.title}
                        className="w-32 h-32 object-cover rounded-md border border-gray-100"
                      />
                      <p className="text-xs mt-1 text-gray-600 line-clamp-2 w-32">
                        {rp.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </td>
        ) : (
          <td className="px-6 py-4 text-center font-semibold">-</td>
        )}

        {product.image.includes("cloudinary") ? (
          <td className="px-6 py-4 font-semibold text-gray-900 text-center">
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={32}
                height={32}
                viewBox="0 0 24 24"
                className="text-blue-600"
              >
                <path
                  fill="currentColor"
                  d="M24 14.86c0 2.173-1.376 3.974-3.59 4.7l-.1.031V17.99c1.378-.58 2.187-1.727 2.187-3.13a3.684 3.684 0 0 0-3.608-3.669h-.596l-.144-.569a6.5 6.5 0 0 0-6.272-4.97a6.39 6.39 0 0 0-5.81 3.664l-.184.376l-.417.044a4.43 4.43 0 0 0-3.305 2.088a4.43 4.43 0 0 0 1.458 6.095v1.69h-.01l-.149-.068a5.94 5.94 0 0 1-3.366-4.35a5.94 5.94 0 0 1 4.8-6.894a7.88 7.88 0 0 1 6.983-4.15a8.03 8.03 0 0 1 7.59 5.589A5.21 5.21 0 0 1 24 14.86M8.682 13.538h.565a.066.066 0 0 0 .046-.111l-2.209-2.211a.066.066 0 0 0-.093 0l-2.211 2.21a.066.066 0 0 0 .048.112h.556a.066.066 0 0 1 .066.065v5.058c0 .659.534 1.193 1.193 1.193h2.604a.066.066 0 0 0 .046-.112l-.33-.33a1.2 1.2 0 0 1-.348-.839v-4.97a.07.07 0 0 1 .067-.065m9.77 2.546h.566a.066.066 0 0 0 .046-.113l-2.21-2.209l-.002-.001a.064.064 0 0 0-.09.001l-2.211 2.209a.066.066 0 0 0 .046.113h.556a.066.066 0 0 1 .066.066v2.51c0 .66.534 1.193 1.193 1.193h2.606a.066.066 0 0 0 .046-.11l-.33-.33a1.2 1.2 0 0 1-.348-.84V16.15a.066.066 0 0 1 .066-.066m-4.885-1.274h.565a.066.066 0 0 0 .047-.111l-2.21-2.203h-.001a.066.066 0 0 0-.093 0l-2.208 2.207a.066.066 0 0 0 .045.111h.563a.07.07 0 0 1 .066.068v3.779c0 .659.534 1.193 1.192 1.193h2.599a.066.066 0 0 0 .047-.112l-.332-.33a1.2 1.2 0 0 1-.346-.839v-3.695c0-.037.03-.067.066-.068"
                ></path>
              </svg>
            </div>
          </td>
        ) : (
          <td className="font-semibold text-gray-900">
            <div className="flex justify-center mr-4">
              <img
                className="max-w-none h-16"
                src="https://res.cloudinary.com/dtrymbvrp/image/upload/v1720595800/logo_profile_b5hxd7.png"
                alt="logo"
              />
            </div>
          </td>
        )}

        <td className="text-center">
          <NavLink
            to={`/admin/artikel/bearbeiten/${product._id}`}
            className="text-indigo-600 hover:text-indigo-900 mr-3"
            state={{ product }}
          >
            Bearbeiten
          </NavLink>
          <button
            onClick={() => deleteRef.current.showModal()}
            className="text-red-600 hover:text-red-900"
          >
            Löschen
          </button>

          <dialog ref={deleteRef} className="modal">
            <div className="modal-action min-w-[450px] ">
              <form className="modal-box flex flex-col gap-4">
                <h3 className="font-bold text-lg">
                  Artikel wird gelöscht: {product.title + " " + product._id}
                </h3>

                <div className="modal-action">
                  <button
                    className="btn tracking-wider bg-green-600 text-white hover:bg-green-700"
                    onClick={() => {
                      handleDelete();
                      deleteRef.current.close();
                    }}
                  >
                    Übermitteln
                  </button>
                  <button
                    onClick={() => deleteRef.current.close()}
                    type="button"
                    className="btn w-28 bg-red-600 text-white hover:bg-red-800 tracking-wider"
                  >
                    Abbrechen
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        </td>
      </tr>

      {showPreview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-4 rounded-xl shadow-2xl">
            <div className="flex justify-end">
              <button onClick={() => setShowPreview(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={32}
                  height={32}
                  viewBox="0 0 32 32"
                  className="text-red-500 hover:text-red-700"
                >
                  <path
                    fill="currentColor"
                    d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m5.4 21L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="flex justify-center">
              <p className="mt-2 font-semibold italic">{product.title}</p>
            </div>
<div className="flex justify-center">
            <img
                            src={`${product.image}?v=${Date.now()}`}

              alt={product.title}
              className="w-[600px] h-[600px] object-contain rounded-lg"
                          onError={(e) => {
              e.target.src = keinBildVorhanden;
            }}
            />
</div>

            {product.notes && (
              <div className="flex justify-center">
                <p className="max-w-[70%] text-center mt-2 mb-5 text-red-500 italic">
                  {product.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
