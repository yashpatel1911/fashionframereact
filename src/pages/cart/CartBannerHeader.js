import React from 'react';

const steps = [
  { label: "Cart" },
  { label: "Address" },
  { label: "Payment" },
  { label: "Summary" }
];

const responsiveStyle = `
.cart-banner-header {
  width: 100%;
  background: #fff;
  padding: 32px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid #eee;
  margin-bottom: 0;
}
.cart-banner-title {
  font-weight: 700;
  font-size: 2.2rem;
  letter-spacing: 1px;
}
.cart-banner-stepper {
  margin-top: 18px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  flex-wrap: wrap;
}
.cart-banner-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}
.cart-banner-step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #eee;
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 4px;
  border: 2px solid #eee;
  transition: all 0.2s;
}
.cart-banner-step-circle.active {
  background: #222;
  color: #fff;
  border: 2px solid #222;
}
.cart-banner-step-label {
  font-size: 14px;
  color: #888;
  font-weight: 400;
  letter-spacing: 0.5px;
}
.cart-banner-step-label.active {
  color: #222;
  font-weight: 600;
}
.cart-banner-step-line {
  width: 40px;
  height: 2px;
  background: #eee;
  margin: 0 4px;
  transition: background 0.2s;
}
.cart-banner-step-line.active {
  background: #222;
}
@media (max-width: 600px) {
  .cart-banner-header {
    padding: 18px 0 0 0;
  }
  .cart-banner-title {
    font-size: 1.3rem;
  }
  .cart-banner-stepper {
    flex-wrap: wrap;
    gap: 0;
  }
  .cart-banner-step {
    min-width: 60px;
  }
  .cart-banner-step-circle {
    width: 26px;
    height: 26px;
    font-size: 15px;
  }
  .cart-banner-step-label {
    font-size: 12px;
  }
  .cart-banner-step-line {
    width: 22px;
    margin: 0 2px;
  }
}
`;

const CartBannerHeader = ({ currentStep = 1 }) => (
  <>
    <style>{responsiveStyle}</style>
    <div className="cart-banner-header py-5" style={{ marginTop: '50px' }}>
      <h1 className="page-title text-uppercase mb-0 cart-banner-title font-heading">
        Shopping Cart
      </h1>
      <div className="cart-banner-stepper">
        {steps.map((step, idx) => (
          <React.Fragment key={step.label}>
            <div className="cart-banner-step">
              <div
                className={
                  "cart-banner-step-circle font-body" +
                  (idx + 1 === currentStep ? " active" : "")
                }
              >
                {idx + 1}
              </div>
              <span
                className={
                  "cart-banner-step-label font-body" +
                  (idx + 1 === currentStep ? " active" : "")
                }
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={
                  "cart-banner-step-line font-body" +
                  (idx + 1 < currentStep ? " active" : "")
                }
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  </>
);

export default CartBannerHeader;