/**
 * Created by amitava on 08/09/16.
 */

export function prettyAddress(address) {
    return `${address.line1}, ${address.line2 || ''}, ${address.locality}, ${address.city}, ${address.state}`
}