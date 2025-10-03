"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bluetooth, Send, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  text: string
  sender: "me" | "other"
  timestamp: Date
}

interface ChatInterfaceProps {
  deviceName: string
  onDisconnect: () => void
}

export function ChatInterface({ deviceName, onDisconnect }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey! Are you here?",
      sender: "other",
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: "2",
      text: "Yeah...",
      sender: "me",
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: "3",
      text: "Great work on the slides! Love it! Just one more thing...",
      sender: "other",
      timestamp: new Date(Date.now() - 30000),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "me",
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setInputValue("")

    // Simulate response after 2 seconds
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: "Got it! Thanks for the message.",
        sender: "other",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, response])
    }, 2000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  return (
    <Card className="shadow-xl border-0 overflow-hidden">
      <CardHeader className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-primary/10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {deviceName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-foreground">{deviceName}</h2>
              <Badge variant="secondary" className="text-xs gap-1">
                <Bluetooth className="h-3 w-3" />
                Connected
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDisconnect}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-background/30">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] ${
                  message.sender === "me" ? "bg-card text-foreground" : "bg-card text-foreground"
                }`}
              >
                <div className="text-xs text-muted-foreground mb-1 px-1">{formatTime(message.timestamp)}</div>
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.sender === "me" ? "bg-primary/5 text-primary" : "bg-card"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-card border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter Message"
              className="flex-1 bg-background/50 border-border"
            />
            <Button type="submit" size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
