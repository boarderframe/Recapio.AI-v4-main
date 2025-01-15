import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/20/solid';

const tiers = [
  {
    name: 'Basic',
    id: 'tier-basic',
    href: '/signup',
    priceMonthly: '$15',
    description: 'Perfect for individuals and small projects.',
    features: [
      '5 hours of audio processing per month',
      'Basic transcription',
      'Standard support',
      'Cloud storage (10GB)',
      'Export to common formats',
    ],
    featured: false,
  },
  {
    name: 'Pro',
    id: 'tier-pro',
    href: '/signup',
    priceMonthly: '$30',
    description: 'Ideal for professionals and growing teams.',
    features: [
      '20 hours of audio processing per month',
      'Advanced transcription with speaker detection',
      'Priority support',
      'Cloud storage (50GB)',
      'Custom vocabulary',
      'Analytics dashboard',
      'API access',
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '/contact',
    priceMonthly: 'Custom',
    description: 'Dedicated support and infrastructure for your organization.',
    features: [
      'Unlimited audio processing',
      'Enterprise-grade transcription',
      '24/7 dedicated support',
      'Unlimited cloud storage',
      'Custom integration',
      'Advanced analytics',
      'SLA guarantee',
      'Custom AI model training',
    ],
    featured: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function PricingPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for&nbsp;you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Choose an affordable plan that's packed with the best features for your needs.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                tier.featured ? 'ring-2 ring-primary-600' : 'ring-1 ring-gray-200',
                'rounded-3xl p-8 xl:p-10'
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  className={classNames(
                    tier.featured ? 'text-primary-600' : 'text-gray-900',
                    'text-lg font-semibold leading-8'
                  )}
                >
                  {tier.name}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.priceMonthly}</span>
                {tier.priceMonthly !== 'Custom' && (
                  <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                )}
              </p>
              <Link
                href={tier.href}
                className={classNames(
                  tier.featured
                    ? 'bg-primary-600 text-white shadow-sm hover:bg-primary-500'
                    : 'text-primary-600 ring-1 ring-inset ring-primary-200 hover:ring-primary-300',
                  'mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                )}
              >
                {tier.priceMonthly === 'Custom' ? 'Contact sales' : 'Get started'}
              </Link>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon className="h-6 w-5 flex-none text-primary-600" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 