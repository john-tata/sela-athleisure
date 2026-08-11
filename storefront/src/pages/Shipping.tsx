import { Link } from "react-router-dom";
import {
  MapPin,
  Clock3,
  Package,
  Truck,
  AlertCircle,
} from "lucide-react";

const shippingSections = [
  {
    icon: MapPin,
    title: "Where We Ship",
    content:
      "SELA currently ships to available locations within Nigeria. Delivery availability and options are confirmed during checkout based on your delivery address.",
  },
  {
    icon: Clock3,
    title: "Order Processing",
    content:
      "Orders are processed after payment has been successfully confirmed. Processing time may vary depending on order volume, product availability and the time your order is placed.",
  },
  {
    icon: Truck,
    title: "Delivery Times",
    content:
      "Delivery times depend on your location and the shipping option available at checkout. Estimated delivery information will be provided when you place your order.",
  },
  {
    icon: Package,
    title: "Shipping Costs",
    content:
      "Shipping fees are calculated based on your delivery location and the available delivery option. The applicable fee will be displayed at checkout before you complete your purchase.",
  },
];

const importantNotes = [
  "Please make sure your delivery address and contact information are correct before completing your order.",
  "Someone should be available to receive the package at the delivery address provided.",
  "Delivery times are estimates and may be affected by weekends, public holidays, weather or circumstances outside our control.",
  "If your order contains multiple items, they may be delivered together or separately depending on availability and fulfilment.",
  "Once an order has been dispatched, use the tracking information provided to follow its progress.",
];

export default function Shipping() {
  return (
    <main className="min-h-screen bg-white pt-[60px] lg:pt-[72px]">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-12 py-16 lg:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-cool-gray">
            SELA
          </p>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl text-rich-black mt-4">
            Shipping
          </h1>

          <p className="font-body text-sm sm:text-base text-cool-gray mt-6 max-w-xl leading-7">
            Everything you need to know about getting your SELA order from us
            to you.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="px-4 sm:px-6 lg:px-12 py-14 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-200 border border-gray-200">
            {shippingSections.map((section) => {
              const Icon = section.icon;

              return (
                <div
                  key={section.title}
                  className="bg-white p-7 sm:p-8 lg:p-10"
                >
                  <div className="flex h-11 w-11 items-center justify-center bg-rich-black text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h2 className="font-display text-2xl mt-6 text-rich-black">
                    {section.title}
                  </h2>

                  <p className="font-body text-sm text-cool-gray leading-7 mt-3">
                    {section.content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Delivery Information */}
      <section className="bg-neutral-50 px-4 sm:px-6 lg:px-12 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-cool-gray">
            Delivery
          </p>

          <h2 className="font-display text-4xl sm:text-5xl text-rich-black mt-3">
            Before your order arrives
          </h2>

          <div className="mt-10 space-y-5">
            {importantNotes.map((note, index) => (
              <div key={index} className="flex gap-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rich-black text-white font-body text-xs">
                  {index + 1}
                </span>

                <p className="font-body text-sm text-cool-gray leading-7">
                  {note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delays */}
      <section className="px-4 sm:px-6 lg:px-12 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto border border-gray-200 p-7 sm:p-9">
          <div className="flex gap-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-rich-black mt-1" />

            <div>
              <h2 className="font-display text-2xl text-rich-black">
                Delayed deliveries
              </h2>

              <p className="font-body text-sm text-cool-gray leading-7 mt-3">
                While we work with our delivery partners to get your order to
                you as quickly as possible, delays can occasionally happen. If
                your order has gone beyond the estimated delivery period,
                please check your tracking information or contact us for
                assistance.
              </p>

              <Link
                to="/track-order"
                className="inline-flex mt-5 font-body text-xs font-semibold uppercase tracking-[0.15em] text-rich-black border-b border-rich-black pb-1 hover:text-gold hover:border-gold transition-colors"
              >
                Track Your Order
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-rich-black text-white px-4 sm:px-6 lg:px-12 py-20 lg:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-white/50">
            Need help?
          </p>

          <h2 className="font-display text-4xl sm:text-5xl mt-4">
            We're here for you.
          </h2>

          <p className="font-body text-sm text-white/60 max-w-xl mx-auto mt-5 leading-7">
            Have a question about your delivery or order? Our customer care
            team is happy to help.
          </p>

          <Link
            to="/contact"
            className="inline-flex mt-8 bg-white text-rich-black px-8 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.15em] hover:bg-gold hover:text-white transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}