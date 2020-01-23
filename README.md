# mpop-kiosk

Application kiosque en plein-ecran pour les formulaires de MPOP.

## Setup

```
sudo usermod -a -G dialout ${USER}
sudo apt install nodejs
```

```
npm install
npm run build
cp .env.default .env
npm start
```

## Developer notes

See HACKING.md

