export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Welcome to TheraGPT</h1>
        <p className="mb-4">
          A Cognitive Behavioral Therapy (CBT) application designed to help you
          identify cognitive distortions in your thoughts and reframe them in a
          more balanced way.
        </p>
        <div className="mt-8">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Get Started
          </button>
        </div>
      </div>
    </main>
  )
}