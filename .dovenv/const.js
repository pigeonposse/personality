import { getWorkspaceConfig } from '@dovenv/theme-pigeonposse'

export default await getWorkspaceConfig( {
	metaURL : import.meta.url,
	path    : '../',
} )
