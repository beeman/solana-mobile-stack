import { file, Glob, write } from 'bun'

const glob = new Glob('apps/*/.env.example')

for await (const example of glob.scan('.')) {
  const envPath = example.replace('.env.example', '.env')
  const env = file(envPath)
  const shouldCopy = !(await env.exists()) || env.size === 0

  if (shouldCopy) {
    const contents = await file(example).text()
    await write(envPath, contents)
    console.log(`Copied ${example} → ${envPath}`)
  }
}
