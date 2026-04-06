"use client";

import { useState } from "react";
import { Send, MapPin, Mail, MessageSquare, Camera } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Order Inquiry",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://formspree.io/f/mzdkobkp", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          subject: "Order Inquiry",
          message: ""
        });
      } else {
        const data = await response.json();
        alert(data.error || "Communication failed. Please try again.");
      }
    } catch (error) {
      alert("Cursed energy interference detected. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-24 relative overflow-hidden">
      {/* Subtle Cursed Particles using CSS */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full shadow-[0_0_20px_var(--primary)] animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-accent rounded-full shadow-[0_0_20px_var(--accent)] animate-bounce" />
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white] animate-ping" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h1 className="font-cinzel text-5xl font-bold tracking-widest text-foreground mb-4">
            TRANSMIT A MESSAGE
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Need support with an artifact? Awaiting your shipment? Send a resonance beacon down below.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">

          {/* Contact Details */}
          <div className="w-full lg:w-1/3 space-y-10">
            <div>
              <h3 className="font-cinzel text-2xl font-bold text-foreground mb-6 border-b border-border pb-4">
                COMMUNICATIONS
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center flex-shrink-0 text-primary">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-1">Electronic Mail</p>
                    <p className="text-foreground font-medium underline underline-offset-4 decoration-primary/30 tracking-wide">limitlessstore.service@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center flex-shrink-0 text-primary">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-1">Headquarters</p>
                    <p className="text-foreground font-medium">Bordj El Kiffan,<br />Algiers, Algeria</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-cinzel text-2xl font-bold text-foreground mb-6 border-b border-border pb-4">
                NETWORK
              </h3>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all">
                  <Camera size={20} />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all">
                  <MessageSquare size={20} />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all flex-shrink-0">
                  <span className="font-bold font-cinzel">X</span>
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="w-full lg:w-2/3 bg-surface/50 border border-border p-8 md:p-12 rounded-3xl shadow-2xl backdrop-blur-sm">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 min-h-[400px]">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-6">
                  <Send size={40} />
                </div>
                <h2 className="font-cinzel text-3xl font-bold text-foreground mb-4 tracking-widest">
                  BEACON RECEIVED
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your message has been successfully transmitted to our sorcerers. We will resonate back shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 px-8 py-3 border border-border text-foreground hover:border-primary hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground ml-1">Full Name</label>
                    <input
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg py-4 px-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="e.g. Megumi Fushiguro"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground ml-1">Email Address</label>
                    <input
                      name="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg py-4 px-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="sorcerer@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground ml-1">Subject Matter</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg py-4 px-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
                  >
                    <option>Order Inquiry</option>
                    <option>Return / Exchange</option>
                    <option>Manga Translators Collab</option>
                    <option>General Support</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground ml-1">The Message</label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg py-4 px-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                    placeholder="Declare your domain..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-primary text-white font-bold tracking-[0.2em] uppercase rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20 outline-none disabled:opacity-70"
                >
                  {loading ? "Transmitting..." : (
                    <>
                      <Send size={18} />
                      Transmit Signal
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
