"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Label } from "../ui/label"
import { Plus, Search, Edit, Trash2, UserPlus, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "../hooks/use-toast"
import Layout from "../layout/layout"

interface User {
  id: number
  nom: string
  prenom: string
  email: string
  role: "admin" | "affecteur" | "magasinier"

  dateCreation: string
}

const initialUsers: User[] = [
  {
    id: 1,
    nom: "Benali",
    prenom: "Ahmed",
    email: "ahmed.benali@menara-prefa.ma",
    role: "affecteur",
    dateCreation: "2024-01-15",
  },
  {
    id: 2,
    nom: "Zahra",
    prenom: "Fatima",
    email: "fatima.zahra@menara-prefa.ma",
    role: "magasinier",
    dateCreation: "2024-01-20",
  },
  {
    id: 3,
    nom: "Alami",
    prenom: "Youssef",
    email: "youssef.alami@menara-prefa.ma",
    role: "magasinier",
    dateCreation: "2024-02-01",
  },
  {
    id: 4,
    nom: "Tazi",
    prenom: "Omar",
    email: "omar.tazi@menara-prefa.ma",
    role: "admin",
    dateCreation: "2024-02-05",
  },
  {
    id: 5,
    nom: "Idrissi",
    prenom: "Aicha",
    email: "aicha.idrissi@menara-prefa.ma",
    role: "affecteur",
    dateCreation: "2024-02-10",
  },
  {
    id: 6,
    nom: "Bennani",
    prenom: "Mohammed",
    email: "mohammed.bennani@menara-prefa.ma",
    role: "magasinier",
    dateCreation: "2024-02-15",
  },
  {
    id: 7,
    nom: "Alaoui",
    prenom: "Zineb",
    email: "zineb.alaoui@menara-prefa.ma",
    role: "affecteur",
    dateCreation: "2024-02-20",
  },
]

const getRoleBadge = (role: string) => {
  const variants = {
    admin: "bg-red-100 text-red-800 border-red-200",
    affecteur: "bg-blue-100 text-blue-800 border-blue-200",
    magasinier: "bg-green-100 text-green-800 border-green-200",
  }
  return variants[role as keyof typeof variants] || "bg-gray-100 text-gray-800 border-gray-200"
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    role: "",
    password: "",
  })
  const { toast } = useToast()

  const USERS_PER_PAGE = 3

  // Filtrer les utilisateurs
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE)
  const startIndex = (currentPage - 1) * USERS_PER_PAGE
  const endIndex = startIndex + USERS_PER_PAGE
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  // Réinitialiser la page quand on filtre
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleRoleFilter = (value: string) => {
    setSelectedRole(value)
    setCurrentPage(1)
  }

  const handleAddUser = () => {
    if (!formData.nom.trim() || !formData.prenom.trim() || !formData.email.trim() || !formData.role) {
      toast({
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis",
        variant: "destructive",
      })
      return
    }

    // Vérifier si l'email existe déjà
    if (users.some((user) => user.email === formData.email)) {
      toast({
        title: "Erreur",
        description: "Cet email est déjà utilisé",
        variant: "destructive",
      })
      return
    }

    const newUser: User = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      role: formData.role as "admin" | "affecteur" | "magasinier",
      dateCreation: new Date().toISOString().split("T")[0],
    }

    setUsers([...users, newUser])
    setFormData({ nom: "", prenom: "", email: "", role: "", password: "" })
    setIsAddDialogOpen(false)
    toast({
      title: "Succès",
      description: "Utilisateur ajouté avec succès",
    })
  }

  const handleEditUser = () => {
    if (!formData.nom.trim() || !formData.prenom.trim() || !formData.email.trim() || !formData.role || !editingUser) {
      toast({
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis",
        variant: "destructive",
      })
      return
    }

    // Vérifier si l'email existe déjà (sauf pour l'utilisateur actuel)
    if (users.some((user) => user.email === formData.email && user.id !== editingUser.id)) {
      toast({
        title: "Erreur",
        description: "Cet email est déjà utilisé",
        variant: "destructive",
      })
      return
    }

    const updatedUsers = users.map((user) =>
      user.id === editingUser.id
        ? {
            ...user,
            nom: formData.nom,
            prenom: formData.prenom,
            email: formData.email,
            role: formData.role as "admin" | "affecteur" | "magasinier",
          }
        : user,
    )

    setUsers(updatedUsers)
    setFormData({ nom: "", prenom: "", email: "", role: "", password: "" })
    setEditingUser(null)
    setIsEditDialogOpen(false)
    toast({
      title: "Succès",
      description: "Utilisateur modifié avec succès",
    })
  }

  const handleDeleteUser = (id: number) => {
    const userToDelete = users.find((user) => user.id === id)
    if (userToDelete) {
      setUsers(users.filter((user) => user.id !== id))
      toast({
        title: "Succès",
        description: `Utilisateur ${userToDelete.prenom} ${userToDelete.nom} supprimé avec succès`,
      })

      // Ajuster la page si nécessaire
      const newFilteredUsers = users.filter((user) => user.id !== id)
      const newTotalPages = Math.ceil(newFilteredUsers.length / USERS_PER_PAGE)
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages)
      }
    }
  }

  const openAddDialog = () => {
    setFormData({ nom: "", prenom: "", email: "", role: "", password: "" })
    setIsAddDialogOpen(true)
  }

  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      password: "",
    })
    setIsEditDialogOpen(true)
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <Layout>
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestion des Utilisateurs</h1>
          <p className="text-slate-600 mt-2">Gérer les utilisateurs ayant accès à l'application</p>
        </div>
        <Button onClick={openAddDialog} className="bg-menara-red hover:bg-menara-red/90 text-white shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Utilisateur
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, prénom ou email..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRole} onValueChange={handleRoleFilter}>
  <SelectTrigger className="w-48">
    <SelectValue placeholder="Filtrer par rôle" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all" className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800">
      Tous les rôles
    </SelectItem>
    <SelectItem value="admin" className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800">
      Administrateur
    </SelectItem>
    <SelectItem value="affecteur" className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800">
      Affecteur
    </SelectItem>
    <SelectItem value="magasinier" className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800">
      Magasinier
    </SelectItem>
  </SelectContent>
</Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center justify-between">
            <span>Liste des Utilisateurs ({filteredUsers.length})</span>
            <span className="text-sm font-normal text-slate-500">
              Page {currentPage} sur {totalPages}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom Complet</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Date de Création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">
                    {user.prenom} {user.nom}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={`border ${getRoleBadge(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.dateCreation).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-blue-50"
                        onClick={() => openEditDialog(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination */}
          {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1"  />
                  Précédent
                </Button>

                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? "bg-slate-800 text-white" : ""}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Dialog d'ajout */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-slate-900">
              <UserPlus className="h-5 w-5 mr-2 text-menara-red" />
              Ajouter un Utilisateur
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  placeholder="Nom de famille"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  placeholder="Prénom"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@menara-prefa.ma"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="role">Rôle *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="affecteur">Affecteur</SelectItem>
                  <SelectItem value="magasinier">Magasinier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="password">Mot de passe temporaire</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddUser} className="bg-menara-red hover:bg-menara-red/90 text-white">
                Créer l'utilisateur
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-slate-900">
              <Edit className="h-5 w-5 mr-2 text-menara-red" />
              Modifier l'Utilisateur
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-nom">Nom *</Label>
                <Input
                  id="edit-nom"
                  placeholder="Nom de famille"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-prenom">Prénom *</Label>
                <Input
                  id="edit-prenom"
                  placeholder="Prénom"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="email@menara-prefa.ma"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Rôle *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="affecteur">Affecteur</SelectItem>
                  <SelectItem value="magasinier">Magasinier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleEditUser} className="bg-menara-red hover:bg-menara-red/90 text-white">
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
