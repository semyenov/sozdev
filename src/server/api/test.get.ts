export default defineEventHandler(async (event) => {
  const { name } = getQuery(event)
  return {
    text: `Hello, ${name}! Vue.js makes the animations and transitions
incredibly easy to implement. So you should really use this opportunity
to give a little spark to your application/website to shine. Nuxt.js already
builds on the provided capabilities of Vue.js. It gives you a possibility
to create a very simple transitions between the pages very fast and almost
for no effort.`,
  }
})
