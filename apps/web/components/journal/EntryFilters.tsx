'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'

// Mock distortion types for filter
const distortionTypes = [
  'All Distortions',
  'Catastrophizing',
  'All-or-Nothing Thinking',
  'Mind Reading',
  'Jumping to Conclusions',
  'Should Statements',
  'Labeling',
]

export const EntryFilters = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [distortionFilter, setDistortionFilter] = useState('All Distortions')

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center">
        <Filter className="mr-2 h-5 w-5 text-purple-500" />
        Filter Entries
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
          <Input
            placeholder="Search journal entries..."
            className="pl-10 border-slate-200 dark:border-slate-700 focus:border-purple-300 dark:focus:border-purple-700 focus:ring-purple-300 dark:focus:ring-purple-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={distortionFilter} onValueChange={setDistortionFilter}>
          <SelectTrigger className="border-slate-200 dark:border-slate-700 focus:ring-purple-300 dark:focus:ring-purple-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <SelectValue placeholder="Filter by distortion" />
          </SelectTrigger>
          <SelectContent className="glass-panel">
            {distortionTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          className="border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
          onClick={() => {
            setSearchTerm('')
            setDistortionFilter('All Distortions')
          }}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  )
}