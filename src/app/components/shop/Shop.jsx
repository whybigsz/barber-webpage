"use client"
import React from 'react'
import './Shop.css'
import Product from "./Product"


const Shop = () => {

  const productData = [
    { imgSrc: '/imgs/1.1.png', title: 'Hey⚡Joe Azul', price: '16€' },
    { imgSrc: '/imgs/1.2.png', title: 'Hey⚡Joe Amarelo', price: '16€' },
    { imgSrc: '/imgs/1.3.png', title: 'Hey⚡Joe Verde', price: '17€' },
    { imgSrc: '/imgs/1.4.png', title: 'Hey⚡Joe Laranja', price: '16€' },
    { imgSrc: '/imgs/1.5.png', title: 'Hey⚡Joe Duo', price: '16€' },
    { imgSrc: '/imgs/1.6.png', title: 'Hey⚡Joe Laranja', price: '16€' },
    { imgSrc: '/imgs/1.7.png', title: 'Hey⚡Joe Duo', price: '16€' },
    { imgSrc: '/imgs/1.8.png', title: 'Hey⚡Joe Laranja', price: '16€' },
    { imgSrc: '/imgs/1.9.png', title: 'Hey⚡Joe Duo', price: '16€' },
    { imgSrc: '/imgs/2.png', title: 'Hey⚡Joe Laranja', price: '16€' },
  ];

  return (
    <div className="product-cont">

      {productData.map((sneaker, index) => (
        <Product
          key={index}
          imgSrc={sneaker.imgSrc}
          title={sneaker.title}
          price={sneaker.price}
        />
      ))}




      {/* <div tabIndex="0" id="snkc" className="sneaker-cont11">
        <img loading="lazy" className="sneaker-img" src="/imgs/2.4.webp" alt="mike Jordan SB" />
        <div className="sneakerDesc">
          <div className="sneaker-decor"></div>
          <div className="data-cont">
            <div className="sneakerName">
              <h2>mike wmns</h2>
              <div className="snk-className">
                <h3>air max 95</h3>
              </div>
            </div>
            <div className="btnBuy-cont">
              <div className="btnBuy">
                <h3><i className="fas fa-shopping-cart"></i></h3>
              </div>
            </div>
            <div className="sneakerSize">
              <h3>Sizes</h3>
              <div className="sizes">
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div tabIndex="0" id="snkc" className="sneaker-cont12">
        <img loading="lazy" className="sneaker-img" src="/imgs/2.2.webp" alt="mike Jordan SB" />
        <div className="sneakerDesc">
          <div className="sneaker-decor"></div>
          <div className="data-cont">
            <div className="sneakerName">
              <h2>mike mid smoke</h2>
              <div className="snk-className">
                <h3>jordan 1</h3>
              </div>
            </div>
            <div className="btnBuy-cont">
              <div className="btnBuy">
                <h3><i className="fas fa-shopping-cart"></i></h3>
              </div>
            </div>
            <div className="sneakerSize">
              <h3>Sizes</h3>
              <div className="sizes">
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div tabIndex="0" id="snkc" className="sneaker-cont13">
        <img loading="lazy" className="sneaker-img" src="/imgs/1.8.webp" alt="mike Jordan SB" />
        <div className="sneakerDesc">
          <div className="sneaker-decor"></div>
          <div className="data-cont">
            <div className="sneakerName">
              <h2>Retro High Tie Dye</h2>
              <div className="snk-className">
                <h3>jordan 1</h3>
              </div>
            </div>
            <div className="btnBuy-cont">
              <div className="btnBuy">
                <h3><i className="fas fa-shopping-cart"></i></h3>
              </div>
            </div>
            <div className="sneakerSize">
              <h3>Sizes</h3>
              <div className="sizes">
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div tabIndex="0" id="snkc" className="sneaker-cont14">
        <img loading="lazy" className="sneaker-img" src="/imgs/2.5.webp" alt="mike Jordan SB" />
        <div className="sneakerDesc">
          <div className="sneaker-decor"></div>
          <div className="data-cont">
            <div className="sneakerName">
              <h2>mike low raygun</h2>
              <div className="snk-className">
                <h3>air force 1</h3>
              </div>
            </div>
            <div className="btnBuy-cont">
              <div className="btnBuy">
                <h3><i className="fas fa-shopping-cart"></i></h3>
              </div>
            </div>
            <div className="sneakerSize">
              <h3>Sizes</h3>
              <div className="sizes">
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div tabIndex="0" id="snkc" className="sneaker-cont15">
        <img loading="lazy" className="sneaker-img" src="/imgs/1.9.webp" alt="mike Jordan SB" />
        <div className="sneakerDesc">
          <div className="sneaker-decor"></div>
          <div className="data-cont">

            <div className="sneakerName">
              <h2>mike mid satin grey</h2>
              <div className="snk-className">
                <h3>jordan 1</h3>
              </div>
            </div>
            <div className="btnBuy-cont">
              <div className="btnBuy">
                <h3><i className="fas fa-shopping-cart"></i></h3>
              </div>
            </div>
            <div className="sneakerSize">
              <h3>Sizes</h3>
              <div className="sizes">
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div tabIndex="0" id="snkc" className="sneaker-cont16">
        <img loading="lazy" className="sneaker-img" src="/imgs/2.7.webp" alt="mike Jordan SB" />
        <div className="sneakerDesc">
          <div className="sneaker-decor"></div>
          <div className="data-cont">
            <div className="sneakerName">
              <h2>mike low white</h2>
              <div className="snk-className">
                <h3>air force 1</h3>
              </div>
            </div>
            <div className="btnBuy-cont">
              <div className="btnBuy">
                <h3><i className="fas fa-shopping-cart"></i></h3>
              </div>
            </div>
            <div className="sneakerSize">
              <h3>Sizes</h3>
              <div className="sizes">
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </div>
      </div>*/}

      <div className="scrollImage-cont">
        <div id="snk" className="sneakerCont">
          <img src="/imgs/3.1.png" alt="" />
        </div>
        <div id="snk" className="sneakerCont">
          <img src="/imgs/3.2.png" alt="" />
        </div>
        <div id="snk" className="sneakerCont">
          <img src="/imgs/3.3.png" alt="" />
        </div>
        <div id="snk" className="sneakerCont">
          <img src="/imgs/3.4.png" alt="" />
        </div>
        <div id="snk" className="sneakerCont">
          <img src="/imgs/3.1.png" alt="" />
        </div>
      </div>

      {/* <div className="scrollImage-cont2">
        <div id="snk" className="sneakerCont">
          <img src="/imgs/3.5.webp" alt="" />
        </div>
        <div id="snk" className="sneakerCont">
          <img src="/imgs/3.6.webp" alt="" />
        </div>
        <div id="snk" className="sneakerCont">
          <img src="/imgs/3.7.webp" alt="" />
        </div>
        <div id="snk" className="sneakerCont">
          <img src="/imgs/3.8.webp" alt="" />
        </div>
        <div id="snk" className="sneakerCont">
          <img src="/imgs/3.5.webp" alt="" />
        </div>
      </div> */}

    </div>
  )
}

export default Shop


