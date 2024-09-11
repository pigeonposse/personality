export const getFlagValue = key =>{

	const flags = process.argv
	for ( const flag of flags ) {

		if ( flag.startsWith( `--${key}=` ) ) return flag.split( '=' )[ 1 ]
	
	}
	return undefined

}
export const existsFlag = v => process.argv.includes( `--${v}` )
export const existsSpecificFlag = ( v, values ) => {

	const value = getFlagValue( v ) 
	
	if ( value && ( values ).includes( value ) ) 
		return value

	return undefined

}
