"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShieldCheck, X, Home, Building2 } from "lucide-react";
import { useCartStore, useThemeStore } from "@/store";

const GRADES = [
  { name: 'Grade 4',      min: 0,     max: 2000,  color: '#6b7280' },
  { name: 'Grade 3',      min: 2000,  max: 5000,  color: '#16a34a' },
  { name: 'Grade 2',      min: 5000,  max: 10000, color: '#2563eb' },
  { name: 'Grade 1',      min: 10000, max: 20000, color: '#7c3aed' },
  { name: 'Semi-Special', min: 20000, max: 35000, color: '#dc2626' },
  { name: 'Special Grade', min: 35000, max: Infinity, color: '#f59e0b' },
];

function getCursedGrade(total: number) {
  return GRADES.find(g => total >= g.min && total < g.max) ?? GRADES[0];
}

// All 58 Algerian Wilayas
const WILAYAS = [
  { code: "01", name: "Adrar" },
  { code: "02", name: "Chlef" },
  { code: "03", name: "Laghouat" },
  { code: "04", name: "Oum El Bouaghi" },
  { code: "05", name: "Batna" },
  { code: "06", name: "Béjaïa" },
  { code: "07", name: "Biskra" },
  { code: "08", name: "Béchar" },
  { code: "09", name: "Blida" },
  { code: "10", name: "Bouira" },
  { code: "11", name: "Tamanrasset" },
  { code: "12", name: "Tébessa" },
  { code: "13", name: "Tlemcen" },
  { code: "14", name: "Tiaret" },
  { code: "15", name: "Tizi Ouzou" },
  { code: "16", name: "Alger" },
  { code: "17", name: "Djelfa" },
  { code: "18", name: "Jijel" },
  { code: "19", name: "Sétif" },
  { code: "20", name: "Saïda" },
  { code: "21", name: "Skikda" },
  { code: "22", name: "Sidi Bel Abbès" },
  { code: "23", name: "Annaba" },
  { code: "24", name: "Guelma" },
  { code: "25", name: "Constantine" },
  { code: "26", name: "Médéa" },
  { code: "27", name: "Mostaganem" },
  { code: "28", name: "M'Sila" },
  { code: "29", name: "Mascara" },
  { code: "30", name: "Ouargla" },
  { code: "31", name: "Oran" },
  { code: "32", name: "El Bayadh" },
  { code: "33", name: "Illizi" },
  { code: "34", name: "Bordj Bou Arréridj" },
  { code: "35", name: "Boumerdès" },
  { code: "36", name: "El Tarf" },
  { code: "37", name: "Tindouf" },
  { code: "38", name: "Tissemsilt" },
  { code: "39", name: "El Oued" },
  { code: "40", name: "Khenchela" },
  { code: "41", name: "Souk Ahras" },
  { code: "42", name: "Tipaza" },
  { code: "43", name: "Mila" },
  { code: "44", name: "Aïn Defla" },
  { code: "45", name: "Naâma" },
  { code: "46", name: "Aïn Témouchent" },
  { code: "47", name: "Ghardaïa" },
  { code: "48", name: "Relizane" },
  { code: "49", name: "Timimoun" },
  { code: "50", name: "Bordj Badji Mokhtar" },
  { code: "51", name: "Ouled Djellal" },
  { code: "52", name: "Béni Abbès" },
  { code: "53", name: "In Salah" },
  { code: "54", name: "In Guezzam" },
  { code: "55", name: "Touggourt" },
  { code: "56", name: "Djanet" },
  { code: "57", name: "El M'Ghair" },
  { code: "58", name: "El Meniaa" },
];

// Shipping tiers: [Home, Office]
const MAJOR_WILAYAS = new Set(["09", "31", "25", "23"]);

function calcShipping(wilayaCode: string, deliveryType: "home" | "desk"): number {
  if (wilayaCode === "16") return deliveryType === "home" ? 400 : 200;
  if (MAJOR_WILAYAS.has(wilayaCode)) return deliveryType === "home" ? 700 : 400;
  return deliveryType === "home" ? 900 : 600;
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const showToast = useThemeStore((state) => state.showToast);
  const [mounted, setMounted] = useState(false);

  // Checkout modal state
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedWilaya, setSelectedWilaya] = useState(""); // stores the wilaya code
  const [wilayaSearch, setWilayaSearch] = useState("");    // stores the display text in input
  const [deliveryType, setDeliveryType] = useState<"home" | "desk">("home");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const shippingCost = selectedWilaya ? calcShipping(selectedWilaya, deliveryType) : 0;

  const filteredWilayas = WILAYAS.filter(w =>
    w.name.toLowerCase().includes(wilayaSearch.toLowerCase()) ||
    w.code.includes(wilayaSearch)
  );

  const handleWilayaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWilayaSearch(val);
    // Try to match typed text against a wilaya
    const match = WILAYAS.find(
      w => `${w.code} - ${w.name}`.toLowerCase() === val.toLowerCase()
    );
    setSelectedWilaya(match ? match.code : "");
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ""); // strip non-digits
    e.target.value = val.slice(0, 10);
    if (val.length > 0 && !val.startsWith("0")) {
      setPhoneError("Phone must start with 0 (e.g. 05, 06, 07)");
    } else if (val.length > 0 && val.length < 10) {
      setPhoneError("Phone number must be 10 digits");
    } else {
      setPhoneError("");
    }
  };

  const SHEETS_URL = "https://script.google.com/macros/s/AKfycbzccH2vomSk-k1Axx8yEcE-bWBvxovUyfj5GnQ8vtES0_rHEV_c4MZ5J5WyXMrsN--uWw/exec";

  const handleConfirmOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const wilayaLabel = WILAYAS.find(w => w.code === selectedWilaya);
    const itemsString = items
      .map(item => `${item.quantity}x ${item.name}${item.size ? ` (${item.size})` : ""}${item.color ? ` - ${item.color}` : ""}`)
      .join(", ");

    const payload = {
      name: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      wilaya: wilayaLabel ? `${wilayaLabel.code} - ${wilayaLabel.name}` : selectedWilaya,
      address: formData.get("address") as string,
      deliveryType: deliveryType === "home" ? "Home Delivery" : "Office Pick-up",
      items: itemsString,
      total: `${(subtotal + shippingCost).toLocaleString()} DZD`,
    };

    try {
      await fetch(SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // no-cors means we can't read the response — assume success if no exception
      clearCart();
      setOrderSuccess(true);
      showToast('Your order has been placed successfully. Please check your email.', 'success');
    } catch (err) {
      console.error("[Limitless Store] Order submission failed:", err);
      setSubmitError("Something went wrong. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const currentGrade = getCursedGrade(subtotal);
  const nextGrade = GRADES[GRADES.findIndex(g => g.name === currentGrade.name) + 1];
  const percentToNext = nextGrade 
    ? ((subtotal - currentGrade.min) / (currentGrade.max - currentGrade.min)) * 100 
    : 100;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-24 flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-cinzel text-4xl md:text-5xl font-bold tracking-widest text-foreground mb-6">
          YOUR VEIL IS EMPTY
        </h1>
        <p className="text-muted-foreground mb-10 max-w-md text-lg">
          It seems you haven't manifested any artifacts into your cart yet. Return to the shop to find your technique.
        </p>
        <Link 
          href="/shop" 
          className="group relative px-8 py-4 bg-primary text-white font-bold tracking-[0.2em] uppercase overflow-hidden"
        >
          <span className="relative z-10">Return to Shop</span>
          <div className="absolute inset-0 bg-accent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-cinzel text-4xl font-bold tracking-widest text-foreground mb-8 border-b border-border pb-4">
          SHOPPING CART
        </h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 bg-surface p-4 rounded-xl border border-border items-start sm:items-center">
                {/* Image */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted/20 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-border/50">
                  <span className="text-[10px] text-muted-foreground uppercase text-center block w-full px-2">Image</span>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-center h-full">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/product/${item.productId}`} className="font-semibold text-lg text-foreground hover:text-primary transition-colors line-clamp-1">
                      {item.name}
                    </Link>
                    <p className="font-cinzel font-bold text-foreground text-lg ml-4">
                      {item.price.toLocaleString()} <span className="text-xs text-muted-foreground font-sans">DZD</span>
                    </p>
                  </div>
                  
                  <div className="flex text-sm text-muted-foreground mb-4 gap-4">
                    {item.size && <span>Size: <strong className="text-foreground">{item.size}</strong></span>}
                    {item.color && <span>Color: <strong className="text-foreground">{item.color}</strong></span>}
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center w-28 border border-border rounded-lg overflow-hidden bg-background">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted/20 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <div className="flex-1 text-center font-bold text-foreground text-sm">
                        {item.quantity}
                      </div>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted/20 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-muted hover:text-primary transition-colors p-2"
                      aria-label="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-surface rounded-xl border border-border p-6 shadow-xl sticky top-28">
              <h2 className="font-cinzel font-bold text-xl text-foreground mb-6 border-b border-border pb-4">
                ORDER SUMMARY
              </h2>
              
              <div className="mb-6 pb-6 border-b border-border">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Cursed Energy</span>
                  <span className="grade-badge" style={{ '--grade-color-end': currentGrade.color } as React.CSSProperties}>
                    {currentGrade.name}
                  </span>
                </div>
                <div className="cursed-energy-bar">
                  <div 
                    className="cursed-energy-fill" 
                    style={{ 
                      width: `${percentToNext}%`, 
                      '--grade-color-start': `${currentGrade.color}80`, 
                      '--grade-color-end': currentGrade.color 
                    } as React.CSSProperties} 
                  />
                </div>
                {nextGrade && (
                  <p className="text-[10px] text-right mt-2 text-muted-foreground/60">
                    {(nextGrade.min - subtotal).toLocaleString()} DZD to {nextGrade.name}
                  </p>
                )}
              </div>
              
              <div className="space-y-4 text-sm font-medium text-foreground mb-6 border-b border-border pb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{subtotal.toLocaleString()} DZD</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-8">
                 <span className="font-bold text-lg text-foreground">Subtotal</span>
                 <span className="font-cinzel font-bold text-3xl text-foreground tracking-wide text-glow-primary">
                    {subtotal.toLocaleString()} <span className="text-sm font-sans text-muted-foreground">DZD</span>
                 </span>
              </div>

              <button
                onClick={() => { setIsCheckoutModalOpen(true); setOrderSuccess(false); }}
                className="w-full py-4 bg-primary text-white font-bold tracking-[0.2em] uppercase rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                Checkout <ArrowRight size={18} />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck size={16} className="text-primary" />
                <span>Secure Checkout powered by Jujutsu High</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Checkout Modal ── */}
      {isCheckoutModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setIsCheckoutModalOpen(false); }}
        >
          <div className="bg-surface border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-border shrink-0">
              <h3 className="font-cinzel text-xl font-bold tracking-widest text-foreground">ORDER DETAILS</h3>
              <button onClick={() => setIsCheckoutModalOpen(false)} aria-label="Close" className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={22} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1">
              {orderSuccess ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                    <ShieldCheck size={36} className="text-primary" />
                  </div>
                  <h4 className="font-cinzel text-2xl font-bold text-foreground">Order Confirmed!</h4>
                  <p className="text-muted-foreground text-sm max-w-xs">Your order has been logged. We will contact you shortly on the phone number provided.</p>
                  <button
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="mt-4 px-8 py-3 bg-primary text-white font-bold tracking-widest uppercase rounded-lg hover:bg-accent transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form id="checkout-form" onSubmit={handleConfirmOrder} className="p-6 space-y-5">

                  {/* Full Name */}
                  <div>
                    <label htmlFor="checkout-name" className="block text-sm font-medium text-muted-foreground mb-1">
                      Full Name <span className="opacity-60 font-normal">(الاسم الكامل)</span>
                    </label>
                    <input
                      id="checkout-name"
                      name="fullName"
                      type="text"
                      required
                      placeholder="e.g. Satoru Gojo"
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="checkout-email" className="block text-sm font-medium text-muted-foreground mb-1">
                      Email <span className="opacity-60 font-normal">(البريد الإلكتروني)</span>
                    </label>
                    <input
                      id="checkout-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="checkout-phone" className="block text-sm font-medium text-muted-foreground mb-1">
                      Phone <span className="opacity-60 font-normal">(رقم الهاتف)</span> <span className="text-primary">*</span>
                    </label>
                    <input
                      id="checkout-phone"
                      name="phone"
                      type="tel"
                      required
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="05XX XX XX XX"
                      onChange={handlePhoneInput}
                      pattern="0[5-7][0-9]{8}"
                      title="Must be 10 digits starting with 05, 06, or 07"
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                    />
                    {phoneError && <p className="text-xs text-red-400 mt-1">{phoneError}</p>}
                  </div>

                  {/* Wilaya */}
                  <div>
                    <label htmlFor="checkout-wilaya" className="block text-sm font-medium text-muted-foreground mb-1">
                      Wilaya <span className="opacity-60 font-normal">(الولاية)</span>
                    </label>
                    <input
                      id="checkout-wilaya"
                      name="wilaya"
                      type="text"
                      required
                      list="wilaya-list"
                      value={wilayaSearch}
                      onChange={handleWilayaInputChange}
                      placeholder="Type name or number (e.g. Alger or 16)"
                      autoComplete="off"
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                    />
                    <datalist id="wilaya-list">
                      {filteredWilayas.map(w => (
                        <option key={w.code} value={`${w.code} - ${w.name}`} />
                      ))}
                    </datalist>
                    {wilayaSearch && !selectedWilaya && (
                      <p className="text-xs text-amber-400 mt-1">Select a wilaya from the suggestions</p>
                    )}
                  </div>

                  {/* Delivery Type */}
                  <div>
                    <p className="block text-sm font-medium text-muted-foreground mb-3">
                      Delivery Type <span className="opacity-60 font-normal">(نوع التوصيل)</span>
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Home */}
                      <label
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          deliveryType === "home"
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-background text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryType"
                          value="home"
                          checked={deliveryType === "home"}
                          onChange={() => setDeliveryType("home")}
                          className="sr-only"
                        />
                        <Home size={20} className={deliveryType === "home" ? "text-primary" : ""} />
                        <div>
                          <p className="font-bold text-sm">Home Delivery</p>
                          <p className="text-xs opacity-60">توصيل للمنزل</p>
                          {selectedWilaya && (
                            <p className="text-xs font-black text-primary mt-0.5">
                              {calcShipping(selectedWilaya, "home").toLocaleString()} DZD
                            </p>
                          )}
                        </div>
                      </label>

                      {/* Office/Desk */}
                      <label
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          deliveryType === "desk"
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-background text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryType"
                          value="desk"
                          checked={deliveryType === "desk"}
                          onChange={() => setDeliveryType("desk")}
                          className="sr-only"
                        />
                        <Building2 size={20} className={deliveryType === "desk" ? "text-primary" : ""} />
                        <div>
                          <p className="font-bold text-sm">Office Pick-up</p>
                          <p className="text-xs opacity-60">سحب من المكتب</p>
                          {selectedWilaya && (
                            <p className="text-xs font-black text-primary mt-0.5">
                              {calcShipping(selectedWilaya, "desk").toLocaleString()} DZD
                            </p>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="checkout-address" className="block text-sm font-medium text-muted-foreground mb-1">
                      Detailed Address <span className="opacity-60 font-normal">(العنوان بالتفصيل)</span>
                    </label>
                    <textarea
                      id="checkout-address"
                      name="address"
                      required
                      rows={2}
                      placeholder="Building, Street, Area..."
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  {/* Dynamic Order Summary */}
                  <div className="bg-muted/10 border border-border/50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{subtotal.toLocaleString()} DZD</span>
                    </div>
                    <div className="flex justify-between text-sm pb-2 border-b border-border/40">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {selectedWilaya ? `${shippingCost.toLocaleString()} DZD` : <span className="text-muted-foreground/50 italic text-xs">Select Wilaya</span>}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="font-cinzel font-black text-2xl text-primary">
                        {(subtotal + shippingCost).toLocaleString()} <span className="text-xs font-sans text-muted-foreground">DZD</span>
                      </span>
                    </div>
                  </div>

                  {/* Submit */}
                  {submitError && (
                    <p className="text-xs text-red-400 text-center -mb-2">{submitError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-primary text-white font-bold tracking-[0.15em] uppercase rounded-lg hover:bg-accent active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    {isSubmitting ? "جاري التأكيد... / Processing..." : "تأكيد الطلبية / Confirm Order"}
                  </button>

                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
