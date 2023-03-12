// const retrieveFlags = async () => {
// 	const res = await fetch("http://localhost:4444/flags");
// 	const jsonRes = await res.json();
// 	document.getElementById("yellowFlagCount").innerHTML = jsonRes.yellow;
// 	document.getElementById("redFlagCount").innerHTML = jsonRes.red;
// };

// const retrieveCriteriaCompletion = async () => {
// 	const res = await fetch("http://localhost:4444/criteria");
// 	const jsonRes = await res.json();
// };

// const retrieveRatings = async () => {
// 	const res = await fetch("http://localhost:4444/rating");
// 	const jsonRes = await res.json();
// 	document.querySelectorAll(".ratingTXT")[0].innerHTML = jsonRes.average;
// 	document.querySelectorAll(".ratingTXT")[1].innerHTML = jsonRes.latest;
// };

// const retrieveData = () => {
// 	retrieveFlags();
// 	retrieveCriteriaCompletion();
// 	retrieveRatings();
// };

// retrieveData();

const userName = "Ibrahim";
const password = "testingAPI123";
let userDetails = {};

const retreiveDatum = async () => {
	const response = await fetch(
		`http://localhost:4444/${userName}/${password}`
	);
	const serializedResponse = await response.json();
	userDetails = serializedResponse.data[0];
	assignValues();
};

const computeCertificationCriteriaCompletion = () => {
	const tasks = userDetails.major_tasks_count;
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
	document.querySelector(".criteriaIcon").innerHTML = `${percentage}%`;
};

const getYellowFlags = () => {
	const yf = userDetails.yellow_flags;
	console.log("Yellow flags:", yf);
};

const getRedFlags = () => {
	const rf = userDetails.red_flags;
	console.log("Red flags:", rf);
};

const getAverageRating = () => {
	const ar = userDetails.rating * 100;
	console.log("Average rating:", `${ar}%`);
};

const getLastMonthRating = () => {
	const lmr = (userDetails.rating - 0.05) * 100;
	console.log(`Last month's rating: ${lmr}%`);
};

const assignValues = () => {
	computeCertificationCriteriaCompletion();
	getYellowFlags();
	getRedFlags();
	getAverageRating();
	getLastMonthRating();
};
