# Installer nvm sur windows

vidéo youtube : https://youtu.be/GKskZ-7MlLo

ligne de commande = CLI

Node Version Manager ( NVM ), qui est un gestionnaire de version pour Node.js.
Cette utilitaire est pratique car on pourra jongler entre plusieur version de Node.js

rendez vouz à cette adresse : `https://github.com/coreybutler/nvm-windows`
on scroll jusqu'à arriver au titre `Node Version Manager (nvm) for Windows,`
et on clic sur le lien nommé `Download Now!`
puis on télécharge `nvm-setup.zip`
on ce rend dans notre dossier zip qui a été télécharger et on exécute l'exécutable.

la commande `nvm -v ` permet de voir quel version de nvm on utilise.

si on veut télécharger une certaine version de Node.js on tape en ligne de commande  `nvm install + le numéro de la version qu'on veut`.
    `- nvm install 14.15.4`

la on a installer la version stable recommandé en ce moment en 2021 qui est la version `14.15.4 LTS`.
Si on veut l'utiliser dans notre OS windows et donc l'activer, il suffit de taper en CLI 
    `- nvm use 14.15.4`

Si on veut installer la version 15.5.1 Current qui n'est pas encore stable, on va l'installer aussi
    `- nvm install 15.5.1`

si on fait `node -v` on verra qu'on utilise toujours la `version 14.15.4` 
Grace a nvm, on peut jongler entre les 2 version facilement en faisant `nvm use + numéro de la version `
    `- nvm use 15.5.1`

et c'est bon !

si on veut déinstallé une version précise , il faut faire ` nvm uninstall + le numéro de la version`
    `- nvm uninstall 15.5.1`