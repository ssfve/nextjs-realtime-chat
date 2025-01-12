import { NextAuthOptions } from 'next-auth'
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter'
import { db } from '@/lib/db'
import GoogleProvider from 'next-auth/providers/google'
import { fetchRedis } from '@/helpers/redis'
import { custom } from 'openid-client';

custom.setHttpOptionsDefaults({
  timeout: 35000,
});

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || clientId.length === 0) {
    throw new Error('Missing GOOGLE_CLIENT_ID')
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error('Missing GOOGLE_CLIENT_SECRET')
  }

  return { clientId, clientSecret }
}

export const authOptions: NextAuthOptions = {
  // adapter: UpstashRedisAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      console.log("in session")
      console.log(session)
      console.log("in session token")
      console.log(token)
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }

      return session
    },
    async jwt({ token, user }) {
      // return token
      console.log("fetchRedis")
      console.log(user)
      console.log(token)
      console.log(token.id)
      let dbUserResult = ''

      try {
        dbUserResult = await fetchRedis('get', `user:${token.id}`) as string
      } catch (error) {
        console.log(error)
        return token
      }
      console.log("dbUserResult")
      console.log(dbUserResult)
      if (!dbUserResult) {
        if (user) {
          token.id = user!.id
        }

        return token
      }

      const dbUser = JSON.parse(dbUserResult) as User

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
    redirect() {
      return '/dashboard'
    },
  },
}
