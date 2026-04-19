'use client'

import { Topbar } from '@/components/topbar'
import { CalendarWidget } from '@/components/calendar-widget'

export default function DoctorCalendarPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Kalendari Im" />
      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-2xl">
          <CalendarWidget filterDoctor="Dr. Andi Hoxha" />
        </div>
      </div>
    </div>
  )
}
