'use client'

import { useState } from 'react'
import { FileText, Plus } from 'lucide-react'
import { Topbar } from '@/components/topbar'
import { MOCK_PATIENTS } from '@/lib/mock-data'

const INITIAL_NOTES = MOCK_PATIENTS
  .filter((p) => p.doctor === 'Dr. Andi Hoxha')
  .map((p) => ({ patientId: p.id, patientName: p.name, note: p.notes, date: p.lastVisit }))

export default function DoctorNotesPage() {
  const [notes, setNotes] = useState(INITIAL_NOTES)
  const [adding, setAdding] = useState(false)
  const [newNote, setNewNote] = useState('')

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Shënime Mjekësore" />
      <div className="flex-1 p-4 lg:p-6 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{notes.length} shënime</p>
          <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
            <Plus className="size-4" /><span>Shto Shënim</span>
          </button>
        </div>

        {adding && (
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <textarea rows={3} value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Shkruani shënimin klinik..." className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent resize-none placeholder:text-muted-foreground" />
            <div className="flex gap-2">
              <button onClick={() => { if (newNote.trim()) { setNotes([{ patientId: 'new', patientName: 'Shënim i ri', note: newNote, date: new Date().toISOString().split('T')[0] }, ...notes]); setNewNote(''); setAdding(false) } }} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Ruaj</button>
              <button onClick={() => setAdding(false)} className="px-4 py-2 rounded-xl border border-border text-foreground text-sm hover:bg-secondary transition-colors">Anulo</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {notes.map((n, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="font-semibold text-foreground">{n.patientName}</p>
                    <p className="text-xs text-muted-foreground">{n.date}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{n.note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
