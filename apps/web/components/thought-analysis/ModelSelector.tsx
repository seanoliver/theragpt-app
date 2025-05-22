'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/apps/web/components/ui/select'
import { LLMModel } from '@theragpt/llm'
import { Brain, Sparkles } from 'lucide-react'

interface ModelSelectorProps {
  selectedModel: LLMModel
  onModelChange: (model: LLMModel) => void
  disabled?: boolean
}

const MODEL_OPTIONS = [
  {
    value: LLMModel.CLAUDE_4_SONNET,
    label: 'Claude 4 Sonnet',
    description: 'Latest Claude model with superior reasoning',
    icon: <Brain className="h-4 w-4" />,
  },
  {
    value: LLMModel.CLAUDE_3_7_SONNET,
    label: 'Claude 3.7 Sonnet',
    description: 'Advanced Claude model with strong analytical capabilities',
    icon: <Brain className="h-4 w-4" />,
  },
  {
    value: LLMModel.GPT_4O,
    label: 'GPT 4o',
    description: 'OpenAI\'s latest multimodal model',
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    value: LLMModel.GPT_4,
    label: 'GPT 4.1',
    description: 'OpenAI\'s advanced reasoning model',
    icon: <Sparkles className="h-4 w-4" />,
  },
]

export const ModelSelector = ({
  selectedModel,
  onModelChange,
  disabled = false,
}: ModelSelectorProps) => {
  const selectedOption = MODEL_OPTIONS.find(
    option => option.value === selectedModel
  )

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
        AI Model
      </label>
      <Select
        value={selectedModel}
        onValueChange={(value: LLMModel) => onModelChange(value)}
        disabled={disabled}
      >
        <SelectTrigger className="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
          <SelectValue>
            <div className="flex items-center gap-2">
              {selectedOption?.icon}
              <span className="font-medium">{selectedOption?.label}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {MODEL_OPTIONS.map(option => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-start gap-3 py-1">
                <div className="mt-0.5">{option.icon}</div>
                <div className="flex flex-col">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {option.description}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}