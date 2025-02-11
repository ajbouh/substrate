// See also https://datatracker.ietf.org/doc/html/rfc5988

// Simplified from https://github.com/web3-storage/parse-link-header/tree/master

/*
Copyright 2013 Thorsten Lorenz. 
All rights reserved.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

const MAX_HEADER_LENGTH = 2000
const THROW_ON_MAX_HEADER_LENGTH_EXCEEDED = false

function createObjects(acc: Record<'url' | string, string>, p: string) {
  // rel="next" => 1: rel 2: next
  const m = p.match(/\s*(.+)\s*=\s*"?([^"]+)"?/)
  if (m) acc[m[1]] = m[2]
  return acc
}

function parseLink(link: string) {
  try {
    const m = link.match(/<?([^>]*)>(.*)/)
    if (!m) { return null }

    const linkUrl = m[1]
    const parts = m[2].split(';')

    parts.shift()

    const info = parts.reduce(createObjects, {})
    info.url = linkUrl
    return info
  } catch {
    return null
  }
}

function checkHeader(linkHeader: string, options?: {maxHeaderLength?: number; throwOnMaxHeaderLengthExceeded?: boolean}) {
  if (!linkHeader) return false

  options = options || {}
  const maxHeaderLength = options.maxHeaderLength || MAX_HEADER_LENGTH
  const throwOnMaxHeaderLengthExceeded = options.throwOnMaxHeaderLengthExceeded || THROW_ON_MAX_HEADER_LENGTH_EXCEEDED

  if (linkHeader.length > maxHeaderLength) {
    if (throwOnMaxHeaderLengthExceeded) {
      throw new Error('Input string too long, it should be under ' + maxHeaderLength + ' characters.')
    } else {
      return false
    }
  }
  return true
}

export function parseLinkHeader(
    linkHeader: string,
    options?: {maxHeaderLength?: number; throwOnMaxHeaderLengthExceeded?: boolean},
): Record<string, string>[] | null {
  if (!checkHeader(linkHeader, options)) return null

  return linkHeader.split(/,\s*</)
    .map(parseLink)
    .filter(o => o !== null)
}
