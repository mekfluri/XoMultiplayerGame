# XoXo Multiplayer Game

**Multiplayer varijanta klasične igre X i O (Tic-Tac-Toe) preko mreže**  

Ovaj repozitorijum je **praktični tutorijal za korišćenje Socket.IO** za real-time multiplayer igre. Projekat prikazuje kako dva klijenta mogu da se povežu na jedan server i igraju igru u realnom vremenu, sa trenutnom sinhronizacijom poteza, obradom prekida veze, i obaveštenjima za igrače.  

**Tehnološki fokus:**  
- Node.js server sa Socket.IO za WebSocket komunikaciju  
- Angular frontend sa real-time prikazom igre i notifikacijama  
- Praktična demonstracija real-time događaja, emitovanja i prijema poruka

---

## Šta projekat radi

- Server može da upravlja sa više soba/igara istovremeno  
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

XoXoMultiplayerGame/  
├── server.js                       ← Node.js server sa Socket.IO  
├── src/app/                         ← Angular frontend  
│   └── app.component.ts             ← glavna Angular komponenta i logika igre  
├── Prezentacija.pptx                ← dokumentacija projekta (UML, screenshot-ovi, analiza)  
├── README.md                         
└── .gitignore  

---

## Instalacija i pokretanje

### 1. Preuzimanje projekta

```
git clone https://github.com/mekfluri/XoMultiplayerGame.git
cd XoMultiplayerGame
````

### 2. Instalacija zavisnosti

* **Server** (Node.js):

```
npm install
npm install "socket.io" "@socket.io/admin-ui"
npm install --save-dev nodemon
```

* **Frontend** (Angular):

```
cd src
Remove-Item -Force package-lock.json
npm install -g @angular/cli@21
npm install --save-dev @angular/cli@21 @angular/core@21 @angular/common@21 @angular/compiler@21 @angular/forms@21 @angular/platform-browser@21 @angular/router@21 @angular/compiler-cli@21 @angular-devkit/build-angular@21 rxjs@7 tslib typescript@5 vitest jsdom socket.io-client
npm audit fix --force
npm start
```

### 3. Pokretanje servera

```
node server.js
```

Primer izlaza:

```
Server radi na http://localhost:8080
Čekam igrače...
```

### 4. Pokretanje frontend-a (Angular)

```
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

## Reprodukcija rezultata (za seminarski rad)

1. Pokreni server
2. Pokreni frontend i poveži dva igrača (isto ili različite mašine u istoj mreži)
3. Odigraj 3–5 partija sa sledećim ishodima:

   * pobeda X
   * pobeda O
   * remi
   * jedan igrač napusti igru pre kraja
   * pokušaj poteza kad nije tvoj red (treba da bude ignorisan)
4. Snimi ekran ili screenshot-ove ključnih trenutaka
5. Uporedi sa slajdovima 8–14 u fajlu **Prezentacija.pptx**

---

## PowerPoint prezentacija (Prezentacija.pptx)

Sadrži:

* Uvod i motivacija
* Ciljevi projekta
* Arhitektura sistema (klijent ↔ server dijagram)
* UML dijagrami klasa (ako postoje)
* Ključni delovi koda sa komentarima
* Screenshot-ovi toka igre (povezivanje, potezi, kraj partije)
* Test slučajevi i rezultati
* Zaključak
* Moguća proširenja

---

## Moguća proširenja

* Chat poruke tokom igre
* Statistika (broj pobeda, poraza, remija)
* Single-player mod sa AI protivnikom
* Više soba / lobby sistem
* Prebacivanje na web interfejs sa WebSocket
* Čuvanje rezultata u fajl ili bazu

---

## Licenca

Projekat je namenjen isključivo edukativnoj svrsi.
