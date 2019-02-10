# Aknakereső - Tóth Bence - 60

## A feladatról

A feladat kiírása alapján egy mezei aknakeresőt kellett megvalósítani. A megvalósításhoz használt keretrendszer tekintetében az [Angular](https://angular.io)-t választottam, a jövőbeli tervekre való tekintettel. A célom egy egyszerű, könnyen kezelhető, de mégis látványos aknakereső játék megvalósítása volt.

## Az elkészült feladat
Végül egy űr témát választottam a hagyományos aknakerős játék témájának. A különlegessége a háttérben látható animált "csillagok", illetve a gradiens háttér időbeli változása. Ezen felül kiegészítettem egy eredményjelző táblával, illetve egy config file-lal, ahol különböző játéktér méreteket és bomba számokat lehet megadni.

Az alkalmazásban két féle fő szín dominál, illetve egy kiegészítő háttérszín.
_A sötétkék elemek jelölik az interkatív objektumokat.
A  világoskék elemek pedig statikus elemek, melyek információt adnak át._

#### File-ok
File név | Kiterjesztés | Leírás
---------|--------------|-------
 board.component | ts/scss/html | A projekt fő komponense. Célja a teljes játékmező kezelése. Ebben találhatóak a különböző játék kezeléshez szükséges függvények, illetve a teljes layout 90%-a
 high-score.component | ts/scss/html | A játéktér mellett található eredményjelző box. Input-kén várja a kiirandó tömböt, melyet megjelenít
 login.component | ts/scss/html | A játék belépő felülete, ahol a felhasználó kiválaszthatja a kívánt pálya méretet és elkezdheti a játékot
 game.enum | ts | A különböző pályamezők értékeit tárolja enum-ként
 game.model | ts | A különböző tömbök és objectumok modeljeit leíró file
 game.service | ts | A játék logikáját megvalósító service. Az ebben lévő függvények felelnek a játék fő részeiért. Tartalmazzák a játéktér generálását, az éppen aktuális értékek számolását, illetve kisebb kiegészítő függvények találhatóak benne. _Részletesen a file-ban látható kommentezve_
 app.component | ts/scss/html | A játék belépőpontja, ez hívja meg az aktuális komponenst, a _loginData_ objektumban tárolt érték alapján
 _colors | scss | A designban használt színek változói
 _keyframes | scss | A különböző animációknál felhasznált saját animációk
 _responsive | scss | A játéktér mobilos nézetét lehetővé tévő scss kód


#### Config file
Az alkalmazás tartalmaz egy kiegészítő config.json file-t, mely segítségével egyedi pályaméretek hozhatóak létre.
Ennek a felépítése a következő:
```

[
  {
    "boardSize": 9,
    "bombsCount": 10
  }
]
```
A _boardSize_ segítségével adható meg, hogy mekkora (négyzet alapú) legyen a pálya, a _bombsCount_ segítségével pedig a pályán elhelyezett bombák száma.
