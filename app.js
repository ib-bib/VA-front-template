const userName = "real";
const password = "person";
let userDetails = {};

const modals = document.getElementsByClassName("modalContainer");

const retreiveDatum = async () => {
	const response = await fetch(
		`https://PreciousEducatedKeychanger.ibrahimadil1.repl.co/${userName}/${password}`
	);
	const serializedResponse = await response.json();
	userDetails = serializedResponse;
	assignValues();
};

const computeCertificationCriteriaCompletion = () => {
	const tasks = userDetails.tasks_count;
	const leaderStatus = userDetails.leader;
	const startYear = userDetails.start_date.split("-")[0];
	const currentYear = new Date().getFullYear();
	const volunteeringYears = currentYear - startYear;
	let percentage = 0;
	if (volunteeringYears >= 1 && !leaderStatus && tasks < 3) {
		percentage = 25 + tasks * 25;
	} else if (volunteeringYears >= 1 && !leaderStatus && tasks >= 3) {
		percentage = 100;
	} else if (volunteeringYears >= 1 && leaderStatus) {
		percentage = 100;
	} else if (volunteeringYears < 1 && leaderStatus) {
		const currentMonth = new Date().getMonth();
		const startMonth = userDetails.start_date.split("-")[1];
		const volunteeringMonths = currentMonth - startMonth;
		percentage = 50 + (volunteeringMonths / 12) * 25;
	} else if (volunteeringYears < 1 && !leaderStatus && tasks >= 3) {
		const currentMonth = new Date().getMonth();
		const startMonth = userDetails.start_date.split("-")[1];
		const volunteeringMonths = currentMonth - startMonth;
		percentage = 75 + (volunteeringMonths / 12) * 25;
	} else if (volunteeringYears < 1 && !leaderStatus && tasks < 3) {
		const currentMonth = new Date().getMonth();
		const startMonth = userDetails.start_date.split("-")[1];
		const volunteeringMonths = currentMonth - startMonth;
		percentage = tasks * 25 + (volunteeringMonths / 12) * 25;
	}

	let counter = 0;
	setInterval(() => {
		if (counter == percentage) {
			clearInterval();
		} else {
			counter += 1;
			document.querySelector(
				"#completionValue"
			).innerHTML = `${counter}%`;
		}
	}, 20);

	let cirlcularProgressValue = 440 - (percentage / 100) * 440;
	document.styleSheets.item(0).insertRule(`
	@keyframes sd_ofst {
		100% {
			stroke-dashoffset: ${cirlcularProgressValue};
		}
	}`);
};

const getYellowFlags = () => {
	const yf = userDetails.yellow_flags;
	document.querySelector("#yellowFlagCount").innerHTML = yf;
};

const getRedFlags = () => {
	const rf = userDetails.red_flags;
	document.querySelector("#redFlagCount").innerHTML = rf;
};

const getRequiredRating = () => {
	let rating = 0;
	let flag = "";
	if (userDetails.red_flags > 0) {
		flag = "red";
		rating = 75;
	} else if (userDetails.yellow_flags > 0) {
		flag = "yellow";
		rating = 70;
	} else if (userDetails.yellow_flags == 0 && userDetails.red_flags == 0) {
		document.getElementsByClassName("requiredRating").item(0).innerHTML =
			"You have no flags! Nicely done! Keep up the good work &#128516";
		// The &#128516 is a smiley emoji
		return;
	}
	document.getElementsByClassName("requiredRating").item(0).innerHTML =
		`Next month aim for a rating of ${rating}%` +
		` or higher to remove a ${flag} flag.` +
		`<br />We believe in you! You can do it! &#128170`;
};

const getAverageRating = () => {
	const avgRating = userDetails.rating * 100;
	let cirlcularProgressValue = 200 - userDetails.rating * 200;
	document.styleSheets.item(0).insertRule(`
	@keyframes sd_ofst2 {
		100% {
			stroke-dashoffset: ${cirlcularProgressValue};
		}
	}`);

	let counter = 0;
	setInterval(() => {
		if (counter == avgRating) {
			clearInterval();
		} else {
			counter += 1;
			document.querySelector("#avgRate").innerHTML = `${counter}%`;
		}
	}, 20);
};

const getLastMonthRating = () => {
	const lmr = (userDetails.rating - 0.05) * 100;
	let cirlcularProgressValue = 200 - (lmr / 100) * 200;
	document.styleSheets.item(0).insertRule(`
	@keyframes sd_ofst3 {
		100% {
			stroke-dashoffset: ${cirlcularProgressValue};
		}
	}`);

	let counter = 0;
	setInterval(() => {
		if (counter == lmr) {
			clearInterval();
		} else {
			counter += 1;
			document.querySelector("#latestRate").innerHTML = `${counter}%`;
		}
	}, 20);
};

const getNameANDTeam = () => {
	document.querySelector(
		"#volName"
	).innerHTML = `${userDetails.name} ${userDetails.password}`;
	document.querySelector("#volTeam").innerHTML = `${userDetails.team}`;
};

const assignValues = () => {
	computeCertificationCriteriaCompletion();
	getYellowFlags();
	getRedFlags();
	getAverageRating();
	getLastMonthRating();
	getRequiredRating();
	getNameANDTeam();
};

const displayAccountMenu = () => {
	document.getElementById("accountMenu").classList.toggle("visible");
};

const hamburgerButton = () => {
	document.getElementById("a").classList.toggle("a");
	document.getElementById("b").classList.toggle("c");
	document.getElementById("c").classList.toggle("b");
	displayAccountMenu();
};

const displayModal = modalID => {
	document.getElementById(modalID).classList.add("visible");
	if (modalID == "ratingModal") {
		ratingModal();
	}
};

const ratingModal = () => {
	const lmr = (userDetails.rating - 0.05) * 100;
	const cirlcularProgressValue = 440 - (lmr / 100) * 440;
	document.styleSheets.item(0).insertRule(`
			@keyframes sd_ofst4 {
				100% {
					stroke-dashoffset: ${cirlcularProgressValue};
				}
		}`);
	let counter = 0;
	setInterval(() => {
		if (counter == lmr) {
			clearInterval();
		} else {
			counter += 1;
			document.querySelector(
				"#ratingModalValue"
			).innerHTML = `${counter}%`;
		}
	}, 20);
	if (userDetails.rating >= 0.8) {
		document.querySelector(
			"#ratingModalMSG"
		).innerHTML = `Well Done! &#128515`;
		const jsCnft = new JSConfetti();
		jsCnft.addConfetti().then(() => {
			document.querySelector("#ratingModalDetails").style.display =
				"block";
		});
	} else {
		document.querySelector(
			"#ratingModalMSG"
		).innerHTML = `You can do better! &#128170`;
		setTimeout(() => {
			document.querySelector("#ratingModalDetails").style.display =
				"block";
		}, 2200);
	}
};

window.onclick = e => {
	if (e.target == modals[0]) {
		modals[0].classList.remove("visible");
	}
	if (e.target == modals[1]) {
		modals[1].classList.remove("visible");
	}
	if (e.target == modals[2]) {
		modals[2].classList.remove("visible");
	}
};
