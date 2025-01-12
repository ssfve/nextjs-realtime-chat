import Providers from '@/components/Providers'
import './globals.css'

// Done after the video and optional: add page metadata
export const metadata = {
  title: 'Chat Place | Home',
  description: 'Welcome to the Chat Place',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
