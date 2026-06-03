import { useState } from 'react'

// Template for form fields
interface FormFields {
  name: string
  phone: string
  email: string
  jobDate: string
  description: string
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function WarrantyForm() {
  const [formData, setFormData] = useState<FormFields>({
    name: '',
    phone: '',
    email: '',
    jobDate: '',
    description: '',
  })

  const [status, setStatus] = useState<Status>('idle')

  // Function for handling changes made to the warranty request form
  // 'Duck typed' form data handler
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  
  // Handle the form submission.
  // Ensure the page doesn't reload once submission is attempted
  // and post the form to formspree.io which will send an email
  // to business owner with the form information
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')

    try {
      const response = await fetch('https://formspree.io/f/mbdbnklq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      setStatus(response.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  // Front end representation of form
  return (
    <div className="flex justify-center px-6 py-16">
      <div className="bg-white/90 rounded-2xl shdow-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Warranty Request
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Please describe the issue and we will reach out.
        </p>

        {status === 'success' ? (
          <p className="text-green-600 font-medium text-center py-8">
            Your request has been submitted! We will be in touch shortly.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Job Date</label>
              <input
                type="date"
                name="jobDate"
                required
                value={formData.jobDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description of Issue</label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
            </div>

            {status === 'error' && (
              <p className="text-red-500 text-sm">
                Something went wrong. Please try again or email us directly at info@clearwaterpainting.ca.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-black font-semibold py-2 rounded-lg transition-colors"
            >
              {status === 'submitting' ? 'Submitting...' : 'Submit Request'}
            </button>

          </form>
        )}

      </div>
    </div>
  )

}