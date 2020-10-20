const { Map } = require('immutable');

const store = {
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  selectedRoverData: {}
};

// add markup to the page
const root = document.getElementById('root');

const updateStore = (store = store, newState = {}) => {
  store = { ...store, ...newState };
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
  addEventHandlers(state);
};

const addEventHandlers = (state) => {
  const { rovers } = state;
  rovers.forEach((rover) => {
    document.getElementById(rover).addEventListener('click', () => {
      getData(rover, state);
    });
  });
};

// create content
const App = (state) => {
  const { rovers, selectedRoverData } = state;

  return `
      <header>
        <h1>Mars Rovers</h1>
        <p>Choose a Mars Rover to learn more</p>
      </header>
      <div class="buttonContainer">
        ${Buttons(rovers)}
      </div>
      <div class="roverContainerOuter">
     ${Cards(selectedRoverData)}
      </div>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS

const Buttons = (array) => array.map((rover) => `<button id='${rover}'>${rover}</button>`).join('');

const RoverImages = (selectedRoverData) => {
  const { name, photos, maxDate } = selectedRoverData;
  if (!selectedRoverData) {
    return;
  }

  return photos
    .map(
      (photo) => `<div class='imgContainer'>
      <img src='${photo}' alt='Picture taken by ${name} on ${maxDate}' />
    </div>`
    )
    .join('');
};

const Cards = (selectedRoverData) => {
  const { name, launchDate, landingDate, status, photos } = selectedRoverData;

  if (!Object.keys(selectedRoverData).length) {
    return '';
  }

  return `<h2>${name}</h2>
      <ul>
        <li>Launch Date: <em>${launchDate}</em></li>
        <li>Landing Date: <em>${landingDate}</em></li>
        <li>Status: <em>${status}</em></li>
      </ul>
      <h3>Images</h3>
      <div class='roverGalleryContainer'>
        ${RoverImages(selectedRoverData)}
      </div>`;
};

// ------------------------------------------------------  API CALLS

const getData = (rover, state) => {
  fetch(`http://localhost:3000/rover-manifests/${rover.toLowerCase()}`)
    .then((res) => res.json())
    .then((data) => {
      const { photo_manifest } = data.data;
      return {
        name: photo_manifest.name,
        launchDate: photo_manifest.launch_date,
        landingDate: photo_manifest.landing_date,
        status: photo_manifest.status,
        maxDate: photo_manifest.max_date
      };
    })
    .then((manifestData) => {
      fetch(`http://localhost:3000/rover/${rover.toLowerCase()}/${manifestData.maxDate}`)
        .then((res) => res.json())
        .then((data) => {
          const { photos } = data.data;
          const photoArr = photos.map((photoObj) => photoObj.img_src);
          updateStore(state, {
            selectedRoverData: {
              ...manifestData,
              photos: photoArr
            }
          });
        });
    });
};
