import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/navbar/Navbar'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { Footer } from '@/components/footer/Footer'
import { filterByPermissions } from '@/lib/permissions'
import { normalizeRole } from '@/lib/roles'
import { getNavigationByRole } from '@/registry/navigation'
import { authStore } from '@/store/authStore'
import { ChatWidget, type ThemeConfig } from '@joseantonionuevo/ai-chat-widget'
import { Sparkles } from 'lucide-react'
import { getAccessToken } from '@/services/tokenService'

const chatTheme: ThemeConfig = {
  primary: '#0a192f',
  primaryHover: '#16294d',
  background: '#f7f9fb',
  surface: '#ffffff',
  surfaceHover: '#eef1f4',
  text: '#1a1c1e',
  textSecondary: '#44474e',
  border: '#c4c6cf',
  userBubble: '#0a192f',
  userBubbleText: '#ffffff',
  assistantBubble: '#ffffff',
  assistantBubbleText: '#1a1c1e',
  error: '#ef4444',
  errorBg: '#fef2f2',
}

export function BaseLayout() {
  const user = authStore.user
  const role = normalizeRole(user?.role)
  const navConfig = getNavigationByRole(role)
  const items = filterByPermissions(navConfig?.items ?? [], user?.permissions)
  const basePath = navConfig?.basePath ?? '/'

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar items={items} basePath={basePath} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />

        <main className="min-h-0 flex-1 overflow-y-auto bg-color-surface">
          <Outlet />
        </main>

        <ChatWidget
          apiUrl="/api/chat"
          theme={chatTheme}
          title="Modern Trust AI Assistant"
          headerIcon={<Sparkles className='w-5 h-5' />}
          greeting={`Welcome to Modern Trust AI Assistant! 👋

I'm here to help you with anything related to your finances. Ask me about your **transactions**, **budgets**, **savings goals**, **investments**, or **financial insights** — I'll do my best to guide you.

How can I help you today?`}
          placeholder="Ask me anything about your finances..."
        />

        <Footer />
      </div>
    </div>
  )
}
