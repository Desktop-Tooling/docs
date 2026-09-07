'use strict'

const { resolveTypologyId: resolveTypologyIdCore } = require('@antora-supplemental/nav-typology/lib/resolve-typology')

const TYPOLOGIES = {
  'component-root': { id: 'component-root', spriteId: 'icon-component-root' },
  'spec-component': { id: 'spec-component', spriteId: 'icon-spec-component' },
  'spec-feature': { id: 'spec-feature', spriteId: 'icon-spec-feature' },
  'diataxis-tutorial': { id: 'diataxis-tutorial', spriteId: 'icon-diataxis-tutorial' },
  'diataxis-howto': { id: 'diataxis-howto', spriteId: 'icon-diataxis-howto' },
  'diataxis-reference': { id: 'diataxis-reference', spriteId: 'icon-diataxis-reference' },
  'diataxis-explanation': { id: 'diataxis-explanation', spriteId: 'icon-diataxis-explanation' },
  changelog: { id: 'changelog', spriteId: 'icon-changelog' },
}

function diataxisEnabled ({ data } = {}) {
  const keys = (data && data.root && data.root.site && data.root.site.keys) || {}
  return keys.nav_typology_diataxis === 'true' || keys.nav_typology === 'true'
}

function resolveTypology (item, options = {}) {
  if (!item || typeof item !== 'object') return null
  const depth = Number(options.hash?.level ?? 0) || 0
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
  if (!meta) return ''
  const uiRoot = options.data?.root?.uiRootPath || options.data?.root?.siteRootPath || '/_'
  return `<svg class="nav-typology-icon nav-typology-icon--${meta.id}" width="12" height="12" viewBox="0 0 16 16" aria-hidden="true"><use href="${uiRoot}/img/nav-typology.svg#${meta.spriteId}"/></svg>`
}
