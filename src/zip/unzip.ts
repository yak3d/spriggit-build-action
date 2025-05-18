import decompress from 'decompress'

export const unzipFile = async (filePath: string, destination: string) => {
  try {
    await decompress(filePath, destination)
  } catch (e) {
    console.error(`There was an error extracting the zip at ${filePath}`, e)
    throw e
  }
}
