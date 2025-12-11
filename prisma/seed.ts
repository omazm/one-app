import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

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

  const candidate5 = await prisma.candidate.upsert({
    where: { email: 'david.kim@email.com' },
    update: {},
    create: {
      name: 'David Kim',
      email: 'david.kim@email.com',
      phone: '(555) 567-8901',
    },
  })

  const candidate6 = await prisma.candidate.upsert({
    where: { email: 'lisa.nguyen@email.com' },
    update: {},
    create: {
      name: 'Lisa Nguyen',
      email: 'lisa.nguyen@email.com',
      phone: '(555) 678-9012',
    },
  })

  const candidate7 = await prisma.candidate.upsert({
    where: { email: 'james.smith@email.com' },
    update: {},
    create: {
      name: 'James Smith',
      email: 'james.smith@email.com',
      phone: '(555) 789-0123',
    },
  })

  const candidate8 = await prisma.candidate.upsert({
    where: { email: 'priya.patel@email.com' },
    update: {},
    create: {
      name: 'Priya Patel',
      email: 'priya.patel@email.com',
      phone: '(555) 890-1234',
    },
  })

  const candidate9 = await prisma.candidate.upsert({
    where: { email: 'carlos.martinez@email.com' },
    update: {},
    create: {
      name: 'Carlos Martinez',
      email: 'carlos.martinez@email.com',
      phone: '(555) 901-2345',
    },
  })

  const candidate10 = await prisma.candidate.upsert({
    where: { email: 'rachel.brown@email.com' },
    update: {},
    create: {
      name: 'Rachel Brown',
      email: 'rachel.brown@email.com',
      phone: '(555) 012-3456',
    },
  })

  console.log('Created 10 candidates')

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

  // Create pipeline entries
  const pipeline1 = await prisma.pipeline.create({
    data: {
      candidateId: candidate1.id,
      position: 'Senior Frontend Developer',
      stage: 'APPLIED',
    },
  })

  const pipeline2 = await prisma.pipeline.create({
    data: {
      candidateId: candidate2.id,
      position: 'Senior Frontend Developer',
      stage: 'SCREENING',
    },
  })

  const pipeline3 = await prisma.pipeline.create({
    data: {
      candidateId: candidate3.id,
      position: 'Product Manager',
      stage: 'INTERVIEW',
    },
  })

  const pipeline4 = await prisma.pipeline.create({
    data: {
      candidateId: candidate5.id,
      position: 'UX Designer',
      stage: 'INTERVIEW',
    },
  })

  const pipeline5 = await prisma.pipeline.create({
    data: {
      candidateId: candidate6.id,
      position: 'Senior Frontend Developer',
      stage: 'OFFER',
    },
  })

  console.log('Created pipelines:', { pipeline1, pipeline2, pipeline3, pipeline4, pipeline5 })

  // Create interview entries
  const interview1 = await prisma.interview.create({
    data: {
      candidateId: candidate3.id,
      position: 'Product Manager',
      date: new Date('2024-01-22'),
      time: '10:00 AM',
      interviewer: 'John Smith',
      location: 'Conference Room A',
      status: 'SCHEDULED',
      notes: 'First round technical interview',
    },
  })

  const interview2 = await prisma.interview.create({
    data: {
      candidateId: candidate5.id,
      position: 'UX Designer',
      date: new Date('2024-01-22'),
      time: '2:00 PM',
      interviewer: 'Sarah Davis',
      location: 'Zoom',
      status: 'SCHEDULED',
      notes: 'Portfolio review session',
    },
  })

  const interview3 = await prisma.interview.create({
    data: {
      candidateId: candidate2.id,
      position: 'Senior Frontend Developer',
      date: new Date('2024-01-20'),
      time: '11:00 AM',
      interviewer: 'Alex Turner',
      location: 'Conference Room B',
      status: 'COMPLETED',
      notes: 'Excellent technical skills demonstrated',
    },
  })

  console.log('Created interviews:', { interview1, interview2, interview3 })

  // Create offers
  const offer1 = await prisma.offer.create({
    data: {
      candidateId: candidate6.id,
      position: 'Senior Frontend Developer',
      salary: '$180,000',
      startDate: new Date('2024-02-15'),
      status: 'SENT',
      notes: 'Competitive package with equity options',
    },
  })

  const offer2 = await prisma.offer.create({
    data: {
      candidateId: candidate7.id,
      position: 'Backend Engineer',
      salary: '$160,000',
      startDate: new Date('2024-03-01'),
      status: 'DRAFT',
      notes: 'Pending final approval',
    },
  })

  const offer3 = await prisma.offer.create({
    data: {
      candidateId: candidate8.id,
      position: 'DevOps Engineer',
      salary: '$170,000',
      startDate: new Date('2024-02-01'),
      status: 'ACCEPTED',
      notes: 'Candidate accepted offer',
    },
  })

  console.log('Created offers:', { offer1, offer2, offer3 })

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
