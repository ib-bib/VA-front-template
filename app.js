const userName = "real";
const password = "person";
let userDetails = {};
let prevRatingsLineChart;
const notifs = {
	total: 5,
	unread: 4,
};

const randomize = arr => {
	let index = Math.floor(Math.random() * arr.length);
	return arr[index];
};

const notificationTemplates = [
	`<div class="notif_card">
        <h5 class="user_activity">
            Event on <strong>DD/MM/YYYY</strong> -
            <strong> Location X </strong>
        </h5>
    </div>`,
	`<div class="notif_card">
        <h5 class="user_activity">
            Meeting today at <strong>X time</strong> - Online
        </h5>
    </div>`,
	`<div class="notif_card">
        <h5 class="user_activity">
            Meeting today at <strong>X time</strong> - <strong>Location Y</strong>
        </h5>
    </div>`,
	`<div class="notif_card">
        <h5 class="user_activity">
            Meeting on <strong>DD/MM/YYYY</strong> at <strong>X time</strong> - <strong>Location Y</strong>
        </h5>
    </div>`,
	`<div class="notif_card">
        <h5 class="user_activity">
            Meeting on <strong>DD/MM/YYYY</strong> at <strong>X time</strong> - Online
        </h5>
    </div>`,
];

const modals = document.getElementsByClassName("modalContainer");
const accountModal = document.getElementById("accountMenu");
const accountBtn = document.getElementById("accountBtn");
const hamburgerButtonIcon = document.getElementById("icon");
const unread = document.getElementById("notificationDot");
const notifPanel = document.getElementById("notificationPanel");
const spearator = document.createElement("hr");
let readMessages, unreadMessages;

const arrangeNotifs = msgID => {
	if (notifs.unread == 0) {
		return;
	}
	const message = document.getElementById(msgID);
	notifPanel.insertBefore(message, readMessages[0]);
	message.classList.remove("unread");
	message.classList.add("read");
	notifs.unread--;
	unread.innerText = notifs.unread;
	readMessages = document.querySelectorAll(".read");
	if (notifs.unread > 0) {
		notifPanel.insertBefore(spearator, readMessages[0]);
	} else {
		unread.style.display = "none";
		spearator.style.display = "none";
	}
};

const loadNotifs = () => {
	for (let i = 0; i < notifs.unread; i++) {
		notifPanel.innerHTML += randomize(notificationTemplates);
		document
			.getElementsByClassName("notif_card")
			[i].classList.add("unread");
		document
			.getElementsByClassName("notif_card")
			[i].setAttribute("id", `msg-${i}`);
	}

	for (let i = notifs.unread; i < notifs.total; i++) {
		notifPanel.innerHTML += randomize(notificationTemplates);
		document.getElementsByClassName("notif_card")[i].classList.add("read");
	}

	unreadMessages = document.querySelectorAll(".unread");
	readMessages = document.querySelectorAll(".read");
	unread.innerText = unreadMessages.length;
	notifPanel.insertBefore(spearator, readMessages[0]);

	unreadMessages.forEach(message => {
		message.addEventListener("click", () => {
			arrangeNotifs(message.getAttribute("id"));
		});
	});
};

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
	accountModal.classList.toggle("visible");
};

const displayNotifs = () => {
	document.getElementById("notificationPanel").classList.toggle("visible");
};

const hamburgerButton = () => {
	document.getElementById("a").classList.toggle("a");
	document.getElementById("b").classList.toggle("c");
	document.getElementById("c").classList.toggle("b");
	displayAccountMenu();
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

const displayModal = modalID => {
	if (modalID == "prevRatingsModal") {
		document.getElementById("ratingModal").classList.remove("visible");
	}
	document.getElementById(modalID).classList.add("visible");
	if (modalID == "ratingModal") {
		ratingModal();
	}
};

const triggerArrowAnimation = () => {
	document
		.getElementById("prevRatingsIcon")
		.classList.toggle("arrowHoverAnim");
};

const loadDataset = () => {
	const ctx = document.getElementById("myChart");
	const year = document.getElementById("year");
	const monthsData = year.value.split(",");
	const yearLabel = year.options[year.selectedIndex].innerHTML;
	const data = {
		labels: [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		],
		datasets: [
			{
				label: yearLabel,
				data: monthsData,
				fill: false,
				borderColor: "#00629b",
			},
		],
	};
	const options = {
		scale: {
			// min: 0,
			max: 100,
		},
	};
	const config = { type: "line", data: data, options };
	if (prevRatingsLineChart) {
		prevRatingsLineChart.destroy();
	}
	prevRatingsLineChart = new Chart(ctx, config);
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
	if (e.target == modals[3]) {
		modals[3].classList.remove("visible");
	}
};
