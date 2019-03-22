const mapSlotsArray = [];
const showSlotArray = [];
let xSize = 15;
let ySize = 15;
let bombs = 50;

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
  }

  mapSlotsArray[numberOfSlots] = 0;
  showSlotArray[numberOfSlots] = false;
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
}

function addToSides(slotIndex) {
  addToSlot(slotIndex - (xSize + 1));
  addToSlot(slotIndex - xSize);
  addToSlot(slotIndex - (xSize - 1));
  addToSlot(slotIndex - 1);
  addToSlot(slotIndex + 1);
  addToSlot(slotIndex + (xSize - 1));
  addToSlot(slotIndex + xSize);
  addToSlot(slotIndex + (xSize + 1));
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
  let html = "<table class='slotsCanvas' cellpadding=0 cellspacing=0>";

  for (let row = 0; row < ySize; row++) {
    html += "<tr>";

    for (let column = 0; column < xSize; column++) {
      const slotIndex = column + ySize * row;
      const slotValue = mapSlotsArray[slotIndex];
      let showValue = slotValue;
      if(slotValue === 9){
        showValue = "X";
      }

      html += "<td class='slot'>";
      html += showSlotArray[slotIndex]
        ? `<button type='button' class='btn-slot-shown' onclick="clickSlot(${slotIndex});">${showValue}</button>`
        : `<button type='button' class='btn-slot' onclick="clickSlot(${slotIndex});"></button>`;
      html += "</td>";
    }

    html += "</tr>";
  }

  html += "</table>";

  document.querySelector("#slotCanvas").innerHTML = html;
}

function clickSlot(slotIndex) {
  showSlotArray[slotIndex] = true;
  renderSlots();
  const slotValue = mapSlotsArray[slotIndex];

  if (slotValue === 9) {
    endGame();
    return;
  }

  if(slotValue === 0){
    //checkZeroSlotsRepercursivily(slotIndex);

    renderSlots();
  }
}

function endGame(){
  for(let i=0;i<(xSize * ySize);i++){
    showSlotArray[i] = true;
  }
  renderSlots();
}

function checkZeroSlotsRepercursivily(slotIndex){
  // (n - xSize) TOP
  // (n - 1)     LEFT
  // (n + 1)     RIGHT
  // (n + xSize) BOTTOM
  checkZeroSlotAndChangeVisibilityRep(slotIndex-xSize);
  checkZeroSlotAndChangeVisibilityRep(slotIndex-1);
  checkZeroSlotAndChangeVisibilityRep(slotIndex+1);
  checkZeroSlotAndChangeVisibilityRep(slotIndex+xSize);
}

function checkZeroSlotAndChangeVisibilityRep(slotIndex){
  if(mapSlotsArray[slotIndex] === 0)
  {
    showSlotArray[slotIndex] = true;
    checkZeroSlotsRepercursivily(slotIndex);
  }
}