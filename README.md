# itec-app

Documentatie Backend:
Tehnologia folosita este Node.js, cu Express. Baza de date este una NoSQL (MongoDB), 
motiv pentru care as vrea sa comentez asupra diagramei prezentate. Este una care incearca sa se muleze pe modelul SQL.
User-ul are o cheie denumita `userType` (BUYER sau SELLER), pentru a diferentia intre buyer si seller. Am pus in acelasi document fiindca este
facil intr-o baza de date NoSQL, atat datorita faptului ca nu e o schema predefinita, dar si pentru a pagina mai usor datele. 
Daca utilizatorul este buyer, atunci acesta va avea un shopping basket curent(camp in baza de date de tip boolean), dar si unele care sunt 
expirate(current=false), care servesc drept comenzi, pentru functionalitatea de istoric comenzi.

Dispunem de urmatoarele feature-uri:
 - login (integrat cu FE)
 - logout
 - register (integrat cu FE)
 - listare produse
 - cautare dupa nume produs; filtrari dupa vanzator, price range, locatie, categorie si subcategorie -- acestea fiind paginate
 - detalii vanzator (integrat cu FE)
 - detalii produs (integrat cu FE -- requesturi paginate)
 - adaugarea in cos si procesarea comenzii (integrat cu FE)
 - payment -- functionalitatea exista doar pe BE deocamdata(vezi mai jos)
 - istoric comenzi -- functionalitatea exista doar pe BE
 - profil -- integrat cu FE
 
 Paymentul este facut cu Stripe, dar este facut deocamdata doar pe backend, due to lack of time :( .
 Pentru upload de fisiere, am folosit un storage service, si anume Amazon S3.
 De asemenea, ca un alt additional feature, avem si trimitere de mail, in cazul inregistrarii unui user, si in cazul platii (fie ca a esuat sau nu).
 La inregistrare, se hashuie parolele folosind Bcrypt. De asemenea am folosit un middleware permite apelarea unor endpoint-uri doar in cazul in care userul este logat.
 
 Documentatie frontend:
 Tehnologii folosite: React.js with TypeScript, Bootstrap, SCSS preprocessor, SCSS modules, Font Awesome, voie buna. :)
