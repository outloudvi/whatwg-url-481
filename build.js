const { readFileSync, writeFileSync } = require('fs')
const { parse } = require('yaml')

function parseLine(str) {
  const sp = str.split(' ')
  const domain = sp[0].replace(/^www\./, '')
  const www = sp[0].startsWith('www')
  const obj = sp.slice(1).join(' ')
  const addr = (() => {
    try {
      return parse(obj)
    } catch (e) {
      console.log(str, '|', obj)
      throw e
    }
  })()
  return {
    domain,
    www,
    addr,
  }
}

const www = readFileSync('source/results.txt', 'utf-8')
  .split('\n')
  .map((v, i) => {
    if (i % 10000 === 0) console.log(`Parsing WWW ${i} / 1000000`)
    return parseLine(v)
  })
const nowww = readFileSync('source/results.nowww.txt', 'utf-8')
  .split('\n')
  .map((v, i) => {
    if (i % 10000 === 0) console.log(`Parsing NoWWW ${i} / 1000000`)
    return parseLine(v)
  })

console.log('Analyzing categories')

const wwwDomainsHasIp = new Set(
  www.filter((x) => typeof x.addr === 'object').map((x) => x.domain)
)
const wwwDomainsHasNoIp = new Set(
  www.filter((x) => typeof x.addr !== 'object').map((x) => x.domain)
)
const noWwwDomainsHasIp = new Set(
  nowww.filter((x) => typeof x.addr === 'object').map((x) => x.domain)
)
const noWwwDomainsHasNoIp = new Set(
  nowww.filter((x) => typeof x.addr !== 'object').map((x) => x.domain)
)

console.log('Writing categories')

writeFileSync('wwwDomainsHasIp.txt', [...wwwDomainsHasIp.values()].join('\n'))
writeFileSync(
  'wwwDomainsHasNoIp.txt',
  [...wwwDomainsHasNoIp.values()].join('\n')
)
writeFileSync(
  'noWwwDomainsHasIp.txt',
  [...noWwwDomainsHasIp.values()].join('\n')
)
writeFileSync(
  'noWwwDomainsHasNoIp.txt',
  [...noWwwDomainsHasNoIp.values()].join('\n')
)

console.log('Analyzing diffs')

const WYesNNo = [...noWwwDomainsHasNoIp.values()].filter(
  (x) => !wwwDomainsHasNoIp.has(x)
)
writeFileSync('WYesNNo.txt', WYesNNo.join('\n'))
const WNoNYes = [...wwwDomainsHasNoIp.values()].filter(
  (x) => !noWwwDomainsHasNoIp.has(x)
)
writeFileSync('WNoNYes.txt', WNoNYes.join('\n'))

// console.log('Analyzing different IP on www and non-www')

// const WYesNYesDifferent = []
// const addrList = {}

// for (const [idx, i] of www.entries()) {
//   console.log(idx, i)
//   if (idx % 10000 === 0) console.log(`Analyzing WWW ${idx}/1000000`)
//   const domain = i.domain
//   if (typeof i.addr === 'object') {
//     addrList[domain] = i.addr
//   }
// }
// for (const [idx, i] of nowww.entries()) {
//   if (idx % 10000 === 0) console.log(`Analyzing NoWWW ${idx}/1000000`)
//   const domain = i.domain
//   if (typeof i.addr === 'object' && addrList[domain]) {
//     if (addrList[domain] !== i.addr) {
//       WYesNYesDifferent.push([domain, addrList[(domain, i.addr)]].join('\n'))
//     }
//   }
// }
// writeFileSync('WYesNYesDifferent.txt', WYesNYesDifferent.join('\n'))
