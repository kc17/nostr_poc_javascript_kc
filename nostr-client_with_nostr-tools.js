require('websocket-polyfill')

const { 
    generatePrivateKey, 
    getPublicKey,
    validateEvent,
    verifySignature,
    signEvent,
    getEventHash,
    relayInit
 } = require('nostr-tools')

let priKey = generatePrivateKey()
let pubKey = getPublicKey(priKey)

let event = {
    kind: 0,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    content: 'this is kc metadata..',
    pubkey: pubKey
}

event.id = getEventHash(event)
event.sig = signEvent(event, priKey)

let ok = validateEvent(event)
let veryOk = verifySignature(event)

const relay = relayInit('wss://relay.nekolicio.us/')

relay.on('connect', () => {
    console.log(`connected to ${relay.url}`)
})

relay.on('error', () => {
    console.log(`failed to connect to ${relay.url}`)
})

relay.connect()

let pub = relay.publish(event)

pub.on('ok', () => {
    console.log(`${relay.url} has accepted our event`)
})

pub.on('failed', reason => {
    console.log(`failed to publish to ${relay.url}: ${reason}`)
})

relay.close()