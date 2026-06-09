
const toggleState = (multiStateBox) => {
    const states = multiStateBox.states;
    const currentState = multiStateBox.currentState;
    
    const currentIndex = states.findIndex(state => state.id === currentState.id);
    const nextIndex = (currentIndex + 1) % states.length;

    multiStateBox.changeState(states[nextIndex].id);
};

$w.onReady(() => {
  $w("#cardIndividualFront").onClick((event) => toggleState($w("#cardIndividual")));
  $w("#cardGroupFront").onClick((event) => toggleState($w("#cardGroup")));
  $w('#btnCloseIndividual').onClick((event) => toggleState($w("#cardIndividual")));
  $w('#btnCloseGroup').onClick((event) => toggleState($w("#cardGroup")));
});
