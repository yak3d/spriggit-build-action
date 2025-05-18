import * as core from '@actions/core'
import console from 'console'
import { buildPlugin, downloadSpriggit } from './spriggit/spriggit.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const source = core.getInput('source')
    const destination = core.getInput('destination')
    const spriggitVersion = core.getInput('spriggitVersion')

    console.log(`Using the esp/esm data at '${source}' to build the plugin`)
    console.log(`Using Spriggit version ${spriggitVersion}`)

    await downloadSpriggit(spriggitVersion)

    await buildPlugin(source, destination)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
