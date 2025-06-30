import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Alert, AlertDescription } from "../ui/alert"
import Cookies from "js-cookie"

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    mot_de_passe: "",
    confirmPassword: "",
    role: "magasinier",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const { nom, prenom, email, mot_de_passe, confirmPassword, role } = formData

    if (!nom || !prenom || !email || !mot_de_passe || !confirmPassword) {
      setError("Veuillez remplir tous les champs")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer une adresse email valide")
      return
    }

    if (mot_de_passe.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    if (mot_de_passe !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    setIsLoading(true)

    try {
      // Récupérer le cookie CSRF
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      })

      const csrfToken = Cookies.get("XSRF-TOKEN")

      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": csrfToken || "",
        },
        credentials: "include",
        body: JSON.stringify({
          nom,
          prenom,
          email,
          mot_de_passe,
          role, // envoyer le nom du rôle: "admin", "magasinier" ou "affecteur"
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Gestion d'erreur, Laravel peut renvoyer un objet JSON avec plusieurs messages
        if (typeof data === "object" && data !== null) {
          if (data.message) setError(data.message)
          else if (Array.isArray(data)) setError(data.join(", "))
          else if (data.errors) setError(Object.values(data.errors).flat().join(", "))
          else setError("Erreur lors de l'inscription")
        } else {
          setError("Erreur lors de l'inscription")
        }
        return
      }

      // Redirection selon rôle
      if (role === "admin") {
        navigate("/admin")
      } else if (role === "magasinier") {
        navigate("/magasinier")
      } else if (role === "affecteur") {
        navigate("/nouvelle-affectation")
      } else {
        navigate("/")
      }
    } catch (err) {
      setError("Erreur de connexion au serveur")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Inscription</h1>
        <p className="text-sm text-gray-500">Créez votre compte pour accéder à la plateforme</p>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nom">Nom</Label>
          <Input id="nom" name="nom" type="text" value={formData.nom} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prenom">Prénom</Label>
          <Input id="prenom" name="prenom" type="text" value={formData.prenom} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mot_de_passe">Mot de passe</Label>
          <div className="relative">
            <Input
              id="mot_de_passe"
              name="mot_de_passe"
              type={showPassword ? "text" : "password"}
              value={formData.mot_de_passe}
              onChange={handleChange}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Rôle</Label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            required
          >
            <option value="magasinier">Magasinier</option>
            <option value="affecteur">Affecteur</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#1a2d5a] hover:bg-[#152348] text-white"
          disabled={isLoading}
        >
          {isLoading ? "Redirection..." : "S'inscrire"}
        </Button>

        <div className="text-center text-sm">
          <span className="text-gray-500">Vous avez déjà un compte ? </span>
          <Link to="/login" className="text-[#c41e3a] hover:underline">Se connecter</Link>
        </div>
      </form>
    </div>
  )
}
