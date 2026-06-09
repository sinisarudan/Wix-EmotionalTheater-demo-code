// student2.js

import wixLocationFrontend from 'wix-location-frontend';
import wixData from 'wix-data';
import { completeUserTaskStep } from 'backend/evolveMeHandlers';
import wixUsers from 'wix-users';
import { authentication } from "wix-members-frontend";
import { local } from 'wix-storage-frontend';

let stepNumber, taskID, userID
const version = "1.0.0";
$w.onReady(function () {
    console.log("[student2::onReady] Initializing...", version);

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
        $w("#secondTaskSteps").changeState('FirstStep')
        $w("#secondTaskSteps").expand()
    } else if (stepNumber == '2') {
        $w("#secondTaskSteps").changeState('SecondStep')
        setTimeout(() => {
            $w("#secondTaskSteps").expand()
        }, 300);
    } else if (stepNumber == '3') {
        $w("#secondTaskSteps").changeState('ThirdStep')
        setTimeout(() => {
            $w("#secondTaskSteps").expand()
        }, 300);
    } else if (stepNumber == '4') {
        $w("#secondTaskSteps").changeState('FourthStep')
        setTimeout(() => {
            $w("#secondTaskSteps").expand()
            $w("#section3").expand()
        }, 300);
    } else if (stepNumber == '5') {
        $w("#secondTaskSteps").changeState('FifthStep')
        setTimeout(() => {
            $w("#secondTaskSteps").expand()
        }, 300);
    } else {
        $w("#secondTaskSteps").changeState('FirstStep')
        $w("#secondTaskSteps").expand()
    }

});

async function onCompleteTaskStep(userId, uniqueTaskKey, stepNumber) {
    console.log(`[STUDENT2:onCompleteTaskStep(${userId}, ${uniqueTaskKey}, ${stepNumber})`)
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
    console.log("[STUDENT2:stepOneVideo_ended", event);
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

    // let isRecordSaved = await wixData.insert("Task2Results", toInsert)
    // console.log("RECORD SAVED:", isRecordSaved)

    // UPDATE USER ACTIVITES
    let { items } = await wixData.query("UserActivities").eq("userId", userID).find()
    if (items.length > 0) {
        let userObj = items[0]
        userObj.task2Id = taskID
        userObj.task2CompletedSteps = '1'

        let isUserActivityUpdated = await wixData.update("UserActivities", userObj)
        console.log("[STUDENT2:stepOneVideo_ended] USER ACTIVITY UPDATED:", isUserActivityUpdated)
    } else {
        let insertObj = {
            task2Id: taskID,
            userId: userID,
            task2CompletedSteps: '1',
            date: new Date()
        }

        let isUserActivitySaved = await wixData.insert("UserActivities", insertObj)
        console.log("USER ACTIVITY SAVED:", isUserActivitySaved)
    }

    $w("#thankyouText").text = "Let's keep this show on the road! Stay tuned for what's up next!"
    $w("#nextStepText").text = "Starting the next step in 5 seconds.."
    $w("#secondTaskSteps").changeState('Thankyou')

    // Countdown from 5 to 1
    for (let i = 4; i > 0; i--) {
        await delay(1000); // Delay for 1 second
        $w("#nextStepText").text = "Starting the next step in " + i + " seconds..";
    }

    // Change state after 10 seconds
    await delay(1000); // Delay for 1 second
    $w("#secondTaskSteps").changeState('SecondStep');
    stepNumber = '2'
});

/**
 *	Adds an event handler that fires when a visitor submits a Wix Form and it is successfully received by the server.
 */
$w('#wixForms1').onWixFormSubmitted(async (event) => {
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

    // let isRecordSaved = await wixData.insert("Task2Results", toInsert)
    // console.log("RECORD SAVED:", isRecordSaved)

    // UPDATE USER ACTIVITES
    let { items } = await wixData.query("UserActivities").eq("userId", userID).find()
    if (items.length > 0) {
        let userObj = items[0]
        userObj.task2Id = taskID
        userObj.task2CompletedSteps = '2'

        let isUserActivityUpdated = await wixData.update("UserActivities", userObj)
        console.log("[STUDENT2:wixForms1_wixFormSubmitted] USER ACTIVITY UPDATED:", isUserActivityUpdated)
    } else {
        let insertObj = {
            task2Id: taskID,
            userId: userID,
            task2CompletedSteps: '2',
            date: new Date()
        }

        let isUserActivitySaved = await wixData.insert("UserActivities", insertObj)
        console.log("USER ACTIVITY SAVED:", isUserActivitySaved)
    }

    $w("#thankyouText").text = "Let's keep this show on the road! Stay tuned for what's up next!"
    $w("#nextStepText").text = "Starting the next step in 5 seconds.."
    $w("#secondTaskSteps").changeState('Thankyou')

    // Countdown from 4 to 1
    for (let i = 4; i > 0; i--) {
        await delay(1000); // Delay for 1 second
        $w("#nextStepText").text = "Starting the next step in " + i + " seconds..";
    }

    // Change state after 10 seconds
    await delay(1000); // Delay for 1 second
    $w("#secondTaskSteps").changeState('ThirdStep');
    stepNumber = '3'
});

/**
 *	Adds an event handler that fires when a visitor submits a Wix Form and it is successfully received by the server.
 */

$w('#wixForms4').onWixFormSubmitted(async (event) => {
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

    // let isRecordSaved = await wixData.insert("Task2Results", toInsert)
    // console.log("RECORD SAVED:", isRecordSaved)

    // UPDATE USER ACTIVITES
    let { items } = await wixData.query("UserActivities").eq("userId", userID).find()
    if (items.length > 0) {
        let userObj = items[0]
        userObj.task2Id = taskID
        userObj.task2CompletedSteps = '3'

        let isUserActivityUpdated = await wixData.update("UserActivities", userObj)
        console.log("[STUDENT2:wixForms4_wixFormSubmitted] USER ACTIVITY UPDATED:", isUserActivityUpdated)
    } else {
        let insertObj = {
            task2Id: taskID,
            userId: userID,
            task2CompletedSteps: '3',
            date: new Date()
        }

        let isUserActivitySaved = await wixData.insert("UserActivities", insertObj)
        console.log("USER ACTIVITY SAVED:", isUserActivitySaved)
    }

    $w("#thankyouText").text = "Let's keep this show on the road! Stay tuned for what's up next!"
    $w("#nextStepText").text = "Starting the next step in 5 seconds.."
    $w("#secondTaskSteps").changeState('Thankyou')

    // Countdown from 9 to 1
    for (let i = 4; i > 0; i--) {
        await delay(1000); // Delay for 1 second
        $w("#nextStepText").text = "Starting the next step in " + i + " seconds..";
    }

    // Change state after 10 seconds
    await delay(1000); // Delay for 1 second
    $w("#secondTaskSteps").changeState('FourthStep');
    stepNumber = '4'
});

/**
 *	Adds an event handler that fires when a visitor submits a Wix Form and it is successfully received by the server.
 */
$w('#wixForms5').onWixFormSubmitted(async (event) => {
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

    // let isRecordSaved = await wixData.insert("Task2Results", toInsert)
    // console.log("RECORD SAVED:", isRecordSaved)

    // UPDATE USER ACTIVITES
    let { items } = await wixData.query("UserActivities").eq("userId", userID).find()
    if (items.length > 0) {
        let userObj = items[0]
        userObj.task2Id = taskID
        userObj.task2CompletedSteps = '4'

        let isUserActivityUpdated = await wixData.update("UserActivities", userObj)
        console.log("[STUDENT2:wixForms5_wixFormSubmitted] USER ACTIVITY UPDATED:", isUserActivityUpdated)
    } else {
        let insertObj = {
            task2Id: taskID,
            userId: userID,
            task2CompletedSteps: '4',
            date: new Date()
        }

        let isUserActivitySaved = await wixData.insert("UserActivities", insertObj)
        console.log("USER ACTIVITY SAVED:", isUserActivitySaved)
    }

    $w("#thankyouText").text = "Let's keep this show on the road! Stay tuned for what's up next!"
    $w("#nextStepText").text = "Starting the next step in 5 seconds.."
    $w("#secondTaskSteps").changeState('Thankyou')

    // Countdown from 4 to 1
    for (let i = 4; i > 0; i--) {
        await delay(1000); // Delay for 1 second
        $w("#nextStepText").text = "Starting the next step in " + i + " seconds..";
    }

    // Change state after 10 seconds
    await delay(1000); // Delay for 1 second
    $w("#secondTaskSteps").changeState('FifthStep');
    stepNumber = '5'
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

$w('#signUpButton').onClick(async (event) => {
    if (wixUsers.currentUser.loggedIn) {
        $w("#text624").expand()
        // MARK THIS STEP AS COMPLETED
        await onCompleteTaskStep(userID, taskID, stepNumber);

        let toInsert = {
            title: taskID,
            userId: userID,
            stepNumber,
            completed: true,
            date: new Date()
        }

        // let isRecordSaved = await wixData.insert("Task2Results", toInsert)
        // console.log("RECORD SAVED:", isRecordSaved)

        // // UPDATE MEMBER REFERENCE
        // let { items: allItems } = await wixData.query("Task2Results").eq("title", taskID).find()
        // allItems.forEach(async (item) => {
        //     item.memberReference = wixUsers.currentUser.id

        //     await wixData.update("Task2Results", item)
        // })

        // UPDATE USER ACTIVITES
        let { items } = await wixData.query("UserActivities").eq("userId", userID).find()
        if (items.length > 0) {
            let userObj = items[0]
            userObj.task2Id = taskID
            userObj.task2CompletedSteps = '5'
            userObj.task2Completed = true
            userObj.userEmail = await wixUsers.currentUser.getEmail()

            let isUserActivityUpdated = await wixData.update("UserActivities", userObj)
            console.log("[STUDENT2:signUpButton_click <wixUsers.currentUser.loggedIn === true>] USER ACTIVITY UPDATED:", isUserActivityUpdated)
        } else {
            let insertObj = {
                task2Id: taskID,
                userId: userID,
                task2CompletedSteps: '5',
                task2Completed: true,
                userEmail: await wixUsers.currentUser.getEmail(),
                date: new Date()
            }

            let isUserActivitySaved = await wixData.insert("UserActivities", insertObj)
            console.log("USER ACTIVITY SAVED:", isUserActivitySaved)
        }

        setTimeout(() => {
            $w("#secondTaskSteps").changeState('FinalState');
        }, 3000);

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

                // let isRecordSaved = await wixData.insert("Task2Results", toInsert)
                // console.log("RECORD SAVED:", isRecordSaved)

                $w("#secondTaskSteps").changeState('FinalState');

                // // UPDATE MEMBER REFERENCE
                // let { items: allItems } = await wixData.query("Task2Results").eq("title", taskID).find()
                // allItems.forEach(async (item) => {
                //     item.memberReference = wixUsers.currentUser.id

                //     await wixData.update("Task2Results", item)
                // })

                // UPDATE USER ACTIVITES
                let { items } = await wixData.query("UserActivities").eq("userId", userID).find()
                if (items.length > 0) {
                    let userObj = items[0]
                    userObj.task2Id = taskID
                    userObj.task2CompletedSteps = '5'
                    userObj.task2Completed = true
                    userObj.userEmail = await wixUsers.currentUser.getEmail()

                    let isUserActivityUpdated = await wixData.update("UserActivities", userObj)
                    console.log("[STUDENT2:signUpButton_click <wixUsers.currentUser.loggedIn === false>] USER ACTIVITY UPDATED:", isUserActivityUpdated)
                } else {
                    let insertObj = {
                        task2Id: taskID,
                        userId: userID,
                        task2CompletedSteps: '5',
                        task2Completed: true,
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

$w('#text623').onClick((event) => {
    // This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
    // Add your code for this event here: 
    wixLocationFrontend.to("https://evolveme.asa.org/task/1383")
});

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
$w('#text620').onClick((event) => {
    // This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
    // Add your code for this event here: 
    $w("#section4").expand()
    $w("#section4").scrollTo()
});