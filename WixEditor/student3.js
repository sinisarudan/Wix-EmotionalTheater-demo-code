// student3.js

import wixLocationFrontend from 'wix-location-frontend';
import wixData from 'wix-data';
import { completeUserTaskStep } from 'backend/evolveMeHandlers';
import { authentication } from "wix-members-frontend";
import wixUsers from 'wix-users';
import { local } from 'wix-storage-frontend';

let stepNumber, taskID, userID
const version = "1.0.0";
$w.onReady(function () {
    console.log("[student3::onReady] Initializing...", version);

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
        $w("#thirdTaskSteps").changeState('FirstStep')
        $w("#thirdTaskSteps").expand()
    } else if (stepNumber == '2') {
        $w("#thirdTaskSteps").changeState('SecondStep')
        setTimeout(() => {
            $w("#thirdTaskSteps").expand()
        }, 300);
    } else if (stepNumber == '3') {
        $w("#thirdTaskSteps").changeState('ThirdStep')
        setTimeout(() => {
            $w("#thirdTaskSteps").expand()
        }, 300);
    } else if (stepNumber == '4') {
        $w("#thirdTaskSteps").changeState('FourthStep')
        setTimeout(() => {
            $w("#thirdTaskSteps").expand()
            $w("#section4").expand()
        }, 300);
    } else if (stepNumber == '5') {
        $w("#thirdTaskSteps").changeState('FifthStep')
        setTimeout(() => {
            $w("#thirdTaskSteps").expand()
        }, 300);
    } else {
        $w("#thirdTaskSteps").changeState('FirstStep')
        $w("#thirdTaskSteps").expand()
    }

});

async function onCompleteTaskStep(userId, uniqueTaskKey, stepNumber) {
    console.log(`[STUDENT3:Called onCompleteTaskStep(${userId}, ${uniqueTaskKey}, ${stepNumber})`)
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

/**
*	Adds an event handler that runs when playback has ended.
	[Read more](https://www.wix.com/corvid/reference/$w.VideoPlayer.html#onEnded)
*	 @param {$w.Event} event
*/
$w('#stepOneVideo').onEnded(async (event) => {
    console.log("[STUDENT3:stepOneVideo_ended", event);
    await onCompleteTaskStep(userID, taskID, stepNumber);

    let toInsert = {
        title: taskID,
        userId: userID,
        stepNumber,
        completed: true,
        date: new Date()
    }

    // let isRecordSaved = await wixData.insert("Task3Results", toInsert)
    // console.log("RECORD SAVED:", isRecordSaved)

    // UPDATE USER ACTIVITES
    let { items } = await wixData.query("UserActivities").eq("userId", userID).find()
    if (items.length > 0) {
        let userObj = items[0]
        userObj.task3Id = taskID
        userObj.task3CompletedSteps = '1'

        let isUserActivityUpdated = await wixData.update("UserActivities", userObj)
        console.log("[STUDENT3:stepOneVideo_ended] USER ACTIVITY UPDATED:", isUserActivityUpdated)
    } else {
        let insertObj = {
            task3Id: taskID,
            userId: userID,
            task3CompletedSteps: '1',
            date: new Date()
        }

        let isUserActivitySaved = await wixData.insert("UserActivities", insertObj)
        console.log("USER ACTIVITY SAVED:", isUserActivitySaved)
    }

    $w("#thankyouText").text = "Let's keep this show on the road! Stay tuned for what's up next!"
    $w("#nextStepText").text = "Starting the next step in 5 seconds.."
    $w("#thirdTaskSteps").changeState('Thankyou')

    // Countdown from 5 to 1
    for (let i = 5; i > 0; i--) {
        await delay(1000); // Delay for 1 second
        $w("#nextStepText").text = "Starting the next step in " + i + " seconds..";
    }

    // Change state after 10 seconds
    await delay(1000); // Delay for 1 second
    $w("#thirdTaskSteps").changeState('SecondStep');
    stepNumber = '2'
});

/**
 *	Adds an event handler that fires when a visitor submits a Wix Form and it is successfully received by the server.
 */
$w('#wixForms1').onWixFormSubmitted(async () => {
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

    // let isRecordSaved = await wixData.insert("Task3Results", toInsert)
    // console.log("RECORD SAVED:", isRecordSaved)

    // UPDATE USER ACTIVITIES
    let { items } = await wixData.query("UserActivities").eq("userId", userID).find()
    if (items.length > 0) {
        let userObj = items[0]
        userObj.task3Id = taskID
        userObj.task3CompletedSteps = '2'

        let isUserActivityUpdated = await wixData.update("UserActivities", userObj)
        console.log("[STUDENT3:wixForms1_wixFormSubmitted] USER ACTIVITY UPDATED:", isUserActivityUpdated)
    } else {
        let insertObj = {
            task3Id: taskID,
            userId: userID,
            task3CompletedSteps: '2',
            date: new Date()
        }

        let isUserActivitySaved = await wixData.insert("UserActivities", insertObj)
        console.log("USER ACTIVITY SAVED:", isUserActivitySaved)
    }

    $w("#thankyouText").text = "Let's keep this show on the road! Stay tuned for what's up next!"
    $w("#nextStepText").text = "Starting the next step in 5 seconds.."
    $w("#thirdTaskSteps").changeState('Thankyou')

    // Countdown from 5 to 1
    for (let i = 5; i > 0; i--) {
        await delay(1000); // Delay for 1 second
        $w("#nextStepText").text = "Starting the next step in " + i + " seconds..";
    }

    // Change state after 10 seconds
    await delay(1000); // Delay for 1 second
    $w("#thirdTaskSteps").changeState('ThirdStep');
    stepNumber = '3'
});

/**
 *	Adds an event handler that fires when a visitor submits a Wix Form and it is successfully received by the server.
 */
$w('#wixForms6').onWixFormSubmitted(async () => {
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

    // let isRecordSaved = await wixData.insert("Task3Results", toInsert)
    // console.log("RECORD SAVED:", isRecordSaved)

    // UPDATE USER ACTIVITES
    let { items } = await wixData.query("UserActivities").eq("userId", userID).find()
    if (items.length > 0) {
        let userObj = items[0]
        userObj.task3Id = taskID
        userObj.task3CompletedSteps = '3'

        let isUserActivityUpdated = await wixData.update("UserActivities", userObj)
        console.log("[STUDENT3:wixForms6_wixFormSubmitted] USER ACTIVITY UPDATED:", isUserActivityUpdated)
    } else {
        let insertObj = {
            task3Id: taskID,
            userId: userID,
            task3CompletedSteps: '3',
            date: new Date()
        }

        let isUserActivitySaved = await wixData.insert("UserActivities", insertObj)
        console.log("USER ACTIVITY SAVED:", isUserActivitySaved)
    }

    $w("#thankyouText").text = "Let's keep this show on the road! Stay tuned for what's up next!"
    $w("#nextStepText").text = "Starting the next step in 5 seconds.."
    $w("#thirdTaskSteps").changeState('Thankyou')

    // Countdown from 9 to 1
    for (let i = 5; i > 0; i--) {
        await delay(1000); // Delay for 1 second
        $w("#nextStepText").text = "Starting the next step in " + i + " seconds..";
    }

    // Change state after 10 seconds
    await delay(1000); // Delay for 1 second
    $w("#thirdTaskSteps").changeState('FourthStep');
    stepNumber = '4'
});

/**
 *	Adds an event handler that fires when a visitor submits a Wix Form and it is successfully received by the server.
 */
$w('#wixForms7').onWixFormSubmitted(async () => {
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

    // let isRecordSaved = await wixData.insert("Task3Results", toInsert)
    // console.log("RECORD SAVED:", isRecordSaved)

    // UPDATE USER ACTIVITES
    let { items } = await wixData.query("UserActivities").eq("userId", userID).find()
    if (items.length > 0) {
        let userObj = items[0]
        userObj.task3Id = taskID
        userObj.task3CompletedSteps = '4'

        let isUserActivityUpdated = await wixData.update("UserActivities", userObj)
        console.log("[STUDENT3:wixForms7_wixFormSubmitted] USER ACTIVITY UPDATED:", isUserActivityUpdated)
    } else {
        let insertObj = {
            task3Id: taskID,
            userId: userID,
            task3CompletedSteps: '4',
            date: new Date()
        }

        let isUserActivitySaved = await wixData.insert("UserActivities", insertObj)
        console.log("USER ACTIVITY SAVED:", isUserActivitySaved)
    }

    $w("#thankyouText").text = "Let's keep this show on the road! Stay tuned for what's up next!"
    $w("#nextStepText").text = "Starting the next step in 5 seconds.."
    $w("#thirdTaskSteps").changeState('Thankyou')

    // Countdown from 9 to 1
    for (let i = 5; i > 0; i--) {
        await delay(1000); // Delay for 1 second
        $w("#nextStepText").text = "Starting the next step in " + i + " seconds..";
    }

    // Change state after 10 seconds
    await delay(1000); // Delay for 1 second
    $w("#thirdTaskSteps").changeState('FifthStep');
    stepNumber = '5'
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

        // let isRecordSaved = await wixData.insert("Task3Results", toInsert)
        // console.log("RECORD SAVED:", isRecordSaved)

        // UPDATE MEMBER REFERENCE
        // let { items: allItems } = await wixData.query("Task3Results").eq("title", taskID).find()
        // allItems.forEach(async (item) => {
        //     item.memberReference = wixUsers.currentUser.id

        //     await wixData.update("Task3Results", item)
        // })

        // UPDATE USER ACTIVITES
        let { items } = await wixData.query("UserActivities").eq("userId", userID).find()
        if (items.length > 0) {
            let userObj = items[0]
            userObj.task3Id = taskID
            userObj.task3CompletedSteps = '5'
            userObj.task3Completed = true
            userObj.userEmail = await wixUsers.currentUser.getEmail()

            let isUserActivityUpdated = await wixData.update("UserActivities", userObj)
            console.log("[STUDENT3:signUpButton_click <wixUsers.currentUser.loggedIn === true>] USER ACTIVITY UPDATED:", isUserActivityUpdated)
        } else {
            let insertObj = {
                task3Id: taskID,
                userId: userID,
                task3CompletedSteps: '5',
                task3Completed: true,
                userEmail: await wixUsers.currentUser.getEmail(),
                date: new Date()
            }

            let isUserActivitySaved = await wixData.insert("UserActivities", insertObj)
            console.log("USER ACTIVITY SAVED:", isUserActivitySaved)
        }

        setTimeout(() => {
            $w("#thirdTaskSteps").changeState('FinalState');
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

                // let isRecordSaved = await wixData.insert("Task3Results", toInsert)
                // console.log("RECORD SAVED:", isRecordSaved)

                $w("#thirdTaskSteps").changeState('FinalState');

                // // UPDATE MEMBER REFERENCE
                // let { items: allItems } = await wixData.query("Task3Results").eq("title", taskID).find()
                // allItems.forEach(async (item) => {
                //     item.memberReference = wixUsers.currentUser.id

                //     await wixData.update("Task3Results", item)
                // })

                // UPDATE USER ACTIVITIES
                let { items } = await wixData.query("UserActivities").eq("userId", userID).find()
                if (items.length > 0) {
                    let userObj = items[0]
                    userObj.task3Id = taskID
                    userObj.task3CompletedSteps = '5'
                    userObj.task3Completed = true
                    userObj.userEmail = await wixUsers.currentUser.getEmail()

                    let isUserActivityUpdated = await wixData.update("UserActivities", userObj)
                    console.log("[STUDENT3:signUpButton_click <wixUsers.currentUser.loggedIn === false>] USER ACTIVITY UPDATED:", isUserActivityUpdated)
                } else {
                    let insertObj = {
                        task3Id: taskID,
                        userId: userID,
                        task3CompletedSteps: '5',
                        task3Completed: true,
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

$w('#text620').onClick((event) => {
    // This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
    // Add your code for this event here: 
    $w("#section4").expand()
    $w("#section4").scrollTo()
});

$w('#text630').onClick((event) => {
    // This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
    // Add your code for this event here: 
    wixLocationFrontend.to("https://evolveme.asa.org/task/1381")
});