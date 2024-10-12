export default defineOAuthDiscordEventHandler({
  config: {
    emailRequired: true
  },
  async onSuccess(event, { user, tokens }) {
    console.log(({user}))
    await setUserSession(event, {
      user: {
        discordId: user.id,
        email: user.email,
        avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
        username: user.username,
        locale: user.locale
      }
    })
    return sendRedirect(event, '/')
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/')
  },
})