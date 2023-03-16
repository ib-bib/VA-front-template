const userName = "real";
const password = "person";
let userDetails = {};

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

	let cirlcularProgressValue = 440 - (percentage / 100) * 440;
	document.styleSheets.item(0).insertRule(`
	@keyframes sd_ofst {
		100% {
			stroke-dashoffset: ${cirlcularProgressValue};
		}
	}`);

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
		rating = 80;
	} else if (userDetails.yellow_flags > 0) {
		flag = "yellow";
		rating = 75;
	} else if (userDetails.yellow_flags == 0 && userDetails.red_flags == 0) {
		document.getElementsByClassName("requiredRating").item(0).innerHTML =
			"You have no flags! Nicely done! Keep up the good work &#128516";
		// The &#128516 is a smiley emoji
		return;
	}
	document.getElementsByClassName("requiredRating").item(0).innerHTML =
		`Next month aim for a rating of ${rating}%` +
		` or higher <br />to remove a ${flag} flag.` +
		`<br />We believe in you! You can do it!`;
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

const assignValues = () => {
	computeCertificationCriteriaCompletion();
	getYellowFlags();
	getRedFlags();
	getAverageRating();
	getLastMonthRating();
	getRequiredRating();
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
