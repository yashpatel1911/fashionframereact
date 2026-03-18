import React, { useState, useEffect } from "react";
import CartBannerHeader from "./CartBannerHeader";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_ENDPOINTS from '../../api/apiConfig';
import { useUser } from "../../context/UserContext";

const paymentOptions = [
  {
    label: "Razorpay",
    value: "razorpay",
    icon: <FaCreditCard size={28} style={{ marginRight: 10, color: "#4285F4" }} />,
    description: "Pay instantly with Razorpay.",
  },
  {
    label: "Cash on Delivery",
    value: "cod",
    icon: <FaMoneyBillWave size={28} style={{ marginRight: 10, color: "#388e3c" }} />,
    description: "Pay with cash when your order is delivered.",
  },
];

const PaymentMethodSelection = ({ onSelect, defaultValue }) => {
  const [selected, setSelected] = useState(defaultValue || "");
  const [cartTotal, setCartTotal] = useState(0);
  const [placingOrder, setPlacingOrder] = useState(false);
  const { user } = useUser();
  // Prepare cart items for API
  const [cartItems, setCartItems] = useState([]);
  // Address ID from localStorage
  const [addressId, setAddressId] = useState(null);

  useEffect(() => {
    // Calculate cart total and prepare items from localStorage
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem("cart")) || [];
    } catch (e) {
      cart = [];
    }
    const getDiscountedPrice = (item) => {
      if (item.discount_percentage && item.discount_percentage > 0) {
        return Number(item.price) - (Number(item.price) * Number(item.discount_percentage)) / 100;
      }
      return Number(item.price);
    };
    const subtotal = cart.reduce((sum, item) => {
      const hasVendorDiscount =
        localStorage.getItem("authToken") && user?.created_by && item.discount_percentage > 0;

      const pricePerItem = hasVendorDiscount
        ? getDiscountedPrice(item)
        : item.price;

      return sum + pricePerItem * Number(item.quantity);
    }, 0);

    setCartTotal(subtotal);

    // Prepare items for API (STRICT FIELDS ONLY, use p_id for product_id)
    const items = cart.map((item) => {
      const product_id = item.p_id !== undefined ? Number(item.p_id) : Number(item.id);
      const size = typeof item.size === "string" ? item.size : String(item.size);
      const quantity = Number(item.quantity);
      const product_price = Number(item.price);
      const discount_percentage = Number(item.discount_percentage) || 0;
      const price = getDiscountedPrice(item);
      const total_price = price * quantity;
      return {
        product_id,
        size,
        quantity,
        product_price,
        discount_percentage,
        price,
        total_price,
      };
    });
    setCartItems(items);

    // Get address_id from localStorage
    try {
      const selectedAddress = JSON.parse(localStorage.getItem("selectedAddress"));
      setAddressId(selectedAddress?.address_id || selectedAddress?.id || null);
    } catch (e) {
      setAddressId(null);
    }
  }, []);

  const handleSelect = (value) => {
    setSelected(value);
    if (onSelect) onSelect(value);
  };

  // const handlePlaceOrder = async () => {
  //   if (!selected) {
  //     toast.error("Please select a payment method.", { position: "top-right" });
  //     return;
  //   }
  //   if (!addressId) {
  //     toast.error("No address selected.", { position: "top-right" });
  //     return;
  //   }
  //   if (!cartItems.length) {
  //     toast.error("Your cart is empty.", { position: "top-right" });
  //     return;
  //   }

  //   setPlacingOrder(true);

  //   // Prepare payload
  //   const payload = {
  //     payment_method: selected.toUpperCase() === "COD" ? "COD" : selected.toUpperCase(),
  //     total_amount: Number(cartTotal),
  //     items: cartItems,
  //     address_id: Number(addressId),
  //   };

  //   console.log("Placing order with payload:", payload);
  //   const token = localStorage.getItem("authToken");
  //   if (!token) {
  //     toast.error("You must be logged in to place an order.", { position: "top-right" });
  //     setPlacingOrder(false);
  //     return;
  //   }

  //   try {


  //     // ... inside your code
  //     const res = await fetch(API_ENDPOINTS.CREATE_USER_ORDER, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });
  //     const data = await res.json();
  //     if (res.ok && (data.status || data.success)) {
  //       toast.success("Order placed successfully!", { position: "top-right" });
  //       // Clear cart and redirect to summary page
  //       localStorage.removeItem("cart");
  //       setTimeout(() => {
  //         window.location.href = "/summary";
  //       }, 1500);
  //     } else {
  //       toast.error(data.message || "Failed to place order.", { position: "top-right" });
  //     }
  //   } catch (err) {
  //     toast.error("Failed to place order.", { position: "top-right" });
  //   }
  //   setPlacingOrder(false);
  // };

  const handlePlaceOrder = async () => {
    if (!selected) {
      toast.error("Please select a payment method.");
      return;
    }
    if (!addressId) {
      toast.error("No address selected.");
      return;
    }
    if (!cartItems.length) {
      toast.error("Your cart is empty.");
      return;
    }

    setPlacingOrder(true);
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Login required.");
      setPlacingOrder(false);
      return;
    }

    try {
      if (selected.toUpperCase() === "RAZORPAY") {
        // 1️⃣ Create Razorpay Order and Save User Order
        const orderRes = await fetch(API_ENDPOINTS.CREATE_ORDER_RZP, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payment_method: "RAZORPAY",
            total_amount: Number(cartTotal),
            items: cartItems,
            address_id: Number(addressId),
          }),
        });

        const orderData = await orderRes.json();
        console.log("Razorpay Order Response:", orderData);

        if (!orderData.status || !orderData.data) {
          toast.error(orderData.message || "Failed to create order.");
          setPlacingOrder(false);
          return;
        }

        const {
          razorpay_order_id,
          razorpay_key_id,
          amount,
          currency,
          user_order_id,
          pu_name,
          pu_email,
          pu_contact_no,
          address,
        } = orderData.data;

        // 2️⃣ Initialize Razorpay Payment
        const options = {
          key: razorpay_key_id,
          amount: amount, // Already in paisa
          currency: currency,
          name: "Fashion Frame",
          description: "Payment for your order",
          order_id: razorpay_order_id,
          prefill: {
            name: pu_name,
            email: pu_email,
            contact: pu_contact_no,
          },
          notes: {
            address: address || "",
            order_amount: amount,
            user_order_id: user_order_id,
          },
          theme: { color: "#3399cc" },

          // 3️⃣ Razorpay Success Handler
          handler: async function (response) {
            try {
              const verifyRes = await fetch(API_ENDPOINTS.VERIFY_ORDER_RZP, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  user_order_id: user_order_id,
                }),
              });

              const verifyData = await verifyRes.json();
              console.log("Verification Response:", verifyData);

              if (verifyData.status) {
                toast.success("Payment successful!");
                localStorage.removeItem("cart");
                setTimeout(() => {
                  window.location.href = "/summary";
                }, 1500);
              } else {
                toast.error("Payment verification failed.");
              }
            } catch (verifyErr) {
              console.error("Verification Error:", verifyErr);
              toast.error("Verification failed.");
            }
          },
        };

        // 4️⃣ Open Razorpay Popup
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          toast.error("Payment failed. Please try again.");
          console.error("Razorpay payment error:", response.error);
        });
        rzp.open();

        setPlacingOrder(false);
        return;
      }

      // 🟡 COD Flow (No Razorpay)
      const codRes = await fetch(API_ENDPOINTS.CREATE_USER_ORDER, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_method: "COD",
          total_amount: Number(cartTotal),
          items: cartItems,
          address_id: Number(addressId),
        }),
      });

      const codData = await codRes.json();
      console.log("COD Response:", codData);

      if (codRes.ok && (codData.status || codData.success)) {
        toast.success("Order placed successfully (COD)!");
        localStorage.removeItem("cart");
        setTimeout(() => {
          window.location.href = "/summary";
        }, 1500);
      } else {
        toast.error(codData.message || "Failed to place COD order.");
      }
    } catch (error) {
      console.error("Place Order Error:", error);
      toast.error("Something went wrong.");
    }

    setPlacingOrder(false);
  };


  return (
    <main>
      <CartBannerHeader currentStep={3} />
      <section className="page-header bg-light mb-5">
        <div className="container">
          <h1 className="page-title text-center mb-0">Select Payment Method</h1>
        </div>
      </section>
      <section className="cart-content pb-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center border rounded-3 p-3 bg-white">
                  <span className="fw-bold" style={{ fontSize: 18 }}>Total Amount</span>
                  <span className="fw-bold" style={{ fontSize: 20, color: "#222" }}>
                    ₹{cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="payment-method-list">
                {paymentOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`payment-method-card border rounded-3 p-4 mb-3 d-flex align-items-center ${selected === option.value ? "border-dark bg-light" : ""}`}
                    style={{ cursor: "pointer", transition: "all 0.2s" }}
                    onClick={() => handleSelect(option.value)}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      checked={selected === option.value}
                      onChange={() => handleSelect(option.value)}
                      onClick={e => e.stopPropagation()}
                      style={{ marginRight: 16 }}
                    />
                    {option.icon}
                    <div>
                      <div className="fw-bold" style={{ fontSize: 18 }}>{option.label}</div>
                      <div className="text-muted small">{option.description}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-flex gap-2 mt-4">
                <button
                  className="btn btn-outline-dark"
                  onClick={() => window.history.back()}
                  disabled={placingOrder}
                >
                  Back
                </button>
                <button
                  className="btn btn-dark"
                  disabled={!selected || placingOrder}
                  onClick={handlePlaceOrder}
                >
                  {placingOrder ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </main>
  );
};

export default PaymentMethodSelection;