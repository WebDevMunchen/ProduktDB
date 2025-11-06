import { toast } from "react-toastify";
import axiosClient from "../utils/axiosClient";
import Sidebar from "./Sidebar";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function Register() {

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    axiosClient
      .post("/user/register", data)
      .then((response) => {
        console.log(data);
        navigate("/benutzer");
      })
      .catch((error) => {
        toast.error("Something went wrong!");
        console.log(error)
      });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full min-h-[calc(100vh-65px)] max-h-[calc(100vh-65px)] overflow-y-scroll p-4 bg-gray-200">
        <div className="flex items-center justify-center p-12">
          <div className="mx-auto w-full max-w-[650px] bg-white p-6 rounded-md shadow-md">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3 sm:w-1/2">
                  <div className="mb-5">
                    <label
                      htmlFor="firstName"
                      className="mb-3 block text-base font-medium text-[#07074D]"
                    >
                      Vorname
                    </label>
                    <input
                      {...register("firstName", { required: true })}
                      type="text"
                      id="firstName"
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      placeholder="Max"
                    />
                  </div>
                </div>
                <div className="w-full px-3 sm:w-1/2">
                  <div className="mb-5">
                    <label
                      htmlFor="lastName"
                      className="mb-3 block text-base font-medium text-[#07074D]"
                    >
                      Nachname
                    </label>
                    <input
                      {...register("lastName", { required: true })}
                      type="text"
                      id="lastName"
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      placeholder="Mustermann"
                    />
                  </div>
                </div>
              </div>
              <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3 sm:w-1/2">
                  <div className="mb-5">
                    <label
                      htmlFor="email"
                      className="mb-3 block text-base font-medium text-[#07074D]"
                    >
                      E-Mail
                    </label>
                    <input
                      {...register("email", { required: true })}
                      type="email"
                      id="email"
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      placeholder="max.mustermann@rent.group"
                    />
                  </div>
                </div>
                <div className="w-full px-3 sm:w-1/2">
                  <div className="mb-5">
                    <label
                      htmlFor="userId"
                      className="mb-3 block text-base font-medium text-[#07074D]"
                    >
                      Benutzer-ID
                    </label>
                    <input
                      {...register("userId", { required: true })}
                      type="text"
                      id="userId"
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                  </div>
                </div>
              </div>
              <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3 sm:w-1/3">
                  <div className="mb-5">
                    <label
                      htmlFor="location"
                      className="mb-3 block text-base font-medium text-[#07074D]"
                    >
                      Standort
                    </label>
                    <select
                      {...register("location", { required: true })}
                      id="location"
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md hover:cursor-pointer"
                    >
                      <option value="München">München</option>
                      <option value="Bocholt">Bocholt</option>
                      <option value="Berlin">Berlin</option>
                    </select>
                  </div>
                </div>
                <div className="w-full px-3 sm:w-1/3">
                  <div className="mb-5">
                    <label
                      htmlFor="department"
                      className="mb-3 block text-base font-medium text-[#07074D]"
                    >
                      Abteilung
                    </label>
                    <select
                      {...register("department", { required: true })}
                      id="department"
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md hover:cursor-pointer"
                    >
                      <option value="IT & Services">IT & Services</option>
                      <option value="Logistik">Logistik</option>
                      <option value="Vertrieb">Vertrieb</option>
                    </select>
                  </div>
                </div>
                <div className="w-full px-3 sm:w-1/3">
                  <div className="mb-5">
                    <label
                      htmlFor="role"
                      className="mb-3 block text-base font-medium text-[#07074D]"
                    >
                      Rolle
                    </label>
                    <select
                      {...register("role", { required: true })}
                      id="role"
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md hover:cursor-pointer"
                    >
                      <option value="mucAdmin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-5 pt-3">
                <label className="mb-5 block text-base font-semibold text-[#07074D] sm:text-xl">
                  Address Details
                </label>
                <div className="-mx-3 flex flex-wrap">
                  <div className="w-full px-3 sm:w-1/2">
                    <div className="mb-5">
                      <input
                        {...register("password", { required: true })}
                        type="password"
                        id="password"
                        placeholder="*******"
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      />
                    </div>
                  </div>
                  <div className="w-full px-3 sm:w-1/2">
                    <div className="mb-5">
                      <input
                        type="text"
                        id="city"
                        placeholder="Enter city"
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      />
                    </div>
                  </div>
                  <div className="w-full px-3 sm:w-1/2">
                    <div className="mb-5">
                      <input
                        type="text"
                        id="state"
                        placeholder="Enter state"
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      />
                    </div>
                  </div>
                  <div className="w-full px-3 sm:w-1/2">
                    <div className="mb-5">
                      <input
                        type="text"
                        id="post-code"
                        placeholder="Post Code"
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="submit"
                  className="hover:bg-gray-800 hover:shadow-form w-fit rounded-md bg-gray-600 py-2 px-8 text-center text-base font-semibold text-white outline-none transition-colors duration-300 ease-in-out"
                >
                  Bestätigen
                </button>

                <button className="hover:bg-red-800 hover:shadow-form w-fit rounded-md bg-red-600 py-2 px-8 text-center text-base font-semibold text-white outline-none transition-colors duration-300 ease-in-out">
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
