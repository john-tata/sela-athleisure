import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <main className="min-h-screen bg-white pt-[110px] pb-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="text-xs uppercase tracking-[0.15em] text-neutral-500 hover:text-black transition-colors"
        >
          ← Back to SELA
        </Link>

        <div className="mt-10">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-3">
            Legal
          </p>

          <h1 className="font-display text-5xl sm:text-6xl text-rich-black">
            Terms of Service
          </h1>

          <p className="mt-5 text-sm text-neutral-500">
            Last updated: August 2026
          </p>
        </div>

        <div className="mt-12 space-y-10 text-sm leading-7 text-neutral-700">
          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              1. Agreement
            </h2>
            <p>
              By accessing or using the SELA website, you agree to these Terms
              of Service. If you do not agree with these terms, please do not
              use the website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              2. Products and Availability
            </h2>
            <p>
              We make reasonable efforts to ensure that product descriptions,
              images, prices, sizes, and availability are accurate. Products
              may become unavailable without notice, and we reserve the right
              to limit quantities or discontinue products.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              3. Orders
            </h2>
            <p>
              Placing an order constitutes a request to purchase the selected
              products. We reserve the right to accept, reject, or cancel an
              order where necessary, including where there is an obvious
              pricing error, stock issue, suspected fraud, or other
              circumstance that prevents fulfillment.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              4. Pricing and Payment
            </h2>
            <p>
              Prices displayed on the website are shown in Nigerian Naira
              unless otherwise stated. Applicable delivery charges are
              displayed during checkout. Payments are processed securely
              through our designated payment provider.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              5. Shipping
            </h2>
            <p>
              Delivery charges and applicable free-shipping thresholds are
              calculated based on the delivery location and order subtotal.
              Delivery times may vary depending on location, availability,
              courier operations, and circumstances outside our control.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              6. Returns and Refunds
            </h2>
            <p>
              Returns, exchanges, and refunds are subject to SELA's applicable
              return policy and the condition of the product. Customers should
              contact us as soon as possible regarding damaged, incorrect, or
              defective items.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              7. Website Use
            </h2>
            <p>
              You agree not to misuse the website, interfere with its
              operation, attempt unauthorized access, introduce malicious
              software, or use the website for fraudulent or unlawful
              activities.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              8. Intellectual Property
            </h2>
            <p>
              Unless otherwise stated, SELA's website content, branding,
              logos, images, text, graphics, and other materials belong to
              SELA or its licensors and may not be reproduced or used without
              appropriate permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              9. Changes to These Terms
            </h2>
            <p>
              We may update these Terms of Service from time to time. Updated
              terms will be published on this page with a revised date.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              10. Contact
            </h2>
            <p>
              Questions about these terms can be directed to us through our{" "}
              <Link to="/contact" className="underline hover:text-black">
                Contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}