var difficulty = 0.18;
var gridHeight = 24;
var gridWidth = 42;
var quickStart = 1;

let minedCellsIds = [];
let clickedCellsIds = [];
let inProcessIds = [];
let neighbourIds = [];

init(gridHeight, gridWidth);

function init(gridHeight, gridWidth) {
    createGrid(gridHeight, gridWidth);

    if (quickStart == 1) {
        centerCell = (gridHeight * gridWidth / 2 - gridWidth / 2);
        getNeighborIds(centerCell);
        neighbourIds.push(centerCell);

        while (neighbourIds.length > 0) {
            IDToClear = neighbourIds.pop();
            minedCellsIds[IDToClear] = "nope"
        }
        inProcessIds.push(centerCell);
        mainLoop();
    }
    
    //const resetButton = .getElementById("reset-button");
    //resetButton.addEventListener('click', );
    
    //const resizeButton = .getElementById("resize-button");
    //resizeButton.addEventListener('click', );
}

function createGrid(gridHeight, gridWidth) {
    let gridArea = document.getElementById("grid-area");

    gridArea.style.gridTemplateColumns = `repeat(${gridWidth}, 1fr)`;

    for (let i = 0; i < (gridHeight * gridWidth); i++) {
        const cell = document.createElement("button");
        cell.classList.add("grid-cell");
        cell.id = i;

        //setting size of grid cell
        cellSide = 40;
        if ((gridWidth / gridHeight) > 2) {cellSide = 1600 / gridWidth}
        else {cellSide = 800 / gridHeight};
        cell.style.width = `${cellSide}px`;
        cell.style.height = `${cellSide}px`;

        //centering playfield horisontally
        gridArea.style.width = `${cellSide * gridWidth}px`
        gridArea.style.margin = "0 auto"

        //initialising array containing into on cell being a mine
        if (Math.random() < difficulty) {minedCellsIds[i] = "mine"} else {minedCellsIds[i] = "nope"};

        //initialising array containing info on cell opened/not opened status
        clickedCellsIds[i] = "false";

        //adding event listeners
        cell.addEventListener("click", () => {inProcessIds.push(i); mainLoop()});
        cell.addEventListener("contextmenu", () => {markMine(i); event.preventDefault()});

        gridArea.prepend(cell);
    }

}

function markMine(cellNo) {
    let cellToYellow = document.getElementById(cellNo);
    if (cellToYellow.style.background == "yellow") {cellToYellow.style.background = "azure"}
    else if (cellToYellow.style.background == "red") {}
    else if (clickedCellsIds[cellNo] == "false") {cellToYellow.style.background = "yellow"};
}

//main loop, nessesary to implement automatic opening of adjacent cells when cell with displayed value of 0 is opened
function mainLoop() {

    while (inProcessIds.length > 0) {
        ID = inProcessIds.pop();

        //skipping previously opened elements
        if (clickedCellsIds[ID] == "true") continue;

        var elemetToEdit = document.getElementById(ID);

        //checking if clicked on mine
        if (minedCellsIds[ID] == "mine") {
            elemetToEdit.style.background = "red";
            continue;
        };

        getNeighborIds(ID);
        minesCount = countMines();

        elemetToEdit.style.background = "black";

        //checking for zero mines to append to inProcessIds
        if (minesCount == 0) {
            while (neighbourIds.length > 0) {
                elementToPush = neighbourIds.pop();
                if (clickedCellsIds[elementToPush] == "false") {inProcessIds.push(elementToPush)};
            };
        }

        else {
            //assign minse number as cell text
            elemetToEdit.textContent = `${minesCount}`;
            
            //assign text colour depending on value
            if (minesCount == 1) {elemetToEdit.style.color = "#eeeeee"}
            else if (minesCount == 2) {elemetToEdit.style.color = "#e4f000"}
            else if (minesCount == 3) {elemetToEdit.style.color = "#f7c611"}
            else if (minesCount == 4) {elemetToEdit.style.color = "#f56f0f"}
            else if (minesCount > 4) {elemetToEdit.style.color = "#ff2b0a"}
        };

        clickedCellsIds[ID] = "true";
        

    }

}

//function that generates array containing IDs of cells adjacent to opened cell
function getNeighborIds(startingID) {
    
    while (neighbourIds.length > 0) {
        throwaway = neighbourIds.pop();
    };

    if (startingID == 0) {
        neighbourIds.push(startingID + 1);
        neighbourIds.push(startingID + gridWidth + 1);
        neighbourIds.push(startingID + gridWidth);
    }
    
    else if (startingID == (gridWidth - 1) ) {
        neighbourIds.push(startingID + gridWidth);
        neighbourIds.push(startingID + gridWidth - 1);
        neighbourIds.push(startingID - 1);
    }
    
    else if (startingID == (gridWidth * gridHeight - 1) ) {
        neighbourIds.push(startingID - 1);
        neighbourIds.push(startingID - gridWidth - 1);
        neighbourIds.push(startingID - gridWidth);
    }
    
    else if (startingID == (gridWidth * gridHeight - gridWidth) ) {
        neighbourIds.push(startingID - gridWidth);
        neighbourIds.push(startingID - gridWidth + 1);
        neighbourIds.push(startingID + 1);
    }

    else if (startingID < gridWidth) {
        neighbourIds.push(startingID + 1);
        neighbourIds.push(startingID + gridWidth + 1);
        neighbourIds.push(startingID + gridWidth);
        neighbourIds.push(startingID + gridWidth - 1);
        neighbourIds.push(startingID - 1);
    }

    else if (startingID % gridWidth == 0) {
        neighbourIds.push(startingID - gridWidth);
        neighbourIds.push(startingID - gridWidth + 1);
        neighbourIds.push(startingID + 1);
        neighbourIds.push(startingID + gridWidth + 1);
        neighbourIds.push(startingID + gridWidth);
    }

    else if ((startingID + 1) % gridWidth == 0) {
        neighbourIds.push(startingID - gridWidth);
        neighbourIds.push(startingID + gridWidth);
        neighbourIds.push(startingID + gridWidth - 1);
        neighbourIds.push(startingID - 1);
        neighbourIds.push(startingID - gridWidth - 1);
    }

    else if (startingID >= (gridWidth * gridHeight - gridWidth)) {
        neighbourIds.push(startingID - gridWidth);
        neighbourIds.push(startingID - gridWidth + 1);
        neighbourIds.push(startingID + 1);
        neighbourIds.push(startingID - 1);
        neighbourIds.push(startingID - gridWidth - 1);
    }

    else {
        neighbourIds.push(startingID - gridWidth);
        neighbourIds.push(startingID - gridWidth + 1);
        neighbourIds.push(startingID + 1);
        neighbourIds.push(startingID + gridWidth + 1);
        neighbourIds.push(startingID + gridWidth);
        neighbourIds.push(startingID + gridWidth - 1);
        neighbourIds.push(startingID - 1);
        neighbourIds.push(startingID - gridWidth - 1);
    }
    
}

function countMines(){
    var counter = 0;
    for (i = 0; i < 8; i++) {
        var cellId = neighbourIds[i];
        if  (minedCellsIds[cellId] == "mine") {counter++};
    };
    return counter;
}