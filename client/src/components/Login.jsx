import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthProvider";
import { useForm } from "react-hook-form";
import logo from "../assets/logo_login.jpg";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, user } = useContext(AuthContext);
  
  const navigate = useNavigate()

  useEffect(() => {
    if(user) {
      navigate("/produkte/suche")
    }
  }, [user, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <div className="flex">
      <div className="min-h-[100vh] w-full bg-gray-50 p-2">
        <section>
          <div className="flex flex-col items-center pt-24">
            <div className="flex justify-center text-center mb-6">
              <img src={logo} alt="logo"  className="w-[50%] md:w-[40%]"/>
            </div>
            <div className="w-full bg-white rounded-md shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div>
                    <label
                      htmlFor="userId"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Anmelde-ID:
                    </label>
                    <input
                      {...register("userId")}
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Bitte die ID-Nummer eingeben…"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Kennwort:
                    </label>
                    <input
                      {...register("password", { required: true })}
                      type="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                  <div className="flex justify-center">
                    <input
                      type="submit"
                      className="tracking-wide bg-gradient-to-b from-gray-700 to-gray-900 font-medium p-2 mt-2 md:p-2 text-white uppercase w-1/2 rounded cursor-pointer hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                      value={"Anmelden"}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
