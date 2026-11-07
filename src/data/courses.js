// Learning paths / courses data
// Module counts and details can be fetched from your backend API

export const learningPaths = [
  {
    id: 'network-security-fundamentals',
    title: 'Network Security Fundamentals',
    description:
      'Build a solid foundation in networking and security principles before advancing to specialised firewall training.',
    difficulty: 'Beginner',
    difficultyColor: 'green',
    modules: 12,
    topics: [
      'Networking fundamentals',
      'Routing and switching',
      'Network security principles',
    ],
    icon: 'shield',
    accentColor: '#16A34A',
    bgColor: '#F0FDF4',
  },
  {
    id: 'reticen8-ngfw-professional',
    title: 'Reticen8 NGFW Professional',
    description:
      'Master Reticen8 next-generation firewall deployment, configuration, and management for enterprise environments.',
    difficulty: 'Intermediate',
    difficultyColor: 'blue',
    modules: 18,
    topics: [
      'Firewall deployment',
      'Interface configuration',
      'Routing and NAT',
      'Firewall security policies',
    ],
    icon: 'cpu',
    accentColor: '#2563EB',
    bgColor: '#EFF6FF',
  },
  {
    id: 'advanced-firewall-security',
    title: 'Advanced Firewall Security',
    description:
      'Deep dive into advanced threat prevention, SSL inspection, VPN technologies, and high-availability architectures.',
    difficulty: 'Advanced',
    difficultyColor: 'orange',
    modules: 24,
    topics: [
      'IPS and threat protection',
      'Application filtering',
      'SSL VPN and IPsec VPN',
      'High availability',
    ],
    icon: 'lock',
    accentColor: '#EA580C',
    bgColor: '#FFF7ED',
  },
  {
    id: 'security-architecture',
    title: 'Security Architecture',
    description:
      'Design and implement enterprise-grade multi-site security architectures and SD-WAN solutions.',
    difficulty: 'Expert',
    difficultyColor: 'purple',
    modules: 16,
    topics: [
      'Enterprise firewall architecture',
      'Multi-site deployment',
      'SD-WAN',
      'Security solution design',
    ],
    icon: 'network',
    accentColor: '#7C3AED',
    bgColor: '#F5F3FF',
  },
]
