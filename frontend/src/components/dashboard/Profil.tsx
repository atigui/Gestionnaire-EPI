"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"
import {
  User,
  Mail,
  BadgeIcon as IdCard,
  Shield,
  Calendar,
  Edit,
  Lock,
  LogOut,
  Activity,
  Package,
  UserPlus,
  TrendingUp,
  Clock,
} from "lucide-react"
import { useToast } from "../hooks/use-toast"
import Layout from "../layout/layout"

// Données de l'administrateur connecté
// const adminData = {
//   nom: "Youssef",
//   prenom: "Benali",
//   email: "admin@menaraprefa.com",
//   matricule: "ADM-001",
//   role: "Administrateur",
//   dateCreation: "2024-01-15",
//   telephone: "+212 6 12 34 56 78",
//   departement: "Direction Générale",
// }

// Activités récentes de l'admin
const activitesRecentes = [
  {
    id: 1,
    date: "2024-05-28",
    heure: "14:30",
    action: "Ajout d'un nouveau matériel",
    details: "Casque de sécurité - Modèle Pro",
    type: "creation",
    icon: Package,
  },
  {
    id: 2,
    date: "2024-05-27",
    heure: "11:15",
    action: "Attribution à l'employé",
    details: "Mohammed Bennani (EMP001) - 5 matériels",
    type: "attribution",
    icon: UserPlus,
  },
  {
    id: 3,
    date: "2024-05-26",
    heure: "16:45",
    action: "Mise à jour des stocks",
    details: "Ajout de 150 unités - Gants anti-coupure",
    type: "stock",
    icon: TrendingUp,
  },
  {
    id: 4,
    date: "2024-05-25",
    heure: "09:20",
    action: "Création d'un nouvel utilisateur",
    details: "Magasinier - Zineb Alaoui",
    type: "user",
    icon: UserPlus,
  },
  {
    id: 5,
    date: "2024-05-24",
    heure: "13:10",
    action: "Modification des informations",
    details: "Mise à jour profil employé EMP003",
    type: "modification",
    icon: Edit,
  },
]

const getActivityTypeColor = (type: string) => {
  switch (type) {
    case "creation":
      return "bg-green-100 text-green-800"
    case "attribution":
      return "bg-blue-100 text-blue-800"
    case "stock":
      return "bg-orange-100 text-orange-800"
    case "user":
      return "bg-purple-100 text-purple-800"
    case "modification":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function AdminProfilePage() {
  // State pour les données de l'admin (modifiables)
  const [adminInfo, setAdminInfo] = useState({
    nom: "Benali",
    prenom: "Youssef",
    email: "admin@menaraprefa.com",
    matricule: "ADM-001",
    role: "Administrateur",
    dateCreation: "2024-01-15",
    telephone: "+212 6 12 34 56 78",
    departement: "Direction Générale",
  })

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    nom: adminInfo.nom,
    prenom: adminInfo.prenom,
    email: adminInfo.email,
    telephone: adminInfo.telephone,
    departement: adminInfo.departement,
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const { toast } = useToast()

  // Ouvrir le dialog de modification avec les données actuelles
  const openEditDialog = () => {
    setEditForm({
      nom: adminInfo.nom,
      prenom: adminInfo.prenom,
      email: adminInfo.email,
      telephone: adminInfo.telephone,
      departement: adminInfo.departement,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = () => {
    // Mettre à jour les informations de l'admin
    setAdminInfo({
      ...adminInfo,
      nom: editForm.nom,
      prenom: editForm.prenom,
      email: editForm.email,
      telephone: editForm.telephone,
      departement: editForm.departement,
    })

    toast({
      title: "Succès",
      description: "Vos informations ont été mises à jour avec succès",
    })
    setIsEditDialogOpen(false)
  }

  const handlePasswordSubmit = () => {
    if (!passwordForm.currentPassword) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir votre mot de passe actuel",
        variant: "destructive",
      })
      return
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le nouveau mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      })
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      })
      return
    }

    // Ici vous pouvez ajouter la logique pour changer le mot de passe
    toast({
      title: "Succès",
      description: "Votre mot de passe a été modifié avec succès",
    })
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setIsPasswordDialogOpen(false)
  }

  const handleLogout = () => {
    // Effacer les données de session/localStorage si nécessaire
    localStorage.removeItem("adminToken") // exemple

    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    })

    // Redirection vers la page de login
    setTimeout(() => {
      window.location.href = "/login"
    }, 1000)
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* En-tête de la page */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Profil Administrateur</h1>
            <p className="text-slate-600 mt-1">Informations liées au compte administrateur connecté</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section Informations personnelles */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="flex items-center text-lg text-slate-800">
                  <User className="h-5 w-5 mr-2" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">Nom complet</p>
                        <p className="font-medium text-slate-900">
                          {adminInfo.prenom} {adminInfo.nom}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">Email</p>
                        <p className="font-medium text-slate-900">{adminInfo.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <IdCard className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">Matricule</p>
                        <p className="font-medium text-slate-900 font-mono">{adminInfo.matricule}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">Rôle</p>
                        <Badge className="bg-slate-800 text-white">{adminInfo.role}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">Date de création du compte</p>
                        <p className="font-medium text-slate-900">
                          {new Date(adminInfo.dateCreation).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">Département</p>
                        <p className="font-medium text-slate-900">{adminInfo.departement}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section Activité récente */}
            <Card className="shadow-sm">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="flex items-center text-lg text-slate-800">
                  <Activity className="h-5 w-5 mr-2" />
                  Activité récente
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Heure</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Détails</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activitesRecentes.map((activite) => {
                      const IconComponent = activite.icon
                      return (
                        <TableRow key={activite.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-slate-400" />
                              <div>
                                <p className="font-medium text-sm">
                                  {new Date(activite.date).toLocaleDateString("fr-FR")}
                                </p>
                                <p className="text-xs text-slate-500">{activite.heure}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <IconComponent className="h-4 w-4 text-slate-600" />
                              <span className="font-medium">{activite.action}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-slate-600">{activite.details}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className={getActivityTypeColor(activite.type)}>{activite.type}</Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Section Actions */}
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="flex items-center text-lg text-slate-800">
                  <Shield className="h-5 w-5 mr-2" />
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Button onClick={openEditDialog} className="w-full bg-slate-800 hover:bg-slate-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier mes informations
                </Button>

                <Button onClick={() => setIsPasswordDialogOpen(true)} variant="outline" className="w-full hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800">
                  <Lock className="h-4 w-4 mr-2" />
                  Changer le mot de passe
                </Button>

                <Button onClick={handleLogout} variant="destructive" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Se déconnecter
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dialog Modifier informations */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Edit className="h-5 w-5 mr-2" />
                Modifier mes informations
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    value={editForm.prenom}
                    onChange={(e) => setEditForm({ ...editForm, prenom: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    value={editForm.nom}
                    onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  value={editForm.telephone}
                  onChange={(e) => setEditForm({ ...editForm, telephone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="departement">Département</Label>
                <Input
                  id="departement"
                  value={editForm.departement}
                  onChange={(e) => setEditForm({ ...editForm, departement: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleEditSubmit} className="bg-slate-800 hover:bg-slate-700">
                  Sauvegarder
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog Changer mot de passe */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Changer le mot de passe
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handlePasswordSubmit} className="bg-slate-800 hover:bg-slate-700">
                  Modifier
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
