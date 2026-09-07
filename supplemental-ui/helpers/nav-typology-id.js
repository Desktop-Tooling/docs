'use strict'

const { resolveTypologyId: resolveTypologyIdCore } = require('@antora-supplemental/nav-typology/lib/resolve-typology')

const TYPOLOGIES = {
  'component-root': { id: 'component-root' },
  'spec-component': { id: 'spec-component' },
  'spec-feature': { id: 'spec-feature' },
  'diataxis-tutorial': { id: 'diataxis-tutorial' },
  'diataxis-howto': { id: 'diataxis-howto' },
  'diataxis-reference': { id: 'diataxis-reference' },
  'diataxis-explanation': { id: 'diataxis-explanation' },
  changelog: { id: 'changelog' },
}

function diataxisEnabled ({ data } = {}) {
  const keys = (data && data.root && data.root.site && data.root.site.keys) || {}
  return keys.nav_typology_diataxis === 'true' || keys.nav_typology === 'true'
}

function resolveTypology (item, options = {}) {
  if (!item || typeof item !== 'object') return null
  const level = options.hash?.level ?? 0
  const depth = Number(level) || 0
  const parentTypologyId = options.hash?.parentTypologyId || ''
  let id = null
  if (depth === 0 && item.url && Array.isArray(item.items) && item.items.length) {
    id = 'component-root'
  } else {
    id = resolveTypologyIdCore(item, {
      depth,
      parentTypologyId,
      diataxisEnabled: diataxisEnabled(options),
      skipBuildFallback: false,
    })
  }
  return id && TYPOLOGIES[id] ? TYPOLOGIES[id] : null
}

module.exports = (item, options = {}) => {
  const meta = resolveTypology(item, options)
  return meta ? meta.id : ''
}
