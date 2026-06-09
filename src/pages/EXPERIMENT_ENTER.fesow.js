import wixAnimationsFrontend from 'wix-animations-frontend';
import { animateParallel } from './masterPage';

let introInView = true;


$w.onReady(function () {
	// $w("#chicken").customClassList.add("chicken-fixed");
	$w("#sectionIntro").onViewportLeave(() => {
		introInView = false;
	});

	$w("#sectionIntro").onViewportEnter(() => {
		introInView = true;
	});


	// TODO #1: $w('#background').style.filter = "brightness(0.4)";
	console.log('$w.onReady');
    animateChickenToLogo();
	// animateChickenWithLogo();
});

function animationChickenFlyOut() {
	const chicken = $w("#chicken");
	const chickenTimeline = wixAnimationsFrontend.timeline({ repeat: 0 });

	chickenTimeline
		.add(chicken, {
			duration: 1000, //randomDuration,
			x: -300, // + logoDimensions.w/2,
			// rotate: -900, //rotateValue,
			delay: 500, //randomDelay,
			// easing: "easeInOutCubic",
		})
		.play()
		.onComplete(() => {
				console.log("Animation animationChickenFlyOut finished");
		})
}

export async function  animateChickenWithLogo() {
	// a workaround for the 2nd animation being unequal for ETLogo and Chicken:
	// $w("#chicken").hide();
	// $w("#chicken").show();

	const fallY = 350;

	await animateParallel([
		{
			element: $w("#chicken"),
			params: {
				duration: 1000,
				y: Math.round(fallY / 13) - 150 , // TODO: for a strange reaseon, the previous "#chicken" animation causes "#chicken" to move further for the same `y` so we have to normalize it
				delay: 0,
				easing: "easeInOutCubic",
			}
		},
		{
			element: $w("#ETLogo"),
			params: {
				duration: 1000,
				y: fallY, 
				delay: 0,
				easing: "easeInOutCubic",
			}
		}
	]);

	console.log("animations 'animateChickenWithLogo' completed.");
	await $w("#headline").show("fade", { duration: 500 });
	if (introInView) {
    	setTimeout(async () => {
			console.log('$w("#chicken").customClassList [BEFORE]', $w("#chicken").customClassList);
			$w("#chicken").customClassList.add("chicken-fixed");
			// $w("#ETLogo").customClassList.add("chicken-fixed");
			console.log('$w("#chicken").customClassList [AFTER]', $w("#chicken").customClassList);
			await $w("#sectionAboutYou").scrollTo();
			animationChickenFlyOut();
		}, 2500); 
	} else {
		console.log("User scrolled away, skipping auto-scroll to 'sectionAboutYou'");
	}
}

export async function  animateChickenToLogo() {
	const chicken = $w("#chicken");
	console.log(chicken.id, chicken.type);
	const logo = $w("#ETLogo");

	const logoPosition = {x: 444, y: -40};
	const logoDimensions = { w: 391, h: 261};
	const chichenPosition = {x: -246, y: 630};
	/*
	const chichenAnimation1 = {x: -700, y: 100};
	const chichenAnimation1R = {x: 700, y: -100};
	const chichenAnimation2 = {x: logoPosition.x - chichenAnimation1.x - chichenPosition.x, y: logoPosition.y - chichenAnimation1.y - chichenPosition.y};
	*/
	const chichenAnimationL = {x: logoPosition.x - chichenPosition.x, y: logoPosition.y - chichenPosition.y + logoDimensions.h/3};
	console.log("chichenAnimationL", chichenAnimationL);
	/* not working so we have to hardcode it:
	// Get bounding boxes for both elements
	const [chickenRect, logoRect] = await Promise.all([
		chicken.getBoundingRect(),
		logo.getBoundingRect()
	]);
	console.log(chickenRect);
	console.log(logoRect);
	*/

	// const ETLogoPosition = { x: $w('#ETLogo').x, y: $w('#ETLogo').y);
	
	// Create animation timeline:
	const chickenTimeline = wixAnimationsFrontend.timeline({ repeat: 0 });

	//  Add the elements to the timeline, set to play and rerun on completion
	chickenTimeline
		//fly into screen
		// .add(chicken, {
		// 	duration: 2000, //randomDuration,
		// 	x: chichenAnimation1.x,
		// 	y: chichenAnimation1.y,
		// 	rotate: -900, //rotateValue,
		// 	delay: 0, //randomDelay,
		// 	// easing: "easeInOutCubic",
		// })
		// rest of the fly to logo
		// .add(chicken, {
		// 	duration: 1000, //randomDuration,
		// 	x: chichenAnimation2.x,
		// 	y: chichenAnimation2.y,
		// 	// rotate: -900, //rotateValue,
		// 	delay: 1000, //randomDelay,
		// 	// easing: "easeInOutCubic",
		// })
		// fly to logo:
		.add(chicken, {
			duration: 1000, //randomDuration,
			x: chichenAnimationL.x, // + logoDimensions.w/2,
			y: chichenAnimationL.y,
			// rotate: -900, //rotateValue,
			delay: 0, //randomDelay,
			// easing: "easeInOutCubic",
		})
		// fly backward:
		// .add(chicken, {
		// 	duration: 1000, //randomDuration,
		// 	x: chichenAnimation1R.x,
		// 	y: chichenAnimation1R.y,
		// 	// rotate: -900, //rotateValue,
		// 	delay: 1000, //randomDelay,
		// 	// easing: "easeInOutCubic",
		// })
		.play()
		.onComplete(() => {
			// if (i === children.length - 1) {
				console.log("Animation completed, restarting");
				animateChickenWithLogo()
			// }
		})
}