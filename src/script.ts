// Classes et interfaces
class Block {
    private _isVide: boolean;
    private _containsNumber: number;
    constructor(isVide: boolean, containsNumber: number) {
        this._isVide = isVide;
        this._containsNumber = containsNumber;
    }

    public get isVide(): boolean {
        return this._isVide;
    }

    public get containsNumber(): number {
        return this._containsNumber;
    }
    public set isVide(value: boolean) {
        this._isVide = value;
    }

    public set containsNumber(value: number) {
        this._containsNumber = value;
    }
}

// Recup des données du DOM
const gameContainer: HTMLDivElement = document.querySelector(
    "#game-container"
) as HTMLDivElement;
const tabObj: Block[][] = [];

// Const et Let
let tabRandom: number[][] = [];
let isMoving = false;

// Fonctions
function generateGrid() {
    for (const ligne of tabObj) {
        const row = document.createElement("div");
        row.className = "row";
        for (const block of ligne) {
            const carre = document.createElement("div");
            if (block.isVide) {
                carre.className = "blockVide";
            } else {
                carre.className = `block b${String(block.containsNumber)}`;
                const p = document.createElement("p");
                p.textContent = String(block.containsNumber);
                carre.append(p);
            }
            row.append(carre);
        }
        gameContainer.append(row);
    }
}

function generateTabObj() {
    for (let i = 0; i < 4; i++) {
        tabObj.push([]);
        for (let j = 0; j < 4; j++) {
            const block: Block = new Block(true, 0);
            tabObj[i].push(block);
            tabRandom.push([i, j]);
        }
    }
}

function blockAleatoire() {
    const rand: number = Math.floor(Math.random() * tabRandom.length);
    const nbRand: number = Math.floor(Math.random() * 2);

    tabObj[tabRandom[rand][0]][tabRandom[rand][1]].isVide = false;
    tabObj[tabRandom[rand][0]][tabRandom[rand][1]].containsNumber = nbRand == 0 ? 2 : 4;
    tabRandom = tabRandom.filter(item => item[0] !== tabRandom[rand][0] || item[1] !== tabRandom[rand][1]);
}

function modifierTab(row: number,block: number,contains?: number,isVide?: boolean): void {
    tabObj[row][block].isVide = isVide ?? true;
    tabObj[row][block].containsNumber = contains ?? 0;
}

function deplacer(callback: (row: number, block: number) => boolean, y: number, x: number): void {
    gameContainer.innerHTML = "";
    let recommencer: number = 1;
    let deplacement = false;
    const dejaFusione = []; // Pour ne pas readditionner meme element
    while (recommencer > 0) {
        recommencer = 0;
        for (let row = 0; row < 4; row++) {
            for (let block = 0; block < 4; block++) {
                if (
                    row + y >= 0 &&
                    row + y < 4 &&
                    block + x >= 0 &&
                    block + x < 4 &&
                    tabObj[row + y][block + x].containsNumber == tabObj[row][block].containsNumber 
                    && !tabObj[row][block].isVide
                ) {
                    tabObj[row + y][block + x].containsNumber = tabObj[row + y][block + x].containsNumber * 2;
                    tabObj[row][block].isVide = true;
                    tabRandom.push([row, block]);
                    tabObj[row][block].containsNumber = 0;
                    recommencer++;
                    console.log("PLUS");
                    deplacement = true;
                } else if (callback(row, block)) {
                    tabObj[row + y][block + x].containsNumber = tabObj[row][block].containsNumber;
                    tabObj[row + y][block + x].isVide = false;
                    tabRandom = tabRandom.filter(item => item[0] !== row + y || item[1] !== block + x);
                    tabObj[row][block].isVide = true;
                    tabRandom.push([row, block]);
                    tabObj[row][block].containsNumber = 0;
                    recommencer++;
                    console.log("DEPLACEMENT", tabObj[row][block], [row, block], tabObj[row + y][block + x], [row+y, block+x]);
                    deplacement = true;
                }
            }
        }
    }
    if (deplacement) blockAleatoire();
    generateGrid();
}

function dirBas(row: number, block: number): boolean {
    return (
        row < 3 && tabObj[row + 1][block].isVide && !tabObj[row][block].isVide
    );
}

function dirHaut(row: number, block: number): boolean {
    return (
        row > 0 && tabObj[row - 1][block].isVide && !tabObj[row][block].isVide
    );
}

function dirGauche(row: number, block: number): boolean {
    return (
        block > 0 && tabObj[row][block - 1].isVide && !tabObj[row][block].isVide
    );
}

function dirDroit(row: number, block: number): boolean {
    return (
        block < 3 && tabObj[row][block + 1].isVide && !tabObj[row][block].isVide
    );
}

function whichKey(event: KeyboardEvent): void {
    if (isMoving) return;
    isMoving = true;

    if (event.key === "ArrowUp") {
        deplacer(dirHaut, -1, 0);
    } else if (event.key === "ArrowDown") {
        deplacer(dirBas, 1, 0);
    } else if (event.key === "ArrowLeft") {
        deplacer(dirGauche, 0, -1);
    } else if (event.key === "ArrowRight") {
        deplacer(dirDroit, 0, 1);
    }

    isMoving = false;
}

generateTabObj();
blockAleatoire();
blockAleatoire();
generateGrid();

window.addEventListener("keyup", whichKey);