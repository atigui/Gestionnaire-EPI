<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Fiche d’attribution</title>
    <style>
        body { font-family: sans-serif; font-size: 14px; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid black; padding: 5px; text-align: center; height: 50px; }
    </style>
</head>
<body>
    <h2>Fiche d’attribution annuelle</h2>

    <p>
        <strong>Matricule :</strong> {{ $employe->matricule }}
    </p>

    <h3>Liste des EPI attribués :</h3>
    <ul>
        @foreach ($epies as $epi)
            <li>
                {{ $epi->description ?? 'Matériel inconnu' }} -
                {{ $epi->categorie->nom ?? 'Sans catégorie' }}
            </li>
        @endforeach
    </ul>

    <h3>Suivi mensuel des signatures</h3>
    <table>
        <tr>
            @foreach(['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'] as $mois)
                <th>{{ $mois }}</th>
            @endforeach
        </tr>
        <tr>
            @for($i = 0; $i < 12; $i++)
                <td></td>
            @endfor
        </tr>
    </table>
</body>
</html>
