// NOTE:
// Run to install required library
// $ npm i --save bigpicture

/** FRONTEND SCRIPT **/

// Uncomment when adding into the project.
// import domReady from '@wordpress/dom-ready'
// import BigPicture from 'bigpicture'

domReady(() => {
	const elems = document.querySelectorAll(".ugb-video-popup");
	const openVideo = (el) => {
		if (BigPicture) {
			const videoID = el.getAttribute("data-video");
			const args = {
				el,
				noLoader: true
			};
			if (videoID.match(/^\d+$/g)) {
				args["vimeoSrc"] = videoID;
			} else if (videoID.match(/^https?:\/\//g)) {
				args["vidSrc"] = videoID;
			} else {
				args["ytSrc"] = videoID;
			}
			BigPicture(args);
		}
	};
	elems.forEach((el) => {
		const a = el.querySelector("a");
		a.addEventListener("click", (ev) => {
			ev.preventDefault();
			openVideo(el);
		});
		a.addEventListener("touchend", (ev) => {
			ev.preventDefault();
			openVideo(el);
		});
	});
});

/** DO NOT COPY **/
function domReady(fn) {
	if (
		document.attachEvent
			? document.readyState === "complete"
			: document.readyState !== "loading"
	) {
		fn();
	} else {
		document.addEventListener("DOMContentLoaded", fn);
	}
}
