"use client"

import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Alert, AlertDescription } from "../ui/alert"
import { CheckCircle2 } from "lucide-react"
import axios from "axios"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Veuillez entrer votre adresse email")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer une adresse email valide")
      return
    }

    setIsLoading(true)

    try {
      await axios.post("http://localhost:8000/api/forgot-password", {
        email,
      })

      setIsSubmitted(true)
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError("Une erreur est survenue lors de la demande de réinitialisation")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Email envoyé</h1>
          <p className="text-gray-500">
            Si un compte existe avec l&apos;adresse <span className="font-medium">{email}</span>, vous recevrez un email
            avec les instructions pour réinitialiser votre mot de passe.
          </p>
        </div>
        <div className="pt-4">
          <Link to="/login" className="text-[#c41e3a] hover:underline">
            Retour à la page de connexion
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié</h1>
        <p className="text-sm text-gray-500">
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="exemple@menaraprefa.ma"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-gray-300 focus:border-[#1a2d5a] focus:ring-[#1a2d5a]"
          />
        </div>

        <Button type="submit" className="w-full bg-[#1a2d5a] hover:bg-[#152348] text-white" disabled={isLoading}>
          {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
        </Button>

        <div className="text-center text-sm">
          <Link to="/login" className="text-[#c41e3a] hover:underline">
            Retour à la page de connexion
          </Link>
        </div>
      </form>
    </div>
  )
}
