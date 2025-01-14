import Link from 'next/link';
import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
  BoltIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ClockIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Advanced Speech Recognition',
    description: 'Industry-leading accuracy powered by state-of-the-art AI models that understand context and multiple speakers.',
    icon: DocumentTextIcon,
  },
  {
    name: 'Real-time Processing',
    description: 'Get transcriptions and insights as the audio plays, perfect for live events and meetings.',
    icon: BoltIcon,
  },
  {
    name: 'Smart Analytics',
    description: 'Automatically extract key topics, sentiment analysis, and actionable insights from your content.',
    icon: ChartBarIcon,
  },
  {
    name: 'Cloud Storage',
    description: 'Secure cloud storage for all your audio files and transcripts, accessible from anywhere.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Enterprise Security',
    description: 'Bank-grade encryption and security measures to protect your sensitive content.',
    icon: LockClosedIcon,
  },
  {
    name: 'API Access',
    description: 'Robust API for seamless integration with your existing tools and workflows.',
    icon: ServerIcon,
  },
  {
    name: 'Fast Turnaround',
    description: 'Get your transcripts and insights quickly, with options for priority processing.',
    icon: ClockIcon,
  },
  {
    name: 'Customization',
    description: 'Tailor the system to your needs with custom vocabulary and industry-specific models.',
    icon: CogIcon,
  },
];

export default function FeaturesPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Complete solution</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for audio processing
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Recapio provides a comprehensive suite of tools to help you get the most out of your audio content.
            From transcription to analysis, we've got you covered.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-primary-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* CTA section */}
        <div className="mt-32 sm:mt-56">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your audio content?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Start using Recapio today and experience the power of AI-driven audio processing.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/signup"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get started
              </Link>
              <Link href="/contact" className="text-sm font-semibold leading-6 text-white">
                Contact sales <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 