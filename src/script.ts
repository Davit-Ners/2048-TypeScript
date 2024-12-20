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
const gameContainer: HTMLDivElement = document.querySelector('#game-container') as HTMLDivElement;
const tabObj: Block[][] = [];

// Const et Let

// Fonctions
function generateGrid() {
    for (const ligne of tabObj) {
        const row = document.createElement('div');
        row.className = 'row';
        for (const block of ligne) {
            const carre = document.createElement('div');
            if (block.isVide) {
                carre.className = 'blockVide';
            }
            else {
                carre.className = 'block';
                const p = document.createElement('p');
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
        }
    }
}

function modifierTab(row: number, block: number, contains?: number, isVide?: boolean): void {
    tabObj[row][block].isVide = isVide ?? true;
    tabObj[row][block].containsNumber = contains ?? 0
}

function deplacer(callback: (row: number, block: number) => boolean): void {
    gameContainer.innerHTML = '';
    let recommencer: number = 1;
    while (recommencer > 0) {
        recommencer = 0;
        for (let row = 0; row < 4; row++) {
            for (let block = 0; block < 4; block++) {
                if (callback(row, block)) {
                    tabObj[row + 1][block].containsNumber = tabObj[row][block].containsNumber;
                    tabObj[row + 1][block].isVide = false;
                    tabObj[row][block].isVide = true;
                    tabObj[row][block].containsNumber = 0;
                    recommencer++;
                }
            }
        }
    }
    generateGrid();
}

function deplacerBas(row: number, block: number): boolean {
    return row < 3 && tabObj[row + 1][block].isVide && !(tabObj[row][block].isVide);
}



generateTabObj();
modifierTab(0, 2, 2, false)
modifierTab(1, 3, 2, false)
modifierTab(2, 1, 2, false)
modifierTab(2, 2, 2, false)
generateGrid();