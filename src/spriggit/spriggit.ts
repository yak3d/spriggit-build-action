import { downloadFileToDestination } from '../http/http.js'
import { unzipFile } from '../zip/unzip.js'
import { exec } from 'node:child_process'
import path from 'path'
import * as fs from 'node:fs'

const spriggitZipName = `SpriggitLinuxCLI.zip`
const spriggitZipPath = path.join('./', spriggitZipName)
const spriggitPath = path.join('./', 'spriggit')
const spriggitCli = path.join(spriggitPath, 'Spriggit.CLI')

export const downloadSpriggit = async (version: string) => {
  const url = `https://github.com/Mutagen-Modding/Spriggit/releases/download/${version}/${spriggitZipName}`

  try {
    console.log(`Downloading Spriggit ${version} to ${spriggitZipPath}`)
    await downloadFileToDestination(url, spriggitZipPath)
    console.log(`Successfully downloaded Spriggit ${version}`)

    console.log(`Extracting spriggit to ${spriggitPath}`)
    await unzipFile(spriggitZipPath, spriggitPath)
    console.log(`Spriggit extracted successfully`)

    console.log(`Giving +x permission to ${spriggitZipPath}`)
    fs.chmodSync(spriggitCli, '755')
  } catch (error) {
    console.error(`There was an error downloading Spriggit`, error)
  }
}

export const buildPlugin = async (pluginPath: string, pluginDest: string) => {
  console.log(
    `Building the plugin ${pluginDest} using the source at ${pluginPath}`
  )

  if (!fs.existsSync(spriggitCli)) {
    console.error(`spriggit was not found at ${spriggitCli}`)
    throw Error(`spriggit was not found at ${spriggitCli}`)
  }

  if (fs.existsSync(pluginDest)) {
    console.error(
      `Plugin was already found at ${pluginDest}, cowardly not overwriting`
    )

    throw Error(`Plugin was already found at ${pluginDest}`)
  }

  exec(
    spriggitCli +
      ` deserialize --InputPath "${pluginPath}" --OutputPath "${pluginDest}"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(
          `There was an error running ${spriggitCli}, see stderr below`
        )
        console.log(stdout)
        console.error(`stderr: ${stderr}`)
        throw error
      }

      console.log(stdout)
      console.error(stderr)
    }
  )
}
