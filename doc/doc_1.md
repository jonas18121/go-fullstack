# Passez au Full stack avec Node.js, Express et MongoDB

# configurez votre environnement de développement

## Installer Node

Accéder à NodeJs.org pour télécharger puis installer la dernière version de Node. 
Cela à pour effet d'installer le runtime Javascript de Node, ce qui permet d'exécuter les serveurs Node.
ça installe aussi `Node Package Manager = npm`

## Installer Angular

npm install -g @angular/cli

## Cloner l'application front-end

On crée un répertoire nommer `go-fullstack` par exemple, 
puis on fait : `git clone https://github.com/OpenClassrooms-Student-Center/go-fullstack-fr-frontend.git frontend`
puis :
    cd frontend
    npm install
    ng serve




## Debuguer dans le html de Angular

    <pre>
        <!-- pour debug dans html angular -->
        <span>{{eleve | json}}</span>
    </pre>