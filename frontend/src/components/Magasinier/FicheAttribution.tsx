"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Search, Eye, Printer, User, FileText, Calendar } from "lucide-react"
import {
  getEmployeByMatricule,
  getAttributionsByMatricule,
  getMaterielsParMois,
  type Employe,
  type Attribution,
} from "../../lib/data-store"
import Layout from "../layout/layout-magasinier"

// Fonction pour générer le PDF annuel avec les matériels organisés par mois
const generateAnnualPDF = (employe: Employe, materielsParMois: any, year: number, shouldPrint = false) => {
  // Créer le contenu HTML pour le PDF
  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ]

  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          line-height: 1.4;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          border-bottom: 2px solid #DC2626;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #1E3A8A;
          margin: 0;
          font-size: 24px;
        }
        .logo {
          margin-bottom: 15px;
          font-weight: bold;
          color: #DC2626;
          font-size: 18px;
        }
        .employee-info { 
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px; 
          border-left: 4px solid #DC2626;
        }
        .employee-info h3 {
          color: #1E3A8A;
          margin-top: 0;
          margin-bottom: 15px;
        }
        .employee-info p { 
          margin: 8px 0; 
          font-size: 14px;
        }
        .employee-info strong {
          color: #DC2626;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 20px;
        }
        table, th, td { 
          border: 1px solid #ddd; 
        }
        th { 
          background-color: #1E3A8A; 
          color: white;
          padding: 12px; 
          text-align: left; 
          font-weight: bold;
        }
        td { 
          padding: 12px; 
          vertical-align: top; 
        }
        .month-cell {
          background-color: #f8f9fa;
          font-weight: bold;
          color: #1E3A8A;
          width: 120px;
        }
        .signature-cell { 
          height: 60px; 
          width: 150px;
          background-color: #fafafa;
        }
        .no-materials { 
          color: #666; 
          font-style: italic; 
          text-align: center;
        }
        .materials-list {
          margin: 0;
          padding-left: 20px;
        }
        .materials-list li {
          margin: 4px 0;
          font-size: 13px;
        }
        .date-cell {
          font-size: 13px;
          color: #666;
        }
        .category-group {
          margin-bottom: 8px;
        }
        .category-title {
          font-weight: bold;
          color: #DC2626;
          font-size: 12px;
        }
        @media print {
          body { margin: 10px; }
          .header { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">MÉNARA PRÉFA</div>
        <h1>Fiche annuelle d'attribution des équipements de protection individuelle (EPI)</h1>
      </div>
      
      <div class="employee-info">
        <h3>Informations de l'employé</h3>
        <p><strong>Nom complet :</strong> ${employe.nom}</p>
        <p><strong>Matricule :</strong> ${employe.matricule}</p>
        <p><strong>Poste :</strong> ${employe.poste}</p>
        <p><strong>Service :</strong> ${employe.service}</p>
        <p><strong>Année :</strong> ${year}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Mois</th>
            <th>Liste Matériels attribués</th>
            <th>Date d'attribution</th>
            <th>Signature de l'employé</th>
          </tr>
        </thead>
        <tbody>
  `

  // Ajouter une ligne pour chaque mois
  for (let month = 1; month <= 12; month++) {
    const monthData = materielsParMois[month]

    htmlContent += `<tr><td class="month-cell">${monthNames[month - 1]}</td>`

    if (monthData && monthData.materiels && monthData.materiels.length > 0) {
      // Organiser les matériels par catégorie
      const materielsParCategorie: { [categorie: string]: any[] } = {}
      monthData.materiels.forEach((materiel: any) => {
        if (!materielsParCategorie[materiel.categorie]) {
          materielsParCategorie[materiel.categorie] = []
        }
        materielsParCategorie[materiel.categorie].push(materiel)
      })

      // Matériels attribués organisés par catégorie
      htmlContent += `<td>`
      Object.keys(materielsParCategorie).forEach((categorie, index) => {
        if (index > 0) htmlContent += `<br>`
        htmlContent += `<div class="category-group">`
        htmlContent += `<div class="category-title">${categorie}:</div>`
        htmlContent += `<ul class="materials-list">`
        materielsParCategorie[categorie].forEach((materiel: any) => {
          htmlContent += `<li>${materiel.nom} (${materiel.quantite})</li>`
        })
        htmlContent += `</ul></div>`
      })
      htmlContent += `</td>`

      // Dates d'attribution (uniques) - Correction du typage
      htmlContent += `<td class="date-cell">`
      if (monthData.dates && Array.isArray(monthData.dates)) {
        const datesUniques = [...new Set(monthData.dates.filter(Boolean))]
        datesUniques.forEach((date: unknown, index: number) => {
          if (index > 0) htmlContent += `<br>`
          try {
            const dateString = typeof date === "string" ? date : String(date)
            htmlContent += `${new Date(dateString).toLocaleDateString("fr-FR")}`
          } catch (error) {
            htmlContent += `${String(date)}`
          }
        })
      }
      htmlContent += `</td>`
    } else {
      // Aucun matériel ce mois
      htmlContent += `<td><span class="no-materials">Aucun</span></td><td></td>`
    }

    // Cellule de signature
    htmlContent += `<td class="signature-cell"></td></tr>`
  }

  htmlContent += `
        </tbody>
      </table>
      
      <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
        Document généré le ${new Date().toLocaleDateString("fr-FR")} - EPI Manager Ménara Préfa
      </div>
    </body>
    </html>
  `

  // Créer et afficher/imprimer le PDF
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.focus()

    if (shouldPrint) {
      // Attendre que le contenu soit chargé puis imprimer
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }
}

export default function FicheAttributionPage() {
  // Obtenir l'année actuelle
  const currentYear = new Date().getFullYear()

  const [matriculeRecherche, setMatriculeRecherche] = useState("")
  const [employeInfo, setEmployeInfo] = useState<Employe | null>(null)
  const [attributions, setAttributions] = useState<Attribution[]>([])
  const [materielsParMois, setMaterielsParMois] = useState<any>({})
  const [chargement, setChargement] = useState(false)
  const [selectedYear, setSelectedYear] = useState(currentYear)

  // Générer les options d'années (année actuelle et 5 années précédentes)
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i)

  const rechercherFiche = async () => {
    if (!matriculeRecherche.trim()) return

    setChargement(true)

    // Simulation d'une recherche
    setTimeout(() => {
      const employe = getEmployeByMatricule(matriculeRecherche.toUpperCase())
      const employeAttributions = getAttributionsByMatricule(matriculeRecherche.toUpperCase())
      const materiels = getMaterielsParMois(matriculeRecherche.toUpperCase(), selectedYear)

      if (employe) {
        setEmployeInfo(employe)
        setAttributions(employeAttributions)
        setMaterielsParMois(materiels || {})
      } else {
        setEmployeInfo(null)
        setAttributions([])
        setMaterielsParMois({})
      }
      setChargement(false)
    }, 1000)
  }

  const handleYearChange = (year: string) => {
    const newYear = Number.parseInt(year)
    setSelectedYear(newYear)

    if (employeInfo) {
      const materiels = getMaterielsParMois(employeInfo.matricule, newYear)
      setMaterielsParMois(materiels || {})
    }
  }

  const voirPDF = () => {
    if (employeInfo) {
      generateAnnualPDF(employeInfo, materielsParMois, selectedYear, false)
    }
  }

  const imprimerPDF = () => {
    if (employeInfo) {
      generateAnnualPDF(employeInfo, materielsParMois, selectedYear, true)
    }
  }

  // Calculer le nombre total de matériels attribués
  const totalMateriels = Object.values(materielsParMois).reduce((total: number, moisData: any) => {
    return total + (moisData?.materiels?.length || 0)
  }, 0)

  // Obtenir les mois avec des attributions
  const moisAvecAttributions = Object.keys(materielsParMois).filter(
    (mois) => materielsParMois[Number.parseInt(mois)]?.materiels?.length > 0,
  )

  return (
    <Layout>
    <div className="space-y-6 mt-10">
      <div>
        <h1 className="text-3xl font-bold text-secondary">Fiche d'attribution</h1>
        <p className="text-muted-foreground">Recherchez et consultez la fiche annuelle d'un employé</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Recherche par matricule
          </CardTitle>
          <CardDescription>Saisissez le matricule de l'employé pour afficher sa fiche annuelle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="matricule">Matricule employé</Label>
              <Input
                id="matricule"
                placeholder="Ex: EMP001"
                value={matriculeRecherche}
                onChange={(e) => setMatriculeRecherche(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === "Enter" && rechercherFiche()}
              />
            </div>
            <Button
              onClick={rechercherFiche}
              disabled={chargement || !matriculeRecherche.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {chargement ? "Recherche..." : "Rechercher"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {employeInfo && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-secondary" />
                Informations employé
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Matricule</Label>
                <p className="text-lg font-semibold text-primary">{employeInfo.matricule}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Nom complet</Label>
                <p className="text-sm">{employeInfo.nom}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Poste</Label>
                <p className="text-sm">{employeInfo.poste}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Service</Label>
                <p className="text-sm">{employeInfo.service}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Date d'embauche</Label>
                <p className="text-sm">{new Date(employeInfo.dateEmbauche).toLocaleDateString("fr-FR")}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Année</Label>
                <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une année" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Total matériels attribués</Label>
                <p className="text-lg font-semibold text-accent">{totalMateriels}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Mois avec attributions</Label>
                <p className="text-sm text-muted-foreground">{moisAvecAttributions.length} mois</p>
              </div>

              {/* Boutons PDF */}
              <div className="space-y-2 pt-4">
                <Button onClick={voirPDF} className="w-full bg-secondary hover:bg-secondary/90 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Voir PDF
                </Button>
                <Button onClick={imprimerPDF} variant="outline" className="w-full flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  Imprimer PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-accent" />
                      Matériels par mois ({selectedYear})
                    </CardTitle>
                    <CardDescription>Répartition des attributions par mois</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Année: {selectedYear}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {Object.keys(materielsParMois).length > 0 && moisAvecAttributions.length > 0 ? (
                  <div className="space-y-4">
                    {Object.keys(materielsParMois)
                      .sort((a, b) => Number.parseInt(b) - Number.parseInt(a)) // Trier par mois décroissant
                      .map((mois) => {
                        const moisData = materielsParMois[Number.parseInt(mois)]
                        if (!moisData || !moisData.materiels || moisData.materiels.length === 0) return null

                        const monthNames = [
                          "",
                          "Janvier",
                          "Février",
                          "Mars",
                          "Avril",
                          "Mai",
                          "Juin",
                          "Juillet",
                          "Août",
                          "Septembre",
                          "Octobre",
                          "Novembre",
                          "Décembre",
                        ]

                        // Organiser les matériels par catégorie
                        const materielsParCategorie: { [categorie: string]: any[] } = {}
                        moisData.materiels.forEach((materiel: any) => {
                          if (!materielsParCategorie[materiel.categorie]) {
                            materielsParCategorie[materiel.categorie] = []
                          }
                          materielsParCategorie[materiel.categorie].push(materiel)
                        })

                        return (
                          <div key={mois} className="p-4 border rounded-lg bg-muted/30">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-medium text-lg text-secondary">
                                {monthNames[Number.parseInt(mois)]} {selectedYear}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {moisData.materiels.length} matériel(s)
                              </span>
                            </div>

                            <div className="space-y-3">
                              {Object.keys(materielsParCategorie).map((categorie) => (
                                <div key={categorie} className="border-l-2 border-primary pl-3">
                                  <div className="font-medium text-sm text-primary mb-1">{categorie}</div>
                                  <div className="grid gap-1 sm:grid-cols-2">
                                    {materielsParCategorie[categorie].map((materiel, index) => (
                                      <div key={index} className="text-sm text-muted-foreground">
                                        • {materiel.nom} ({materiel.quantite})
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-3 pt-2 border-t text-xs text-muted-foreground">
                              Dates:{" "}
                              {moisData.dates && Array.isArray(moisData.dates)
                                ? [...new Set(moisData.dates.filter(Boolean))]
                                    .map((date: unknown) => {
                                      try {
                                        const dateString = typeof date === "string" ? date : String(date)
                                        return new Date(dateString).toLocaleDateString("fr-FR")
                                      } catch {
                                        return String(date)
                                      }
                                    })
                                    .join(", ")
                                : "Aucune date"}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune attribution trouvée pour cet employé en {selectedYear}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!employeInfo && matriculeRecherche && !chargement && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun employé trouvé pour le matricule: {matriculeRecherche}</p>
              <p className="text-sm mt-2">Vérifiez le matricule et réessayez</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!employeInfo && !matriculeRecherche && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Saisissez un matricule pour afficher la fiche employé</p>
              <p className="text-sm mt-2">Exemples disponibles: EMP001, EMP002, EMP003</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
    </Layout>
  )
}
