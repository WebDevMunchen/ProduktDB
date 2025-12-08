import { toast } from "react-toastify";
import axiosClient from "../utils/axiosClient";
import Sidebar from "./Sidebar";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRef } from "react";

export default function UserUpdate() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const passwordRef = useRef(null);

  useEffect(() => {
    axiosClient
      .get(`/user/getUserInfo/${id}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const navigate = useNavigate();
  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      userId: "",
      location: "",
      department: "",
      role: "",
      status: "",
    },
  });

  useEffect(() => {
    axiosClient
      .get(`/user/getUserInfo/${id}`)
      .then((response) => {
        reset(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, reset]);

  const onSubmit = (data) => {
    axiosClient
      .put(`/user/updateUser/${id}`, data)
      .then(() => {
        toast.success("Updated!");
        navigate("/admin/benutzer");
      })
      .catch((error) => {
        toast.error("Something went wrong!");
        console.log(error);
      });
  };

  const onSubmitPassword = (data) => {
    axiosClient
      .put(`/user/updatePassword/${user._id}`, data)
      .then((response) => {
        console.log(`/user/updatePassword/${user._id}`);

        passwordRef.current.close();
        toast.success("Kennwort geändert");
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        console.log(`/user/updatePassword/${user._id}`);
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
      .catch((error) => {});
  };

  const password = watch("password", "");

  return (
    <div className="flex">
      <Sidebar />
      {!user ? (
        <div className="py-3 px-4 mt-5 flex flex-row gap-2 justify-center">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-.5s]"></div>
        </div>
      ) : (
        <div className="w-full min-h-[calc(100vh-65px)] max-h-[calc(100vh-65px)] overflow-y-scroll p-4 bg-gray-200">
          <div className="flex items-center justify-center p-12">
            <div className="mx-auto w-full max-w-[650px] bg-white p-6 rounded-md shadow-md">
              <div className="mb-4 flex justify-between">
                <h3 className="text-xl font-semibold">Benutzer bearbeiten:</h3>

                <div className="flex gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={38}
                    height={38}
                    viewBox="0 0 512 512"
                    className="text-blue-500 transition-transform duration-300 transform hover:scale-125 cursor-pointer "
                    onClick={() => passwordRef.current.showModal()}
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth={18}
                      d="M218.1 167.17c0 13 0 25.6 4.1 37.4c-43.1 50.6-156.9 184.3-167.5 194.5a20.17 20.17 0 0 0-6.7 15c0 8.5 5.2 16.7 9.6 21.3c6.6 6.9 34.8 33 40 28c15.4-15 18.5-19 24.8-25.2c9.5-9.3-1-28.3 2.3-36s6.8-9.2 12.5-10.4s15.8 2.9 23.7 3c8.3.1 12.8-3.4 19-9.2c5-4.6 8.6-8.9 8.7-15.6c.2-9-12.8-20.9-3.1-30.4s23.7 6.2 34 5s22.8-15.5 24.1-21.6s-11.7-21.8-9.7-30.7c.7-3 6.8-10 11.4-11s25 6.9 29.6 5.9c5.6-1.2 12.1-7.1 17.4-10.4c15.5 6.7 29.6 9.4 47.7 9.4c68.5 0 124-53.4 124-119.2S408.5 48 340 48s-121.9 53.37-121.9 119.17ZM400 144a32 32 0 1 1-32-32a32 32 0 0 1 32 32Z"
                    ></path>
                  </svg>
                </div>
              </div>

              <dialog ref={passwordRef} className="modal">
                <div className="modal-box w-[450px]">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-lg">Passwortänderung</h3>
                    <h4 className="font-bold text-lg text-gray-700">
                      {user.firstName} {user.lastName}
                    </h4>
                  </div>
                  <form
                    className="pt-4"
                    onSubmit={handleSubmit(onSubmitPassword)}
                  >
                    <label className="block text-xl font-medium mb-3 text-left">
                      Kennwort
                    </label>
                    <input
                      {...register("password", { required: true })}
                      type={passwordVisible ? "text" : "password"}
                      placeholder="••••••••••••"
                      className="input input-bordered w-full"
                      value={password}
                      onChange={(e) => {
                        setGeneratedPassword(e.target.value);
                        setValue("password", e.target.value);
                      }}
                    />
                    <div className="flex justify-between my-3">
                      <button
                        type="button"
                        onClick={generatePassword}
                        className="w-[120px] btn bg-green-200 text-white hover:bg-green-300"
                      >
                        <span className="text-green-700 tracking-wide">
                          Generieren
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="w-[120px] btn bg-amber-200 text-white hover:bg-amber-300"
                      >
                        <span className="text-amber-700 tracking-wide">
                          Anzeigen
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={copyToClipboard}
                        className="w-[120px] btn bg-blue-200 text-white hover:bg-blue-300"
                      >
                        <span className="text-blue-700 tracking-wide">
                          Kopieren
                        </span>
                      </button>
                    </div>
                    <div className="modal-action">
                      <button
                        type="submit"
                        className="btn w-fit bg-gray-600 text-white hover:bg-gray-800 tracking-wider"
                      >
                        Bestätigen
                      </button>
                      <button
                        type="button"
                        className="btn w-28 bg-red-600 text-white hover:bg-red-800 tracking-wider"
                        onClick={() => passwordRef.current.close()}
                      >
                        Abbrechen
                      </button>
                    </div>
                  </form>
                </div>
              </dialog>

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
                        {...register("firstName")}
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
                  <div className="w-full px-3 sm:w-1/2">
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
                  <div className="w-full px-3 sm:w-1/2">
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
                </div>
                <div className="-mx-3 flex flex-wrap">
                  <div className="w-full px-3 sm:w-1/2">
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
                  <div className="w-full px-3 sm:w-1/2">
                    <div className="mb-5">
                      <label
                        htmlFor="department"
                        className="mb-3 block text-base font-medium text-[#07074D]"
                      >
                        Status
                      </label>
                      <select
                        {...register("status", { required: true })}
                        id="status"
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md hover:cursor-pointer"
                      >
                        <option value="aktiv">Aktiv</option>
                        <option value="inaktiv">Inaktiv</option>
                        <option value="gesperrt">Gesperrt</option>
                        <option value="ausstehend">Ausstehend</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    type="submit"
                    className="btn w-fit bg-gray-600 text-white hover:bg-gray-800 tracking-wider"
                  >
                    Bestätigen
                  </button>

                  <NavLink
                    to={"/admin/benutzer"}
                    className="btn w-28 bg-red-600 text-white hover:bg-red-800 tracking-wider"
                  >
                    Abbrechen
                  </NavLink>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
