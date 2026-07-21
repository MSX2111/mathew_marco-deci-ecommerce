import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import api from "../axios/axiosInstance";

const Home = () => {
  const [homeData, setHomeData] = useState({
    promotions: [],
    categories: [],
    featuredProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchHomeContent() {
      try {
        setLoading(true);
        const response = await api.get("/home");
        setHomeData(response.data);
      } catch (error) {
        console.error("Failed to load storefront landing details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeContent();
  }, []);

  const handleCategoryClick = (categoryKey) => {
    navigate("/store", { state: { category: categoryKey } });
  };

  if (loading)
    return (
      <>
        <NavBar />
        <div>Assembling landing showcases...</div>
      </>
    );

  return (
    <>
      <NavBar />
      <div className="page-shell home-page">
        {}
        <section className="promotions-hero-banner">
          {homeData.promotions.map((promo) => (
            <div key={promo.id} className="promo-banner-card">
              <img src={promo.imageURL} alt={promo.title} />
              <div className="promo-overlay-text">
                <span className="promo-badge">{promo.badge}</span>
                <h2>{promo.title}</h2>
                <p>{promo.subtitle}</p>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/store")}
                >
                  Shop Promotion
                </button>
              </div>
            </div>
          ))}
        </section>

        {}
        <section className="categories-navigation-section">
          <h2>Shop by Department</h2>
          <div className="categories-grid-row">
            {homeData.categories.map((cat) => (
              <div
                key={cat.id}
                className="category-navigation-card clickable-card"
                onClick={() => handleCategoryClick(cat.id)}
              >
                <h3>{cat.name}</h3>
                <span>{cat.itemCount} &rarr;</span>
              </div>
            ))}
          </div>
        </section>

        {}
        <section className="featured-products-section">
          <h2>Featured Essentials</h2>
          <div className="featured-products-grid">
            {homeData.featuredProducts.map((product) => (
              <div
                key={product.id}
                className="featured-item-card clickable-card"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img src={product.imageURL} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="featured-item-desc">{product.description}</p>
                <span className="featured-item-price">${product.price}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
