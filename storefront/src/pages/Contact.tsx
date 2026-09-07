import { type FormEvent, useState } from "react";
import { api } from "../lib/api";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSending(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    try {
      await api.submitContact({
        name,
        email,
        message,
      });

      setSubmitted(true);
      form.reset();
    } catch (err: any) {
      console.error("Contact form error:", err);

      setError(
        err?.message || "Something went wrong. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pt-[60px] lg:pt-[72px]">

      {/* Header */}
      <section className="border-b border-gray-100 px-4 py-16 sm:px-6 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <h1 className="mt-4 font-display text-5xl text-rich-black sm:text-6xl lg:text-8xl">
            Contact
          </h1>

          <p className="mt-6 max-w-xl font-body text-sm leading-7 text-cool-gray sm:text-base">
            Have a question about an order, product, or anything else?
            We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="px-4 py-12 sm:px-6 lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Info */}
          <div>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-cool-gray">
              Get in touch
            </p>

            <h2 className="mt-4 font-display text-4xl text-rich-black sm:text-5xl">
              We&apos;re here to help.
            </h2>

            <div className="mt-10 space-y-6 font-body text-sm">

              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-cool-gray">
                  Email
                </p>

                <a
                  href="mailto:selaathleisure@gmail.com"
                  className="mt-2 inline-block text-rich-black hover:text-gold"
                >
                  selaathleisure@gmail.com
                </a>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-cool-gray">
                  Instagram
                </p>

                <a
                  href="#"
                  className="mt-2 inline-block text-rich-black hover:text-gold"
                >
                  @selaathleisure
                </a>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-cool-gray">
                  Response time
                </p>

                <p className="mt-2 text-cool-gray">
                  We&apos;ll get back to you as soon as possible.
                </p>
              </div>

            </div>
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <div className="border border-gray-200 p-8">
                <h3 className="font-display text-3xl text-rich-black">
                  Message sent.
                </h3>

                <p className="mt-3 font-body text-sm leading-6 text-cool-gray">
                  Thanks for reaching out. We&apos;ve received your
                  message and will get back to you soon.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setError("");
                  }}
                  className="mt-6 border border-rich-black px-6 py-3 font-body text-xs font-semibold uppercase tracking-[0.15em] text-rich-black transition-colors hover:bg-rich-black hover:text-white"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Error */}
                {error && (
                  <div className="border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="name"
                    className="font-body text-xs uppercase tracking-[0.12em] text-rich-black"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    disabled={sending}
                    className="mt-2 w-full border border-gray-200 px-4 py-3 font-body text-sm outline-none transition-colors focus:border-rich-black disabled:bg-gray-50"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="font-body text-xs uppercase tracking-[0.12em] text-rich-black"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    disabled={sending}
                    className="mt-2 w-full border border-gray-200 px-4 py-3 font-body text-sm outline-none transition-colors focus:border-rich-black disabled:bg-gray-50"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="font-body text-xs uppercase tracking-[0.12em] text-rich-black"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    disabled={sending}
                    className="mt-2 w-full resize-none border border-gray-200 px-4 py-3 font-body text-sm outline-none transition-colors focus:border-rich-black disabled:bg-gray-50"
                    placeholder="How can we help?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-rich-black px-6 py-4 font-body text-xs font-semibold uppercase tracking-[0.15em] text-black transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>

              </form>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}
