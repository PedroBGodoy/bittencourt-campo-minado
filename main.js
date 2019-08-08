const mapSlotsArray = [];
const showSlotArray = [];
const markedSlotArray = [];

const xSize = 15;
const ySize = 15;
const amountOfBombs = 30;

let renderDifference = true;
let gameEnded = false;
let victory = false;
let markedSlotsCount = 0;

let firstClick = -1;

function start() {
  victory = false;
  markedSlotsCount = 0;
  gameEnded = false;
  firstClick = -1;

  $("#popup").hide();

  createMap();
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

function placeBombsRandomAndAddToSlots(slotIndex) {
  for (let i = 0; i < amountOfBombs; i++) {
    const randomSlotNumber = Math.floor(Math.random() * mapSlotsArray.length);

    if (mapSlotsArray[randomSlotNumber] !== 9 && i != slotIndex) {
      mapSlotsArray[randomSlotNumber] = 9;
      addToSides(randomSlotNumber);
    } else {
      i--;
    }
  }
  renderDifference = true;
}

function addToSides(slotIndex) {
  doActionToAllSides(slotIndex, addToSlot);
}

function addToSlot(slotIndex) {
  if (
    mapSlotsArray[slotIndex] == 9 ||
    slotIndex < 0 ||
    slotIndex >= xSize * ySize
  )
    return;
  mapSlotsArray[slotIndex]++;
}

function renderSlots() {
  if (renderDifference) {
    let html = "";

    if(gameEnded){
      if(victory){
        $("#end_message").html("You Won!");
      } else{
        $("#end_message").html("You Lost!");
      }

      $("#popup").show();
    }

    html += "<table class='slotsCanvas' cellpadding=0 cellspacing=0 style='margin: 25px'>";

    for (let row = 0; row < ySize; row++) {
      html += "<tr>";

      for (let column = 0; column < xSize; column++) {
        const slotIndex = column + ySize * row;
        const slotValue = mapSlotsArray[slotIndex];
        let showValue = slotValue;

        html += `<td class='slot' id='slot_${slotIndex}"' oncontextmenu='rightClick(event, ${slotIndex}); return false;'>`;

        if (markedSlotArray[slotIndex]) {
          if(slotIndex % 2 == 0){
              html += `<button type='button' class='btn-slot-grade0' onclick=""><i class="fa fa-flag" style="color: rgb(222, 80, 58)"></i></button>`;
            }else{
              html += `<button type='button' class='btn-slot-grade1' onclick=""><i class="fa fa-flag" style="color: rgb(222, 80, 58)"></i></button>`;
            }
        } else {
          let className = slotIndex % 2 == 0 ? "btn-slot-shown-grade1" : "btn-slot-shown-grade0";
          
          className += slotValue == 0 ? " zero" : "";
          className += slotValue == 9 ? " bomb" : "";

          if(showSlotArray[slotIndex]){
            if(slotValue == 9){
              html += `<button type='button' class='${className}' onclick=""><i class="fa fa-bomb"></i></button>`;
            }else{
              html += `<button type='button' class='${className}' onclick="">${slotValue}</button>`;
            }

          }else{
            if(slotIndex % 2 == 0){
              html += `<button type='button' class='btn-slot-grade0' onclick="clickSlot(${slotIndex});"></button>`;
            }else{
              html += `<button type='button' class='btn-slot-grade1' onclick="clickSlot(${slotIndex});"></button>`;
            }
          }
        }

        html += "</td>";
      }

      html += "</tr>";
    }

    html += "</table>";

    document.querySelector("#slotCanvas").innerHTML = html;

    renderDifference = false;    
  }

  setTimeout(() => {
    renderSlots();
  }, 10);
}

function rightClick(event, slotIndex) {
  event.preventDefault();

  if (showSlotArray[slotIndex]){
    return;
  }
  
  if(markedSlotArray[slotIndex]){
    markedSlotsCount--;
  }else{
    if(markedSlotsCount >= amountOfBombs){
      return;
    }
    markedSlotsCount++;
  }

  markedSlotArray[slotIndex] = !markedSlotArray[slotIndex];
  renderDifference = true;

  checkVictory();
}

function clickSlot(slotIndex) {
  if(firstClick == -1){
    firstClick = slotIndex;
    placeBombsRandomAndAddToSlots(slotIndex);
  }

  const slotValue = mapSlotsArray[slotIndex];

  if (slotValue == 9) {
    lose();
    return;
  }else
    openSlot(slotIndex);

  renderDifference = true;
}

function openSlot(slotIndex) {
  if (checkIfZeroAndClosed(slotIndex)) {
    showSlotArray[slotIndex] = true;
    renderDifference = true;
    openSides(slotIndex);
  }else{
    showSlotArray[slotIndex] = true;
    renderDifference = true;
  }
}

function checkIfZeroAndClosed(slotIndex) {
  if (mapSlotsArray[slotIndex] == 0 && !showSlotArray[slotIndex]) 
    return true;

  return false;
}

function openSides(slotIndex) {
  doActionToAllSides(slotIndex, openSlot);
}

function checkVictory(){
  let markedBombsCount = 0;
  for(let i = 0; i < xSize * ySize; i++){
    if(mapSlotsArray[i] == 9 && markedSlotArray[i])
      markedBombsCount++;
  }

  if(markedBombsCount == amountOfBombs)
    win();
}

function win(){
  victory = true;
  gameEnded = true;
  showAll();
}

function lose(){
  gameEnded = true;
  showAll();
}

function showAll() {
  for (let i = 0; i < xSize * ySize; i++)
    showSlotArray[i] = true;

  renderDifference = true;
}

/// UTILITY
function doActionToDirectSides(slotIndex, action) {
  action(slotIndex - xSize);
  action(slotIndex - 1);
  action(slotIndex + 1);
  action(slotIndex + xSize);
}

function doActionToAllSides(slotIndex, action) {
  action(slotIndex - xSize - 1);
  action(slotIndex - xSize);
  action(slotIndex - xSize + 1);
  action(slotIndex - 1);
  action(slotIndex + 1);
  action(slotIndex + xSize - 1);
  action(slotIndex + xSize);
  action(slotIndex + xSize + 1);
}
