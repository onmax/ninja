import consola from 'consola'

export default defineOAuthDiscordEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user }) {
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
    return sendRedirect(event, '/')
  },
})
