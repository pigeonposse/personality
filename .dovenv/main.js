import { defineConfig } from '@dovenv/core'
import ppTheme          from '@dovenv/theme-pigeonposse'

import core from './const.js'

const theme = ppTheme( { core } )

delete theme.custom.docs
delete theme.check.ws

export default defineConfig(
	theme,
)
