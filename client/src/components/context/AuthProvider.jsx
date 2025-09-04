import { createContext, useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  // if (!productId) {
  //   setProduct(null);   // reset product when no productId
  //   return;
  // }

    // axiosClient
    //   .get("/user/profile")
    //   .then((response) => {
    //     setUser(response.data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     setUser(null);
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });

    axiosClient
      .get("/products/getAllProducts")
      .then((res) => {
        setAllProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    const url = `/products/getProductInfo/${productId}`;

    axiosClient
      .get(url)
      .then((response) => {
        setProduct(response.data);
        console.log(url);
      })
      .catch((error) => {
        console.log(error);
           setProduct(null); // in case of error
      })
      .finally(() => setIsLoading(false));
  }, [productId]);

  const login = async (data, redirectUrl) => {
    axiosClient
      .post("/user/login", data)
      .then((response) => {
        setUser(response.data);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const logout = async () => {
    axiosClient
      .post("/user/logout")
      .then((response) => {
        setUser(null);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <AuthContext.Provider
        value={{
          login,
          logout,
          setProductId,
          user,
          productId,
          product,
          allProducts,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
}
