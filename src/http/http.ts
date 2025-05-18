import * as fs from 'fs'
import path from 'path'
import { default as followRedirects } from 'follow-redirects'
const { https } = followRedirects

interface FileFetchResponse {
  arrayBuffer: () => Promise<Buffer>
}

/**
 * Downloads the file at the given URL
 * @param url the URL to the file to be downloaded
 */
const downloadFile = (url: string) => {
  return new Promise(
    (
      resolve: (value: FileFetchResponse) => void,
      reject: (reason?: Error) => void
    ) => {
      const data: Buffer[] = []

      console.log(`Downloading file at url ${url}`)

      https
        .request(url, (connection) => {
          if (connection.errored) {
            reject(connection.errored)
          }
          connection.on('data', (chunk: Buffer) => data.push(chunk))
          connection.on('end', () => {
            const bytes = Buffer.concat(data)

            resolve({
              arrayBuffer: async (): Promise<Buffer> => bytes
            })
          })

          connection.on('error', (e) => reject(e))
        })
        .end()
    }
  )
}

/**
 * Creates the destination directory if it exists. You can pass an entire file
 * path to it but it will only create the directory part of it.
 * @param destination destination you want to create the directory for
 */
function createDirectory(destination: string) {
  const dir = path.dirname(destination)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

/**
 * Downloads the file at `url` and saves it to `destination`
 * @param url the URL of the file to download
 * @param destination where to save the file
 */
export const downloadFileToDestination = async (
  url: string,
  destination: string
) => {
  try {
    const file = await downloadFile(url)
    const bytes = await file.arrayBuffer()

    createDirectory(destination)

    fs.writeFileSync(destination, bytes)
  } catch (error) {
    console.error(
      `Attempted to download a file at ${url} but the download failed: `,
      error
    )
  }
}
