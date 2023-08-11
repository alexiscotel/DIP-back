# webserver-for-tests (backend)

## Deployment
cloner le répertoire git depuis [gitlab.com/alexis-cotel/shared/webserver-for-tests](https://gitlab.com/alexis-cotel/shared/webserver-for-tests)
`npm i && npm run start` OU `npm i && node server.js`

## TODO
- [x] Connexion au tunnel websocket dès le début (reload page)
- [ ] plusieurs instances de tests : rendre ports http et websocket configurables (voir pour rooms websocket)
- [ ] Entrypoints (serv' nodejs) pour notifier l'orchestrateur :
	- Selection du test : front => back => orchestrateur
	- Start test
	- Pause test
	- Stop test
- [ ] points de sortie (coté orchestrateur) :
	- y'en a pas (fichiers :
		-  conf.json (port websocket)
		- tests.json (viens du orchestrateur) => la config pour les tests (lecture en temps réel)
		- status.json (viens du orchestrateur) => le status du test en cours (lecture en temps réel)
		- io.json (viens de l'orchestrateur) => la status des entrées/sorties (lecture en temps réel)
- [ ] PREMIERE VERSION POUR TEST
- [ ] 1 fichier de conf : changer format data.ts => data.json : load fichier dans app.js
- [ ] 1 fichier de log par test. Au changement de test, changement de fichier de log (mais le contenu du fichier du précédent n'est pas supprimé - suppression du fichier sur le serv' à la main)
- [ ] Boutons "start" (pb determinate)"pause" (pb indeterminate) "stop" (pb no visible)
- [ ] Rendu en IHM des entrées/sorties du DIP (fichier io.json) :
```
{
UID: '',
MAC: '',
inputs: [
	'i1': '0',
	'i2': 'OK',
],
outputs: [
	'o1': 'NOK',
]
}
```

- [ ] Filtrage sur fichier de log :
	- date;test-id;step-id;command-id;'info'|'debug'|'warn'|'err';logTrace
- [ ]  barre de chargement :
	- poids commande / nombre de commandes * 100
- [ ] 1 fichier de status (cf code)
- [ ] Procédure build