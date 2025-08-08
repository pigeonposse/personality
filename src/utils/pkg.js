
import pkg from '../../package.json' with { type: 'json' }

const {
	version, name, description, homepage, extra, bin,
} = pkg

export const productName = extra.productName
export const binName = Object.keys( bin )[0]
export {
	version,
	name,
	description,
	homepage,
}
