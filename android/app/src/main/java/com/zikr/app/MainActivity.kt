package com.zikr.app

import com.getcapacitor.BridgeActivity

/**
 * ZIKR — زِكرٌ  Main Android Activity
 *
 * Extends BridgeActivity which bootstraps the Capacitor WebView bridge,
 * registers all configured plugins, and handles deep-link intent routing.
 * All business logic lives in the Next.js web layer; this class is intentionally
 * minimal.
 */
class MainActivity : BridgeActivity()
