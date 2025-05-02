import type React from 'react'
import {
  Brain,
  Eye,
  Heart,
  Repeat,
  Tag,
  Filter,
  AlertCircle,
  User,
  ArrowRight,
} from 'lucide-react'

interface DistortionIllustrationProps {
  type: string
}

export const DistortionIllustration = ({ type }: DistortionIllustrationProps) => {
  const illustrations: Record<string, React.ReactNode> = {
    catastrophizing: <CatastrophizingIllustration />,
    'all-or-nothing': <AllOrNothingIllustration />,
    'mind-reading': <MindReadingIllustration />,
    'emotional-reasoning': <EmotionalReasoningIllustration />,
    overgeneralization: <OvergeneralizationIllustration />,
    labeling: <LabelingIllustration />,
    filtering: <FilteringIllustration />,
    'should-statements': <ShouldStatementsIllustration />,
    personalization: <PersonalizationIllustration />,
    'jumping-to-conclusions': <JumpingToIllustration />,
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      {illustrations[type]}
    </div>
  )
}

const CatastrophizingIllustration = () => {
  return (
    <div className="text-center">
      <div className="relative inline-block">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-4 mx-auto">
          <AlertCircle className="w-16 h-16 text-purple-500" />
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center animate-pulse">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <div
          className="absolute -bottom-2 -left-2 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center animate-pulse"
          style={{ animationDelay: '0.5s' }}
        >
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">
        Seeing small problems as major catastrophes
      </p>
    </div>
  )
}

const AllOrNothingIllustration = () => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-4 mb-4">
        <div className="w-24 h-24 rounded-full bg-black dark:bg-white flex items-center justify-center">
          <span className="text-white dark:text-black text-2xl font-bold">
            0%
          </span>
        </div>
        <div className="text-2xl font-bold text-slate-600 dark:text-slate-300">
          or
        </div>
        <div className="w-24 h-24 rounded-full bg-white dark:bg-black border-2 border-black dark:border-white flex items-center justify-center">
          <span className="text-black dark:text-white text-2xl font-bold">
            100%
          </span>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">
        Seeing things in black and white with no middle ground
      </p>
    </div>
  )
}

const MindReadingIllustration = () => {
  return (
    <div className="text-center">
      <div className="relative inline-block">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-4 mx-auto">
          <Brain className="w-16 h-16 text-purple-500" />
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center border border-purple-200 dark:border-purple-800">
          <Eye className="w-8 h-8 text-purple-500" />
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">
        Assuming you know what others are thinking
      </p>
    </div>
  )
}

const EmotionalReasoningIllustration = () => {
  return (
    <div className="text-center">
      <div className="relative inline-block">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-4 mx-auto">
          <Heart className="w-16 h-16 text-purple-500" />
        </div>
        <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center border border-purple-200 dark:border-purple-800">
          <span className="text-purple-500 text-xl font-bold">=</span>
        </div>
        <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center border border-purple-200 dark:border-purple-800">
          <span className="text-purple-500 text-xl font-bold">?</span>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">
        Believing feelings are facts
      </p>
    </div>
  )
}

const OvergeneralizationIllustration = () => {
  return (
    <div className="text-center">
      <div className="relative inline-block">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-4 mx-auto">
          <Repeat className="w-16 h-16 text-purple-500" />
        </div>
        <div className="absolute -top-2 -right-2 flex items-center">
          <span className="text-purple-500 text-sm font-bold">1</span>
          <ArrowRight className="w-4 h-4 text-purple-500" />
          <span className="text-purple-500 text-sm font-bold">∞</span>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">
        Taking one instance and applying it to everything
      </p>
    </div>
  )
}

const LabelingIllustration = () => {
  return (
    <div className="text-center">
      <div className="relative inline-block">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-4 mx-auto">
          <User className="w-16 h-16 text-purple-500" />
        </div>
        <div className="absolute -top-2 -right-2 w-16 h-8 bg-white/80 dark:bg-slate-800/80 flex items-center justify-center border border-purple-200 dark:border-purple-800 rounded-md">
          <Tag className="w-4 h-4 text-purple-500 mr-1" />
          <span className="text-purple-500 text-xs font-bold">LABEL</span>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">
        Defining yourself or others by mistakes or flaws
      </p>
    </div>
  )
}

const FilteringIllustration = () => {
  return (
    <div className="text-center">
      <div className="relative inline-block">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-4 mx-auto">
          <Filter className="w-16 h-16 text-purple-500" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-red-200 dark:bg-red-900/30 flex items-center justify-center">
          <span className="text-red-500 text-xs font-bold">-</span>
        </div>
        <div className="absolute bottom-1/4 right-1/4 w-8 h-8 rounded-full bg-green-200 dark:bg-green-900/30 flex items-center justify-center opacity-30">
          <span className="text-green-500 text-xs font-bold">+</span>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">
        Focusing only on the negative aspects
      </p>
    </div>
  )
}

const ShouldStatementsIllustration = () => {
  return (
    <div className="text-center">
      <div className="relative inline-block">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-4 mx-auto">
          <div className="text-purple-500 text-2xl font-bold">SHOULD</div>
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center border border-purple-200 dark:border-purple-800">
          <span className="text-purple-500 text-xs font-bold">MUST</span>
        </div>
        <div className="absolute -bottom-2 -left-2 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center border border-purple-200 dark:border-purple-800">
          <span className="text-purple-500 text-xs font-bold">OUGHT</span>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">
        Imposing rigid rules on yourself and others
      </p>
    </div>
  )
}

const PersonalizationIllustration = () => {
  return (
    <div className="text-center">
      <div className="relative inline-block">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-4 mx-auto">
          <User className="w-16 h-16 text-purple-500" />
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center border border-purple-200 dark:border-purple-800">
          <span className="text-purple-500 text-xs font-bold">MY FAULT</span>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">
        Taking responsibility for things outside your control
      </p>
    </div>
  )
}

const JumpingToIllustration = () => {
  return (
    <div className="text-center">
      <div className="relative inline-block">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-4 mx-auto">
          <div className="flex flex-col items-center">
            <span className="text-purple-500 text-xl font-bold">A</span>
            <ArrowRight className="w-8 h-8 text-purple-500 transform rotate-90" />
            <span className="text-purple-500 text-xl font-bold">Z</span>
          </div>
        </div>
        <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center border border-purple-200 dark:border-purple-800">
          <span className="text-purple-500 text-xs font-bold">?</span>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">
        Making negative interpretations without evidence
      </p>
    </div>
  )
}
