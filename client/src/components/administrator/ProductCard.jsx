import { useState } from "react";

export default function ProductCard({ product }) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <tr className="border-b">
        <td className="px-2 py-2 flex items-center gap-4">
          <img
            src={product.image}
            alt={product.title}
            className="w-24 h-24 rounded-md cursor-pointer"
            onClick={() => setShowPreview(true)}
          />

          <div>
            <p className="text-gray-800 font-medium">{product.title}</p>
            <span className="text-green-500 text-sm">
              {product.productNumber}
            </span>
          </div>
        </td>
        <td className="px-6 py-4">$550</td>
        <td className="px-6 py-4">x3</td>
        <td className="px-6 py-4 font-semibold text-gray-900">$1,500</td>
      </tr>

      {showPreview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-4 rounded-xl shadow-2xl">
            <div className="w-full flex justify-end">
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
            <img
              src={product.image}
              alt={product.title}
              className="w-[600px] h-[600px] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
