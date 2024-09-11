#!/usr/bin/env node

import { personality } from './main.js'
import { updater }     from './utils/up.js'

updater.notify()
personality()
