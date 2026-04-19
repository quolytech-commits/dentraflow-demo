export type Role = 'admin' | 'mjek' | 'recepsion'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar: string
  specialty?: string
}

export interface Patient {
  id: string
  name: string
  age: number
  phone: string
  email: string
  status: 'ne-pritje' | 'ne-trajtim' | 'perfunduar'
  lastVisit: string
  doctor: string
  treatments: string[]
  notes: string
  medicalHistory: string[]
}

export interface Appointment {
  id: string
  patientName: string
  doctorName: string
  date: string
  time: string
  type: string
  status: 'ne-pritje' | 'ne-trajtim' | 'perfunduar' | 'anuluar'
}

export interface Payment {
  id: string
  patientName: string
  amount: number
  date: string
  status: 'paguar' | 'papaguar' | 'pjeserisht'
  service: string
}

export const MOCK_CREDENTIALS: Record<string, { password: string; user: User }> = {
  'admin@dentraflow.com': {
    password: 'admin123',
    user: {
      id: '1',
      name: 'Admin Kryesor',
      email: 'admin@dentraflow.com',
      role: 'admin',
      avatar: 'AK',
    },
  },
  'mjek@dentraflow.com': {
    password: 'mjek123',
    user: {
      id: '2',
      name: 'Dr. Andi Hoxha',
      email: 'mjek@dentraflow.com',
      role: 'mjek',
      avatar: 'AH',
      specialty: 'Ortodonci',
    },
  },
  'recepsion@dentraflow.com': {
    password: 'recepsion123',
    user: {
      id: '3',
      name: 'Sara Kelmendi',
      email: 'recepsion@dentraflow.com',
      role: 'recepsion',
      avatar: 'SK',
    },
  },
}

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'Arta Berisha',
    age: 32,
    phone: '+355 69 123 4567',
    email: 'arta.berisha@email.com',
    status: 'ne-trajtim',
    lastVisit: '2026-04-18',
    doctor: 'Dr. Andi Hoxha',
    treatments: ['Mbushje dhëmbi', 'Pastrimi profesional'],
    notes: 'Pacienti ka ndjeshmëri ndaj anestezisë lokale.',
    medicalHistory: ['Diabeti tip 2', 'Hipertension'],
  },
  {
    id: 'p2',
    name: 'Besnik Rama',
    age: 45,
    phone: '+355 69 234 5678',
    email: 'besnik.rama@email.com',
    status: 'ne-pritje',
    lastVisit: '2026-04-15',
    doctor: 'Dr. Andi Hoxha',
    treatments: ['Ekstraksion', 'Protezë'],
    notes: 'Duhet kontrolluar presionin para ndërhyrjes.',
    medicalHistory: ['Hipertension'],
  },
  {
    id: 'p3',
    name: 'Vjosa Gashi',
    age: 28,
    phone: '+355 69 345 6789',
    email: 'vjosa.gashi@email.com',
    status: 'perfunduar',
    lastVisit: '2026-04-10',
    doctor: 'Dr. Elira Musa',
    treatments: ['Zbardhim dhëmbësh', 'Pastrimi'],
    notes: 'Pa probleme të veçanta.',
    medicalHistory: [],
  },
  {
    id: 'p4',
    name: 'Driton Krasniqi',
    age: 52,
    phone: '+355 69 456 7890',
    email: 'driton.k@email.com',
    status: 'ne-pritje',
    lastVisit: '2026-04-17',
    doctor: 'Dr. Andi Hoxha',
    treatments: ['Implant dentar'],
    notes: 'Kërkon narkozë të plotë.',
    medicalHistory: ['Alergji penicilina'],
  },
  {
    id: 'p5',
    name: 'Lumnije Bajra',
    age: 39,
    phone: '+355 69 567 8901',
    email: 'lumnije.b@email.com',
    status: 'perfunduar',
    lastVisit: '2026-04-12',
    doctor: 'Dr. Elira Musa',
    treatments: ['Korrigjim okluziv', 'Mbushje'],
    notes: 'Vizitë e rregullt kontrolli.',
    medicalHistory: [],
  },
  {
    id: 'p6',
    name: 'Arben Morina',
    age: 61,
    phone: '+355 69 678 9012',
    email: 'arben.m@email.com',
    status: 'ne-trajtim',
    lastVisit: '2026-04-19',
    doctor: 'Dr. Andi Hoxha',
    treatments: ['Protezë e plotë'],
    notes: 'Pacient i rregullt, bashkëpunues.',
    medicalHistory: ['Diabeti', 'Osteoporozë'],
  },
]

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'a1', patientName: 'Arta Berisha', doctorName: 'Dr. Andi Hoxha', date: '2026-04-20', time: '09:00', type: 'Kontroll', status: 'ne-trajtim' },
  { id: 'a2', patientName: 'Besnik Rama', doctorName: 'Dr. Andi Hoxha', date: '2026-04-20', time: '10:30', type: 'Ekstraksion', status: 'ne-pritje' },
  { id: 'a3', patientName: 'Vjosa Gashi', doctorName: 'Dr. Elira Musa', date: '2026-04-20', time: '11:00', type: 'Pastrimi', status: 'perfunduar' },
  { id: 'a4', patientName: 'Driton Krasniqi', doctorName: 'Dr. Andi Hoxha', date: '2026-04-21', time: '09:30', type: 'Implant', status: 'ne-pritje' },
  { id: 'a5', patientName: 'Lumnije Bajra', doctorName: 'Dr. Elira Musa', date: '2026-04-21', time: '14:00', type: 'Kontroll', status: 'ne-pritje' },
  { id: 'a6', patientName: 'Arben Morina', doctorName: 'Dr. Andi Hoxha', date: '2026-04-22', time: '10:00', type: 'Protezë', status: 'ne-trajtim' },
  { id: 'a7', patientName: 'Arta Berisha', doctorName: 'Dr. Andi Hoxha', date: '2026-04-22', time: '12:00', type: 'Mbushje', status: 'ne-pritje' },
  { id: 'a8', patientName: 'Besnik Rama', doctorName: 'Dr. Elira Musa', date: '2026-04-23', time: '08:30', type: 'Kontroll', status: 'ne-pritje' },
]

export const MOCK_PAYMENTS: Payment[] = [
  { id: 'pay1', patientName: 'Arta Berisha', amount: 4500, date: '2026-04-18', status: 'paguar', service: 'Mbushje dhëmbi' },
  { id: 'pay2', patientName: 'Besnik Rama', amount: 12000, date: '2026-04-17', status: 'papaguar', service: 'Protezë' },
  { id: 'pay3', patientName: 'Vjosa Gashi', amount: 3500, date: '2026-04-10', status: 'paguar', service: 'Zbardhim' },
  { id: 'pay4', patientName: 'Driton Krasniqi', amount: 25000, date: '2026-04-15', status: 'pjeserisht', service: 'Implant dentar' },
  { id: 'pay5', patientName: 'Lumnije Bajra', amount: 2000, date: '2026-04-12', status: 'paguar', service: 'Kontroll + Pastrim' },
  { id: 'pay6', patientName: 'Arben Morina', amount: 18000, date: '2026-04-19', status: 'papaguar', service: 'Protezë e plotë' },
]

export const MOCK_DOCTORS: User[] = [
  { id: 'd1', name: 'Dr. Andi Hoxha', email: 'andi.hoxha@dentraflow.com', role: 'mjek', avatar: 'AH', specialty: 'Ortodonci' },
  { id: 'd2', name: 'Dr. Elira Musa', email: 'elira.musa@dentraflow.com', role: 'mjek', avatar: 'EM', specialty: 'Kirurgji Orale' },
  { id: 'd3', name: 'Dr. Fatos Koci', email: 'fatos.koci@dentraflow.com', role: 'mjek', avatar: 'FK', specialty: 'Pedodonci' },
]
