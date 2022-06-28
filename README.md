# ImmoBloc

Github du projet de 5ème année du groupe Sid-Ahmed, Helder, Gautier.
Ce readme sera mis à jour au fur et à mesure du projet.

Vous pouvez trouver dans le dossier database, le script de création de la base de données et un screenshot de celle-ci.
Plusieurs autres dossiers sont également créés pour nos différents besoins à savoir: "Front", "Back" et "SmartContract".
Cette architecture de dossier fera l'objet d'une révision dans le futur de ce projet et n'est que temporaire.

## Organisation

Dans un premier temps, chacun s'occupe de la base d'une partie

Base front et taquito : Sid-Ahmed
Base API et BDD : Gautier
Base déploiement et smart-contrat : Helder

Une fois ces 3 bases faites chacunes des parties prenantes feront monter en compétences les deux afin que par la suite chacun puisse développer une feature de bout en bout.

## Compilation

sudo docker run --rm -v "$PWD":"$PWD" -w "$PWD" ligolang/ligo:0.40.0 compile contract Main.ligo --michelson-format json > Main.json

Nous resterons sur cette version par soucis de sécurité

## Deploiement
> Avoir rempli au préalable un fichier .env à mettre dans le dossier deploy/ selon cette forme

PK=esdk... (Mettez votre private key, récupérable dans Temple wallet)
RPC=https://jakartanet.tezos.marigold.dev/

Ensuite, depuis la racine du dossier Immoblock : 

```
ts-node deploy/deploy.ts
```
## License

GNU Affero General Public License, abrégée AGPL, est une licence libre copyleft, ayant pour but d'obliger les services accessibles par le réseau de publier leur code source.

Basée sur la licence GNU GPL, dans le cadre général du projet GNU, elle répond à un besoin spécifique du projet Affero, qui souhaite que tout opérateur d'un service Web utilisant leur logiciel et l'améliorant publie ses modifications.

![License overview](https://snyk.io/wp-content/uploads/Licenses-image-2048x1202.png)


