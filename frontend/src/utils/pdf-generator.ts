import type { Attribution } from "../lib/epi-store"

export const generateAnnualPDF = (employe: any, year = 2024, currentAttributions: Attribution[]) => {
  // Filtrer les attributions pour cet employé et cette année à partir des données ACTUELLES
  const employeAttributions = currentAttributions.filter(
    (attr) => attr.employe.matricule === employe.matricule && new Date(attr.dateAttribution).getFullYear() === year,
  )

  // Organiser par mois
  const attributionsByMonth: { [key: number]: any[] } = {}
  employeAttributions.forEach((attr) => {
    const month = new Date(attr.dateAttribution).getMonth()
    if (!attributionsByMonth[month]) {
      attributionsByMonth[month] = []
    }
    attributionsByMonth[month].push({
      materiels: attr.materiels,
      dateAttribution: attr.dateAttribution,
      magasinier: attr.magasinier,
      attributionId: attr.id,
    })
  })

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

  // Calculer le total des matériels attribués dans l'année
  const totalMateriels = employeAttributions.reduce((total, attr) => total + attr.materiels.length, 0)
  const totalQuantite = employeAttributions.reduce(
    (total, attr) => total + attr.materiels.reduce((sum: number, mat: any) => sum + mat.quantite, 0),
    0,
  )

  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .employee-info { 
          text-align: left; 
          margin-bottom: 30px; 
          background-color: #f8f9fa; 
          padding: 15px; 
          border-radius: 5px; 
          border-left: 4px solid #007bff;
        }
        .employee-info p { margin: 8px 0; font-weight: bold; }
        .summary { 
          background-color: #e8f4fd; 
          padding: 15px; 
          margin-bottom: 20px; 
          border-radius: 5px; 
          text-align: center;
        }
        .summary h3 { margin: 0 0 10px 0; color: #0056b3; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        table, th, td { border: 1px solid #ddd; }
        th { 
          background-color: #007bff; 
          color: white; 
          padding: 12px; 
          text-align: left; 
          font-weight: bold;
        }
        td { padding: 10px; vertical-align: top; }
        .signature-cell { height: 60px; background-color: #f8f9fa; }
        .no-materials { color: #666; font-style: italic; }
        .month-with-data { background-color: #e8f5e8; }
        .materiel-list { margin: 0; padding-left: 20px; }
        .materiel-list li { margin: 3px 0; }
        .attribution-info { font-size: 0.9em; color: #666; margin-top: 5px; }
        .footer { 
          margin-top: 30px; 
          text-align: center; 
          font-size: 0.9em; 
          color: #666; 
          border-top: 1px solid #ddd; 
          padding-top: 15px;
        }
        .last-updated {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 10px;
          margin-bottom: 20px;
          border-radius: 5px;
          text-align: center;
          font-weight: bold;
          color: #856404;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Fiche annuelle d'attribution des équipements de protection individuelle (EPI)</h1>
        <p style="margin: 10px 0 0 0; color: #666;">Document généré automatiquement - Mis à jour en temps réel</p>
      </div>
      
      <div class="last-updated">
        📅 Dernière mise à jour : ${new Date().toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
      
      <div class="employee-info">
        <p>👤 Nom complet : ${employe.prenom} ${employe.nom}</p>
        <p>🆔 Matricule : ${employe.matricule}</p>
        <p>💼 Poste : ${employe.poste}</p>
        <p>🗓️ Année : ${year}</p>
      </div>
      
      <div class="summary">
        <h3>Résumé annuel</h3>
        <p><strong>${employeAttributions.length}</strong> attribution(s) • <strong>${totalMateriels}</strong> type(s) de matériel • <strong>${totalQuantite}</strong> équipement(s) au total</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th style="width: 15%;">Mois</th>
            <th style="width: 45%;">Matériels attribués</th>
            <th style="width: 20%;">Date & Magasinier</th>
            <th style="width: 20%;">Signature employé</th>
          </tr>
        </thead>
        <tbody>
  `

  // Ajouter une ligne pour chaque mois
  for (let month = 0; month < 12; month++) {
    const monthData = attributionsByMonth[month] || []
    const hasData = monthData.length > 0

    htmlContent += `<tr${hasData ? ' class="month-with-data"' : ""}><td><strong>${monthNames[month]}</strong></td>`

    if (hasData) {
      // Matériels attribués avec détails
      htmlContent += `<td><ul class="materiel-list">`
      monthData.forEach((data, index) => {
        htmlContent += `<li style="margin-bottom: 8px;"><strong>Attribution #${data.attributionId}</strong><ul style="margin-top: 3px;">`
        data.materiels.forEach((materiel: any) => {
          htmlContent += `<li>• ${materiel.nom} <strong>(Qté: ${materiel.quantite})</strong></li>`
        })
        htmlContent += `</ul></li>`
      })
      htmlContent += `</ul></td>`

      // Dates d'attribution et magasiniers
      htmlContent += `<td>`
      monthData.forEach((data, index) => {
        htmlContent += `<div style="margin-bottom: 8px;">
          <strong>${new Date(data.dateAttribution).toLocaleDateString("fr-FR")}</strong><br>
          <span style="font-size: 0.9em; color: #666;">Par: ${data.magasinier}</span>
        </div>`
      })
      htmlContent += `</td>`
    } else {
      // Aucun matériel ce mois
      htmlContent += `<td><span class="no-materials">Aucune attribution</span></td><td><span class="no-materials">-</span></td>`
    }

    // Cellule de signature
    htmlContent += `<td class="signature-cell"></td></tr>`
  }

  htmlContent += `
        </tbody>
      </table>
      
      <div class="footer">
        <p><strong>Note importante :</strong> Cette fiche est générée automatiquement et reflète l'état actuel des attributions.</p>
        <p>Toute modification d'attribution sera automatiquement prise en compte dans ce document.</p>
        <p>Document généré le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}</p>
      </div>
    </body>
    </html>
  `

  // Créer et télécharger le PDF
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.focus()

    // Attendre que le contenu soit chargé puis imprimer
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  }
}
