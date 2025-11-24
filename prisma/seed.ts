import { PrismaClient } from '../lib/generated/prisma'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import mariadb from 'mariadb'

const poolConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'one_app',
  connectionLimit: 5,
};

const adapter = new PrismaMariaDb(poolConfig);
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting seed...')

  // Create candidates
  const candidate1 = await prisma.candidate.upsert({
    where: { email: 'sarah.chen@email.com' },
    update: {},
    create: {
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      phone: '(555) 123-4567',
    },
  })

  const candidate2 = await prisma.candidate.upsert({
    where: { email: 'mike.j@email.com' },
    update: {},
    create: {
      name: 'Mike Johnson',
      email: 'mike.j@email.com',
      phone: '(555) 234-5678',
    },
  })

  const candidate3 = await prisma.candidate.upsert({
    where: { email: 'emma.w@email.com' },
    update: {},
    create: {
      name: 'Emma Wilson',
      email: 'emma.w@email.com',
      phone: '(555) 345-6789',
    },
  })

  const candidate4 = await prisma.candidate.upsert({
    where: { email: 'alex.r@email.com' },
    update: {},
    create: {
      name: 'Alex Rodriguez',
      email: 'alex.r@email.com',
      phone: '(555) 456-7890',
    },
  })

  console.log('Created candidates:', { candidate1, candidate2, candidate3, candidate4 })

  // Get existing job postings
  const jobs = await prisma.jobPosting.findMany()
  
  if (jobs.length === 0) {
    console.log('No job postings found. Creating sample job postings...')
    
    const job1 = await prisma.jobPosting.create({
      data: {
        title: 'Senior Frontend Developer',
        department: 'Engineering',
        location: 'San Francisco, CA',
        salary: '$150K - $200K',
        description: 'We are looking for an experienced frontend developer...',
        status: 'ACTIVE',
        applicants: 2,
      },
    })

    const job2 = await prisma.jobPosting.create({
      data: {
        title: 'Product Manager',
        department: 'Product',
        location: 'Remote',
        salary: '$130K - $180K',
        description: 'Lead product strategy and development...',
        status: 'ACTIVE',
        applicants: 1,
      },
    })

    const job3 = await prisma.jobPosting.create({
      data: {
        title: 'UX Designer',
        department: 'Design',
        location: 'New York, NY',
        salary: '$120K - $160K',
        description: 'Create beautiful user experiences...',
        status: 'ACTIVE',
        applicants: 1,
      },
    })

    jobs.push(job1, job2, job3)
    console.log('Created job postings')
  }

  // Create applications
  const application1 = await prisma.application.create({
    data: {
      candidateId: candidate1.id,
      jobId: jobs[0].id,
      status: 'NEW',
      appliedDate: new Date('2024-01-15'),
      notes: 'Strong background in React and TypeScript',
    },
  })

  const application2 = await prisma.application.create({
    data: {
      candidateId: candidate2.id,
      jobId: jobs[0].id,
      status: 'REVIEWING',
      appliedDate: new Date('2024-01-14'),
      notes: '5 years of frontend experience',
    },
  })

  const application3 = await prisma.application.create({
    data: {
      candidateId: candidate3.id,
      jobId: jobs.length > 1 ? jobs[1].id : jobs[0].id,
      status: 'SHORTLISTED',
      appliedDate: new Date('2024-01-13'),
      notes: 'Excellent product management skills',
    },
  })

  const application4 = await prisma.application.create({
    data: {
      candidateId: candidate4.id,
      jobId: jobs.length > 2 ? jobs[2].id : jobs[0].id,
      status: 'REJECTED',
      appliedDate: new Date('2024-01-12'),
      notes: 'Portfolio does not match requirements',
    },
  })

  console.log('Created applications:', { application1, application2, application3, application4 })

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
