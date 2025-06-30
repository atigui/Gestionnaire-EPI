"use client"

import { useState } from "react"
import { Plus, Trash2, Save, AlertCircle } from "lucide-react"
import { useAffecteurStore, type MaterielLine } from "../../lib/use-affecteur-store"
import Layout from "../layout/layout-affectant"

// Imports directs des composants UI
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { CardContent } from "../ui/card"
import { CardHeader } from "../ui/card"
import { CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../ui/table"
import { Alert, AlertDescription } from "../ui/alert"

export function NouvelleAffectation() {
  const { magasiniers, emplacements, categories, materielsByCategory, addAffectation } = useAffecteurStore()

  const [magasinier, setMagasinier] = useState("")
  const [emplacement, setEmplacement] = useState("")
  const [dateAffectation, setDateAffectation] = useState("")
  const [materiels, setMateriels] = useState<MaterielLine[]>([{ id: "1", categorie: "", materiel: "", quantite: 1 }])
  const [errors, setErrors] = useState<string[]>([])

  const addMaterielLine = () => {
    const newId = Date.now().toString()
    const newMateriel: MaterielLine = {
      id: newId,
      categorie: "",
      materiel: "",
      quantite: 1,
    }
    setMateriels((prev) => [...prev, newMateriel])
  }

  const removeMaterielLine = (id: string) => {
    if (materiels.length > 1) {
      setMateriels((prev) => prev.filter((m) => m.id !== id))
    }
  }

  const updateMaterielLine = (id: string, field: keyof MaterielLine, value: string | number) => {
    setMateriels((prev) =>
      prev.map((materiel) => {
        if (materiel.id === id) {
          const updated = { ...materiel, [field]: value }
          // Si on change la catégorie, on remet le matériel à vide
          if (field === "categorie") {
            updated.materiel = ""
          }
          return updated
        }
        return materiel
      }),
    )
  }
  const validateForm = (): boolean => {
    const newErrors: string[] = []

    if (!magasinier) {
      newErrors.push("Veuillez sélectionner un magasinier")
    }

    if (!emplacement) {
      newErrors.push("Veuillez sélectionner un emplacement")
    }

    if (!dateAffectation) {
      newErrors.push("Veuillez sélectionner une date d'affectation")
    }

    // Vérifier que tous les matériels sont correctement remplis
    const incompleteMaterials = materiels.filter((m) => !m.categorie || !m.materiel || m.quantite <= 0)
    if (incompleteMaterials.length > 0) {
      newErrors.push("Veuillez compléter tous les matériels ou les supprimer")
    }

    // Vérifier qu'il y a au moins un matériel
    const completeMaterials = materiels.filter((m) => m.categorie && m.materiel && m.quantite > 0)
    if (completeMaterials.length === 0) {
      newErrors.push("Veuillez ajouter au moins un matériel à affecter")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const resetForm = () => {
    setMagasinier("")
    setEmplacement("")
    setDateAffectation("")
    setMateriels([{ id: "1", categorie: "", materiel: "", quantite: 1 }])
    setErrors([])
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // Préparer les données pour l'affectation
      const affectationMateriels = materiels
        .filter((m) => m.categorie && m.materiel)
        .map((m) => ({
          categorie: m.categorie,
          nom: m.materiel,
          quantite: m.quantite,
        }))

      // Ajouter l'affectation au store
      addAffectation({
        magasinier,
        emplacement,
        date: dateAffectation,
        materiels: affectationMateriels,
      })

      // Réinitialiser le formulaire automatiquement après validation
      resetForm()
    }
  }

  // Obtenir la date d'aujourd'hui pour la valeur par défaut
  const today = new Date().toISOString().split("T")[0]

  return (
    <Layout>
      <div className="space-y-6 mt-6 mr-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Nouvelle Affectation EPI</CardTitle>
            <p className="text-sm text-gray-600">
              Créez une nouvelle affectation de matériels de protection individuelle
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Affichage des erreurs */}
            {errors.length > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            {/* Informations générales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="magasinier">Magasinier *</Label>
                <Select value={magasinier} onValueChange={setMagasinier}>
                  <SelectTrigger className={!magasinier && errors.length > 0 ? "border-red-300" : ""}>
                    <SelectValue placeholder="Sélectionner un magasinier" />
                  </SelectTrigger>
                  <SelectContent>
                    {magasiniers.map((mag) => (
                      <SelectItem
                        className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800"
                        key={mag}
                        value={mag}
                      >
                        {mag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emplacement">Emplacement *</Label>
                <Select value={emplacement} onValueChange={setEmplacement}>
                  <SelectTrigger className={!emplacement && errors.length > 0 ? "border-red-300" : ""}>
                    <SelectValue placeholder="Sélectionner un emplacement" />
                  </SelectTrigger>
                  <SelectContent>
                    {emplacements.map((emp) => (
                      <SelectItem
                        className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800"
                        key={emp}
                        value={emp}
                      >
                        {emp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date d'affectation *</Label>
                <Input
                  type="date"
                  value={dateAffectation}
                  onChange={(e) => setDateAffectation(e.target.value)}
                  min={today}
                  className={!dateAffectation && errors.length > 0 ? "border-red-300" : ""}
                />
              </div>
            </div>

            {/* Section matériels */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Matériels à affecter *</h3>
                <Button onClick={addMaterielLine} size="sm" className="bg-red-600 hover:bg-red-700" type="button">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un matériel
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Catégorie</TableHead>
                      <TableHead className="w-1/3">Matériel</TableHead>
                      <TableHead className="w-24">Quantité</TableHead>
                      <TableHead className="w-16">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materiels.map((materiel, index) => (
                      <TableRow key={materiel.id}>
                        <TableCell>
                          <Select
                            value={materiel.categorie}
                            onValueChange={(value) => updateMaterielLine(materiel.id, "categorie", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem
                                  className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800"
                                  key={cat}
                                  value={cat}
                                >
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        <TableCell>
                          <Select
                            value={materiel.materiel}
                            onValueChange={(value) => updateMaterielLine(materiel.id, "materiel", value)}
                            disabled={!materiel.categorie}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  materiel.categorie ? "Sélectionner un matériel" : "Choisir d'abord une catégorie"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {materiel.categorie &&
                                materielsByCategory[materiel.categorie]?.map((mat) => (
                                  <SelectItem
                                    className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800"
                                    key={mat}
                                    value={mat}
                                  >
                                    {mat}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            max="999"
                            value={materiel.quantite}
                            onChange={(e) => {
                              const value = Number.parseInt(e.target.value) || 1
                              updateMaterielLine(materiel.id, "quantite", Math.max(1, value))
                            }}
                            className="w-20"
                          />
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMaterielLine(materiel.id)}
                            disabled={materiels.length === 1}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {materiels.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Plus className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                  <p>Aucun matériel ajouté. Cliquez sur "Ajouter un matériel" pour commencer.</p>
                </div>
              )}
            </div>

            {/* Résumé */}
            {materiels.some((m) => m.categorie && m.materiel) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Résumé de l'affectation</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Magasinier:</span> {magasinier || "Non sélectionné"}
                  </p>
                  <p>
                    <span className="font-medium">Emplacement:</span> {emplacement || "Non sélectionné"}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {dateAffectation ? new Date(dateAffectation).toLocaleDateString("fr-FR") : "Non sélectionnée"}
                  </p>
                  <p>
                    <span className="font-medium">Nombre de matériels:</span>{" "}
                    {materiels.filter((m) => m.categorie && m.materiel).length}
                  </p>
                  <p>
                    <span className="font-medium">Quantité totale:</span>{" "}
                    {materiels.filter((m) => m.categorie && m.materiel).reduce((sum, m) => sum + m.quantite, 0)} unités
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700" type="button">
                <Save className="mr-2 h-4 w-4" />
                Valider l'affectation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
