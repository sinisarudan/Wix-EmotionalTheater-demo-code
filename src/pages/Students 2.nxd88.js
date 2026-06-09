import wixLocationFrontend from 'wix-location-frontend';
// TODO: import { completeUserTaskStep } from 'backend/evolveMeHandlers';
import { EvolveMe_initialSetup, EvolveMe_updateTaskStep, EvolveMe_changeStep, EvolveMe_signUpButton_onClick } from './masterPage';

const TASK_NO = 2;
// This page is for the task "https://evolveme.asa.org/task/1382", and the following task is:
const NEXT_TASK = "https://evolveme.asa.org/task/1383";

let stepNumber, taskID, userID;

$w.onReady(function () {
    ({stepNumber, taskID, userID} = EvolveMe_initialSetup($w("#secondTaskSteps")));

    // FirstStep:
    /**
    *	Adds an event handler that runs when playback has ended.
        [Read more](https://www.wix.com/corvid/reference/$w.VideoPlayer.html#onEnded)
    *	 @param {$w.Event} event
    */
    $w('#stepOneVideo').onEnded(event => stepFinished(event));
    // SecondStep:

    // inјecting userId in CMS, in addition to Form's results
    $w("#wixForms22").setFieldValues({
        user_id: userID
    });

    /**
     *	Adds an event handler that fires when a visitor submits a Wix Form and it is successfully received by the server.
    */
    $w('#wixForms22').onSubmitSuccess(event => stepFinished(event));
    $w('#wixForms23').onSubmitSuccess(event => stepFinished(event));
    $w('#wixForms24').onSubmitSuccess(event => stepFinished(event));
    $w('#signUpButton').onClick(signUpButton_onClick);
    $w('#textPostVideo').onClick(textPostVideo_onClick); // `text620` in the old Wix
    $w('#textStartNewTask').onClick(textStartNewTask_onClick); // `text623` in the old Wix
});

export async function stepFinished(event) {
    await EvolveMe_updateTaskStep(TASK_NO, userID, taskID, stepNumber);
    stepNumber++;
    await EvolveMe_changeStep($w("#secondTaskSteps"), $w("#thankyouText"), $w("#nextStepText"), stepNumber);
}

export async function signUpButton_onClick(event) {
    EvolveMe_signUpButton_onClick($w("#secondTaskSteps"), $w("#txtAlreadyMember"), TASK_NO, userID, taskID, stepNumber);
}

export function textStartNewTask_onClick(event) {
    console.log("[textStartNewTask_onClick] wixLocationFrontend.to", NEXT_TASK);
    wixLocationFrontend.to(NEXT_TASK)
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