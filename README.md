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

### Android käivitamine
#### Emulaatoris
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

#### Füüsilises mobiilis
1. Ava Seaded -> Teave telefoni kohta
2. Vajuta Build Number peale 7 korda (aktiveerib arendaja valikud)
3. Ava Seaded -> Arendaja valikud
4. Lülita sisse USB silumine (USB debugging)
5. Ühenda mobiil arvutiga kasutades USB kaablit
6. Ava Android Studio:
`ionic cap open android`
7. Ühendatud mobiil peaks ilmuma Android Studios devices alla
8. Käivita rakendus

### IOS käivitamine
1. Liigu rakenduse kausta (kui seal juba ei ole) <br />
`cd myApp`
2. Ehita rakendus <br />
`ionic build`
3. Lisa IOS platvorm <br />
`ionic cap add ios`
4. Sünkroniseeri <br />
` ionic cap sync`
5. Ava Xcode <br />
`ionic cap open ios`
7. Käivita rakendus



