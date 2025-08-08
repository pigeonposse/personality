import { defineConfig }     from '@dovenv/core'
import { pigeonposseTheme } from '@dovenv/theme-pigeonposse'

import core from './const.js'

const theme = pigeonposseTheme( { core } )

delete theme.custom.docs
delete theme.check.ws

export default defineConfig(
	theme,
)
