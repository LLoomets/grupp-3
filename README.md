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
1. Liigu rakenduse kausta (kui seal juba ei ole) kasutades käsurida <br />
`cd myApp`
2. Käivita rakendus <br />
`ionic serve` <br />
Brauseris peaks avanema http://localhost:8100/

### Android käivitamine
#### Emulaatoris
1. Liigu rakenduse kausta (kui seal juba ei ole) kasutades käsurida <br />
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

#### Füüsilises Android mobiilis
1. Ava Seaded -> Teave telefoni kohta
2. Vajuta Build Number peale 7 korda (aktiveerib arendaja valikud)
3. Ava Seaded -> Arendaja valikud
4. Lülita sisse USB silumine (USB debugging)
5. Ühenda mobiil arvutiga kasutades USB kaablit
6. Ava Android Studio:
`ionic cap open android`
7. Ühendatud mobiil peaks ilmuma Android Studios devices alla
8. Käivita rakendus

###IOS käivitamine füüsilises mobiilis:
1. Luba arendajarežiim iPhone’is: Ava Seaded → Privaatsus & turvalisus - Lülita sisse Arendajarežiim (Developer Mode) - Taaskäivita iPhone ja kinnita valik
2. Ühenda iPhone Maciga USB-kaabli abil: Kui ilmub teade "Usalda seda arvutit" (Trust This Computer), vajuta "Usalda" (Trust)
3. Seo iPhone Xcode’iga: Ava Xcode käsuga npx cap open ios - Mine Xcode → Settings → Devices & Simulators - Leia oma iPhone "Devices" vahekaardilt - Kui see on märgitud kui (Unpaired), vajuta "Pair" - Kinnita sidumistaotlus iPhone’is
4. Käivita rakendus iPhone’il: Ava oma projekt Xcode’is käsuga npx cap open ios - Vali seadmete nimekirjast oma iPhone - Vajuta Käivita ▶, et rakendus telefonis käivitada
5. Anna  iPhone'is luba arendajaäpile (developer app): Ava Seaded → Üldine → VPN ja seadmehaldus – vajuta loodud äpile ja anna sellele luba.


### IOS käivitamine
1. Liigu rakenduse kausta (kui seal juba ei ole) kasutades käsurida <br />
`cd myApp`
2. Ehita rakendus <br />
`ionic build`
3. Lisa IOS platvorm <br />
`ionic cap add ios`
4. Sünkroniseeri <br />
` ionic cap sync`
5. Ava Xcode <br />
`ionic cap open ios`
6. Vali emulaator Xcode’is: <br />
   Xcode’i aknas vali ülemiselt ribalt "Any iOS Device (arm64)" ja muuda see soovitud simulaatori vastu (nt "iPhone 16 Pro").
7. Käivita rakendus <br />
  Vajuta Xcode’is Käivita ▶ nuppu



