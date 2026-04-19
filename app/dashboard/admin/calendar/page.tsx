'use client'

import { Topbar } from '@/components/topbar'
import { CalendarWidget } from '@/components/calendar-widget'

export default function AdminCalendarPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Kalendari Global" />
      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-2xl">
          <CalendarWidget />
        </div>
      </div>
    </div>
  )
}
