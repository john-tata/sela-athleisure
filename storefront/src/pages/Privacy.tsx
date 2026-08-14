import { Link } from "react-router-dom";

export default function Privacy() {
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
            Privacy Policy
          </h1>

          <p className="mt-5 text-sm text-neutral-500">
            Last updated: August 2026
          </p>
        </div>

        <div className="mt-12 space-y-10 text-sm leading-7 text-neutral-700">
          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              1. Introduction
            </h2>
            <p>
              SELA Athleisure ("SELA", "we", "our", or "us") respects your
              privacy and is committed to protecting the personal information
              you provide when using our website and purchasing our products.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              2. Information We Collect
            </h2>
            <p>We may collect information including:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Your name and email address.</li>
              <li>Your phone number when provided.</li>
              <li>Shipping and billing information.</li>
              <li>Order and transaction information.</li>
              <li>Information you provide when contacting us.</li>
              <li>Technical information necessary for the operation of the website.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              3. How We Use Your Information
            </h2>
            <p>
              We use your information to process and deliver orders, provide
              customer support, communicate with you about your purchases,
              maintain your account, improve our website, prevent fraudulent
              activity, and comply with applicable legal obligations.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              4. Payments
            </h2>
            <p>
              Payments made through our website may be processed by
              third-party payment providers such as Paystack. Payment
              information is handled according to the applicable payment
              provider's privacy and security practices. SELA does not
              intentionally store your full card details.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              5. Sharing Information
            </h2>
            <p>
              We may share necessary information with trusted service
              providers that help us operate our store, process payments,
              deliver orders, provide technical services, or comply with
              legal requirements. We do not sell your personal information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              6. Data Security
            </h2>
            <p>
              We take reasonable technical and organizational measures to
              protect your information. However, no method of transmission or
              storage over the internet can be guaranteed to be completely
              secure.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              7. Your Choices
            </h2>
            <p>
              You may contact us to request access to, correction of, or
              deletion of personal information that we hold about you,
              subject to applicable legal requirements.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              8. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy or how your
              information is handled, please contact SELA through our{" "}
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