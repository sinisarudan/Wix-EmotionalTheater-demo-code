import wixLocationFrontend from 'wix-location-frontend';
// TODO: import { completeUserTaskStep } from 'backend/evolveMeHandlers';
import { EvolveMe_initialSetup, EvolveMe_updateTaskStep, EvolveMe_changeStep, EvolveMe_signUpButton_onClick } from './masterPage';
import wixLocation from 'wix-location';

const TASK_NO = 1;
// This page is for the task "https://evolveme.asa.org/task/1381", and the following task is:
const NEXT_TASK = "https://evolveme.asa.org/task/1382";

let stepNumber, taskID, userID;

$w.onReady(function () {
    ({stepNumber, taskID, userID} = EvolveMe_initialSetup($w("#firstTaskSteps")));

    // FirstStep:
    /**
    *	Adds an event handler that runs when playback has ended.
        [Read more](https://www.wix.com/corvid/reference/$w.VideoPlayer.html#onEnded)
    *	 @param {$w.Event} event
    */
    $w('#stepOneVideo').onEnded(event => stepFinished(event));
    // SecondStep:


    // SecondStep:
    /**
     *	Adds an event handler that fires when a visitor submits a Wix Form and it is successfully received by the server.
    */
    $w('#wixForms11').onSubmitSuccess(event => stepFinished(event));
    $w('#wixForms12').onSubmitSuccess(event => stepFinished(event));
    $w('#wixForms13').onSubmitSuccess(event => stepFinished(event));
    $w('#signUpButton').onClick(signUpButton_onClick);
    $w('#textPostVideo').onClick(textPostVideo_onClick); // `text620` in the old Wix
    $w('#textStartNewTask').onClick(textStartNewTask_onClick); // `text623` in the old Wix
});

/**
*	Adds an event handler that runs when playback has ended.
	[Read more](https://www.wix.com/corvid/reference/$w.VideoPlayer.html#onEnded)
*	 @param {$w.Event} event
*/
export async function stepFinished(event) {
    await EvolveMe_updateTaskStep(TASK_NO, userID, taskID, stepNumber);
    stepNumber++;
    await EvolveMe_changeStep($w("#firstTaskSteps"), $w("#thankyouText"), $w("#nextStepText"), stepNumber);
}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export async function signUpButton_onClick(event) {
    await EvolveMe_signUpButton_onClick($w("#firstTaskSteps"), $w("#txtAlreadyMember"), TASK_NO, userID, taskID, stepNumber);
}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function textStartNewTask_onClick(event) {
    console.log("[textStartNewTask_onClick] wixLocation.to", NEXT_TASK);
    // wixLocationFrontend.to(NEXT_TASK)
    wixLocation.to(NEXT_TASK);
}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function textPostVideo_onClick(event) {
    $w("#sectionARVideo").expand()
    $w("#sectionARVideo").scrollTo()
}