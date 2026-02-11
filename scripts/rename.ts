import { basename, join } from 'node:path'
import { createInterface } from 'node:readline'
import { Glob } from 'bun'

const KEBAB_CASE_RE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  '.turbo',
  'dist',
  'build',
  '.expo',
])

const SKIP_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
])

const SKIP_FILES = new Set(['bun.lock'])

function toTitleCase(kebab: string): string {
  return kebab
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function toConcatenated(kebab: string): string {
  return kebab.replace(/-/g, '').toLowerCase()
}

function shouldSkip(filePath: string): boolean {
  const parts = filePath.split('/')
  for (const part of parts) {
    if (SKIP_DIRS.has(part)) return true
  }
  const fileName = parts[parts.length - 1] ?? ''
  if (SKIP_FILES.has(fileName)) return true
  const dotIndex = fileName.lastIndexOf('.')
  if (dotIndex !== -1) {
    const ext = fileName.slice(dotIndex).toLowerCase()
    if (SKIP_EXTENSIONS.has(ext)) return true
  }
  return false
}

async function replaceInFiles(
  rootDir: string,
  replacements: [string, string][],
): Promise<string[]> {
  const glob = new Glob('**/*')
  const modified: string[] = []

  for await (const filePath of glob.scan({
    cwd: rootDir,
    dot: true,
    onlyFiles: true,
  })) {
    if (shouldSkip(filePath)) continue

    const absPath = join(rootDir, filePath)
    const file = Bun.file(absPath)

    let content: string
    try {
      content = await file.text()
    } catch {
      // Skip files that can't be read as text
      continue
    }

    let updated = content
    for (const [from, to] of replacements) {
      updated = updated.replaceAll(from, to)
    }

    if (updated !== content) {
      await Bun.write(absPath, updated)
      modified.push(filePath)
    }
  }

  return modified
}

async function main() {
  const rootDir = join(import.meta.dir, '..')
  const pkgPath = join(rootDir, 'package.json')
  const pkgJson = JSON.parse(await Bun.file(pkgPath).text())
  const oldName: string = pkgJson.name
  const dirName = basename(rootDir)

  let newName = process.argv[2]

  if (!newName) {
    if (dirName !== oldName && KEBAB_CASE_RE.test(dirName)) {
      console.log(
        `No name provided, but directory "${dirName}" differs from current name "${oldName}".`,
      )
      const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
      })
      const answer = await new Promise<string>((resolve) => {
        rl.question(`Rename to "${dirName}"? [Y/n] `, resolve)
      })
      rl.close()
      const normalized = answer.trim().toLowerCase()
      if (normalized && normalized !== 'y' && normalized !== 'yes') {
        console.log('Aborted.')
        process.exit(0)
      }
      newName = dirName
    } else {
      console.error('Usage: bun rename <new-name>')
      console.error('Example: bun rename my-new-project')
      process.exit(1)
    }
  }

  if (!KEBAB_CASE_RE.test(newName)) {
    console.error(
      `Invalid name: "${newName}". Must be lowercase, alphanumeric + dashes, no leading/trailing dashes.`,
    )
    process.exit(1)
  }

  if (oldName === newName) {
    console.log(`Project is already named "${newName}". Nothing to do.`)
    process.exit(0)
  }

  // Build variant pairs sorted by length (longest first)
  const variants: [string, string][] = (
    [
      [oldName, newName],
      [toTitleCase(oldName), toTitleCase(newName)],
      [toConcatenated(oldName), toConcatenated(newName)],
    ] satisfies [string, string][]
  ).sort((a, b) => b[0].length - a[0].length)

  console.log(`Renaming "${oldName}" → "${newName}"\n`)
  console.log('Variant mappings:')
  for (const [from, to] of variants) {
    console.log(`  "${from}" → "${to}"`)
  }
  console.log()

  const modified = await replaceInFiles(rootDir, variants)

  if (modified.length === 0) {
    console.log('No files were modified.')
  } else {
    console.log(`Modified ${modified.length} file(s):\n`)
    for (const f of modified.sort()) {
      console.log(`  ${f}`)
    }
  }

  console.log(`\nDone! Run \`bun rename ${oldName}\` to revert.`)

  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const runSteps = await new Promise<string>((resolve) => {
    rl.question('Run `bun install` and `bun run lint:fix` now? [Y/n] ', resolve)
  })
  rl.close()

  const normalizedRunSteps = runSteps.trim().toLowerCase()
  if (
    normalizedRunSteps &&
    normalizedRunSteps !== 'y' &&
    normalizedRunSteps !== 'yes'
  ) {
    console.log(
      '\nSkipped. Remember to run:\n  1. `bun install` to regenerate bun.lock\n  2. `bun run lint:fix` to fix import ordering',
    )
  } else {
    console.log()
    const install = Bun.spawn(['bun', 'install'], {
      cwd: rootDir,
      stdio: ['inherit', 'inherit', 'inherit'],
    })
    await install.exited

    const lintFix = Bun.spawn(['bun', 'run', 'lint:fix'], {
      cwd: rootDir,
      stdio: ['inherit', 'inherit', 'inherit'],
    })
    await lintFix.exited
  }
}

main()
