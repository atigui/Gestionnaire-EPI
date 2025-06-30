"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams, useNavigate, useParams } from "react-router-dom"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Alert, AlertDescription } from "../ui/alert"
import axios from "axios"

export default function ResetPasswordForm() {
  const { token: tokenFromParams } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Récupère le token (depuis l'URL) et l'email (depuis les paramètres GET)
  useEffect(() => {
    if (tokenFromParams) setToken(tokenFromParams)
    const e = searchParams.get("email")
    if (e) setEmail(e)
  }, [tokenFromParams, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!email) return setError("Veuillez entrer votre adresse email.")
    if (!token) return setError("Lien de réinitialisation invalide.")
    if (password.length < 8) return setError("Le mot de passe doit contenir au moins 8 caractères.")
    if (password !== passwordConfirmation) return setError("Les mots de passe ne correspondent pas.")

    setIsLoading(true)

    try {
      await axios.post("http://localhost:8000/api/reset-password", {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      })

      setSuccess(true)

      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError("Une erreur est survenue lors de la réinitialisation.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-green-600">Mot de passe réinitialisé avec succès !</h2>
        <p className="text-gray-600">Vous allez être redirigé vers la page de connexion...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6 max-w-md mx-auto">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Réinitialiser le mot de passe</h1>
        <p className="text-sm text-gray-500">Entrez votre nouveau mot de passe pour continuer</p>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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

      <div className="space-y-2">
        <Label htmlFor="password">Nouveau mot de passe</Label>
        <Input
          id="password"
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="border-gray-300 focus:border-[#1a2d5a] focus:ring-[#1a2d5a]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="passwordConfirmation">Confirmer le mot de passe</Label>
        <Input
          id="passwordConfirmation"
          type="password"
          placeholder="Confirmer le mot de passe"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
          minLength={8}
          className="border-gray-300 focus:border-[#1a2d5a] focus:ring-[#1a2d5a]"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#1a2d5a] hover:bg-[#152348] text-white"
      >
        {isLoading ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
      </Button>
    </form>
  )
}
