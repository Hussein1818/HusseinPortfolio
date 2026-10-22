import type { PortfolioData } from '../types/dungeon.types';

export const HUSSEIN_DATA: PortfolioData = {
  hero: {
    name: 'Hussein Mohamed Hussein',
    title: 'Junior .NET Backend Developer',
    location: 'Cairo, Egypt',
    email: 'issehs023@gmail.com',
    phone: '+201288239524',
    githubUrl: 'https://github.com/Hussein1818',
    linkedinUrl:
      'https://www.linkedin.com/in/hussein-mohamed-21b214315?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    dungeonAvatar: '/assets/images/hussein-dungeon.jpg',
    recruiterAvatar: '/assets/images/hussein-hr.png',
    summary:
      "Junior .NET Backend Developer with a Bachelor's degree in Information Technology. Specializes in building scalable, enterprise-level RESTful APIs using .NET 9, Clean Architecture, and the CQRS pattern. Proficient in integrating real-time features, optimizing databases, and deploying applications to the cloud.",
    education: {
      degree: "Bachelor's degree in Information Technology",
      university: 'Egyptian E-Learning University (EELU)',
      grade: 'Excellent with Honors (GPA: 3.64/4.0)',
    },
  },
  relics: [
    {
      id: 'medaura',
      name: 'MedAura',
      role: 'Freelance .NET Backend Developer',
      period: '2026',
      type: 'Commercial Medical E-Learning (Google Play)',
      imageUrl: '/assets/images/relic-medaura.png',
      secretArchitecture:
        'FFmpeg HLS Encryption Pipeline + Strict Hardware Device-Binding + Cloudflare R2 Edge Caching',
      schemaDiagram:
        '[Mobile Client] -> [DeviceBindingMiddleware] -> [MediatR Query] -> [Redis Segment Cache] -> [Cloudflare R2 AES-128 HLS (.m3u8)]',
      description:
        'Engineered a secure, scalable backend for a commercial medical e-learning mobile application. Built an encrypted video delivery pipeline with HLS streaming and implemented strict device-binding workflows with admin approvals to prevent account sharing.',
      deepDiveSpecs: [
        'Automated FFmpeg transcoding pipeline converting lectures into encrypted HLS segments.',
        'Cloudflare R2 edge storage integration with signed token validation and advanced segment caching.',
        'Strict hardware device-binding workflow with admin approval queues to prevent multi-user piracy.',
        'Built with .NET 9, Clean Architecture, and MediatR (CQRS) for maintainable scalability.',
      ],
      stack: [
        '.NET 9',
        'ASP.NET Core',
        'EF Core',
        'SQL Server',
        'MediatR (CQRS)',
        'Clean Architecture',
        'Cloudflare R2',
        'FFmpeg',
      ],
      liveUrl: 'https://play.google.com/store/apps/details?id=com.medaura.app',
    },
    {
      id: 'torostack',
      name: 'Torostack',
      role: 'Graduation Project',
      period: 'Grade: Excellent',
      type: 'Real-Time 1v1 Competitive Coding Platform',
      imageUrl: '/assets/images/relic-torostack.png',
      secretArchitecture:
        'Sub-Second SignalR 1v1 State Sync + Matchmaking Queue + Python AI Judge Bridge',
      schemaDiagram:
        '[Duelists] <-> [SignalR BattleHub] -> [SubmitCodeCommand (CQRS)] -> [Python AI Evaluator] -> [SQL Leaderboard Sync]',
      description:
        'Built a scalable backend utilizing Clean Architecture and CQRS for a real-time coding platform. Engineered a SignalR-based engine for live 1v1 battles with instant matchmaking and integrated a Python AI model for automated code evaluations.',
      deepDiveSpecs: [
        'Real-time SignalR battle hubs managing instant matchmaking and sub-second state synchronization.',
        'Microservice integration with a Python AI evaluation engine for automated code grading.',
        'Dynamic relational leaderboards backed by optimized SQL Server queries.',
      ],
      stack: [
        'C#',
        'ASP.NET Core',
        'SQL Server',
        'SignalR',
        'MediatR',
        'Clean Architecture',
        'Python AI',
      ],
      liveUrl: 'https://torostack.me/',
    },
    {
      id: 'ticketok',
      name: 'TicketOk',
      role: 'Backend Developer',
      period: 'High-Traffic System',
      type: 'Comprehensive Event Ticketing Platform',
      imageUrl: '/assets/images/relic-ticketok.png',
      secretArchitecture:
        'Distributed Real-Time Seat Locking + Atomic Digital Wallet + Dynamic QR PDF Engine',
      schemaDiagram:
        '[LockSeatCommand] -> [Redis Distributed Lock (TTL)] -> [SignalR SeatMap Broadcast] -> [Wallet Tx + HMAC QR PDF]',
      description:
        'Developed a robust backend system for a comprehensive event ticketing platform designed to handle high-traffic ticket releases. Integrated real-time seat locking mechanisms and dynamic digital wallet workflows to ensure secure bookings.',
      deepDiveSpecs: [
        'Real-time seat reservation locks broadcasting live availability via SignalR to prevent double bookings.',
        'Dynamic digital wallet workflows ensuring atomic transaction safety during high-traffic drops.',
        'Automated CI/CD deployment pipelines and cryptographic QR code PDF generation.',
      ],
      stack: [
        '.NET 9',
        'ASP.NET Core',
        'EF Core',
        'SQL Server',
        'SignalR',
        'MediatR',
        'CI/CD',
      ],
      liveUrl: 'https://ticket-booking-alpha-ten.vercel.app/',
    },
    {
      id: 'sh-supplements',
      name: 'SH-Supplements',
      role: 'Backend Architect',
      period: 'Commercial Ecosystem',
      type: 'E-Commerce & Health Ecosystem',
      imageUrl: '/assets/images/relic-supplements.png',
      secretArchitecture:
        'EF Core Optimistic Concurrency Control + Stack Conflict Detector + Anti-Counterfeit Verification',
      schemaDiagram:
        '[CheckoutCommand] -> [StackConflictValidator] -> [EF Core RowVersion Concurrency Check] -> [SQL Atomic Commit]',
      description:
        'Architected a scalable e-commerce and health ecosystem integrating advanced shopping features and an affiliate coaching portal. Engineered a checkout pipeline with optimistic concurrency control to prevent overselling during real-time flash sales.',
      deepDiveSpecs: [
        'Optimistic Concurrency Control in checkout pipelines to prevent inventory overselling during flash sales.',
        'Smart supplement stack conflict detector and affiliate coaching portal.',
        'Anti-counterfeit serial verification system ensuring product authenticity.',
      ],
      stack: [
        '.NET 9',
        'ASP.NET Core',
        'EF Core',
        'SQL Server',
        'SignalR',
        'MediatR',
      ],
      liveUrl: 'https://sh-supplements.vercel.app/',
    },
  ],
  runes: [
    {
      id: 'arch-rune',
      category: 'Architecture & Patterns',
      runeSymbol: '🏛️',
      items: [
        'Clean Architecture',
        'CQRS (MediatR)',
        'RESTful APIs',
        'SOLID Principles',
        'OOP',
        'Design Patterns',
      ],
    },
    {
      id: 'backend-rune',
      category: 'Backend Core',
      runeSymbol: '⚙️',
      items: [
        '.NET 9',
        'ASP.NET Core Web API',
        'Entity Framework Core',
        'ASP.NET Core MVC',
        'LINQ',
        'ASP.NET Core Identity',
      ],
    },
    {
      id: 'realtime-cloud-rune',
      category: 'Real-Time, DB & Cloud',
      runeSymbol: '⚡',
      items: [
        'SignalR',
        'SQL Server',
        'Redis (Caching)',
        'Microsoft Azure',
        'Cloudflare R2',
      ],
    },
    {
      id: 'tools-langs-rune',
      category: 'Languages, CI/CD & Tools',
      runeSymbol: '🛠️',
      items: [
        'C#',
        'C++',
        'JavaScript',
        'Git & GitHub',
        'FFmpeg',
        'Postman',
        'Swagger',
        'Agile/Scrum',
      ],
    },
  ],
  bossActions: [
    {
      id: 'concurrency-shield',
      label: 'Deploy Optimistic Concurrency Control',
      projectOrigin: 'SH-Supplements',
      impactDescription:
        'Eliminated race conditions and prevented flash-sale overselling under heavy load.',
      damage: 40,
    },
    {
      id: 'seat-lock-strike',
      label: 'Trigger Distributed Seat-Locking & Redis Cache',
      projectOrigin: 'TicketOk',
      impactDescription:
        'Handled massive concurrent booking spikes with sub-millisecond state locks.',
      damage: 35,
    },
    {
      id: 'hls-encryption-beam',
      label: 'Enforce HLS Encryption & Strict Device-Binding',
      projectOrigin: 'MedAura',
      impactDescription:
        'Blocked unauthorized stream piracy and secured multi-device session tokens.',
      damage: 45,
    },
  ],
  initialGuestbook: [
    {
      id: 'gb-1',
      explorerName: 'Tech Lead Explorer',
      guildOrCompany: 'Enterprise Guild',
      message: 'Impressive .NET 9 Clean Architecture and SignalR execution!',
      timestamp: '2m ago',
    },
    {
      id: 'gb-2',
      explorerName: 'Senior Architect',
      guildOrCompany: 'Cloud Citadel',
      message: 'The HLS encryption & device-binding in MedAura is top-tier.',
      timestamp: '14m ago',
    },
  ],
};