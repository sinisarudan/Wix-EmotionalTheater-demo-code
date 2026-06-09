// student1.js

import wixLocationFrontend from 'wix-location-frontend';
import wixData from 'wix-data';
import { completeUserTaskStep } from 'backend/evolveMeHandlers';
import { authentication } from "wix-members-frontend";
import wixUsers from 'wix-users';
import { local } from 'wix-storage-frontend';

let stepNumber, taskID, userID
const version = "1.0.0";
$w.onReady(async function () {
    console.log("[student1::onReady] Initializing...", version);

    // GET THE QUERIES PARAMS FROM THE URL
    let query = wixLocationFrontend.query;
    console.log("QUERY:", query)

    stepNumber = query.step_number
    taskID = query.unique_task_key
    userID = query.user_id

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
    if (stepNumber == '1') {
        $w("#firstTaskSteps").changeState('FirstStep')
        $w("#firstTaskSteps").expand()
    } else if (stepNumber == '2') {
        $w("#firstTaskSteps").changeState('SecondStep')
        setTimeout(() => {
            $w("#firstTaskSteps").expand()
        }, 300);
    } else if (stepNumber == '3') {
        $w("#firstTaskSteps").changeState('ThirdStep')
        setTimeout(() => {
            $w("#firstTaskSteps").expand()
        }, 300);
    } else if (stepNumber == '4') {
        $w("#firstTaskSteps").changeState('FourthStep')
        setTimeout(() => {
            $w("#firstTaskSteps").expand()
            $w("#section3").expand()
        }, 300);
    } else if (stepNumber == '5') {
        $w("#firstTaskSteps").changeState('FifthStep')
        setTimeout(() => {
            $w("#firstTaskSteps").expand()
        }, 300);
    } else {
        $w("#firstTaskSteps").changeState('FirstStep')
        $w("#firstTaskSteps").expand()
    }
    console.log("onReady finished");
});

async function onCompleteTaskStep(userId, uniqueTaskKey, stepNumber) {
    console.log(`[STUDENT1:onCompleteTaskStep(${userId}, ${uniqueTaskKey}, ${stepNumber})`)
    try {
        const result = await completeUserTaskStep(userId, uniqueTaskKey, stepNumber);
        console.log('Task step completed:', result);
    } catch (error) {
        console.error('Failed to complete task step:', error);
    }
}

/**
*	Adds an event handler that runs when playback has ended.
	[Read more](https://www.wix.com/corvid/reference/$w.VideoPlayer.html#onEnded)
*	 @param {$w.Event} event
*/
$w('#stepOneVideo').onEnded(async (event) => {
    console.log("[STUDENT1:stepOneVideo_ended", event);

    // MARK THIS STEP AS COMPLETED
    await onCompleteTaskStep(userID, taskID, stepNumber);

    let toInsert = {
        title: taskID,
        userId: userID,
        stepNumber,
        completed: true
    }

    // let isRecordSaved = await wixData.insert("Task1Results", toInsert)
    // console.log("RECORD SAVED:", isRecordSaved)

    let { items } = await wixData.query("UserActivities").eq("userId", userID).find()
    if (items.length > 0) {
        let userObj = items[0]
        userObj.task1Id = taskID
        userObj.task1CompletedSteps = '1'

        let isUserActivityUpdated = await wixData.update("UserActivities", userObj)
        console.log("[STUDENT1:stepOneVideo_ended] USER ACTIVITY UPDATED:", isUserActivityUpdated)
    } else {
        // UPDATE USER ACTIVITIES
        let insertObj = {
            task1Id: taskID,
            userId: userID,
            task1CompletedSteps: '1',
            date: new Date()
        }

        let isUserActivitySaved = await wixData.insert("UserActivities", insertObj)
        console.log("USER ACTIVITY SAVED:", isUserActivitySaved)
    }

    $w("#thankyouText").text = "Let's keep this show on the road! Stay tuned for what's up next!"
    $w("#nextStepText").text = "Starting the next step in 5 seconds.."
    $w("#firstTaskSteps").changeState('Thankyou')

    // Countdown from 4 to 1
    for (let i = 4; i > 0; i--) {
        await delay(1000); // Delay for 1 second
        $w("#nextStepText").text = "Starting the next step in " + i + " seconds..";
    }

    // Change state after 10 seconds
    await delay(1000); // Delay for 1 second
    $w("#firstTaskSteps").changeState('SecondStep');
    stepNumber = '2'

});

/**
 *	Adds an event handler that fires when a visitor submits a Wix Form and it is successfully received by the server.
 */
$w('#wixForms11').onWixFormSubmitted(async (event) => {
    console.log("[STUDENT1:wixForms11_wixFormSubmitted", event);
    // This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
    // Add your code for this event here: 
    // MARK THIS STEP AS COMPLETED
    await onCompleteTaskStep(userID, taskID, stepNumber);

    let toInsert = {
        title: taskID,
        userId: userID,
        stepNumber,
        completed: true,
        date: new Date()
    }

    // let isRecordSaved = await wixData.insert("Task1Results", toInsert)
    // console.log("RECORD SAVED:", isRecordSaved)

    // UPDATE USER ACTIVITES
    let { items } = await wixData.query("UserActivities").eq("userId", userID).find()
    if (items.length > 0) {
        let userObj = items[0]
        userObj.task1Id = taskID
        userObj.task1CompletedSteps = '2'

        let isUserActivityUpdated = await wixData.update("UserActivities", userObj)
        console.log("[STUDENT1:wixForms11_wixFormSubmitted] USER ACTIVITY UPDATED:", isUserActivityUpdated)
    } else {
        let insertObj = {
            task1Id: taskID,
            userId: userID,
            task1CompletedSteps: '2',
            date: new Date()
        }

        let isUserActivitySaved = await wixData.insert("UserActivities", insertObj)
        console.log("USER ACTIVITY SAVED:", isUserActivitySaved)
    }

    $w("#thankyouText").text = "Let's keep this show on the road! Stay tuned for what's up next!"
    $w("#nextStepText").text = "Starting the next step in 5 seconds.."
    $w("#firstTaskSteps").changeState('Thankyou')

    // Countdown from 5 to 1
    for (let i = 5; i > 0; i--) {
        await delay(1000); // Delay for 1 second
        $w("#nextStepText").text = "Starting the next step in " + i + " seconds..";
    }

    // Change state after 10 seconds
    await delay(1000); // Delay for 1 second
    $w("#firstTaskSteps").changeState('ThirdStep');
    stepNumber = '3'
});

/**
 *	Adds an event handler that fires when a visitor submits a Wix Form and it is successfully received by the server.
 */
$w('#wixForms12').onWixFormSubmitted(async (event) => {
    // This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
    // Add your code for this event here: 
    // MARK THIS STEP AS COMPLETED
    await onCompleteTaskStep(userID, taskID, stepNumber);

    let toInsert = {
        title: taskID,
        userId: userID,
        stepNumber,
        completed: true,
        date: new Date()
    }

    // let isRecordSaved = await wixData.insert("Task1Results", toInsert)
    // console.log("RECORD SAVED:", isRecordSaved)

    // UPDATE USER ACTIVITES
    let { items } = await wixData.query("UserActivities").eq("userId", userID).find()
    if (items.length > 0) {
        let userObj = items[0]
        userObj.task1Id = taskID
        userObj.task1CompletedSteps = '3'

        let isUserActivityUpdated = await wixData.update("UserActivities", userObj)
        console.log("[STUDENT1:wixForms12_wixFormSubmitted] USER ACTIVITY UPDATED:", isUserActivityUpdated)
    } else {
        let insertObj = {
            task1Id: taskID,
            userId: userID,
            task1CompletedSteps: '3',
            date: new Date()
        }

        let isUserActivitySaved = await wixData.insert("UserActivities", insertObj)
        console.log("USER ACTIVITY SAVED:", isUserActivitySaved)
    }

    $w("#thankyouText").text = "Let's keep this show on the road! Stay tuned for what's up next!"
    $w("#nextStepText").text = "Starting the next step in 5 seconds.."
    $w("#firstTaskSteps").changeState('Thankyou')

    // Countdown from 5 to 1
    for (let i = 5; i > 0; i--) {
        await delay(1000); // Delay for 1 second
        $w("#nextStepText").text = "Starting the next step in " + i + " seconds..";
    }

    // Change state after 10 seconds
    await delay(1000); // Delay for 1 second
    $w("#firstTaskSteps").changeState('FourthStep');
    stepNumber = '4'
})

/**
 *	Adds an event handler that fires when a visitor submits a Wix Form and it is successfully received by the server.
 */
$w('#wixForms13').onWixFormSubmitted(async (event) => {
    // This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
    // Add your code for this event here: 
    // MARK THIS STEP AS COMPLETED
    await onCompleteTaskStep(userID, taskID, stepNumber);

    let toInsert = {
        title: taskID,
        userId: userID,
        stepNumber,
        completed: true,
        date: new Date()
    }

    // let isRecordSaved = await wixData.insert("Task1Results", toInsert)
    // console.log("RECORD SAVED:", isRecordSaved)

    // UPDATE USER ACTIVITES
    let { items } = await wixData.query("UserActivities").eq("userId", userID).find()
    if (items.length > 0) {
        let userObj = items[0]
        userObj.task1Id = taskID
        userObj.task1CompletedSteps = '4'

        let isUserActivityUpdated = await wixData.update("UserActivities", userObj)
        console.log("[STUDENT1:wixForms13_wixFormSubmitted] USER ACTIVITY UPDATED:", isUserActivityUpdated)
    } else {
        let insertObj = {
            task1Id: taskID,
            userId: userID,
            task1CompletedSteps: '4',
            date: new Date()
        }

        let isUserActivitySaved = await wixData.insert("UserActivities", insertObj)
        console.log("USER ACTIVITY SAVED:", isUserActivitySaved)
    }

    $w("#thankyouText").text = "Let's keep this show on the road! Stay tuned for what's up next!"
    $w("#nextStepText").text = "Starting the next step in 5 seconds.."
    $w("#firstTaskSteps").changeState('Thankyou')

    // Countdown from 5 to 1
    for (let i = 5; i > 0; i--) {
        await delay(1000); // Delay for 1 second
        $w("#nextStepText").text = "Starting the next step in " + i + " seconds..";
    }

    // Change state after 10 seconds
    await delay(1000); // Delay for 1 second
    $w("#firstTaskSteps").changeState('FifthStep');
    stepNumber = '5'
})

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
$w('#signUpButton').onClick(async (event) => {
    if (wixUsers.currentUser.loggedIn) {

        // MARK THIS STEP AS COMPLETED
        await onCompleteTaskStep(userID, taskID, stepNumber);

        let toInsert = {
            title: taskID,
            userId: userID,
            stepNumber,
            completed: true,
            date: new Date()
        }

        // let isRecordSaved = await wixData.insert("Task1Results", toInsert)
        // console.log("RECORD SAVED:", isRecordSaved)

        // UPDATE MEMBER REFERENCE
        // let { items: allItems } = await wixData.query("Task1Results").eq("title", taskID).find()
        // allItems.forEach(async (item) => {
        //     item.memberReference = wixUsers.currentUser.id

        //     await wixData.update("Task1Results", item)
        // })

        // UPDATE USER ACTIVITES
        let { items } = await wixData.query("UserActivities").eq("userId", userID).find()
        if (items.length > 0) {
            let userObj = items[0]
            userObj.task1Id = taskID
            userObj.task1CompletedSteps = '5'
            userObj.task1Completed = true
            userObj.userEmail = await wixUsers.currentUser.getEmail()

            let isUserActivityUpdated = await wixData.update("UserActivities", userObj)
            console.log("[STUDENT1:signUpButton_click <wixUsers.currentUser.loggedIn === true>] USER ACTIVITY UPDATED:", isUserActivityUpdated)
        } else {
            let insertObj = {
                task1Id: taskID,
                userId: userID,
                task1CompletedSteps: '5',
                task1Completed: true,
                userEmail: await wixUsers.currentUser.getEmail(),
                date: new Date()
            }

            let isUserActivitySaved = await wixData.insert("UserActivities", insertObj)
            console.log("USER ACTIVITY SAVED:", isUserActivitySaved)
        }

        setTimeout(() => {
            $w("#firstTaskSteps").changeState('FinalState');
        }, 3000)

    } else {
        authentication
            .promptLogin()
            .then(async () => {
                console.log("Member is logged in");

                // MARK THIS STEP AS COMPLETED
                await onCompleteTaskStep(userID, taskID, stepNumber);

                let toInsert = {
                    title: taskID,
                    userId: userID,
                    stepNumber,
                    completed: true,
                    date: new Date()
                }

                // let isRecordSaved = await wixData.insert("Task1Results", toInsert)
                // console.log("RECORD SAVED:", isRecordSaved)

                $w("#firstTaskSteps").changeState('FinalState');

                // // UPDATE MEMBER REFERENCE
                // let { items: allItems } = await wixData.query("Task1Results").eq("title", taskID).find()
                // allItems.forEach(async (item) => {
                //     item.memberReference = wixUsers.currentUser.id

                //     await wixData.update("Task1Results", item)
                // })
                // UPDATE USER ACTIVITES
                let { items } = await wixData.query("UserActivities").eq("userId", userID).find()
                if (items.length > 0) {
                    let userObj = items[0]
                    userObj.task1Id = taskID
                    userObj.task1CompletedSteps = '5'
                    userObj.task1Completed = true
                    userObj.userEmail = await wixUsers.currentUser.getEmail()

                    let isUserActivityUpdated = await wixData.update("UserActivities", userObj)
                    console.log("[STUDENT1:signUpButton_click <wixUsers.currentUser.loggedIn === false>] USER ACTIVITY UPDATED:", isUserActivityUpdated)
                } else {
                    let insertObj = {
                        task1Id: taskID,
                        userId: userID,
                        task1CompletedSteps: '5',
                        task1Completed: true,
                        userEmail: await wixUsers.currentUser.getEmail(),
                        date: new Date()
                    }

                    let isUserActivitySaved = await wixData.insert("UserActivities", insertObj)
                    console.log("USER ACTIVITY SAVED:", isUserActivitySaved)
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

});

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
$w('#text623').onClick((event) => {
    // This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
    // Add your code for this event here: 
    wixLocationFrontend.to("https://evolveme.asa.org/task/1382")
})

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
$w('#text620').onClick((event) => {
    // This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
    // Add your code for this event here: 
    $w("#section3").expand()
    $w("#section3").scrollTo()
})