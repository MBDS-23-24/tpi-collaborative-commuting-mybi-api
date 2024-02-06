# Les Endpoints

## GET /api/users

Description: Obtenir tous les utilisateurs.
Exemple de réponse (réponse de la requête) :

```json
[
    {
        "userID": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "johndoe@example.com",
        "photoURL": "https://example.com/johndoe.jpg",
        "biography": "Un navetteur qui aime le covoiturage."
    },
    {
        "userID": 2,
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "janesmith@example.com",
        "photoURL": "https://example.com/janesmith.jpg",
        "biography": "Passionnée par la réduction de la congestion routière."
    },
    // ... plus d'objets utilisateur ...
]

```

## POST /api/users

Description: Créer un nouvel utilisateur.
Le corps de la requête doit inclure les données de l'utilisateur au format JSON, par exemple :

```json

{
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice@example.com",
    "password": "password123",
    "photoURL": "https://example.com/alice.jpg",
    "biography": "Enthousiaste du covoiturage."
}

```
##  PUT /api/users/:id


Description: Mettre à jour un utilisateur par ID.
Le corps de la requête doit inclure les données mises à jour de l'utilisateur au format JSON, par exemple :

```json

{
    "firstName": "Prénom mis à jour",
    "lastName": "Nom de famille mis à jour",
    "email": "misajour@example.com",
    "photoURL": "https://example.com/misajour.jpg",
    "biography": "Biographie mise à jour."
}
```

##  DELETE /api/users/:id


Description: Supprimer un utilisateur par ID.
Exemple de réponse (après la suppression réussie) :

"Utilisateur supprimé"
