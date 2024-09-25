import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayer from "./Prayer";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ar-dz";
moment.locale("ar");

export default function MainContent() {
	// STATES
	const [nextPrayerIndex, setNextPrayerIndex] = useState(2);
	const [timings, setTimings] = useState({
		Fajr: "04:20",
		Dhuhr: "11:50",
		Asr: "15:18",
		Sunset: "18:03",
		Isha: "19:33",
	});

	const [remainingTime, setRemainingTime] = useState("");

	const [selectedCity, setSelectedCity] = useState({
		displayName: "العقبة",
		apiName: "Aqaba",
	});

	const [today, setToday] = useState("");

	const avilableCities = [
		{
			displayName: "العقبة",
			apiName: "Aqaba",
		},
		{
			displayName: "الكرك",
			apiName: "Karak",
		},
		{
			displayName: "عمان",
			apiName: "Amman",
		},
	];

	const prayersArray = [
		{ key: "Fajr", displayName: "الفجر" },
		{ key: "Dhuhr", displayName: "الظهر" },
		{ key: "Asr", displayName: "العصر" },
		{ key: "Sunset", displayName: "المغرب" },
		{ key: "Isha", displayName: "العشاء" },
	];

	const getTimings = async () => {
		console.log("calling the api");
		const response = await axios.get(
			`https://api.aladhan.com/v1/timingsByCity?country=JO&city=${selectedCity.apiName}`
		);
		setTimings(response.data.data.timings);
	};

	useEffect(() => {
		getTimings();
	}, [selectedCity]);

	useEffect(() => {
		let interval = setInterval(() => {
			console.log("calling timer");
			setupCountdownTimer();
		}, 1000);

		const t = moment();
		setToday(t.format("MMM Do YYYY | h:mm"));

		return () => {
			clearInterval(interval);
		};
	}, [timings]);

	const setupCountdownTimer = () => {
		const momentNow = moment();

		let prayerIndex = 2;

		if (
			momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
		) {
			prayerIndex = 1;
		} else if (
			momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
		) {
			prayerIndex = 2;
		} else if (
			momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Sunset"], "hh:mm"))
		) {
			prayerIndex = 3;
		} else if (
			momentNow.isAfter(moment(timings["Sunset"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
		) {
			prayerIndex = 4;
		} else {
			prayerIndex = 0;
		}

		setNextPrayerIndex(prayerIndex);

		const nextPrayerObject = prayersArray[prayerIndex];
		const nextPrayerTime = timings[nextPrayerObject.key];
		const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

		let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

		if (remainingTime < 0) {
			const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
			const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
				moment("00:00:00", "hh:mm:ss")
			);

			const totalDiffernce = midnightDiff + fajrToMidnightDiff;

			remainingTime = totalDiffernce;
		}
		console.log(remainingTime);

		const durationRemainingTime = moment.duration(remainingTime);

		setRemainingTime(
			`${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
		);
		console.log(
			"duration issss ",
			durationRemainingTime.hours(),
			durationRemainingTime.minutes(),
			durationRemainingTime.seconds()
		);
	};

	const handleCityChange = (event) => {
		const cityObject = avilableCities.find((city) => {
			return city.apiName == event.target.value;
		});
		console.log("the new value is ", event.target.value);
		setSelectedCity(cityObject);
	};

	return (
		<>
			{/* TOP ROW */}
			<Grid container>
				<Grid xs={6}>
					<div>
						<h2>{today}</h2>
						<h1>{selectedCity.displayName}</h1>
					</div>
				</Grid>

				<Grid xs={6}>
					<div>
						<h2>
							متبقي حتى صلاة{" "}
							{prayersArray[nextPrayerIndex].displayName}
						</h2>
						<h1>{remainingTime}</h1>
					</div>
				</Grid>
			</Grid>
			{/*== TOP ROW ==*/}

			<Divider style={{ borderColor: "white", opacity: "0.1" }} />

			{/* PRAYERS CARDS */}
			<Stack
				direction="row"
				justifyContent={"space-around"}
				style={{ marginTop: "50px" }}
			>
				<Prayer
					name="الفجر"
					time={timings.Fajr}
					image="https://content.wepik.com/statics/12651523/preview-page0.jpg"
				/>
				<Prayer
					name="الظهر"
					time={timings.Dhuhr}
					image="data:image/jpeg;base64,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"
				/>
				<Prayer
					name="العصر"
					time={timings.Asr}
					image="https://media.wnyc.org/i/800/0/h/85/1/160924154.jpg"
				/>
				<Prayer
					name="المغرب"
					time={timings.Sunset}
					image="https://content.wepik.com/statics/302683703/preview-page0.jpg"
				/>
				<Prayer
					name="العشاء"
					time={timings.Isha}
					image="http://t1.gstatic.com/licensed-image?q=tbn:ANd9GcRtJ7JviW9mSupqCKCOm-npHIRvuHyUMPs5jsIUCiLWke0S-q3qFNdk6RzG49sI7xqyMPtkXrZUc4YxuwxytO8"
				/>
			</Stack>
			{/*== PRAYERS CARDS ==*/}

			{/* SELECT CITY */}
			<Stack
				direction="row"
				justifyContent={"center"}
				style={{ marginTop: "40px" }}
			>
				<FormControl style={{ width: "20%" }}>
					<InputLabel id="demo-simple-select-label">
						<span style={{ color: "white" }}>المدينة</span>
					</InputLabel>
					<Select
						style={{ color: "white" }}
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						label="المدينة"
						onChange={handleCityChange}
					>
						{avilableCities.map((city) => {
							return (
								<MenuItem
									value={city.apiName}
									key={city.apiName}
								>
									{city.displayName}
								</MenuItem>
							);
						})}
					</Select>
				</FormControl>
			</Stack>
		</>
	);
}
