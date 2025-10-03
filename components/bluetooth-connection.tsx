"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bluetooth, Loader2, Radio } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BluetoothConnectionProps {
  onConnect: (deviceName: string) => void
}

export function BluetoothConnection({ onConnect }: BluetoothConnectionProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [availableDevices, setAvailableDevices] = useState<string[]>([])
  const { toast } = useToast()

  const checkBluetoothSupport = () => {
    if (!navigator.bluetooth) {
      toast({
        title: "Bluetooth Not Supported",
        description: "Your browser does not support Web Bluetooth API. Please use Chrome, Edge, or Opera.",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const scanForDevices = async () => {
    if (!checkBluetoothSupport()) return

    setIsScanning(true)

    try {
      // Request Bluetooth device
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service", "generic_access"],
      })

      if (device.name) {
        toast({
          title: "Device Found",
          description: `Found ${device.name}`,
        })

        // Simulate connection
        setTimeout(() => {
          onConnect(device.name || "Unknown Device")
        }, 1000)
      }
    } catch (error) {
      console.error("[v0] Bluetooth scan error:", error)
      toast({
        title: "Connection Failed",
        description: "Could not connect to device. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsScanning(false)
    }
  }

  const simulateConnection = () => {
    // For demo purposes when Bluetooth is not available
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      onConnect("Demo Device")
      toast({
        title: "Demo Mode",
        description: "Connected in demo mode",
      })
    }, 1500)
  }

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3">
          <Radio className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Connect Device</CardTitle>
        <CardDescription>Scan for nearby Bluetooth devices to start messaging</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={scanForDevices} disabled={isScanning} className="w-full h-12 text-base" size="lg">
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Scanning for devices...
            </>
          ) : (
            <>
              <Bluetooth className="mr-2 h-5 w-5" />
              Scan for Devices
            </>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button
          onClick={simulateConnection}
          disabled={isScanning}
          variant="outline"
          className="w-full h-12 text-base bg-transparent"
          size="lg"
        >
          Try Demo Mode
        </Button>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-sm text-foreground">Requirements:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Chrome, Edge, or Opera browser</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Bluetooth enabled on your device</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>HTTPS connection (or localhost)</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
