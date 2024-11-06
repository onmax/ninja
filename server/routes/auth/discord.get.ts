import consola from 'consola'

enum AuthError {
  NotGuilds = 'not-guilds',
  NotMember = 'not-a-member',
  Unknown = 'unknown',
}

export default defineOAuthDiscordEventHandler({
  config: {
    emailRequired: true,
    scope: ['identify email guilds'], // Add the guilds scope
  },
  async onSuccess(event, { user, tokens }) {
    // Step 1: Get the user's guilds
    const guilds = await $fetch<{ id: string }[]>('https://discord.com/api/users/@me/guilds', { headers: { Authorization: `Bearer ${tokens.access_token}` } })
    if (!guilds) {
      return sendRedirect(event, `/error?code=${AuthError.NotGuilds}`)
    }

    // Step 2: Check if the user is in the specific guild
    const requiredGuildId = useRuntimeConfig().discordGuildId
    const isMember = guilds.some(guild => guild.id === requiredGuildId)

    if (!isMember) {
      consola.warn('User not in the required Discord guild')
      return sendRedirect(event, `/error?code=${AuthError.NotMember}`)
    }

    // Step 3: Set user session if they are a member
    await setUserSession(event, {
      user: {
        discordId: user.id,
        email: user.email,
        avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
        username: user.username,
        locale: user.locale,
      },
    })

    return sendRedirect(event, '/')
  },
  onError(event, error) {
    consola.error('Discord OAuth error:', error)
    return sendRedirect(event, `/error?code=${AuthError.Unknown}`)
  },
})
