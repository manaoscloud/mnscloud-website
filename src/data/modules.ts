export type ModuleFeature = {
  title: string;
  description: string;
};

export type ProductModule = {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  href: string;
  features: ModuleFeature[];
};

export const productModules: ProductModule[] = [
  {
    slug: 'voip',
    eyebrow: 'Telecom Core',
    title: 'VoIP Platform',
    summary:
      'PABX, Softswitch, SBC, DID, routing, recordings, WebRTC readiness, and multi-tenant voice operations.',
    href: '/modules/voip',
    features: [
      { title: 'PABX', description: 'FreeSWITCH and Asterisk orchestration through the API.' },
      { title: 'Softswitch', description: 'Provider, resource, DID, subscriber, and routing control.' },
      { title: 'WebRTC', description: 'Secure edge design for browser and mobile SIP registration.' },
    ],
  },
  {
    slug: 'hosting',
    eyebrow: 'Infrastructure',
    title: 'Hosting Automation',
    summary:
      'VPS, VPS Container, DNS, storage, SMTP, web hosting, provider catalogs, and provisioning workflows.',
    href: '/modules/hosting',
    features: [
      { title: 'VPS', description: 'Provider, plan, image, and instance lifecycle automation.' },
      { title: 'Containers', description: 'Incus-first container provider model for customer workloads.' },
      { title: 'Storage', description: 'Reusable storage accounts for recordings, media, and assets.' },
    ],
  },
  {
    slug: 'monitoring',
    eyebrow: 'Operations',
    title: 'Monitoring And Agents',
    summary:
      'Outbound agents, server inventory, job execution, health checks, activity logs, and operational visibility.',
    href: '/modules/monitoring',
    features: [
      { title: 'Outbound Agent', description: 'No inbound server port required for management jobs.' },
      { title: 'Activity Logs', description: 'Traceable execution history for critical operations.' },
      { title: 'Capabilities', description: 'Resource-specific features delivered through generic agents.' },
    ],
  },
  {
    slug: 'cyber-security',
    eyebrow: 'Security',
    title: 'Cyber Security',
    summary:
      'CrowdSec, nftables, profiles, protected services, decisions, alerts, and service-based security policies.',
    href: '/modules/cyber-security',
    features: [
      { title: 'Profiles', description: 'Reusable security profiles by service, not by product label.' },
      { title: 'Firewall', description: 'nftables enforcement with CrowdSec intelligence.' },
      { title: 'Alerts', description: 'Security events reported back to the MNSCloud control plane.' },
    ],
  },
  {
    slug: 'support',
    eyebrow: 'Customer Care',
    title: 'Support And CRM',
    summary:
      'Tickets, channels, teams, CRM pipelines, leads, opportunities, and customer relationship workflows.',
    href: '/modules/support',
    features: [
      { title: 'Tickets', description: 'Support queues, channels, teams, and customer context.' },
      { title: 'CRM', description: 'Leads, opportunities, pipeline stages, and commercial visibility.' },
      { title: 'Sales', description: 'Catalog, quotations, stock, brands, categories, and units.' },
    ],
  },
  {
    slug: 'developers',
    eyebrow: 'Ecosystem',
    title: 'Developers And Public Connectors',
    summary:
      'Public clients, agents, installers, API contracts, contribution governance, and edge connectors.',
    href: '/developers',
    features: [
      { title: 'Public Repos', description: 'Auditable clients and installers without private control-plane logic.' },
      { title: 'API First', description: 'The API remains the source of truth for authorization and policy.' },
      { title: 'Contributors', description: 'Pull request governance with paid work and hiring paths.' },
    ],
  },
];

export function findModule(slug: string): ProductModule | undefined {
  return productModules.find((item) => item.slug === slug);
}
