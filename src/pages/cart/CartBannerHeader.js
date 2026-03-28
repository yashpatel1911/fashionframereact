import React from 'react';
import '../../assets/css/lux-cart.css';

const steps = [
  { label: "Cart" },
  { label: "Address" },
  { label: "Payment" },
  { label: "Summary" },
];

const CartBannerHeader = ({ currentStep = 1 }) => (
  <div className="lux-banner">
    <h1 className="lux-banner-title">Shopping Cart</h1>

    <div className="lux-stepper">
      {steps.map((step, idx) => {
        const stepNum  = idx + 1;
        const isDone   = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <React.Fragment key={step.label}>
            <div className="lux-step">
              <div className={`lux-step-circle ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}>
                <span className="lux-step-num">{stepNum}</span>
              </div>
              <span className={`lux-step-label ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}>
                {step.label}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div className={`lux-step-line ${isDone ? "done" : ""}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

export default CartBannerHeader;