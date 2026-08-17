import { useState } from 'react'
import { PageShell } from '@/components/common/PageShell'
import {
  ChevronDown,
  Headphones,
  LifeBuoy,
  Mail,
  MessageCircle,
  Send,
  Ticket,
} from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { FormInput, FormSelect, FormTextArea } from '@/components/form'
import { cn } from '@/lib/utils'

interface ContactValues {
  subject: string
  category: string
  message: string
}

interface Faq {
  question: string
  answer: string
}

const faqs: Faq[] = [
  {
    question: 'How do I link a new bank account?',
    answer:
      'Go to Accounts & Assets and click "Link New Account". Choose your bank, enter the account details, and follow the verification steps. Once verified, your account will appear on your dashboard within a few minutes.',
  },
  {
    question: 'How can I reset my password?',
    answer:
      'On the login page, click "Forgot password" and enter the email associated with your account. You will receive a secure reset link that expires within 30 minutes.',
  },
  {
    question: 'Is my money and data safe?',
    answer:
      'Yes. We use bank-grade 256-bit encryption, two-factor authentication, and never store your credentials. Your funds are held at regulated financial institutions and are protected by applicable deposit insurance schemes.',
  },
  {
    question: 'Why does my budget show as over the limit?',
    answer:
      'Budgets are recalculated at the end of each day. If a transaction was categorized after the limit was evaluated, your progress may appear temporarily over the limit until the next refresh.',
  },
  {
    question: 'How do I contact a financial advisor?',
    answer:
      'You can book a session with a dedicated advisor from the Support page by sending us a message, or reach our client care line anytime at +965 2220 3000.',
  },
  {
    question: 'How do I download my statements?',
    answer:
      'Navigate to the Reports page, select the period you want, and click "Export Report". Statements are generated as a PDF and emailed to your registered address.',
  },
]

const categoryOptions = [
  { label: 'Account & Login', value: 'account' },
  { label: 'Transactions', value: 'transactions' },
  { label: 'Budgets & Goals', value: 'budgets' },
  { label: 'Portfolio & Investing', value: 'portfolio' },
  { label: 'Security', value: 'security' },
  { label: 'Other', value: 'other' },
]

interface SupportTicket {
  id: string
  subject: string
  category: string
  status: 'Open' | 'In Progress' | 'Resolved'
  updated: string
}

const dummyTickets: SupportTicket[] = [
  { id: 'SUP-1042', subject: 'Unable to link my credit card', category: 'Account & Login', status: 'Open', updated: 'Today, 09:12' },
  { id: 'SUP-1031', subject: 'Question about investment options', category: 'Portfolio & Investing', status: 'In Progress', updated: 'Yesterday' },
  { id: 'SUP-1015', subject: 'Statement export not working', category: 'Transactions', status: 'Resolved', updated: 'Aug 02, 2026' },
]

const statusClass: Record<SupportTicket['status'], string> = {
  Open: 'bg-[#fdecec] text-red-600',
  'In Progress': 'bg-[#fff7e6] text-warning',
  Resolved: 'bg-[#e5f4f0] text-success',
}

export function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [tickets] = useState<SupportTicket[]>(dummyTickets)
  const [submitted, setSubmitted] = useState(false)

  const methods = useForm<ContactValues>({
    mode: 'onBlur',
    defaultValues: {
      subject: '',
      category: '',
      message: '',
    },
  })

  const onSubmit = methods.handleSubmit((values) => {
    console.log('Support ticket submitted:', values)
    setSubmitted(true)
    methods.reset()
  })

  return (
    <PageShell title="Support" subtitle="We're here to help you with anything you need">
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left: channels + FAQ */}
        <div className="grid gap-6 xl:col-span-2">
          {/* Contact channels */}
          <div className="grid gap-4 sm:grid-cols-3">
            <ChannelCard
              icon={Headphones}
              iconClass="bg-[#e8ecff] text-indigo-600"
              title="Call Us"
              lines={['+965 2220 3000', 'Sun – Thu, 8am – 8pm']}
            />
            <ChannelCard
              icon={Mail}
              iconClass="bg-[#e5f4f0] text-success"
              title="Email Us"
              lines={['support@moderntrust.com', 'We reply within 24 hours']}
            />
            <ChannelCard
              icon={MessageCircle}
              iconClass="bg-[#fff7e6] text-warning"
              title="Live Chat"
              lines={['Chat with our team', 'Average wait: under 2 min']}
            />
          </div>

          {/* FAQ */}
          <div className="rounded-2xl border border-outline/20 bg-surface p-6 shadow-soft">
            <div className="flex items-center gap-2">
              <LifeBuoy size={18} className="text-on-surface-variant" />
              <h2 className="text-base font-semibold text-on-surface">Frequently Asked Questions</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {faqs.map((faq, index) => (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-xl border border-outline/20"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex w-full items-center justify-between gap-3 bg-surface-container-low px-4 py-3 text-left"
                  >
                    <span className="text-sm font-semibold text-on-surface">{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={cn(
                        'shrink-0 text-on-surface-variant transition-transform duration-200',
                        openFaq === index && 'rotate-180',
                      )}
                    />
                  </button>
                  {openFaq === index && (
                    <p className="px-4 py-3 text-sm leading-relaxed text-on-surface-variant slide-down">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* My tickets */}
          <div className="rounded-2xl border border-outline/20 bg-surface p-6 shadow-soft">
            <div className="flex items-center gap-2">
              <Ticket size={18} className="text-on-surface-variant" />
              <h2 className="text-base font-semibold text-on-surface">Your Support Tickets</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex flex-col gap-2 rounded-xl border border-outline/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{ticket.subject}</p>
                    <p className="mt-0.5 text-xs text-on-surface-variant">
                      {ticket.id} · {ticket.category} · Updated {ticket.updated}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold',
                      statusClass[ticket.status],
                    )}
                  >
                    {ticket.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: contact form */}
        <div className="h-fit rounded-2xl border border-outline/20 bg-surface p-6 shadow-soft">
          <h2 className="text-base font-semibold text-on-surface">Send Us a Message</h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Describe your issue and we&apos;ll get back to you by email.
          </p>

          {submitted ? (
            <div className="mt-6 rounded-xl bg-[#e5f4f0] p-4 text-sm text-success">
              <p className="font-semibold">Message sent!</p>
              <p className="mt-1 text-success/80">
                Thanks for reaching out. Our team will reply to your email within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-3 text-sm font-semibold underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <FormProvider {...methods}>
              <form onSubmit={onSubmit} className="mt-6 grid gap-4">
                <FormInput
                  name="subject"
                  label="Subject"
                  placeholder="Brief summary of your issue"
                  rules={{ required: 'Subject is required' }}
                />
                <FormSelect
                  name="category"
                  label="Category"
                  options={categoryOptions}
                  rules={{ required: 'Please select a category' }}
                />
                <FormTextArea
                  name="message"
                  label="Message"
                  rows={6}
                  placeholder="Tell us what happened..."
                  rules={{
                    required: 'Message is required',
                    minLength: { value: 20, message: 'Please provide at least 20 characters' },
                  }}
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-[1rem] bg-on-surface px-5 py-2.5 text-sm font-semibold text-surface shadow-soft transition-all duration-150 hover:-translate-y-px"
                >
                  <Send size={16} />
                  Submit Request
                </button>
              </form>
            </FormProvider>
          )}
        </div>
      </div>
    </PageShell>
  )
}

function ChannelCard({
  icon: Icon,
  iconClass,
  title,
  lines,
}: {
  icon: typeof Headphones
  iconClass: string
  title: string
  lines: string[]
}) {
  return (
    <div className="rounded-2xl border border-outline/20 bg-surface p-5 shadow-soft">
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', iconClass)}>
        <Icon size={18} />
      </div>
      <p className="mt-3 font-semibold text-on-surface">{title}</p>
      {lines.map((line) => (
        <p key={line} className="mt-1 text-sm text-on-surface-variant">
          {line}
        </p>
      ))}
    </div>
  )
}
