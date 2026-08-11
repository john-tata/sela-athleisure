import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="min-h-screen bg-white pt-[60px] lg:pt-[72px]">

      {/* HERO */}
      <section className="px-4 sm:px-6 lg:px-12 py-16 lg:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-cool-gray">
            SELA
          </p>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl text-rich-black mt-4">
            About SELA
          </h1>

          <p className="font-body text-sm sm:text-base text-cool-gray mt-6 max-w-2xl leading-7">
            SELA is built around movement, confidence and everyday performance.
            We create pieces designed to move with you, from training sessions
            to everything that happens after.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section className="px-4 sm:px-6 lg:px-12 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <div className="aspect-[4/5] overflow-hidden bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=85"
              alt="SELA movement"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-cool-gray">
              Our story
            </p>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-rich-black mt-4">
              Made to move.
            </h2>

            <div className="mt-6 space-y-5 font-body text-sm leading-7 text-cool-gray max-w-xl">
              <p>
                SELA was created with a simple idea: activewear should feel
                just as good as it looks.
              </p>

              <p>
                From technical training pieces to everyday essentials, every
                part of the collection is designed around comfort, confidence
                and movement.
              </p>

              <p>
                We believe what you wear should never get in the way of what
                you want to do.
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex mt-8 bg-rich-black text-white px-8 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.15em] hover:bg-gold transition-colors"
            >
              Shop SELA
            </Link>
          </div>

        </div>
      </section>

      {/* VALUES */}
      <section className="bg-rich-black text-white px-4 sm:px-6 lg:px-12 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">

          <div className="max-w-2xl">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-white/50">
              What we stand for
            </p>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-4">
              Performance. Confidence. Simplicity.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">

            <div>
              <h3 className="font-display text-2xl">
                Performance
              </h3>
              <p className="font-body text-sm text-white/60 leading-7 mt-4">
                Designed to support you through training, movement and the
                moments that push you further.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl">
                Confidence
              </h3>
              <p className="font-body text-sm text-white/60 leading-7 mt-4">
                Pieces that help you feel comfortable, strong and confident
                wherever you wear them.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl">
                Simplicity
              </h3>
              <p className="font-body text-sm text-white/60 leading-7 mt-4">
                Clean silhouettes and versatile pieces made to fit naturally
                into your everyday routine.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-12 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto text-center">

          <p className="font-body text-xs uppercase tracking-[0.2em] text-cool-gray">
            Discover SELA
          </p>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-rich-black mt-4">
            Built for movement.
          </h2>

          <p className="font-body text-sm text-cool-gray max-w-xl mx-auto mt-5 leading-7">
            Explore the collection and find pieces made to move with you.
          </p>

          <Link
            to="/shop"
            className="inline-flex mt-8 bg-rich-black text-white px-8 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.15em] hover:bg-gold transition-colors"
          >
            Shop All Products
          </Link>

        </div>
      </section>

    </main>
  );
}