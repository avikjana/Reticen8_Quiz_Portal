// Comprehensive course catalog & curriculum data for Reticen8 Academy
export const coursesData = [
  {
    id: 'network-security-fundamentals',
    title: 'Network Security Fundamentals',
    shortDesc: 'Build a solid foundation in TCP/IP, OSI model, routing protocols, and defensive security architectures.',
    description: 'Designed for aspiring cybersecurity engineers, this course introduces the fundamental principles of enterprise network security. You will learn packet analysis, subnetting, stateful inspection fundamentals, access control lists (ACLs), and basic vulnerability mitigation.',
    difficulty: 'Beginner',
    difficultyColor: 'green',
    category: 'Network Security',
    duration: '14 Hours',
    estimatedWeeks: '3 Weeks',
    modulesCount: 6,
    lessonsCount: 28,
    rating: 4.8,
    studentsCount: 3840,
    certificationCode: 'RCFA',
    certificationTitle: 'Reticen8 Certified Firewall Associate',
    badge: '🛡️',
    instructor: {
      name: 'Dr. Sarah Chen, CISSP',
      role: 'Principal Security Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
    },
    skills: [
      'TCP/IP & OSI Layer Defense',
      'Subnetting & VLAN Segmentation',
      'Stateful Packet Inspection',
      'ACL & Security Policy Design',
      'Wireshark Traffic Analysis',
    ],
    curriculum: [
      {
        id: 'mod-1',
        title: 'Module 1: Foundations of Enterprise Networking',
        duration: '2h 15m',
        lessons: [
          { id: 'l-1', title: '1.1 The Enterprise Perimeter Architecture', type: 'video', duration: '18m', completed: true },
          { id: 'l-2', title: '1.2 OSI Model vs TCP/IP in Security Context', type: 'video', duration: '24m', completed: true },
          { id: 'l-3', title: '1.3 Hands-On: Packet Capture & Header Decoding', type: 'lab', duration: '35m', completed: true },
          { id: 'l-4', title: '1.4 Knowledge Check: Core Protocols', type: 'quiz', duration: '15m', completed: true },
        ],
      },
      {
        id: 'mod-2',
        title: 'Module 2: Network Segmentation & VLAN Isolation',
        duration: '2h 45m',
        lessons: [
          { id: 'l-5', title: '2.1 Zone-Based Defense Concepts', type: 'video', duration: '22m', completed: true },
          { id: 'l-6', title: '2.2 802.1Q Trunking & Security Implications', type: 'video', duration: '28m', completed: false },
          { id: 'l-7', title: '2.3 Lab: Configuring DMZ and Secure Subnets', type: 'lab', duration: '45m', completed: false },
          { id: 'l-8', title: '2.4 Assessment: DMZ Breach Defense', type: 'quiz', duration: '20m', completed: false },
        ],
      },
      {
        id: 'mod-3',
        title: 'Module 3: Access Control Lists & Stateful Rules',
        duration: '3h 10m',
        lessons: [
          { id: 'l-9', title: '3.1 Stateless vs Stateful Packet Filtering', type: 'video', duration: '30m', completed: false },
          { id: 'l-10', title: '3.2 Ingress vs Egress Policy Design', type: 'video', duration: '25m', completed: false },
          { id: 'l-11', title: '3.3 Virtual Lab: Creating Enterprise ACLs', type: 'lab', duration: '50m', completed: false },
        ],
      },
      {
        id: 'mod-4',
        title: 'Module 4: Routing Security & NAT Mechanisms',
        duration: '2h 30m',
        lessons: [
          { id: 'l-12', title: '4.1 Source NAT vs Destination NAT (Port Forwarding)', type: 'video', duration: '25m', completed: false },
          { id: 'l-13', title: '4.2 Static vs Dynamic Routing Protocol Hardening', type: 'video', duration: '35m', completed: false },
          { id: 'l-14', title: '4.3 Lab: Configuring Secure Gateway NAT', type: 'lab', duration: '40m', completed: false },
        ],
      },
      {
        id: 'mod-5',
        title: 'Module 5: Threat Surface & Common Attack Vectors',
        duration: '2h 10m',
        lessons: [
          { id: 'l-15', title: '5.1 SYN Floods, Port Scanning & Reconnaissance', type: 'video', duration: '20m', completed: false },
          { id: 'l-16', title: '5.2 ARP Spoofing & Man-in-the-Middle Mitigation', type: 'video', duration: '25m', completed: false },
          { id: 'l-17', title: '5.3 Simulation: DDoS Detection & Mitigation', type: 'lab', duration: '45m', completed: false },
        ],
      },
      {
        id: 'mod-6',
        title: 'Module 6: Capstone Project & RCFA Exam Prep',
        duration: '1h 30m',
        lessons: [
          { id: 'l-18', title: '6.1 Comprehensive Network Defense Assessment', type: 'lab', duration: '60m', completed: false },
          { id: 'l-19', title: '6.2 Practice Examination (60 Questions)', type: 'exam', duration: '60m', completed: false },
        ],
      },
    ],
  },
  {
    id: 'reticen8-ngfw-professional',
    title: 'Reticen8 NGFW Professional',
    shortDesc: 'Master Reticen8 next-generation firewall deployment, deep-packet inspection, and application control.',
    description: 'The core certification course for deploying and administrating Reticen8 enterprise security appliances. Covers initial bootstrap, hardware & VM interfaces, zero-trust security policies, TLS inspection, user identification, and high-availability pairing.',
    difficulty: 'Intermediate',
    difficultyColor: 'blue',
    category: 'Firewall Administration',
    duration: '22 Hours',
    estimatedWeeks: '4 Weeks',
    modulesCount: 8,
    lessonsCount: 36,
    rating: 4.9,
    studentsCount: 2950,
    certificationCode: 'RCFP',
    certificationTitle: 'Reticen8 Certified Firewall Professional',
    badge: '🔐',
    instructor: {
      name: 'Marcus Vance, CCIE Security',
      role: 'Lead Firewall Consultant',
      avatar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=150&h=150&q=80',
    },
    skills: [
      'Reticen8 OS CLI & WebUI Command',
      'Layer 7 Application Identification (App-ID)',
      'SSL/TLS Full Decryption & Inspection',
      'Active-Passive High Availability (HA)',
      'Zone-Based Security Policies',
    ],
    curriculum: [
      {
        id: 'mod-1',
        title: 'Module 1: Reticen8 NGFW Hardware & Architecture',
        duration: '2h 30m',
        lessons: [
          { id: 'l-1', title: '1.1 Reticen8 Single-Pass Parallel Processing (SP3)', type: 'video', duration: '25m', completed: true },
          { id: 'l-2', title: '1.2 Out-of-Band Management & Zero-Touch Provisioning', type: 'video', duration: '20m', completed: true },
          { id: 'l-3', title: '1.3 Interactive CLI Bootstrap Lab', type: 'lab', duration: '45m', completed: false },
        ],
      },
      {
        id: 'mod-2',
        title: 'Module 2: Interfaces, Zones & Virtual Routers',
        duration: '3h 00m',
        lessons: [
          { id: 'l-4', title: '2.1 Tap, Virtual Wire, and Layer 3 Interfaces', type: 'video', duration: '30m', completed: false },
          { id: 'l-5', title: '2.2 Virtual Router Routing Tables & OSPF Integration', type: 'video', duration: '35m', completed: false },
          { id: 'l-6', title: '2.3 Lab: Multi-VLAN Trunking & Sub-Interfaces', type: 'lab', duration: '55m', completed: false },
        ],
      },
      {
        id: 'mod-3',
        title: 'Module 3: Security & NAT Policy Framework',
        duration: '3h 30m',
        lessons: [
          { id: 'l-7', title: '3.1 Rule Order, Evaluation Logic & Shadow Rules', type: 'video', duration: '25m', completed: false },
          { id: 'l-8', title: '3.2 Application Identification (App-ID) Engine', type: 'video', duration: '40m', completed: false },
          { id: 'l-9', title: '3.3 Lab: Blocking P2P & Shadow IT Applications', type: 'lab', duration: '50m', completed: false },
        ],
      },
      {
        id: 'mod-4',
        title: 'Module 4: Inbound & Outbound SSL/TLS Decryption',
        duration: '3h 15m',
        lessons: [
          { id: 'l-10', title: '4.1 Public Key Infrastructure & Root CA Setup', type: 'video', duration: '35m', completed: false },
          { id: 'l-11', title: '4.2 Forward Proxy Decryption vs Inbound Inspection', type: 'video', duration: '30m', completed: false },
          { id: 'l-12', title: '4.3 Lab: Decrypting HTTPS Traffic for Malware Inspection', type: 'lab', duration: '60m', completed: false },
        ],
      },
    ],
  },
  {
    id: 'advanced-firewall-security',
    title: 'Advanced Firewall Security & IPS',
    shortDesc: 'Deep dive into zero-day malware sandboxing, heuristic IPS, automated quarantine, and enterprise VPNs.',
    description: 'An advanced operational course focusing on intrusion prevention systems (IPS), DNS security sinkholing, dynamic blocklists, and encrypted remote access. Designed for Senior Security Engineers and SOC analysts managing mission-critical enterprise boundaries.',
    difficulty: 'Advanced',
    difficultyColor: 'orange',
    category: 'Threat Defense',
    duration: '28 Hours',
    estimatedWeeks: '5 Weeks',
    modulesCount: 7,
    lessonsCount: 38,
    rating: 4.95,
    studentsCount: 1820,
    certificationCode: 'RCSA',
    certificationTitle: 'Reticen8 Certified Security Architect',
    badge: '🏗️',
    instructor: {
      name: 'Elena Rostova, CISM',
      role: 'Director of Threat Research',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
    },
    skills: [
      'Intrusion Prevention System (IPS) Custom Signatures',
      'Dynamic Threat Intelligence & Sinkholing',
      'IPsec Site-to-Site & SSL VPN Portals',
      'Automated Incident Response & SIEM Forwarding',
      'Hardware High-Availability Failover Tuning',
    ],
    curriculum: [
      {
        id: 'mod-1',
        title: 'Module 1: Intrusion Prevention & Threat Profiles',
        duration: '4h 00m',
        lessons: [
          { id: 'l-1', title: '1.1 Deep Packet Inspection & Heuristic Signatures', type: 'video', duration: '35m', completed: true },
          { id: 'l-2', title: '1.2 Writing Custom Snort/Reticen8 IPS Rules', type: 'video', duration: '45m', completed: false },
          { id: 'l-3', title: '1.3 Lab: Exploiting & Mitigating CVE-2024 Remote Code Attacks', type: 'lab', duration: '60m', completed: false },
        ],
      },
      {
        id: 'mod-2',
        title: 'Module 2: Zero-Trust Remote Access & SSL VPN',
        duration: '4h 30m',
        lessons: [
          { id: 'l-4', title: '2.1 Enterprise SAML 2.0 & MFA Authentication', type: 'video', duration: '40m', completed: false },
          { id: 'l-5', title: '2.2 Host Integrity Checking & Endpoint Posture', type: 'video', duration: '35m', completed: false },
          { id: 'l-6', title: '2.3 Lab: Full Gateway Portal with Split-Tunneling', type: 'lab', duration: '65m', completed: false },
        ],
      },
    ],
  },
  {
    id: 'security-architecture',
    title: 'Enterprise Security Architecture & SD-WAN',
    shortDesc: 'Architect resilient multi-site mesh networks, secure cloud transit hubs, and SD-WAN routing.',
    description: 'The pinnacle technical curriculum for Enterprise Architects. Learn to design fault-tolerant security fabrics spanning on-prem data centers, AWS/Azure transit gateways, and distributed branch offices with dynamic SLA path selection.',
    difficulty: 'Expert',
    difficultyColor: 'purple',
    category: 'Architecture & Cloud',
    duration: '32 Hours',
    estimatedWeeks: '6 Weeks',
    modulesCount: 8,
    lessonsCount: 42,
    rating: 5.0,
    studentsCount: 1140,
    certificationCode: 'RCFE',
    certificationTitle: 'Reticen8 Certified Firewall Expert',
    badge: '⭐',
    instructor: {
      name: 'David O’Connor, CCIE Security Emeritus',
      role: 'Chief Technical Fellow',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&h=150&q=80',
    },
    skills: [
      'Multi-Cloud Security Hub & Spoke Design',
      'Software-Defined WAN (SD-WAN) Policies',
      'BGP Routing over IPsec Meshes',
      'Disaster Recovery & Active-Active Clustering',
      'Zero-Trust Network Access (ZTNA) Strategy',
    ],
    curriculum: [
      {
        id: 'mod-1',
        title: 'Module 1: Global Multi-Site Security Topology',
        duration: '4h 15m',
        lessons: [
          { id: 'l-1', title: '1.1 Enterprise Hub-and-Spoke vs Full Mesh WAN', type: 'video', duration: '40m', completed: false },
          { id: 'l-2', title: '1.2 Encrypted Transit in AWS & Azure Virtual WAN', type: 'video', duration: '45m', completed: false },
          { id: 'l-3', title: '1.3 Architectural Design Review Case Study', type: 'lab', duration: '75m', completed: false },
        ],
      },
    ],
  },
]

// Backwards compatibility alias & property normalization
coursesData.forEach((course) => {
  if (!course.topics && course.skills) {
    course.topics = course.skills;
  }
  if (!course.modules && course.modulesCount) {
    course.modules = course.modulesCount;
  }
  if (!course.icon) {
    course.icon = 'shield';
  }
  if (!course.bgColor) {
    course.bgColor = '#F0FDF4';
  }
});

export const learningPaths = coursesData;
