import { styleText } from 'node:util'

export const green = v => styleText( 'green', v )
export const italic = v => styleText( 'italic', v )
export const underline =  v => styleText( 'underline', v )
export const blue = v => styleText( 'blue', v )
export const bgBlue = v => styleText( 'bgBlue', v )
export const link = v => underline( italic( v ) )
export const gray = v => styleText( 'gray', v )
export const bold = v => styleText( 'bold', v )
