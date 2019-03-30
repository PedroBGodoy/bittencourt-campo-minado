const mapSlotsArray = [];
const showSlotArray = [];
const markedSlotArray = [];
let xSize = 15;
let ySize = 15;
let bombs = 20;
let renderDifference = true;

function start() {
  createMap();
  placeBombsRandomAndAddToSlots();
  renderSlots();
  document.getElementById("btn-start").innerHTML = "Restart";
}

function createMap() {
  const numberOfSlots = xSize * ySize - 1;

  for (let i = 0; i < numberOfSlots; i++) {
    mapSlotsArray[i] = 0;
    showSlotArray[i] = false;
    markedSlotArray[i] = false;
  }

  mapSlotsArray[numberOfSlots] = 0;
  showSlotArray[numberOfSlots] = false;
  markedSlotArray[numberOfSlots] = false;
}

function placeBombsRandomAndAddToSlots() {
  for (let i = 0; i < bombs; i++) {
    const randomSlotNumber = Math.floor(Math.random() * mapSlotsArray.length);

    if (mapSlotsArray[randomSlotNumber] !== 9) {
      mapSlotsArray[randomSlotNumber] = 9;
      addToSides(randomSlotNumber);
    } else {
      i--;
    }
  }
  renderDifference = true;
}

function addToSides(slotIndex) {
  doSomethingToAllSides(slotIndex, addToSlot);
}

function addToSlot(slotIndex) {
  if (
    mapSlotsArray[slotIndex] === 9 ||
    slotIndex < 0 ||
    slotIndex >= xSize * ySize
  )
    return;
  mapSlotsArray[slotIndex]++;
}

function renderSlots() {
  if (renderDifference) {
    renderDifference = false;

    let html = "<table class='slotsCanvas' cellpadding=0 cellspacing=0>";

    for (let row = 0; row < ySize; row++) {
      html += "<tr>";

      for (let column = 0; column < xSize; column++) {
        const slotIndex = column + ySize * row;
        const slotValue = mapSlotsArray[slotIndex];
        let showValue = slotValue;
        if (slotValue === 9) {
          showValue = "#";
        }

        html +=
          "<td class='slot' oncontextmenu='rightClick(\"" +
          slotIndex +
          "\"); return false;'>";

        if (markedSlotArray[slotIndex]) {
          html += `<button type='button' class='btn-slot-marked' onclick=""></button>`;
        } else {
          html += showSlotArray[slotIndex]
            ? `<button type='button' class='btn-slot-shown' onclick="clickSlot(${slotIndex});">${showValue}</button>`
            : `<button type='button' class='btn-slot' onclick="clickSlot(${slotIndex});"></button>`;
        }

        html += "</td>";
      }

      html += "</tr>";
    }

    html += "</table>";

    document.querySelector("#slotCanvas").innerHTML = html;
  }

  setTimeout(() => {
    renderSlots();
  }, 10);
}

function rightClick(slotIndex) {
  if (!showSlotArray[slotIndex]) {
    if (markedSlotArray[slotIndex]) {
      markedSlotArray[slotIndex] = false;
      renderDifference = true;
    } else {
      markedSlotArray[slotIndex] = true;
      renderDifference = true;
    }
  }
}

function clickSlot(slotIndex) {
  showSlotArray[slotIndex] = true;
  const slotValue = mapSlotsArray[slotIndex];
  renderDifference = true;

  if (slotValue === 9) {
    endGame();
    return;
  }

  if (checkIfZeroAndClosed(slotIndex)) {
    openSides(slotIndex);
    checkSidesAndOpenZeros(slotIndex);
  }
}

function checkIfZeroAndClosed(slotIndex) {
  if (mapSlotsArray[slotIndex] === 0 && showSlotArray[slotIndex]) {
    return true;
  }

  return false;
}

function openSides(slotIndex) {
  doSomethingToAllSides(slotIndex, openSlot);
}

function checkSidesAndOpenZeros(slotIndex) {
  doSomethingToAllSides(slotIndex, checkSideAndOpen);
}

function checkSideAndOpen(slotIndex) {
  if (!checkIfZeroAndClosed(slotIndex)) return;

  openSides(slotIndex);
  checkSidesAndOpenZeros(slotIndex);
}

function openSlot(slotIndex) {
  showSlotArray[slotIndex] = true;
  renderDifference = true;
}

function endGame() {
  for (let i = 0; i < xSize * ySize; i++) {
    showSlotArray[i] = true;
  }
  renderDifference = true;
}

/// UTILITY
function doSomethingToDirectSides(slotIndex, action) {
  action(slotIndex - xSize);
  action(slotIndex - 1);
  action(slotIndex + 1);
  action(slotIndex + xSize);
}

function doSomethingToAllSides(slotIndex, action) {
  action(slotIndex - xSize - 1);
  action(slotIndex - xSize);
  action(slotIndex - xSize + 1);
  action(slotIndex - 1);
  action(slotIndex + 1);
  action(slotIndex + xSize - 1);
  action(slotIndex + xSize);
  action(slotIndex + xSize + 1);
}
