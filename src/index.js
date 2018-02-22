// @lampix/state is a plugin for @lampix/core that exposes a friendlier API
// See https://www.npmjs.com/package/@lampix/state#state for an example of what it solves
import stateManager from '@lampix/state';
import core from '@lampix/core';

// Import everything! See https://github.com/lampix-org/app-boilerplate
import './globals.css';

// UI Utils
import hide from './hide';
import show from './show';

const rect1 = {
  posX: 0,
  posY: 0,
  width: 100,
  height: 100
};

const rect2 = {
  posX: 150,
  posY: 150,
  width: 100,
  height: 100
};

const rect3 = {
  posX: 500,
  posY: 50,
  width: 100,
  height: 100
};

const rect4 = {
  posX: 500,
  posY: 200,
  width: 100,
  height: 100
};

/**
 * IMPORTANT notice about buttons:
 *
 * You should limit buttons to 50px x 50px.
 * This is due to the dataset used to teach Lampix how to recognize a finger.
 * Also note that Lampix projects 50px x 50px as around 3.5cm x 3.5cm.
*/
const toggleButton = {
  posX: 300,
  posY: 300,
  width: 50,
  height: 50
};

/**
 * What is a state?
 * A state is a set of areas grouped by event type
 * There are three event types to consider:
 *
 * - movement
 * - simple classification
 * - position classification
 *
 * As such, we currently recommend that you stick to three areaGroups, each having as many areas as possible.
 * This limitation has to do with how Lampix handles registering areas, as explained at
 * https://www.npmjs.com/package/@lampix/state#state
 *
 * An AreaGroup allows you to:
 *
 * - define a set of rectangles (or none, via an empty array)
 * - add rectangles
 * - remove rectangles
 *
 * NOTE: rectangles should be object defined like rect1, rect2 and toggleButton. However,
 * Lampix does not care about other objects, so adding identifiers or metadata is allowed.
 *
 * NOTE: The purpose of a state is to hold all the logic bound to areas a device is watching at a certain point.
 * When you need to transition to a completely different set of areas, you change to a different state.
 * Changing from one state to another will deactivate all registered elements first.
 */

const exampleState1 = stateManager.addState('example-state1');
const movementAreaGroup1 = exampleState1.addAreaGroup('movement-areagroup1', []); // Areas later!

// Areas now!
movementAreaGroup1.addArea(rect1);
movementAreaGroup1.addArea(rect2);

const eventBinder = movementAreaGroup1.onMovement((rectIndex) => {
  console.log(`We've got movement at rectangle #${rectIndex}, lads!`);
}); // <-- At this point, Lampix is not aware of the rectangles or the callback

/**
 * This registers the area group and event handler with Lampix
 * As of right now, an eventbinder object only provides an enable function
 */
eventBinder.enable(); // Lampix starts watching for movement in the areas defined by rect1 and rect2

// There is currently no active state, only AreaGroup1 is active.
// You can see that via StateManager.currentState
// Activating example-state1 'officially'
stateManager.changeToState('example-state1');

// If you need to provide other environemnt variables, look for process.env.NODE_ENV in internals/webpack.dev.js

// Another state!
const exampleState2 = stateManager.addState('example-state2');
const positionAreaGroup = exampleState2.addAreaGroup('position-areagroup2', [rect3, rect4]); // Areas added right away!

// Simulator is having a couple of issues on the position classification side in its early stages
positionAreaGroup.onPositionClassification(
  'custom_classifier',
  (rectIndex, classifiedObjects) => {
    console.log(`Custom stuff in rectangle ${rectIndex}:`, classifiedObjects);
  },
  (rectIndex, detectedObjects) => {
    /**
     * This occurs before the classifier is able to tell what class the object belongs to.
     * This callback provides outlines for the detected objects which are meant to be used to create form of loader.
     */
    console.log(`Rectangle ${rectIndex} showing off preclassification:`, detectedObjects);
  }
);

/**
 * There may be different classifiers between development (simulator) and production (Lampix).
 * This is due to UI development usually happening faster than neural network training.
 *
 * The same goes for values returned.
 * The simulator returns "finger" and "no_finger" as classTags when it sees fingers.
 *
 * Lampix currently returns 1 for "finger" and 0 for "no_finger"
 *
 * To choose a value based on environment:
 */
const fingerClassifier = process.env.NODE_ENV === 'development' ? 'finger' : 'cls_loc_fin_all_small';

// Let's register a button via @lampix/core, bypassing @lampix/state
// Make sure you know the implications regarding the lifecycle of this event within Lampix,
// as explained above or in the links provided.
core.registerSimpleClassifier([
  {
    ...toggleButton,
    /**
     * Placing a classifier per rectangle is automatically done via @lampix/state methods
     * This does not allow an areaGroup to have rectangles with different classifiers
     * @lampix/state may see frequent API changes in the following months
     * to account for various needs
     */
    classifier: fingerClassifier
  }
], () => {
  /**
   * -------------------------------------------------
   * -------------------------------------------------
   * ------------------ HOMEWORK ---------------------
   * A great first exercise would be to add toggleButton to each state in order to be able to toggle properly!
   * ------------------ HOMEWORK ---------------------
   * -------------------------------------------------
   * -------------------------------------------------
   */

  console.log('This will only be called once, because of the reason mentioned at line 79.');
  console.log('Changing states... ');
  if (stateManager.currentState.name === 'example-state1') {
    hide('white-one', 'gray-one');
    show('green-one', 'fuchsia-one');
    stateManager.changeToState('example-state2');
  } else {
    // This won't get called
    hide('green-one', 'fuchsia-one');
    show('white-one', 'gray-one');
    stateManager.changeToState('example-state1');
  }
});
