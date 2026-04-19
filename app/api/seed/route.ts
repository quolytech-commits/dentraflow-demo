import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'

// Only allow in development or with secret token
export async function POST() {
  if (process.env.NODE_ENV === 'production' && !process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Not allowed in production.' }, { status: 403 })
  }

  try {
    // Clear existing data (order matters for foreign keys)
    await prisma.notification.deleteMany()
    await prisma.payment.deleteMany()
    await prisma.treatment.deleteMany()
    await prisma.appointment.deleteMany()
    await prisma.patient.deleteMany()
    await prisma.user.deleteMany()

    // Create users
    const adminHash = await hash('admin123', 12)
    const mjekHash = await hash('mjek123', 12)
    const recepsionHash = await hash('recepsion123', 12)
    const mjek2Hash = await hash('mjek2023', 12)
    const mjek3Hash = await hash('mjek2023', 12)

    const admin = await prisma.user.create({
      data: {
        id: 'user-admin',
        name: 'Admin Kryesor',
        email: 'admin@dentraflow.com',
        passwordHash: adminHash,
        role: 'admin',
        avatar: 'AK',
      },
    })

    const mjek1 = await prisma.user.create({
      data: {
        id: 'user-mjek1',
        name: 'Dr. Andi Hoxha',
        email: 'mjek@dentraflow.com',
        passwordHash: mjekHash,
        role: 'mjek',
        avatar: 'AH',
        specialty: 'Ortodonci',
      },
    })

    const recepsion = await prisma.user.create({
      data: {
        id: 'user-recepsion',
        name: 'Sara Kelmendi',
        email: 'recepsion@dentraflow.com',
        passwordHash: recepsionHash,
        role: 'recepsion',
        avatar: 'SK',
      },
    })

    const mjek2 = await prisma.user.create({
      data: {
        id: 'user-mjek2',
        name: 'Dr. Elira Musa',
        email: 'elira.musa@dentraflow.com',
        passwordHash: mjek2Hash,
        role: 'mjek',
        avatar: 'EM',
        specialty: 'Kirurgji Orale',
      },
    })

    const mjek3 = await prisma.user.create({
      data: {
        id: 'user-mjek3',
        name: 'Dr. Fatos Koci',
        email: 'fatos.koci@dentraflow.com',
        passwordHash: mjek3Hash,
        role: 'mjek',
        avatar: 'FK',
        specialty: 'Pedodonci',
      },
    })

    // Create patients
    const patients = await Promise.all([
      prisma.patient.create({
        data: {
          id: 'pat-1',
          name: 'Arta Berisha',
          age: 32,
          phone: '+355 69 123 4567',
          email: 'arta.berisha@email.com',
          status: 'ne_trajtim',
          lastVisit: new Date('2026-04-18'),
          doctorId: mjek1.id,
          notes: 'Pacienti ka ndjeshmëri ndaj anestezisë lokale.',
          medicalHistory: ['Diabeti tip 2', 'Hipertension'],
        },
      }),
      prisma.patient.create({
        data: {
          id: 'pat-2',
          name: 'Besnik Rama',
          age: 45,
          phone: '+355 69 234 5678',
          email: 'besnik.rama@email.com',
          status: 'ne_pritje',
          lastVisit: new Date('2026-04-15'),
          doctorId: mjek1.id,
          notes: 'Duhet kontrolluar presionin para ndërhyrjes.',
          medicalHistory: ['Hipertension'],
        },
      }),
      prisma.patient.create({
        data: {
          id: 'pat-3',
          name: 'Vjosa Gashi',
          age: 28,
          phone: '+355 69 345 6789',
          email: 'vjosa.gashi@email.com',
          status: 'perfunduar',
          lastVisit: new Date('2026-04-10'),
          doctorId: mjek2.id,
          notes: 'Pa probleme të veçanta.',
          medicalHistory: [],
        },
      }),
      prisma.patient.create({
        data: {
          id: 'pat-4',
          name: 'Driton Krasniqi',
          age: 52,
          phone: '+355 69 456 7890',
          email: 'driton.k@email.com',
          status: 'ne_pritje',
          lastVisit: new Date('2026-04-17'),
          doctorId: mjek1.id,
          notes: 'Kërkon narkozë të plotë.',
          medicalHistory: ['Alergji penicilina'],
        },
      }),
      prisma.patient.create({
        data: {
          id: 'pat-5',
          name: 'Lumnije Bajra',
          age: 39,
          phone: '+355 69 567 8901',
          email: 'lumnije.b@email.com',
          status: 'perfunduar',
          lastVisit: new Date('2026-04-12'),
          doctorId: mjek2.id,
          notes: 'Vizitë e rregullt kontrolli.',
          medicalHistory: [],
        },
      }),
      prisma.patient.create({
        data: {
          id: 'pat-6',
          name: 'Arben Morina',
          age: 61,
          phone: '+355 69 678 9012',
          email: 'arben.m@email.com',
          status: 'ne_trajtim',
          lastVisit: new Date('2026-04-19'),
          doctorId: mjek1.id,
          notes: 'Pacient i rregullt, bashkëpunues.',
          medicalHistory: ['Diabeti', 'Osteoporozë'],
        },
      }),
    ])

    const [p1, p2, p3, p4, p5, p6] = patients

    // Create treatments
    await Promise.all([
      prisma.treatment.create({ data: { patientId: p1.id, doctorId: mjek1.id, description: 'Mbushje dhëmbi', cost: 4500 } }),
      prisma.treatment.create({ data: { patientId: p1.id, doctorId: mjek1.id, description: 'Pastrimi profesional', cost: 2000 } }),
      prisma.treatment.create({ data: { patientId: p2.id, doctorId: mjek1.id, description: 'Ekstraksion', cost: 5000 } }),
      prisma.treatment.create({ data: { patientId: p2.id, doctorId: mjek1.id, description: 'Protezë', cost: 12000 } }),
      prisma.treatment.create({ data: { patientId: p3.id, doctorId: mjek2.id, description: 'Zbardhim dhëmbësh', cost: 3500 } }),
      prisma.treatment.create({ data: { patientId: p3.id, doctorId: mjek2.id, description: 'Pastrimi', cost: 2000 } }),
      prisma.treatment.create({ data: { patientId: p4.id, doctorId: mjek1.id, description: 'Implant dentar', cost: 25000 } }),
      prisma.treatment.create({ data: { patientId: p5.id, doctorId: mjek2.id, description: 'Korrigjim okluziv', cost: 3000 } }),
      prisma.treatment.create({ data: { patientId: p5.id, doctorId: mjek2.id, description: 'Mbushje', cost: 2000 } }),
      prisma.treatment.create({ data: { patientId: p6.id, doctorId: mjek1.id, description: 'Protezë e plotë', cost: 18000 } }),
    ])

    // Create appointments
    await Promise.all([
      prisma.appointment.create({ data: { id: 'appt-1', patientId: p1.id, doctorId: mjek1.id, date: '2026-04-20', time: '09:00', type: 'Kontroll', status: 'ne_trajtim' } }),
      prisma.appointment.create({ data: { id: 'appt-2', patientId: p2.id, doctorId: mjek1.id, date: '2026-04-20', time: '10:30', type: 'Ekstraksion', status: 'ne_pritje' } }),
      prisma.appointment.create({ data: { id: 'appt-3', patientId: p3.id, doctorId: mjek2.id, date: '2026-04-20', time: '11:00', type: 'Pastrimi', status: 'perfunduar' } }),
      prisma.appointment.create({ data: { id: 'appt-4', patientId: p4.id, doctorId: mjek1.id, date: '2026-04-21', time: '09:30', type: 'Implant', status: 'ne_pritje' } }),
      prisma.appointment.create({ data: { id: 'appt-5', patientId: p5.id, doctorId: mjek2.id, date: '2026-04-21', time: '14:00', type: 'Kontroll', status: 'ne_pritje' } }),
      prisma.appointment.create({ data: { id: 'appt-6', patientId: p6.id, doctorId: mjek1.id, date: '2026-04-22', time: '10:00', type: 'Protezë', status: 'ne_trajtim' } }),
      prisma.appointment.create({ data: { id: 'appt-7', patientId: p1.id, doctorId: mjek1.id, date: '2026-04-22', time: '12:00', type: 'Mbushje', status: 'ne_pritje' } }),
      prisma.appointment.create({ data: { id: 'appt-8', patientId: p2.id, doctorId: mjek2.id, date: '2026-04-23', time: '08:30', type: 'Kontroll', status: 'ne_pritje' } }),
    ])

    // Create payments
    await Promise.all([
      prisma.payment.create({ data: { patientId: p1.id, amount: 4500, status: 'paguar', service: 'Mbushje dhëmbi' } }),
      prisma.payment.create({ data: { patientId: p2.id, amount: 12000, status: 'papaguar', service: 'Protezë' } }),
      prisma.payment.create({ data: { patientId: p3.id, amount: 3500, status: 'paguar', service: 'Zbardhim' } }),
      prisma.payment.create({ data: { patientId: p4.id, amount: 25000, status: 'pjeserisht', service: 'Implant dentar' } }),
      prisma.payment.create({ data: { patientId: p5.id, amount: 2000, status: 'paguar', service: 'Kontroll + Pastrim' } }),
      prisma.payment.create({ data: { patientId: p6.id, amount: 18000, status: 'papaguar', service: 'Protezë e plotë' } }),
    ])

    return NextResponse.json({
      ok: true,
      message: 'Baza e të dhënave u mbush me të dhëna fillestare.',
      counts: {
        users: 5,
        patients: 6,
        treatments: 10,
        appointments: 8,
        payments: 6,
      },
    })
  } catch (err) {
    console.error('[SEED]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
