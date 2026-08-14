import { Link } from "react-router-dom";

export default function Cookies() {
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
            Cookie Policy
          </h1>

          <p className="mt-5 text-sm text-neutral-500">
            Last updated: August 2026
          </p>
        </div>

        <div className="mt-12 space-y-10 text-sm leading-7 text-neutral-700">
          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              1. What Are Cookies?
            </h2>
            <p>
              Cookies are small pieces of information stored on your device
              when you visit a website. They help websites remember
              information and provide a smoother experience.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              2. How SELA Uses Cookies and Local Storage
            </h2>
            <p>
              SELA may use cookies and browser storage technologies to keep the
              website functioning correctly and remember information between
              visits.
            </p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Remembering shopping cart information.</li>
              <li>Maintaining login and authentication sessions.</li>
              <li>Remembering certain website preferences.</li>
              <li>Helping protect accounts and website functionality.</li>
              <li>Understanding basic website usage and performance.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              3. Essential Technologies
            </h2>
            <p>
              Some browser storage technologies are necessary for core
              functionality such as authentication, shopping carts, checkout,
              and security. Disabling these technologies may prevent parts of
              the website from working correctly.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              4. Third-Party Services
            </h2>
            <p>
              Some services used by SELA, including payment and hosting
              providers, may use their own cookies or similar technologies.
              Their use of such technologies is governed by their respective
              privacy policies and terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              5. Managing Cookies
            </h2>
            <p>
              Most web browsers allow you to control or delete cookies through
              their settings. Keep in mind that disabling certain cookies or
              browser storage may affect your ability to use features such as
              login, cart functionality, and checkout.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              6. Changes to This Policy
            </h2>
            <p>
              We may update this Cookie Policy when our website, services, or
              technology changes. Any updates will be published on this page.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-black mb-3">
              7. Contact
            </h2>
            <p>
              If you have questions about our use of cookies or browser
              storage, please contact us through our{" "}
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