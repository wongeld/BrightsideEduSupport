"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function InitDatabase() {
  const { toast } = useToast()
  const [isInitializing, setIsInitializing] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initializeDatabase = async () => {
    setIsInitializing(true)
    setError(null)

    try {
      const response = await fetch("/api/init-db")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize database")
      }

      setIsInitialized(true)
      toast({
        title: "Success",
        description: "Database initialized successfully",
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to initialize database",
        variant: "destructive",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  useEffect(() => {
    // Check if database is already initialized
    const checkDatabase = async () => {
      try {
        // Try to fetch a simple resource that would exist if the database is initialized
        const response = await fetch("/api/auth/user")

        if (response.status === 401) {
          // If we get a 401, it means the auth system is working, which means the database is initialized
          setIsInitialized(true)
        } else if (response.ok) {
          // If we get a 200, it means the user is logged in and the database is initialized
          setIsInitialized(true)
        }
      } catch (error) {
        // If there's an error, we'll assume the database needs initialization
        console.error("Error checking database:", error)
      }
    }

    checkDatabase()
  }, [])

  if (isInitialized) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Database Initialization</CardTitle>
          <CardDescription>The database needs to be initialized before you can use the application.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}
          <p className="text-muted-foreground mb-4">
            This will create the necessary tables and default admin user. You should only need to do this once.
          </p>
          <p className="text-sm text-muted-foreground">
            Default admin credentials:
            <br />
            Username: <strong>admin</strong>
            <br />
            Password: <strong>admin123</strong>
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={initializeDatabase} disabled={isInitializing} className="w-full">
            {isInitializing ? "Initializing..." : "Initialize Database"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

