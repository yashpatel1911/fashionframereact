import React, { useState, useEffect } from "react";
import CartBannerHeader from "./CartBannerHeader";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_ENDPOINTS from '../../api/apiConfig';
import { useUser } from "../../context/UserContext";
import '../../assets/css/lux-cart.css';

const paymentOptions = [
  {
    label: "Razorpay",
    value: "razorpay",
    icon: <FaCreditCard size={22} />,
    iconColor: "#4285F4",
    description: "UPI, Cards, Net Banking & Wallets",
    tag: "Recommended",
  },
  {
    label: "Cash on Delivery",
    value: "cod",
    icon: <FaMoneyBillWave size={22} />,
    iconColor: "#7a9e6e",
    description: "Pay with cash when your order arrives",
    tag: null,
  },
];

const PaymentMethodSelection = ({ onSelect, defaultValue }) => {
  const [selected, setSelected]       = useState(defaultValue || "");
  const [cartTotal, setCartTotal]     = useState(0);
  const [placingOrder, setPlacingOrder] = useState(false);
  const { user }                      = useUser();
  const [cartItems, setCartItems]     = useState([]);
  const [addressId, setAddressId]     = useState(null);

  useEffect(() => {
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem("cart")) || [];
    } catch { cart = []; }

    const getDiscountedPrice = (item) => {
      if (item.discount_percentage && item.discount_percentage > 0) {
        return Number(item.price) - (Number(item.price) * Number(item.discount_percentage)) / 100;
      }
      return Number(item.price);
    };

    const subtotal = cart.reduce((sum, item) => {
      const hasVendorDiscount =
        localStorage.getItem("authToken") && user?.created_by && item.discount_percentage > 0;
      const pricePerItem = hasVendorDiscount ? getDiscountedPrice(item) : item.price;
      return sum + pricePerItem * Number(item.quantity);
    }, 0);

    setCartTotal(subtotal);

    const items = cart.map((item) => {
      const product_id         = item.p_id !== undefined ? Number(item.p_id) : Number(item.id);
      const size               = typeof item.size === "string" ? item.size : String(item.size);
      const quantity           = Number(item.quantity);
      const product_price      = Number(item.price);
      const discount_percentage = Number(item.discount_percentage) || 0;
      const price              = getDiscountedPrice(item);
      const total_price        = price * quantity;
      return { product_id, size, quantity, product_price, discount_percentage, price, total_price };
    });
    setCartItems(items);

    try {
      const selectedAddress = JSON.parse(localStorage.getItem("selectedAddress"));
      setAddressId(selectedAddress?.address_id || selectedAddress?.id || null);
    } catch { setAddressId(null); }
  }, []);

  const handleSelect = (value) => {
    setSelected(value);
    if (onSelect) onSelect(value);
  };

  const handlePlaceOrder = async () => {
    if (!selected)     { toast.error("Please select a payment method."); return; }
    if (!addressId)    { toast.error("No address selected."); return; }
    if (!cartItems.length) { toast.error("Your cart is empty."); return; }

    setPlacingOrder(true);
    const token = localStorage.getItem("authToken");
    if (!token) { toast.error("Login required."); setPlacingOrder(false); return; }

    try {
      if (selected.toUpperCase() === "RAZORPAY") {
        const orderRes = await fetch(API_ENDPOINTS.CREATE_ORDER_RZP, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            payment_method: "RAZORPAY",
            total_amount: Number(cartTotal),
            items: cartItems,
            address_id: Number(addressId),
          }),
        });

        const orderData = await orderRes.json();
        if (!orderData.status || !orderData.data) {
          toast.error(orderData.message || "Failed to create order.");
          setPlacingOrder(false);
          return;
        }

        const {
          razorpay_order_id, razorpay_key_id, amount, currency,
          user_order_id, pu_name, pu_email, pu_contact_no, address,
        } = orderData.data;

        const options = {
          key: razorpay_key_id,
          amount,
          currency,
          name: "Fashion Frame",
          description: "Payment for your order",
          order_id: razorpay_order_id,
          prefill: { name: pu_name, email: pu_email, contact: pu_contact_no },
          notes: { address: address || "", order_amount: amount, user_order_id },
          theme: { color: "#c9a96e" },
          handler: async function (response) {
            try {
              const verifyRes = await fetch(API_ENDPOINTS.VERIFY_ORDER_RZP, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  user_order_id,
                }),
              });
              const verifyData = await verifyRes.json();
              if (verifyData.status) {
                toast.success("Payment successful!");
                localStorage.removeItem("cart");
                setTimeout(() => { window.location.href = "/summary"; }, 1500);
              } else {
                toast.error("Payment verification failed.");
              }
            } catch {
              toast.error("Verification failed.");
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", () => toast.error("Payment failed. Please try again."));
        rzp.open();
        setPlacingOrder(false);
        return;
      }

      // COD Flow
      const codRes = await fetch(API_ENDPOINTS.CREATE_USER_ORDER, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_method: "COD",
          total_amount: Number(cartTotal),
          items: cartItems,
          address_id: Number(addressId),
        }),
      });

      const codData = await codRes.json();
      if (codRes.ok && (codData.status || codData.success)) {
        toast.success("Order placed successfully!");
        localStorage.removeItem("cart");
        setTimeout(() => { window.location.href = "/summary"; }, 1500);
      } else {
        toast.error(codData.message || "Failed to place order.");
      }
    } catch {
      toast.error("Something went wrong.");
    }

    setPlacingOrder(false);
  };

  return (
    <main className="lux-pay-page">
      <CartBannerHeader currentStep={3} />

      <div className="lux-page-header">
        <p className="lux-page-subtitle">Step 3 of 3</p>
        <h2 className="lux-page-title">Payment</h2>
      </div>

      <section className="lux-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">

              {/* Total Amount */}
              <div className="lux-amount-card">
                <div className="lux-amount-label">Order Total</div>
                <div className="lux-amount-value">
                  <span className="lux-amount-currency">₹</span>
                  {cartTotal.toFixed(2)}
                </div>
              </div>

              {/* Payment Options */}
              <div className="payment-method-list">
                {paymentOptions.map((option) => {
                  const isSelected = selected === option.value;
                  return (
                    <div
                      key={option.value}
                      className={`lux-pay-card ${isSelected ? "selected" : ""}`}
                      onClick={() => handleSelect(option.value)}
                    >
                      <div className="lux-pay-icon" style={{ color: option.iconColor }}>
                        {option.icon}
                      </div>
                      <div className="lux-pay-info">
                        <div className="lux-pay-name">
                          {option.label}
                          {option.tag && <span className="lux-pay-tag">{option.tag}</span>}
                        </div>
                        <div className="lux-pay-desc">{option.description}</div>
                      </div>
                      <input
                        type="radio"
                        name="payment-method"
                        className="lux-radio"
                        checked={isSelected}
                        onChange={() => handleSelect(option.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="lux-divider" />

              <div className="lux-actions">
                <button
                  className="lux-btn-secondary"
                  onClick={() => window.history.back()}
                  disabled={placingOrder}
                >
                  ← Back
                </button>
                <button
                  className="lux-btn-primary"
                  disabled={!selected || placingOrder}
                  onClick={handlePlaceOrder}
                >
                  {placingOrder
                    ? <span className="lux-loading-dots">Placing Order</span>
                    : "Place Order"}
                </button>
              </div>

              <div className="lux-secure-note">
                All transactions are secured & encrypted
              </div>

            </div>
          </div>
        </div>
      </section>

      <ToastContainer
        position="top-right"
        toastStyle={{
          fontFamily: "'Jost', sans-serif",
          fontSize: "0.85rem",
          letterSpacing: "0.04em",
          borderRadius: "3px",
        }}
      />
    </main>
  );
};

export default PaymentMethodSelection;