import { Link } from "react-router-dom";

const sizeRows = [
  { size: "XS", chest: "32–34", waist: "26–28", hips: "33–35" },
  { size: "S", chest: "34–36", waist: "28–30", hips: "35–37" },
  { size: "M", chest: "36–39", waist: "30–33", hips: "37–40" },
  { size: "L", chest: "39–42", waist: "33–36", hips: "40–43" },
  { size: "XL", chest: "42–45", waist: "36–39", hips: "43–46" },
  { size: "XXL", chest: "45–48", waist: "39–42", hips: "46–49" },
];

export default function SizeGuide() {
  return (
    <main className="min-h-screen bg-white pt-[60px] lg:pt-[72px]">

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-12 py-16 lg:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-cool-gray">
            SELA
          </p>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl text-rich-black mt-4">
            Size Guide
          </h1>

          <p className="font-body text-sm sm:text-base text-cool-gray mt-6 max-w-xl leading-7">
            Find your best fit with our simple measurement guide, designed for
            every body and every kind of movement.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-12 py-12 lg:py-20">
        <div className="max-w-5xl mx-auto">

          {/* How to Measure */}
          <div className="mb-20">
            <div className="max-w-2xl mb-10">
              <p className="font-body text-xs uppercase tracking-[0.2em] text-cool-gray">
                How to measure
              </p>

              <h2 className="font-display text-4xl sm:text-5xl text-rich-black mt-3">
                Get the right fit.
              </h2>

              <p className="font-body text-sm text-cool-gray leading-7 mt-4">
                Use a soft measuring tape and keep it comfortably snug without
                pulling it tight.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Chest */}
              <div className="border-t border-rich-black pt-5">
                <span className="font-display text-3xl">
                  01
                </span>

                <h3 className="font-display text-2xl mt-4">
                  Chest
                </h3>

                <p className="font-body text-sm text-cool-gray leading-6 mt-3">
                  Measure around the fullest part of your chest, keeping the
                  measuring tape level across your back.
                </p>
              </div>

              {/* Waist */}
              <div className="border-t border-rich-black pt-5">
                <span className="font-display text-3xl">
                  02
                </span>

                <h3 className="font-display text-2xl mt-4">
                  Waist
                </h3>

                <p className="font-body text-sm text-cool-gray leading-6 mt-3">
                  Measure around the narrowest part of your natural waist,
                  keeping the tape comfortably snug.
                </p>
              </div>

              {/* Hips */}
              <div className="border-t border-rich-black pt-5">
                <span className="font-display text-3xl">
                  03
                </span>

                <h3 className="font-display text-2xl mt-4">
                  Hips
                </h3>

                <p className="font-body text-sm text-cool-gray leading-6 mt-3">
                  Measure around the fullest part of your hips and seat,
                  keeping the tape level.
                </p>
              </div>

            </div>
          </div>

          {/* Size Chart */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">

              <div>
                <p className="font-body text-xs uppercase tracking-[0.2em] text-cool-gray">
                  Unisex sizing
                </p>

                <h2 className="font-display text-4xl sm:text-5xl text-rich-black mt-2">
                  Find your size
                </h2>
              </div>

              <p className="font-body text-xs text-cool-gray">
                Measurements in inches
              </p>

            </div>

            <div className="overflow-x-auto border-t border-b border-gray-200">
              <table className="w-full min-w-[600px] border-collapse">

                <thead>
                  <tr className="border-b border-gray-200">

                    <th className="px-5 py-5 text-left font-body text-xs uppercase tracking-[0.12em] text-cool-gray font-medium">
                      Size
                    </th>

                    <th className="px-5 py-5 text-left font-body text-xs uppercase tracking-[0.12em] text-cool-gray font-medium">
                      Chest
                    </th>

                    <th className="px-5 py-5 text-left font-body text-xs uppercase tracking-[0.12em] text-cool-gray font-medium">
                      Waist
                    </th>

                    <th className="px-5 py-5 text-left font-body text-xs uppercase tracking-[0.12em] text-cool-gray font-medium">
                      Hips
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {sizeRows.map((row) => (
                    <tr
                      key={row.size}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                    >

                      <td className="px-5 py-5 font-body text-sm font-semibold text-rich-black">
                        {row.size}
                      </td>

                      <td className="px-5 py-5 font-body text-sm text-cool-gray">
                        {row.chest}"
                      </td>

                      <td className="px-5 py-5 font-body text-sm text-cool-gray">
                        {row.waist}"
                      </td>

                      <td className="px-5 py-5 font-body text-sm text-cool-gray">
                        {row.hips}"
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>

          {/* Fit Advice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">

            {/* Between Sizes */}
            <div className="bg-gray-50 p-7 sm:p-9">

              <p className="font-body text-xs uppercase tracking-[0.15em] text-cool-gray">
                Between sizes?
              </p>

              <h3 className="font-display text-3xl text-rich-black mt-3">
                Choose based on your fit.
              </h3>

              <p className="font-body text-sm text-cool-gray leading-7 mt-4">
                Prefer a more fitted feel? Consider sizing down. If you prefer
                a little more room and a relaxed fit, choose the larger size.
              </p>

            </div>

            {/* Need Help */}
            <div className="bg-rich-black text-white p-7 sm:p-9">

              <p className="font-body text-xs uppercase tracking-[0.15em] text-white/50">
                Still unsure?
              </p>

              <h3 className="font-display text-3xl mt-3">
                We're here to help.
              </h3>

              <p className="font-body text-sm text-white/60 leading-7 mt-4">
                If you're unsure about your size or how a particular piece
                fits, reach out to our customer care team before placing your
                order.
              </p>

              <Link
                to="/contact"
                className="inline-flex mt-6 border-b border-white pb-1 font-body text-xs uppercase tracking-[0.15em] hover:text-gold hover:border-gold transition-colors"
              >
                Contact Us
              </Link>

            </div>

          </div>

          {/* Fit Note */}
          <div className="mt-16 pt-8 border-t border-gray-100">

            <p className="font-body text-xs text-cool-gray leading-6 max-w-2xl">
              Our size guide is intended as a general reference. Fit may vary
              slightly depending on the style, fabric and intended silhouette
              of each garment.
            </p>

          </div>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gray-50 px-4 sm:px-6 lg:px-12 py-16 lg:py-20">

        <div className="max-w-4xl mx-auto text-center">

          <p className="font-body text-xs uppercase tracking-[0.2em] text-cool-gray">
            Find your fit
          </p>

          <h2 className="font-display text-4xl sm:text-5xl text-rich-black mt-3">
            Ready to move?
          </h2>

          <p className="font-body text-sm text-cool-gray max-w-xl mx-auto mt-4 leading-7">
            Explore the SELA collection and find pieces built for movement,
            comfort and confidence.
          </p>

          <Link
            to="/shop"
            className="inline-flex mt-7 bg-rich-black text-white px-8 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.15em] hover:bg-gold transition-colors"
          >
            Shop SELA
          </Link>

        </div>

      </section>

    </main>
  );
}