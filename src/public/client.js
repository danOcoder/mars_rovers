let store = {
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  selectedRover: ''
};

console.log('store', store);

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
  store = { ...store, ...newState };
  console.log('store after update:', store);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
  addEventHandlers(state);
};

const addEventHandlers = (state) => {
  state.rovers.forEach((rover) => {
    document.getElementById(rover).addEventListener('click', () => {
      updateStore(store, {
        selectedRover: rover
      });
    });
  });
};

// create content
const App = (state) => {
  const { rovers, selectedRover } = state;

  return `
      <header>
        <h1>Mars Rovers</h1>
        <p>Choose a Mars Rover to learn more</p>
      </header>
      <div class="buttonContainer">
        ${Buttons(rovers)}
      </div>
      <div class="roverContainerOuter">
       ${Cards(selectedRover)}
      </div>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS

const Buttons = (array) => array.map((rover) => `<button id='${rover}'>${rover}</button>`).join('');

const Cards = (selectedRover) => `<h2>${selectedRover}</h2>`;

// gallery
{
  /* <div class='roverGalleryContainer'>
  <div class='imgContainer'>
    <img src='https://placekeanu.com/500/300/y' alt='' />
  </div>
  <div class='imgContainer'>
    <img src='https://placekeanu.com/500/300/y' alt='' />
  </div>
  <div class='imgContainer'>
    <img src='https://placekeanu.com/500/300/y' alt='' />
  </div>
  <div class='imgContainer'>
    <img src='https://placekeanu.com/500/300/y' alt='' />
  </div>
  <div class='imgContainer'>
    <img src='https://placekeanu.com/500/300/y' alt='' />
  </div>
  <div class='imgContainer'>
    <img src='https://placekeanu.com/500/300/y' alt='' />
  </div>
</div>; */
}

// ------------------------------------------------------  API CALLS
