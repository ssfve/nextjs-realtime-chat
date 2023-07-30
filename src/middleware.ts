import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname
    console.log(pathname)
    // Manage route protection
    const isAuth = await getToken({ req })
    const isLoginPage = pathname.startsWith('/login')

    const sensitiveRoutes = ['/dashboard']
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.startsWith(route)
    )

    if (isLoginPage) {
      if (isAuth) {
        console.log('in logic 1')
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      console.log('return next')
      return NextResponse.next()
    }

    if (!isAuth && isAccessingSensitiveRoute) {
      console.log('in logic 3')
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (pathname === '/') {
      console.log('in logic 4')
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  },
  {
    callbacks: {
      async authorized() {
        return true
      },
    },
  }
)

export const config = {
  matchter: ['/', '/login', '/dashboard/:path*', '/api/:path*'],
}
