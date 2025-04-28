import { Input } from './ui/input'
import { Button } from './ui/button'

const FORMSPARK_ACTION_URL = 'https://submit-form.com/34YMkjVX7'

export const WaitlistForm = () => {
  return (
    <form
      action={FORMSPARK_ACTION_URL}
      className="flex flex-col sm:flex-row gap-2"
    >
      <Input placeholder="Enter your email" type="email" className="flex-1" />
      <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-md">
        Join Waitlist
      </Button>
    </form>
  )
}
