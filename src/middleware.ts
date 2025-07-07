import NextAuth from 'next-auth'

import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from '../routes'
import authConfig from './lib/auth.config'

const { auth } = NextAuth(authConfig)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//    @ts-expect-error
export default auth(async function middleware(req) {
  const { nextUrl } = req

  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user.role
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  // console.log(nextUrl.pathname)
  if (isApiAuthRoute) {
    return null
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }

    return null
  }

  // if (!isLoggedIn && !isPublicRoute) {
  //   return Response.redirect(new URL('/login', nextUrl))
  // }
  if (!isLoggedIn && !isPublicRoute) {
    const callbackUrl = nextUrl.pathname + nextUrl.search

    return Response.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`, nextUrl))
  }

  if (nextUrl.pathname.startsWith('/divisi/') && userRole !== 'DIVISI') {
    return Response.redirect(new URL(`/home`, nextUrl))
  }
})

export const config = {
  // matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}
