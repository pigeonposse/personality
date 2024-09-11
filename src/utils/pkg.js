
import {
	version,
	name,
	description,
	bin,
	homepage,
	extra,
} from '../../package.json'

export const productName = extra.productName
export const binName = Object.keys( bin )[ 0 ]
export {
	version,
	name,
	description,
	homepage,
}
