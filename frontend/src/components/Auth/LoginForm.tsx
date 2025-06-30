import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Alert, AlertDescription } from "../ui/alert"
import { Eye, EyeOff } from "lucide-react"
import Cookies from "js-cookie"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [mot_de_passe, setMotDePasse] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !mot_de_passe) {
      setError("Veuillez remplir tous les champs")
      return
    }

    setIsLoading(true)

    try {
      // Obtenir cookie CSRF
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      })

      const csrfToken = Cookies.get("XSRF-TOKEN")

      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": csrfToken || "",
        },
        credentials: "include",
        body: JSON.stringify({ email, mot_de_passe }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Email ou mot de passe incorrect")
        return
      }

      // Redirection en fonction du rôle
      if (data.role === "admin") {
        navigate("/admin")
      } else if (data.role === "magasinier") {
        navigate("/magasinier")
      } else if (data.role === "affecteur") {
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
        <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
        <p className="text-sm text-gray-500">Entrez vos identifiants pour accéder à votre compte</p>
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
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="mot_de_passe">Mot de passe</Label>
            <Link to="/forgot-password" className="text-xs text-[#c41e3a] hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="mot_de_passe"
              name="mot_de_passe"
              type={showPassword ? "text" : "password"}
              value={mot_de_passe}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              <span className="sr-only">{showPassword ? "Cacher" : "Afficher"}</span>
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#1a2d5a] hover:bg-[#152348] text-white"
          disabled={isLoading}
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </Button>

        <div className="text-center text-sm">
          <span className="text-gray-500">Vous n'avez pas de compte ? </span>
          <Link to="/register" className="text-[#c41e3a] hover:underline">
            S'inscrire
          </Link>
        </div>
      </form>
    </div>
  )
}
