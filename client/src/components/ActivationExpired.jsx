import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo_login.jpg";
import { useEffect, useState } from "react";

export default function ActivationExpired() {
  const [count, setCount] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count === 0) {
      navigate("/");
    }
  }, [count, navigate]);

  return (
    <div className="flex">
      <div className="min-h-[100vh] w-full bg-gray-50 p-2">
        <section>
          <div className="flex flex-col items-center pt-24">
            <div className="flex justify-center text-center mb-6">
              <img src={logo} alt="logo" className="w-[50%] md:w-[40%]" />
            </div>

            <div className="w-full bg-white rounded-md shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <div className="flex flex-col items-center gap-4 justify-center">
                  <p className="text-gray-700 text-center leading-relaxed text-sm md:text-base max-w-[90%]">
                    Ihr Aktivierungslink ist <strong>ungültig</strong> oder{" "}
                    <strong>abgelaufen</strong>. Bitte wenden Sie sich an Ihre
                    IT-Abteilung, falls Sie einen neuen Link benötigen.
                  </p>

                  <p className="text-gray-700 text-center leading-relaxed text-sm md:text-base max-w-[90%]">
                    Sie werden automatisch in <strong>{count}</strong> Sekunden
                    zum Login weitergeleitet.
                  </p>

                  <NavLink
                    to="/"
                    className="text-center tracking-wide bg-gradient-to-b from-gray-700 to-gray-900 font-medium p-2 mt-2 md:p-2 text-white uppercase w-1/2 rounded cursor-pointer hover:shadow-lg transition transform hover:-translate-y-0.5"
                  >
                    Zum Login
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
