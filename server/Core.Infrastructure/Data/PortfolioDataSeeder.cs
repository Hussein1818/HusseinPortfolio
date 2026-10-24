using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Core.Infrastructure.Data;

public static class PortfolioDataSeeder
{
    public static async Task SeedAsync(AppDbContext dbContext)
    {
        // 1. Seed Hero Profile if none exists
        if (!await dbContext.PortfolioProfiles.AnyAsync())
        {
            await dbContext.PortfolioProfiles.AddAsync(new PortfolioProfile
            {
                Name = "Hussein Mohamed Hussein",
                Title = "Junior .NET Backend Developer",
                Location = "Cairo, Egypt",
                Email = "issehs023@gmail.com",
                Phone = "+201288239524",
                GithubUrl = "https://github.com/Hussein1818",
                LinkedinUrl = "https://www.linkedin.com/in/hussein-mohamed-21b214315",
                DungeonAvatar = "/assets/images/hussein-dungeon.jpg",
                RecruiterAvatar = "/assets/images/hussein-hr.png",
                Summary = "Junior .NET Backend Developer with a Bachelor's degree in Information Technology. Specializes in building scalable, enterprise-level RESTful APIs using .NET 9, Clean Architecture, and the CQRS pattern. Proficient in integrating real-time features, optimizing databases, and deploying applications to the cloud.",
                EducationDegree = "Bachelor's degree in Information Technology",
                EducationUniversity = "Egyptian E-Learning University (EELU)",
                EducationGrade = "Excellent with Honors (GPA: 3.64/4.0)"
            });
            await dbContext.SaveChangesAsync();
        }

        // 2. Ensure all 4 Default Projects exist alongside any custom projects (e.g., EL3OMDA)
        var existingProjectNames = await dbContext.Projects
            .IgnoreQueryFilters()
            .Select(p => p.Name.ToLower())
            .ToListAsync();

        var defaultProjects = new List<Project>
        {
            new()
            {
                Name = "MedAura",
                Role = "Freelance .NET Backend Developer",
                Period = "2026",
                Type = "Commercial Medical E-Learning (Google Play)",
                ImageUrl = "/assets/images/relic-medaura.png",
                SecretArchitecture = "FFmpeg HLS Encryption Pipeline + Strict Hardware Device-Binding + Cloudflare R2 Edge Caching",
                SchemaDiagram = "[Mobile Client] -> [DeviceBindingMiddleware] -> [MediatR Query] -> [Redis Segment Cache] -> [Cloudflare R2 AES-128 HLS (.m3u8)]",
                Description = "Engineered a secure, scalable backend for a commercial medical e-learning mobile application. Built an encrypted video delivery pipeline with HLS streaming and implemented strict device-binding workflows with admin approvals to prevent account sharing.",
                LiveUrl = "https://play.google.com/store/apps/details?id=com.medaura.app",
                DeepDiveSpecs = new List<ProjectSpec>
                {
                    new() { Specification = "Automated FFmpeg transcoding pipeline converting lectures into encrypted HLS segments." },
                    new() { Specification = "Cloudflare R2 edge storage integration with signed token validation and advanced segment caching." },
                    new() { Specification = "Strict hardware device-binding workflow with admin approval queues to prevent multi-user piracy." },
                    new() { Specification = "Built with .NET 9, Clean Architecture, and MediatR (CQRS) for maintainable scalability." }
                },
                TechStacks = new List<ProjectTechStack>
                {
                    new() { TechnologyName = ".NET 9" },
                    new() { TechnologyName = "ASP.NET Core" },
                    new() { TechnologyName = "EF Core" },
                    new() { TechnologyName = "SQL Server" },
                    new() { TechnologyName = "MediatR (CQRS)" },
                    new() { TechnologyName = "Clean Architecture" },
                    new() { TechnologyName = "Cloudflare R2" },
                    new() { TechnologyName = "FFmpeg" }
                }
            },
            new()
            {
                Name = "Torostack",
                Role = "Graduation Project",
                Period = "Grade: Excellent",
                Type = "Real-Time 1v1 Competitive Coding Platform",
                ImageUrl = "/assets/images/relic-torostack.png",
                SecretArchitecture = "Sub-Second SignalR 1v1 State Sync + Matchmaking Queue + Python AI Judge Bridge",
                SchemaDiagram = "[Duelists] <-> [SignalR BattleHub] -> [SubmitCodeCommand (CQRS)] -> [Python AI Evaluator] -> [SQL Leaderboard Sync]",
                Description = "Built a scalable backend utilizing Clean Architecture and CQRS for a real-time coding platform. Engineered a SignalR-based engine for live 1v1 battles with instant matchmaking and integrated a Python AI model for automated code evaluations.",
                LiveUrl = "https://torostack.me/",
                DeepDiveSpecs = new List<ProjectSpec>
                {
                    new() { Specification = "Real-time SignalR battle hubs managing instant matchmaking and sub-second state synchronization." },
                    new() { Specification = "Microservice integration with a Python AI evaluation engine for automated code grading." },
                    new() { Specification = "Dynamic relational leaderboards backed by optimized SQL Server queries." }
                },
                TechStacks = new List<ProjectTechStack>
                {
                    new() { TechnologyName = "C#" },
                    new() { TechnologyName = "ASP.NET Core" },
                    new() { TechnologyName = "SQL Server" },
                    new() { TechnologyName = "SignalR" },
                    new() { TechnologyName = "MediatR" },
                    new() { TechnologyName = "Clean Architecture" },
                    new() { TechnologyName = "Python AI" }
                }
            },
            new()
            {
                Name = "TicketOk",
                Role = "Backend Developer",
                Period = "High-Traffic System",
                Type = "Comprehensive Event Ticketing Platform",
                ImageUrl = "/assets/images/relic-ticketok.png",
                SecretArchitecture = "Distributed Real-Time Seat Locking + Atomic Digital Wallet + Dynamic QR PDF Engine",
                SchemaDiagram = "[LockSeatCommand] -> [Redis Distributed Lock (TTL)] -> [SignalR SeatMap Broadcast] -> [Wallet Tx + HMAC QR PDF]",
                Description = "Developed a robust backend system for a comprehensive event ticketing platform designed to handle high-traffic ticket releases. Integrated real-time seat locking mechanisms and dynamic digital wallet workflows to ensure secure bookings.",
                LiveUrl = "https://ticket-booking-alpha-ten.vercel.app/",
                DeepDiveSpecs = new List<ProjectSpec>
                {
                    new() { Specification = "Real-time seat reservation locks broadcasting live availability via SignalR to prevent double bookings." },
                    new() { Specification = "Dynamic digital wallet workflows ensuring atomic transaction safety during high-traffic drops." },
                    new() { Specification = "Automated CI/CD deployment pipelines and cryptographic QR code PDF generation." }
                },
                TechStacks = new List<ProjectTechStack>
                {
                    new() { TechnologyName = ".NET 9" },
                    new() { TechnologyName = "ASP.NET Core" },
                    new() { TechnologyName = "EF Core" },
                    new() { TechnologyName = "SQL Server" },
                    new() { TechnologyName = "SignalR" },
                    new() { TechnologyName = "MediatR" },
                    new() { TechnologyName = "CI/CD" }
                }
            },
            new()
            {
                Name = "SH-Supplements",
                Role = "Backend Architect",
                Period = "Commercial Ecosystem",
                Type = "E-Commerce & Health Ecosystem",
                ImageUrl = "/assets/images/relic-supplements.png",
                SecretArchitecture = "EF Core Optimistic Concurrency Control + Stack Conflict Detector + Anti-Counterfeit Verification",
                SchemaDiagram = "[CheckoutCommand] -> [StackConflictValidator] -> [EF Core RowVersion Concurrency Check] -> [SQL Atomic Commit]",
                Description = "Architected a scalable e-commerce and health ecosystem integrating advanced shopping features and an affiliate coaching portal. Engineered a checkout pipeline with optimistic concurrency control to prevent overselling during real-time flash sales.",
                LiveUrl = "https://sh-supplements.vercel.app/",
                DeepDiveSpecs = new List<ProjectSpec>
                {
                    new() { Specification = "Optimistic Concurrency Control in checkout pipelines to prevent inventory overselling during flash sales." },
                    new() { Specification = "Smart supplement stack conflict detector and affiliate coaching portal." },
                    new() { Specification = "Anti-counterfeit serial verification system ensuring product authenticity." }
                },
                TechStacks = new List<ProjectTechStack>
                {
                    new() { TechnologyName = ".NET 9" },
                    new() { TechnologyName = "ASP.NET Core" },
                    new() { TechnologyName = "EF Core" },
                    new() { TechnologyName = "SQL Server" },
                    new() { TechnologyName = "SignalR" },
                    new() { TechnologyName = "MediatR" }
                }
            }
        };

        foreach (var proj in defaultProjects)
        {
            if (!existingProjectNames.Contains(proj.Name.ToLower()))
            {
                await dbContext.Projects.AddAsync(proj);
            }
        }
        await dbContext.SaveChangesAsync();

        // 3. Seed Default Skill Categories if none exist
        if (!await dbContext.SkillCategories.AnyAsync())
        {
            var defaultCategories = new List<SkillCategory>
            {
                new()
                {
                    Name = "Architecture & Patterns",
                    RuneSymbol = "🏛️",
                    Skills = new List<SkillItem>
                    {
                        new() { Name = "Clean Architecture" },
                        new() { Name = "CQRS (MediatR)" },
                        new() { Name = "RESTful APIs" },
                        new() { Name = "SOLID Principles" },
                        new() { Name = "OOP" },
                        new() { Name = "Design Patterns" }
                    }
                },
                new()
                {
                    Name = "Backend Core",
                    RuneSymbol = "⚙️",
                    Skills = new List<SkillItem>
                    {
                        new() { Name = ".NET 9" },
                        new() { Name = "ASP.NET Core Web API" },
                        new() { Name = "Entity Framework Core" },
                        new() { Name = "ASP.NET Core MVC" },
                        new() { Name = "LINQ" },
                        new() { Name = "ASP.NET Core Identity" }
                    }
                },
                new()
                {
                    Name = "Real-Time, DB & Cloud",
                    RuneSymbol = "⚡",
                    Skills = new List<SkillItem>
                    {
                        new() { Name = "SignalR" },
                        new() { Name = "SQL Server" },
                        new() { Name = "Redis (Caching)" },
                        new() { Name = "Microsoft Azure" },
                        new() { Name = "Cloudflare R2" }
                    }
                },
                new()
                {
                    Name = "Languages, CI/CD & Tools",
                    RuneSymbol = "🛠️",
                    Skills = new List<SkillItem>
                    {
                        new() { Name = "C#" },
                        new() { Name = "C++" },
                        new() { Name = "JavaScript" },
                        new() { Name = "Git & GitHub" },
                        new() { Name = "FFmpeg" },
                        new() { Name = "Postman" },
                        new() { Name = "Swagger" },
                        new() { Name = "Agile/Scrum" }
                    }
                }
            };

            await dbContext.SkillCategories.AddRangeAsync(defaultCategories);
            await dbContext.SaveChangesAsync();
        }

        // 4. Seed Default System Design Challenge Actions if none exist
        if (!await dbContext.BossActions.AnyAsync())
        {
            var defaultActions = new List<BossAction>
            {
                new()
                {
                    Label = "Deploy Optimistic Concurrency Control",
                    ProjectOrigin = "SH-Supplements",
                    ImpactDescription = "Eliminated race conditions and prevented flash-sale overselling under heavy load.",
                    Damage = 40
                },
                new()
                {
                    Label = "Trigger Distributed Seat-Locking & Redis Cache",
                    ProjectOrigin = "TicketOk",
                    ImpactDescription = "Handled massive concurrent booking spikes with sub-millisecond state locks.",
                    Damage = 35
                },
                new()
                {
                    Label = "Enforce HLS Encryption & Strict Device-Binding",
                    ProjectOrigin = "MedAura",
                    ImpactDescription = "Blocked unauthorized stream piracy and secured multi-device session tokens.",
                    Damage = 45
                }
            };

            await dbContext.BossActions.AddRangeAsync(defaultActions);
            await dbContext.SaveChangesAsync();
        }
    }
}