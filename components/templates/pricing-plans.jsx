import React from "react";
import { FiCheck } from "react-icons/fi";

const PricingPage = () => {
  const pricingPlans = [
    {
      name: "Basic Plan",
      price: "$29",
      description: "Perfect for individuals and small teams.",
      features: [
        "Up to 10 hours of transcription per month",
        "Basic analytics and insights",
        "Email support",
        "Standard API access",
        "Mobile app access"
      ],
      buttonText: "Get Started",
      isPopular: false
    },
    {
      name: "Standard Plan",
      price: "$99",
      description: "Ideal for growing businesses.",
      features: [
        "Up to 50 hours of transcription per month",
        "Advanced analytics and insights",
        "Priority email and chat support",
        "Full API access",
        "Team collaboration features",
        "Custom vocabulary",
        "Enhanced security features"
      ],
      buttonText: "Try Standard",
      isPopular: true
    },
    {
      name: "Professional Plan",
      price: "Custom",
      description: "For large organizations with specific needs.",
      features: [
        "Unlimited transcription hours",
        "Custom analytics and reporting",
        "24/7 dedicated support",
        "Custom API solutions",
        "Advanced team management",
        "Custom integrations",
        "Enterprise-grade security",
        "Service level agreement"
      ],
      buttonText: "Contact Sales",
      isPopular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Choose the plan that's right for you
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Simple, transparent pricing with no hidden fees
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-6">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105 ${plan.isPopular ? "border-2 border-blue-500" : "border border-gray-200"} bg-white`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="ml-1 text-xl text-gray-500">/month</span>}
                </div>
                <p className="mt-4 text-lg text-gray-600">{plan.description}</p>

                <button
                  className={`mt-6 w-full rounded-lg px-4 py-3 text-lg font-semibold text-white transition-colors duration-300 ${plan.isPopular ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-800 hover:bg-gray-900"}`}
                >
                  {plan.buttonText}
                </button>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <FiCheck className="flex-shrink-0 w-5 h-5 text-green-500 mt-1" />
                      <span className="ml-3 text-base text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;