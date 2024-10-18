# IM3
 
Peakend
Peakend ist ein neues Tool zur Identifizierung der Parkhausauslastungen in den neun beliebtesten Parkhäuser der Stadt Zürich. Es soll beispielsweise jemandem dienen, der kurz vor seiner Reise nach Zürich die Auslastung der Parkhäuser in den letzten 24 bis 72 stunden checken möchte. So kann der user abschätzen, wann er vermutlich vor den Peaks anreisen sollte, um noch einen Parkplatz ergattern zu können. Zusätzlich findet man Informationen zu den Zeitpunkten, zu denen ein Parkhaus normalerweise voll ist. 


Learnings:
Fortschritt beim Programmieren ist enorm schwer zu planen. Teils ergibt sich alles in wenigen Minuten während man andere Male stundenlang keinen Fortschritt verzeichnen kann.

Sinnvolle Berechnung:
Um ein Tool zu kreieren, dass einen tatsächlichen Nutzen für den Nutzer erfüllt, bedarf es an einer genauen Planung. Unabingbar wären auch Praxistests in einem Umfeld, welches noch nichts von dem Projekt mitbekommen hat. 


Schwierigkeiten:

–Eine Rechnung - zwei Datenbanken
Wir mussten erkennen, dass es nicht sinnvoll ist, alle Daten aus der API stündlich in der Datenbank abzuspeichern. Daraus ergab sich, dass wir zwei Datenbanken anlegten. Die eine mit den Live-Daten, die sich ändern, die andere mit Daten, die gleich bleiben. Die Schwierigkeit, die sich daraus ergab, war die Einbindung beider Datenbanken in eine Rechnung für die Grafik auf der Webiste.

Zeitdruck
Aufgrund der etwas gering ausgefallenen Zeit konnten wir nicht alle unseren geplanten Elemente auf der Website einbinden. So war es nun nicht mögliche die "Stats" eines Parkhauses zu berechnen und aufzulisten. Weiter viel der aktuelle Füllstand der Parkhäuser weg. 

-Lesbarkeit der Grafik
Während die Farbwahl der Website eigentlich eine gute Grundlage für einen lesbaren Graf ist, ist es uns nicht sehr gut gelungen, die Lesbarkeit auch beim Coden beizubehalten. So wirkt die Data history nun etwas überladen, was aber durch das "Wegstreichen" eines Parkhauses durch ein Anklicken in der Legende "behoben" werden kann. 


benutzte Ressourcen:
ChatGPT
stackoverflow
w3schools




 Zweck:

