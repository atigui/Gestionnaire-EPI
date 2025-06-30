"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Label } from "../ui/label"
import { Plus, Search, Edit, Trash2, UserPlus, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "../hooks/use-toast"
import Layout from "../layout/layout"

interface Employee {
  matricule: string
  nom: string
  prenom: string
  poste: string
  service: string
  emplacement: string
}

const initialEmployees: Employee[] = [
  {
    matricule: "EMP001",
    nom: "Bennani",
    prenom: "Mohammed",
    poste: "Maçon",
    service: "Construction",
    emplacement: "Chantier A",
  },
  {
    matricule: "EMP002",
    nom: "Idrissi",
    prenom: "Aicha",
    poste: "Chef d'équipe",
    service: "Supervision",
    emplacement: "Chantier B",
  },
  {
    matricule: "EMP003",
    nom: "Tazi",
    prenom: "Omar",
    poste: "Électricien",
    service: "Électricité",
    emplacement: "Chantier C",
  },
  {
    matricule: "EMP004",
    nom: "Alaoui",
    prenom: "Zineb",
    poste: "Ingénieur",
    service: "Bureau d'études",
    emplacement: "Chantier D",
  },
  {
    matricule: "EMP005",
    nom: "Benali",
    prenom: "Ahmed",
    poste: "Soudeur",
    service: "Construction",
    emplacement: "Chantier A",
  },
  {
    matricule: "EMP006",
    nom: "Zahra",
    prenom: "Fatima",
    poste: "Contrôleur qualité",
    service: "Qualité",
    emplacement: "Chantier C",
  },
]

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedService, setSelectedService] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [formData, setFormData] = useState({
    matricule: "",
    nom: "",
    prenom: "",
    poste: "",
    service: "",
    emplacement: "",
  })
  const { toast } = useToast()

  const EMPLOYEES_PER_PAGE = 3

  // Filtrer les employés
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.prenom.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesService = selectedService === "all" || employee.service === selectedService
    return matchesSearch && matchesService
  })

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / EMPLOYEES_PER_PAGE)
  const startIndex = (currentPage - 1) * EMPLOYEES_PER_PAGE
  const endIndex = startIndex + EMPLOYEES_PER_PAGE
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex)

  // Réinitialiser la page quand on filtre
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleServiceFilter = (value: string) => {
    setSelectedService(value)
    setCurrentPage(1)
  }

  const handleAddEmployee = () => {
    if (
      !formData.matricule.trim() ||
      !formData.nom.trim() ||
      !formData.prenom.trim() ||
      !formData.service ||
      !formData.emplacement
    ) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont obligatoires",
        variant: "destructive",
      })
      return
    }

    // Vérifier si le matricule existe déjà
    if (employees.some((emp) => emp.matricule === formData.matricule)) {
      toast({
        title: "Erreur",
        description: "Ce matricule existe déjà",
        variant: "destructive",
      })
      return
    }

    const newEmployee: Employee = {
      matricule: formData.matricule,
      nom: formData.nom,
      prenom: formData.prenom,
      poste: formData.poste,
      service: formData.service,
      emplacement: formData.emplacement,
    }

    setEmployees([...employees, newEmployee])
    setFormData({ matricule: "", nom: "", prenom: "", poste: "", service: "", emplacement: "" })
    setIsAddDialogOpen(false)
    toast({
      title: "Succès",
      description: "Employé ajouté avec succès",
    })
  }

  const handleEditEmployee = () => {
    if (
      !formData.matricule.trim() ||
      !formData.nom.trim() ||
      !formData.prenom.trim() ||
      !formData.service ||
      !formData.emplacement ||
      !editingEmployee
    ) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont obligatoires",
        variant: "destructive",
      })
      return
    }

    // Vérifier si le matricule existe déjà (sauf pour l'employé actuel)
    if (employees.some((emp) => emp.matricule === formData.matricule && emp.matricule !== editingEmployee.matricule)) {
      toast({
        title: "Erreur",
        description: "Ce matricule existe déjà",
        variant: "destructive",
      })
      return
    }

    const updatedEmployees = employees.map((emp) =>
      emp.matricule === editingEmployee.matricule
        ? {
            ...emp,
            matricule: formData.matricule,
            nom: formData.nom,
            prenom: formData.prenom,
            poste: formData.poste,
            service: formData.service,
            emplacement: formData.emplacement,
          }
        : emp,
    )

    setEmployees(updatedEmployees)
    setFormData({ matricule: "", nom: "", prenom: "", poste: "", service: "", emplacement: "" })
    setEditingEmployee(null)
    setIsEditDialogOpen(false)
    toast({
      title: "Succès",
      description: "Employé modifié avec succès",
    })
  }

  const handleDeleteEmployee = (matricule: string) => {
    const employeeToDelete = employees.find((emp) => emp.matricule === matricule)
    if (employeeToDelete) {
      setEmployees(employees.filter((emp) => emp.matricule !== matricule))
      toast({
        title: "Succès",
        description: `Employé ${employeeToDelete.prenom} ${employeeToDelete.nom} supprimé avec succès`,
      })

      // Ajuster la page si nécessaire
      const newFilteredEmployees = employees.filter((emp) => emp.matricule !== matricule)
      const newTotalPages = Math.ceil(newFilteredEmployees.length / EMPLOYEES_PER_PAGE)
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages)
      }
    }
  }

  const openAddDialog = () => {
    setFormData({ matricule: "", nom: "", prenom: "", poste: "", service: "", emplacement: "" })
    setIsAddDialogOpen(true)
  }

  const openEditDialog = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({
      matricule: employee.matricule,
      nom: employee.nom,
      prenom: employee.prenom,
      poste: employee.poste,
      service: employee.service,
      emplacement: employee.emplacement,
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
        {/* Header avec logo */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "#1E2D59" }}>
                Gestion des Employés
              </h1>
              <p className="text-slate-600 mt-2">Gérer les employés qui reçoivent les EPI</p>
            </div>
          </div>
          <Button onClick={openAddDialog} className="text-white shadow-lg" style={{ backgroundColor: "#D31E25" }}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Employé
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par matricule, nom, prénom ou poste..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedService} onValueChange={handleServiceFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les services</SelectItem>
                  <SelectItem value="Construction">Construction</SelectItem>
                  <SelectItem value="Électricité">Électricité</SelectItem>
                  <SelectItem value="Supervision">Supervision</SelectItem>
                  <SelectItem value="Bureau d'études">Bureau d'études</SelectItem>
                  <SelectItem value="Qualité">Qualité</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employees Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Liste des Employés ({filteredEmployees.length})</span>
              <span className="text-sm font-normal text-slate-500">
                Page {currentPage} sur {totalPages}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Nom Complet</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Emplacement</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentEmployees.map((employee) => (
                  <TableRow key={employee.matricule}>
                    <TableCell className="font-mono font-medium">{employee.matricule}</TableCell>
                    <TableCell className="font-medium">
                      {employee.prenom} {employee.nom}
                    </TableCell>
                    <TableCell>{employee.service}</TableCell>
                    <TableCell>{employee.emplacement}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(employee)}
                          style={{ color: "#8C8C8C" }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteEmployee(employee.matricule)}
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
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Précédent
                </Button>

                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      style={currentPage === page ? { backgroundColor: "#1E2D59", color: "white" } : {}}
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
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center" style={{ color: "#1E2D59" }}>
                <UserPlus className="h-5 w-5 mr-2" style={{ color: "#D31E25" }} />
                Ajouter un Employé
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="matricule">Matricule *</Label>
                <Input
                  id="matricule"
                  placeholder="EMP001"
                  value={formData.matricule}
                  onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                />
              </div>
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
                <Label htmlFor="poste">Poste</Label>
                <Input
                  id="poste"
                  placeholder="Poste occupé"
                  value={formData.poste}
                  onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="service">Service *</Label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) => setFormData({ ...formData, service: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Construction">Construction</SelectItem>
                      <SelectItem value="Électricité">Électricité</SelectItem>
                      <SelectItem value="Supervision">Supervision</SelectItem>
                      <SelectItem value="Bureau d'études">Bureau d'études</SelectItem>
                      <SelectItem value="Qualité">Qualité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="emplacement">Emplacement *</Label>
                  <Select
                    value={formData.emplacement}
                    onValueChange={(value) => setFormData({ ...formData, emplacement: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner l'emplacement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chantier A">Chantier A</SelectItem>
                      <SelectItem value="Chantier B">Chantier B</SelectItem>
                      <SelectItem value="Chantier C">Chantier C</SelectItem>
                      <SelectItem value="Chantier D">Chantier D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddEmployee} className="text-white" style={{ backgroundColor: "#D31E25" }}>
                  Ajouter l'employé
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog de modification */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center" style={{ color: "#1E2D59" }}>
                <Edit className="h-5 w-5 mr-2" style={{ color: "#D31E25" }} />
                Modifier l'Employé
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-matricule">Matricule *</Label>
                <Input
                  id="edit-matricule"
                  placeholder="EMP001"
                  value={formData.matricule}
                  onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                />
              </div>
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
                <Label htmlFor="edit-poste">Poste</Label>
                <Input
                  id="edit-poste"
                  placeholder="Poste occupé"
                  value={formData.poste}
                  onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-service">Service *</Label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) => setFormData({ ...formData, service: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Construction">Construction</SelectItem>
                      <SelectItem value="Électricité">Électricité</SelectItem>
                      <SelectItem value="Supervision">Supervision</SelectItem>
                      <SelectItem value="Bureau d'études">Bureau d'études</SelectItem>
                      <SelectItem value="Qualité">Qualité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-emplacement">Emplacement *</Label>
                  <Select
                    value={formData.emplacement}
                    onValueChange={(value) => setFormData({ ...formData, emplacement: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner l'emplacement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chantier A">Chantier A</SelectItem>
                      <SelectItem value="Chantier B">Chantier B</SelectItem>
                      <SelectItem value="Chantier C">Chantier C</SelectItem>
                      <SelectItem value="Chantier D">Chantier D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleEditEmployee} className="text-white" style={{ backgroundColor: "#D31E25" }}>
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
