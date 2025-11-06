import { createContext, useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [productId, setProductId] = useState(0);
  const [product, setProduct] = useState(null);
  const [allMissingProductReports, setAllMissingProductReports] = useState(null);
  const [allProducts, setAllProducts] = useState(null);
  const [paginatedProducts, setPaginatedProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/user/getProfile")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });


    axiosClient
      .get("/products/getAllProducts")
      .then((response) => {
        setAllProducts(response.data);
      })
      .catch((err) => {
        setAllProducts(null);
      });

          axiosClient
      .get("/products/getPaginatedProducts")
      .then((response) => {
        setPaginatedProducts(response.data);
      })
      .catch((err) => {
        setAllProducts(null);
      });

    const url = `/products/getProductInfo/${productId}`;

    axiosClient
      .get(url)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        setProduct(null);
      })
      .finally(() => {
        setIsLoading(false);
      });

    axiosClient
      .get("/missingProduct/getAllMissingProductReports")
      .then((response) => {
        setAllMissingProductReports(response.data);
      })
      .catch((error) => {
        setProduct(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [productId]);

  const login = (data) => {
    axiosClient
      .post("/user/login", data)
      .then((response) => {
        setUser(response.data);
        navigate("/artikel/suche");
      })
      .catch((error) => {
        toast.error("Falsche Anmeldedaten!");
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
      .catch((error) => {});
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
          isLoading,
          setIsLoading,
          setProduct,
          setAllProducts,
          allMissingProductReports,
          setAllMissingProductReports,
          paginatedProducts,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
}
