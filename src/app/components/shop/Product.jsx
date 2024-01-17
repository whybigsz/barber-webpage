
import React from 'react';
import './Shop.css'

const Product = ({ imgSrc, title, price }) => {
  return (

    <div className="sneaker-cont">
      <img loading="lazy" className="sneaker-img" src={imgSrc} alt="" />
      <div className="sneakerDesc">
        <div className="sneaker-decor"></div>
        <div className="data-cont">
          <div className="sneakerName">
            <h2>{title}</h2>
          </div>
          <div className="btnBuy-cont">
            <div className="btnBuy">
              <h3><i className="fas fa-shopping-cart"></i></h3>
            </div>
          </div>
          <div className="sneakerSize">
            <h3>Preço</h3>
            <div className="sizes">
              <span>{price}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
