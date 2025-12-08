import { toast } from "react-toastify";
import axiosClient from "../utils/axiosClient";
import Sidebar from "./Sidebar";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);
    axiosClient
      .post("/user/register", data)
      .then((response) => {
        navigate("/admin/benutzer");
      })
      .catch((error) => {
        toast.error("Something went wrong!");
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const generateRandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!.,:/()_-{}[]%&#";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters[randomIndex];
    }
    return result;
  };

  const generatePassword = () => {
    const randomString = generateRandomString(12);
    setGeneratedPassword(randomString);
    setValue("password", randomString);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(generatedPassword)
      .then(() => {
        toast.success("Kennwort in die Zwischenablage kopiert!");
      })
      .catch((err) => {});
  };

  const password = watch("password", "");

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
                      placeholder="Sollte nur aus Zahlen bestehen"
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

              <div className="mb-5">
                <div className="-mx-3 flex flex-wrap">
                  <div className="w-full px-3">
                    <div className="flex">
                      <label
                        htmlFor="password"
                        className="mb-3 block text-base font-medium text-[#07074D]"
                      >
                        Kennwort:
                      </label>
                    </div>

                    <div className="mb-5 flex gap-4">
                      <div>
                        <input
                          {...register("password", { required: true })}
                          type={passwordVisible ? "text" : "password"}
                          placeholder="••••••••••••"
                          className="w-full bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 lg:w-80"
                          value={password}
                          onChange={(e) => {
                            setGeneratedPassword(e.target.value);
                            setValue("password", e.target.value);
                          }}
                        />
                      </div>

                      <div className="flex gap-2 w-[20%]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6 cursor-pointer transition-transform duration-300 transform hover:scale-125 hover:text-blue-600"
                          onClick={togglePasswordVisibility}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6 cursor-pointer transition-transform duration-300 transform hover:scale-125 hover:text-blue-600"
                          onClick={copyToClipboard}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6 cursor-pointer transition-transform duration-300 transform hover:scale-125 hover:text-blue-600"
                          onClick={generatePassword}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                {isLoading ? (
                  <button
                    type="submit"
                    disabled={true}
                    className="btn w-fit bg-slate-300 hover:cursor-not-allowed"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={32}
                      height={32}
                      viewBox="0 0 24 24"
                      className="text-blue-500"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      >
                        <path
                          strokeDasharray={16}
                          strokeDashoffset={16}
                          d="M12 3c4.97 0 9 4.03 9 9"
                        >
                          <animate
                            fill="freeze"
                            attributeName="stroke-dashoffset"
                            dur="0.3s"
                            values="16;0"
                          ></animate>
                          <animateTransform
                            attributeName="transform"
                            dur="1.5s"
                            repeatCount="indefinite"
                            type="rotate"
                            values="0 12 12;360 12 12"
                          ></animateTransform>
                        </path>
                        <path
                          strokeDasharray={64}
                          strokeDashoffset={64}
                          strokeOpacity={0.3}
                          d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"
                        >
                          <animate
                            fill="freeze"
                            attributeName="stroke-dashoffset"
                            dur="1.2s"
                            values="64;0"
                          ></animate>
                        </path>
                      </g>
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn w-fit bg-gray-600 tracking-wider text-white hover:bg-gray-800"
                  >
                    Übermitteln
                  </button>
                )}

                <NavLink
                  to={"/admin/benutzer"}
                  className="btn w-28 bg-red-600 tracking-wider text-white hover:bg-red-800"
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
