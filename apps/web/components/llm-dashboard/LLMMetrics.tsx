'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

interface LLMMetric {
  label: string
  value: string | number
  description?: string
}

export function LLMMetrics() {
  const [metrics, setMetrics] = useState<LLMMetric[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real implementation, this would fetch from PostHog API
    // For now, we'll show placeholder data
    const placeholderMetrics: LLMMetric[] = [
      {
        label: 'Total Requests',
        value: '0',
        description: 'Total LLM API calls',
      },
      {
        label: 'Average Latency',
        value: '0ms',
        description: 'Average response time',
      },
      {
        label: 'Error Rate',
        value: '0%',
        description: 'Percentage of failed requests',
      },
      {
        label: 'Token Usage',
        value: '0',
        description: 'Total tokens consumed',
      },
    ]

    setMetrics(placeholderMetrics)
    setLoading(false)
  }, [])

  if (loading) {
    return <div>Loading metrics...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            {metric.description && (
              <CardDescription className="text-xs text-muted-foreground">
                {metric.description}
              </CardDescription>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function LLMDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">LLM Observability</h2>
        <p className="text-muted-foreground">
          Monitor your LLM usage and performance metrics
        </p>
      </div>
      
      <LLMMetrics />
      
      <Card>
        <CardHeader>
          <CardTitle>Configuration Status</CardTitle>
          <CardDescription>
            PostHog LLM tracing configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tracing Enabled:</span>
              <span className="font-mono">
                {process.env.POSTHOG_LLM_TRACING_ENABLED === 'true' ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>PostHog Host:</span>
              <span className="font-mono text-muted-foreground">
                {process.env.NEXT_PUBLIC_POSTHOG_HOST || 'Not configured'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>
            Enable LLM observability in your environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>To start tracking LLM metrics:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Set <code className="font-mono bg-muted px-1">POSTHOG_LLM_TRACING_ENABLED=true</code> in your .env file</li>
              <li>Ensure PostHog API keys are configured</li>
              <li>Restart your development server</li>
              <li>View metrics in your PostHog dashboard</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}