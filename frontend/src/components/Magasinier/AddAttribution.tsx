"use client"

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Plus, Trash2, User, CheckCircle, Package, AlertTriangle, RefreshCw } from "lucide-react"
import {
  saveAttribution,
  getEmployeByMatricule,
  getTousLesStocks,
  type MaterielAttribution,
  type StockMateriel,
} from "../../lib/data-store"
import { useNavigate } from "react-router-dom"
import Layout from "../layout/layout-magasinier"

export default function NouvelleAttributionPage() {
  const navigate = useNavigate()
  const [matricule, setMatricule] = useState("")
  const [materiels, setMateriels] = useState<MaterielAttribution[]>([{ categorie: "", nom: "", quantite: 1 }])
  const [dateAttribution, setDateAttribution] = useState(new Date().toISOString().split("T")[0])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stocksDisponibles, setStocksDisponibles] = useState<StockMateriel[]>([])
  const [showStocksDialog, setShowStocksDialog] = useState(false)

  // Charger les stocks au montage du composant et après chaque attribution
  const chargerStocks = () => {
    const stocks = getTousLesStocks()
    setStocksDisponibles(stocks.filter((stock) => stock.quantiteDisponible > 0))
  }

  useEffect(() => {
    chargerStocks()
  }, [])

  // Obtenir les catégories disponibles basées sur les stocks
  const getCategoriesDisponibles = (): string[] => {
    const categories = new Set<string>()
    stocksDisponibles.forEach((stock) => {
      categories.add(stock.categorie)
    })
    return Array.from(categories)
  }

  // Obtenir les matériels pour une catégorie donnée
  const getMaterielsForCategorie = (categorie: string): StockMateriel[] => {
    return stocksDisponibles.filter((stock) => stock.categorie === categorie)
  }

  const ajouterMateriel = () => {
    setMateriels([...materiels, { categorie: "", nom: "", quantite: 1 }])
  }

  const supprimerMateriel = (index: number) => {
    if (materiels.length > 1) {
      setMateriels(materiels.filter((_, i) => i !== index))
    }
  }

  const modifierMateriel = (index: number, field: keyof MaterielAttribution, value: string | number) => {
    const nouveauxMateriels = [...materiels]

    if (field === "categorie") {
      nouveauxMateriels[index] = { ...nouveauxMateriels[index], categorie: value as string, nom: "" }
    } else {
      nouveauxMateriels[index] = { ...nouveauxMateriels[index], [field]: value }
    }

    setMateriels(nouveauxMateriels)
  }

  const getQuantiteMaxDisponible = (nomMaterielComplet: string): number => {
    const stock = stocksDisponibles.find((s) => {
      const nomComplet = `${s.nom} Taille ${s.taille}`
      return nomComplet === nomMaterielComplet
    })
    return stock ? stock.quantiteDisponible : 0
  }

  const validerAttribution = () => {
    if (!matricule || !materiels.some((m) => m.nom && m.categorie)) {
      return
    }

    // Vérifier que les quantités ne dépassent pas le disponible
    const erreurs = materiels.filter((m) => {
      if (m.nom && m.categorie) {
        const maxDisponible = getQuantiteMaxDisponible(m.nom)
        return m.quantite > maxDisponible
      }
      return false
    })

    if (erreurs.length > 0) {
      return
    }

    setShowConfirmDialog(true)
  }

  const confirmerAttribution = async () => {
    setIsSubmitting(true)

    try {
      const employe = getEmployeByMatricule(matricule)
      const date = new Date(dateAttribution)

      const nouvelleAttribution = {
        id: `ATT-${Date.now()}`,
        matricule,
        employe: employe?.nom || "Employé inconnu",
        materiels: materiels.filter((m) => m.nom && m.categorie),
        date: dateAttribution,
        mois: date.getMonth() + 1,
        annee: date.getFullYear(),
      }

      // Sauvegarder l'attribution (cela met automatiquement à jour les stocks)
      saveAttribution(nouvelleAttribution)

      // Recharger les stocks pour mettre à jour l'interface
      chargerStocks()

      setShowConfirmDialog(false)
      setMatricule("")
      setMateriels([{ categorie: "", nom: "", quantite: 1 }])
      setDateAttribution(new Date().toISOString().split("T")[0])

      // Afficher un message de succès
    } catch (error) {
      console.error("Erreur lors de la validation de l'attribution.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const annulerAttribution = () => {
    setShowConfirmDialog(false)
  }

  const employeInfo = matricule ? getEmployeByMatricule(matricule) : null
  const materielsValides = materiels.filter((m) => m.nom && m.categorie)
  const categoriesDisponibles = getCategoriesDisponibles()
  const hasCategoriesData = categoriesDisponibles.length > 0

  // Calculer les totaux pour l'affichage
  const totalTypesMateriels = stocksDisponibles.length
  const totalUnitesDisponibles = stocksDisponibles.reduce((total, stock) => total + stock.quantiteDisponible, 0)

  return (
    <Layout>
      <div className="space-y-6 mt-10">
        <div>
          <h1 className="text-3xl font-bold text-[#2B3A67]">Nouvelle attribution</h1>
          <p className="text-gray-600">Attribuez des équipements de protection individuelle à un employé</p>
        </div>

        {/* Résumé compact des matériels affectés - Couleurs Ménara */}
        <Card className="bg-gradient-to-r from-[#2B3A67]/5 to-[#C41E3A]/5 border-[#2B3A67]/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-[#2B3A67]" />
                <div>
                  <p className="font-medium text-[#2B3A67]">Stocks disponibles en temps réel</p>
                  <p className="text-sm text-gray-600">
                    {totalTypesMateriels} types de matériels • {totalUnitesDisponibles} unités disponibles
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={chargerStocks}
                  className="bg-white hover:bg-[#2B3A67]/5 border-[#2B3A67]/30 text-[#2B3A67] hover:text-[#2B3A67]"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStocksDialog(true)}
                  className="bg-white hover:bg-[#2B3A67]/5 border-[#2B3A67]/30 text-[#2B3A67] hover:text-[#2B3A67]"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Consulter les stocks
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-[#C41E3A]" />
                  Informations employé
                </CardTitle>
                <CardDescription>Saisissez le matricule de l'employé bénéficiaire</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="matricule">Matricule employé</Label>
                  <Input
                    id="matricule"
                    placeholder="Ex: EMP001"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value.toUpperCase())}
                    className="focus:border-[#2B3A67] focus:ring-[#2B3A67]"
                  />
                  {employeInfo && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800">{employeInfo.nom}</p>
                      <p className="text-xs text-green-600">
                        {employeInfo.poste} - {employeInfo.service}
                      </p>
                    </div>
                  )}
                  {matricule && !employeInfo && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">Employé non trouvé dans la base de données</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date d'attribution</Label>
                  <Input
                    id="date"
                    type="date"
                    value={dateAttribution}
                    onChange={(e) => setDateAttribution(e.target.value)}
                    className="focus:border-[#2B3A67] focus:ring-[#2B3A67]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Matériels à attribuer</CardTitle>
                    <CardDescription>Sélectionnez parmi les matériels disponibles en stock</CardDescription>
                  </div>
                  <Button
                    onClick={ajouterMateriel}
                    size="sm"
                    variant="outline"
                    className="hover:text-white hover:bg-[#2B3A67] focus:text-white focus:bg-[#2B3A67] border-[#2B3A67]/30"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!hasCategoriesData && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">Aucun matériel disponible en stock</p>
                  </div>
                )}

                {materiels.map((materiel, index) => (
                  <div key={index} className="grid gap-4 p-4 border rounded-lg border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div className="space-y-2">
                        <Label>Catégorie</Label>
                        <Select
                          value={materiel.categorie || undefined}
                          onValueChange={(value) => modifierMateriel(index, "categorie", value)}
                          disabled={!hasCategoriesData}
                        >
                          <SelectTrigger className="focus:border-[#2B3A67] focus:ring-[#2B3A67]">
                            <SelectValue
                              placeholder={
                                hasCategoriesData ? "Sélectionner une catégorie" : "Aucune catégorie disponible"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {categoriesDisponibles.map((cat) => (
                              <SelectItem
                                className="hover:text-white hover:bg-[#2B3A67] focus:text-white focus:bg-[#2B3A67]"
                                key={cat}
                                value={cat}
                              >
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Matériel</Label>
                        <Select
                          value={materiel.nom || undefined}
                          onValueChange={(value) => modifierMateriel(index, "nom", value)}
                          disabled={!materiel.categorie}
                        >
                          <SelectTrigger className="focus:border-[#2B3A67] focus:ring-[#2B3A67]">
                            <SelectValue
                              placeholder={
                                materiel.categorie ? "Sélectionner un matériel" : "Choisir d'abord une catégorie"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {getMaterielsForCategorie(materiel.categorie).map((stock) => {
                              const nomComplet = `${stock.nom} Taille ${stock.taille}`
                              return (
                                <SelectItem
                                  className="hover:text-white hover:bg-[#2B3A67] focus:text-white focus:bg-[#2B3A67]"
                                  key={nomComplet}
                                  value={nomComplet}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <span>{nomComplet}</span>
                                    <Badge variant="secondary" className="ml-2 text-xs bg-[#C41E3A]/10 text-[#C41E3A]">
                                      Stock: {stock.quantiteDisponible}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-2 items-end">
                        <div className="flex-1 space-y-2">
                          <Label>Quantité</Label>
                          <Input
                            type="number"
                            min="1"
                            max={getQuantiteMaxDisponible(materiel.nom)}
                            value={materiel.quantite}
                            onChange={(e) =>
                              modifierMateriel(
                                index,
                                "quantite",
                                Math.min(Number.parseInt(e.target.value) || 1, getQuantiteMaxDisponible(materiel.nom)),
                              )
                            }
                            className="focus:border-[#2B3A67] focus:ring-[#2B3A67]"
                          />
                          {materiel.nom && (
                            <p className="text-xs text-gray-500">Max: {getQuantiteMaxDisponible(materiel.nom)}</p>
                          )}
                        </div>
                        <Button
                          onClick={() => supprimerMateriel(index)}
                          size="sm"
                          variant="outline"
                          disabled={materiels.length === 1}
                          className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
                <CardDescription>Vérifiez les informations avant validation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Matricule</Label>
                  <p className="text-sm text-gray-600">{matricule || "Non renseigné"}</p>
                  {employeInfo && <p className="text-sm font-medium text-[#C41E3A]">{employeInfo.nom}</p>}
                </div>

                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm text-gray-600">{new Date(dateAttribution).toLocaleDateString("fr-FR")}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Matériels ({materielsValides.length})</Label>
                  <div className="space-y-2 mt-2">
                    {materielsValides.length > 0 ? (
                      materielsValides.map((materiel, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded">
                          <Badge variant="outline" className="mb-1 border-[#2B3A67]/30 text-[#2B3A67]">
                            {materiel.categorie}
                          </Badge>
                          <p className="text-sm">
                            {materiel.nom} × {materiel.quantite}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Aucun matériel sélectionné</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={validerAttribution}
            className="bg-[#C41E3A] hover:bg-[#C41E3A]/90 text-white flex items-center gap-2"
            disabled={!matricule || !materielsValides.length}
          >
            <CheckCircle className="h-4 w-4" />
            Valider l'attribution
          </Button>
        </div>

        {/* Dialog pour consulter les stocks */}
        <Dialog open={showStocksDialog} onOpenChange={setShowStocksDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-[#2B3A67]" />
                Stocks disponibles en temps réel
              </DialogTitle>
              <DialogDescription>État actuel des stocks après toutes les attributions</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {(() => {
                // Grouper les stocks par catégorie
                const stocksParCategorie: { [categorie: string]: StockMateriel[] } = {}
                stocksDisponibles.forEach((stock) => {
                  if (!stocksParCategorie[stock.categorie]) {
                    stocksParCategorie[stock.categorie] = []
                  }
                  stocksParCategorie[stock.categorie].push(stock)
                })

                return Object.keys(stocksParCategorie).map((categorie) => (
                  <div key={categorie} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="border-[#2B3A67]/30 text-[#2B3A67] font-medium">
                        {categorie}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        ({stocksParCategorie[categorie].length} type
                        {stocksParCategorie[categorie].length > 1 ? "s" : ""})
                      </span>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {stocksParCategorie[categorie].map((stock, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded border border-gray-100">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm text-[#2B3A67]">{stock.nom}</p>
                            <div className="flex items-center gap-1">
                              {stock.quantiteDisponible > 0 ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-3 w-3 text-orange-500" />
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">Taille: {stock.taille}</p>
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-green-600 font-medium">Disponible:</span>
                              <span className="text-green-600 font-medium">{stock.quantiteDisponible}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Initial:</span>
                              <span className="text-gray-500">{stock.quantiteInitiale}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#C41E3A]">Attribués:</span>
                              <span className="text-[#C41E3A]">{stock.quantiteAttribuee}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              })()}
            </div>

            {stocksDisponibles.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun matériel disponible en stock</p>
              </div>
            )}

            <DialogFooter>
              <Button
                onClick={() => setShowStocksDialog(false)}
                variant="outline"
                className="border-[#2B3A67]/30 text-[#2B3A67] hover:bg-[#2B3A67]/5"
              >
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#C41E3A]" />
                Confirmer l'attribution
              </DialogTitle>
              <DialogDescription className="text-center py-4">
                Êtes-vous sûr de vouloir valider cette attribution ? Les stocks seront automatiquement mis à jour.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={annulerAttribution}
                disabled={isSubmitting}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </Button>
              <Button
                onClick={confirmerAttribution}
                disabled={isSubmitting}
                className="bg-[#C41E3A] hover:bg-[#C41E3A]/90 text-white"
              >
                {isSubmitting ? "Confirmation..." : "Confirmer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
