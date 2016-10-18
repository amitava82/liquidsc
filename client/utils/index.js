/**
 * Created by amitava on 08/09/16.
 */
import accounting from 'accounting';

export function prettyAddress(address) {
    return `${address.line1}, ${address.line2 || ''}, ${address.locality}, ${address.city}, ${address.state}`
}

export const pc = (amt, total) => accounting.toFixed((amt * 100)/total);