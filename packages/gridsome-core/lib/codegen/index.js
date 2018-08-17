const fs = require('fs-extra')
const generateRoutes = require('./generateRoutes')

module.exports = async (service, filename = null) => {
  const files = {
    'routes.js': () => generateRoutes(service.routerData),
    'now.js': () => `export default ${Date.now()}`
  }

  const outputFile = async filename => {
    const content = await files[filename](service)
    await fs.outputFile(`${service.config.tmpDir}/${filename}`, content)
  }

  if (filename) {
    await outputFile(filename)
  } else {
    await fs.remove(service.config.tmpDir)

    for (const filename in files) {
      await outputFile(filename)
    }
  }
}
