"use client"

import { useState } from "react"
import { BluetoothConnection } from "@/components/bluetooth-connection"
import { ChatInterface } from "@/components/chat-interface"
import { Bluetooth } from "lucide-react"

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [deviceName, setDeviceName] = useState("")

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Bluetooth className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Bluetooth Messenger</h1>
          <p className="text-muted-foreground">Connect and chat across devices wirelessly</p>
        </div>

        {!isConnected ? (
          <BluetoothConnection
            onConnect={(name) => {
              setDeviceName(name)
              setIsConnected(true)
            }}
          />
        ) : (
          <ChatInterface
            deviceName={deviceName}
            onDisconnect={() => {
              setIsConnected(false)
              setDeviceName("")
            }}
          />
        )}
      </div>
    </div>
  )
}
