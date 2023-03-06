import {
	FiFacebook,
	FiGithub,
	FiInstagram,
	FiLinkedin,
	FiTwitter,
} from "react-icons/fi";
import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { IUserHunter } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQueries } from "@tanstack/react-query";
import { useStore } from "@nanostores/react";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { query } = context;

	const { data, error } = await supabase
		.from("user_hunters")
		.select("*")
		.eq("username", query.username)
		.single();

	if (error) {
		return {
			props: {
				targetUser: null,
			},
		};
	}

	return {
		props: {
			targetUser: data as IUserHunter,
		},
	};
};

const DynamicUserPage: NextPage<{ targetUser: IUserHunter }> = ({
	targetUser,
}) => {
	const _currentUser = useStore($accountDetails) as IUserHunter;
	const [isConnected, setIsConnected] = useState(false);
	const [tabSelected, setTabSelected] = useState<
		"about" | "posts" | "experiences" | "education" | "connections"
	>("about");
	const [tabContentRef] = useAutoAnimate();

	const fetchUserConnections = async () => {
		const { data, error } = await supabase
			.from("user_hunters")
			.select("id,username,full_name,avatar_url")
			.in("id", targetUser.connections);

		if (error) {
			console.log(error);
			return [];
		}

		return data;
	};

	const fetchUserActivities = async () => {
		const { data, error } = await supabase
			.from("public_posts")
			.select("*")
			.eq("uploader", targetUser.id);

		if (error) {
			console.log(error);
			return [];
		}

		return data;
	};

	const [userConnections, userActivities] = useQueries({
		queries: [
			{
				queryKey: ["userConnections"],
				queryFn: fetchUserConnections,
				enabled: !!targetUser,
				refetchOnWindowFocus: false,
			},
			{
				queryKey: ["userActivities"],
				queryFn: fetchUserActivities,
				enabled: !!targetUser,
				refetchOnWindowFocus: false,
			},
		],
	});

	const addToConnections = async () => {
		toast.loading("Adding connection...");

		const newConnections = [..._currentUser.connections, targetUser.id];

		// update the user table
		const { error } = await supabase
			.from("user_hunters")
			.update({
				connections: newConnections,
			})
			.eq("id", _currentUser.id)
			.select("*");

		if (error) {
			toast.dismiss();
			toast.error("Something went wrong");
			console.log(error);
			return;
		}

		// update local user global state
		$accountDetails.set({
			..._currentUser,
			connections: newConnections,
		});

		// update the supabase user
		await supabase.auth.updateUser({
			data: {
				connections: newConnections,
			},
		});

		// update the state
		setIsConnected(true);

		toast.dismiss();
		toast.success("Connection added");
	};

	const removeFromConnections = async () => {
		toast.loading("Removing connection...");

		const newConnections = _currentUser.connections.filter(
			(id) => id !== targetUser.id,
		);

		// update the user table
		const { error } = await supabase
			.from("user_hunters")
			.update({
				connections: newConnections,
			})
			.eq("id", _currentUser.id)
			.select("*");

		if (error) {
			toast.dismiss();
			toast.error("Something went wrong");
			console.log(error);
			return;
		}

		// update local user global state
		$accountDetails.set({
			..._currentUser,
			connections: newConnections,
		});

		// update the supabase user
		await supabase.auth.updateUser({
			data: {
				connections: newConnections,
			},
		});

		// update the state
		setIsConnected(false);

		toast.dismiss();
		toast.success("Connection removed");
	};

	useEffect(() => {
		if (!!_currentUser && _currentUser.connections.includes(targetUser.id)) {
			setIsConnected(true);
		}
	}, [_currentUser, targetUser]);

	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-24 pb-36"
			>
				<section className="grid grid-cols-1 lg:grid-cols-5 gap-5">
					<div className="col-span-3 flex flex-col gap-3">
						{/* landing profile */}
						<div className="flex sm:items-center gap-5 flex-col sm:flex-row bg-base-200 rounded-btn p-5">
							<div className="relative">
								<Image
									src={targetUser.avatar_url}
									alt="avatar"
									className="w-32 h-32 bg-primary mask mask-squircle object-cover object-center "
									width={128}
									height={128}
								/>

								{targetUser.subscription_type === "junior" && (
									<div className="badge badge-primary absolute bottom-1 sm:-right-5">
										Junior
									</div>
								)}
								{targetUser.subscription_type === "senior" && (
									<div className="badge badge-primary absolute bottom-1 -right-5">
										Senior
									</div>
								)}
								{targetUser.subscription_type === "expert" && (
									<div className="badge badge-primary absolute bottom-1 -right-5">
										Expert
									</div>
								)}
							</div>
							<div>
								<p className="text-3xl font-bold">
									{targetUser.full_name.first} {targetUser.full_name.last}
								</p>

								<p className="font-semibold opacity-75">
									@{targetUser.username}
								</p>
								<p>
									Joined at:{" "}
									<span className="opacity-50">
										{dayjs(targetUser.created_at).format("MMMM DD, YYYY")}
									</span>
								</p>
							</div>
						</div>

						{/* mobile select */}
						<div className="lg:hidden">
							<select
								value={tabSelected}
								onChange={(e) =>
									setTabSelected(
										e.currentTarget.value as
											| "about"
											| "posts"
											| "experiences"
											| "education",
									)
								}
								className="select select-primary w-full"
							>
								<option value="about">About</option>
								<option value="posts">Posts</option>
								<option value="experiences">Experiences</option>
								<option value="education">Education</option>
							</select>
						</div>
						{/* desktop tabs */}
						<div className="hidden lg:block my-3">
							<ul className="tabs tabs-boxed gap-1">
								<li
									onClick={() => setTabSelected("about")}
									className={`tab ${tabSelected === "about" && "tab-active"}`}
								>
									About
								</li>
								<li
									onClick={() => setTabSelected("posts")}
									className={`tab ${tabSelected === "posts" && "tab-active"}`}
								>
									Posts
								</li>
								<li
									onClick={() => setTabSelected("experiences")}
									className={`tab ${
										tabSelected === "experiences" && "tab-active"
									}`}
								>
									Experiences
								</li>
								<li
									onClick={() => setTabSelected("education")}
									className={`tab ${
										tabSelected === "education" && "tab-active"
									}`}
								>
									Education
								</li>
							</ul>
						</div>

						<div className="py-5" ref={tabContentRef}>
							{tabSelected === "about" && (
								<div className="flex flex-col gap-2">
									{/* bio */}
									<div className="flex flex-col shadow-md rounded-btn p-5 gap-3">
										<div className="flex justify-between items-start">
											<p className="text-2xl font-bold">Bio</p>
										</div>

										<ReactMarkdown className="prose">
											{targetUser.bio || "This user has not added a bio yet"}
										</ReactMarkdown>
									</div>
									{/* skills */}
									<div className="flex flex-col shadow-md rounded-btn p-5 gap-3">
										<p className="text-2xl font-bold">Skillsets</p>
										<div className="flex flex-col">
											<h4 className="text-lg font-semibold">Primary Skill</h4>
											<p className="badge badge-primary badge-lg">
												{targetUser.skill_primary}
											</p>
										</div>
										<div className="flex flex-col">
											<h4 className="text-lg font-semibold">
												Secondary Skills
											</h4>
											<p className="flex flex-wrap gap-2">
												{targetUser.skill_secondary.map((skill, index) => (
													<span
														key={`secondaryskill_${index}`}
														className="badge badge-accent badge-lg"
													>
														{skill}
													</span>
												))}
											</p>
										</div>
									</div>
									{/* residence */}
									<div className="flex flex-col shadow-md rounded-btn p-5 gap-3">
										<p className="text-2xl font-bold">Residence</p>
										<div className="flex flex-col ">
											<p>
												{targetUser.address.address}, {targetUser.address.city}{" "}
												- {targetUser.address.postalCode}
											</p>
										</div>
									</div>
									{/* socials */}
									<div className="flex flex-col shadow-md rounded-btn p-5 gap-3">
										<p className="text-2xl font-bold">Social Media Links</p>
										<div className="flex flex-wrap gap-2">
											{targetUser.social_media_links.facebook && (
												<Link
													href={targetUser.social_media_links.facebook}
													target="_blank"
													rel="noopener noreferrer"
													className="btn btn-primary"
												>
													<FiFacebook className="text-xl" />
												</Link>
											)}
											{targetUser.social_media_links.twitter && (
												<Link
													href={targetUser.social_media_links.twitter}
													target="_blank"
													rel="noopener noreferrer"
													className="btn btn-primary"
												>
													<FiTwitter className="text-xl" />
												</Link>
											)}
											{targetUser.social_media_links.instagram && (
												<Link
													href={targetUser.social_media_links.instagram}
													target="_blank"
													rel="noopener noreferrer"
													className="btn btn-primary"
												>
													<FiInstagram className="text-xl" />
												</Link>
											)}
											{targetUser.social_media_links.linkedin && (
												<Link
													href={targetUser.social_media_links.linkedin}
													target="_blank"
													rel="noopener noreferrer"
													className="btn btn-primary"
												>
													<FiLinkedin className="text-xl" />
												</Link>
											)}
											{targetUser.social_media_links.github && (
												<Link
													href={targetUser.social_media_links.github}
													target="_blank"
													rel="noopener noreferrer"
													className="btn btn-primary"
												>
													<FiGithub className="text-xl" />
												</Link>
											)}
										</div>
									</div>
								</div>
							)}
							{tabSelected === "posts" && (
								<div className="flex flex-col gap-2">
									{userActivities.isSuccess &&
										userActivities.data.map((activity, index) => (
											<Link
												key={`blogpost_${index}`}
												href={`/h/feed/${activity.id}`}
											>
												<div
													key={`activity_${index}`}
													className="relative flex gap-2 items-center justify-between overflow-hidden p-5 border-2 border-primary border-opacity-10 hover:border-opacity-100 transition rounded-btn"
												>
													<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-base-100" />
													<ReactMarkdown className="prose prose-sm h-[100px] ">
														{`${activity.content.substring(0, 300)}`}
													</ReactMarkdown>
												</div>
											</Link>
										))}

									{userActivities.isSuccess &&
										userActivities.data.length === 0 && (
											<p className="text-center">No activities yet</p>
										)}

									{userActivities.isLoading &&
										Array(5)
											.fill("")
											.map((_, index) => (
												<div
													key={`activityloading_${index}`}
													className="h-[72px] w-full bg-base-300 rounded-btn animate-pulse"
												/>
											))}
								</div>
							)}
							{tabSelected === "experiences" && (
								<div className="flex flex-col gap-2">
									{targetUser.experience.length === 0 && (
										<p className="text-center">No employment history yet</p>
									)}
									{targetUser.experience.map((exp, i) => (
										<div
											key={`expereince_${i}`}
											className="shadow-md rounded-btn p-5"
										>
											<p className="text-lg">
												{exp.jobPosition} - {exp.companyName}
											</p>
											<p>{exp.location}</p>
											<p className="mt-2 text-sm opacity-75">
												{exp.startDate} -{" "}
												{exp.isCurrent ? "Present" : exp.endDate}
											</p>
										</div>
									))}
								</div>
							)}
							{tabSelected === "education" && (
								<div className="flex flex-col gap-2">
									{targetUser.education.length === 0 && (
										<p className="text-center">No education history yet</p>
									)}
									{targetUser.education.map((edu, i) => (
										<div
											key={`education_${i}`}
											className="shadow-md rounded-btn p-5"
										>
											<p className="text-lg">
												<span className="capitalize">{edu.degreeType}</span> -{" "}
												{edu.institution}
											</p>
											<p>{edu.location}</p>
											{edu.degreeName && (
												<p className="mt-2 text-sm opacity-75">
													{edu.degreeName}
												</p>
											)}
											<p className="mt-2 text-sm opacity-75">
												{edu.yearGraduated}
											</p>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					{/* second column */}
					<div className="col-span-2 flex flex-col gap-5">
						<div className="flex flex-col rounded-btn p-2 gap-3">
							<p className="text-2xl font-bold">Connections</p>

							{userConnections.isLoading && (
								<div className="flex flex-col gap-2">
									{Array(5)
										.fill("")
										.map((_, index) => (
											<div
												style={{
													animationDelay: `${index * 50}ms`,
													animationDuration: "1s",
												}}
												key={`connectionloading_${index}`}
												className="h-[50px] w-full bg-zinc-500/50 rounded-btn animate-pulse "
											/>
										))}
								</div>
							)}

							{userConnections.isSuccess && (
								<div className="flex flex-col gap-2">
									{userConnections.data.length < 1 && (
										<p>
											Looks like you have not connected to other people right
											now. Add people to your connections to see their posts and
											activities.
										</p>
									)}
								</div>
							)}

							{userConnections.isSuccess &&
								userConnections.data.length > 0 &&
								userConnections.data.slice(0, 3).map((connection, index) => (
									<Link
										href={`/h/${connection.username}`}
										key={`connection_${index}`}
										className="flex gap-2 items-center justify-between p-3 bg-base-200 hover:bg-base-300 transition-all rounded-btn"
									>
										<div className="flex gap-2 items-center">
											<Image
												src={connection.avatar_url}
												alt="avatar"
												className="w-12 h-12 mask mask-squircle bg-primary object-center object-cover"
												width={48}
												height={48}
											/>
											<div>
												<p className="font-bold leading-none">
													{connection.full_name.first}{" "}
													{connection.full_name.last}
												</p>
												<p className="opacity-50 leading-none">
													@{connection.username}
												</p>
											</div>
										</div>
									</Link>
								))}
						</div>

						<div className="p-5">
							<p className="text-2xl font-bold">Actions</p>

							<div className="flex gap-2 mt-4">
								{isConnected ? (
									<button
										disabled={userConnections.isLoading}
										onClick={removeFromConnections}
										className="btn btn-warning"
									>
										Remove from connections
									</button>
								) : (
									<button
										disabled={userConnections.isLoading}
										onClick={addToConnections}
										className="btn btn-primary"
									>
										Add @{targetUser.username} to your connections
									</button>
								)}
							</div>
						</div>
					</div>
				</section>
			</motion.main>
		</>
	);
};

export default DynamicUserPage;
