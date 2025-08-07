const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create sample categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Modern web development techniques, frameworks, and best practices',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest trends and insights in technology and software development',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Business Solutions',
        slug: 'business-solutions',
        description: 'How technology can solve complex business challenges',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Cloud Computing',
        slug: 'cloud-computing',
        description: 'Cloud technologies, deployment strategies, and architecture',
      },
    }),
  ]);

  console.log('Created categories:', categories.map(c => c.name));

  // Create a sample admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@aetechlabs.com',
      name: 'AETech Admin',
      role: 'ADMIN',
    },
  });

  console.log('Created admin user:', adminUser.email);

  // Sample blog posts
  const posts = [
    {
      title: 'Building Modern Web Applications with Next.js',
      slug: 'building-modern-web-applications-nextjs',
      excerpt: 'Discover how Next.js revolutionizes web development with its powerful features including server-side rendering, static site generation, and API routes.',
      content: `# Building Modern Web Applications with Next.js

Next.js has become one of the most popular React frameworks for building production-ready web applications. In this comprehensive guide, we'll explore why Next.js is a game-changer for modern web development.

## What Makes Next.js Special?

Next.js provides several key features that set it apart:

### 1. Server-Side Rendering (SSR)
Server-side rendering improves SEO and initial page load times by rendering pages on the server before sending them to the client.

\`\`\`javascript
// pages/blog/[slug].js
export async function getServerSideProps(context) {
  const { slug } = context.params;
  const post = await fetchPost(slug);
  
  return {
    props: {
      post,
    },
  };
}
\`\`\`

### 2. Static Site Generation (SSG)
For content that doesn't change frequently, SSG pre-builds pages at build time, resulting in lightning-fast load times.

### 3. API Routes
Build full-stack applications with built-in API routes:

\`\`\`javascript
// pages/api/posts.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ posts: [] });
  }
}
\`\`\`

## Best Practices

1. **Use TypeScript** for better development experience
2. **Optimize images** with Next.js Image component
3. **Implement proper SEO** with Next.js Head component
4. **Leverage incremental static regeneration** for dynamic content

## Conclusion

Next.js provides an excellent foundation for building modern, performant web applications. Its flexibility and powerful features make it suitable for projects of all sizes.`,
      published: true,
      categoryId: categories[0].id,
      authorId: adminUser.id,
      tags: ['nextjs', 'react', 'web-development', 'ssr', 'ssg'],
      views: 245,
    },
    {
      title: 'The Future of Cloud Computing in 2024',
      slug: 'future-cloud-computing-2024',
      excerpt: 'Explore the emerging trends in cloud computing and how they will shape the technology landscape in 2024 and beyond.',
      content: `# The Future of Cloud Computing in 2024

Cloud computing continues to evolve at a rapid pace, bringing new opportunities and challenges for businesses worldwide. Let's explore the key trends shaping the future of cloud technology.

## Major Trends to Watch

### 1. Multi-Cloud and Hybrid Strategies
Organizations are increasingly adopting multi-cloud strategies to avoid vendor lock-in and optimize performance.

**Benefits of Multi-Cloud:**
- Reduced vendor dependence
- Improved resilience
- Cost optimization
- Best-of-breed services

### 2. Edge Computing Integration
The convergence of cloud and edge computing is enabling:
- Lower latency applications
- Better data processing at source
- Enhanced IoT capabilities
- Improved user experiences

### 3. AI and Machine Learning Integration
Cloud providers are making AI/ML more accessible through:
- Pre-trained models
- AutoML capabilities
- Simplified deployment
- Cost-effective scaling

## Security Considerations

As cloud adoption grows, security remains paramount:

\`\`\`yaml
# Example security policy
security:
  encryption:
    at_rest: true
    in_transit: true
  access_control:
    zero_trust: enabled
    mfa: required
\`\`\`

## Conclusion

The cloud computing landscape in 2024 will be characterized by increased sophistication, better integration, and enhanced security. Organizations that adapt to these trends will gain significant competitive advantages.`,
      published: true,
      categoryId: categories[3].id,
      authorId: adminUser.id,
      tags: ['cloud-computing', 'technology', 'trends', 'multi-cloud', 'edge-computing'],
      views: 189,
    },
    {
      title: 'Digital Transformation Strategies for Modern Businesses',
      slug: 'digital-transformation-strategies-modern-businesses',
      excerpt: 'Learn how businesses can successfully navigate digital transformation with proven strategies and best practices.',
      content: `# Digital Transformation Strategies for Modern Businesses

Digital transformation is no longer optional—it's essential for business survival and growth in today's competitive landscape.

## Understanding Digital Transformation

Digital transformation involves integrating digital technology into all areas of business, fundamentally changing how you operate and deliver value to customers.

### Key Components:
1. **Technology Infrastructure**
2. **Process Optimization**
3. **Cultural Change**
4. **Customer Experience**

## Strategic Approach

### Phase 1: Assessment and Planning
> Evaluate current state and define future vision

- Audit existing systems
- Identify pain points
- Set clear objectives
- Develop roadmap

### Phase 2: Implementation
Technology implementation should be gradual and well-planned:

\`\`\`mermaid
graph LR
A[Legacy Systems] --> B[Hybrid Approach]
B --> C[Cloud Migration]
C --> D[Modern Architecture]
\`\`\`

### Phase 3: Optimization
Continuous improvement and optimization ensure long-term success.

## Common Challenges

1. **Resistance to Change**
   - Solution: Change management and training
2. **Legacy System Integration**
   - Solution: API-first approach
3. **Budget Constraints**
   - Solution: Phased implementation

## Measuring Success

Key metrics to track:
- **Operational Efficiency**: Process automation percentage
- **Customer Satisfaction**: NPS scores
- **Revenue Impact**: Digital channel contribution
- **Employee Productivity**: Task completion rates

## Conclusion

Successful digital transformation requires a holistic approach combining technology, processes, and people. Start small, think big, and move fast.`,
      published: true,
      categoryId: categories[2].id,
      authorId: adminUser.id,
      tags: ['digital-transformation', 'business-strategy', 'technology', 'change-management'],
      views: 156,
    },
    {
      title: 'Getting Started with Microservices Architecture',
      slug: 'getting-started-microservices-architecture',
      excerpt: 'A comprehensive guide to understanding and implementing microservices architecture for scalable applications.',
      content: `# Getting Started with Microservices Architecture

Microservices architecture has become a popular approach for building scalable, maintainable applications. This guide will help you understand the fundamentals and get started.

## What are Microservices?

Microservices are small, independent services that communicate over well-defined APIs. Each service is:
- **Independently deployable**
- **Loosely coupled**
- **Organized around business capabilities**
- **Owned by a small team**

## Benefits of Microservices

### Scalability
Scale individual services based on demand:

\`\`\`yaml
services:
  user-service:
    replicas: 3
  order-service:
    replicas: 5
  payment-service:
    replicas: 2
\`\`\`

### Technology Diversity
Different services can use different technologies:
- User Service: Node.js
- Order Service: Python
- Payment Service: Java

### Fault Isolation
If one service fails, others continue to operate.

## Implementation Patterns

### 1. API Gateway Pattern
Central entry point for all client requests:

\`\`\`javascript
// API Gateway routing
const routes = {
  '/api/users/*': 'user-service',
  '/api/orders/*': 'order-service',
  '/api/payments/*': 'payment-service'
};
\`\`\`

### 2. Service Discovery
Services register themselves and discover others:

\`\`\`javascript
// Service registration
serviceRegistry.register({
  name: 'user-service',
  host: 'localhost',
  port: 3001,
  health: '/health'
});
\`\`\`

### 3. Circuit Breaker
Prevent cascading failures:

\`\`\`javascript
const circuitBreaker = new CircuitBreaker(callExternalService, {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000
});
\`\`\`

## Challenges and Solutions

| Challenge | Solution |
|-----------|----------|
| Data Consistency | Event sourcing, Saga pattern |
| Network Latency | Caching, Async communication |
| Monitoring | Distributed tracing, Centralized logging |
| Testing | Contract testing, Service virtualization |

## Best Practices

1. **Start with a Monolith**: Don't begin with microservices
2. **Domain-Driven Design**: Align services with business domains
3. **Database per Service**: Avoid shared databases
4. **Monitoring and Logging**: Implement comprehensive observability
5. **Security**: Implement service-to-service authentication

## Tools and Technologies

### Container Orchestration
- **Kubernetes**: Production-grade orchestration
- **Docker Swarm**: Simpler alternative

### Service Mesh
- **Istio**: Advanced traffic management
- **Linkerd**: Lightweight option

### Monitoring
- **Prometheus + Grafana**: Metrics and visualization
- **Jaeger**: Distributed tracing
- **ELK Stack**: Centralized logging

## Conclusion

Microservices offer significant benefits but come with complexity. Start small, learn from experience, and gradually evolve your architecture. Success depends on having the right team, tools, and organizational culture.`,
      published: false,
      categoryId: categories[1].id,
      authorId: adminUser.id,
      tags: ['microservices', 'architecture', 'scalability', 'distributed-systems'],
      views: 0,
    },
    {
      title: 'Modern DevOps Practices for Faster Development',
      slug: 'modern-devops-practices-faster-development',
      excerpt: 'Streamline your development workflow with modern DevOps practices including CI/CD, containerization, and infrastructure as code.',
      content: `# Modern DevOps Practices for Faster Development

DevOps has revolutionized how we build, deploy, and maintain software. Let's explore the modern practices that can accelerate your development workflow.

## Core DevOps Principles

### 1. Continuous Integration (CI)
Automatically build and test code changes:

\`\`\`yaml
# GitHub Actions CI workflow
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test
      - run: npm run build
\`\`\`

### 2. Continuous Deployment (CD)
Automate deployments to different environments:

\`\`\`yaml
# Deployment pipeline
deploy:
  needs: test
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'
  steps:
    - name: Deploy to production
      run: |
        kubectl apply -f k8s/
        kubectl rollout status deployment/app
\`\`\`

## Infrastructure as Code (IaC)

Manage infrastructure through code:

\`\`\`hcl
# Terraform example
resource "aws_instance" "web" {
  ami           = "ami-0c02fb55956c7d316"
  instance_type = "t3.micro"
  
  tags = {
    Name = "WebServer"
    Environment = "production"
  }
}
\`\`\`

### Benefits:
- **Version Control**: Track infrastructure changes
- **Reproducibility**: Consistent environments
- **Automation**: Reduce manual errors
- **Documentation**: Code serves as documentation

## Containerization Best Practices

### Docker Multi-stage Builds
Optimize container images:

\`\`\`dockerfile
# Multi-stage Dockerfile
FROM node:16 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

### Kubernetes Deployment
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-app
        image: myapp:latest
        ports:
        - containerPort: 3000
\`\`\`

## Monitoring and Observability

### The Three Pillars

1. **Metrics**: Quantitative measurements
2. **Logs**: Event records
3. **Traces**: Request flows

### Implementation Example
\`\`\`javascript
// Application monitoring
const prometheus = require('prom-client');

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

app.use((req, res, next) => {
  const timer = httpRequestDuration.startTimer({
    method: req.method,
    route: req.route?.path || req.path
  });
  
  res.on('finish', () => {
    timer({ status: res.statusCode });
  });
  
  next();
});
\`\`\`

## Security in DevOps (DevSecOps)

### Security Scanning
\`\`\`yaml
# Security scanning in CI
security-scan:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v2
    - name: Run security scan
      run: |
        npm audit
        docker run --rm -v "$PWD:/app" securecodewarrior/semgrep
\`\`\`

### Best Practices:
- **Shift Left**: Security early in development
- **Automated Scanning**: Vulnerability detection
- **Secrets Management**: Secure credential storage
- **Compliance**: Automated compliance checks

## Tools and Technologies

### CI/CD Platforms
- **GitHub Actions**: Integrated with GitHub
- **GitLab CI**: Full DevOps platform
- **Jenkins**: Extensible automation server
- **Azure DevOps**: Microsoft's solution

### Monitoring Solutions
- **Prometheus + Grafana**: Open-source monitoring
- **Datadog**: Comprehensive monitoring platform
- **New Relic**: Application performance monitoring
- **ELK Stack**: Elasticsearch, Logstash, Kibana

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- Set up version control
- Implement basic CI
- Containerize applications

### Phase 2: Automation (Weeks 3-4)
- Automate deployments
- Infrastructure as Code
- Basic monitoring

### Phase 3: Optimization (Weeks 5-8)
- Advanced monitoring
- Security integration
- Performance optimization

### Phase 4: Culture (Ongoing)
- Team training
- Process improvement
- Continuous learning

## Measuring Success

Key Performance Indicators (KPIs):
- **Lead Time**: Idea to production
- **Deployment Frequency**: How often you deploy
- **Mean Time to Recovery**: Time to fix issues
- **Change Failure Rate**: Percentage of failed deployments

## Conclusion

Modern DevOps practices enable faster, more reliable software delivery. Start with the basics, automate incrementally, and focus on continuous improvement. Remember: DevOps is as much about culture as it is about tools.`,
      published: true,
      categoryId: categories[1].id,
      authorId: adminUser.id,
      tags: ['devops', 'ci-cd', 'automation', 'containerization', 'kubernetes'],
      views: 312,
    },
  ];

  // Create blog posts
  const createdPosts = await Promise.all(
    posts.map(async (post) => {
      return await prisma.post.create({
        data: {
          ...post,
          readingTime: Math.ceil(post.content.split(' ').length / 200), // Rough estimate
        },
      });
    })
  );

  console.log('Created posts:', createdPosts.map(p => p.title));

  // Create guest users for comments
  const guestUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john@example.com',
        name: 'John Developer',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarah@example.com',
        name: 'Sarah Wilson',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'mike@example.com',
        name: 'Mike Chen',
        role: 'USER',
      },
    }),
  ]);

  console.log('Created guest users for comments');

  // Create some sample comments
  const comments = [
    {
      content: 'Great article! Very informative and well-written.',
      authorId: guestUsers[0].id,
      postId: createdPosts[0].id,
      approved: true,
    },
    {
      content: 'This helped me understand Next.js better. Thanks for sharing!',
      authorId: guestUsers[1].id,
      postId: createdPosts[0].id,
      approved: true,
    },
    {
      content: 'Looking forward to more articles about cloud computing.',
      authorId: guestUsers[2].id,
      postId: createdPosts[1].id,
      approved: true,
    },
  ];

  const createdComments = await Promise.all(
    comments.map(async (comment) => {
      return await prisma.comment.create({
        data: comment,
      });
    })
  );

  console.log('Created comments:', createdComments.length);

  // Create a sample contact
  await prisma.contact.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@company.com',
      subject: 'Partnership Inquiry',
      message: 'Hello, I would like to discuss a potential partnership opportunity with AETech. Please get in touch when convenient.',
    },
  });

  console.log('Created sample contact');
  console.log('Database seeding completed successfully! 🎉');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
