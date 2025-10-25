import { SessionProvider } from './SessionProvider'

export const metadata = {
  title: 'Auth App',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', background: '#f5f5f5' }}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
