import Link from 'next/link';
import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid';

const stats = [
  { label: 'Founded', value: '2023' },
  { label: 'Employees', value: '20+' },
  { label: 'Countries', value: '10+' },
  { label: 'Customers', value: '5,000+' },
];

const values = [
  {
    name: 'Innovation First',
    description: 'We continuously push the boundaries of what\'s possible with AI and audio processing technology.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Security Focused',
    description: 'Your data security and privacy are at the core of everything we do.',
    icon: LockClosedIcon,
  },
  {
    name: 'Customer Success',
    description: 'We\'re committed to helping our customers achieve their goals and maximize value.',
    icon: ServerIcon,
  },
];

const team = [
  {
    name: 'Michael Chen',
    role: 'Co-Founder / CEO',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Sarah Johnson',
    role: 'Co-Founder / CTO',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'David Rodriguez',
    role: 'Head of AI',
    imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero section */}
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <p className="text-base font-semibold leading-7 text-primary-600">About Recapio</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Our mission is to make audio content more accessible and actionable
          </h1>
          <div className="mt-10 grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-muted-foreground lg:max-w-none lg:grid-cols-2">
            <div>
              <p>
                Founded in 2023, Recapio emerged from a simple observation: despite the explosion in audio content,
                the tools for understanding and utilizing this content hadn't kept pace with modern needs.
              </p>
              <p className="mt-8">
                We set out to change that by building a platform that combines cutting-edge AI with
                intuitive design, making it easy for anyone to transform their audio content into
                actionable insights.
              </p>
            </div>
            <div>
              <p>
                Today, we're proud to serve thousands of customers worldwide, from individual content
                creators to large enterprises, helping them unlock the full potential of their audio content.
              </p>
              <p className="mt-8">
                Our team of experts in AI, speech recognition, and software development continues to
                push the boundaries of what's possible, always with our users' needs at the forefront.
              </p>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="mt-32">
          <div className="mx-auto max-w-7xl">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="mx-auto flex max-w-xs flex-col gap-y-4">
                  <dt className="text-base leading-7 text-muted-foreground">{stat.label}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Values section */}
        <div className="mx-auto mt-32 max-w-7xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Our values</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            These core values guide everything we do at Recapio.
          </p>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 text-muted-foreground sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-x-16">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.name} className="relative pl-9">
                  <dt className="inline font-semibold text-foreground">
                    <Icon className="absolute left-1 top-1 h-5 w-5 text-primary-600" aria-hidden="true" />
                    {value.name}
                  </dt>
                  <dd className="inline ml-3">{value.description}</dd>
                </div>
              );
            })}
          </dl>
        </div>

        {/* Team section */}
        <div className="mx-auto mt-32 max-w-7xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Our team</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Meet the people behind Recapio who are passionate about making audio content more accessible.
          </p>
          <ul role="list" className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {team.map((person) => (
              <li key={person.name}>
                <img className="aspect-[3/2] w-full rounded-2xl object-cover" src={person.imageUrl} alt="" />
                <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-foreground">{person.name}</h3>
                <p className="text-base leading-7 text-muted-foreground">{person.role}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA section */}
        <div className="mt-32 sm:mt-40">
          <div className="relative isolate overflow-hidden bg-secondary px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Join us in shaping the future of audio processing
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Whether you're a customer, partner, or potential team member, we'd love to hear from you.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/contact"
                className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Contact us
              </Link>
              <Link href="/careers" className="text-sm font-semibold leading-6 text-foreground">
                View careers <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 