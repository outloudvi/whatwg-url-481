const { parse } = require('tldjs')
const { readFileSync, writeFileSync, readFile } = require('fs')

for (const i of ['WNoNYes', 'WYesNNo']) {
  const domains = readFileSync(i + '.txt', 'utf-8').split('\n')
  const results = domains.filter((x) => parse(x).subdomain === '')
  writeFileSync(i + '.ps.txt', results.join('\n'))
}
