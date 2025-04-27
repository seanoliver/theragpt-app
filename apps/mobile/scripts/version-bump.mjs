import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { table } = require('table')

const args = process.argv.slice(2)
const bumpType = args
  .find(arg => ['--major', '--minor', '--patch'].includes(arg))
  ?.replace('--', '')

const appJsonPath = path.resolve(process.cwd(), 'app.json')

if (!fs.existsSync(appJsonPath)) {
  console.error('❌ app.json not found!')
  process.exit(1)
}

const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'))

if (!appJson.expo) {
  console.error('❌ expo config not found inside app.json!')
  process.exit(1)
}

// Save old values for the table
const oldVersion = appJson.expo.version || '1.0.0'
const oldIosBuild = appJson.expo.ios?.buildNumber || '1'
const oldAndroidBuild = appJson.expo.android?.versionCode || 1

let [major, minor, patch] = oldVersion.split('.').map(Number)

if (bumpType === 'major') {
  major++
  minor = 0
  patch = 0
  appJson.expo.version = `${major}.${minor}.${patch}`
  appJson.expo.ios.buildNumber = '1'
  appJson.expo.android.versionCode = 1
  console.log(`🔵 Bumped major version.`)
} else if (bumpType === 'minor') {
  minor++
  patch = 0
  appJson.expo.version = `${major}.${minor}.${patch}`
  appJson.expo.ios.buildNumber = '1'
  appJson.expo.android.versionCode = 1
  console.log(`🟢 Bumped minor version.`)
} else if (bumpType === 'patch') {
  patch++
  appJson.expo.version = `${major}.${minor}.${patch}`
  appJson.expo.ios.buildNumber = '1'
  appJson.expo.android.versionCode = 1
  console.log(`🟠 Bumped patch version.`)
} else {
  appJson.expo.ios.buildNumber = (parseInt(oldIosBuild, 10) + 1).toString()
  appJson.expo.android.versionCode = parseInt(oldAndroidBuild, 10) + 1
  console.log(`🟡 Bumped build number.`)
}

fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2))

// Prepare table data
const outputTable = [
  ['Field', 'Before', 'After'],
  ['Version', oldVersion, appJson.expo.version],
  ['iOS Build Number', oldIosBuild, appJson.expo.ios.buildNumber],
  [
    'Android Version Code',
    oldAndroidBuild.toString(),
    appJson.expo.android.versionCode.toString(),
  ],
]

console.log('\n' + table(outputTable))
console.log('✅ Updated app.json successfully.')
