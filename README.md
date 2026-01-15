# XoXo Multiplayer Game

**Multiplayer varijanta klasične igre X i O (Tic-Tac-Toe) preko mreže**  

Ovaj repozitorijum je **praktični tutorijal za korišćenje Socket.IO** za real-time multiplayer igre. Projekat prikazuje kako dva ili više klijenta mogu da se povežu na jedan server i igraju igru u realnom vremenu, sa trenutnom sinhronizacijom poteza, obradom prekida veze, i obaveštenjima za igrače.  

**Tehnološki fokus:**  
- Node.js server sa Socket.IO za WebSocket komunikaciju  
- Angular frontend sa real-time prikazom igre i notifikacijama  
- Praktična demonstracija real-time događaja, emitovanja i prijema poruka

---

## Šta projekat radi

- Server može da upravlja nad više soba/igara istovremeno  
- Dva igrača se povezuju na istu sobu i igraju jedan protiv drugog  
- Svaki potez se trenutno šalje serveru i prosleđuje drugom igraču  
- Automatska detekcija pobede (tri u nizu – horizontalno, vertikalno, dijagonalno)  
- Grafički interfejs preko Angular-a  
- Statusne poruke: čekanje protivnika, tvoj potez, pobeda / poraz / nerešeno  
- Obrada prekida veze jednog igrača  

---

## Tehnologije

- **Server**: Node.js + Socket.IO  
- **Frontend**: Angular + HTML + CSS  
- **Real-time komunikacija**: WebSocket preko Socket.IO  
- **Build**: `npm install` + `npm start` za frontend, `node server.js` za server  

---

## Struktura repozitorijuma

```

XoXoMultiplayerGame/
├── server.js                       ← Node.js server sa Socket.IO
├── src/app/                         ← Angular frontend
│   └── app.component.ts             ← glavna Angular komponenta i logika igre
├── Prezentacija.pptx                ← dokumentacija projekta (UML, screenshot-ovi, analiza)
├── README.md
└── .gitignore

````

---

## Instalacija i pokretanje

### 1. Preuzimanje projekta

```bash
git clone https://github.com/mekfluri/XoMultiplayerGame.git
cd XoXoMultiplayerGame
````

### 2. Instalacija zavisnosti

* **Server (Node.js):**

```bash
npm install
npm install "socket.io" "@socket.io/admin-ui"
npm install --save-dev nodemon
```

* **Frontend (Angular):**

```bash
cd src
Remove-Item -Force package-lock.json
npm install -g @angular/cli@21
npm install --save-dev @angular/cli@21 @angular/core@21 @angular/common@21 @angular/compiler@21 @angular/forms@21 @angular/platform-browser@21 @angular/router@21 @angular/compiler-cli@21 @angular-devkit/build-angular@21 rxjs@7 tslib typescript@5 vitest jsdom socket.io-client
npm audit fix --force
npm start
```

### 3. Pokretanje servera

```bash
node server.js
```

Primer izlaza:

```
Server radi na http://localhost:8080
```

### 4. Pokretanje frontend-a (Angular)

```bash
npm start
```

Otvori browser na:

```
http://localhost:4200
```

Frontend će se automatski povezati sa Node.js serverom preko Socket.IO.

---

## Kako se igra

1. Otvori frontend u browseru (`localhost:4200`)
2. Unesi ime igrača
3. Izaberi sobu (`Room1` ili `Room2`)
4. Klikni **Join Room**
5. Kada se povežu dva igrača:

   * Prvi dobija **X**, drugi **O**
   * Potezi se šalju serveru i prikazuju drugom igraču u realnom vremenu
6. Igra se završava pobedom, remijem, ili ako igrač napusti sobu

---

## Admin Panel (opciono)

U `server.js` postoji deo koda za **@socket.io/admin-ui** koji omogućava praćenje soba i igrača u realnom vremenu preko web interfejsa.

> Napomena: Ako odkomentarišeš ovaj deo, admin panel će raditi, ali neke funkcionalnosti igre mogu prestati da rade zbog greške sa Proxy objektom u trenutnoj verziji paketa.
> Preporuka: korišćenje samo za praćenje konekcija.

Primer koda u `server.js`:

```js
// import { instrument } from "@socket.io/admin-ui";
// instrument(io, { auth: false });
```

Admin panel omogućava nadzor WebSocket konekcija, trenutnih soba i igrača, i brzo debagovanje aplikacije.

---

## Socket.IO tutorijal i objašnjenje

Socket.IO je biblioteka koja omogućava dvosmernu, real-time komunikaciju između web klijenata i servera. Bazira se na WebSocket protokolu, ali dodaje fallback alternative (npr. long polling) kada WebSocket nije podržan.

Bez Socket.IO, svaki zahtev klijenta zahteva novo otvaranje konekcije sa serverom, što može uzrokovati kašnjenja pri velikom broju zahteva. Socket.IO kreira stalnu vezu između klijenta i servera, omogućavajući slanje više poruka i događaja u realnom vremenu bez dodatnog troška ponovnog povezivanja.

Idealne primene Socket.IO su:

* Chat i messaging sistemi
* Multiplayer online igre
* Kolaborativni alati (npr. zajedničko editovanje dokumenata)
* Live notifikacije i dashboard-ovi
* Praćenje podataka u realnom vremenu (berzanski tikeri, senzori)

---

## Rad sa Socket.IO u projektu

### Server-side

* Kreira se HTTP server: `http.createServer()`
* Socket.IO se inicijalizuje na serveru: `const io = new Server(httpServer, { cors: {...} })`
* CORS podešavanja uključuju Angular frontend i admin panel
* Ping intervali i timeouti definišu koliko često se proverava veza
* `io.of('/game')` kreira namespace za logičku separaciju komunikacije
* Socket se vezuje za sobe: `socket.join(room)`

### Client-side

* Klijent koristi `io('http://localhost:8080/game')` za povezivanje
* Eventi se registruju preko `socket.on('event', callback)`
* Slanje događaja serveru preko `socket.emit('event', data, callback)`
* Callback funkcije (acknowledgements) omogućavaju potvrdu uspeha akcija

### Default eventi

* `connect` – aktivira se na klijentu kada je konekcija uspostavljena
* `connection` – aktivira se na serveru kada se novi klijent poveže
* `disconnect` – aktivira se kada veza pukne
* `connect_error` / `reconnect` – automatsko ponovno povezivanje

### Custom eventi

* `joinRoom`, `leaveRoom`, `makeMove`, `notification`, `gameUpdate`
* Podaci se šalju kao objekti (`{ room, username }`, `{ index }`)
* Server procesira događaje i prosleđuje relevantnim klijentima

### Rooms i Namespaces

* Rooms omogućavaju grupisanje klijenata unutar namespace-a
* Emitovanje unutar sobe: `io.to(room).emit(...)`
* Broadcast svim ostalim klijentima: `socket.broadcast.emit(...)`

---

## Zašto Socket.IO?

* Jednostavan, intuitivan event-based API
* Bogat set funkcija (rooms, namespaces, reconnects, heartbeat)
* Fleksibilan za JavaScript/Node.js projekte
* Pouzdan i kompatibilan (automatski fallback na HTTP)
* Brzo skaliranje osnovnih scenarija

Ovo štedi vreme u razvoju i pojednostavljuje implementaciju real-time aplikacija u poređenju sa čistim WebSocket-ima.

---

## Alternative

* **Čisti WebSocket (ws)** – jednostavan, ali zahteva ručno upravljanje reconnect-om
* **SignalR** – optimizovan za .NET, nije idealan za čist JS/Node
* **SockJS** – fallback mehanizam, bez rooms/namespaces
* **Firebase Realtime Database / Firestore** – cloud servis, zavisnost od treće strane

---

## Moguća proširenja

* Chat poruke tokom igre
* Statistika (broj pobeda, poraza)
* Single-player mod sa AI protivnikom
* Više soba / lobby sistem
* Prebacivanje na web interfejs sa WebSocket
* Čuvanje rezultata u fajl ili bazu

---

## Licenca

Projekat je namenjen isključivo edukativnoj svrsi.

```

Hoćeš da to napravimo?
```
