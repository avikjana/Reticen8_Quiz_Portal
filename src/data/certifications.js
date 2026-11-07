// Certification programs data
// Prerequisites and exam details can be fetched from your backend API

export const certifications = [
  {
    id: 'rcfa',
    code: 'RCFA',
    title: 'Reticen8 Certified Firewall Associate',
    level: 'Associate',
    levelColor: 'green',
    description:
      'Demonstrates foundational knowledge of Reticen8 firewall deployment, basic configuration, and security policy implementation.',
    prerequisites: 'Networking fundamentals recommended',
    examFormat: 'Multiple choice · 60 questions · 90 minutes',
    badge: '🛡️',
  },
  {
    id: 'rcfp',
    code: 'RCFP',
    title: 'Reticen8 Certified Firewall Professional',
    level: 'Professional',
    levelColor: 'blue',
    description:
      'Validates practical skills in advanced firewall configuration, IPS, VPN, and enterprise security policy management.',
    prerequisites: 'RCFA certification recommended',
    examFormat: 'Multiple choice + scenario · 80 questions · 120 minutes',
    badge: '🔐',
  },
  {
    id: 'rcsa',
    code: 'RCSA',
    title: 'Reticen8 Certified Security Architect',
    level: 'Architect',
    levelColor: 'orange',
    description:
      'Demonstrates expertise in designing and implementing multi-site enterprise security architectures using Reticen8 solutions.',
    prerequisites: 'RCFP certification required',
    examFormat: 'Scenario-based · 60 questions + design task · 150 minutes',
    badge: '🏗️',
  },
  {
    id: 'rcfe',
    code: 'RCFE',
    title: 'Reticen8 Certified Firewall Expert',
    level: 'Expert',
    levelColor: 'purple',
    description:
      'The highest Reticen8 credential, recognising mastery of enterprise firewall operations, SD-WAN, and advanced security operations.',
    prerequisites: 'RCSA certification required',
    examFormat: 'Practical lab exam · 240 minutes',
    badge: '⭐',
  },
]
