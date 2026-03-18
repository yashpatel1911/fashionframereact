import React from 'react';

const Collection = () => {
  return (
    <section className="collection py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6" data-aos="fade-right">
            <div className="collection-image">
              <img src={require('../../assets/images/single-image-2.jpg')} alt="Classic Winter Collection" className="img-fluid" />
            </div>
          </div>
          <div className="col-lg-6" data-aos="fade-left">
            <div className="collection-content ps-lg-5">
              <h2 className="section-title text-uppercase mb-4 font-heading"style={{fontSize:"32px"}}>Classic Winter Collection</h2>
              <p className="text-muted mb-4 font-body">
                Dignissim lacus, turpis ut suspendisse vel tellus. Turpis
                purus, gravida orci, fringilla ut. Ac sed eu fringilla odio
                mi. Consequat pharetra at magna imperdiet cursus ac
                faucibus sit libero. Ultricies quam nunc, lorem sit lorem
                urna, pretium aliquam ut. In vel, quis donec dolor id in.
                Pulvinar commodo mollis diam sed facilisis at cursus
                imperdiet cursus ac faucibus sit faucibus sit libero.
              </p>
              <a href="/shop" className="btn btn-dark text-uppercase px-3 py-2 font-heading" >Shop Collection</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collection;
