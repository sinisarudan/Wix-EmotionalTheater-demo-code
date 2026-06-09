// masterPage.js

import wixLocationFrontend from 'wix-location-frontend';
import wixData from 'wix-data';
import { completeUserTaskStep } from 'backend/evolveMeHandlers';
import { authentication } from "wix-members-frontend";
import wixUsers from 'wix-users';
import { local } from 'wix-storage-frontend';
import { myGetContactFunction, notifyAdminHandler, notifyPartnerHandler } from "backend/utils.jsw";

let stepNumber, taskID, userID, isReferral = false,
	partnerId, programLabel = "onlinePrograms.high-eq-workplace-culture-emotions101-3-500yr"

/*
// For SizeDetector.js (Custom Element)
// Listen to the custom element site-wide
function resizeCustomElement () {
	console.log("[masterPage::resizeCustomElement] $w('#resizeCustomElement')", $w('#resizeCustomElement'))
	$w('#resizeCustomElement').on('changed', (e) => {
		console.log('[masterPage::resizeWatcher]', e.detail);
	});
}
*/


$w.onReady(async function () {
	// resizeCustomElement();
	// GET THE QUERIES PARAMS FROM THE URL
	let query = wixLocationFrontend.query;
	let path = wixLocationFrontend.path
	console.log("[masterPage::onReady] query:", query)
	console.log("[masterPage::onReady] path:", path)

	if (path.includes("challenge-thanks") && path.includes("0996695a-3ee4-4a0c-8c3b-8209bd8e9b74")) {

		let referralData = local.getItem("partnerRefferal") ? JSON.parse(local.getItem("partnerRefferal")) : undefined;

		// GET PARTNER DETAILS 
		let { items: partnerDetails } = await wixData.query("Partners").eq("uniqueIdentifier", referralData.partnerId).find()
		partnerDetails[0]
		console.log("[masterPage::onReady] partnerDetails:", partnerDetails)

		if (referralData) {
			let contactId = wixUsers.currentUser.id
			let contactDetails = await myGetContactFunction(contactId)
			console.log("[masterPage::onReady] CONTACT DETAILS:", contactDetails)

			let userEmail = contactDetails.primaryInfo.email
			let purchasedProgram
			if (contactDetails.info.labelKeys.includes(programLabel)) {
				purchasedProgram = "HIGH EQ WORKPLACE CULTURE | EMOTIONS101 | $3,600YR *tax included"
			} else {
				purchasedProgram = "Online Program"
			}

			let toInsert = {
				partnerReference: partnerDetails[0]._id,
				email: userEmail,
				purchasedProgram: purchasedProgram
			}

			let isReferralAdded = await wixData.insert("PartnerReferralPurchases", toInsert)

			console.log("[masterPage::onReady] REFERRAL INSERTED:", isReferralAdded)

			local.removeItem("partnerRefferal")

			await notifyAdminHandler(userEmail, purchasedProgram)
			await notifyPartnerHandler(userEmail, purchasedProgram)
		}
	}

	if (query.programId && query.partnerId && path.includes("challenge-page")) {

		isReferral = true
		partnerId = query.partnerId

		local.setItem("partnerRefferal", JSON.stringify({ isReferral: true, partnerId: partnerId }))

	} else {}

	let storedTasks = local.getItem("completedTasks") ? JSON.parse(local.getItem("completedTasks")) : undefined;
	if (storedTasks) {
		// UPDATE USER ACTIVITIES
		taskID = storedTasks.taskID
		userID = storedTasks.userID
		let { items } = await wixData.query("UserActivities").eq("userId", userID).find()
		if (items.length > 0) {
			let userObj = items[0]
			if (userObj.userEngagementsOnTheSite === undefined) {
				userObj.userEngagementsOnTheSite = []
			}
			const currentUrl = wixLocationFrontend.url.split('?')[0]
			if(!userObj.userEngagementsOnTheSite.includes(currentUrl)) {
				userObj.userEngagementsOnTheSite.push(currentUrl)
				let isUserActivityUpdated = await wixData.update("UserActivities", userObj)
				console.log("[masterPage::onReady] USER ACTIVITY UPDATED with userEngagementsOnTheSite:", isUserActivityUpdated)
			} else {
				console.log("[masterPage::onReady] USER ACTIVITY NOT UPDATED with userEngagementsOnTheSite - URL ALREADY EXISTS:", currentUrl)
			}
		}
	}
});

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function button112_click(event) {

	authentication
		.promptLogin({
			mode: 'login',
			modal: true
		})
		.then(() => {
			console.log("[masterPage::button112_click] Member is logged in");
		})
		.catch((error) => {
			console.error("[masterPage::button112_click] Error:", error);
		});

}