#!/usr/bin/env node

import { personality } from './main.js'
import { updater }     from './utils/up.js'

const run = async () => {

	await updater.notify()
	await personality()

}

run()
