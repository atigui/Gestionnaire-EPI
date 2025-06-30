"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  Building,
  Clock,
  Award,
  Settings,
  Plus,
  FileText,
} from "lucide-react"
import Layout from "../layout/layout-affectant"

// Données simulées du profil magasinier
const profilMagasinier = {
  matricule: "MAG001",
  nom: "Hassan Benali",
  email: "h.benali@menara-prefa.ma",
  telephone: "+212 6 12 34 56 78",
  poste: "Magasinier Principal",
  service: "Gestion des Stocks EPI",
  zone: "Zone A - Atelier Principal",
  dateEmbauche: "2018-03-15",
  dateNaissance: "1985-07-22",
  adresse: "Rue Al Massira, Quartier Industriel, Casablanca",
  statut: "Actif",
  niveau: "Senior",
  certifications: ["Gestion des Stocks", "Sécurité Industrielle", "Manipulation des EPI"],
  statistiques: {
    attributionsTraitees: 1247,
    employesGeres: 156,
    anneesExperience: 6,
    tauxSatisfaction: 98,
  },
}

export default function ProfilAffectant() {
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [formData, setFormData] = useState(profilMagasinier)
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    // Ici on sauvegarderait les modifications
    setIsEditing(false)
    alert("Profil mis à jour avec succès !")
  }

  const handleCancel = () => {
    setFormData(profilMagasinier)
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      alert("Les mots de passe ne correspondent pas")
      return
    }
    if (passwords.new.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    // Ici on changerait le mot de passe
    setShowPasswordDialog(false)
    setPasswords({ current: "", new: "", confirm: "" })
    alert("Mot de passe modifié avec succès !")
  }

  const getStatutColor = (statut: string) => {
    return statut === "Actif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getNiveauColor = (niveau: string) => {
    switch (niveau) {
      case "Senior":
        return "bg-blue-100 text-blue-800"
      case "Junior":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Layout>
    <div className="space-y-6 mt-10 mr-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Mon Profil</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles et professionnelles</p>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button onClick={handleEdit} className="bg-primary hover:bg-primary/90 flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 flex items-center gap-2">
                <Save className="h-4 w-4" />
                Sauvegarder
              </Button>
              <Button onClick={handleCancel} variant="outline" className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Annuler
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informations personnelles
              </CardTitle>
              <CardDescription>Vos données personnelles et de contact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Matricule</Label>
                  <Input value={formData.matricule} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label>Nom complet</Label>
                  <Input
                    value={formData.nom}
                    onChange={(e) => handleInputChange("nom", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone
                  </Label>
                  <Input
                    value={formData.telephone}
                    onChange={(e) => handleInputChange("telephone", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date de naissance
                  </Label>
                  <Input
                    type="date"
                    value={formData.dateNaissance}
                    onChange={(e) => handleInputChange("dateNaissance", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date d'embauche
                  </Label>
                  <Input value={formData.dateEmbauche} disabled className="bg-muted" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Adresse
                </Label>
                <Input
                  value={formData.adresse}
                  onChange={(e) => handleInputChange("adresse", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-secondary" />
                Informations professionnelles
              </CardTitle>
              <CardDescription>Votre poste et responsabilités</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Poste</Label>
                  <Input value={formData.poste} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label>Service</Label>
                  <Input value={formData.service} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label>Zone de responsabilité</Label>
                  <Input value={formData.zone} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label>Niveau</Label>
                  <div className="flex items-center gap-2">
                    <Badge className={getNiveauColor(formData.niveau)} variant="secondary">
                      {formData.niveau}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Certifications
                </Label>
                <div className="flex flex-wrap gap-2">
                  {formData.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar avec statut et statistiques */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                Statut du compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Statut</span>
                <Badge className={getStatutColor(formData.statut)} variant="secondary">
                  {formData.statut}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dernière connexion</span>
                <span className="text-sm text-muted-foreground">Aujourd'hui</span>
              </div>

              <Separator />

              <Button
                onClick={() => setShowPasswordDialog(true)}
                variant="outline"
                className="w-full flex items-center gap-2 hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800"
              >
                <Settings className="h-4 w-4" />
                Changer le mot de passe
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog pour changer le mot de passe */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Changer le mot de passe
            </DialogTitle>
            <DialogDescription>Saisissez votre mot de passe actuel et le nouveau mot de passe</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Mot de passe actuel</Label>
              <Input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))}
                placeholder="Mot de passe actuel"
              />
            </div>

            <div className="space-y-2">
              <Label>Nouveau mot de passe</Label>
              <Input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords((prev) => ({ ...prev, new: e.target.value }))}
                placeholder="Nouveau mot de passe"
              />
            </div>

            <div className="space-y-2">
              <Label>Confirmer le nouveau mot de passe</Label>
              <Input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((prev) => ({ ...prev, confirm: e.target.value }))}
                placeholder="Confirmer le mot de passe"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordDialog(false)
                setPasswords({ current: "", new: "", confirm: "" })
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handlePasswordChange}
              className="bg-primary hover:bg-primary/90"
              disabled={!passwords.current || !passwords.new || !passwords.confirm}
            >
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </Layout>
  )
}
