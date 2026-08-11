import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const faqGroups = [
  {
    title: "Orders",
    questions: [
      {
        question: "How do I place an order?",
        answer:
          "Browse the SELA collection, select the product and options you want, add it to your cart, and proceed to checkout. Follow the checkout steps to complete your order.",
      },
      {
        question: "Can I change or cancel my order?",
        answer:
          "If you need to make a change or cancel your order, contact us as soon as possible. Once an order has entered processing or been shipped, changes may no longer be possible.",
      },
      {
        question: "How will I know if my order was successful?",
        answer:
          "After completing checkout, you should receive an order confirmation. If you do not receive one, please contact our customer care team with the details used during checkout.",
      },
      {
        question: "Can I track my order?",
        answer:
          "Yes. Once your order has been shipped, tracking information will be provided when available. You can also use our Track Order page to check your order status.",
      },
    ],
  },
  {
    title: "Products & Sizing",
    questions: [
      {
        question: "Is SELA a unisex brand?",
        answer:
          "Yes. SELA is a unisex athleisure brand created for everyone. Our collections are designed around movement, comfort, performance and everyday style.",
      },
      {
        question: "How do I choose the right size?",
        answer:
          "Use our Size Guide to compare your measurements with our sizing chart. If you are between sizes, choose the smaller size for a more fitted feel or the larger size for a more relaxed fit.",
      },
      {
        question: "Will every product fit the same?",
        answer:
          "Not necessarily. Fit can vary depending on the garment, fabric and intended silhouette. Product descriptions may provide additional information about how a particular piece fits.",
      },
      {
        question: "What if my size is out of stock?",
        answer:
          "If your preferred size is unavailable, check back later as stock may be replenished. You can also contact us to ask about upcoming availability.",
      },
    ],
  },
  {
    title: "Shipping",
    questions: [
      {
        question: "Where does SELA ship?",
        answer:
          "SELA ships to available locations shown during checkout. Shipping availability and delivery options may vary depending on your location.",
      },
      {
        question: "How long does delivery take?",
        answer:
          "Delivery times depend on your location, shipping method and order processing time. Your available delivery options and estimated timing will be shown during checkout.",
      },
      {
        question: "How much does shipping cost?",
        answer:
          "Shipping costs depend on your delivery location and selected shipping method. The applicable shipping fee will be displayed before you complete your order.",
      },
      {
        question: "What happens if my package is delayed?",
        answer:
          "If your order is taking longer than expected, first check the tracking information provided. If you still need assistance, contact our customer care team and we'll help you look into it.",
      },
    ],
  },
  {
    title: "Returns & Exchanges",
    questions: [
      {
        question: "Can I return an item?",
        answer:
          "Eligible items may be returned in accordance with our Returns & Exchanges policy. Items should generally be unworn, unused and in their original condition.",
      },
      {
        question: "Can I exchange an item for another size?",
        answer:
          "Where available, eligible items may be exchanged for another size. Contact customer care before sending an item back so we can guide you through the process.",
      },
      {
        question: "How long do I have to make a return?",
        answer:
          "Please refer to our Returns & Exchanges policy for the applicable return window and conditions.",
      },
      {
        question: "Can I return an item that I have worn?",
        answer:
          "Returned items should be unworn, unused and in resalable condition unless the item is being returned because of a confirmed product defect.",
      },
    ],
  },
  {
    title: "Payments",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer:
          "Available payment methods are displayed during checkout. Your options may vary depending on your location.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Payments are processed through our payment provider using secure payment infrastructure. SELA does not need to store your full card details to process your order.",
      },
      {
        question: "My payment went through but I didn't receive an order confirmation. What should I do?",
        answer:
          "Do not immediately place another order. Check your email and order history first, then contact customer care with your payment details so we can verify the transaction.",
      },
    ],
  },
];

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-6 py-6 text-left"
        aria-expanded={open}
      >
        <span className="font-body text-sm sm:text-base font-medium text-rich-black">
          {question}
        </span>

        <span
          className={`shrink-0 flex h-8 w-8 items-center justify-center border border-gray-200 transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        >
          <Plus className="h-4 w-4 text-rich-black" />
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ${
          open
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="font-body text-sm text-cool-gray leading-7 max-w-3xl pb-6 pr-12">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQs() {
  return (
    <main className="min-h-screen bg-white pt-[60px] lg:pt-[72px]">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-12 py-16 lg:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-cool-gray">
            SELA
          </p>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl text-rich-black mt-4">
            FAQs
          </h1>

          <p className="font-body text-sm sm:text-base text-cool-gray mt-6 max-w-xl leading-7">
            Everything you need to know about shopping, sizing, shipping,
            returns and your SELA order.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="px-4 sm:px-6 lg:px-12 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {faqGroups.map((group) => (
            <section key={group.title} className="mb-16 last:mb-0">
              <div className="mb-5">
                <p className="font-body text-xs uppercase tracking-[0.2em] text-cool-gray">
                  {group.title}
                </p>
              </div>

              <div className="border-t border-rich-black">
                {group.questions.map((faq) => (
                  <FAQItem
                    key={faq.question}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-rich-black text-white px-4 sm:px-6 lg:px-12 py-20 lg:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-white/50">
            Still need help?
          </p>

          <h2 className="font-display text-4xl sm:text-5xl mt-4">
            We've got you.
          </h2>

          <p className="font-body text-sm text-white/60 max-w-xl mx-auto mt-5 leading-7">
            Can't find the answer you're looking for? Get in touch with our
            customer care team and we'll be happy to help.
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