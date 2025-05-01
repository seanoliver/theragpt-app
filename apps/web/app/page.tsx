import {
  SmartphoneIcon as Android,
  Apple,
  ArrowRight,
  Brain,
  Calendar,
  CheckCircle,
  Sparkles,
  Volume2,
} from 'lucide-react'
import Image from 'next/image'
import { Footer } from '../components/footer'
import { WaitlistForm } from '../components/waitlist-form'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-0 lg:px-0 h-16 flex items-center justify-between border-b w-full">
        <div className="max-w-screen-xl mx-auto w-full flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-teal-500" />
            <span className="text-xl font-bold">TheraGPT</span>
          </div>
          {/* Button removed from header since it's now in the hero */}
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="max-w-screen-xl mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700">
                    Coming Soon
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Stay grounded. Stay focused. Stay{' '}
                    <span className="text-teal-600">TheraGPT</span>.
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    An AI-powered personal reflection and affirmation app
                    designed to help you become the person you desire to be.
                  </p>
                </div>

                <div className="w-full max-w-md space-y-2">
                  <WaitlistForm />
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Apple className="h-4 w-4" />
                    <span>iOS at launch</span>
                    <span className="mx-2">•</span>
                    <Android className="h-4 w-4" />
                    <span>Android coming soon</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-teal-600" />
                    <span>AI-Powered</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-teal-600" />
                    <span>Personalized</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-teal-600" />
                    <span>Daily Reminders</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[450px] w-[250px] overflow-hidden rounded-[40px] border-[8px] border-gray-800 shadow-xl">
                  <Image
                    src="/placeholder.svg?height=800&width=400"
                    alt="TheraGPT app preview"
                    className="object-cover"
                    fill
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-screen-xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Your Personal Manifesto
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Create and curate a hyper-personalized list of positive
                  statements, reminders, and affirmations.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                  <Brain className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">AI-Powered</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Intelligent suggestions and personalized affirmations based
                    on your goals and values.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Streaks & Records</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Track your progress with streaks and records to stay
                    motivated and accountable.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                  <Volume2 className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Audio Playback</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Listen to your affirmations with powerful audio playback
                    features for on-the-go reinforcement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="max-w-screen-xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  App Screenshots
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  A glimpse into the TheraGPT experience
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-3">
              <div className="relative mx-auto h-[500px] w-[250px] overflow-hidden rounded-[40px] border-[8px] border-gray-800 shadow-xl">
                <Image
                  src="/placeholder.svg?height=800&width=400"
                  alt="TheraGPT app dashboard"
                  className="object-cover"
                  fill
                />
              </div>
              <div className="relative mx-auto h-[500px] w-[250px] overflow-hidden rounded-[40px] border-[8px] border-gray-800 shadow-xl">
                <Image
                  src="/placeholder.svg?height=800&width=400"
                  alt="TheraGPT app affirmations"
                  className="object-cover"
                  fill
                />
              </div>
              <div className="relative mx-auto h-[500px] w-[250px] overflow-hidden rounded-[40px] border-[8px] border-gray-800 shadow-xl">
                <Image
                  src="/placeholder.svg?height=800&width=400"
                  alt="TheraGPT app progress"
                  className="object-cover"
                  fill
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-teal-50 dark:bg-teal-950">
          <div className="max-w-screen-xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Be the first to experience TheraGPT
                </h2>
                <p className="max-w-[600px] mx-auto text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  We're launching on iOS first, with Android coming soon after.
                  Join our waitlist today to get early access and exclusive
                  updates.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white shadow-sm dark:bg-gray-950">
                  <Apple className="h-10 w-10 text-teal-600" />
                  <h3 className="text-lg font-bold">iOS Launch</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    First release
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 hidden sm:block text-gray-400" />
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white shadow-sm dark:bg-gray-950">
                  <Android className="h-10 w-10 text-teal-600" />
                  <h3 className="text-lg font-bold">Android</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Coming soon after
                  </p>
                </div>
              </div>

              <div className="w-full max-w-md mx-auto mt-8 space-y-2">
                <WaitlistForm />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get notified when we launch and receive exclusive early
                  access.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
