import wixLocationFrontend from 'wix-location-frontend';
import { local } from 'wix-storage-frontend';
import wixData from 'wix-data';
import wixUsers from 'wix-users';
import { authentication } from "wix-members-frontend";


// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

$w.onReady(function () {
    // Write your JavaScript here

    // To select an element by ID use: $w('#elementID')

    // Click 'Preview' to run your code
});

/**** SHARED CODE - across pages ****
 * 
 * 👉 REQUIRED HERE b/c Only files within a page’s scope are bundled and available at runtime.
 * That means:
 * Anything outside src/pages/[PageName].*.js is not bundled unless:
 * It's inlined (copy/pasted)
 * Or included in Wix-managed APIs (@wix/*, $w, etc.)
 * */ 

import wixAnimationsFrontend from 'wix-animations-frontend';

export async function animateParallel(animations) {
    const timelines = animations.map(({ element, params }) => {
        const tl = wixAnimationsFrontend.timeline();
        tl.add(element, params);
        return tl;
    });

    timelines.forEach(tl => tl.play());

    await Promise.all(
        timelines.map(tl => new Promise(resolve => tl.onComplete(resolve)))
    );
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**** EVOLVEME CODE ****/

export const stepNames = [undefined, 'FirstStep', 'SecondStep', 'ThirdStep', 'FourthStep', 'FifthStep'];

export function EvolveMe_initialSetup(multiStateBox) {
    // GET THE QUERIES PARAMS FROM THE URL
    let query = wixLocationFrontend.query;
    console.log("QUERY:", query)

    let stepNumber = Number.parseInt(query.step_number);
    let taskID = query.unique_task_key
    let userID = query.user_id
    // `local` is frontend storage, available between sessions - it's basically browser's `localStorage` - so useful here to restore previous task-execution session
    // Store task and user IDs in local storage if they do not already exist
    if (taskID && userID) {
        let storedTasks = local.getItem("completedTasks") ? JSON.parse(local.getItem("completedTasks")) : undefined;
        if (!storedTasks) {
            local.setItem("completedTasks", JSON.stringify({ userID, taskID }))
        }

        // // Check if taskID exists in storedTasks for the userID
        // if (!storedTasks[userID]) {
        //     storedTasks[userID] = [];
        // }

        // // Check if taskID is already stored for the userID
        // if (!storedTasks[userID].includes(taskID)) {
        //     storedTasks[userID].push(taskID);
        //     local.setItem("completedTasks", JSON.stringify(storedTasks));
        //     console.log(`Stored task ${taskID} for user ${userID}`);
        // } else {
        //     console.log(`Task ${taskID} already stored for user ${userID}`);
        // }
    }

    // REDIRECT BASED ON THE STEPS
    if (stepNumber == 1) {
        multiStateBox.changeState(stepNames[stepNumber]);
        multiStateBox.expand()
    } else if (stepNumber >= 2 && stepNumber <=5) {
        multiStateBox.changeState(stepNames[stepNumber])
        setTimeout(() => {
            multiStateBox.expand()
        }, 300);
    } else {
        multiStateBox.changeState(stepNames[1])
        multiStateBox.expand()
    }
    return {stepNumber, taskID, userID};
}

/**
 * 
 * @param {*} userId 
 * @param {*} uniqueTaskKey 
 * @param {*} stepNumber 
 * 
 * sends respond through backend to EvolveMe on user completing the step of the task
 */
export async function EvolveMe_onCompleteTaskStep(userId, uniqueTaskKey, stepNumber) {
    try {
        //TODO: const result = await completeUserTaskStep(userId, uniqueTaskKey, stepNumber);
        console.warn('TO BE IMPLEMENTED: Task step completed:');
        // console.log('Task step completed:', result);
    } catch (error) {
        console.error('Failed to complete task step:', error);
    }
}

export async function EvolveMe_updateTaskStep(taskNo, userIDToUpd, taskIDToUpd, stepNumberToUpd, userEmail = undefined) {
    // MARK THIS STEP AS COMPLETED:
    await EvolveMe_onCompleteTaskStep(userIDToUpd, taskIDToUpd, stepNumberToUpd);

    // let toInsert = {title: taskIDToUpd, userId: userIDToUpd, stepNumber: stepNumberToUpd, completed: true, date: new Date() }
    // let isRecordSaved = await wixData.insert("['task' + taskNo + 'Results']", toInsert)
    // console.log("RECORD SAVED:", isRecordSaved)

    // UPDATE USER ACTIVITES:
    let { items } = await wixData.query("UserActivities").eq("userId", userIDToUpd).find()
    if (items.length > 0) {
        let userObj = items[0]
        userObj['task' + taskNo + 'Id'] = taskIDToUpd
        userObj['task' + taskNo + 'CompletedSteps'] = stepNumberToUpd;
        // the email is provided in the last step so we set `['task' + taskNo + 'Completed']` based on that:
        if(userEmail) {
            userObj.userEmail = userEmail;
            userObj['task' + taskNo + 'Completed'] = true;
        }

        let isUserActivityUpdated = await wixData.update("UserActivities", userObj)
        console.log("USER ACTIVITY UPDATED:", isUserActivityUpdated)
    } else {
        let insertObj = {
            ['task' + taskNo + 'Id']: taskIDToUpd,
            ['task' + taskNo + 'CompletedSteps']: stepNumberToUpd,
            userId: userIDToUpd,
            date: new Date()
        }
        // the email is provided in the last step so we set `['task' + taskNo + 'Completed']` based on that:
        if(userEmail) {
            insertObj['task' + taskNo + 'Completed'] = true;
            insertObj.userEmail = userEmail;
        }

        let isUserActivitySaved = await wixData.insert("UserActivities", insertObj)
        console.log("USER ACTIVITY SAVED:", isUserActivitySaved)
    }
}

export async function EvolveMe_changeStep(multiStateBox, thankyouText, nextStepText, step) {
    thankyouText.text = "Let's keep this show on the road! Stay tuned for what's up next!"
    nextStepText.text = "Starting the next step in 5 seconds.."
    multiStateBox.changeState('Thankyou')

    // Countdown from 4 to 1
    for (let i = 4; i > 0; i--) {
        await delay(1000); // Delay for 1 second
        nextStepText.text = "Starting the next step in " + i + " seconds..";
    }

    // Change state after 10 seconds
    await delay(1000); // Delay for 1 second
    multiStateBox.changeState(stepNames[step]);
    
}

export async function EvolveMe_signUpButton_onClick(multiStateBox, txtAlreadyMember, taskNo, userID, taskID, stepNumber) {
    if (wixUsers.currentUser.loggedIn) {
        txtAlreadyMember.expand();
        const userEmail = await wixUsers.currentUser.getEmail();
        await EvolveMe_updateTaskStep(taskNo, userID, taskID, stepNumber, userEmail);

        setTimeout(() => {
            multiStateBox.changeState('FinalState');
        }, 3000);

    } else {
        authentication
            .promptLogin()
            .then(async () => {
                console.log("Member is logged in");

                const userEmail = await wixUsers.currentUser.getEmail();
                await EvolveMe_updateTaskStep(taskNo, userID, taskID, stepNumber, userEmail);

                multiStateBox.changeState('FinalState');
            })
            .catch((error) => {
                console.error(error);
            });
    }
}