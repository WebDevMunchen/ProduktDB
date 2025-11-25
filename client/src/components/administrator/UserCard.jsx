import { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

export default function UserCard({
  user,
  setAllUsers,
  location,
  searchParameter,
}) {
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const statusRef = useRef(null);
  const lockedAccountRef = useRef(null);
  const updatePasswordRef = useRef(null);

  const handleUserStatusChange = () => {
    axiosClient
      .put(`/user/switchUserStatus/${user._id}`)
      .then(() => {
        toast.success("Zugang deaktiviert!");
        statusRef.current.close();

        return axiosClient.get(
          `/user/getAllUsers?search=${searchParameter}&location=${location}`
        );
      })
      .then((response) => {
        setAllUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAccountUnlock = () => {
    axiosClient
      .put(`/user/unlockUserAccount/${user._id}`)
      .then(() => {
        toast.success("Account entsperrt!");
        lockedAccountRef.current.close();

        return axiosClient.get(
          `/user/getAllUsers?search=${searchParameter}&location=${location}`
        );
      })
      .then((response) => {
        setAllUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleResendActiviationLink = () => {
    setIsloading(true);
    axiosClient
      .post(`/user/sendActivation/${user._id}`)
      .then(() => {
        toast.success("E-Mail gesendet!");
        console.log("Sent to", user.email);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsloading(false);
      });
  };

  const onSubmit = (data) => {
    axiosClient
      .put(`/user/updatePassword/${user._id}`, data)
      .then((response) => {
        updatePasswordRef.current.close();
        toast.success("Kennwort geändert");
      })
      .catch((error) => {
        console.log(error);
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
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div>
            <div className="text-sm font-medium text-gray-900">
              {user.firstName + " " + user.lastName}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.userId}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.location}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.department}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.role}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-4 py-1 inline-flex text-sm leading-5 font-medium rounded-full tracking-wide ${
            user.status === "aktiv"
              ? "bg-green-100 text-green-700"
              : user.status === "gesperrt"
              ? "bg-red-100 text-red-700"
              : user.status === "ausstehend"
              ? "bg-blue-100 text-blue-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {user.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
        <div className="flex justify-center">
          <NavLink
            to={`/admin/benutzer/bearbeiten/${user._id}`}
            className="text-indigo-500 hover:text-indigo-700 mr-3"
            state={{ user }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={32}
              height={32}
              viewBox="0 0 32 32"
            >
              <path
                fill="currentColor"
                d="M27.87 7.863L23.024 4.82l-7.89 12.566l4.843 3.04zM14.395 21.25l-.107 2.855l2.527-1.337l2.35-1.24l-4.673-2.936zM29.163 3.24L26.63 1.647a1.364 1.364 0 0 0-1.88.43l-1 1.588l4.843 3.042l1-1.586c.4-.64.21-1.483-.43-1.883zm-3.965 23.82c0 .275-.225.5-.5.5h-19a.5.5 0 0 1-.5-.5v-19a.5.5 0 0 1 .5-.5h13.244l1.884-3H5.698c-1.93 0-3.5 1.57-3.5 3.5v19c0 1.93 1.57 3.5 3.5 3.5h19c1.93 0 3.5-1.57 3.5-3.5V11.097l-3 4.776v11.19z"
              ></path>
            </svg>
          </NavLink>

          {user.status === "aktiv" ? (
            <button
              className="text-red-600 hover:text-red-900"
              onClick={() => statusRef.current.showModal()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={32}
                height={32}
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="M8.5 4h3a1.5 1.5 0 0 0-3 0m-1 0a2.5 2.5 0 0 1 5 0h5a.5.5 0 0 1 0 1h-1.054l-1.194 10.344A3 3 0 0 1 12.272 18H7.728a3 3 0 0 1-2.98-2.656L3.554 5H2.5a.5.5 0 0 1 0-1zM5.741 15.23A2 2 0 0 0 7.728 17h4.544a2 2 0 0 0 1.987-1.77L15.439 5H4.561zM8.5 7.5A.5.5 0 0 1 9 8v6a.5.5 0 0 1-1 0V8a.5.5 0 0 1 .5-.5M12 8a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
                ></path>
              </svg>
            </button>
          ) : user.status === "ausstehend" ? (
            isLoading ? (
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
            ) : (
              <button
                className="text-amber-600 hover:text-amber-700"
                onClick={handleResendActiviationLink}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={32}
                  height={32}
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M3 4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h10.5a6.5 6.5 0 0 1-.5-2H3V8l8 5l8-5v3a7 7 0 0 1 .5 0a6.5 6.5 0 0 1 1.5.18V6c0-1.1-.9-2-2-2zm0 2h16l-8 5zm16 6l-2.25 2.25L19 16.5V15a2.5 2.5 0 0 1 2.5 2.5c0 .4-.09.78-.26 1.12l1.09 1.09c.42-.63.67-1.39.67-2.21c0-2.21-1.79-4-4-4zm-3.33 3.29c-.42.63-.67 1.39-.67 2.21c0 2.21 1.79 4 4 4V23l2.25-2.25L19 18.5V20a2.5 2.5 0 0 1-2.5-2.5c0-.4.09-.78.26-1.12z"
                  ></path>
                </svg>
              </button>
            )
          ) : user.status === "inaktiv" ? (
            <button
              className="text-green-600 hover:text-green-900"
              onClick={() => statusRef.current.showModal()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={32}
                height={32}
                viewBox="0 0 24 24"
              >
                <g fill="none">
                  <path d="M16 7.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0M14.499 17h7v4.5h-7z"></path>
                  <path
                    stroke="currentColor"
                    strokeLinecap="square"
                    strokeWidth={1.4}
                    d="M10.5 15H8a5 5 0 0 0-5 5v1h7.55M16 7.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0Zm-.25 9.5v-1.75a2.25 2.25 0 0 1 3.836-1.596M14.5 17h7v4.5h-7z"
                  ></path>
                </g>
              </svg>
            </button>
          ) : (
            <button
              className="text-green-600 hover:text-green-700"
              onClick={() => lockedAccountRef.current.showModal()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={30}
                height={30}
                viewBox="0 0 16 16"
              >
                <path
                  fill="currentColor"
                  d="M11.143 5c.473 0 .857.448.857 1v9c0 .552-.384 1-.857 1H.857C.384 16 0 15.552 0 15V6c0-.552.384-1 .857-1H8v-.8C8 1.88 9.79 0 12 0s4 1.88 4 4.2V5h-1v-.64C15 2.504 13.657 1 12 1S9 2.504 9 4.36V5zM1 15h10V6H1zm5.998-3.706L7.5 12.5h-3l.502-1.206A1.64 1.64 0 0 1 4.5 10.1c0-.883.672-1.6 1.5-1.6s1.5.717 1.5 1.6c0 .475-.194.901-.502 1.194"
                  strokeWidth={0.6}
                  stroke="currentColor"
                ></path>
              </svg>
            </button>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={32}
            height={32}
            viewBox="0 0 48 48"
            className="ml-1.5 text-sky-500 hover:text-sky-700 cursor-pointer"
            onClick={() => updatePasswordRef.current.showModal()}
          >
            <circle
              cx={33.4}
              cy={14.8}
              r={3.9}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            ></circle>
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.4 20.4a11.47 11.47 0 0 1 5.2-13.3a11.31 11.31 0 0 1 14.1 2.3a11.32 11.32 0 0 1-13 17.9"
              strokeWidth={2}
            ></path>
            <path
              fill="none"
              stroke="currentColor"
              d="M20.4 20.4L5.5 37v5.4h6.1l.7-4.2l6.5-.4l.5-5.5l5.5-.1l1.8-4.8"
              strokeWidth={2}
            ></path>
          </svg>
        </div>

        <dialog ref={statusRef} className="modal">
          <div className="modal-action ">
            <form className="modal-box flex flex-col gap-4 min-w-[600px] ">
              <h3 className="font-bold text-lg ">
                Sie sind im Begriff, <br />
                den Status für den folgenden Benutzer auf{" "}
                {user.status === "aktiv" ? (
                  <span className="text-red-600 italic">inaktiv</span>
                ) : (
                  <span className="text-green-600 italic">aktiv</span>
                )}{" "}
                zu setzen:
              </h3>
              <p className="font-semibold text-xl">
                {user.firstName + " " + user.lastName}
              </p>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn tracking-wider bg-green-600 text-white hover:bg-green-700"
                  onClick={() => {
                    handleUserStatusChange();
                  }}
                >
                  Übermitteln
                </button>
                <button
                  onClick={() => statusRef.current.close()}
                  className="btn w-28 bg-red-600 text-white hover:bg-red-800 tracking-wider"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        </dialog>

        <dialog ref={lockedAccountRef} className="modal">
          <div className="modal-action ">
            <form className="modal-box flex flex-col gap-4 min-w-[600px] ">
              <h3 className="font-bold text-lg ">
                Sie sind im Begriff, <br />
                den Account vom folgenden Benutzer zu entsperren:
              </h3>
              <p className="font-semibold text-xl">
                {user.firstName + " " + user.lastName}
              </p>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn tracking-wider bg-green-600 text-white hover:bg-green-700"
                  onClick={() => {
                    handleAccountUnlock();
                  }}
                >
                  Übermitteln
                </button>
                <button
                  onClick={() => lockedAccountRef.current.close()}
                  className="btn w-28 bg-red-600 text-white hover:bg-red-800 tracking-wider"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        </dialog>

        <dialog ref={updatePasswordRef} className="modal">
          <div className="modal-box">
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-xl font-medium text-gray-900 dark:text-white"
                >
                  Neues Kennwort für:{" "}
                  <span className="font-bold">
                    {user.firstName + " " + user.lastName}
                  </span>
                </label>
                <div className="flex flex-col items-center gap-3 justify-center">
                  <div className="flex w-[25%]">
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
                  <input
                    {...register("password", { required: true })}
                    type={passwordVisible ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-[60%] bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={password}
                    onChange={(e) => {
                      setGeneratedPassword(e.target.value);
                      setValue("password", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-center items-center space-x-4">
                <input
                  type="submit"
                  className="btn w-fit bg-gray-600 text-white hover:bg-gray-800"
                  value={"Bestätigen"}
                />
                <button
                  type="button"
                  className="btn w-28 bg-red-600 text-white hover:bg-red-800"
                  onClick={() => updatePasswordRef.current.close()}
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </td>
    </>
  );
}
