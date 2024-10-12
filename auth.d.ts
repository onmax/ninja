declare module '#auth-utils' {
  interface User {
    discordId: string
    email: string
    avatar: string
    username: string
    locale: string
  }

  interface UserSession {
    // Add your own fields
  }

  interface SecureSessionData {
    // Add your own fields
  }
}

export {}
