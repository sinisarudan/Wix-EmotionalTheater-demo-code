/** WARNING!!!! NOT VALID CODE!!!!! 
 * this would be a best place for the SHARED CODE,
 * BUT! Wix does not integrate it from here 
 * so we had to invent a workaround and put it to `src/pages/masterPage.js` */

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
