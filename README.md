# grupp-3

## Rakenduse seadistamine

### Vajalikud paigaldused (kui eelnevalt ei ole)
1. Node.js
2. Ionic CLI `npm install -g @ionic/cli`
3. Android Studio (Windows OS) või Xcode (MacOS)

### Seadistus
1. Klooni rakenduse hoidla kasutades käsurida <br />
`git clone https://github.com/LLoomets/grupp-3.git` <br />
ning liigu rakenduse kausta <br />
`cd myApp`

2. Installi dependency'd <br />
   `npm install`

### Brauseris käivitamine
1. Liigu rakenduse kausta (kui seal juba ei ole) <br />
`cd myApp`
2. Käivita rakendus <br />
`ionic serve` <br />
Brauseris peaks avanema http://localhost:8100/

### Androidis käivitamine
1. Liigu rakenduse kausta (kui seal juba ei ole) <br />
`cd myApp`
2. Ehita rakendus <br />
`ionic build`
3. Lisa Android platvorm <br />
`ionic cap add android`
4. Sünkroniseeri <br />
` ionic cap sync`
5. Ava Android Studio <br />
`ionic cap open android`
6. Vajadusel lisa seade - View -> Tool Windows -> Manage Devices -> Add new device
7. Käivita rakendus Android Studios




